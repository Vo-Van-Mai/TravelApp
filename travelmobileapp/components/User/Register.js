import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";
import MyStyle from "../../styles/MyStyle";
import { useEffect, useState } from "react";
import { Button, HelperText, RadioButton, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import Apis, { endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";

const Register = () => {


    const info = [{
        label: "Tên",
        field: "first_name",
        secureTextEntry: false,
        icon: "text"
    }, {
        label: "Họ và tên lót",
        field: "last_name",
        secureTextEntry: false,
        icon: "text"
    }, {
        label: "Tên đăng nhập ",
        field: "username",
        secureTextEntry: false,
        icon: "account"
    }, {
        label: "email ",
        field: "email",
        secureTextEntry: false,
        icon: "email"
    }, {
        label: "Số điện thoại ",
        field: "phone",
        secureTextEntry: false,
        icon: "phone"
    }, {
        label: "Mật khẩu ",
        field: "password",
        secureTextEntry: true,
        icon: "eye"
    }, {
        label: "xác nhận mật khẩu ",
        field: "confirm",
        secureTextEntry: true,
        icon: "eye"
    }]

    const [user, setUser] = useState({});
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(null);
    const [role, setRole] = useState([]);
    const nav = useNavigation();


    const setState = (value, field) => {
        setUser({ ...user, [field]: value })
    }

    const loadRole = async () => {
        res = await Apis.get(endpoints['role']);
        // setRole(role => role.filter(res.data.name !== "admin"));
        roleFilter = res.data.filter(role => role.name !== "admin")
        setRole(roleFilter);
        console.log("all role tru admin: ", roleFilter)
    }

    useEffect(() => {
        loadRole();
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
        if (!user.first_name || !user.last_name || !user.phone || !user.email || !user.password || !user.confirm || !user.role_id) {
            setMsg("Vui lòng nhập đầy đủ thông tin!");
            // console.log(user);
            return false;
        }
        if (user.password !== user.confirm) {
            setMsg("Mật khẩu xác nhận không khớp!");
            return false;
        }
        if (!user.avatar || !user.avatar.uri) {
            setMsg("Vui lòng chọn ảnh đại diện!");
            return false;
        }
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            setMsg("Email không hợp lệ!");
            return false;
        }
        if (!user.password || user.password.length < 6) {
            setMsg("Mật khẩu phải từ 6 ký tự trở lên!");
            return false;
        }
        return true;
    }

    const register = async () => {
        if (validate() === true) {
            try {
                setLoading(true);
                let form = new FormData();
                for (let key in user) {
                    if (key !== "confirm") {
                        if (key === "avatar") {
                            form.append('avatar', {
                                uri: user.avatar?.uri,
                                name: user.avatar?.fileName || "avatar.jpg",
                                type: user.avatar?.type?.includes("image") ? "image/jpeg" : user.avatar?.type || "image/jpeg"
                            });
                        } else {
                            form.append(key, user[key]);
                        }
                    }
                }

                let url = endpoints["register"]
                console.info("User:", user);
                console.log("API URL:", url);


                res = await Apis.post(url, form, {
                    headers: { 'Content-Type': 'multipart/form-data', }
                });

                if (res.status === 201) {
                    nav.navigate("login");
                }
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
                        ĐĂNG KÝ TÀI KHOẢNG
                    </Text>
                </View>
                {info.map(i => <TextInput
                    key={i.field}
                    label={i.label}
                    secureTextEntry={i.secureTextEntry}
                    right={<TextInput.Icon icon={i.icon} />}
                    value={user[i.field]}
                    onChangeText={t => setState(t, i.field)}
                    style={MyStyle.m}
                />)}

                <View style={[MyStyle.m, MyStyle.p]}>
                    <Text>Chọn vai trò: </Text>
                    {role.map(r => (
                        <View key={r.id} style={{ flexDirection: "row", alignItems: "center" }}>
                            <RadioButton
                                value={r.id}
                                status={checked === r.id ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setChecked(r.id);
                                    setState(r.id, "role_id");
                                    console.log(r.id, r.name, user);

                                }}
                            />
                            <Text>{r.name}</Text>
                        </View>
                    ))}
                </View>



                <View style={[MyStyle.m, MyStyle.p, { backgroundColor: "#3568a7ff", borderColor: "#ffffff", borderWidth: 1, width: 200 }]}>
                    <TouchableOpacity onPress={pickerImage}>
                        <Text style={{ fontSize: 18, color: "#ffffff" }}> Chọn ảnh đại diện: </Text>
                    </TouchableOpacity>
                </View>
                {user?.avatar && <Image source={{ uri: user?.avatar.uri }} style={[{ width: 200, height: 200 }, MyStyle.m]}></Image>}
                <HelperText type="error" visible={msg}>
                    {msg}
                </HelperText>
                <Button loading={loading} disabled={loading} mode="contained" onPress={register} style={MyStyle.m}>Đăng kí</Button>
            </ScrollView>


        </SafeAreaView>
    );
}

export default Register;
