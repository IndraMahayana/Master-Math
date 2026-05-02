import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getResponsiveFontSize,
  getResponsiveSpacing,
  getDeviceType,
  getContentPadding,
} from "../utils/responsiveUtils";

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const deviceType = getDeviceType();

  const [userData, setUserData] = useState({
    username: auth.currentUser
      ? auth.currentUser.email?.split("@")[0]
      : "Guest",
    score: 0,
  });

  const responsiveStyles = useMemo(
    () => ({
      containerPadding: getContentPadding(),
      titleSize: getResponsiveFontSize(28),
      subtitleSize: getResponsiveFontSize(14),
      cardPadding: getResponsiveSpacing(20),
    }),
    [deviceType],
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userSnap.exists()) {
            let data = userSnap.data();
            const today = new Date().toISOString().split("T")[0];
            const lastLogin = data.lastLoginDate;

            if (lastLogin !== today) {
              const newScore = (data.score || 0) + 1000;
              await updateDoc(doc(db, "users", auth.currentUser.uid), {
                lastLoginDate: today,
                score: newScore,
              });
              data.score = newScore;
              Alert.alert(
                "🎉 Bonus Login Harian!",
                "Kamu mendapatkan +1000 Poin untuk login hari ini!",
              );
            }

            setUserData(data);
          }
        } catch (error) {
          console.log("Error fetching user data", error);
        }
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      fetchUserData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <LinearGradient
      colors={["#1A2980", "#26D0CE"]}
      style={[styles.container, { paddingTop: Math.max(insets.top + 10, 20) }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <Card style={styles.welcomeCard}>
          <Card.Content style={styles.welcomeContent}>
            <View style={styles.avatarSmall}>
              <MaterialCommunityIcons
                name="account-circle"
                size={50}
                color="#fff"
              />
            </View>
            <View style={styles.welcomeText}>
              <Text
                style={[
                  styles.welcomeTitle,
                  { fontSize: responsiveStyles.titleSize - 4 },
                ]}
              >
                Selamat datang, {userData.username}! 👋
              </Text>
              <View style={styles.scoreRow}>
                <MaterialCommunityIcons name="star" size={16} color="#FF9800" />
                <Text style={styles.scoreTextWelcome}>
                  {" "}
                  Skor:{" "}
                  <Text style={styles.scoreBold}>{userData.score} Pts</Text>
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Main Menu */}
        <Text
          style={[
            styles.menuTitle,
            { fontSize: responsiveStyles.subtitleSize + 2 },
          ]}
        >
          Pilih Mode Bermain
        </Text>

        {/* Arena Bertarung Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("MainMenu")}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.menuCard}
          >
            <View style={styles.menuCardContent}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="sword" size={40} color="#fff" />
              </View>
              <View style={styles.menuTextContent}>
                <Text style={styles.menuTitle2}>Arena Bertarung ⚔️</Text>
                <Text style={styles.menuDescription}>
                  Pilih level dan mode bermain
                </Text>
                <Text style={styles.menuSubtitle}>
                  Sudden Death • Mode Nyawa • 20 Soal
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={28}
                color="#fff"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Arena Tantangan Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("ChallengeMenu")}
        >
          <LinearGradient
            colors={["#f093fb", "#f5576c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.menuCard}
          >
            <View style={styles.menuCardContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: "rgba(255,255,255,0.3)" },
                ]}
              >
                <MaterialCommunityIcons name="fire" size={40} color="#fff" />
              </View>
              <View style={styles.menuTextContent}>
                <Text style={styles.menuTitle2}>Arena Tantangan 🔥</Text>
                <Text style={styles.menuDescription}>
                  Tantangan harian dan mingguan
                </Text>
                <Text style={styles.menuSubtitle}>
                  Daily • Weekly • Leaderboard
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={28}
                color="#fff"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <Card style={styles.infoCard}>
            <Card.Content style={styles.infoContent}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={28}
                color="#FF9800"
              />
              <Text style={styles.infoTitle}>Cepat</Text>
              <Text style={styles.infoText}>Permainan yang seru</Text>
            </Card.Content>
          </Card>

          <Card style={styles.infoCard}>
            <Card.Content style={styles.infoContent}>
              <MaterialCommunityIcons name="brain" size={28} color="#4CAF50" />
              <Text style={styles.infoTitle}>Pintar</Text>
              <Text style={styles.infoText}>Latihan matematika</Text>
            </Card.Content>
          </Card>

          <Card style={styles.infoCard}>
            <Card.Content style={styles.infoContent}>
              <MaterialCommunityIcons name="trophy" size={28} color="#2196F3" />
              <Text style={styles.infoTitle}>Rank</Text>
              <Text style={styles.infoText}>Kompetisi sehat</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  welcomeCard: {
    marginBottom: 25,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    elevation: 8,
  },
  welcomeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1A2980",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    elevation: 4,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontWeight: "bold",
    color: "#1A2980",
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreTextWelcome: {
    fontSize: 12,
    color: "#555",
  },
  scoreBold: {
    fontWeight: "bold",
    color: "#FF9800",
    fontSize: 14,
  },
  menuTitle: {
    color: "#FFD700",
    fontWeight: "900",
    marginBottom: 12,
    marginLeft: 5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  menuCard: {
    borderRadius: 20,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 8,
  },
  menuCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuTextContent: {
    flex: 1,
  },
  menuTitle2: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  menuDescription: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 4,
  },
  menuSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 15,
  },
  infoCard: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    elevation: 4,
  },
  infoContent: {
    alignItems: "center",
    padding: 12,
  },
  infoTitle: {
    fontWeight: "bold",
    color: "#1A2980",
    marginTop: 8,
    fontSize: 13,
  },
  infoText: {
    color: "#666",
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },
});
