import { StackNavigationProp } from "@react-navigation/stack";
import Constants from "expo-constants";
import React, { FC } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { RNScrollView, RNTextInput } from "../../components";
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
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 56,
    height: 64,
    justifyContent: "center",
  },
});

interface LoginScreenProps {
  navigation: StackNavigationProp<PublicStackParamsList, "Login">;
}

const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  return (
    <RNScrollView hasBottomSafeAreaInset>
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
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "#DDD",
          }}
        />
        <View
          style={{
            backgroundColor: "#FFF",
            borderTopLeftRadius: 44,
            flex: 0,
            padding: 16,
          }}
        >
          <View style={{ marginVertical: 16 }}>
            {[...new Array(2)].map((_, index) => (
              <RNTextInput key={index} />
            ))}
          </View>
          <Pressable onPress={() => navigation.navigate("Home")}>
            <View style={styles.button} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Register")}>
            <View
              style={[styles.button, { backgroundColor: "#FFF", marginTop: 8 }]}
            >
              <Text>Don't have an acccount? Register</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </RNScrollView>
  );
};

export default LoginScreen;
