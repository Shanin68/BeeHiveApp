import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [editMode, setEditMode] = useState(false);

  // Dummy user data
  const userData = {
    name: "Sumaita Shanin",
    email: "sumaita.shanin@email.com",
    phone: "+880 1234-567890",
    memberSince: "January 2024",
    avatar: "SS",
    savedApartments: 12,
    reviews: 3,
  };

  const menuItems = [
    {
      icon: "❤️",
      label: "Saved Apartments",
      value: `${userData.savedApartments}`,
    },
    { icon: "⭐", label: "My Reviews", value: `${userData.reviews}` },
    { icon: "🏠", label: "Posted Properties", value: "0" },
    { icon: "💰", label: "Transactions", value: "5" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <View
            style={[styles.headerCard, { backgroundColor: colors.primary }]}
          >
            <View style={styles.avatarContainer}>
              <View
                style={[styles.avatar, { backgroundColor: "rgba(0,0,0,0.1)" }]}
              >
                <ThemedText style={styles.avatarText}>
                  {userData.avatar}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.userName}>{userData.name}</ThemedText>
            <ThemedText style={styles.memberSince}>
              Member since {userData.memberSince}
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.editButton,
                { backgroundColor: "rgba(0,0,0,0.1)" },
              ]}
              onPress={() => setEditMode(!editMode)}
            >
              <ThemedText style={styles.editButtonText}>
                {editMode ? "Done" : "Edit Profile"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <ThemedText
              style={[styles.sectionTitle, { color: colors.primary }]}
            >
              CONTACT INFORMATION
            </ThemedText>
            <View style={[styles.infoCard, { borderColor: colors.border }]}>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Email</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {userData.email}
                </ThemedText>
              </View>
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Phone</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {userData.phone}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.section}>
            <View style={styles.statsGrid}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.statCard, { borderColor: colors.border }]}
                >
                  <ThemedText style={styles.statIcon}>{item.icon}</ThemedText>
                  <ThemedText style={styles.statValue}>{item.value}</ThemedText>
                  <ThemedText style={styles.statLabel}>{item.label}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Account Settings Section */}
          <View style={styles.section}>
            <ThemedText
              style={[styles.sectionTitle, { color: colors.primary }]}
            >
              ACCOUNT
            </ThemedText>
            <View style={[styles.menuCard, { backgroundColor: colors.border }]}>
              <TouchableOpacity style={styles.menuItem}>
                <ThemedText style={styles.menuLabel}>
                  Change Password
                </ThemedText>
                <ThemedText style={styles.menuArrow}>›</ThemedText>
              </TouchableOpacity>
              <View
                style={[styles.menuDivider, { backgroundColor: colors.border }]}
              />
              <TouchableOpacity style={styles.menuItem}>
                <ThemedText style={styles.menuLabel}>
                  Two-Factor Authentication
                </ThemedText>
                <ThemedText style={styles.menuArrow}>›</ThemedText>
              </TouchableOpacity>
              <View
                style={[styles.menuDivider, { backgroundColor: colors.border }]}
              />
              <TouchableOpacity style={styles.menuItem}>
                <ThemedText style={styles.menuLabel}>
                  Privacy Settings
                </ThemedText>
                <ThemedText style={styles.menuArrow}>›</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    color: "#333",
  },
  memberSince: {
    fontSize: 12,
    opacity: 0.6,
    color: "#333",
    marginBottom: 16,
    fontWeight: "500",
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.6,
    textAlign: "center",
    fontWeight: "600",
  },
  menuCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  menuArrow: {
    fontSize: 20,
    opacity: 0.4,
  },
  menuDivider: {
    height: 1,
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.3,
  },
  spacer: {
    height: 20,
  },
});
