import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSettings, useUpdateSetting } from '../api/hooks';

interface PersistedSettingOptions<T> {
  key: string;
  defaultValue: T;
  enabled?: boolean;
}

export const usePersistedSetting = <T,>({ key, defaultValue, enabled = true }: PersistedSettingOptions<T>) => {
  const settingsQuery = useSettings(enabled);
  const updateSetting = useUpdateSetting();
  const queryClient = useQueryClient();
  const [state, setState] = useState<T>(defaultValue);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (settingsQuery.isError) {
      setLoadError(settingsQuery.error?.message ?? 'Chargement des paramètres impossible.');
      return;
    }

    if (!settingsQuery.data) {
      return;
    }

    setLoadError(null);
    const existing = settingsQuery.data.find((setting) => setting.key === key);
    if (existing && existing.value !== undefined) {
      setState(existing.value as T);
    } else {
      setState(defaultValue);
    }
  }, [settingsQuery.data, settingsQuery.isError, settingsQuery.error, key, defaultValue, enabled]);

  const save = useCallback(
    async (value: T = state) => {
      if (!enabled) {
        return;
      }
      setSaveError(null);
      try {
        await updateSetting.mutateAsync({ key, value });
        await queryClient.invalidateQueries({ queryKey: ['settings'] });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Échec de la sauvegarde du paramètre.';
        setSaveError(message);
        throw error;
      }
    },
    [enabled, key, queryClient, state, updateSetting]
  );

  const reset = useCallback(() => {
    setState(defaultValue);
  }, [defaultValue]);

  return useMemo(
    () => ({
      state,
      setState,
      save,
      reset,
      settingsQuery,
      updateSetting,
      isSaving: updateSetting.isPending,
      saveError,
      loadError
    }),
    [loadError, save, saveError, settingsQuery, state, updateSetting, reset]
  );
};

export type UsePersistedSettingReturn<T> = ReturnType<typeof usePersistedSetting<T>>;
