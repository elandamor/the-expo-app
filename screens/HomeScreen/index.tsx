import Constants from "expo-constants";
import React, { FC } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { RNButton, RNScrollView } from "../../components";

const wait = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  header: {
    backgroundColor: "#DDD",
    borderBottomRightRadius: 24,
    minHeight: 56 + Constants.statusBarHeight,
    width: width,
  },
});

interface HomeScreenProps {}

const HomeScreen: FC<HomeScreenProps> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            alignItems: "center",
          }}
        />
      </View>
      <RNScrollView
        styles={{
          contentContainerStyle: { flexGrow: 1, padding: 16 },
          style: { borderTopLeftRadius: 24 },
          underlayColor: "#DDD",
        }}
      >
        {[...new Array(10)].map((_, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#EEE",
              borderRadius: 24,
              height: 200,
              marginBottom: 16,
            }}
          />
        ))}

        <View
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <RNButton variant="primary" title="" onPress={() => null} />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 16,
            }}
          >
            <View
              style={{
                backgroundColor: "red",
                height: 32,
                width: 1,
              }}
            />
          </View>

          <RNButton
            title=""
            onPress={() => null}
            styles={{
              button: {
                backgroundColor: "transparent",
                borderColor: "red",
                borderWidth: 1,
              },
            }}
          />
        </View>
      </RNScrollView>
    </View>
  );
};

export default HomeScreen;
