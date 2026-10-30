import { useRef, useState } from "react";
import Storage from "expo-sqlite/kv-store";
import { Alert } from "react-native";

export function useStoredState<T>(key: string, initial: T) {
  const [state, render] = useState<T>(() => {
    const raw = Storage.getItemSync(key);
    return raw === null ? initial : JSON.parse(raw) as T;
  });
  const current = useRef(state);
  function update(next: T | ((previous: T) => T)): boolean {
    try {
      const value = typeof next === "function" ? (next as (previous: T) => T)(current.current) : next;
      Storage.setItemSync(key, JSON.stringify(value));
      current.current = value;
      render(value);
      return true;
    } catch {
      Alert.alert("Saqlanmadi", "Qurilmaga yozib bo‘lmadi. Amal bajarilmadi; bo‘sh xotirani tekshirib qayta urinib ko‘ring.");
      return false;
    }
  }
  return [state, update] as const;
}
