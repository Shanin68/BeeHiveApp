import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/utils/supabase";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) {
        setError(authError.message);
      } else {
        router.replace("/(drawer)/dashboard");
      }
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.contentContainer}>
          {/* Logo/Header */}
          <View style={styles.headerContainer}>
            <ThemedText
              type="title"
              style={[styles.title, { color: colors.primary }]}
            >
              🐝 BeeHive
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.text }]}>
              Find Your Perfect Home
            </ThemedText>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: "rgba(255, 0, 0, 0.1)" }]}>
              <ThemedText style={{ color: "#d32f2f", fontSize: 14 }}>
                {error}
              </ThemedText>
            </View>
          ) : null}

          {/* Login Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email Address</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? "#2a2a2a" : "#f5f5f5",
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Enter your email"
                placeholderTextColor={colorScheme === "dark" ? "#999" : "#999"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? "#2a2a2a" : "#f5f5f5",
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={colorScheme === "dark" ? "#999" : "#999"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Forgot Password Link */}
            <Link href="/forgot-password" asChild>
              <TouchableOpacity>
                <ThemedText
                  style={[styles.forgotPassword, { color: colors.primary }]}
                >
                  Forgot Password?
                </ThemedText>
              </TouchableOpacity>
            </Link>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.loginButton,
                { backgroundColor: colors.primary },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <ThemedText style={[styles.buttonText, { color: "#333333" }]}>
                {loading ? "Logging in..." : "Log In"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <ThemedText style={styles.dividerText}>Or</ThemedText>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
          </View>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <ThemedText style={styles.signupText}>
              Don't have an account?{" "}
            </ThemedText>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <ThemedText
                  style={[styles.signupLink, { color: colors.primary }]}
                >
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  formContainer: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 24,
    marginTop: 8,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    opacity: 0.6,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
