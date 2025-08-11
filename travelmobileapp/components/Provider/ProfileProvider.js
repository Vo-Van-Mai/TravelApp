import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Header/Header";
import MyStyle from "../../styles/MyStyle";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { MyProviderContext, MyUserContext } from "../../configs/Context";
import { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "react-native-paper";
import Styles from "../User/Styles";
import { useNavigation } from "@react-navigation/native";

const ProfileProvider = () => {
    const user = useContext(MyUserContext);
    const nav = useNavigation();
    const provider = useContext(MyProviderContext);
    console.log("profileProvider", provider);

    const [loading, setLoading] = useState(false);

    if (!user.is_provider) {
        return (
            <View style={[MyStyle.container, { alignItems: "center" }]}>
                <Header title={"Bạn chưa được duyệt!"} />
                <TouchableOpacity onPress={() => nav.goBack()} style={{ width: "30%", height: 50, backgroundColor: "lightgray", justifyContent: "center", alignSelf: "center", margin: 20 }}>
                    <Text style={{ textAlign: "center", color: "#000000", justifyContent: "center", fontSize: 20 }}>Quay lại</Text>
                </TouchableOpacity>

            </View>
        );
    }

    if (!provider) {
        return (
            <View style={[MyStyle.container, { alignItems: "center" }]}>
                <Header title={"Bạn chưa tạo công ty!"} />
                <TouchableOpacity onPress={() => nav.navigate("AddProfile")} style={{ width: "30%", height: 50, backgroundColor: "lightgray", justifyContent: "center", alignSelf: "center", margin: 20 }}>
                    <Text style={{ textAlign: "center", color: "#000000", justifyContent: "center", fontSize: 20 }}>Tạo ngay</Text>
                </TouchableOpacity>

            </View>
        );
    }

    return (
        <View style={[MyStyle.container]}>
            <Header title={"Thông tin công ty"} />

            <Card>
                <Card.Cover source={provider?.avatar
                    ? { uri: provider?.avatar }
                    : require('../../assets/defaultUserAvatar.png')} style={styles.avatar} />
                <Card.Content>
                    <Text style={styles.mainTitle} variant="titleLarge"> Thông tin công ty </Text>
                    <Text style={styles.subTitle}> <Text style={styles.boldTitle}>Tên công ty: </Text> {provider?.name}</Text>
                    <Text style={styles.subTitle}> <Text style={styles.boldTitle}>Thông tin:</Text>  {provider?.description} </Text>
                    <Text style={styles.subTitle}> <Text style={styles.boldTitle}>Đại chỉ:</Text>  {provider?.full_address} </Text>
                    <Text style={styles.subTitle}> <Text style={styles.boldTitle}>Hotline:</Text>  {provider?.user?.phone || "chưa cập nhật"} </Text>
                    <Text style={styles.subTitle}> <Text style={styles.boldTitle}>Email:</Text>  {provider?.user?.email || "chưa cập nhật"} </Text>
                    <Text style={styles.subTitle}> <Text style={styles.boldTitle}>Trạng thái:</Text>  {provider?.active ? "Còn hoạt động" : "Đã ngưng hoạt động"} </Text>
                </Card.Content>
            </Card>
        </View>
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

export default ProfileProvider;