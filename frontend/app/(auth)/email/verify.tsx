import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScreenView } from "@/components/ScreenView";

const EmailVerify = () => {
  return (
    <ScreenView>
      <Text>Sähköposti on lähetetty</Text>
    </ScreenView>
  );
};

export default EmailVerify;

const styles = StyleSheet.create({});

// https://localhost/email-login?login_link=matsi-app%3A%2F%2Flogin%3Femail%3Dhamalainen.don%2540gmail.com%26email_hash%3D%25242b%252410%25245J.liZpxSu9tIYRspj4S1O9RpbXF3iOvHE5snsMc8oznbxgm8%252F0JO%26token%3DeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhbWFsYWluZW4uZG9uQGdtYWlsLmNvbSIsImlhdCI6MTczNjE3NTEzMywiZXhwIjoxNzM2MTc2MDMzfQ.pJ1NoimComR53s3UgIfDm1kcs2afjNk0WNQRZbjUkDc%26valid_until%3D2025-01-06T15%253A07%253A13.338Z&universal=true
