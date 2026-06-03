import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  List,
  ActivityIndicator,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../firebaseConfig";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getResponsiveFontSize,
  getResponsiveSpacing,
  getDeviceType,
  getContentPadding,
} from "../utils/responsiveUtils";
import { authStorage } from "../utils/authStorage";

export default function ProfileScreen({ navigation }) {
  const deviceType = getDeviceType();

  // Responsive styles
  const responsiveStyles = useMemo(
    () => ({
      containerPadding: getContentPadding(),
      titleFontSize: getResponsiveFontSize(28),
      labelFontSize: getResponsiveFontSize(14),
      inputPadding: getResponsiveSpacing(12),
    }),
    [deviceType],
  );
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [history, setHistory] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadUserData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      console.log("📱 Loading user data...");

      if (!auth.currentUser) {
        console.log("❌ No current user");
        setLoading(false);
        return;
      }

      console.log("👤 Current User UID:", auth.currentUser.uid);

      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUsername(data.username || auth.currentUser.email.split("@")[0]);
        setNewUsername(data.username || auth.currentUser.email.split("@")[0]);
        setPhotoURL(data.photoURL || null);
        setTotalScore(data.score || 0);
      } else {
        console.log("User document does not exist");
      }

      // Load History dari gameHistory collection instead
      try {
        const historyRef = collection(db, "gameHistory");
        const q = query(
          historyRef,
          where("uid", "==", auth.currentUser.uid),
          orderBy("createdAt", "desc"),
          limit(10),
        );
        const querySnapshot = await getDocs(q);

        console.log("📊 Game History Query Result:", {
          totalDocs: querySnapshot.size,
          uid: auth.currentUser.uid,
        });

        const historyData = [];
        querySnapshot.forEach((doc) => {
          const gameData = doc.data();
          console.log("📄 Game Doc:", gameData);

          historyData.push({
            id: doc.id,
            levelTitle: gameData.levelTitle || `Level ${gameData.levelId} - ${gameData.mode || "unknown"}`,
            date:
              gameData.createdAt?.toDate?.() ||
              new Date(gameData.createdAt) ||
              new Date(),
            score: gameData.score || 0,
          });
        });

        console.log("✅ History Data Loaded:", historyData.length, "items");
        setHistory(historyData);
      } catch (historyError) {
        console.error("❌ Error loading history:", historyError);
        console.error("Error details:", {
          message: historyError.message,
          code: historyError.code,
        });
        setHistory([]);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      Alert.alert("Error", "Gagal memuat data profil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (newUsername.trim() === "" || newUsername === username) return;
    setActionLoading(true);

    try {
      // Cek Unik
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", newUsername));
      const querySnapshot = await getDocs(q);

      if (
        !querySnapshot.empty &&
        querySnapshot.docs[0].id !== auth.currentUser.uid
      ) {
        Alert.alert("Gagal", "Username tersebut sudah dipakai orang lain!");
        return;
      }

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        username: newUsername,
      });
      setUsername(newUsername);
      Alert.alert("✅ Sukses", "Username berhasil diupdate!");
    } catch (error) {
      Alert.alert("❌ Gagal", error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert("Isi Kolom", "Harap isi password lama dan password baru.");
      return;
    }
    setActionLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        oldPassword,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert("Sukses", "Password berhasil diganti!");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      Alert.alert(
        "Gagal",
        "Pastikan Password lama Anda benar. Atau apakah Anda terdaftar menggunakan Google? " +
          error.message,
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Hapus auth state
      await authStorage.clearAuthState();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Error signing out: ", error);
      // Tetap clear state walaupun ada error
      await authStorage.clearAuthState();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#0F2027", "#203A43", "#2C5364"]}
        style={styles.centerContainer}
      >
        <ActivityIndicator size="large" color="#FFD700" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.avatarSection}>
            <View>
              {photoURL ? (
                <Image source={{ uri: photoURL }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {username.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.usernameTitle}>{username}</Text>
            <Text style={styles.emailSubtitle}>{auth.currentUser?.email}</Text>
            <View style={styles.scoreBadge}>
              <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.scoreBadgeText}>
                Total Skor: {totalScore}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
          <Card.Content>
            <TextInput
              label="Username Baru"
              value={newUsername}
              onChangeText={setNewUsername}
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#FFD700"
              textColor="#FFF"
              theme={{
                colors: {
                  background: "rgba(255,255,255,0.05)",
                  onSurfaceVariant: "rgba(255,255,255,0.5)",
                },
              }}
              right={
                <TextInput.Icon
                  icon="account-edit"
                  onPress={handleUpdateUsername}
                  color="#FFD700"
                />
              }
            />
            {newUsername !== username && (
              <Button
                mode="contained"
                onPress={handleUpdateUsername}
                loading={actionLoading}
                style={styles.actionButton}
                buttonColor="#FFD700"
                textColor="#000"
              >
                Simpan Username
              </Button>
            )}

            <View style={styles.divider} />

            <TextInput
              label="Password Lama"
              value={oldPassword}
              onChangeText={setOldPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              activeOutlineColor="#FFD700"
              textColor="#FFF"
              theme={{
                colors: {
                  background: "rgba(255,255,255,0.05)",
                  onSurfaceVariant: "rgba(255,255,255,0.5)",
                },
              }}
            />
            <TextInput
              label="Password Baru"
              value={newPassword}
              onChangeText={setNewPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              activeOutlineColor="#FFD700"
              textColor="#FFF"
              theme={{
                colors: {
                  background: "rgba(255,255,255,0.05)",
                  onSurfaceVariant: "rgba(255,255,255,0.5)",
                },
              }}
            />
            <Button
              mode="contained"
              onPress={handleChangePassword}
              loading={actionLoading}
              style={styles.actionButton}
              buttonColor="#D4AF37"
              textColor="#000"
            >
              Ganti Password
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Riwayat Permainan</Text>
          <Card.Content>
            {history.length > 0 ? (
              history.map((game, i) => (
                <List.Item
                  key={i}
                  title={game.levelTitle}
                  titleStyle={styles.historyTitle}
                  description={new Date(game.date).toLocaleString("id-ID")}
                  descriptionStyle={styles.historyDesc}
                  right={(props) => (
                    <Text {...props} style={styles.scoreText}>
                      {game.score} Pts
                    </Text>
                  )}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="gamepad-variant"
                      color="#FFD700"
                    />
                  )}
                  style={styles.historyItem}
                />
              ))
            ) : (
              <Text style={styles.emptyHistory}>
                Belum ada riwayat permainan.
              </Text>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={[
                styles.actionButton,
                { backgroundColor: "rgba(255, 65, 108, 0.8)" },
              ]}
              textColor="#FFF"
            >
              Keluar (Logout)
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    elevation: 0,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(212, 175, 55, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  avatarInitial: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "900",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  editBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  usernameTitle: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "900",
    color: "#FFD700",
    letterSpacing: 0.5,
  },
  emailSubtitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    marginBottom: 12,
    fontWeight: "500",
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  scoreBadgeText: {
    color: "#FFD700",
    fontWeight: "900",
    marginLeft: 6,
    letterSpacing: 0.2,
  },
  sectionTitle: {
    margin: 16,
    marginBottom: 10,
    fontWeight: "900",
    color: "#FFD700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  actionButton: {
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 15,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 5,
  },
  historyTitle: {
    color: "#E0E0E0",
    fontWeight: "bold",
  },
  historyDesc: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  scoreText: {
    alignSelf: "center",
    fontWeight: "bold",
    color: "#FFD700",
    fontSize: 16,
  },
  emptyHistory: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.5)",
    marginVertical: 20,
    fontStyle: "italic",
  },
});
