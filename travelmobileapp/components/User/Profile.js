import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { MyDispatchContext, MyUserContext } from "../../configs/Context";
import { useContext } from "react";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Button, Card, Divider, Text } from 'react-native-paper';
import MyStyle from "../../styles/MyStyle";
import ManagementUser from "./ManagemenUser";
import { FontAwesome } from "@expo/vector-icons";

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

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
        <ScrollView style={MyStyle.container}>
            <View style={Styles.headerStyle}>
                <Text style={{ color: "red", fontSize: 24 }}> Chào {user.username}! </Text>
            </View>

            <Card>
                <Card.Cover source={user?.avatar
                    ? { uri: user.avatar }
                    : require('../../assets/defaultUserAvatar.png')} style={styles.avatar} />
                <Card.Content>
                    <Text style={styles.mainTitle} variant="titleLarge"> Thông tin người dùng </Text>
                    <Text style={styles.subTitle}> <Text style={styles.boldTitle}>Họ và tên:</Text> {user?.last_name} {user?.first_name}</Text>
                    <Text style={styles.subTitle}> <Text style={styles.boldTitle}>Tên đăng nhập (username):</Text>  {user?.username} </Text>
                    <Text style={styles.subTitle}> <Text style={styles.boldTitle}>Email:</Text>  {user?.email} </Text>
                    <Text style={styles.subTitle}> <Text style={styles.boldTitle}>Số điện thoại:</Text>  {user?.phone} </Text>
                </Card.Content>
            </Card>

            <Divider bold style={styles.m} />

            <View style={styles.container}>
                {user?.role === "admin" && (
                    <ManagementUser />
                )}
            </View>

            <Button style={styles.m} buttonColor="lightgreen" mode="contained" onPress={() => console.log("update")}>Cập nhật</Button>
            <Button style={styles.m} mode="contained" onPress={logout}>Đăng xuất</Button>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    avatar: {
        borderRadius: 30,
        margin: 5,
        resizeMode: "stretch",
    },
    mainTitle: {
        fontWeight: "bold",
        textAlign: "center",
        color: "darkblue"
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
});

export default Profile;