import { StyleSheet } from "react-native";

export default StyleSheet.create(
    {
        titleLogin: {
            color: "green",
            fontSize: 24,
            alignItems: "center",
            textAlign: "center"
        },
        titleRegister: {
            color: "red",
            fontSize: 24,
            alignItems: "center",
            justifyContent: "center"
        },
        headerStyle: {
            height: 100,
            borderColor: "red",
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
            margin: 5,
            // marginTop: 50,
            borderRadius: 20,
            backgroundColor: "#ffffff",
            width: "90%"
        },
        avatar: {
            borderRadius: 30,
            margin: 5,
            resizeMode: "stretch",
        },
        mainTitle: {
            fontWeight: "bold",
            textAlign: "center",
            color: "darkblue",
            fontSize: 22
        },
        subTitle: {
            fontSize: 16,
            margin: 3,
            padding: 3
        },
        boldTitle: {
            fontWeight: "bold"
        },
        m: {
            margin: 5,
        },
        container: {
            backgroundColor: "#ffffff",
            flex: 1
        }
    }
);