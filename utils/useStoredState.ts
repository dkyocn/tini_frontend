import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage에 JSON으로 저장되는 state.
 * 처음엔 defaultValue로 시작하고, 저장된 값이 있으면 불러와 덮어씀.
 * (마이페이지 알림 설정 / 템플릿 설정처럼 아직 서버 API가 없는 로컬 설정용)
 */
export default function useStoredState<T extends object>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(key)
      .then(raw => {
        if (!cancelled && raw) {
          setValue(prev => ({...prev, ...JSON.parse(raw)}));
        }
      })
      .catch(error => console.error(`${key} 불러오기 실패:`, error));
    return () => {
      cancelled = true;
    };
  }, [key]);

  const update = useCallback(
    (patch: Partial<T>) => {
      setValue(prev => {
        const next = {...prev, ...patch};
        AsyncStorage.setItem(key, JSON.stringify(next)).catch(error =>
          console.error(`${key} 저장 실패:`, error),
        );
        return next;
      });
    },
    [key],
  );

  return [value, update] as const;
}
