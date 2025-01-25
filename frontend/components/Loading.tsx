import { COLORS } from "@/constants/colors";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function Loading() {
  const CanvaSize = 46;
  const StrokeWidth = 12;
  const CircleRadius = (CanvaSize - StrokeWidth) / 2;

  // Ympyräpolun luonti
  const circlePath = useMemo(() => {
    const skPath = Skia.Path.Make();
    skPath.addCircle(CanvaSize / 2, CanvaSize / 2, CircleRadius);
    return skPath;
  }, []);

  const progress = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => {
    return { transform: [{ rotate: `${progress.value}rad` }] };
  }, []);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 1000 }), // Täysi kierros 1 sekunnissa
      -1, // Toistuu ikuisesti
      false // Ei palindromiefektiä
    );
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View exiting={FadeOut} entering={FadeIn} style={rStyle}>
        <Canvas style={{ width: CanvaSize, height: CanvaSize }}>
          <Path
            path={circlePath}
            style={"stroke"}
            color={COLORS.primary}
            strokeWidth={StrokeWidth}
            start={0.6}
            end={1}
            strokeCap={"round"}
          />
        </Canvas>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});
