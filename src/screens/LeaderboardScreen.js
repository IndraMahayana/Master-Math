import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { List, Title, Card, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LeaderboardScreen({ route, navigation }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback Dummy Data
  const defaultLeaderboard = [
    { id: "dummy-1", playerName: "MathGenius", totalScore: 3000 },
    { id: "dummy-2", playerName: "AlgebraKing", totalScore: 2500 },
    { id: "dummy-3", playerName: "LimitMaster", totalScore: 2100 },
  ];

  const currentUserEmail = auth.currentUser
    ? auth.currentUser.email
    : "Guest@guest.com";
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
            playerName: doc.data().username || doc.data().email.split("@")[0],
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
    <LinearGradient colors={["#1F1F1F", "#2A2A2A"]} style={styles.container}>
      <Title style={styles.title}>🏆 Top 10 Pemain 🏆</Title>

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
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    elevation: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  highlightedCard: {
    backgroundColor: "#FFE8E8",
    borderColor: "#FF6B6B",
    borderWidth: 2,
    transform: [{ scale: 1.03 }],
    elevation: 10,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  cardTitle: {
    fontWeight: "900",
    fontSize: 16,
    color: "#FF6B6B",
    letterSpacing: 0.3,
  },
  scoreText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "600",
  },
  scoreNumber: {
    fontWeight: "900",
    color: "#FF9800",
    fontSize: 16,
  },
  highlightedText: {
    color: "#00838F",
  },
});
