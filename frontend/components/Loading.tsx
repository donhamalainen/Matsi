import { COLORS } from "@/constants/colors";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useMemo } from "react";

export default function Loading() {
  const progress = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => {
    return { transform: [{ rotate: `${progress.value}rad` }] };
  }, []);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 1000 }),
      -1,
      false
    );
  }, []);

  return (
    <Animated.View exiting={FadeOut} entering={FadeIn} style={styles.container}>
      <Animated.View style={rStyle}>
        {/* <CustomActivityIndicator progress={progress} /> */}
        <ActivityIndicator size={"large"} />
      </Animated.View>
    </Animated.View>
  );
}

const CustomActivityIndicator = ({ progress }: { progress: any }) => {
  const CanvaSize = 64;
  const StrokeWidth = 10;
  const CircleRadius = (CanvaSize - StrokeWidth) / 2;

  const circlePath = useMemo(() => {
    const skPath = Skia.Path.Make();
    skPath.addCircle(CanvaSize / 2, CanvaSize / 2, CircleRadius);
    return skPath;
  }, []);

  const start = useSharedValue(0.3);
  const end = useSharedValue(1);

  useEffect(() => {
    start.value = withRepeat(withTiming(0, { duration: 1000 }), -1, true);
    end.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    start: start.value,
    end: end.value,
  }));

  return (
    <Canvas style={{ width: CanvaSize, height: CanvaSize }}>
      <Path
        path={circlePath}
        style={"stroke"}
        color={COLORS.primary}
        strokeWidth={StrokeWidth}
        start={animatedStyle.start}
        end={animatedStyle.end}
        strokeCap={"round"}
      />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    backgroundColor: COLORS.lightBackground,
  },
});
