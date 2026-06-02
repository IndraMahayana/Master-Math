import React, { useState, useEffect } from "react";
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { authStorage } from "./src/utils/authStorage";
import { setupFirestore } from "./src/setupFirestore";

// Import Screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MainMenuScreen from "./src/screens/MainMenuScreen";
import GameplayScreen from "./src/screens/GameplayScreen";
import LeaderboardScreen from "./src/screens/LeaderboardScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import QuestionWarehouseScreen from "./src/screens/QuestionWarehouseScreen";
import PracticeProblemsScreen from "./src/screens/PracticeProblemsScreen";
import ChallengeMenuScreen from "./src/screens/ChallengeMenuScreen";
import ChallengeLeaderboardScreen from "./src/screens/ChallengeLeaderboardScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1F1F1F",
    accent: "#FF6B6B",
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
      Home: "home",
      MainMenu: "mainmenu",
      Gameplay: "gameplay",
      Leaderboard: "leaderboard",
      Profile: "profile",
      QuestionWarehouse: "warehouse",
      PracticeProblems: "practice",
      ChallengeMenu: "challenge",
    },
  },
};

// Home Stack Navigator
function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1A2980" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
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
        name="ChallengeMenu"
        component={ChallengeMenuScreen}
        options={{ title: "Arena Tantangan" }}
      />
    </Stack.Navigator>
  );
}

// Question Warehouse Stack Navigator
function QuestionStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1A2980" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="QuestionWarehouse"
        component={QuestionWarehouseScreen}
        options={{ title: "Gudang Soal" }}
      />
      <Stack.Screen
        name="PracticeProblems"
        component={PracticeProblemsScreen}
        options={{ title: "Latihan Soal" }}
      />
      <Stack.Screen
        name="Gameplay2"
        component={GameplayScreen}
        options={{ title: "Soal Latihan" }}
      />
    </Stack.Navigator>
  );
}

// Leaderboard Stack Navigator
function LeaderboardStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1A2980" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="LeaderboardScreen"
        component={LeaderboardScreen}
        options={{ title: "Papan Peringkat" }}
      />
      <Stack.Screen
        name="ChallengeLeaderboard"
        component={ChallengeLeaderboardScreen}
        options={{ title: "Papan Peringkat Tantangan" }}
      />
    </Stack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1A2980" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: "Profil Saya" }}
      />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? "";
        const hiddenRoutes = [
          "Gameplay",
          "Gameplay2",
          "PracticeProblems",
          "ChallengeMenu",
          "ChallengeLeaderboard",
        ];
        const display = hiddenRoutes.includes(routeName) ? "none" : "flex";

        return {
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "HomeTab") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "QuestionTab") {
              iconName = focused ? "book" : "book-outline";
            } else if (route.name === "LeaderboardTab") {
              iconName = focused ? "trophy" : "trophy-outline";
            } else if (route.name === "ProfileTab") {
              iconName = focused ? "account" : "account-outline";
            }
            return (
              <MaterialCommunityIcons name={iconName} size={24} color={color} />
            );
          },
          tabBarActiveTintColor: "#FFD700",
          tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
          tabBarStyle: {
            display: display,
            backgroundColor: "#0F2027",
            borderTopColor: "rgba(255,255,255,0.1)",
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginTop: 4,
          },
        };
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ tabBarLabel: "Beranda" }}
      />
      <Tab.Screen
        name="QuestionTab"
        component={QuestionStackNavigator}
        options={{ tabBarLabel: "Gudang Soal" }}
      />
      <Tab.Screen
        name="LeaderboardTab"
        component={LeaderboardStackNavigator}
        options={{ tabBarLabel: "Peringkat" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: "Profil" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [initialState, setInitialState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = React.useRef();

  useEffect(() => {
    // Cek apakah user sudah login sebelumnya
    const checkAuthState = async () => {
      try {
        const authState = await authStorage.getAuthState();
        const navState = await authStorage.getNavigationState();

        if (authState && authState.uid) {
          // User sudah login, restore ke app tabs
          setInitialRoute("AppTabs");
          setInitialState(navState);
        } else {
          // User belum login, go to login
          setInitialRoute("Login");
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setInitialRoute("Login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
    setupFirestore();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f5f5f5",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#1A2980" />
        <Text style={{ fontSize: 16, color: "#666", marginTop: 10 }}>
          Memuat...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <NavigationContainer
          ref={navigationRef}
          linking={linking}
          initialState={initialState}
          onStateChange={async (state) => {
            // Simpan navigation state setiap kali berubah
            await authStorage.saveNavigationState(state);
          }}
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
            initialRouteName={initialRoute || "Login"}
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
              name="AppTabs"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
