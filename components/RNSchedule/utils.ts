import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const TIME_LABEL_HEIGHT = 64;
export const TIME_LABELS_IN_DISPLAY = 12;
export const CONTAINER_WIDTH = SCREEN_WIDTH - TIME_LABEL_HEIGHT;
export const DATE_STR_FORMAT = "YYYY-MM-DD";
