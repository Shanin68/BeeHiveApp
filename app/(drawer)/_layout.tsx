import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Drawer } from "expo-router/drawer";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: "600",
            marginLeft: -16,
          },
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.text,
          drawerActiveBackgroundColor: "transparent",
          drawerItemStyle: {
            borderRadius: 8,
            marginHorizontal: 8,
            marginVertical: 4,
            paddingVertical: 4,
          },
          headerStyle: {
            backgroundColor: colors.primary,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          },
          headerTintColor: "#333",
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
          },
        }}
      >
        <Drawer.Screen
          name="dashboard"
          options={{
            drawerLabel: "Dashboard",
            title: "🐝 BeeHive",
            drawerIcon: ({ color, size }) => (
              <DrawerIcon icon="📊" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="apartments"
          options={{
            drawerLabel: "Apartments",
            title: "Apartments",
            drawerIcon: ({ color, size }) => (
              <DrawerIcon icon="🏠" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "Profile",
            title: "Profile",
            drawerIcon: ({ color, size }) => (
              <DrawerIcon icon="👤" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            title: "Settings",
            drawerIcon: ({ color, size }) => (
              <DrawerIcon icon="⚙️" color={color} size={size} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

function DrawerIcon({
  icon,
  color,
  size,
}: {
  icon: string;
  color: string;
  size: number;
}) {
  return <Text style={{ fontSize: size, marginRight: 8 }}>{icon}</Text>;
}
