import Constants from "expo-constants";
import React, { FC } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Checkout, RNScrollView } from "../../components";

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  header: {
    backgroundColor: "#DDD",
    borderBottomRightRadius: 44,
    minHeight: 56 + Constants.statusBarHeight,
    width: width,
  },
});

interface HomeScreenProps {}

const HomeScreen: FC<HomeScreenProps> = () => {
  const { user } = { user: { email: "thando@sovtech.com" } }; // useAuthentication()

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
          contentContainerStyle: {
            padding: 16,
          },
          style: { borderTopLeftRadius: 44 },
          underlayColor: "#DDD",
        }}
      >
        <Checkout
          paystackKey="pk_test_3a958a8fabb85177b3a505f0d44466456cedaa46"
          amount={500}
          billingEmail="thando@sovtech.com"
          billingName="the-expo-app"
          onSuccess={(callback: object) => {
            console.log({ callback });
          }}
        />
      </RNScrollView>
    </View>
  );
};

export default HomeScreen;
