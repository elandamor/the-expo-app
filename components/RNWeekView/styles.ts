import { StyleSheet } from "react-native";
import { CONTAINER_WIDTH } from "./utils";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexDirection: "row",
  },
  headerContainer: {
    flexDirection: "row",
  },
  header: {
    flexGrow: 1,
    height: 50,
    width: CONTAINER_WIDTH,
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
  },
});

export default styles;
