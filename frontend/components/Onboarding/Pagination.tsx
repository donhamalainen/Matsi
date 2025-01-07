import { View } from "react-native";
import React from "react";
import { OnboardingData } from "@/data/onboarding";
import { SharedValue } from "react-native-reanimated";
import { Dot } from "./Dot";

type PaginationProps = {
  data: OnboardingData[];
  x: SharedValue<number>;
};

export const Pagination = ({ data, x }: PaginationProps) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {data.map((_, index) => (
        <Dot key={index} x={x} index={index} />
      ))}
    </View>
  );
};
