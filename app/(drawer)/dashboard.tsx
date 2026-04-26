import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
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

// Shape of a listing row from Supabase
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

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedApartment, setSelectedApartment] = useState<Listing | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (err: any) {
      console.error("Dashboard list error: ", err);
    } finally {
      setLoading(false);
    }
  };

  // Display all listings in both sections
  const apartmentsNearYou = listings;
  const featuredApartments = listings;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView
          style={[
            styles.innerContainer,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={{ marginTop: 12 }}>Loading listings...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        {/* Main Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Apartments Near You Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Apartments Near You
            </ThemedText>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {apartmentsNearYou.map((apt) => (
                <TouchableOpacity
                  key={apt.id}
                  style={[styles.apartmentCard, { borderColor: colors.border }]}
                  onPress={() => {
                    setSelectedApartment(apt);
                    setModalVisible(true);
                  }}
                >
                  {apt.images && apt.images.length > 0 ? (
                    <Image
                      source={{ uri: apt.images[0] }}
                      style={styles.apartmentImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.apartmentImage,
                        { backgroundColor: "#FDB913" },
                      ]}
                    />
                  )}
                  <View style={styles.apartmentInfo}>
                    <ThemedText style={styles.apartmentName}>
                      {apt.name}
                    </ThemedText>
                    <ThemedText
                      style={[styles.apartmentPrice, { color: colors.primary }]}
                    >
                      {(() => {
                        if (!apt.price) return "";
                        const num = parseInt(apt.price.replace(/\D/g, ""));
                        return isNaN(num)
                          ? apt.price
                          : `৳${num.toLocaleString("en-US")}/month`;
                      })()}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Featured Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Featured</ThemedText>

            {featuredApartments.map((apt) => (
              <TouchableOpacity
                key={apt.id}
                style={[styles.featuredCard, { borderColor: colors.border }]}
                onPress={() => {
                  setSelectedApartment(apt);
                  setModalVisible(true);
                }}
              >
                {apt.images && apt.images.length > 0 ? (
                  <Image
                    source={{ uri: apt.images[0] }}
                    style={styles.featuredImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.featuredImage,
                      { backgroundColor: "#FDB913" },
                    ]}
                  />
                )}
                <View style={styles.featuredInfo}>
                  <ThemedText style={styles.featuredName}>
                    {apt.name}
                  </ThemedText>
                  <ThemedText
                    style={[styles.featuredPrice, { color: colors.primary }]}
                  >
                    {(() => {
                      if (!apt.price) return "";
                      const num = parseInt(apt.price.replace(/\D/g, ""));
                      return isNaN(num)
                        ? apt.price
                        : `৳${num.toLocaleString("en-US")}/month`;
                    })()}
                  </ThemedText>
                  <ThemedText style={styles.featuredDetails}>
                    {apt.bedrooms} bed • {apt.bathrooms} bath
                  </ThemedText>
                  <ThemedText style={styles.featuredDescription}>
                    {apt.description}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Apartment Details Modal */}
        {selectedApartment && (
          <ApartmentDetailsModal
            apartment={selectedApartment}
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false);
              setSelectedApartment(null);
            }}
            colors={colors}
            currentUserId={currentUserId}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

function ApartmentDetailsModal({
  apartment,
  visible,
  onClose,
  colors,
  currentUserId,
}: {
  apartment: Listing;
  visible: boolean;
  onClose: () => void;
  colors: typeof Colors.light;
  currentUserId: string | null;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loadingLandlord, setLoadingLandlord] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const [favId, setFavId] = useState<number | null>(null);
  const [favLoading, setFavLoading] = useState(false);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    if (visible) {
      setActiveImageIndex(0);
      checkFavourite();
    }
  }, [visible, apartment.id]);

  const checkFavourite = async () => {
    if (!currentUserId) return;
    const { data } = await supabase
      .from("favourites")
      .select("id")
      .eq("user_id", currentUserId)
      .eq("listing_id", apartment.id)
      .maybeSingle();
    setIsFavourited(!!data);
    setFavId(data?.id ?? null);
  };

  const toggleFavourite = async () => {
    if (!currentUserId) {
      Alert.alert("Sign in required", "Please log in to save favourites.");
      return;
    }
    setFavLoading(true);
    try {
      if (isFavourited && favId) {
        await supabase.from("favourites").delete().eq("id", favId);
        setIsFavourited(false);
        setFavId(null);
      } else {
        const { data } = await supabase
          .from("favourites")
          .insert({ user_id: currentUserId, listing_id: apartment.id })
          .select("id")
          .single();
        setIsFavourited(true);
        setFavId(data?.id ?? null);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setFavLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveImageIndex(index);
  };

  const handleContactLandlord = async () => {
    if (!apartment.user_id) {
      Alert.alert(
        "Notice",
        "Landlord information is not available for this listing.",
      );
      return;
    }

    setLoadingLandlord(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone_number")
        .eq("id", apartment.user_id)
        .single();

      if (error) throw error;

      const name = data.full_name || "Landlord";
      const phone = data.phone_number || "Not provided";

      Alert.alert(`👤 ${name}`, `📞 Phone: ${phone}`, [
        { text: "Close", style: "cancel" },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.message || "Failed to load landlord information.",
      );
    } finally {
      setLoadingLandlord(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>{apartment.name}</ThemedText>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <TouchableOpacity
                onPress={toggleFavourite}
                disabled={favLoading}
                style={{ padding: 8 }}
              >
                <ThemedText style={{ fontSize: 22 }}>
                  {isFavourited ? "❤️" : "🤍"}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                <ThemedText style={styles.modalCloseIcon}>✕</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Main Image Slider */}
            {apartment.images && apartment.images.length > 0 ? (
              <View>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                >
                  {apartment.images.map((img, index) => (
                    <Image
                      key={index}
                      source={{ uri: img }}
                      style={[styles.modalImage, { width }]}
                      resizeMode="cover"
                    />
                  ))}
                </ScrollView>
              </View>
            ) : (
              <View
                style={[styles.modalImage, { backgroundColor: "#FDB913" }]}
              />
            )}

            {/* Image Gallery Indicators */}
            {apartment.images && apartment.images.length > 1 && (
              <View style={styles.imageIndicators}>
                {apartment.images.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.indicator,
                      i === activeImageIndex && {
                        backgroundColor: colors.primary,
                      },
                      i !== activeImageIndex && {
                        backgroundColor: colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Details Section */}
            <View style={styles.modalDetailsSection}>
              {/* Price and Rating */}
              <View style={styles.priceRatingContainer}>
                <View>
                  <ThemedText style={styles.modalPrice}>
                    {(() => {
                      if (!apartment.price) return "";
                      const num = parseInt(apartment.price.replace(/\D/g, ""));
                      return isNaN(num)
                        ? apartment.price
                        : `৳${num.toLocaleString("en-US")}/month`;
                    })()}
                  </ThemedText>
                  <ThemedText style={styles.modalArea}>
                    {(() => {
                      if (!apartment.area) return "";
                      const num = parseInt(apartment.area.replace(/\D/g, ""));
                      return isNaN(num)
                        ? apartment.area
                        : `${num.toLocaleString("en-US")} sqft`;
                    })()}
                  </ThemedText>
                </View>
                <View style={styles.ratingContainer}>
                  <ThemedText style={styles.rating}>
                    ⭐ {apartment.rating ?? 0}
                  </ThemedText>
                  <ThemedText style={styles.reviews}>
                    {apartment.reviews ?? 0} reviews
                  </ThemedText>
                </View>
              </View>

              {/* Location */}
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>📍 Location</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {apartment.location}
                </ThemedText>
              </View>

              {/* Bedrooms and Bathrooms */}
              <View style={styles.bedroomBathroomRow}>
                <View style={styles.bedBathCard}>
                  <ThemedText style={styles.bedBathNumber}>
                    {apartment.bedrooms}
                  </ThemedText>
                  <ThemedText style={styles.bedBathLabel}>Bedrooms</ThemedText>
                </View>
                <View style={styles.bedBathCard}>
                  <ThemedText style={styles.bedBathNumber}>
                    {apartment.bathrooms}
                  </ThemedText>
                  <ThemedText style={styles.bedBathLabel}>Bathrooms</ThemedText>
                </View>
              </View>

              {/* Description */}
              <View style={styles.descriptionContainer}>
                <ThemedText style={styles.sectionHeader}>
                  Description
                </ThemedText>
                <ThemedText style={styles.descriptionText}>
                  {apartment.description}
                </ThemedText>
              </View>

              {/* Amenities */}
              {apartment.amenities && apartment.amenities.length > 0 && (
                <View style={styles.amenitiesContainer}>
                  <ThemedText style={styles.sectionHeader}>
                    Amenities
                  </ThemedText>
                  <View style={styles.amenitiesGrid}>
                    {apartment.amenities.map((amenity, index) => (
                      <View
                        key={index}
                        style={[
                          styles.amenityTag,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <ThemedText style={styles.amenityText}>
                          ✓ {amenity}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Contact Button */}
              <TouchableOpacity
                style={[
                  styles.contactButton,
                  { backgroundColor: colors.primary },
                  loadingLandlord && { opacity: 0.7 },
                ]}
                onPress={handleContactLandlord}
                disabled={loadingLandlord}
              >
                {loadingLandlord ? (
                  <ActivityIndicator color="#333" />
                ) : (
                  <ThemedText style={styles.contactButtonText}>
                    Contact Landlord
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
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
    paddingBottom: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  horizontalScroll: {
    marginHorizontal: -16,
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  apartmentCard: {
    width: 140,
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  apartmentImage: {
    width: "100%",
    height: 120,
  },
  apartmentInfo: {
    padding: 12,
    gap: 4,
  },
  apartmentName: {
    fontSize: 12,
    fontWeight: "600",
  },
  apartmentPrice: {
    fontSize: 11,
    fontWeight: "500",
  },
  featuredCard: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    marginBottom: 16,
  },
  featuredImage: {
    width: "100%",
    height: 180,
  },
  featuredInfo: {
    padding: 16,
    gap: 8,
  },
  featuredName: {
    fontSize: 16,
    fontWeight: "700",
  },
  featuredPrice: {
    fontSize: 14,
    fontWeight: "600",
  },
  featuredDetails: {
    fontSize: 12,
    opacity: 0.7,
  },
  featuredDescription: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 4,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseIcon: {
    fontSize: 24,
  },
  modalImage: {
    width: "100%",
    height: 250,
  },
  imageIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalDetailsSection: {
    padding: 16,
  },
  priceRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: "700",
  },
  modalArea: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  ratingContainer: {
    alignItems: "flex-end",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviews: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  infoRow: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 13,
    opacity: 0.7,
  },
  bedroomBathroomRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  bedBathCard: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  bedBathNumber: {
    fontSize: 20,
    fontWeight: "700",
  },
  bedBathLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  amenitiesContainer: {
    marginBottom: 20,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333333",
  },
  contactButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
});
