import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
    },
    addCommentCard: {
        marginBottom: 15,
        borderRadius: 10,
        elevation: 2,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 80,
        textAlignVertical: "top",
        marginBottom: 10,
    },
    addButton: {
        marginTop: 5,
    },
    divider: {
        marginVertical: 15,
        height: 1,
        backgroundColor: "#e0e0e0",
    },
    commentsList: {
        flex: 1,
    },
    commentCard: {
        marginBottom: 10,
        borderRadius: 10,
        elevation: 1,
    },
    commentHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    avatar: {
        marginRight: 10,
        backgroundColor: "#2196F3",
    },
    commentInfo: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    commentDate: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    commentContent: {
        fontSize: 15,
        color: "#333",
        lineHeight: 20,
    },
    loadingText: {
        textAlign: "center",
        fontSize: 16,
        color: "#666",
        marginTop: 20,
    },
    noCommentsText: {
        textAlign: "center",
        fontSize: 16,
        color: "#666",
        marginTop: 20,
        fontStyle: "italic",
    },
});