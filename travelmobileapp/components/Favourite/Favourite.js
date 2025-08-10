import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { useContext } from "react";
import { MyFavouriteContext } from "../../configs/Context";
import { List } from 'react-native-paper';
import Header from "../Header/Header";

const Favourite = () => {
    const favourite = useContext(MyFavouriteContext);
    if (favourite.length === 0) {
        return (
            <SafeAreaView style={MyStyle.container}>
                <Header title="DANH SÁCH YÊU THÍCH" />
                <View style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                    <View style={styles.header}>
                    <Text style={[{ color: "darkblue" }]}>Bạn chưa thích địa điểm nào!</Text>   

                    </View>
                </View>
            </SafeAreaView>

        );
    }
    return (
        <SafeAreaView style={MyStyle.container}>
            <Header title="DANH SÁCH YÊU THÍCH" />
            <View style={[MyStyle.m, MyStyle.p]}>
                {favourite?.map((item, index) =>
                    <List.Item
                        key={`${item.id}-${index}`}
                        title={item.place.name}
                        description={item.place?.full_address || "không có"}
                        left={() => <Image source={{ uri: item.place?.image }} style={styles.avatar}></Image>}
                    />)}

            </View>

        </SafeAreaView>
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