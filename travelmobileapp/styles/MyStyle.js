import { StyleSheet } from "react-native";

export default StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: "#bdd8e9",
            padding: 10,
            paddingTop: 0,

        },
        mainTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: '#3568a7ff',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 45
        },
        mainHeaderHome: {
            width: "100%",
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            marginBottom: 10,
            marginTop: 20
        },
        //
        textColor: {
            color: "#3568a7ff"
        },
        //background color
        backgroundColor: {
            backgroundColor: "#aedaff"
        },

        //border
        border: {
            borderColor: "#000000",
            borderWidth: 1,
            borderRadius: 20
        },
        m: {
            margin: 10
        },
        p: {
            padding: 10
        },
        msg_error: {
            color: "red",
            fontSize: 16,
            fontWeight: "bold"
        },

        infoError: {
            fontSize: 15,
            textAlign: "center"
        },
        chipNormal: {
            backgroundColor: "#ffffff",
            borderColor: "#ccc",
            borderWidth: 1,
        },
        chipNormalText: {
            color: "#000",
        },
        chipActive: {
            backgroundColor: "#2196F3",   // màu xanh khi chọn
        },
        chipActiveText: {
            color: "#fff",
            fontWeight: "bold",
        },
    }
)