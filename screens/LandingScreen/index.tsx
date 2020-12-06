import { StackNavigationProp } from "@react-navigation/stack";
import Constants from "expo-constants";
import React, { FC } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PublicStackParamsList } from "../../navigation";

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  header: {
    alignItems: "center",
    backgroundColor: "#DDD",
    borderBottomRightRadius: 44,
    flex: 1,
    justifyContent: "center",
    padding: 40,
    paddingTop: Constants.statusBarHeight + 40,
    width: width,
  },
  footer: {
    flex: 0,
    position: "relative",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 56,
    height: 64,
  },
});

interface LandingScreenProps {
  navigation: StackNavigationProp<PublicStackParamsList, "Landing">;
}

const LandingScreen: FC<LandingScreenProps> = ({ navigation }) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            backgroundColor: "#CCC",
            borderRadius: 24,
            height: 120,
            width: 120,
          }}
        />
      </View>
      <View style={styles.footer}>
        <View
          style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "#DDD" }}
        />
        <View
          style={{
            backgroundColor: "#FFF",
            borderTopLeftRadius: 44,
            flex: 0,
            padding: 16,
            paddingBottom: 16 + bottom,
          }}
        >
          <Pressable onPress={() => navigation.navigate("Login")}>
            <View style={styles.button} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Register")}>
            <View
              style={[styles.button, { backgroundColor: "#FFF", marginTop: 8 }]}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LandingScreen;

// interface SliderProps extends ViewProps {}

// const Slider: FC<SliderProps> = ({ children, ...props }) => {
//   return (
//     <View style={}>
//       <ScrollView horizontal decelerationRate="fast"  showsHorizontalScrollIndicator={false} snapToInterval={width}>{children}</ScrollView>
//     </View>
//   );
// };

// Slider.defaultProps = {
//   style: styles.slider,
// };

// interface SlideProps extends ViewProps {}

// const Slide: FC<SlideProps> = ({ children, ...props }) => {
//   return <View >{children}</View>;
// };
