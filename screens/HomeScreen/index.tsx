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
          paystackKey={process.env.REACT_APP_PAYSTACK_PUBLIC_KEY}
          amount={process.env.REACT_APP_PAYSTACK_PLAN_PRICE}
          billingEmail={process.env.REACT_APP_BILLING_EMAIL}
          billingName={process.env.REACT_APP_BILLING_NAME}
          plan={process.env.REACT_APP_PAYSTACK_PLAN}
          onSuccess={(callback: object) => {
            console.log({ callback });
          }}
        />
      </RNScrollView>
    </View>
  );
};

export default HomeScreen;
