import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  SectionList,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  Text,
  Button,
  Title,
  Card,
  List,
  Dialog,
  Portal,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  checkPhaseUnlock,
  getRequiredScore,
} from "../systems/progressionSystem";
import { isLevelUnlocked } from "../systems/challengeSystem";
import {
  getResponsiveFontSize,
  getResponsiveWidth,
  getResponsiveSpacing,
  getDeviceType,
  getNumColumns,
  getContentPadding,
  getResponsiveElevation,
  getMaxContentWidth,
} from "../utils/responsiveUtils";

export default function MainMenuScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const deviceType = getDeviceType();
  const numColumns = getNumColumns();

  // Responsive styles
  const responsiveStyles = useMemo(
    () => ({
      containerPadding: getContentPadding(),
      contentPadding: getResponsiveSpacing(15),
      profileCardPadding: getResponsiveSpacing(20),
      itemTitleSize: getResponsiveFontSize(14),
      itemDescSize: getResponsiveFontSize(12),
      sectionTitleSize: getResponsiveFontSize(18),
      elevation: getResponsiveElevation(4),
    }),
    [deviceType],
  );

  const [userData, setUserData] = useState({
    username:
      route.params?.playerName ||
      (auth.currentUser ? auth.currentUser.email?.split("@")[0] : "Guest"),
    score: route.params?.score || 0,
    photoURL: null,
    completedLevels: [],
    completedChallenges: [],
  });

  const [showModeDialog, setShowModeDialog] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

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
              data.lastLoginDate = today;
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

  const phasesData = [
    {
      title: "Fase 1: Aritmatika & Dasar",
      data: [
        { id: "1", title: "Level 1: Penjumlahan" },
        { id: "2", title: "Level 2: Pengurangan" },
        { id: "3", title: "Level 3: Perkalian" },
        { id: "4", title: "Level 4: Pembagian" },
        { id: "5", title: "Level 5: Operasi Campuran" },
        { id: "6", title: "Level 6: Pecahan" },
        { id: "7", title: "Level 7: Desimal" },
        { id: "8", title: "Level 8: Persen" },
        { id: "9", title: "Level 9: Rasio & Proporsi" },
        { id: "10", title: "Level 10: Perbandingan" },
        { id: "11", title: "Level 11: Pembulatan" },
        { id: "12", title: "Level 12: Estimasi Cepat" },
        { id: "13", title: "Level 13: Faktor & Kelipatan" },
        { id: "14", title: "Level 14: FPB & KPK" },
        { id: "15", title: "Level 15: Bilangan Negatif" },
      ],
    },
    {
      title: "Fase 2: Aljabar",
      data: [
        { id: "16", title: "Level 16: Variabel" },
        { id: "17", title: "Level 17: Persamaan Linear" },
        { id: "18", title: "Level 18: Pertidaksamaan" },
        { id: "19", title: "Level 19: Sistem Persamaan" },
        { id: "20", title: "Level 20: Aljabar Ekspresi" },
        { id: "21", title: "Level 21: Faktorisasi" },
        { id: "22", title: "Level 22: Kuadrat" },
        { id: "23", title: "Level 23: Fungsi" },
        { id: "24", title: "Level 24: Fungsi Linear" },
        { id: "25", title: "Level 25: Fungsi Kuadrat" },
        { id: "26", title: "Level 26: Polinomial" },
        { id: "27", title: "Level 27: Substitusi" },
        { id: "28", title: "Level 28: Eliminasi" },
        { id: "29", title: "Level 29: Grafik Fungsi" },
        { id: "30", title: "Level 30: Transformasi Fungsi" },
      ],
    },
    {
      title: "Fase 3: Geometri",
      data: [
        { id: "31", title: "Level 31: Bangun Datar" },
        { id: "32", title: "Level 32: Keliling & Luas" },
        { id: "33", title: "Level 33: Bangun Ruang" },
        { id: "34", title: "Level 34: Volume" },
        { id: "35", title: "Level 35: Sudut" },
        { id: "36", title: "Level 36: Segitiga" },
        { id: "37", title: "Level 37: Lingkaran" },
        { id: "38", title: "Level 38: Teorema Pythagoras" },
        { id: "39", title: "Level 39: Transformasi Geometri" },
        { id: "40", title: "Level 40: Simetri" },
        { id: "41", title: "Level 41: Koordinat Kartesius" },
        { id: "42", title: "Level 42: Jarak Titik" },
        { id: "43", title: "Level 43: Garis & Gradien" },
        { id: "44", title: "Level 44: Vektor Dasar" },
        { id: "45", title: "Level 45: Geometri Analitik" },
      ],
    },
  ];

  const phaseUnlocks = checkPhaseUnlock(userData);

  const sections = phasesData.map((phase, index) => {
    let isPhaseUnlocked = true;
    if (index === 1) isPhaseUnlocked = phaseUnlocks.phase2;
    if (index === 2) isPhaseUnlocked = phaseUnlocks.phase3;

    return {
      title: phase.title,
      isPhaseUnlocked,
      data: phase.data.map((lvl) => {
        const levelNum = parseInt(lvl.id, 10);
        const reqScore = getRequiredScore(levelNum);
        const unlocked = isPhaseUnlocked && isLevelUnlocked(userData, lvl);
        return {
          ...lvl,
          requiredScore: reqScore,
          unlocked,
        };
      }),
    };
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Error signing out: ", error);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  };

  const handleSelectLevel = (level) => {
    if (level.unlocked) {
      setSelectedLevel(level);
      setShowModeDialog(true);
    } else {
      Alert.alert(
        "Terkunci 🔒",
        `Kumpulkan skor setidaknya ${level.requiredScore} Pts untuk membuka area ini! (Skor saat ini: ${userData.score})`,
      );
    }
  };

  const startGame = (mode) => {
    setShowModeDialog(false);
    if (selectedLevel) {
      navigation.navigate("Gameplay", {
        levelId: selectedLevel.id,
        levelTitle: selectedLevel.title,
        gameMode: mode,
      });
    }
  };

  const renderLevelItem = ({ item }) => (
    <List.Item
      title={<Text style={styles.itemTitle}>{item.title}</Text>}
      description={
        <Text style={styles.itemDesc}>
          {item.unlocked
            ? "Tersedia Dimainkan"
            : `Butuh Skor Tertinggi: ${item.requiredScore}`}
        </Text>
      }
      left={(props) => (
        <View
          style={[
            styles.iconContainer,
            item.unlocked ? styles.iconUnlocked : styles.iconLocked,
          ]}
        >
          <List.Icon
            {...props}
            icon={item.unlocked ? "sword-cross" : "lock"}
            color="#fff"
          />
        </View>
      )}
      onPress={() => handleSelectLevel(item)}
      style={[styles.listItem, !item.unlocked && styles.lockedItem]}
    />
  );

  return (
    <LinearGradient
      colors={["#1A2980", "#26D0CE"]}
      style={[styles.container, { paddingTop: Math.max(insets.top + 10, 40) }]}
    >
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => navigation.navigate("Profile")}
            activeOpacity={0.7}
          >
            <View style={styles.avatarPlaceholder}>
              <MaterialCommunityIcons
                name="account-circle"
                size={45}
                color="#fff"
              />
            </View>
            <View style={styles.textWrap}>
              <Title style={styles.welcomeText} numberOfLines={1}>
                {userData.username}
              </Title>
              <View style={styles.scoreContainer}>
                <MaterialCommunityIcons name="star" size={14} color="#FF9800" />
                <Text style={styles.scoreText}>
                  {" "}
                  Skor:{" "}
                  <Text style={styles.scoreBold}>{userData.score} Pts</Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.profileIconButton}
          >
            <MaterialCommunityIcons name="cog" size={24} color="#1A2980" />
          </TouchableOpacity>
          <Button
            mode="text"
            icon="logout"
            onPress={handleLogout}
            labelStyle={styles.logoutLabel}
            compact
          >
            Logout
          </Button>
        </Card.Content>
      </Card>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("ChallengeMenu")}
        style={{
          marginHorizontal: "5%",
          marginBottom: 15,
          alignSelf: "center",
          width: "90%",
          maxWidth: 600,
        }}
      >
        <LinearGradient
          colors={["#FF416C", "#FF4B2B"]}
          style={{
            padding: 15,
            borderRadius: 15,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name="fire" size={32} color="#FFF" />
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FFF" }}>
              Arena Tantangan 🔥
            </Text>
            <Text style={{ fontSize: 12, color: "#FFE97D" }}>
              Daily & Weekly Challenge Mode
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Title style={styles.sectionTitle}>
          Pilih Arena Bertarung (Sudden Death)
        </Title>
        <View style={styles.levelsWrapper}>
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={renderLevelItem}
            renderSectionHeader={({ section: { title, isPhaseUnlocked } }) => (
              <View>
                <Text style={styles.phaseHeader}>
                  {title} {isPhaseUnlocked ? "" : " 🔒"}
                </Text>
                {!isPhaseUnlocked && (
                  <Text style={styles.phaseLockedDesc}>
                    Selesaikan{" "}
                    {title.includes("Fase 2") ? "70% Fase 1" : "60% Fase 2"}{" "}
                    untuk membuka!
                  </Text>
                )}
              </View>
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
          />
        </View>

        <Button
          mode="contained"
          icon="trophy"
          onPress={() => navigation.navigate("Leaderboard")}
          style={styles.leaderboardButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Lihat Papan Peringkat
        </Button>

        <Button
          mode="contained"
          icon="book-multiple"
          onPress={() => navigation.navigate("QuestionWarehouse")}
          style={styles.warehouseButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.warehouseLabel}
        >
          Gudang Soal (Latihan)
        </Button>
      </View>

      {/* Mode Selection Dialog */}
      <Portal>
        <Dialog
          visible={showModeDialog}
          onDismiss={() => setShowModeDialog(false)}
          style={styles.dialogStyle}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Pilih Mode Permainan
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogSub}>
              Tentukan tingkat kesulitanmu untuk {selectedLevel?.title}:
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modeCard}
              onPress={() => startGame("sudden_death")}
            >
              <LinearGradient
                colors={["#FF416C", "#FF4B2B"]}
                style={styles.modeGradient}
              >
                <MaterialCommunityIcons name="skull" size={28} color="#FFF" />
                <View style={styles.modeTextWrap}>
                  <Text style={styles.modeTitle}>Sudden Death</Text>
                  <Text style={styles.modeDesc}>
                    1 Kali Salah / Waktu Habis = Kalah
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modeCard}
              onPress={() => startGame("lives")}
            >
              <LinearGradient
                colors={["#11998e", "#38ef7d"]}
                style={styles.modeGradient}
              >
                <MaterialCommunityIcons
                  name="cards-heart"
                  size={28}
                  color="#FFF"
                />
                <View style={styles.modeTextWrap}>
                  <Text style={styles.modeTitle}>Mode Nyawa (3 ❤️)</Text>
                  <Text style={styles.modeDesc}>
                    Punya 3 kesempatan sebelum Game Over
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modeCard}
              onPress={() => startGame("20_questions")}
            >
              <LinearGradient
                colors={["#8E2DE2", "#4A00E0"]}
                style={styles.modeGradient}
              >
                <MaterialCommunityIcons
                  name="format-list-numbered"
                  size={28}
                  color="#FFF"
                />
                <View style={styles.modeTextWrap}>
                  <Text style={styles.modeTitle}>Mode 20 Soal 🎯</Text>
                  <Text style={styles.modeDesc}>
                    Selesaikan 20 soal bertahap hingga Final Boss!
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowModeDialog(false)} textColor="#666">
              Batal
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    marginHorizontal: "5%",
    maxWidth: 600,
    alignSelf: "center",
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    marginBottom: 15,
    elevation: 8,
  },
  profileContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 15,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1A2980",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    elevation: 3,
  },
  avatarInitial: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIconButton: {
    padding: 10,
    marginLeft: 8,
  },
  textWrap: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1A2980",
  },
  scoreText: {
    fontSize: 11,
    color: "#4a4a4a",
    marginLeft: 4,
  },
  scoreBold: {
    fontWeight: "bold",
    color: "#FF9800",
    fontSize: 14,
  },
  logoutLabel: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 11,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
    paddingHorizontal: 15,
    marginHorizontal: "5%",
    maxWidth: 800,
    width: "90%",
    alignSelf: "center",
  },
  sectionTitle: {
    color: "#FFD700",
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 12,
    marginLeft: 5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  levelsWrapper: {
    flex: 1,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  listItem: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    marginBottom: 12,
    elevation: 4,
    paddingVertical: 8,
  },
  lockedItem: {
    opacity: 0.7,
    backgroundColor: "rgba(230, 230, 230, 0.95)",
  },
  phaseHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFD700",
    backgroundColor: "rgba(26, 41, 128, 0.9)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
    elevation: 3,
  },
  phaseLockedDesc: {
    color: "#ffcccc",
    fontSize: 11,
    marginLeft: 12,
    marginBottom: 5,
    fontStyle: "italic",
  },
  itemTitle: {
    fontWeight: "900",
    fontSize: 13,
    color: "#1A2980",
  },
  itemDesc: {
    color: "#555",
    fontSize: 11,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
    borderRadius: 22,
    marginVertical: "auto",
    marginLeft: 5,
    marginRight: 10,
  },
  iconUnlocked: {
    backgroundColor: "#FF3D00",
  },
  iconLocked: {
    backgroundColor: "#9E9E9E",
  },
  leaderboardButton: {
    borderRadius: 15,
    backgroundColor: "#1A2980",
    elevation: 5,
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#26D0CE",
  },
  warehouseButton: {
    borderRadius: 15,
    backgroundColor: "#FF6B6B",
    elevation: 5,
    marginBottom: 20,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#FF8E72",
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#26D0CE",
  },
  warehouseLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
  dialogStyle: {
    backgroundColor: "#fff",
    borderRadius: 20,
    maxWidth: 500,
    alignSelf: "center",
  },
  dialogTitle: {
    textAlign: "center",
    fontWeight: "900",
    color: "#1A2980",
    fontSize: 16,
  },
  dialogSub: {
    textAlign: "center",
    marginBottom: 15,
    color: "#555",
    fontSize: 13,
  },
  modeCard: {
    marginBottom: 12,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4,
  },
  modeGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  modeTextWrap: {
    marginLeft: 12,
    flex: 1,
  },
  modeTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  modeDesc: {
    color: "#eee",
    fontSize: 11,
    marginTop: 2,
  },
});
