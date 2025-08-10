import { StyleSheet } from "react-native";

export default StyleSheet.create({
    m:{
        margin: 10,
    },
    alertContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    alertInfo: {
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 10,
        backgroundColor: "#e9fd9fff",
        width: "95%",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    alertText:{
        color: "red"
    }
})