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
            color: "#011c40",
            fontSize: 24,
            alignItems: "center",
            justifyContent: "center",
            textAlign:"center"
        },
        headerStyle: {
            height: 60,
            borderColor: "#011c40",
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
            margin: 5,
            // marginTop: 50,
            borderRadius: 20,
            backgroundColor: "#a7ebf2",
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