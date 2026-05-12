import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { List, Card, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ChallengeLeaderboardScreen({ route, navigation, isComponent }) {
  useEffect(() => {
    if (!isComponent) {
      // Jika diakses dari rute mandiri (cache lama), redirect ke LeaderboardScreen baru
      navigation.replace("LeaderboardScreen", { defaultTab: "challenge" });
    }
  }, [isComponent, navigation]);

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("daily"); // "daily" or "weekly"

  const currentUserEmail = auth.currentUser?.email || "Guest@guest.com";
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

  const content = (
    <>
      <Text style={styles.title}>🏆 Peringkat Tantangan 🏆</Text>

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
    </>
  );

  if (!isComponent) {
    // Tampilkan loader selagi redirect
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", backgroundColor: "#0F2027" }]}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return <View style={styles.componentContainer}>{content}</View>;
}

const styles = StyleSheet.create({
  componentContainer: {
    flex: 1,
  },
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
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "rgba(212, 175, 55, 0.2)",
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#FFD700",
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
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    elevation: 0,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  highlightedCard: {
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    borderColor: "#FFD700",
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#E0E0E0",
  },
  scoreText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
  scoreNumber: {
    fontWeight: "bold",
    color: "#FFD700",
    fontSize: 16,
  },
  highlightedText: {
    color: "#FFFFFF",
  },
  emptyText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.7)",
    marginTop: 30,
    fontStyle: "italic",
  },
});
