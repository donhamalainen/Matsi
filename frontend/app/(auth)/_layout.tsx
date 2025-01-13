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
    return <Redirect href={"/(main)/home"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
