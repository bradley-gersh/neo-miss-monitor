import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

const background = require("../assets/background.png");

export function IndexView() {
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.image} source={background}>
        <Text style={styles.titleText}>HELLO</Text>
        {/* <StatusBar barStyle="light-content" /> */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    flexDirection: "column",
    justifyContent: "center",
  },
  titleText: {
    color: "#fff",
    fontSize: 50,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  // text: {
  // color: "white",
  // fontSize: 42,
  // fontWeight: "bold",
  // textAlign: "center",
  // backgroundColor: "#000000a0",
  // },,
});
