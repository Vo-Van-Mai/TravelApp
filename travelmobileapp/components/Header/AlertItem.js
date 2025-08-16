import { StyleSheet } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";

const AlertItem = ({title}) => {
    return(
        <View style={styles.container}>
            <Text style={styles.content}>
                {title}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        justifyContent: "center",
        backgroundColor: "#a7e0c4ff",
        marginTop: 10,
        borderRadius: 10
    },
    content: {
        textAlign: "center",
        fontSize: 18
    }
});

export default AlertItem;