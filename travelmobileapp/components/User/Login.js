import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";
import MyStyle from "../../styles/MyStyle";
import { useContext, useEffect, useState } from "react";
import { Button, HelperText, RadioButton, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import Apis, { authAPI, endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext } from "../../configs/Context";

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

    const [user, setUser] = useState({});
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const dispatch = useContext(MyDispatchContext);


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
                console.log(process.env.REACT_APP_CLIENT_ID);

                let res = await Apis.post(endpoints['login'], {
                    ...user,
                    'client_id': "9tvY8f7h4FgF8G2CajadYOz5EM3Q6YRm7YFMvZnK",
                    'client_secret': "bc8R9ybAtAomaU7ebOF0FRwvwxSIihDxj7Gyjnn08KefpJnm2rlJbWUDzJ46m4ZhMSpru4qUoB2pQxyZTCUt3IIehRKPIzilL4OyCwDpiw3UPwVRtT6iKzWSLdjFrHT9",
                    'grant_type': 'password'}, {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });

                if (res.status === 200){
                    console.log(res.data);
                    await AsyncStorage.setItem("token", res.data.access_token);
                    let u = await authAPI(res.data.access_token).get(endpoints['current-user']);
                    console.log("curretn-user: ", u.data);
                    
                    dispatch({
                        "type": "login",
                        "payload": u.data
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
                <View style={Styles.headerStyle}>
                    <Text style={[Styles.titleRegister, MyStyle.m]}>
                        ĐĂNG NHẬP
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

                <HelperText type="error" style={MyStyle.msg_error} visible={msg}>
                    {msg}
                </HelperText>
                <Button loading={loading} disabled={loading} mode="contained" onPress={login} style={MyStyle.m}>Đăng nhập</Button>
            </ScrollView>


        </SafeAreaView>
    );
}

export default Login;
