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
    <LinearGradient colors={["#1A2980", "#26D0CE"]} style={styles.container}>
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
    marginVertical: 15,
    fontSize: 26,
    color: "#FFD700",
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
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
    backgroundColor: "#E0F7FA",
    borderColor: "#26D0CE",
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#1A2980",
  },
  scoreText: {
    color: "#4a4a4a",
    fontSize: 14,
  },
  scoreNumber: {
    fontWeight: "bold",
    color: "#1A2980",
    fontSize: 16,
  },
  highlightedText: {
    color: "#00838F",
  },
});
