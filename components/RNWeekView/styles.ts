import { StyleSheet } from "react-native";
import { CONTAINER_WIDTH } from "./utils";

const GREY_COLOR = "#70757a";
export const CONTENT_OFFSET = 16;

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
  timeRow: {
    flex: 0,
  },
  timeLabelLine: {
    height: 1,
    backgroundColor: GREY_COLOR,
    position: "absolute",
    right: 0,
    left: 0,
  },
  event: {
    flex: 1,
    overflow: "hidden",
    borderColor: GREY_COLOR,
    borderLeftWidth: 1,
  },
  events: {
    position: "absolute",
    flexDirection: "row",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "transparent",
  },
});

export default styles;
