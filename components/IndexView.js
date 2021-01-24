import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { IndexList } from "./IndexList";

const background = require("../assets/background.png");

export function IndexView() {
  const [asteroidData, setAsteroidData] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      if (!asteroidData) {
        const rawData = require("../sampleData/sampleData.json");
        // const rawData = await axios.get(
        // "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY"
        // );
        console.log(rawData);
        if (rawData) {
          const cleanData = Object.values(rawData.near_earth_objects).reduce(
            (dateArray, allAsteroids) => allAsteroids.concat(dateArray),
            []
          );
          setAsteroidData(cleanData);
        }
      }
    }
    fetchData();
    console.log(asteroidData);
  }, [asteroidData]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.bgImage} source={background}>
        <StatusBar style="light" />
        <View style={styles.topBar}>
          <Text style={styles.titleText}>neo misses</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Options</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.indexPanel}>
          <IndexList asteroidData={asteroidData} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    flexDirection: "column",
    justifyContent: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // backgroundColor: "white",
  },
  titleText: {
    color: "#eeeeee",
    fontSize: 48,
    fontFamily: "System",
    // backgroundColor: "pink",
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
  },
  button: {
    borderColor: "#eeeeee",
    borderWidth: 3,
    borderRadius: 10,
    marginTop: 5,
    // backgroundColor: "green",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    padding: 6,
    // backgroundColor: "red",
  },
  indexPanel: {
    padding: 30,
    // backgroundColor: "red",
  },
  // text: {
  // color: "white",
  // fontSize: 42,
  // fontWeight: "bold",
  // textAlign: "center",
  // backgroundColor: "#000000a0",
  // },,
});
