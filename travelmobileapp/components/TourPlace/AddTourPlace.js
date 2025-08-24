import { Text, TouchableOpacity, View } from "react-native";
import Header from "../Header/Header";
import { useEffect, useState } from "react";
import { Button, HelperText } from "react-native-paper";
import DatetimePiker from "../Header/DatetimePicker";
import Apis, { authAPI, endpoints } from "../../configs/Apis";
import MyStyle from "../../styles/MyStyle";
import Style from "./Style";
import AlertItem from "../Header/AlertItem";
import DropdownComponent from "../Place/DropdownComponent";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AddTourPlace = ({ route }) => {
    const tourId = route?.params?.tourId;
    const [placeTour, setPlaceTour] = useState([]);
    const [loading, setLoading] = useState(false);
    const [place, setPlace] = useState([]);
    const nav = useNavigation();
    const [msg, setMsg] = useState("");


    const loadTourPlace = async () => {
        try {
            setLoading(true);
            let url = endpoints['detailTour'](tourId) + "get-tourplace";
            const res = await Apis.get(url);
            console.log("res tourplace", res.data);
            setPlaceTour(res.data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const loadPlace = async () => {
        try {
            setLoading(true);
            let url = endpoints['places'] + "?all=true";
            console.log(url);
            const res = await Apis.get(url);
            console.log(res.data);
            setPlace(res.data);

        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }

    const addPlaceTour = () => {
        setPlaceTour([...placeTour, { order: placeTour.length + 1 }])

    }

    const selectedPlace = (order, placeId) => {
        setPlaceTour(prev => prev.map(p => p.order === order ? { ...p, place: placeId } : p))
    }

    useEffect(() => {
        loadPlace();
    }, []);

    useEffect(() => {
        loadTourPlace();
    }, []);

    const handelCreate = async () => {
        try {
            setLoading(true);
            let url = endpoints["detailTour"](tourId) + "tour-place/";
            console.log("url post", url);
            const payload = {
                "tourplaces": placeTour.map(p => (
                    {
                        "order": p.order,
                        "place_id": p.place,
                        "visit_time": new Date(p.visit_time.split("/").reverse().join("-")).toISOString()
                    }
                ))
            }
            console.log("payload", payload);
            const res = await authAPI(await AsyncStorage.getItem("token")).post(url, payload);
            console.log("status", res.status)
            if (res.status === 201) {
                nav.goBack();
            }
        } catch (err) {
            if (err.response) {
                // Server trả về status code ngoài 2xx
                console.log("Status:", err.response.status);
                console.log("Data:", err.response.data);
                setMsg(err.response.data.message);
            } else if (err.request) {
                // Request gửi đi nhưng không có response
                console.log("Request error:", err.request);
            } else {
                console.log("Error message:", err.message);
            }
        } finally {
            setLoading(false);
        }
    }


    const renderPlaceItem = ({ item }) => {
        return (
            <View key={item.order}>
                <DropdownComponent title={`Địa điểm ${item.order}`} data={place} onSelect={(placeId) => selectedPlace(item.order, placeId)} />

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                    <Text>Ngày tham quan: </Text>
                    <Text>{item.visit_time ? `Ngày: ${item.visit_time}` : "Chưa chọn ngày"}</Text>
                    <DatetimePiker
                        mode="date"
                        setOpenHours={(val) =>
                            setPlaceTour(prev =>
                                prev.map(p =>
                                    p.order === item.order ? { ...p, visit_time: val } : p
                                )
                            )
                        }
                    />
                </View>
            </View>
        );
    };


    return (
        <View style={MyStyle.container}>
            <Header title={"Thêm địa điểm tham quan"} />
            <Text>TourId {tourId}</Text>

            <FlatList
                data={placeTour}
                renderItem={renderPlaceItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<AlertItem title={"Chưa có địa điểm, hãy thêm"} />}
                ListFooterComponent={
                    <View>
                        <HelperText type="error" style={MyStyle.msg_error} visible={msg}>
                            {msg}
                        </HelperText>
                        <View style={{ alignItems: "center", display: "flex", flexDirection: "row", marginTop: 10, justifyContent: "space-between" }}>
                            <Button onPress={addPlaceTour} style={Style.btnAddPlaceTour} >
                                <Text>Thêm địa điểm</Text>
                            </Button>

                            <Button loading={loading} disabled={loading} onPress={handelCreate} style={Style.btnDone}>
                                <Text style={{ color: "#30e9ff" }}> Hoàn thành</Text>
                            </Button>
                        </View>

                    </View>
                }
            />
        </View>
    );
}

export default AddTourPlace;