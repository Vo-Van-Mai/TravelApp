import { useContext, useEffect, useState } from "react";
import Header from "../Header/Header";
import { MyTourContext, MyUserContext } from "../../configs/Context";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Apis, { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStyle from "../../styles/MyStyle";
import { Button, Card, Icon, List } from "react-native-paper";
import { formatDate } from "../Comment/Comment";
import FormatCurrency from "../../utils/FormatCurrency";
import AlertItem from "../Header/AlertItem";
import { useNavigation } from "@react-navigation/native";

const DetailTour = ({ route }) => {
    const user = useContext(MyUserContext);
    const listTour = useContext(MyTourContext);
    const tourId = route?.params?.tourId;
    const [loading, setLoading] = useState(false);
    const [tour, setTour] = useState({});
    const nav = useNavigation();

    const getDetailTour = async () => {
        try {
            setLoading(true);
            const resDetaiTour = await Apis.get(endpoints['detailTour'](tourId));
            console.log("resTourDetail", resDetaiTour.data);
            setTour(resDetaiTour.data);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    const publicTour = async () => {
        try {
            setLoading(true);
            console.log("press");
            const res = await authAPI(await AsyncStorage.getItem("token")).post(endpoints["publicTour"](tourId));
            console.log("res", res.status)
            if (res.status === 200) {

                Alert.alert("Thông báo", "Đã đăng tin thành công!", [
                    {
                        text: "Đồng ý",
                        onPress: () => nav.goBack()
                    }
                ])
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const rejectTour = async () => {
        try {
            setLoading(true);
            console.log("press");
            const url = endpoints["detailTour"](tourId) + "reject-tour/";
            res = await authAPI(await AsyncStorage.getItem("token")).post(url);
            console.log("res", res.status)
            if (res.status === 200) {

                Alert.alert("Thông báo", "Đã hủy tin thành công!", [
                    {
                        text: "Đồng ý",
                        onPress: () => nav.goBack()
                    }
                ])
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getDetailTour();
    }, []);

    const renderFooterComponent = () => {
        if (user && user.role === "provider") {
            if(user.id !== tour.provider_id){
                return
            }
            else {

                switch (tour.status) {
                    case "draft":
                        return (
                            <View style={styles.footer}>
                                <Button style={styles.btnFooter} mode="contained" buttonColor="#eaef9d" textColor="#000000">Thêm địa điểm</Button>
                                <Button style={styles.btnFooter} mode="contained" loading={loading} disabled={loading} buttonColor="#336A29" onPress={publicTour}>Đăng tin</Button>
                            </View>
                        );
                    case "rejected":
                        return (
                            <View style={styles.footer}>
                                <Button style={[styles.btnFooter, { width: "100%" }]} mode="contained" loading={loading} disabled={loading} buttonColor="#336A29" onPress={publicTour}>Đăng lại</Button>
                            </View>
                        );
                    default:
                        return (
                            <View style={styles.footer}>
                                <Button style={styles.btnFooter} mode="contained" buttonColor="#336A29">Cập nhật</Button>
                                <Button style={styles.btnFooter} mode="contained" loading={loading} disabled={loading} buttonColor="#DC586D" onPress={rejectTour}>Xóa</Button>
                            </View>
                        );
                }
            }

        }

        if (user && user.role === "traveler") {
            return (
                <View style={styles.footer}>
                    <Button style={styles.btnFooter} mode="contained" buttonColor="#eaef9d" textColor="#000000">Liên hệ</Button>
                    <Button style={styles.btnFooter} mode="contained" buttonColor="#336A29" textColor="#000000">Đặt tour</Button>
                </View>
            );
        }
        return(
            <View>
                <AlertItem title={"Vui lòng đăng nhập để đặt tour!"} />
                <Button onPress={()=> nav.navigate("login", {"params":{"screen":"authLogin"}})} mode="containerd" buttonColor="#336A29" textColor="#ffffff" style={MyStyle.m}> Đăng nhập</Button>
            </View>
        );
    }


    return (
        <View style={MyStyle.container}>
            <Header title={`${tour?.title}`} />
            <FlatList
                data={tour?.tourplaces}
                renderItem={({ item }) =>
                    <View style={styles.itemContainer}>
                        <View style={styles.placeItem}>
                            <View style={{ width: 20 }}>
                                <Text style={{ fontSize: 16 }}>{item.order}</Text>
                            </View>
                            <List.Item
                                title={item.place?.name}
                                description={item.place?.full_address}
                                left={() => <TouchableOpacity>
                                    <Image source={{ uri: item?.place?.images[0]?.url_path }} style={{ width: 100, height: 100, borderRadius: 20 }} />
                                </TouchableOpacity>}
                            />
                        </View>

                        {user && user.role === "provider" && user.id === tour.provider_id && <TouchableOpacity style={styles.btnDelete}>
                            <Icon source="delete-circle-outline" size={26} color="red"></Icon>
                            <Text> Xóa địa điểm</Text>
                        </TouchableOpacity>}
                    </View>
                }
                keyExtractor={(item) => item.place.id.toString()}
                ListEmptyComponent={
                    <AlertItem title="Chưa có danh sách địa điểm!" />
                }
                ListHeaderComponent={
                    <Card>
                        <Card.Content>
                            <Text variant="titleLarge">Tiêu để: {tour.title}</Text>
                            <Text variant="titleLarge">Mô tả: {tour.description}</Text>
                            <Text variant="titleLarge">Ngày tạo: {formatDate(tour.created_date)}</Text>
                            <Text variant="titleLarge">Trạng thái: {tour.status}</Text>
                            <Text variant="titleLarge">Giá: {FormatCurrency(tour.price)}</Text>
                            <Text variant="titleLarge">Giảm giá: {tour.discount}%</Text>
                            <Text variant="titleLarge">Số lượng hành khách tối đa: {tour.capacity}</Text>
                            <Text variant="titleLarge">Thời gian: {tour.duration_display}</Text>
                            <Text variant="titleLarge">Ngày bắt đầu: {tour.start_date}</Text>
                            <Text variant="titleLarge">Ngày kết thúc: {tour.end_date}</Text>

                        </Card.Content>
                    </Card>}
                ListFooterComponent={
                    renderFooterComponent
                }
            />
        </View>

    );
}

const styles = StyleSheet.create({
    placeItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",

    },
    itemContainer: {
        backgroundColor: "#ffffff",
        margin: 5,
        padding: 5,
        borderRadius: 20,
    },
    btnDelete: {
        alignItems: "center",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "center"
    },
    btnFooter: {
        width: "45%",
        margin: 5,
    },
    footer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 10,
        marginTop: 10
    }
});

export default DetailTour;