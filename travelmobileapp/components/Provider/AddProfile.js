import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Header from "../Header/Header";
import MyStyle from "../../styles/MyStyle";
import { useContext, useEffect, useState } from "react";
import { Button, HelperText, TextInput } from "react-native-paper";
import { MyProviderContext, MyProviderDispatchContext, MyUserContext } from "../../configs/Context";
import * as ImagePicker from 'expo-image-picker';
import DropdownComponent from "../Place/DropdownComponent";
import Apis, { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AddProfile = () => {
    const info = [{
        label: "Tên",
        field: "name",
        secureTextEntry: false,
        icon: "text"
    }, {
        label: "Mô tả công ty",
        field: "description",
        secureTextEntry: false,
        icon: "text"
    }, {
        label: "Địa chỉ: Ví dụ (127 Lê Văn Lương) ",
        field: "address",
        secureTextEntry: false,
        icon: "road"
    }]

    const providerDispatch = useContext(MyProviderDispatchContext);

    const [provider, setProvider] = useState({});
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const user = useContext(MyUserContext);
    const nav = useNavigation();


    const setState = (value, field) => {
        setProvider({ ...provider, [field]: value });
    }

    const selectWard = (id) => {
        console.log("Ward được chọn: ", id);
        setState(id, "ward")
    };

    const selectProvince = (id) => {
        console.log("Thành phố được chọn: ", id);
        setState(id, "province")
    };

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
    }, []);


    const pickerImage = async () => {
        let { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result =
                await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                setState(result.assets[0], 'avatar')
        }
    }

    const validate = () => {
        if (Object.values(provider).length === 0) {
            setMsg("Vui lòng điền thông tin!")
        }

        for (let i of info) {
            if (provider[i.field] === "" || !provider[i.field]) {
                setMsg(`Vui lòng điền ${i.label}!`);
            }
        }

        let fileName = [{
            field: "province",
            label: "thành phố/tỉnh"
        }, {
            field: "ward",
            label: "phường/xã"
        }, {
            field: "avatar",
            label: "ảnh đại diện"
        }];
        for (let i of fileName) {
            if (!provider[i.field]) {
                setMsg(`Vui lòng nhập ${i.label}!`);
                return false;
            }
        }
        setMsg("");
        return true;
    }

    const register = async () => {
        if (validate() === true) {
            try {
                setLoading(true);
                const form = new FormData();
                for (let key in provider) {
                    if (key === "avatar") {
                        form.append('avatar', {
                            uri: provider.avatar?.uri,
                            name: provider.avatar?.fileName || "avatar.jpg",
                            type: provider.avatar?.type?.includes("image") ? "image/jpeg" : provider.avatar?.type || "image/jpeg"
                        })
                    } else {
                        form.append(key, provider[key]);
                    }
                }

                let url = endpoints['detailProvider'](user?.id)
                console.log("url", url);

                const resData = await authAPI(await AsyncStorage.getItem("token")).post(url, form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })

                if (resData.status === 201) {
                    providerDispatch({
                        "type": "update_provider",
                        "payload": resData.data
                    })
                    nav.goBack();
                }

            } catch (error) {
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
        <ScrollView style={MyStyle.container}>
            <Header title="Đăng kí thông tin" />
            {info.map(i => <TextInput
                key={i.field}
                label={i.label}
                secureTextEntry={i.secureTextEntry}
                right={<TextInput.Icon icon={i.icon} />}
                value={provider[i.field]}
                onChangeText={t => setState(t, i.field)}
                style={MyStyle.m}
            />)}

            <DropdownComponent data={provinces} onSelect={selectProvince} title={"Chọn thành phố:"} />

            <DropdownComponent data={wards} onSelect={selectWard} />

            <View style={[MyStyle.m, MyStyle.p, { backgroundColor: "#3568a7ff", borderColor: "#ffffff", borderWidth: 1, width: 200 }]}>
                <TouchableOpacity onPress={pickerImage}>
                    <Text style={{ fontSize: 18, color: "#ffffff" }}> Chọn ảnh đại diện: </Text>
                </TouchableOpacity>
            </View>

            {provider?.avatar && <Image source={{ uri: provider?.avatar.uri }} style={[{ width: 200, height: 200 }, MyStyle.m]}></Image>}
            <HelperText style={{ textAlign: "center", fontSize: 18 }} type="error" visible={msg}>
                {msg}
            </HelperText>
            <Button loading={loading} disabled={loading} mode="contained" onPress={register} style={MyStyle.m}>Đăng kí</Button>
        </ScrollView>
    );
}

export default AddProfile;