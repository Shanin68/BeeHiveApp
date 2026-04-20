import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Dummy apartment data with extended details
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

// For backward compatibility with existing code
const apartmentsNearYou = apartmentDetails.slice(0, 3);
const featuredApartments = apartmentDetails.slice(3);

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [selectedApartment, setSelectedApartment] = useState<
    (typeof apartmentDetails)[0] | null
  >(null);
  const [modalVisible, setModalVisible] = useState(false);

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
                    const fullApt = apartmentDetails.find(
                      (a) => a.id === apt.id,
                    );
                    if (fullApt) {
                      setSelectedApartment(fullApt);
                      setModalVisible(true);
                    }
                  }}
                >
                  <View
                    style={[
                      styles.apartmentImage,
                      { backgroundColor: apt.image },
                    ]}
                  />
                  <View style={styles.apartmentInfo}>
                    <ThemedText style={styles.apartmentName}>
                      {apt.name}
                    </ThemedText>
                    <ThemedText
                      style={[styles.apartmentPrice, { color: colors.primary }]}
                    >
                      {apt.price}
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
                  const fullApt = apartmentDetails.find((a) => a.id === apt.id);
                  if (fullApt) {
                    setSelectedApartment(fullApt);
                    setModalVisible(true);
                  }
                }}
              >
                <View
                  style={[styles.featuredImage, { backgroundColor: apt.image }]}
                />
                <View style={styles.featuredInfo}>
                  <ThemedText style={styles.featuredName}>
                    {apt.name}
                  </ThemedText>
                  <ThemedText
                    style={[styles.featuredPrice, { color: colors.primary }]}
                  >
                    {apt.price}
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
