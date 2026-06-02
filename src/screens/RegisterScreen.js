import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, TextInput, Button, Title } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getResponsiveFontSize,
  getResponsiveWidth,
  getResponsiveSpacing,
  getDeviceType,
  getResponsiveElevation,
} from "../utils/responsiveUtils";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const deviceType = getDeviceType();

  // Responsive styles
  const responsiveStyles = useMemo(
    () => ({
      cardWidth: getResponsiveWidth(90, 500),
      titleSize: getResponsiveFontSize(28),
      subtitleSize: getResponsiveFontSize(14),
      padding: getResponsiveSpacing(30),
      inputMargin: getResponsiveSpacing(8),
      buttonMargin: getResponsiveSpacing(15),
      elevation: getResponsiveElevation(10),
    }),
    [deviceType],
  );

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "Email ini sudah terdaftar di Firebase Auth! Silakan gunakan email lain atau login.";
      case "auth/invalid-email":
        return "Format email tidak valid! Contoh: user@example.com";
      case "auth/weak-password":
        return "Password terlalu lemah. Minimal 6 karakter dengan campuran huruf dan angka.";
      case "auth/operation-not-allowed":
        return "Fitur registrasi email/password belum diaktifkan di Firebase Console!";
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan. Coba lagi nanti.";
      default:
        return "Terjadi kesalahan: " + errorCode;
    }
  };

  const handleRegister = async () => {
    setErrorMessage(""); // Clear previous errors

    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("❌ Semua kolom wajib diisi!");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("❌ Password minimal 6 karakter!");
      return;
    }

    setLoading(true);
    try {
      // ✅ Cek apakah username sudah terdaftar
      const usersRef = collection(db, "users");
      const usernameQuery = query(
        usersRef,
        where("username", "==", username.trim()),
      );
      const usernameSnapshot = await getDocs(usernameQuery);

      if (!usernameSnapshot.empty) {
        setErrorMessage(
          `❌ Username "${username}" sudah digunakan orang lain. Gunakan username lain.`,
        );
        setLoading(false);
        return;
      }

      // ✅ Cek apakah email sudah terdaftar
      const emailQuery = query(
        usersRef,
        where("email", "==", email.trim().toLowerCase()),
      );
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        setErrorMessage(
          `❌ Email "${email}" sudah terdaftar. Gunakan email lain atau login.`,
        );
        setLoading(false);
        return;
      }

      // ✅ Buat akun baru
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const user = userCredential.user;

      // ✅ Simpan data user ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username.trim(),
        email: email.trim().toLowerCase(),
        score: 0,
        level: 1,
        completedLevels: [],
        completedChallenges: [],
        photoURL: "",
        createdAt: new Date(),
        lastLoginDate: new Date().toISOString(),
        totalCoins: 0,
        achievements: [],
        stats: {
          totalGamesPlayed: 0,
          totalCorrect: 0,
          totalWrong: 0,
          averageAccuracy: 0,
          bestStreak: 0,
        },
      });

      // ✅ JANGAN simpan auth state - user harus login manual
      // Logout user agar harus login
      await auth.signOut();

      // ✅ Redirect ke Login dengan pesan sukses
      Alert.alert(
        "✅ Registrasi Berhasil!",
        `Akun "${username}" telah dibuat.\n\nSilakan login dengan email dan password Anda.`,
        [
          {
            text: "Masuk Sekarang",
            onPress: () => navigation.replace("Login"),
          },
        ],
      );
    } catch (error) {
      console.error("Register error:", error);
      setErrorMessage(`❌ ${getErrorMessage(error.code)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#1F1F1F", "#2A2A2A"]}
          style={styles.gradientContainer}
        >
          <View style={[styles.card, { width: responsiveStyles.cardWidth }]}>
            <View style={styles.logoContainer}>
              <View
                style={[
                  styles.logoBadge,
                  { elevation: responsiveStyles.elevation },
                ]}
              >
                <MaterialCommunityIcons
                  name="calculator-variant"
                  size={getResponsiveFontSize(35)}
                  color="#fff"
                />
              </View>
            </View>
            <Title
              style={[styles.title, { fontSize: responsiveStyles.titleSize }]}
            >
              Buat Akun
            </Title>
            <Text
              style={[
                styles.subtitle,
                { fontSize: responsiveStyles.subtitleSize },
              ]}
            >
              Bergabunglah dengan Master Math
            </Text>

            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              style={[
                styles.input,
                { marginBottom: responsiveStyles.inputMargin },
              ]}
              mode="outlined"
              autoCapitalize="words"
              outlineColor="#e0e0e0"
              activeOutlineColor="#FF6B6B"
              left={<TextInput.Icon icon="account" color="#FF6B6B" />}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={[
                styles.input,
                { marginBottom: responsiveStyles.inputMargin },
              ]}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              outlineColor="#e0e0e0"
              activeOutlineColor="#FF6B6B"
              left={<TextInput.Icon icon="email" color="#FF6B6B" />}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              style={[
                styles.input,
                { marginBottom: responsiveStyles.inputMargin },
              ]}
              mode="outlined"
              secureTextEntry={!showPassword}
              outlineColor="#e0e0e0"
              activeOutlineColor="#FF6B6B"
              left={<TextInput.Icon icon="lock" color="#FF6B6B" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  color="#FF6B6B"
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <Button
              mode="contained"
              icon="account-plus"
              onPress={handleRegister}
              style={[
                styles.button,
                { marginTop: responsiveStyles.buttonMargin },
              ]}
              contentStyle={styles.buttonContent}
              loading={loading}
              disabled={loading}
            >
              Daftar dengan Email
            </Button>

            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>
                Sudah punya akun? <Text style={styles.linkTextBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 30,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  title: {
    fontWeight: "900",
    textAlign: "center",
    color: "#FF6B6B",
    marginBottom: 5,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    color: "#4a4a4a",
  },
  input: {
    backgroundColor: "#fff",
  },
  button: {
    borderRadius: 15,
    backgroundColor: "#FF6B6B",
    elevation: 5,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderColor: "#D32F2F",
    borderWidth: 1.5,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  divider: {
    textAlign: "center",
    marginVertical: 15,
    color: "#757575",
    fontWeight: "bold",
  },
  errorMessage: {
    color: "#D32F2F",
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  linkContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  linkText: {
    color: "#FF6B6B",
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: "bold",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
