import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "@/context/useAuth";
import { ScreenView } from "@/components/ScreenView";
import { useLoading } from "@/context/useLoading";

export default function HomeScreen() {
  const { onLogout } = useAuth();
  const handleLogout = async () => {
    await onLogout();
  };
  return (
    <ScreenView>
      <Text>HomeScreenHomeScreenHomeScreen</Text>
      <Pressable onPress={() => handleLogout()}>
        <Text>Kirjaudu ulos</Text>
      </Pressable>
    </ScreenView>
  );
}
