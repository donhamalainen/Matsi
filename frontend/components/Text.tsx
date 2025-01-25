import React from "react";
// import { useTranslation } from "react-i18next";
import {
  Text as NativeText,
  TextProps as NativeTextProps,
  StyleSheet,
} from "react-native";
import { COLORS } from "@/constants/colors";

export type TextVariant =
  | "title"
  | "title_small"
  | "body"
  | "bodySmall"
  | "bodyLarge"
  | "buttonBody"
  | "headline1"
  | "input";

type TextProps = NativeTextProps & {
  variant?: TextVariant;
  i18nKey?: string;
  i18nParams?: Record<string, string>;
  align?: "auto" | "left" | "center" | "right";
  color?: string;
};

export const TextStyles = StyleSheet.create({
  title: {
    fontFamily: "ChillaxMedium",
    fontSize: 32,
    color: COLORS.black,
  },
  title_small: {
    fontSize: 24,
    fontFamily: "ChillaxMedium",
    color: COLORS.black,
  },
  headline1: {
    fontSize: 20,
    fontFamily: "GeneralSansRegular",
    color: COLORS.primary,
  },

  buttonBody: {
    fontSize: 18,
    fontFamily: "ChillaxMedium",
    color: COLORS.buttonText,
  },
  bodyLarge: {
    fontSize: 16,
    fontFamily: "GeneralSansRegular",
    color: COLORS.black,
  },
  body: {
    fontSize: 14,
    fontFamily: "GeneralSansRegular",
    color: COLORS.black,
  },
  bodySmall: {
    fontSize: 12,
    fontFamily: "GeneralSansRegular",
    color: COLORS.primary,
  },
  input: {
    fontSize: 18,
    fontFamily: "GeneralSansRegular",
    color: COLORS.primary,
  },
});

export const Text = ({
  variant = "body",
  style,
  i18nKey,
  i18nParams,
  align = "auto",
  color,
  ...props
}: TextProps) => {
  // const { t } = useTranslation();
  return (
    <NativeText
      style={[
        TextStyles[variant],
        { textAlign: align },
        style,
        color ? { color: color } : {},
      ]}
      {...props}
    >
      {/* {i18nKey
        ? i18nParams
          ? t(i18nKey, i18nParams)
          : t(i18nKey)
        : props.children} */}
      {props.children}
    </NativeText>
  );
};
