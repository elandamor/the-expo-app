import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  header: {
    height: "100%",
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "absolute",
    width: "100%",
  },
  knob: {
    backgroundColor: "#f2F4f5",
    borderRadius: 3,
    height: 7,
    marginTop: 10,
    width: 38,
  },
  knobContainer: {
    alignItems: "center",
    backgroundColor: "white",
    bottom: 0,
    flex: 1,
    height: 24,
    left: 0,
    position: "absolute",
    right: 0,
  },
  children: {
    backgroundColor: "#f2F4f5",
    flex: 1,
    marginTop: 104,
  },
  weekday: {
    color: "#b6c1cd",
    fontFamily: "System",
    fontSize: 13,
    fontWeight: undefined,
    textAlign: "center",
    width: 32,
  },
  weekdays: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    left: 0,
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 7,
    paddingTop: 15,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
