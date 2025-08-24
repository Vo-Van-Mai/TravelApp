import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { useContext } from "react";
import { MyFavouriteContext } from "../../configs/Context";
import { List } from 'react-native-paper';
import Header from "../Header/Header";
import AlertItem from "../Header/AlertItem";
import { useNavigation } from "@react-navigation/native";

const Favourite = () => {
    const favourite = useContext(MyFavouriteContext);
    const nav = useNavigation();
   
    return (
        <SafeAreaView style={MyStyle.container}>

            <FlatList
                data={favourite}
                renderItem={({ item }) =>
                    <List.Item
                        title={item.place.name}
                        description={item.place?.full_address || "không có"}
                        left={() => <TouchableOpacity onPress={() => nav.navigate("index", {
                            screen: "PlaceDetail",
                            params: { placeId: item.place.id }
                        })}>
                            <Image source={{ uri: item.place?.image }} style={styles.avatar}></Image>
                        </TouchableOpacity>}
                    />
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
    }
});