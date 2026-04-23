import React, { useState, useEffect } from "react";
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
  Title,
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

export default function ProfileScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [history, setHistory] = useState([]);

  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUsername(data.username || auth.currentUser.email.split("@")[0]);
        setNewUsername(data.username || auth.currentUser.email.split("@")[0]);
        setPhotoURL(data.photoURL || null);
      }

      // Load History
      const historyRef = collection(
        db,
        `users/${auth.currentUser.uid}/history`,
      );
      const q = query(historyRef, orderBy("date", "desc"), limit(10));
      const querySnapshot = await getDocs(q);

      const historyData = [];
      querySnapshot.forEach((doc) => {
        historyData.push({ id: doc.id, ...doc.data() });
      });
      setHistory(historyData);
    } catch (error) {
      console.error(error);
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
      Alert.alert("Sukses", "Username berhasil diperbarui!");
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan: " + error.message);
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

  if (loading) {
    return (
      <LinearGradient
        colors={["#1A2980", "#26D0CE"]}
        style={styles.centerContainer}
      >
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#1A2980", "#26D0CE"]} style={styles.container}>
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
            <Title style={styles.usernameTitle}>{username}</Title>
            <Text style={styles.emailSubtitle}>{auth.currentUser?.email}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Title style={styles.sectionTitle}>Pengaturan Akun</Title>
          <Card.Content>
            <TextInput
              label="Username Baru"
              value={newUsername}
              onChangeText={setNewUsername}
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#1A2980"
              right={
                <TextInput.Icon
                  icon="account-edit"
                  onPress={handleUpdateUsername}
                  color="#1A2980"
                />
              }
            />
            {newUsername !== username && (
              <Button
                mode="contained"
                onPress={handleUpdateUsername}
                loading={actionLoading}
                style={styles.actionButton}
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
              activeOutlineColor="#1A2980"
            />
            <TextInput
              label="Password Baru"
              value={newPassword}
              onChangeText={setNewPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              activeOutlineColor="#1A2980"
            />
            <Button
              mode="contained"
              onPress={handleChangePassword}
              loading={actionLoading}
              style={styles.actionButton}
              color="#FF9800"
            >
              Ganti Password
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Title style={styles.sectionTitle}>Riwayat Permainan</Title>
          <Card.Content>
            {history.length > 0 ? (
              history.map((game, i) => (
                <List.Item
                  key={i}
                  title={game.levelTitle}
                  description={new Date(game.date).toLocaleString("id-ID")}
                  right={(props) => (
                    <Text {...props} style={styles.scoreText}>
                      {game.score} Pts
                    </Text>
                  )}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="gamepad-variant"
                      color="#26D0CE"
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
    marginBottom: 15,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    elevation: 4,
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
    borderColor: "#26D0CE",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1A2980",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#26D0CE",
  },
  avatarInitial: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1A2980",
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
    marginTop: 15,
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A2980",
  },
  emailSubtitle: {
    color: "#666",
    fontSize: 14,
  },
  sectionTitle: {
    margin: 15,
    marginBottom: 0,
    fontWeight: "bold",
    color: "#1A2980",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  actionButton: {
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 15,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 5,
  },
  scoreText: {
    alignSelf: "center",
    fontWeight: "bold",
    color: "#FF9800",
    fontSize: 16,
  },
  emptyHistory: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
    fontStyle: "italic",
  },
});
