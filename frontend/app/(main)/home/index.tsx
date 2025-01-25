import { Text, Pressable } from "react-native";
import React from "react";
import { useAuth } from "@/context/useAuth";
import { ScreenView } from "@/components/ScreenView";

export default function HomeScreen() {
  const { onLogout } = useAuth();
  const handleLogout = async () => {
    await onLogout();
  };
  return (
    <ScreenView>
      <Text>HomeScreen</Text>
      <Pressable onPress={() => handleLogout()}>
        <Text>Kirjaudu ulos</Text>
      </Pressable>
    </ScreenView>
  );
}
