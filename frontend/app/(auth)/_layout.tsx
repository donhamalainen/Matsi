import React from "react";
import { useAuth } from "@/context/useAuth";
import Loading from "@/components/Loading";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }
  if (session) {
    return <Redirect href={"/(tabs)/home"} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="email/layout" />
    </Stack>
  );
}
