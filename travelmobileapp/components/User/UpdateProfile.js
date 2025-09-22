import { Image, View } from "react-native";
import Header from "../Header/Header";
import MyStyle from "../../styles/MyStyle";
import { Card, TextInput } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/Context";
import { styles } from "./Profile";
import { ScrollView } from "react-native-gesture-handler";

const UpdateProfile = () => {
    const user = useContext(MyUserContext);
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
        label: "Mật khẩu mới ",
        field: "password",
        secureTextEntry: true,
        icon: "eye",
    },{
        label: "Xác nhân mật khẩu mới ",
        field: "confirm",
        secureTextEntry: true,
        icon: "eye"
    }];

    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(null);
    const [userUpdate, setUserUpdate] = useState({});
    
    const setState = (value, field) => {
        setUserUpdate({ ...userUpdate, [field]: value })
        console.log("user", user);
        console.log("user update", userUpdate);
    }

    useEffect(() => {
        setUserUpdate({...user});
    }, []);

    return (
        <View style={MyStyle.container}>
            <Header title={"Cập nhật hồ sơ"} />
            
            <ScrollView>
                <Card >
                    <Card.Cover source={{uri: userUpdate.avatar}} style={styles.avatar} />
                </Card>
                {info.map(i => <TextInput
                    key={i.field}
                    label={i.label}
                    secureTextEntry={i.secureTextEntry}
                    right={<TextInput.Icon icon={i.icon} />}
                    value={userUpdate[i.field]}
                    onChangeText={t => setState(t, i.field)}
                    style={MyStyle.m}
                />)}
            </ScrollView>

                
        </View>
    );
}

export default UpdateProfile;