import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/utils/supabase";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Listing = {
  id: number;
  name: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  images: string[] | null;
  amenities?: string[] | null;
  rating: number;
  reviews: number;
  user_id?: string;
};

type Favourite = {
  id: number;
  listing_id: number;
  listings: Listing;
};

const formatPrice = (price: string) => {
  if (!price) return "";
  const num = parseInt(price.replace(/\D/g, ""));
  return isNaN(num) ? price : `৳${num.toLocaleString("en-US")}/month`;
};

const formatArea = (area: string) => {
  if (!area) return "";
  const num = parseInt(area.replace(/\D/g, ""));
  return isNaN(num) ? area : `${num.toLocaleString("en-US")} sqft`;
};

export default function FavouritesScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState<Listing | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Refresh whenever the tab is focused
  useFocusEffect(
    useCallback(() => {
      fetchFavourites();
    }, [])
  );

  const fetchFavourites = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) return;
      setCurrentUserId(userId);

      const { data, error } = await supabase
        .from("favourites")
        .select("id, listing_id, listings(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavourites((data as any) || []);
    } catch (err: any) {
      console.error("Favourites fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfavourite = async (favId: number, listingName: string) => {
    Alert.alert(
      "Remove Favourite",
      `Remove "${listingName}" from favourites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("favourites")
              .delete()
              .eq("id", favId);
            if (!error) {
              setFavourites((prev) => prev.filter((f) => f.id !== favId));
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <ThemedText style={{ marginTop: 12, opacity: 0.6 }}>
              Loading favourites...
            </ThemedText>
          </View>
        ) : favourites.length === 0 ? (
          <View style={styles.centered}>
            <ThemedText style={styles.emptyIcon}>❤️</ThemedText>
            <ThemedText style={styles.emptyTitle}>No Favourites Yet</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Tap the ❤️ button on any listing to save it here.
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {favourites.map((fav) => {
              const apt = fav.listings;
              return (
                <TouchableOpacity
                  key={fav.id}
                  style={[styles.card, { borderColor: colors.border }]}
                  onPress={() => {
                    setSelectedApartment(apt);
                    setModalVisible(true);
                  }}
                >
                  {apt.images && apt.images.length > 0 ? (
                    <Image
                      source={{ uri: apt.images[0] }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.cardImage, { backgroundColor: colors.primary }]} />
                  )}
                  <View style={styles.cardBody}>
                    <View style={styles.cardHeader}>
                      <ThemedText style={styles.cardName} numberOfLines={1}>
                        {apt.name}
                      </ThemedText>
                      <TouchableOpacity
                        onPress={() => handleUnfavourite(fav.id, apt.name)}
                        style={styles.heartBtn}
                      >
                        <ThemedText style={styles.heartIcon}>❤️</ThemedText>
                      </TouchableOpacity>
                    </View>
                    <ThemedText
                      style={[styles.cardPrice, { color: colors.primary }]}
                    >
                      {formatPrice(apt.price)}
                    </ThemedText>
                    <ThemedText style={styles.cardLocation} numberOfLines={1}>
                      📍 {apt.location}
                    </ThemedText>
                    <ThemedText style={styles.cardMeta}>
                      {apt.bedrooms} bed • {apt.bathrooms} bath
                      {apt.area ? ` • ${formatArea(apt.area)}` : ""}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {selectedApartment && (
          <FavouriteDetailModal
            apartment={selectedApartment}
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false);
              setSelectedApartment(null);
            }}
            colors={colors}
            isFavourited
            onUnfavourite={() => {
              const fav = favourites.find(
                (f) => f.listing_id === selectedApartment.id
              );
              if (fav) handleUnfavourite(fav.id, selectedApartment.name);
            }}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

function FavouriteDetailModal({
  apartment,
  visible,
  onClose,
  colors,
  isFavourited,
  onUnfavourite,
}: {
  apartment: Listing;
  visible: boolean;
  onClose: () => void;
  colors: typeof Colors.light;
  isFavourited: boolean;
  onUnfavourite: () => void;
}) {
  const { width } = Dimensions.get("window");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveImageIndex(index);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle} numberOfLines={1}>
              {apartment.name}
            </ThemedText>
            <View style={styles.modalHeaderActions}>
              <TouchableOpacity onPress={onUnfavourite} style={styles.favHeaderBtn}>
                <ThemedText style={styles.heartIcon}>
                  {isFavourited ? "❤️" : "🤍"}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                <ThemedText style={styles.modalCloseIcon}>✕</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {apartment.images && apartment.images.length > 0 ? (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {apartment.images.map((img, i) => (
                  <Image
                    key={i}
                    source={{ uri: img }}
                    style={[styles.modalImage, { width }]}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            ) : (
              <View style={[styles.modalImage, { backgroundColor: colors.primary }]} />
            )}

            {apartment.images && apartment.images.length > 1 && (
              <View style={styles.imageIndicators}>
                {apartment.images.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.indicator,
                      { backgroundColor: i === activeImageIndex ? colors.primary : colors.border },
                    ]}
                  />
                ))}
              </View>
            )}

            <View style={styles.modalDetailsSection}>
              <View style={styles.priceRatingContainer}>
                <View>
                  <ThemedText style={styles.modalPrice}>
                    {formatPrice(apartment.price)}
                  </ThemedText>
                  <ThemedText style={styles.modalArea}>
                    {formatArea(apartment.area)}
                  </ThemedText>
                </View>
                <View style={styles.ratingContainer}>
                  <ThemedText style={styles.rating}>⭐ {apartment.rating ?? 0}</ThemedText>
                  <ThemedText style={styles.reviews}>{apartment.reviews ?? 0} reviews</ThemedText>
                </View>
              </View>

              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>📍 Location</ThemedText>
                <ThemedText style={styles.infoValue}>{apartment.location}</ThemedText>
              </View>

              <View style={styles.bedroomBathroomRow}>
                <View style={[styles.bedBathCard, { backgroundColor: colors.border }]}>
                  <ThemedText style={styles.bedBathNumber}>{apartment.bedrooms}</ThemedText>
                  <ThemedText style={styles.bedBathLabel}>Bedrooms</ThemedText>
                </View>
                <View style={[styles.bedBathCard, { backgroundColor: colors.border }]}>
                  <ThemedText style={styles.bedBathNumber}>{apartment.bathrooms}</ThemedText>
                  <ThemedText style={styles.bedBathLabel}>Bathrooms</ThemedText>
                </View>
              </View>

              {apartment.description ? (
                <View style={styles.descriptionContainer}>
                  <ThemedText style={styles.sectionHeader}>Description</ThemedText>
                  <ThemedText style={styles.descriptionText}>{apartment.description}</ThemedText>
                </View>
              ) : null}

              {apartment.amenities && apartment.amenities.length > 0 && (
                <View style={styles.amenitiesContainer}>
                  <ThemedText style={styles.sectionHeader}>Amenities</ThemedText>
                  <View style={styles.amenitiesGrid}>
                    {apartment.amenities.map((a, i) => (
                      <View key={i} style={[styles.amenityTag, { backgroundColor: colors.primary }]}>
                        <ThemedText style={styles.amenityText}>✓ {a}</ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={[styles.unfavButton]}
                onPress={onUnfavourite}
              >
                <ThemedText style={styles.unfavButtonText}>
                  ❤️ Remove from Favourites
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  emptySubtitle: { fontSize: 14, opacity: 0.6, textAlign: "center", lineHeight: 20 },
  listContent: { padding: 16, paddingBottom: 32 },
  card: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: "hidden",
    marginBottom: 14,
    backgroundColor: "rgba(0,0,0,0.01)",
  },
  cardImage: { width: 110, height: 110 },
  cardBody: { flex: 1, padding: 12, justifyContent: "space-between" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardName: { fontSize: 14, fontWeight: "700", flex: 1, marginRight: 8 },
  heartBtn: { padding: 4 },
  heartIcon: { fontSize: 18 },
  cardPrice: { fontSize: 13, fontWeight: "700", marginVertical: 2 },
  cardLocation: { fontSize: 12, opacity: 0.6, marginBottom: 4 },
  cardMeta: { fontSize: 11, opacity: 0.5 },
  // Modal
  modalContainer: { flex: 1 },
  modalContent: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", flex: 1 },
  modalHeaderActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  favHeaderBtn: { padding: 8 },
  modalCloseButton: { padding: 8 },
  modalCloseIcon: { fontSize: 22 },
  modalImage: { width: "100%", height: 240 },
  imageIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  indicator: { width: 8, height: 8, borderRadius: 4 },
  modalDetailsSection: { padding: 16 },
  priceRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  modalPrice: { fontSize: 22, fontWeight: "700" },
  modalArea: { fontSize: 12, opacity: 0.6, marginTop: 4 },
  ratingContainer: { alignItems: "flex-end" },
  rating: { fontSize: 14, fontWeight: "600" },
  reviews: { fontSize: 12, opacity: 0.6, marginTop: 2 },
  infoRow: { marginBottom: 16 },
  infoLabel: { fontSize: 13, fontWeight: "600", opacity: 0.6, marginBottom: 4 },
  infoValue: { fontSize: 14 },
  bedroomBathroomRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  bedBathCard: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  bedBathNumber: { fontSize: 20, fontWeight: "700" },
  bedBathLabel: { fontSize: 12, opacity: 0.6, marginTop: 4 },
  descriptionContainer: { marginBottom: 20 },
  sectionHeader: { fontSize: 15, fontWeight: "700", marginBottom: 10 },
  descriptionText: { fontSize: 14, lineHeight: 20, opacity: 0.8 },
  amenitiesContainer: { marginBottom: 20 },
  amenitiesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  amenityTag: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  amenityText: { fontSize: 12, fontWeight: "500", color: "#333" },
  unfavButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#e53935",
  },
  unfavButtonText: { fontSize: 15, fontWeight: "700", color: "#e53935" },
});
