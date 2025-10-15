import { env } from '../config/env';
import { logger } from '../utils/logger';
import { readGpioLine, writeGpioLine } from '../lib/hardware';

export interface RelayState {
  pin: number;
  value: 0 | 1;
}

class RelayManager {
  private readonly pins = new Set<number>(env.GPIO_RELAY_PINS);

  private readonly chip = env.GPIO_CHIP;

  public async readStates(): Promise<RelayState[]> {
    if (this.pins.size === 0) {
      return [];
    }

    const states: RelayState[] = [];
    for (const pin of this.pins) {
      try {
        const value = await readGpioLine(pin, { chip: this.chip });
        states.push({ pin, value });
      } catch (error) {
        logger.warn({ err: error, pin }, `Lecture du GPIO ${pin} indisponible.`);
      }
    }
    return states;
  }

  public async setState(pin: number, value: 0 | 1): Promise<void> {
    if (!this.pins.has(pin)) {
      throw new Error(`GPIO ${pin} non enregistré dans la configuration.`);
    }
    try {
      await writeGpioLine(pin, value, { chip: this.chip });
    } catch (error) {
      logger.error({ err: error, pin, value }, `Écriture sur le GPIO ${pin} échouée.`);
      throw error;
    }
  }
}

const relayManager = new RelayManager();

export const readRelayStates = (): Promise<RelayState[]> => relayManager.readStates();

export const setRelayState = (pin: number, value: 0 | 1): Promise<void> => relayManager.setState(pin, value);
