import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import Header from "../Header/Header";
import { MyUserContext } from "../../configs/Context";
import { useContext, useEffect, useState } from "react";
import { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { List } from "react-native-paper";
import AlertItem from "../Header/AlertItem";
import { useNavigation } from "@react-navigation/native";

const ListBooking = () => {
    const user = useContext(MyUserContext);
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();

    const loadBooking = async () => {
        try {
            setLoading(true);
            if(user?.role=="traveler"){
                let url = endpoints['booking']+"get-list-booking";
                const res = await authAPI(await AsyncStorage.getItem("token")).get(url);
                setBookings(res.data);
            }
            else if (user?.role=="provider"){
                let url = endpoints['booking']+"get-bookings-by-provider";
                const res = await authAPI(await AsyncStorage.getItem("token")).get(url);
                setBookings(res.data);
            }
        } catch (error) {
            console.log("Error", error);
            
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBooking();
    }, []);

    return(
        <View style={MyStyle.container}>
            {user?.role=="traveler" && <>
            <Header title={"Danh sách tour đã đặt"} />
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => 
                    <List.Item
                        style={style.border}
                        title={item.tour.name}
                        description={item.tour.provider_name}
                        left={() => <TouchableOpacity onPress={()=> nav.navigate("main", {
                                        screen: "tour", 
                                        params: {
                                            screen: "detailTour", 
                                            params: { tourId: item.tour.id }
                                        }
                                        })}>
                            <Image source={{uri: item.tour.provider_avatar}} style={{width: 100, borderRadius: 20, height: 100}} />
                        </TouchableOpacity>}
                    />
                }       
                ListEmptyComponent={
                    <AlertItem title="Bạn chưa đặt tour nào!" />
                }
            />
            </>}

            {user?.role=="provider" &&<>
                <Header title={"Danh sách booking"} />
                <FlatList
                data={bookings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => 
                    <List.Item
                        style={style.border}
                        title={item.tour.name}
                        description={`Người đặt: ${item.user.username}`}
                        left={() => <TouchableOpacity onPress={()=> nav.navigate("main", {
                                        screen: "tour", 
                                        params: {
                                            screen: "detailTour", 
                                            params: { tourId: item.tour.id, bookingId: item.id }
                                        }
                                        })}>
                            <Image source={{uri: item.tour.provider_avatar}} style={{width: 100, borderRadius: 20, height: 100}} />
                        </TouchableOpacity>}
                    />
                }       
                ListEmptyComponent={
                    <AlertItem title="Bạn chưa đặt tour nào!" />
                }
            />
            </>}
        </View>
    );
}

const style = StyleSheet.create({
    border:{
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: "#000",
        marginTop: 5,
        padding: 10
    }
});

export default ListBooking;