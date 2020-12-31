import { StyleSheet } from "react-native";
import { CONTAINER_WIDTH } from "../utils";

const GREY_COLOR = "#D4D7DA";
export const CONTENT_OFFSET = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: CONTENT_OFFSET,
    width: CONTAINER_WIDTH,
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
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  events: {
    position: "absolute",
    flexDirection: "column",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "transparent",
  },
});

export default styles;
