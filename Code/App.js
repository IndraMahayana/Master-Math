import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text } from "react-native";

// Import Screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import MainMenuScreen from "./src/screens/MainMenuScreen";
import GameplayScreen from "./src/screens/GameplayScreen";
import LeaderboardScreen from "./src/screens/LeaderboardScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import QuestionWarehouseScreen from "./src/screens/QuestionWarehouseScreen";
import PracticeProblemsScreen from "./src/screens/PracticeProblemsScreen";

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1A2980",
    accent: "#26D0CE",
  },
};

const linking = {
  prefixes: [
    "",
    "http://localhost:8082",
    "http://localhost:19006",
    "http://127.0.0.1:8082",
    "http://127.0.0.1:19006",
  ],
  config: {
    screens: {
      Login: "",
      Register: "register",
      MainMenu: "mainmenu",
      Gameplay: "gameplay",
      Leaderboard: "leaderboard",
      Profile: "profile",
      QuestionWarehouse: "warehouse",
      PracticeProblems: "practice",
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <NavigationContainer
          linking={linking}
          fallback={
            <View
              style={{
                flex: 1,
                backgroundColor: "#f5f5f5",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, color: "#666" }}>Loading...</Text>
            </View>
          }
        >
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: { backgroundColor: "#1A2980" },
              headerTintColor: "#fff",
              headerTitleStyle: { fontWeight: "bold" },
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainMenu"
              component={MainMenuScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Gameplay"
              component={GameplayScreen}
              options={{ title: "Master Math" }}
            />
            <Stack.Screen
              name="Leaderboard"
              component={LeaderboardScreen}
              options={{ title: "Papan Peringkat" }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: "Profil Pengguna" }}
            />
            <Stack.Screen
              name="QuestionWarehouse"
              component={QuestionWarehouseScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PracticeProblems"
              component={PracticeProblemsScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
