import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { List, Title, Card, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ChallengeLeaderboardScreen({ route, navigation }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("daily"); // "daily" or "weekly"

  const currentUserEmail = auth.currentUser
    ? auth.currentUser.email
    : "Guest@guest.com";
  const currentUser = currentUserEmail.split("@")[0];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const leaderboardsRef = collection(
          db,
          `challenge_leaderboards/${mode}/users`,
        );
        const q = query(leaderboardsRef, orderBy("score", "desc"), limit(20));
        const querySnapshot = await getDocs(q);

        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            playerName: doc.data().username || "Unknown",
            score: doc.data().score || 0,
            streak: doc.data().streak || 0,
          });
        });

        setLeaderboard(data);
      } catch (error) {
        console.log("Error fetching challenge leaderboard: ", error);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      fetchLeaderboard();
    });

    fetchLeaderboard();

    return unsubscribe;
  }, [navigation, mode]);

  const renderItem = ({ item, index }) => {
    const isCurrentUser = item.playerName === currentUser;
    return (
      <Card style={[styles.card, isCurrentUser && styles.highlightedCard]}>
        <Card.Title
          title={`${index + 1}. ${item.playerName}`}
          subtitle={
            <Text style={styles.scoreText}>
              Skor: <Text style={styles.scoreNumber}>{item.score}</Text> | Max
              Streak: {item.streak}
            </Text>
          }
          left={(props) => (
            <List.Icon
              {...props}
              icon="medal"
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
    <LinearGradient colors={["#1F1F1F", "#2A2A2A"]} style={styles.container}>
      <Title style={styles.title}>🏆 Leaderboard Tantangan 🏆</Title>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, mode === "daily" && styles.activeTab]}
          onPress={() => setMode("daily")}
        >
          <Text
            style={[styles.tabText, mode === "daily" && styles.activeTabText]}
          >
            Harian
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, mode === "weekly" && styles.activeTab]}
          onPress={() => setMode("weekly")}
        >
          <Text
            style={[styles.tabText, mode === "weekly" && styles.activeTabText]}
          >
            Mingguan
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 50 }}
        />
      ) : (
        <View style={styles.listWrapper}>
          {leaderboard.length === 0 ? (
            <Text style={styles.emptyText}>
              Belum ada data di papan peringkat ini.
            </Text>
          ) : (
            <FlatList
              data={leaderboard}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    textAlign: "center",
    marginVertical: 15,
    fontSize: 24,
    color: "#FFD700",
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 20,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#FFD700",
  },
  tabText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#FF6B6B",
  },
  listWrapper: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    elevation: 5,
    borderRadius: 15,
  },
  highlightedCard: {
    backgroundColor: "#FFE8E8",
    borderColor: "#FF6B6B",
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FF6B6B",
  },
  scoreText: {
    color: "#4a4a4a",
    fontSize: 14,
  },
  scoreNumber: {
    fontWeight: "bold",
    color: "#FF6B6B",
    fontSize: 16,
  },
  highlightedText: {
    color: "#00838F",
  },
  emptyText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.7)",
    marginTop: 30,
    fontStyle: "italic",
  },
});
