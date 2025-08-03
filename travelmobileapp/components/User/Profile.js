import { Dimensions, Text, View } from "react-native";
import { MyDispatchContext, MyUserContext } from "../../configs/Context";
import { useContext } from "react";
import Styles from "./Styles";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
    const user = useContext(MyUserContext);
    const userDispatch = useContext(MyDispatchContext);
    const nav = useNavigation();
    const logout = () => {
        userDispatch({
            "type": "logout"
        });
        nav.navigate("index", {
            screen: "Home"
        });
    }

    return (
        <View>
            <View style={Styles.headerStyle}>
                <Text style={{ color: "red", fontSize: 24 }}> Chào {user.username}! </Text>
            </View>
            <Button mode="contained" onPress={logout}>Đăng xuất</Button>

        </View>
    );
}

export default Profile;