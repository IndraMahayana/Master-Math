import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { List, Card, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import ChallengeLeaderboardScreen from "./ChallengeLeaderboardScreen";

export default function LeaderboardScreen({ route, navigation }) {
  const [activeMainTab, setActiveMainTab] = useState(route.params?.defaultTab || "global");

  useEffect(() => {
    if (route.params?.defaultTab) {
      setActiveMainTab(route.params.defaultTab);
    }
  }, [route.params?.defaultTab]);

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback Dummy Data
  const defaultLeaderboard = [
    { id: "dummy-1", playerName: "MathGenius", totalScore: 3000 },
    { id: "dummy-2", playerName: "AlgebraKing", totalScore: 2500 },
    { id: "dummy-3", playerName: "LimitMaster", totalScore: 2100 },
  ];

  const currentUserEmail = auth.currentUser?.email || "Guest@guest.com";
  const currentUser = currentUserEmail.split("@")[0];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);

        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            playerName: doc.data().username || (doc.data().email ? doc.data().email.split("@")[0] : "Guest"),
            totalScore: doc.data().score || 0,
          });
        });

        if (data.length === 0) {
          setLeaderboard(defaultLeaderboard);
        } else {
          setLeaderboard(data);
        }
      } catch (error) {
        console.log("Error fetching leaderboard: ", error);
        setLeaderboard(defaultLeaderboard);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true);
      fetchLeaderboard();
    });

    fetchLeaderboard();

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item, index }) => {
    const isCurrentUser = item.playerName === currentUser;
    return (
      <Card style={[styles.card, isCurrentUser && styles.highlightedCard]}>
        <Card.Title
          title={`${index + 1}. ${item.playerName}`}
          subtitle={
            <Text style={styles.scoreText}>
              Skor: <Text style={styles.scoreNumber}>{item.totalScore}</Text>
            </Text>
          }
          left={(props) => (
            <List.Icon
              {...props}
              icon="trophy"
              color={
                index === 0
                  ? "#FFD700"
                  : index === 1
                    ? "#C0C0C0"
                    : index === 2
                      ? "#CD7F32"
                      : "#9E9E9E"
              }
            />
          )}
          titleStyle={[
            styles.cardTitle,
            isCurrentUser && styles.highlightedText,
          ]}
        />
      </Card>
    );
  };

  return (
    <LinearGradient colors={["#0F2027", "#203A43", "#2C5364"]} style={styles.container}>
      {/* Top Main Toggle */}
      <View style={styles.mainToggleContainer}>
        <TouchableOpacity
          style={[styles.mainToggleButton, activeMainTab === "global" && styles.activeMainToggle]}
          onPress={() => setActiveMainTab("global")}
        >
          <Text style={[styles.mainToggleText, activeMainTab === "global" && styles.activeMainToggleText]}>
            🌍 Global
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainToggleButton, activeMainTab === "challenge" && styles.activeMainToggle]}
          onPress={() => setActiveMainTab("challenge")}
        >
          <Text style={[styles.mainToggleText, activeMainTab === "challenge" && styles.activeMainToggleText]}>
            🔥 Tantangan
          </Text>
        </TouchableOpacity>
      </View>

      {activeMainTab === "global" ? (
        <>
          <Text style={styles.title}>🏆 Top 10 Pemain 🏆</Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#fff"
              style={{ marginTop: 50 }}
            />
          ) : (
            <View style={styles.listWrapper}>
              <FlatList
                data={leaderboard}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </>
      ) : (
        <ChallengeLeaderboardScreen route={route} navigation={navigation} isComponent={true} />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainToggleContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 25,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  mainToggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 20,
  },
  activeMainToggle: {
    backgroundColor: "rgba(212, 175, 55, 0.25)",
  },
  mainToggleText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "bold",
    fontSize: 14,
  },
  activeMainToggleText: {
    color: "#FFD700",
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    textAlign: "center",
    marginVertical: 16,
    fontSize: 28,
    color: "#FFD700",
    fontWeight: "900",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  listWrapper: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    marginBottom: 13,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    elevation: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  highlightedCard: {
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    borderColor: "#FFD700",
    borderWidth: 2,
    transform: [{ scale: 1.03 }],
    elevation: 0,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  cardTitle: {
    fontWeight: "900",
    fontSize: 16,
    color: "#E0E0E0",
    letterSpacing: 0.3,
  },
  scoreText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    fontWeight: "600",
  },
  scoreNumber: {
    fontWeight: "900",
    color: "#FFD700",
    fontSize: 16,
  },
  highlightedText: {
    color: "#FFFFFF",
  },
});
