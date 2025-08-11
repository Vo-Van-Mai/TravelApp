import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-paper";

const windowWidth = Dimensions.get("window").width

const UtilsComponent = ({ title, icon }) => {
    return (
        <View style={styles.container} >
            <View
                style={[styles.item, {width: "100%"}]}
                activeOpacity={0.7}>
                <View style={styles.iconWrap}>
                    <Icon source={icon} size={28} />
                </View>
                <Text numberOfLines={2} style={styles.label}>{title}</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: "90%",
       
    },

    item: {
        marginRight: 8,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2, // shadow android
        shadowColor: '#000', // ios shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        padding: 8,
    },
    iconWrap: {
        width: 56,
        height: 56,
        borderRadius: 56 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: 8,
        // backgroundColor: '#f2f4f7',
    },
    label: {
        textAlign: 'center',
        fontSize: 16,
        color: '#222',
    },
});

export default UtilsComponent;