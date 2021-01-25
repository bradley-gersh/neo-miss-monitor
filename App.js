import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { IndexView } from "./components/IndexView";
import * as Notifications from "expo-notifications";

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Index" component={IndexView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
