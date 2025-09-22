import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { useContext } from "react";
import { MyDispatchFavouriteContext, MyFavouriteContext } from "../../configs/Context";
import { Card, List } from 'react-native-paper';
import Header from "../Header/Header";
import AlertItem from "../Header/AlertItem";
import { useNavigation } from "@react-navigation/native";
import PlaceStyle from "../Place/PlaceStyle";
import Icon from 'react-native-vector-icons/FontAwesome';
import { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Favourite = () => {
    const favourite = useContext(MyFavouriteContext);
    const dispatch = useContext(MyDispatchFavouriteContext);
    const nav = useNavigation();

    const dislike = async (placeId) => {
        Alert.alert("Thông báo", "Bạn muốn bỏ thích địa điểm này?", [
            {
                text: "hủy",
                style: "default"
            },
            {
                text: "Đồng ý",
                onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem("token");
                        const url = endpoints["placeDetail"](placeId) + "get-favourite/";
                        console.log("url", url);

                        const res = await authAPI(token).post(url);

                        if (res.status === 201) {
                            Alert.alert("Thông báo", "Hủy thành công!");
                            dispatch({
                                "type": "del_favourite",
                                "payload": res.data.id
                            });
                        } else {
                            Alert.alert("Thông báo", "Hủy thất bại!");
                        }
                    } catch (err) {
                        console.error(err);
                        Alert.alert("Lỗi", "Không thể kết nối server!");
                    }
                },
            },
        ])
    }

    return (
        <SafeAreaView style={MyStyle.container}>

            <FlatList
                data={favourite}
                renderItem={({ item }) =>
                    <Card style={[PlaceStyle.bgColor, { margin: 10, paddingLeft: 15 }]}>
                        <List.Item
                            title={item.place.name}
                            description={item.place?.full_address || "không có"}
                            left={() => <TouchableOpacity onPress={() => nav.navigate("placeDetail", {
                                "placeId": item.place.id
                            }
                            )}>
                                <Image source={{ uri: item.place?.image }} style={styles.avatar}></Image>
                            </TouchableOpacity>}
                        />
                        <TouchableOpacity style={styles.iconWrapper} onPress={() => dislike(item.place.id)}>
                            <Icon name='trash' color="blue" size={20}></Icon>
                        </TouchableOpacity>
                    </Card>
                }
                keyExtractor={(item) => item.id.toString()}

                ListHeaderComponent={< Header title="DANH SÁCH YÊU THÍCH" />}
                ListEmptyComponent={< AlertItem title={"Chưa có địa điểm yêu thích!"} />}

            />

        </SafeAreaView >
    );
}

export default Favourite;

const styles = StyleSheet.create({
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#000000",
        resizeMode: "stretch"
    },
    header: {
        borderWidth: 1,
        borderColor: "#000000",
        width: "90%",
        height: 40,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10
    },
    iconWrapper: {
        position: "absolute",
        top: 8,
        right: 8,
    },
});