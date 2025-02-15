import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { useCallback, useEffect, useReducer } from "react";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return useReducer(
    (_: [boolean, T | null], action: T | null = null): [boolean, T | null] => [
      false,
      action,
    ],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  value == null ? await deleteItemAsync(key) : await setItemAsync(key, value);
}
export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    getItemAsync(key)
      .then((value) => {
        setState(value);
      })
      .catch((error: any) => {
        console.log("Error: ", error);
      });
  }, [key]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
