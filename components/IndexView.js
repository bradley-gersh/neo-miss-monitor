import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { IndexList } from "./IndexList";
import * as Notifications from "expo-notifications";
import { Picker } from "@react-native-picker/picker";

const background = require("../assets/background.png");

const formatDate = (date) =>
  date.getFullYear() +
  "-" +
  ("" + date.getMonth() + 1).padStart(2, "0") +
  "-" +
  ("" + date.getDate()).padStart(2, "0");

export function IndexView() {
  const [asteroidData, setAsteroidData] = React.useState(null);
  const [optionsVisible, setOptionsVisible] = React.useState(false);
  const [utcOffset, setUtcOffset] = React.useState(0);
  const [notificationsOn, setNotificationsOn] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      if (!asteroidData) {
        await Notifications.cancelAllScheduledNotificationsAsync();

        const today = new Date();
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const todayString = formatDate(today);
        const tomorrowString = formatDate(tomorrow);

        // const rawData = require("../sampleData/sampleData.json");

        const rawData = await axios.get(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${todayString}&end_date=${tomorrowString}&api_key=DEMO_KEY`
        );
        console.log(rawData.data.near_earth_objects);
        if (rawData) {
          const asteroidsOnly = Object.values(
            rawData.data.near_earth_objects
          ).reduce(
            (dateArray, allAsteroids) => allAsteroids.concat(dateArray),
            []
          );
          const cleanData = reformatData(asteroidsOnly);
          setAsteroidData(cleanData);
          scheduleNotifications();
        }
      }
    }
    fetchData();
    // console.log(asteroidData);
  }, [asteroidData]);

  const reformatData = (asteroidsOnly) => {
    return asteroidsOnly
      .map((asteroid) => {
        const id = asteroid.id;
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
        const date = asteroid.close_approach_data[0].epoch_date_close_approach;

        const nasaUrl = asteroid.nasa_jpl_url;
        const maxSize = Number(
          Number.parseFloat(
            asteroid.estimated_diameter.feet.estimated_diameter_max
          ).toPrecision(3)
        );
        // const roughSize = approx(maxSize);
        const isHazard = asteroid.is_potentially_hazardous_asteroid;

        return {
          id,
          name,
          distance,
          dateString,
          timeString,
          date,
          nasaUrl,
          maxSize,
          isHazard,
        };
      })
      .sort((asteroidA, asteroidB) => asteroidA.date - asteroidB.date);
  };

  const scheduleNotifications = async () => {
    if (asteroidData) {
      await Promise.all(
        asteroidData.map((asteroid) => {
          if (asteroid.date > Date.now()) {
            const hazardTitle = asteroid.isHazard ? `⚠ ️` : ``;
            const hazardBody = asteroid.isHazard ? "Potential hazard. " : "";

            const trigger = asteroid.date - Date.now();

            Notifications.scheduleNotificationAsync({
              content: {
                title: hazardTitle + `Asteroid ${asteroid.name} passing Earth`,
                body:
                  hazardBody +
                  `${asteroid.maxSize} ft long, ${asteroid.distance} Lunar distances.`,
              },
              trigger,
            });

            return Notifications.scheduleLocalNotificationAsync();
          }
        })
      );
    }
  };

  const utcArray = Object.keys([...Array(24)]).map((num) => num - 12);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.bgImage} source={background}>
        <StatusBar style="light" />
        <View style={styles.topBar}>
          <Text style={styles.titleText}>neo misses</Text>
          <TouchableOpacity
            onPress={() => {
              setOptionsVisible(!optionsVisible);
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Options</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.indexPanel}>
          <Modal
            animationType="fade"
            visible={optionsVisible}
            transparent="true"
          >
            <View style={styles.centerView}>
              <View style={styles.optionsCard}>
                <Text style={styles.titleText}>OPTIONS</Text>
                <View style={styles.optionsLine}>
                  <Text style={styles.optionsText}>Asteroid notifications</Text>
                  <Switch
                    onValueChange={() => {
                      setNotificationsOn(!notificationsOn);
                    }}
                    value={notificationsOn}
                  />
                </View>
                <View style={styles.optionsLine}>
                  <Text style={styles.optionsText}>Time Zone</Text>
                  <Text style={styles.optionsText}>
                    {utcOffset < 0 ? `UTC ${utcOffset}` : `UTC +${utcOffset}`}
                  </Text>
                </View>
                <Picker
                  selectedValue={utcOffset}
                  onValueChange={(itemValue) => {
                    setUtcOffset(itemValue);
                  }}
                >
                  {utcArray.map((num) => (
                    <Picker.Item
                      key={num}
                      color="white"
                      label={num < 0 ? `UTC ${num}` : `UTC +${num}`}
                      value={num}
                    />
                  ))}
                </Picker>
                <TouchableOpacity
                  onPress={() => {
                    setOptionsVisible(!optionsVisible);
                  }}
                >
                  <Text style={styles.optionsText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  centerView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  optionsCard: {
    opacity: 1,
    marginTop: 20,
    backgroundColor: "rgba(80, 0, 80, 1)",
    borderWidth: 5,
    borderColor: "white",
    borderRadius: 10,
    padding: 5,
    margin: 10,
    color: "white",
    width: "80%",
  },
  optionsText: {
    fontSize: 20,
    color: "white",
  },
  titleText: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    padding: 10,
    fontWeight: "bold",
  },
  optionsLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
