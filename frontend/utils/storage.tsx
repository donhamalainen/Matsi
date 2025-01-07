import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

// SET
export async function setStorageItemAsync(key: string, value: string | null) {
  value == null ? await deleteItemAsync(key) : await setItemAsync(key, value);
}

// GET
export async function getStorageItemAsync(key: string): Promise<string | null> {
  return await getItemAsync(key);
}

// DELETE
export async function deleteStorageItemAsync(key: string): Promise<void> {
  await deleteItemAsync(key);
}
