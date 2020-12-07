import { StackNavigationProp } from "@react-navigation/stack";
import Constants from "expo-constants";
import React, { FC, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { RNButton, RNScrollView, RNTextInput } from "../../components";
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

interface RegisterScreenProps {
  navigation: StackNavigationProp<PublicStackParamsList, "Register">;
}

const RegisterScreen: FC<RegisterScreenProps> = ({ navigation }) => {
  const [value, onChangeText] = useState("");

  return (
    <RNScrollView>
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
            {[...new Array(3)].map((_, index) => (
              <RNTextInput key={index} />
            ))}
          </View>
          <RNButton
            variant="primary"
            title=""
            onPress={() => navigation.navigate("Home")}
          />
          <RNButton
            title=""
            onPress={() => navigation.navigate("Login")}
            styles={{ button: { marginTop: 16 } }}
          />
        </View>
      </View>
    </RNScrollView>
  );
};

export default RegisterScreen;
