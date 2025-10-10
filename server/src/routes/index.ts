import { Router } from 'express';
import {
  wifiStatus,
  wifiToggle,
  wifiNetworks,
  bluetoothStatus,
  bluetoothToggle,
  bluetoothDevices
} from '../controllers/networkController';
import { systemInfo } from '../controllers/systemController';
import { getSensors } from '../controllers/sensorController';
import {
  createTerrariumHandler,
  deleteTerrariumHandler,
  getTerrariumHandler,
  listTerrariumHandler,
  updateTerrariumHandler
} from '../controllers/terrariumController';
import { loginHandler, refreshHandler } from '../controllers/authController';
import { listSettings, updateSetting } from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

export const apiRouter = Router();

apiRouter.post('/auth/login', asyncHandler(loginHandler));
apiRouter.post('/auth/refresh', asyncHandler(refreshHandler));

apiRouter.get('/wifi/status', authenticate, asyncHandler(wifiStatus));
apiRouter.post('/wifi/toggle', authenticate, asyncHandler(wifiToggle));
apiRouter.get('/wifi/networks', authenticate, asyncHandler(wifiNetworks));

apiRouter.get('/bluetooth/status', authenticate, asyncHandler(bluetoothStatus));
apiRouter.post('/bluetooth/toggle', authenticate, asyncHandler(bluetoothToggle));
apiRouter.get('/bluetooth/devices', authenticate, asyncHandler(bluetoothDevices));

apiRouter.get('/system/info', authenticate, asyncHandler(systemInfo));
apiRouter.get('/sensors', authenticate, asyncHandler(getSensors));

apiRouter.get('/terrariums', authenticate, asyncHandler(listTerrariumHandler));
apiRouter.get('/terrariums/:id', authenticate, asyncHandler(getTerrariumHandler));
apiRouter.post('/terrariums', authenticate, asyncHandler(createTerrariumHandler));
apiRouter.put('/terrariums/:id', authenticate, asyncHandler(updateTerrariumHandler));
apiRouter.delete('/terrariums/:id', authenticate, asyncHandler(deleteTerrariumHandler));

apiRouter.get('/settings', authenticate, asyncHandler(listSettings));
apiRouter.post('/settings', authenticate, asyncHandler(updateSetting));
