import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, Button, Title, Card, List, Dialog, Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function MainMenuScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  
  const [userData, setUserData] = useState({
    username:
      route.params?.playerName ||
      (auth.currentUser ? auth.currentUser.email?.split("@")[0] : "Guest"),
    score: route.params?.score || 0,
    photoURL: null,
  });

  const [showModeDialog, setShowModeDialog] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userSnap.exists()) {
            setUserData(userSnap.data());
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

  const levels = [
    {
      id: "1",
      title: "Level 1: Aritmatika Dasar (+/-)",
      requiredScore: 0,
      unlocked: true,
    },
    {
      id: "2",
      title: "Level 2: Perkalian & Pembagian",
      requiredScore: 50,
      unlocked: userData.score >= 50,
    },
    {
      id: "3",
      title: "Level 3: Pangkat & Akar",
      requiredScore: 150,
      unlocked: userData.score >= 150,
    },
    {
      id: "4",
      title: "Level 4: Aljabar Dasar",
      requiredScore: 300,
      unlocked: userData.score >= 300,
    },
    {
      id: "5",
      title: "Level 5: Pola Deret Angka",
      requiredScore: 500,
      unlocked: userData.score >= 500,
    },
    {
      id: "6",
      title: "Level 6: Aljabar Lanjut",
      requiredScore: 800,
      unlocked: userData.score >= 800,
    },
    {
      id: "7",
      title: "Level 7: Modulo & Sisa Bagi",
      requiredScore: 1200,
      unlocked: userData.score >= 1200,
    },
    {
      id: "8",
      title: "Level 8: Kombinasi Pecahan",
      requiredScore: 1800,
      unlocked: userData.score >= 1800,
    },
    {
      id: "9",
      title: "Level 9: Trigonometri Istimewa",
      requiredScore: 2500,
      unlocked: userData.score >= 2500,
    },
    {
      id: "10",
      title: "Level 10: Limit & Turunan",
      requiredScore: 3500,
      unlocked: userData.score >= 3500,
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.log("Error signing out: ", error);
      navigation.replace("Login");
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
    <LinearGradient colors={["#1A2980", "#26D0CE"]} style={[styles.container, { paddingTop: Math.max(insets.top + 10, 40) }]}>
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

      <View style={styles.contentContainer}>
        <Title style={styles.sectionTitle}>
          Pilih Arena Bertarung (Sudden Death)
        </Title>
        <View style={styles.levelsWrapper}>
          <FlatList
            data={levels}
            keyExtractor={(item) => item.id}
            renderItem={renderLevelItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
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
      </View>

      {/* Mode Selection Dialog */}
      <Portal>
        <Dialog visible={showModeDialog} onDismiss={() => setShowModeDialog(false)} style={styles.dialogStyle}>
          <Dialog.Title style={styles.dialogTitle}>Pilih Mode Permainan</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogSub}>Tentukan tingkat kesulitanmu untuk {selectedLevel?.title}:</Text>
            
            <TouchableOpacity activeOpacity={0.8} style={styles.modeCard} onPress={() => startGame("sudden_death")}>
              <LinearGradient colors={["#FF416C", "#FF4B2B"]} style={styles.modeGradient}>
                <MaterialCommunityIcons name="skull" size={28} color="#FFF" />
                <View style={styles.modeTextWrap}>
                  <Text style={styles.modeTitle}>Sudden Death</Text>
                  <Text style={styles.modeDesc}>1 Kali Salah / Waktu Habis = Kalah</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} style={styles.modeCard} onPress={() => startGame("lives")}>
              <LinearGradient colors={["#11998e", "#38ef7d"]} style={styles.modeGradient}>
                <MaterialCommunityIcons name="cards-heart" size={28} color="#FFF" />
                <View style={styles.modeTextWrap}>
                  <Text style={styles.modeTitle}>Mode Nyawa (3 ❤️)</Text>
                  <Text style={styles.modeDesc}>Punya 3 kesempatan sebelum Game Over</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowModeDialog(false)} textColor="#666">Batal</Button>
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
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#1A2980",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
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
    padding: 8,
    marginLeft: 10,
  },
  textWrap: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1A2980",
  },
  scoreText: {
    fontSize: 12,
    color: "#4a4a4a",
  },
  scoreBold: {
    fontWeight: "bold",
    color: "#FF9800",
    fontSize: 16,
  },
  logoutLabel: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 12,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
    paddingHorizontal: "5%",
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  sectionTitle: {
    color: "#FFD700",
    fontWeight: "900",
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  levelsWrapper: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    marginBottom: 12,
    elevation: 4,
    paddingVertical: 5,
  },
  lockedItem: {
    opacity: 0.7,
    backgroundColor: "rgba(230, 230, 230, 0.95)",
  },
  itemTitle: {
    fontWeight: "900",
    fontSize: 15,
    color: "#1A2980",
  },
  itemDesc: {
    color: "#555",
    fontSize: 12,
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
    marginBottom: 20,
    marginTop: 10,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#26D0CE",
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#26D0CE",
  },
  dialogStyle: {
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  dialogTitle: {
    textAlign: "center",
    fontWeight: "900",
    color: "#1A2980",
  },
  dialogSub: {
    textAlign: "center",
    marginBottom: 15,
    color: "#555",
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
    marginLeft: 15,
    flex: 1,
  },
  modeTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modeDesc: {
    color: "#eee",
    fontSize: 12,
    marginTop: 2,
  },
});
