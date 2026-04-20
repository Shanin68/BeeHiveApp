import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();

  const handleSendReset = async () => {
    if (!email) {
      return;
    }
    setLoading(true);
    try {
      // TODO: Implement password reset logic with backend
      console.log("Send reset email to:", email);
      setSent(true);
    } catch (error) {
      console.error("Error sending reset email:", error);
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
          {/* Header */}
          <View style={styles.headerContainer}>
            <ThemedText
              type="title"
              style={[styles.title, { color: colors.primary }]}
            >
              Reset Password
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.text }]}>
              {sent
                ? "Check your email for reset instructions"
                : "Enter your email to receive a password reset link"}
            </ThemedText>
          </View>

          {/* Content */}
          {!sent ? (
            <View style={styles.formContainer}>
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
                  placeholderTextColor={
                    colorScheme === "dark" ? "#999" : "#999"
                  }
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: colors.primary },
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleSendReset}
                disabled={loading || !email}
              >
                <ThemedText style={[styles.buttonText, { color: "#333333" }]}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.successContainer}>
              <ThemedText style={styles.successText}>
                ✓ Email sent successfully!
              </ThemedText>
              <ThemedText style={styles.successSubtext}>
                Please check your email inbox for the password reset link.
              </ThemedText>
            </View>
          )}

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ThemedText
              style={[styles.backButtonText, { color: colors.primary }]}
            >
              ← Back to Login
            </ThemedText>
          </TouchableOpacity>
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
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
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
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  successText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 24,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
