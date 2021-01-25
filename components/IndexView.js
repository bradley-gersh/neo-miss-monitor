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
import * as Notifications from "expo-notifications";

const background = require("../assets/background.png");

export function IndexView() {
  const [asteroidData, setAsteroidData] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      if (!asteroidData) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        const rawData = require("../sampleData/sampleData.json");
        // const rawData = await axios.get(
        // "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY"
        // );
        // console.log(rawData);
        if (rawData) {
          const asteroidsOnly = Object.values(
            rawData.near_earth_objects
          ).reduce(
            (dateArray, allAsteroids) => allAsteroids.concat(dateArray),
            []
          );
          const cleanData = reformatData(asteroidsOnly);
          setAsteroidData(cleanData);
          // scheduleNotifications();
        }
      }
    }
    fetchData();
    // console.log(asteroidData);
  }, [asteroidData]);

  const reformatData = (asteroidsOnly) => {
    return asteroidsOnly.map((asteroid) => {
      let name = asteroid.name;
      if (name[0] === "(" && name[name.length - 1] === ")") {
        name = name.slice(1, name.length - 1);
      }
      const distance =
        Math.round(asteroid.close_approach_data[0].miss_distance.lunar * 10) /
        10;
      let [
        dateString,
        timeString,
      ] = asteroid.close_approach_data[0].close_approach_date_full.split(" ");
      timeString += ` (UTC)`;

      const nasaUrl = asteroid.nasa_jpl_url;
      const maxSize = asteroid.estimated_diameter.feet.estimated_diameter_max;
      // const roughSize = approx(maxSize);
      const isHazard = asteroid.is_potentially_hazardous_asteroid;

      return {
        name,
        distance,
        dateString,
        timeString,
        nasaUrl,
        maxSize,
        isHazard,
      };
    });
  };

  const scheduleNotifications = async () => {
    await Promise.all(
      asteroidData.map((asteroid) => {
        const notification = {
          title: "Passing Asteroid",
          body: `${asteroid.name}, ${Math.round(asteroid)}`,
        };
        const schedulingOptions = {};
        return Notifications.scheduleLocalNotificationAsync();
      })
    );
  };

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
    paddingTop: 30,
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
