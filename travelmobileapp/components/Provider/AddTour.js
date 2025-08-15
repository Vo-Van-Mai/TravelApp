import { Text, View } from "react-native";
import Header from "../Header/Header";
import { useState } from "react";
import { Button, HelperText, TextInput } from "react-native-paper";
import DatetimePiker from "../Header/DatetimePicker";
import MyStyle from "../../styles/MyStyle";
import { styles } from "../Place/AddPlace";
import { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddTour = () => {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [newTour, setNewTour] = useState({});
    const setState = (value, field) => {
        setNewTour({ ...newTour, [field]: value });
    }

    const info = [{
        label: "Tên chuyến đi",
        field: "title",
        secureTextEntry: false,
        icon: "text"
    }, {
        label: "Mô tả chuyến đi",
        field: "description",
        secureTextEntry: false,
        icon: "text"
    }, {
        label: "Giá:",
        field: "price",
        secureTextEntry: false,
        icon: "text"
    }, {
        label: "Giảm giá:",
        field: "discount",
        secureTextEntry: false,
        icon: "text"
    }, {
        label: "Số lượng hành khách",
        field: "capacity",
        secureTextEntry: false,
        icon: "text"
    }, {
        label: "Ngày bắt đầu:",
        field: "start_date",
        secureTextEntry: false,
        icon: "text"
    }, {
        label: "Ngày kết thúc:",
        field: "end_date",
        secureTextEntry: false,
        icon: "text"
    }]

    const parserDate = (dateStr) => {
        const [day, month, year] = dateStr.split("/").map(Number);
        return new Date(year, month - 1, day); // month - 1 vì tháng trong JS bắt đầu từ 0
    }

    function formatDateToISO(dateString) {
        const [day, month, year] = dateString.split("/");
        return `${year}-${month}-${day}`; 
    }

    const validate = () => {
        if (Object.values(newTour).length === 0) {
            setMsg("Vui lòng điền thông tin!");
            return false;
        }

        for (let i of info) {
            if (newTour[i.field] === "" || !newTour[i.field]) {
                setMsg(`Vui lòng nhập ${i.label}!`);
                return false;
            }
        }

        console.log("type of discount", typeof(newTour.discount))

        if (newTour.discount < 0 || newTour.discount > 100){
            setMsg("Giảm giá phải >=0 và nhỏ hơn 100");
            return false;
        }

        start_date = parserDate(newTour.start_date);
        console.log("start_date", start_date)
        end_date = parserDate(newTour.end_date);
        if (start_date > end_date) {
            console.log("Ngày bắt đầu lớn hơn ngày kết thúc!");
            setMsg("Ngày bắt đầu lớn hơn ngày kết thúc!");
            return (false);
        }



        setMsg("");
        return true;
    }

    const createTour = async () => {
        if (validate() === true) {
            console.log("Press")
            try {
                setLoading(true);
                const data = {
                    "title": newTour.title,
                    "description": newTour.description,
                    "price": newTour.price,
                    "start_date": formatDateToISO(newTour.start_date),
                    "end_date": formatDateToISO(newTour.end_date),
                    "discount": newTour.discount,
                    "capacity": newTour.capacity

                }

                console.log("data", data);
                let url = endpoints["tour"];
                console.log(await AsyncStorage.getItem("token"))
                const res = await authAPI(await AsyncStorage.getItem("token")).post(url, data);
                console.log("res", res.data);
                if (res.data.status === 201) {
                    console.log("success")
                }

            } catch (error) {
                if (error.response) {
                    // Server trả về lỗi (status code ngoài 2xx)
                    console.log("Server error:", error.response.status, error.response.data);
                } else if (error.request) {
                    // Request gửi đi nhưng không nhận được phản hồi (network error, timeout...)
                    console.log("Network error:", error.message);
                } else {
                    // Lỗi khác khi setup request
                    console.log("Setup error:", error.message);
                }
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <View style={MyStyle.container}>
            <Header title="Thêm tour" />

            <View>
                {info.map(i => i.field === "start_date" ? (
                    <View key={i.field} style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", margin: 10 }}>
                        <TextInput style={{ backgroundColor: "white", width: 130, color: "#000000" }} disabled key={i.field}>{i.label}</TextInput>
                        <Text style={styles.hours}>{newTour?.start_date || ""}</Text>
                        <DatetimePiker setOpenHours={((val) => setState(val, i.field))} mode="date" />

                    </View>
                ) : i.field === "end_date" ? (
                    <View key={i.field} style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", margin: 10 }}>
                        <TextInput style={{ backgroundColor: "white", width: 130, color: "#000000" }} disabled key={i.field}>{i.label}</TextInput>
                        <Text style={styles.hours}>{newTour?.end_date || ""}</Text>
                        <DatetimePiker setOpenHours={((val) => setState(val, i.field))} mode="date" />

                    </View>
                ) : (
                    <TextInput
                        key={i.field}
                        label={i.label}
                        secureTextEntry={i.secureTextEntry}
                        right={<TextInput.Icon icon={i.icon} />}
                        value={newTour[i.field]}
                        onChangeText={t => setState(t, i.field)}
                        style={MyStyle.m}
                        multiline={i.field === "description"}
                        numberOfLines={i.field === "description" ? 10 : 1
                        
                        }
                    />
                ))

                }

            </View>
            <HelperText type="error" visible={msg} style={MyStyle.infoError}>
                {msg}
            </HelperText>
            <Button loading={loading} disabled={loading} mode="contained" onPress={createTour}>Tạo tour</Button>

        </View>
    );
}

export default AddTour;