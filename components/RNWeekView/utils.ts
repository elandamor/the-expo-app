import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
export const TIME_LABELS_IN_DISPLAY = 12;
export const CONTAINER_HEIGHT = SCREEN_HEIGHT - 60;
export const CONTAINER_WIDTH = SCREEN_WIDTH - 64;
export const TIME_LABEL_HEIGHT = CONTAINER_HEIGHT / TIME_LABELS_IN_DISPLAY;
export const DATE_STR_FORMAT = "YYYY-MM-DD";
