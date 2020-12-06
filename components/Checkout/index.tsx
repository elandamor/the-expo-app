import React, { FC, useState } from "react";
import { ActivityIndicator, Modal, SafeAreaView, View } from "react-native";
import { WebView } from "react-native-webview";
import RNButton from "../RNButton";

interface CheckoutProps {
  // TODO: Provide types
  [key: string]: any;
}

/**
 * Modified Paystack WebView component as used in react-native-paystack-webview package
 * @see https://github.com/just1and0/React-Native-Paystack-WebView/blob/master/index.js
 */

const Checkout: FC<CheckoutProps> = ({
  buttonText,
  renderButton,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const Paystackcontent = `   
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <!-- Fonts -->
        <link rel="dns-prefetch" href="//fonts.gstatic.com">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">
        <title>SUBSCRIPTION</title>
      </head>
      <body onload="payWithPaystack()" style="background-color:#fff;height:100vh ">
        <script src="https://js.paystack.co/v1/inline.js"></script>
        <script type="text/javascript">
          window.onload = payWithPaystack;

          function payWithPaystack(){
            var handler = PaystackPop.setup({ 
              key: '${props.paystackKey}',
              email: '${props.billingEmail}',
              // TODO: Figure out why using env fails
              plan: 'PLN_lm5m5z8m6o804xx',
              channels: ['card'],
              metadata: {
                custom_fields: [
                  {
                    display_name: 'the-expo-app',
                    variable_name: 'the_expo_app',
                    value: '${props.billingName}'
                  }
                ]
              },
              callback: function(response) {
                var resp = {event:'successful', transactionRef:response};
                window.ReactNativeWebView.postMessage(JSON.stringify(resp))
              },
              onClose: function() {
                var resp = {event:'cancelled'};
                window.ReactNativeWebView.postMessage(JSON.stringify(resp))
              }
            });

            handler.openIframe();
          }
        </script> 
      </body>
    </html> 
    `;

  const messageReceived = (data) => {
    var webResponse = JSON.parse(data);
    if (props.handleWebViewMessage) {
      props.handleWebViewMessage(data);
    }
    switch (webResponse.event) {
      case "cancelled":
        setIsOpen(false);
        props.onCancel && props.onCancel({ status: "cancelled" });
        break;

      case "successful":
        setIsOpen(false);
        const reference = webResponse.transactionRef;
        props.onSuccess(reference);
        break;

      default:
        if (props.handleWebViewMessage) {
          props.handleWebViewMessage(data);
        }
        break;
    }
  };

  const button = renderButton ? (
    renderButton(setIsOpen(true))
  ) : (
    <RNButton title={buttonText} onPress={() => setIsOpen(true)} />
  );

  return (
    <SafeAreaView style={[{ flex: 1 }, props.SafeAreaViewContainer]}>
      {button}
      <Modal
        style={[{ flex: 1 }]}
        visible={isOpen}
        animationType="fade"
        transparent={false}
      >
        <SafeAreaView style={[{ flex: 1 }, props.SafeAreaViewContainerModal]}>
          {loading && (
            <View>
              <ActivityIndicator
                size="large"
                color={props.ActivityIndicatorColor}
              />
            </View>
          )}
          <WebView
            style={[{ flex: 1 }]}
            source={{ html: Paystackcontent }}
            onMessage={(e) => {
              messageReceived(e.nativeEvent.data);
            }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

Checkout.defaultProps = {
  buttonText: "CHECKOUT",
  ActivityIndicatorColor: "#000",
  channels: ["card"],
};

export default Checkout;
