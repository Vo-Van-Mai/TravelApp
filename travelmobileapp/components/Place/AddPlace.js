import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { ScrollView, Text, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import Styles from "../User/Styles";
import { Button, HelperText, TextInput } from "react-native-paper";
import Apis, { endpoints } from "../../configs/Apis";
import DropdownComponent from "./DropdownComponent";


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
    }
    ]
    const [place, setPlace] = useState({});
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const setState = (value, field) => {
        setPlace({ ...place, [field]: value })
    }


    const loadProvinces = async () => {
        let resProvinces = await Apis.get(endpoints['provinces']);
        console.log("resProvince: ", resProvinces.data)
        setProvinces(resProvinces.data);
    }

    const loadWards = async () => {
        let resWard = await Apis.get(endpoints['wards']);
        console.log("resWard: ", resWard.data)
        setWards(resWard.data);
    }

    useEffect(() => {
        loadProvinces();
        loadWards();
        console.log("Load Province: ", provinces);
        console.log("Load Ward: ", wards.length);
    }, []);

    const selectWard = (id) => {
        console.log("Ward được chọn: ", id);
        setPlace({...place, ward: id})
    };

    const selectProvince = (id) => {
        console.log("Thành phố được chọn: ", id);
        setPlace({...place, province: id})

    };

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
                />)}

                <Text>Thành phố 1: {wards[0]?.name}</Text>
                <DropdownComponent data={provinces} onSelect={selectProvince} title={"Chọn thành phố:"} />

                <DropdownComponent data={wards} onSelect={selectWard} />
                <HelperText type="error" visible={msg}>
                    {msg}
                </HelperText>
                <Button loading={loading} disabled={loading} mode="contained" onPress={() => console.log("addPlace", place)} style={MyStyle.m}>Đăng kí</Button>
            </ScrollView>


        </SafeAreaView>
    );
}

export default AddPlace;