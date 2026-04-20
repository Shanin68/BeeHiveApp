import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === "dark");
  const [shareData, setShareData] = useState(false);

  const settingsSections = [
    {
      title: "Display",
      icon: "🎨",
      items: [
        {
          label: "Dark Mode",
          value: darkMode,
          onChange: setDarkMode,
          type: "toggle",
        },
      ],
    },
    {
      title: "Notifications",
      icon: "🔔",
      items: [
        {
          label: "Enable Notifications",
          value: notifications,
          onChange: setNotifications,
          type: "toggle",
        },
        {
          label: "Email Notifications",
          value: emailNotifications,
          onChange: setEmailNotifications,
          type: "toggle",
          disabled: !notifications,
        },
        {
          label: "Push Notifications",
          value: pushNotifications,
          onChange: setPushNotifications,
          type: "toggle",
          disabled: !notifications,
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: "🔒",
      items: [
        {
          label: "Share Usage Data",
          value: shareData,
          onChange: setShareData,
          type: "toggle",
        },
      ],
    },
  ];

  const aboutItems = [
    { label: "Version", value: "1.0.0" },
    { label: "Last Updated", value: "April 2024" },
  ];

  const helpItems = [
    { label: "Help & Support", icon: "❓" },
    { label: "Terms of Service", icon: "📋" },
    { label: "Privacy Policy", icon: "🛡️" },
    { label: "Contact Us", icon: "✉️" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionIcon}>
                  {section.icon}
                </ThemedText>
                <ThemedText
                  style={[styles.sectionTitle, { color: colors.primary }]}
                >
                  {section.title}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.settingsCard,
                  { backgroundColor: colors.border },
                ]}
              >
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    <View
                      style={[
                        styles.settingItem,
                        { opacity: item.disabled ? 0.5 : 1 },
                      ]}
                    >
                      <ThemedText style={styles.settingLabel}>
                        {item.label}
                      </ThemedText>
                      {item.type === "toggle" && (
                        <Switch
                          value={item.value}
                          onValueChange={item.onChange}
                          disabled={item.disabled}
                          trackColor={{
                            false: "rgba(0,0,0,0.2)",
                            true: colors.primary,
                          }}
                          thumbColor={item.value ? "#fff" : "#f4f3f4"}
                        />
                      )}
                    </View>
                    {itemIndex < section.items.length - 1 && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: "rgba(0,0,0,0.1)" },
                        ]}
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* About Section */}
          <View style={styles.section}>
            <ThemedText
              style={[
                styles.sectionTitle,
                { color: colors.primary, marginBottom: 12 },
              ]}
            >
              ABOUT
            </ThemedText>
            <View
              style={[styles.settingsCard, { backgroundColor: colors.border }]}
            >
              {aboutItems.map((item, index) => (
                <View key={index}>
                  <View style={styles.infoItem}>
                    <ThemedText style={styles.infoLabel}>
                      {item.label}
                    </ThemedText>
                    <ThemedText style={styles.infoValue}>
                      {item.value}
                    </ThemedText>
                  </View>
                  {index < aboutItems.length - 1 && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: "rgba(0,0,0,0.1)" },
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Help Section */}
          <View style={styles.section}>
            <ThemedText
              style={[
                styles.sectionTitle,
                { color: colors.primary, marginBottom: 12 },
              ]}
            >
              HELP & LEGAL
            </ThemedText>
            <View
              style={[styles.settingsCard, { backgroundColor: colors.border }]}
            >
              {helpItems.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity style={styles.helpItem}>
                    <ThemedText style={styles.helpIcon}>{item.icon}</ThemedText>
                    <ThemedText style={styles.helpLabel}>
                      {item.label}
                    </ThemedText>
                    <ThemedText style={styles.helpArrow}>›</ThemedText>
                  </TouchableOpacity>
                  {index < helpItems.length - 1 && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: "rgba(0,0,0,0.1)" },
                      ]}
                    />
                  )}
                </View>
              ))}
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  settingsCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.6,
  },
  helpItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  helpIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 30,
  },
  helpLabel: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  helpArrow: {
    fontSize: 18,
    opacity: 0.4,
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
