import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import {
  BluetoothDevicesResponse,
  BluetoothStatusResponse,
  fetchBluetoothDevices,
  fetchBluetoothStatus,
  fetchSensors,
  fetchSettings,
  fetchSystemInfo,
  fetchTerrariums,
  fetchWifiNetworks,
  fetchWifiStatus,
  SensorValue,
  SettingDto,
  SystemInfo,
  TerrariumDto,
  TerrariumInput,
  toggleBluetooth,
  toggleWifi,
  updateSettingRequest,
  createTerrariumRequest,
  updateTerrariumRequest,
  deleteTerrariumRequest,
  WifiNetwork,
  WifiStatusResponse,
  connectWifiNetwork,
  WifiConnectionResponse,
  fetchRelayStates,
  RelayListResponse,
  updateRelayStateRequest,
  RelayStateDto
} from './controlCenter';
import { useAuth } from '../providers/AuthProvider';

type QueryResult<T> = ReturnType<typeof useQuery<T, Error>>;

type MutationResult<TData, TVariables> = ReturnType<
  typeof useMutation<TData, Error, TVariables>
>;

const useAuthorizedQuery = <TQueryFnData>(
  key: unknown[],
  query: (token: string) => Promise<TQueryFnData>,
  options?: Omit<UseQueryOptions<TQueryFnData, Error, TQueryFnData, unknown[]>, 'queryKey' | 'queryFn'>
): QueryResult<TQueryFnData> => {
  const { ensureFreshToken, isAuthenticated } = useAuth();
  return useQuery<TQueryFnData, Error>({
    queryKey: key,
    queryFn: async () => {
      const token = await ensureFreshToken();
      if (!token) {
        throw new Error('Utilisateur non authentifié');
      }
      return query(token);
    },
    enabled: isAuthenticated && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime ?? 10_000
  });
};

const useAuthorizedMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables, token: string) => Promise<TData>,
  options?: UseMutationOptions<TData, Error, TVariables>
): MutationResult<TData, TVariables> => {
  const { ensureFreshToken } = useAuth();
  return useMutation<TData, Error, TVariables>({
    ...options,
    mutationFn: async (variables: TVariables) => {
      const token = await ensureFreshToken();
      if (!token) {
        throw new Error('Utilisateur non authentifié');
      }
      return mutationFn(variables, token);
    }
  });
};

export const useWifiStatus = (): QueryResult<WifiStatusResponse> =>
  useAuthorizedQuery(['wifi', 'status'], fetchWifiStatus);

export const useWifiNetworks = (enabled = true): QueryResult<WifiNetwork[]> =>
  useAuthorizedQuery(['wifi', 'networks'], fetchWifiNetworks, { staleTime: 30_000, enabled });

export const useToggleWifi = (): MutationResult<WifiStatusResponse, boolean> =>
  useAuthorizedMutation((enabled, token) => toggleWifi(token, enabled));

export const useConnectWifi = (): MutationResult<WifiConnectionResponse, { ssid: string; password?: string }> =>
  useAuthorizedMutation((payload, token) => connectWifiNetwork(token, payload.ssid, payload.password));

export const useBluetoothStatus = (): QueryResult<BluetoothStatusResponse> =>
  useAuthorizedQuery(['bluetooth', 'status'], fetchBluetoothStatus);

export const useToggleBluetooth = (): MutationResult<BluetoothStatusResponse, boolean> =>
  useAuthorizedMutation((powered, token) => toggleBluetooth(token, powered));

export const useBluetoothDevices = (): QueryResult<BluetoothDevicesResponse> =>
  useAuthorizedQuery(['bluetooth', 'devices'], fetchBluetoothDevices, { staleTime: 60_000 });

export const useSystemInfo = (): QueryResult<SystemInfo> =>
  useAuthorizedQuery(['system', 'info'], fetchSystemInfo, { refetchInterval: 10_000 });

export const useSensors = (): QueryResult<SensorValue[]> =>
  useAuthorizedQuery(['sensors'], fetchSensors, { refetchInterval: 15_000, staleTime: 5000 });

export const useTerrariums = (): QueryResult<TerrariumDto[]> =>
  useAuthorizedQuery(['terrariums'], fetchTerrariums, { staleTime: 5000 });

export const useCreateTerrarium = (): MutationResult<TerrariumDto, TerrariumInput> =>
  useAuthorizedMutation((payload, token) => createTerrariumRequest(token, payload));

export const useUpdateTerrarium = (): MutationResult<TerrariumDto, { id: string; data: TerrariumInput }> =>
  useAuthorizedMutation(({ id, data }, token) => updateTerrariumRequest(token, id, data));

export const useDeleteTerrarium = (): MutationResult<void, string> =>
  useAuthorizedMutation((id, token) => deleteTerrariumRequest(token, id));

export const useSettings = (enabled = true): QueryResult<SettingDto[]> =>
  useAuthorizedQuery(['settings'], fetchSettings, { staleTime: 60_000, enabled });

export const useUpdateSetting = (): MutationResult<SettingDto, { key: string; value: unknown }> =>
  useAuthorizedMutation(({ key, value }, token) => updateSettingRequest(token, key, value));

export const useRelayStates = (): QueryResult<RelayListResponse> =>
  useAuthorizedQuery(['gpio', 'relays'], fetchRelayStates, { refetchInterval: 10_000, staleTime: 5000 });

export const useUpdateRelayState = (): MutationResult<RelayStateDto, { pin: number; value: 0 | 1 }> =>
  useAuthorizedMutation(({ pin, value }, token) => updateRelayStateRequest(token, pin, value));
