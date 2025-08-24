import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const LoadingItem = () => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "#fff",
        paddingBottom: 50
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    
});

export default LoadingItem;