import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_KEY = "@masterman:auth_state";
const NAVIGATION_KEY = "@masterman:navigation_state";

export const authStorage = {
  // Simpan auth state
  async saveAuthState(userData) {
    try {
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving auth state:", error);
    }
  },

  // Ambil auth state
  async getAuthState() {
    try {
      const data = await AsyncStorage.getItem(AUTH_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting auth state:", error);
      return null;
    }
  },

  // Hapus auth state (logout)
  async clearAuthState() {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
      await AsyncStorage.removeItem(NAVIGATION_KEY);
    } catch (error) {
      console.error("Error clearing auth state:", error);
    }
  },

  // Simpan navigation state terakhir
  async saveNavigationState(state) {
    try {
      await AsyncStorage.setItem(NAVIGATION_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving navigation state:", error);
    }
  },

  // Ambil navigation state terakhir
  async getNavigationState() {
    try {
      const data = await AsyncStorage.getItem(NAVIGATION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting navigation state:", error);
      return null;
    }
  },
};
