import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChallengeMenuScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const handleStartChallenge = (mode) => {
    // Mode bisa "daily_challenge" atau "weekly_challenge"
    navigation.navigate("Gameplay", {
      gameMode: mode,
      levelId: "challenge", // Placeholder levelId, akan diacak dalam GameplayScreen
      levelTitle:
        mode === "daily_challenge" ? "Tantangan Harian" : "Tantangan Mingguan",
    });
  };

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={[styles.container, { paddingTop: Math.max(insets.top + 10, 40) }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Arena Tantangan 🔥</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleStartChallenge("daily_challenge")}
          >
            <LinearGradient
              colors={["#FF416C", "#FF4B2B"]}
              style={styles.cardGradient}
            >
              <MaterialCommunityIcons
                name="calendar-today"
                size={40}
                color="#FFF"
              />
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>Tantangan Harian</Text>
                <Text style={styles.cardDesc}>
                  Selesaikan 20 soal acak dari semua materi!
                </Text>
                <Text style={styles.cardMeta}>
                  ⏳ Mode Nyawa (3 Kesempatan)
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleStartChallenge("weekly_challenge")}
          >
            <LinearGradient
              colors={["#8E2DE2", "#4A00E0"]}
              style={styles.cardGradient}
            >
              <MaterialCommunityIcons
                name="calendar-week"
                size={40}
                color="#FFF"
              />
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>Tantangan Mingguan</Text>
                <Text style={styles.cardDesc}>
                  Uji daya tahanmu! 100 soal acak menantimu.
                </Text>
                <Text style={styles.cardMeta}>
                  ⏳ Mode Nyawa (3 Kesempatan)
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("LeaderboardTab", {
                screen: "LeaderboardScreen",
                params: { defaultTab: "challenge" },
              })
            }
          >
            <LinearGradient
              colors={["#D4AF37", "#FFD700"]}
              style={styles.cardGradient}
            >
              <MaterialCommunityIcons
                name="trophy-award"
                size={40}
                color="#FFF"
              />
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>Papan Peringkat Tantangan</Text>
                <Text style={styles.cardDesc}>
                  Lihat siapa yang bertahan dan meraih skor tertinggi di mode
                  ini!
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    paddingRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 20,
    borderRadius: 20,
    elevation: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  cardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 22,
  },
  cardTextWrap: {
    marginLeft: 15,
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 5,
  },
  cardMeta: {
    fontSize: 12,
    color: "#FFE97D",
    fontWeight: "bold",
  },
});
