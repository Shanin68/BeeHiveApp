import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Profile {
  full_name: string | null;
  phone_number: string | null;
  nid_number: string | null;
  date_of_birth: string | null;
  nationality: string | null;
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string>("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [postedPropertiesCount, setPostedPropertiesCount] = useState(0);
  const [savedApartmentsCount, setSavedApartmentsCount] = useState(0);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Get the current auth session
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? null);

      // Format member since date
      const joined = new Date(user.created_at);
      setMemberSince(
        joined.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      );

      // Fetch profile row
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(
          "full_name, phone_number, nid_number, date_of_birth, nationality",
        )
        .eq("id", user.id)
        .single();

      if (!profileError && profileData) {
        setProfile(profileData);
        setEditForm(profileData);
      }

      // Get posted properties count
      const { data: userListings, error: countError } = await supabase
        .from("listings")
        .select("id")
        .eq("user_id", user.id);

      if (!countError && userListings) {
        setPostedPropertiesCount(userListings.length);
      } else {
        console.error("Error fetching listings count:", countError);
      }

      // Get saved apartments count
      const { data: savedListings, error: savedError } = await supabase
        .from("favourites")
        .select("id")
        .eq("user_id", user.id);

      if (!savedError && savedListings) {
        setSavedApartmentsCount(savedListings.length);
      } else {
        console.error("Error fetching saved apartments count:", savedError);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editForm) return;
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name,
          phone_number: editForm.phone_number,
          nid_number: editForm.nid_number,
          date_of_birth: editForm.date_of_birth,
          nationality: editForm.nationality,
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile(editForm);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/login");
        },
      },
    ]);
  };

  // Derive initials from full name or email
  const getInitials = () => {
    const name = profile?.full_name;
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2)
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0][0].toUpperCase();
    }
    return email?.[0]?.toUpperCase() ?? "?";
  };

  const menuItems = [
    {
      icon: "❤️",
      label: "Saved Apartments",
      value: savedApartmentsCount.toString(),
    },
    { icon: "⭐", label: "My Reviews", value: "0" },
    {
      icon: "🏠",
      label: "Posted Properties",
      value: postedPropertiesCount.toString(),
    },
    { icon: "💰", label: "Transactions", value: "0" },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={{ marginTop: 12, opacity: 0.6 }}>
            Loading profile...
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

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
                style={[styles.avatar, { backgroundColor: "rgba(0,0,0,0.15)" }]}
              >
                <ThemedText style={styles.avatarText}>
                  {getInitials()}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.userName}>
              {profile?.full_name ?? email ?? "BeeHive User"}
            </ThemedText>
            <ThemedText style={styles.memberSince}>
              🐝 Member since {memberSince}
            </ThemedText>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText
                style={[
                  styles.sectionTitle,
                  { color: colors.primary, marginBottom: 0 },
                ]}
              >
                CONTACT INFORMATION
              </ThemedText>
              {!isEditing && (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <ThemedText
                    style={[styles.editButtonText, { color: colors.primary }]}
                  >
                    EDIT
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
            <View style={[styles.infoCard, { borderColor: colors.border }]}>
              <InfoRow label="Email" value={email ?? "—"} />
              <RowDivider color={colors.border} />

              {isEditing && editForm ? (
                <>
                  <EditInfoRow
                    label="Full Name"
                    value={editForm.full_name ?? ""}
                    onChangeText={(text) =>
                      setEditForm({ ...editForm, full_name: text })
                    }
                    colors={colors}
                  />
                  <RowDivider color={colors.border} />
                  <EditInfoRow
                    label="Phone"
                    value={editForm.phone_number ?? ""}
                    onChangeText={(text) =>
                      setEditForm({ ...editForm, phone_number: text })
                    }
                    colors={colors}
                  />
                  <RowDivider color={colors.border} />
                  <EditInfoRow
                    label="NID Number"
                    value={editForm.nid_number ?? ""}
                    onChangeText={(text) =>
                      setEditForm({ ...editForm, nid_number: text })
                    }
                    colors={colors}
                  />
                  <RowDivider color={colors.border} />
                  <EditInfoRow
                    label="Date of Birth"
                    value={editForm.date_of_birth ?? ""}
                    onChangeText={(text) =>
                      setEditForm({ ...editForm, date_of_birth: text })
                    }
                    colors={colors}
                  />
                  <RowDivider color={colors.border} />
                  <EditInfoRow
                    label="Nationality"
                    value={editForm.nationality ?? ""}
                    onChangeText={(text) =>
                      setEditForm({ ...editForm, nationality: text })
                    }
                    colors={colors}
                  />
                </>
              ) : (
                <>
                  <InfoRow label="Phone" value={profile?.phone_number ?? "—"} />
                  <RowDivider color={colors.border} />
                  <InfoRow
                    label="NID Number"
                    value={profile?.nid_number ?? "—"}
                  />
                  <RowDivider color={colors.border} />
                  <InfoRow
                    label="Date of Birth"
                    value={profile?.date_of_birth ?? "—"}
                  />
                  <RowDivider color={colors.border} />
                  <InfoRow
                    label="Nationality"
                    value={profile?.nationality ?? "—"}
                  />
                </>
              )}
            </View>

            {isEditing && (
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={[styles.cancelButton, { borderColor: colors.border }]}
                  onPress={handleCancelEdit}
                >
                  <ThemedText style={{ fontWeight: "600" }}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <ThemedText style={{ fontWeight: "700", color: "#333" }}>
                      Save Profile
                    </ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Quick Stats */}
          <View style={styles.section}>
            <ThemedText
              style={[styles.sectionTitle, { color: colors.primary }]}
            >
              ACTIVITY
            </ThemedText>
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

          {/* Account Settings */}
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
                  Privacy Settings
                </ThemedText>
                <ThemedText style={styles.menuArrow}>›</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Out */}
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: "#e53935" }]}
            onPress={handleSignOut}
          >
            <ThemedText style={styles.logoutButtonText}>Sign Out</ThemedText>
          </TouchableOpacity>

          <View style={styles.spacer} />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      <ThemedText style={styles.infoValue} numberOfLines={1}>
        {value}
      </ThemedText>
    </View>
  );
}

function RowDivider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

function EditInfoRow({
  label,
  value,
  onChangeText,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  colors: typeof Colors.light;
}) {
  return (
    <View style={styles.infoRow}>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      <TextInput
        style={[
          styles.infoInput,
          { color: colors.text, borderColor: colors.border },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={`Enter ${label}`}
        placeholderTextColor={colors.text + "80"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarContainer: { marginBottom: 16 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
  },
  avatarText: {
    fontSize: 34,
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
    color: "#333",
    opacity: 0.65,
    fontWeight: "500",
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 1,
    opacity: 0.7,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
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
    paddingVertical: 13,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.6,
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  infoInput: {
    flex: 2,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "right",
    borderBottomWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  divider: { height: 1, marginHorizontal: 16 },
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
  statIcon: { fontSize: 28, marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  statLabel: {
    fontSize: 11,
    opacity: 0.6,
    textAlign: "center",
    fontWeight: "600",
  },
  menuCard: { borderRadius: 12, overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuLabel: { fontSize: 14, fontWeight: "500" },
  menuArrow: { fontSize: 20, opacity: 0.4 },
  menuDivider: { height: 1 },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.3,
  },
  spacer: { height: 20 },
});
