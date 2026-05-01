import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
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

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

          setLoading(false);
          navigation.replace("MainMenu", { playerName, score: currentScore });
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

      navigation.replace("MainMenu", { playerName, score: currentScore });
    } catch (error) {
      console.error(error);
      Alert.alert("Login Gagal", getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestPlay = () => {
    navigation.replace("MainMenu", { playerName: "Guest", score: 0 });
  };

  return (
    <LinearGradient colors={["#1A2980", "#26D0CE"]} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons
              name="calculator-variant"
              size={35}
              color="#fff"
            />
          </View>
        </View>
        <Title style={styles.title}>Master Math</Title>
        <Text style={styles.subtitle}>Selamat datang kembali!</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          outlineColor="#e0e0e0"
          activeOutlineColor="#26D0CE"
          left={<TextInput.Icon icon="email" color="#1A2980" />}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry={!showPassword}
          outlineColor="#e0e0e0"
          activeOutlineColor="#26D0CE"
          left={<TextInput.Icon icon="lock" color="#1A2980" />}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              color="#1A2980"
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <Button
          mode="contained"
          icon="login-variant"
          onPress={handleLogin}
          style={styles.button}
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
          style={[styles.button, styles.googleButton]}
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
            Belum punya akun? <Text style={styles.linkTextBold}>Daftar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: windowWidth * 0.9,
    maxWidth: 400,
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
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    color: "#1A2980",
    marginBottom: 5,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 25,
    color: "#4a4a4a",
    fontSize: 14,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: "#1A2980",
    elevation: 4,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderColor: "#D32F2F",
    borderWidth: 1.5,
    elevation: 0,
  },
  guestButton: {
    marginTop: 5,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  divider: {
    textAlign: "center",
    marginVertical: 10,
    color: "#757575",
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#1A2980",
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
    backgroundColor: "#1A2980",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#1A2980",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
