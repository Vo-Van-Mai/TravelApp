import { Alert, Text, View } from "react-native";
import Header from "../Header/Header";
import MyStyle from "../../styles/MyStyle";
import { Button, Card, TextInput } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AlertItem from "../Header/AlertItem";

const Booking = ({route}) => {

    const { tour } = route.params;
    console.log("tour_id", tour.id)
    const has_booked = route.params?.has_booking || 0;

    const [booking, setBooking] = useState({});
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const setState = (value, field) => {
        setBooking({ ...booking, [field]: value })
    }
    const [newBooking, setNewBooking] = useState({});
    const [checkPayment, setCheckPayment] = useState(false);


    const validate = () => {
        if(!booking.number_of_people) {
            Alert.alert("Thông báo","Vui lòng nhập số lượng hành khách", [{text: "OK"}]);
            return false;
        };
        if(booking.number_of_people <= 0 || booking.number_of_people > tour.capacity) {
            Alert.alert("Thông báo",`Số lượng hành khách phải lớn hơn 0 và nhỏ hơn hoặc bằng ${tour.capacity}`, [{text: "OK"}]);
            return false;
        };
        return true;
    }

    useEffect(() => {
        setState(0, "number_of_people");
    }, [tour.id]);


    const handleBooking = async () => {
        if(validate()) {
            try{
                setLoading(true);
                let url = endpoints['booking'];
                let res = await authAPI(await AsyncStorage.getItem("token")).post(url, {
                    "tour": tour.id,
                    "number_of_people": booking.number_of_people,
                    "total_price": parseFloat(tour.price) * booking.number_of_people}
                )
                if(res.status == 201) {
                    setNewBooking(res.data);
                    Alert.alert("Thông báo","Đặt tour thành công", [{text: "OK"}]);
                    // nav.goBack();
                    setCheckPayment(true);
                } else {
                    Alert.alert("Thông báo","Đặt tour thất bại", [{text: "OK"}]);
                }
            } catch(err) {
                if(err.response.status == 400) {
                    Alert.alert("Thông báo","Đặt tour thất bại. Vui lòng kiểm tra lại thông tin", [{text: "OK"}]);
                }
            } finally {
                setLoading(false);
            }
        }
    }

    const handlePayment = async () => {
        try {
            setLoading(true);
            let url = endpoints["booking"] + `${newBooking.id}/create_payment/`;
            console.log(url);
            const res = await authAPI(await AsyncStorage.getItem("token")).post(url);
            console.log("res", res.data);
             if (res.status === 200) {
            nav.navigate("payment", { url: res.data.payUrl });
            } else {
                Alert.alert("Thông báo", "Không tạo được link thanh toán");
            }
        } catch (error) {
            console.log(error);
        } finally{
            setLoading(false);
        }
    }

    return (
        <View style={MyStyle.container}>
            <Header title={"Thông tin đặt tour"}></Header>
            <Card>
                <Card.Content>
                    <Text variant="titleLarge">Tên chuyến đi: {tour.title}</Text>
                    <Text variant="titleLarge">Công ty: {tour.provider.name}</Text>
                    <Text variant="titleLarge">Giá: {tour.price} VND</Text>
                    <Text variant="titleLarge">Mô tả: {tour.description}</Text>
                    <Text variant="titleLarge">Thời gian: {tour.duration_display} ngày</Text>
                    <Text variant="titleLarge">Khởi hành: {tour.start_date}</Text>
                    <Text variant="titleLarge">Kết thúc: {tour.end_date}</Text>
                    <Text variant="titleLarge">Số lượng hành khách tối đa: {tour.capacity}</Text>
                </Card.Content>
            </Card>
            { has_booked === 0 ? <>
                <View>
                    <TextInput label="Nhập số lượng hành khách" mode="outlined" keyboardType="numeric"
                                secureTextEntry={false}
                                right={<TextInput.Icon icon="text" />}
                                onChangeText={(value) => setState(parseInt(value), "number_of_people")}
                                />
                </View>
            { checkPayment === true ? <Button loading={loading} disabled={loading} mode="contained" style={{ margin: 10 }} onPress={handlePayment}>Thanh toán</Button> 
            : <Button loading={loading} disabled={loading} mode="contained" style={{ margin: 10 }} onPress={handleBooking}>Đặt tour</Button>}
            </>: <>
                <AlertItem title={"Bạn đã đặt tour này"}/>
            </>}
    </View>
    );
}



export default Booking;