import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";
import MyStyle from "../../styles/MyStyle";
import { useContext, useEffect, useState } from "react";
import { Button, HelperText, RadioButton, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import Apis, { authAPI, endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext, MyDispatchFavouriteContext } from "../../configs/Context";
import Header from "../Header/Header";

const Login = () => {
    const info = [{
        label: "Tên đăng nhập ",
        field: "username",
        secureTextEntry: false,
        icon: "account"
    }, {
        label: "Mật khẩu ",
        field: "password",
        secureTextEntry: true,
        icon: "eye"
    }]
    const [show, setShow] = useState(true);
    const [user, setUser] = useState({});
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const dispatch = useContext(MyDispatchContext);
    const favouriteDispatch = useContext(MyDispatchFavouriteContext);


    const setState = (value, field) => {
        setUser({ ...user, [field]: value })
    }


    const validate = () => {
        if (!user.username || !user.password ) {
            setMsg("Vui lòng nhập đầy đủ thông tin!");
            // console.log(user);
            return false;
        }
        return true;
    }

    const login = async () => {
        if (validate() === true) {
            try {
                setLoading(true);
                // console.log(process.env.REACT_APP_CLIENT_ID);

                let res = await Apis.post(endpoints['login'], {
                    ...user,
                    'client_id': process.env.REACT_APP_CLIENT_ID,
                    'client_secret': process.env.REACT_APP_SECRET_KEY,
                    'grant_type': 'password'}, {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });

                if (res.status === 200){
                    console.log(res.data);
                    await AsyncStorage.setItem("token", res.data.access_token);
                    let u = await authAPI(res.data.access_token).get(endpoints['current-user']);
                    console.log("curretn-user: ", u.data);
                    
                    let favourite = await authAPI(res.data.access_token).get(endpoints['favourite']);
                    console.log("Fauvourite place: ", favourite.data);

                    dispatch({
                        "type": "login",
                        "payload": u.data
                    });
                    
                    favouriteDispatch({
                        "type": "set_favourites",
                        "payload": favourite.data
                    });
                    nav.navigate("index", {
                        screen: "Home"
                    });

                }
            }
            catch (ex) {
                if (ex.status === 400)
                    setMsg("Tên đang nhập hoặc mật khẩu không đúng!")

            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <SafeAreaView style={[MyStyle.container, MyStyle.p]}>

            <ScrollView>
                <Header title="ĐĂNG NHẬP" />
                {info.map(i => i.field === "password" ? <TextInput
                    key={i.field}
                    label={i.label}
                    secureTextEntry={show}
                    right={<TextInput.Icon onPress={() => setShow(!show)} icon={i.icon} />}
                    value={user[i.field]}
                    onChangeText={t => setState(t, i.field)}
                    style={MyStyle.m}
                /> : <TextInput
                    key={i.field}
                    label={i.label}
                    secureTextEntry={i.secureTextEntry}
                    right={<TextInput.Icon  icon={i.icon} />}
                    value={user[i.field]}
                    onChangeText={t => setState(t, i.field)}
                    style={MyStyle.m}
                />)}

                <TouchableOpacity style={{alignItems: "flex-end", paddingRight: 10}}><Text>Quên mật khẩu?</Text></TouchableOpacity>

                <HelperText type="error" style={MyStyle.msg_error} visible={msg}>
                    {msg}
                </HelperText>
                <Button  loading={loading} disabled={loading} mode="contained" onPress={login} style={MyStyle.m}>Đăng nhập</Button>
                <View style={{display:"flex", flexDirection: "row", justifyContent: "center"}}>
                    <Text style={{marginRight: 10, padding: 5}}>Bạn chưa có tài khoản?</Text>
                    <TouchableOpacity onPress={() => nav.navigate("register")} style={{backgroundColor: "#ffffff", padding: 5}} ><Text style={{color: "green", fontWeight: "bold"}}>Đăng kí</Text></TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Login;
