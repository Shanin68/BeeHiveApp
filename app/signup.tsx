import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
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

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    phoneNumber: "",
    nidNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleSignup = async () => {
    // Validation
    if (
      !formData.email ||
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.nidNumber ||
      !formData.password
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement signup logic with backend
      console.log("Signup with:", formData);
      // Navigate to drawer home after signup
      router.replace("/(drawer)/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    label: string,
    field: string,
    placeholder: string,
    keyboardType: string = "default",
    required: boolean = false,
  ) => (
    <View style={styles.inputGroup}>
      <ThemedText style={styles.label}>
        {label}
        {required && (
          <ThemedText style={{ color: colors.primary }}>*</ThemedText>
        )}
      </ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colorScheme === "dark" ? "#2a2a2a" : "#f5f5f5",
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colorScheme === "dark" ? "#999" : "#999"}
        value={formData[field as keyof typeof formData]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType as any}
        editable={!loading}
      />
    </View>
  );

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
              🐝 Create Account
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.text }]}>
              Join BeeHive Community
            </ThemedText>
          </View>

          {/* Error Message */}
          {error ? (
            <View
              style={[
                styles.errorContainer,
                { backgroundColor: "rgba(255, 0, 0, 0.1)" },
              ]}
            >
              <ThemedText style={{ color: "#d32f2f", fontSize: 14 }}>
                {error}
              </ThemedText>
            </View>
          ) : null}

          {/* Signup Form */}
          <View style={styles.formContainer}>
            {/* Email */}
            {renderInputField(
              "Email Address",
              "email",
              "Enter your email",
              "email-address",
              true,
            )}

            {/* Full Name */}
            {renderInputField(
              "Full Name",
              "fullName",
              "Enter your full name",
              "default",
              true,
            )}

            {/* Date of Birth */}
            {renderInputField(
              "Date of Birth",
              "dateOfBirth",
              "DD/MM/YYYY",
              "default",
              false,
            )}

            {/* Nationality */}
            {renderInputField(
              "Nationality",
              "nationality",
              "Enter your nationality",
              "default",
              false,
            )}

            {/* Phone Number */}
            {renderInputField(
              "Phone Number",
              "phoneNumber",
              "Enter your phone number",
              "phone-pad",
              true,
            )}

            {/* NID Number */}
            {renderInputField(
              "NID Number",
              "nidNumber",
              "Enter your NID number",
              "default",
              true,
            )}

            {/* Password */}
            {renderInputField(
              "Password",
              "password",
              "Enter your password (min 6 characters)",
              "default",
              true,
            )}

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                Confirm Password
                <ThemedText style={{ color: colors.primary }}>*</ThemedText>
              </ThemedText>
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
                placeholder="Confirm your password"
                placeholderTextColor={colorScheme === "dark" ? "#999" : "#999"}
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Terms & Conditions */}
            <View style={styles.termsContainer}>
              <ThemedText style={styles.termsText}>
                By signing up, you agree to our Terms & Conditions
              </ThemedText>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.signupButton,
                { backgroundColor: colors.primary },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleSignup}
              disabled={loading}
            >
              <ThemedText style={[styles.buttonText, { color: "#333333" }]}>
                {loading ? "Creating Account..." : "Create Account"}
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

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <ThemedText style={styles.loginText}>
              Already have an account?{" "}
            </ThemedText>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <ThemedText
                  style={[styles.loginLink, { color: colors.primary }]}
                >
                  Log In
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
  },
  contentContainer: {
    padding: 24,
    paddingVertical: 32,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
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
  termsContainer: {
    marginVertical: 16,
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.6,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  signupButton: {
    marginBottom: 8,
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
    marginVertical: 20,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
