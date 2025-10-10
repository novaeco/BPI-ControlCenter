import { Gpio } from 'onoff';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export interface RelayState {
  pin: number;
  value: 0 | 1;
}

class RelayManager {
  private readonly relays = new Map<number, Gpio>();

  private readonly accessible: boolean;

  constructor() {
    this.accessible = typeof Gpio !== 'undefined' && Gpio.accessible;

    if (!this.accessible) {
      logger.warn('GPIO non accessibles sur cette plateforme. Gestion des relais désactivée.');
      return;
    }

    const cleanup = () => {
      for (const gpio of this.relays.values()) {
        try {
          gpio.unexport();
        } catch (error) {
          logger.error({ err: error }, 'Impossible de libérer un GPIO.');
        }
      }
      this.relays.clear();
    };

    process.once('SIGINT', cleanup);
    process.once('SIGTERM', cleanup);
    process.once('exit', cleanup);

    for (const pin of env.GPIO_RELAY_PINS) {
      try {
        const gpio = new Gpio(pin, 'out');
        this.relays.set(pin, gpio);
      } catch (error) {
        logger.error({ err: error, pin }, `Initialisation du GPIO ${pin} échouée.`);
      }
    }
  }

  public async readStates(): Promise<RelayState[]> {
    if (!this.accessible || this.relays.size === 0) {
      return [];
    }

    const states: RelayState[] = [];

    for (const [pin, gpio] of this.relays.entries()) {
      try {
        const value = (await gpio.read()) as 0 | 1;
        states.push({ pin, value });
      } catch (error) {
        logger.error({ err: error, pin }, `Lecture du GPIO ${pin} échouée.`);
      }
    }

    return states;
  }

  public async setState(pin: number, value: 0 | 1): Promise<void> {
    if (!this.accessible) {
      throw new Error('GPIO non accessibles sur cette plateforme.');
    }

    const gpio = this.relays.get(pin);
    if (!gpio) {
      throw new Error(`GPIO ${pin} non enregistré dans la configuration.`);
    }

    await gpio.write(value);
  }
}

const relayManager = new RelayManager();

export const readRelayStates = (): Promise<RelayState[]> => relayManager.readStates();

export const setRelayState = (pin: number, value: 0 | 1): Promise<void> => relayManager.setState(pin, value);
