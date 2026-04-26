import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/utils/supabase";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
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

export default function ApartmentsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [listings, setListings] = useState<Listing[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedApartment, setSelectedApartment] = useState<Listing | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [addPostVisible, setAddPostVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchListings = async () => {
    setFetchLoading(true);

    // Get current user id to determine if we should show the contact landlord button
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      setCurrentUserId(userData.user.id);
    }

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setListings(data as Listing[]);
    } else if (error) {
      console.error("Failed to fetch listings:", error.message);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Filter listings based on search and filter criteria
  const filteredApartments = listings.filter((apt) => {
    const matchesSearch =
      apt.name.toLowerCase().includes(searchText.toLowerCase()) ||
      apt.location.toLowerCase().includes(searchText.toLowerCase());

    const priceNum = parseInt(apt.price.replace(/\D/g, ""));
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "under25k" && priceNum < 25000) ||
      (priceFilter === "25kto30k" && priceNum >= 25000 && priceNum <= 30000) ||
      (priceFilter === "above30k" && priceNum > 30000);

    const matchesBedroom =
      bedroomFilter === "all" || apt.bedrooms === parseInt(bedroomFilter);

    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "4plus" && apt.rating >= 4) ||
      (ratingFilter === "45plus" && apt.rating >= 4.5);

    return matchesSearch && matchesPrice && matchesBedroom && matchesRating;
  });

  const handleReset = () => {
    setPriceFilter("all");
    setBedroomFilter("all");
    setRatingFilter("all");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search apartments or location..."
            placeholderTextColor={colors.text}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <ThemedText style={styles.filterIcon}>⚙️</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Active Filters Display */}
        {!showFilters &&
          (priceFilter !== "all" ||
            bedroomFilter !== "all" ||
            ratingFilter !== "all") && (
            <View style={styles.activeFiltersContainer}>
              {priceFilter !== "all" && (
                <View
                  style={[
                    styles.activeFilterTag,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <ThemedText style={styles.activeFilterText}>
                    {priceFilter === "under25k" && "< ৳25,000"}
                    {priceFilter === "25kto30k" && "৳25K-৳30K"}
                    {priceFilter === "above30k" && "> ৳30,000"}
                  </ThemedText>
                </View>
              )}
              {bedroomFilter !== "all" && (
                <View
                  style={[
                    styles.activeFilterTag,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <ThemedText style={styles.activeFilterText}>
                    {bedroomFilter === "3" ? "3+ bed" : `${bedroomFilter} bed`}
                  </ThemedText>
                </View>
              )}
              {ratingFilter !== "all" && (
                <View
                  style={[
                    styles.activeFilterTag,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <ThemedText style={styles.activeFilterText}>
                    {ratingFilter === "4plus" && "4+★"}
                    {ratingFilter === "45plus" && "4.5+★"}
                  </ThemedText>
                </View>
              )}
            </View>
          )}

        {/* Filter Section */}
        {showFilters && (
          <View
            style={[styles.filterSection, { backgroundColor: colors.border }]}
          >
            <View style={styles.filterRow}>
              <View style={styles.filterGroup}>
                <ThemedText style={styles.filterLabel}>Price</ThemedText>
                <View style={styles.filterOptions}>
                  {[
                    { label: "All", value: "all" },
                    { label: "< ৳25,000", value: "under25k" },
                    { label: "৳25K-৳30K", value: "25kto30k" },
                    { label: "> ৳30,000", value: "above30k" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor:
                            priceFilter === option.value
                              ? colors.primary
                              : "transparent",
                        },
                      ]}
                      onPress={() => setPriceFilter(option.value)}
                    >
                      <ThemedText
                        style={[
                          styles.filterOptionText,
                          {
                            color:
                              priceFilter === option.value
                                ? "#333"
                                : colors.text,
                          },
                        ]}
                      >
                        {option.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterGroup}>
                <ThemedText style={styles.filterLabel}>Bedrooms</ThemedText>
                <View style={styles.filterOptions}>
                  {[
                    { label: "All", value: "all" },
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3+", value: "3" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor:
                            bedroomFilter === option.value
                              ? colors.primary
                              : "transparent",
                        },
                      ]}
                      onPress={() => setBedroomFilter(option.value)}
                    >
                      <ThemedText
                        style={[
                          styles.filterOptionText,
                          {
                            color:
                              bedroomFilter === option.value
                                ? "#333"
                                : colors.text,
                          },
                        ]}
                      >
                        {option.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterGroup}>
                <ThemedText style={styles.filterLabel}>Rating</ThemedText>
                <View style={styles.filterOptions}>
                  {[
                    { label: "All", value: "all" },
                    { label: "4+⭐", value: "4plus" },
                    { label: "4.5+⭐", value: "45plus" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor:
                            ratingFilter === option.value
                              ? colors.primary
                              : "transparent",
                        },
                      ]}
                      onPress={() => setRatingFilter(option.value)}
                    >
                      <ThemedText
                        style={[
                          styles.filterOptionText,
                          {
                            color:
                              ratingFilter === option.value
                                ? "#333"
                                : colors.text,
                          },
                        ]}
                      >
                        {option.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: colors.primary }]}
              onPress={handleReset}
            >
              <ThemedText style={styles.resetButtonText}>
                Reset Filters
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* Apartments List */}
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {fetchLoading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <ThemedText style={[styles.emptySubtitle, { marginTop: 12 }]}>
                Loading listings...
              </ThemedText>
            </View>
          ) : filteredApartments.length > 0 ? (
            filteredApartments.map((apt) => (
              <TouchableOpacity
                key={apt.id}
                style={[styles.apartmentCard, { borderColor: colors.border }]}
                onPress={() => {
                  setSelectedApartment(apt);
                  setModalVisible(true);
                }}
              >
                {/* Show first image if available, otherwise color placeholder */}
                {apt.images && apt.images.length > 0 ? (
                  <Image
                    source={{ uri: apt.images[0] }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[styles.cardImage, { backgroundColor: "#FDB913" }]}
                  />
                )}
                <View style={styles.cardInfo}>
                  <View style={styles.cardHeader}>
                    <ThemedText style={styles.cardName}>{apt.name}</ThemedText>
                    <ThemedText
                      style={[styles.cardPrice, { color: colors.primary }]}
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
                  <ThemedText style={styles.cardLocation}>
                    📍 {apt.location}
                  </ThemedText>
                  <View style={styles.cardMeta}>
                    <ThemedText style={styles.cardMetaText}>
                      {apt.bedrooms} bed • {apt.bathrooms} bath
                      {apt.area
                        ? ` • ${(() => {
                            const num = parseInt(apt.area.replace(/\D/g, ""));
                            return isNaN(num)
                              ? apt.area
                              : `${num.toLocaleString("en-US")} sqft`;
                          })()}`
                        : ""}
                    </ThemedText>
                    <ThemedText
                      style={[styles.cardRating, { color: colors.primary }]}
                    >
                      ⭐ {apt.rating ?? 0}
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyTitle}>
                No apartments found
              </ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                {listings.length === 0
                  ? "Be the first to post a listing! Tap + below."
                  : "Try adjusting your filters or search term."}
              </ThemedText>
            </View>
          )}
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

        {/* Add Post Modal */}
        <AddPostModal
          visible={addPostVisible}
          onClose={() => setAddPostVisible(false)}
          onSuccess={fetchListings}
          colors={colors}
        />

        {/* Floating Action Button */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => setAddPostVisible(true)}
        >
          <ThemedText style={styles.fabText}>+</ThemedText>
        </TouchableOpacity>
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

  const isOwner = currentUserId === apartment.user_id;

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
                    ⭐ {apartment.rating}
                  </ThemedText>
                  <ThemedText style={styles.reviews}>
                    {apartment.reviews} reviews
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
              <View style={styles.amenitiesContainer}>
                <ThemedText style={styles.sectionHeader}>Amenities</ThemedText>
                <View style={styles.amenitiesGrid}>
                  {(apartment.amenities || []).map(
                    (amenity: string, index: number) => (
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
                    ),
                  )}
                </View>
              </View>

              {/* Contact Button */}
              {!isOwner && (
                <TouchableOpacity
                  style={[
                    styles.contactButton,
                    {
                      backgroundColor: colors.primary,
                      opacity: loadingLandlord ? 0.7 : 1,
                    },
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
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function AddPostModal({
  visible,
  onClose,
  onSuccess,
  colors,
}: {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  colors: typeof Colors.light;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setPrice("");
    setLocation("");
    setBedrooms("");
    setBathrooms("");
    setArea("");
    setDescription("");
    setImages([]);
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Limit reached", "You can only add up to 5 images.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price.trim() || !location.trim()) {
      Alert.alert(
        "Missing Fields",
        "Please fill in Name, Price, and Location.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();

      const { error } = await supabase.from("listings").insert([
        {
          name: name.trim(),
          price: price.trim(),
          location: location.trim(),
          bedrooms: parseInt(bedrooms) || 0,
          bathrooms: parseInt(bathrooms) || 0,
          area: area.trim(),
          description: description.trim(),
          images,
          rating: 0,
          reviews: 0,
          user_id: userData?.user?.id,
        },
      ]);

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success! 🎉", "Your apartment listing has been posted.");
        resetForm();
        onClose();
        onSuccess();
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Something went wrong.");
    } finally {
      setIsSubmitting(false);
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
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Add New Post</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <ThemedText style={styles.modalCloseIcon}>✕</ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formContainer}
          >
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                Images ({images.length}/5)
              </ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageUploadScroll}
              >
                {images.map((uri, index) => (
                  <View key={index} style={styles.imagePreviewContainer}>
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.imageRemoveButton}
                      onPress={() => removeImage(index)}
                    >
                      <ThemedText style={styles.imageRemoveText}>✕</ThemedText>
                    </TouchableOpacity>
                  </View>
                ))}
                {images.length < 5 && (
                  <TouchableOpacity
                    style={[
                      styles.imageUploadButton,
                      { borderColor: colors.border },
                    ]}
                    onPress={pickImage}
                  >
                    <ThemedText style={styles.imageUploadIcon}>+</ThemedText>
                    <ThemedText style={styles.imageUploadText}>
                      Add Image
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Apartment Name</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                ]}
                placeholder="e.g. Rancor Tower (Flat 8B)"
                placeholderTextColor={colors.text + "80"}
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Price per Month</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                ]}
                placeholder="e.g. ৳25,000/month"
                placeholderTextColor={colors.text + "80"}
                value={price}
                onChangeText={setPrice}
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Location</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                ]}
                placeholder="e.g. Downtown, City Center"
                placeholderTextColor={colors.text + "80"}
                value={location}
                onChangeText={setLocation}
              />
            </View>
            <View style={styles.rowInputGroup}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <ThemedText style={styles.inputLabel}>Bedrooms</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="e.g. 2"
                  placeholderTextColor={colors.text + "80"}
                  keyboardType="numeric"
                  value={bedrooms}
                  onChangeText={setBedrooms}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <ThemedText style={styles.inputLabel}>Bathrooms</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="e.g. 1"
                  placeholderTextColor={colors.text + "80"}
                  keyboardType="numeric"
                  value={bathrooms}
                  onChangeText={setBathrooms}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Area</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                ]}
                placeholder="e.g. 1,200 sq ft"
                placeholderTextColor={colors.text + "80"}
                value={area}
                onChangeText={setArea}
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Description</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Describe your apartment..."
                placeholderTextColor={colors.text + "80"}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: colors.primary,
                  opacity: isSubmitting ? 0.7 : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#333" />
              ) : (
                <ThemedText style={styles.submitButtonText}>
                  🐝 Post Listing
                </ThemedText>
              )}
            </TouchableOpacity>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    fontSize: 14,
  },
  filterButton: {
    padding: 10,
  },
  filterIcon: {
    fontSize: 20,
  },
  filterSection: {
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  filterRow: {
    gap: 12,
    marginBottom: 16,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  resetButton: {
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  activeFiltersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  activeFilterTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  listContent: {
    paddingTop: 0,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  apartmentCard: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    marginBottom: 16,
  },
  cardImage: {
    width: 120,
    height: 120,
  },
  cardInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: "600",
  },
  cardLocation: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardMetaText: {
    fontSize: 11,
    opacity: 0.6,
  },
  cardRating: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
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
  // Floating Action Button
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    fontWeight: "400",
    color: "#fff",
  },
  // Add Post Form styles
  formContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 16,
  },
  rowInputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  // Add Image Styles
  imageUploadScroll: {
    paddingVertical: 8,
  },
  imageUploadButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  imageUploadIcon: {
    fontSize: 32,
    fontWeight: "300",
    color: "#888",
    marginBottom: 4,
  },
  imageUploadText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#888",
  },
  imagePreviewContainer: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  imageRemoveButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  imageRemoveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
