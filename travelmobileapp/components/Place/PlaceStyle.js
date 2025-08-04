import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container:{
        margin: 10,
        width: 200,
        borderColor: "red",
        borderWidth: 1,
        borderRadius: 10,
    },
    
    bgColor: {
        backgroundColor: "#aedaff",
    },

    // Rating styles
    ratingContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
    },
    ratingCard: {
        borderRadius: 10,
        elevation: 2,
    },
    averageRatingContainer: {
        alignItems: "center",
        paddingVertical: 10,
    },
    averageRatingText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#FFD700",
        marginBottom: 5,
    },
    starsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    star: {
        marginHorizontal: 2,
    },
    totalRatingsText: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
    },
    divider: {
        marginVertical: 15,
        height: 1,
        backgroundColor: "#e0e0e0",
    },
    userRatingContainer: {
        alignItems: "center",
        paddingVertical: 10,
    },
    userRatingTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 10,
    },
    userRatingStars: {
        alignItems: "center",
    },
    userRatingText: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
    },
});