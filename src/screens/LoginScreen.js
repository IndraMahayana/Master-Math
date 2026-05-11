import React, { useState, useEffect, useMemo } from "react";
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
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getResponsiveFontSize,
  getResponsiveWidth,
  getResponsiveSpacing,
  getDeviceType,
  getResponsiveElevation,
} from "../utils/responsiveUtils";
import { authStorage } from "../utils/authStorage";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const deviceType = getDeviceType();

  // Responsive styles
  const responsiveStyles = useMemo(
    () => ({
      cardWidth: getResponsiveWidth(90, 500),
      titleSize: getResponsiveFontSize(32),
      subtitleSize: getResponsiveFontSize(14),
      padding: getResponsiveSpacing(30),
      inputMargin: getResponsiveSpacing(10),
      buttonMargin: getResponsiveSpacing(10),
      elevation: getResponsiveElevation(10),
    }),
    [deviceType],
  );

  // [PLACEHOLDER] SILAKAN GANTI DENGAN CLIENT ID MILIK ANDA DARI GOOGLE CLOUD CONSOLE
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "PLACEHOLDER_WEB_CLIENT_ID",
    androidClientId: "PLACEHOLDER_ANDROID_CLIENT_ID",
    iosClientId: "PLACEHOLDER_IOS_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      setLoading(true);
      signInWithCredential(auth, credential)
        .then(async (result) => {
          const user = result.user;
          // Cek apakah user sudah punya data document, jika belum buatkan
          let playerName = user.displayName || user.email.split("@")[0];
          let currentScore = 0;

          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (!userDoc.exists()) {
            await setDoc(doc(db, "users", user.uid), {
              username: playerName,
              email: user.email,
              score: 0,
              createdAt: new Date(),
            });
          } else {
            playerName = userDoc.data().username || playerName;
            currentScore = userDoc.data().score || 0;
          }

          // Simpan auth state
          await authStorage.saveAuthState({
            uid: user.uid,
            email: user.email,
            username: playerName,
            score: currentScore,
          });

          setLoading(false);
          navigation.reset({
            index: 0,
            routes: [
              { name: "AppTabs", params: { playerName, score: currentScore } },
            ],
          });
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert(
            "Gagal",
            "Terjadi kesalahan saat otentikasi Google: " + error.message,
          );
        });
    }
  }, [response]);

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Email atau Password salah!";
      case "auth/invalid-email":
        return "Format email tidak valid!";
      case "auth/operation-not-allowed":
        return "Gagal: Fitur Sign In Email/Password belum diaktifkan di Firebase Console Anda!";
      default:
        return "Terjadi kesalahan. Pastikan koneksi internet Anda stabil.";
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Peringatan",
        "Silakan isi email dan password terlebih dahulu!",
      );
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      let playerName = email.split("@")[0];
      let currentScore = 0;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          playerName = userDoc.data().username || playerName;
          currentScore = userDoc.data().score || 0;
        }
      } catch (dbError) {
        console.log("Firestore fetch error on login", dbError);
      }

      // Simpan auth state
      await authStorage.saveAuthState({
        uid: user.uid,
        email: user.email,
        username: playerName,
        score: currentScore,
      });

      navigation.reset({
        index: 0,
        routes: [
          { name: "AppTabs", params: { playerName, score: currentScore } },
        ],
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Login Gagal", getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestPlay = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "AppTabs", params: { playerName: "Guest", score: 0 } }],
    });
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
              Master Math
            </Title>
            <Text
              style={[
                styles.subtitle,
                { fontSize: responsiveStyles.subtitleSize },
              ]}
            >
              Selamat datang kembali!
            </Text>

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
              icon="login-variant"
              onPress={handleLogin}
              style={[
                styles.button,
                { marginTop: responsiveStyles.buttonMargin },
              ]}
              contentStyle={styles.buttonContent}
              loading={loading}
              disabled={loading}
            >
              Login
            </Button>

            <Text style={styles.divider}>ATAU</Text>

            <Button
              mode="outlined"
              icon="google"
              onPress={() => promptAsync()}
              style={[
                styles.button,
                styles.googleButton,
                { marginTop: responsiveStyles.buttonMargin },
              ]}
              contentStyle={styles.buttonContent}
              textColor="#D32F2F"
              disabled={!request || loading}
            >
              Masuk dengan Google
            </Button>

            <Button
              mode="text"
              icon="account-question-outline"
              onPress={handleGuestPlay}
              style={styles.guestButton}
              textColor="#4a4a4a"
              disabled={loading}
            >
              Play as Guest
            </Button>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>
                Belum punya akun?{" "}
                <Text style={styles.linkTextBold}>Daftar</Text>
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
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    padding: 30,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 107, 107, 0.3)",
    elevation: 12,
    shadowColor: "#1F1F1F",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  title: {
    fontWeight: "900",
    textAlign: "center",
    color: "#1F1F1F",
    marginBottom: 8,
    letterSpacing: 1,
    fontSize: 36,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 28,
    color: "#4a4a4a",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: "#fff",
  },
  button: {
    borderRadius: 16,
    backgroundColor: "#FF6B6B",
    elevation: 6,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderColor: "#2196F3",
    borderWidth: 2,
    elevation: 3,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  guestButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  divider: {
    textAlign: "center",
    marginVertical: 16,
    color: "#757575",
    fontWeight: "600",
    letterSpacing: 0.5,
    fontSize: 12,
  },
  linkContainer: {
    marginTop: 20,
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
    marginBottom: 24,
  },
  logoBadge: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 107, 107, 0.4)",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
