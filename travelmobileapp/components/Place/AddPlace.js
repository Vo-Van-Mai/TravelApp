import { useEffect, useState } from "react";
import { Image, SafeAreaView, TouchableOpacity } from "react-native";
import { ScrollView, Text, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import Styles from "../User/Styles";
import { Button, HelperText, TextInput } from "react-native-paper";
import Apis, { authAPI, endpoints } from "../../configs/Apis";
import DropdownComponent from "./DropdownComponent";
import * as ImagePicker from 'expo-image-picker';
import { fill } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AddPlace = () => {
    const info = [{
        label: "Tên địa điểm",
        field: "name",
        secureTextEntry: false,
        icon: "text"
    }, {
        label: "Mô tả",
        field: "description",
        secureTextEntry: false,
        icon: "text"
    },
    {
        label: "Giờ mở cửa",
        field: "open_hours",
        secureTextEntry: false,
        icon: "text"
    },
    {
        label: "Giờ đóng cửa",
        field: "close_hours",
        secureTextEntry: false,
        icon: "text"
    },
    {
        label: "Giá vé",
        field: "ticket_price",
        secureTextEntry: false,
        icon: "text"
    },{
        label: "Địa chỉ: ví dụ 127 đường Nguyễn Trãi",
        field: "address",
        secureTextEntry: false,
        icon: "text"
    }
    ]
    const [place, setPlace] = useState({});
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const nav = useNavigation();

    const setState = (value, field) => {
        setPlace({ ...place, [field]: value })
    }
    const [cates, setCates] = useState([]);
    const loadCate = async () => {
        res = await Apis.get(endpoints['categories']);
        console.log("Danh mục", res.data);
        setCates(res.data);
    }

    const loadProvinces = async () => {
        let resProvinces = await Apis.get(endpoints['provinces']);
        // console.log("resProvince: ", resProvinces.data)
        setProvinces(resProvinces.data);
    }

    const loadWards = async () => {
        let resWard = await Apis.get(endpoints['wards']);
        // console.log("resWard: ", resWard.data)
        setWards(resWard.data);
    }

    useEffect(() => {
        loadProvinces();
        loadWards();
        loadCate();
    }, []);


    const selectWard = (id) => {
        console.log("Ward được chọn: ", id);
        setState(id, "ward")
    };

    const selectProvince = (id) => {
        console.log("Thành phố được chọn: ", id);
        setState(id, "province")
    };

    const selectCategory = (id) => {
        console.log("Danh mục được chọn: ", id);
        setState(id, "category")
    }

    const pickerImage = async () => {
        let { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result =
                await ImagePicker.launchImageLibraryAsync({
                    allowsMultipleSelection: true,
                    mediaTypes: ['images', 'videos']
                });
            if (!result.canceled) {
                console.log("images.asset", result.assets);
                setState(result.assets, "images");
            }
        }
    }

    const validate = () => {
        if (Object.values(place).length == 0) {
            setMsg("Chưa có thông tin! Vui lòng điền đầy đủ");
            return false
        }

        for (let i of info) {
            if (place[i.field] === "" || !place[i.field]) {
                setMsg(`Vui lòng nhập ${i.label}!`);
                return false;
            }
        }

        let fileName = [{
            field: "category",
            label: "danh mục"
        }, {
            field: "province",
            label: "thành phố/tỉnh"
        }, {
            field: "ward",
            label: "phường/xã"
        }, {
            field: "images",
            label: "ảnh địa điểm"
        }];
        for (let i of fileName) {
            if (!place[i.field]) {
                setMsg(`Vui lòng nhập ${i.label}!`);
                return false;
            }
        }
        setMsg("");
        return true;

    }

    const addNewPlace = async () => {
        if (validate() === true) {
            try {
                setLoading(true);
                const form = new FormData();

                for (let key in place) {
                    if (key === "images") {
                        for (let img of place[key]) {
                            form.append('images', {
                                uri: img?.uri,
                                name: img?.fileName || "avatar.jpg",
                                type: img?.type?.includes("image") ? "image/jpeg" : img?.type || "image/jpeg"
                            });
                        }
                    } else {
                        // Các field khác (text)
                        form.append(key, place[key]);
                    }
                }
                const url = endpoints["places"];
                console.log("url", url)
                const resDataPlace = await authAPI(await AsyncStorage.getItem("token")).post(url, form, {
                    headers: { 'Content-Type': 'multipart/form-data', }
                })
                if (resDataPlace.status === 201) {
                    console.log("nav");
                    nav.navigate("index");
                }
                console.log("url", url);
            }
            catch (ex) {
                console.error(ex);
                console.error("Đăng ký lỗi:", ex.message);
                if (ex.response) {
                    console.log("Lỗi từ backend:", ex.response.data);
                } else if (ex.request) {
                    console.log("Không có phản hồi từ server:", ex.request);
                } else {
                    console.log("Lỗi khi thiết lập request:", ex.message);
                }
            } finally {
                setLoading(false);
            }
        }
    }


    return (
        <SafeAreaView style={[MyStyle.container, MyStyle.p]}>

            <ScrollView>
                <View style={Styles.headerStyle}>
                    <Text style={[Styles.titleRegister, MyStyle.m]}>
                        THÊM ĐỊA ĐIỂM
                    </Text>
                </View>
                {info.map(i => <TextInput
                    key={i.field}
                    label={i.label}
                    secureTextEntry={i.secureTextEntry}
                    right={<TextInput.Icon icon={i.icon} />}
                    value={place[i.field]}
                    onChangeText={t => setState(t, i.field)}
                    style={MyStyle.m}
                    multiline={i.field === "description"}
                    numberOfLines={i.field === "description" ? 10 : 1}
                />)}

                <DropdownComponent data={cates} onSelect={selectCategory} title={"Chọn danh mục:"} />

                <DropdownComponent data={provinces} onSelect={selectProvince} title={"Chọn thành phố:"} />

                <DropdownComponent data={wards} onSelect={selectWard} />

                <View style={[MyStyle.m, MyStyle.p, { backgroundColor: "#3568a7ff", borderColor: "#ffffff", borderWidth: 1, width: 200 }]}>
                    <TouchableOpacity onPress={pickerImage}>
                        <Text style={{ fontSize: 18, color: "#ffffff" }}> Chọn ảnh địa điểm: </Text>
                    </TouchableOpacity>
                </View>
                {place?.images && (
                    <ScrollView horizontal={true}>
                        {place.images.map((i, index) => (
                            <View key={index} style={{ marginRight: 10 }}>
                                <Image
                                    source={{ uri: i.uri }}
                                    style={{ width: 200, height: 200, borderRadius: 10 }}
                                />
                            </View>
                        ))}
                    </ScrollView>
                )}

                <HelperText type="error" visible={msg} style={{ fontSize: 15, textAlign: "center" }}>
                    {msg}
                </HelperText>
                <Button loading={loading} disabled={loading} mode="contained" onPress={addNewPlace} style={MyStyle.m}>Thêm địa điểm</Button>
            </ScrollView>
        </SafeAreaView>
    );
}

export default AddPlace;