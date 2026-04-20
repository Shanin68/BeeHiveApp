import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Apartment data (same as dashboard)
const apartmentDetails = [
  {
    id: 1,
    name: "Rancor Tower (Flat 8B)",
    price: "$2,500/month",
    image: "#FF9F43",
    bedrooms: 2,
    bathrooms: 1,
    location: "Downtown, City Center",
    description:
      "Modern 2-bedroom apartment with great views and modern amenities",
    area: "1,200 sq ft",
    amenities: ["Wi-Fi", "Parking", "Gym", "Swimming Pool", "24/7 Security"],
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: "Rancor Tower (Flat 8B)",
    price: "$2,500/month",
    image: "#2ED573",
    bedrooms: 2,
    bathrooms: 2,
    location: "Business District",
    description:
      "Beautiful apartment in a prime location with excellent amenities",
    area: "1,350 sq ft",
    amenities: ["Wi-Fi", "Parking", "Gym", "24/7 Security", "Balcony"],
    rating: 4.7,
    reviews: 95,
  },
  {
    id: 3,
    name: "Rancor Tower (Flat 8B)",
    price: "$2,500/month",
    image: "#9B59B6",
    bedrooms: 1,
    bathrooms: 1,
    location: "Near University",
    description:
      "Cozy 1-bedroom apartment perfect for students and professionals",
    area: "800 sq ft",
    amenities: ["Wi-Fi", "Parking", "Security", "24/7 Support"],
    rating: 4.3,
    reviews: 67,
  },
  {
    id: 4,
    name: "Rancor Tower (Flat 8B)",
    price: "$3,200/month",
    image: "#2ED573",
    bedrooms: 3,
    bathrooms: 2,
    location: "Premium Area",
    description: "Luxury apartment with modern amenities",
    area: "1,800 sq ft",
    amenities: [
      "Wi-Fi",
      "Parking",
      "Gym",
      "Swimming Pool",
      "24/7 Security",
      "Concierge",
    ],
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 5,
    name: "Downtown Towers (Flat 5A)",
    price: "$2,800/month",
    image: "#DDA15E",
    bedrooms: 2,
    bathrooms: 1,
    location: "City Center",
    description: "Spacious flat in city center",
    area: "1,400 sq ft",
    amenities: ["Wi-Fi", "Parking", "Gym", "24/7 Security", "Rooftop"],
    rating: 4.6,
    reviews: 142,
  },
];

export default function ApartmentsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const [searchText, setSearchText] = useState("");
  const [selectedApartment, setSelectedApartment] = useState<
    (typeof apartmentDetails)[0] | null
  >(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  // Filter apartments based on search and filter criteria
  const filteredApartments = apartmentDetails.filter((apt) => {
    const matchesSearch =
      apt.name.toLowerCase().includes(searchText.toLowerCase()) ||
      apt.location.toLowerCase().includes(searchText.toLowerCase());

    const priceNum = parseInt(apt.price.replace(/\D/g, ""));
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "under2500" && priceNum < 2500) ||
      (priceFilter === "2500to3000" && priceNum >= 2500 && priceNum <= 3000) ||
      (priceFilter === "above3000" && priceNum > 3000);

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
                    {priceFilter === "under2500" && "< $2,500"}
                    {priceFilter === "2500to3000" && "$2,500-$3K"}
                    {priceFilter === "above3000" && "> $3,000"}
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
                    { label: "< $2,500", value: "under2500" },
                    { label: "$2,500-$3K", value: "2500to3000" },
                    { label: "> $3,000", value: "above3000" },
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
          {filteredApartments.length > 0 ? (
            filteredApartments.map((apt) => (
              <TouchableOpacity
                key={apt.id}
                style={[styles.apartmentCard, { borderColor: colors.border }]}
                onPress={() => {
                  setSelectedApartment(apt);
                  setModalVisible(true);
                }}
              >
                <View
                  style={[styles.cardImage, { backgroundColor: apt.image }]}
                />
                <View style={styles.cardInfo}>
                  <View style={styles.cardHeader}>
                    <ThemedText style={styles.cardName}>{apt.name}</ThemedText>
                    <ThemedText
                      style={[styles.cardPrice, { color: colors.primary }]}
                    >
                      {apt.price}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.cardLocation}>
                    📍 {apt.location}
                  </ThemedText>
                  <View style={styles.cardMeta}>
                    <ThemedText style={styles.cardMetaText}>
                      {apt.bedrooms} bed • {apt.bathrooms} bath • {apt.area}
                    </ThemedText>
                    <ThemedText
                      style={[styles.cardRating, { color: colors.primary }]}
                    >
                      ⭐ {apt.rating}
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
                Try adjusting your filters or search term
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
}: {
  apartment: (typeof apartmentDetails)[0];
  visible: boolean;
  onClose: () => void;
  colors: typeof Colors.light;
}) {
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
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <ThemedText style={styles.modalCloseIcon}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Main Image */}
            <View
              style={[styles.modalImage, { backgroundColor: apartment.image }]}
            />

            {/* Image Gallery Indicators */}
            <View style={styles.imageIndicators}>
              {[0, 1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.indicator,
                    i === 0 && { backgroundColor: colors.primary },
                    i !== 0 && {
                      backgroundColor: colors.border,
                    },
                  ]}
                />
              ))}
            </View>

            {/* Details Section */}
            <View style={styles.modalDetailsSection}>
              {/* Price and Rating */}
              <View style={styles.priceRatingContainer}>
                <View>
                  <ThemedText style={styles.modalPrice}>
                    {apartment.price}
                  </ThemedText>
                  <ThemedText style={styles.modalArea}>
                    {apartment.area}
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

              {/* Contact Button */}
              <TouchableOpacity
                style={[
                  styles.contactButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <ThemedText style={styles.contactButtonText}>
                  Contact Landlord
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
});
