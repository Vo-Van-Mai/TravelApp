import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UtilsComponent from "../Header/UtilsComponent";
import MyStyle from "../../styles/MyStyle";
import Header from "../Header/Header";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import { MyProviderContext, MyProviderDispatchContext, MyUserContext } from "../../configs/Context";
import { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ManagementProvider = () => {
    const user = useContext(MyUserContext);
    const utils = [{
        "key": "1",
        'title': "Thông tin công ty",
        'icon': "bank",
        'navigate': 'ProfileProvider'
    },{
        "key": "2",
        'title': "Tạo tour",
        'icon': "layers-plus",
        'navigate': 'AddTour'
    },{
        "key": "3",
        'title': "Danh sách tour",
        'icon': "playlist-play",
        'navigate': 'ListTour'
    },{
        "key": "4",
        'title': "Thống kê",
        'icon': "podium",
        // 'navigate': 'ListTour'
    }]

    const nav = useNavigation();

    const providerDispatch = useContext(MyProviderDispatchContext);

    const getProvider = async () => {
        try{
            if(user?.is_provider){
                let url = endpoints['detailProvider'](user.id)
                console.log("url", url);
                res = await authAPI(await AsyncStorage.getItem("token")).get(url);
                providerDispatch({
                    "type": "set_provider",
                    "payload": res.data
                });
            }
        } catch (error) {
            if(error.response.status === 404){
                console.log(error.response.status)
                providerDispatch({
                    "type": "set_provider",
                    "payload": null
                });
            }
        }
    } 

    useEffect(() => {
        getProvider();
    }, []);

    if(!user.is_provider){
        return(
            <View style={MyStyle.container}>
                <Header title={"Dịch vụ tiện ích"} />
                <View style={{width: "90%", height: 50, backgroundColor: "lightblue", justifyContent: "center", alignSelf: "center", marginTop: 10, borderRadius: 10}}>
                    <Text style={{textAlign: "center", color: "darkblue", justifyContent: "center", fontSize: 20}}>Đang chờ xác thực từ quản trị viên!</Text>
                </View>
                <TouchableOpacity onPress={() => nav.goBack()} style={{width: "30%", height: 50, backgroundColor: "lightgray", justifyContent: "center", alignSelf: "center", margin: 20}}>
                    <Text style={{textAlign: "center", color: "#000000", justifyContent: "center", fontSize: 20}}>Quay lại</Text>
                </TouchableOpacity>
            </View>

        );
    }

    return (
        <View style={[MyStyle.container, {alignContent: "center"}]}>
            <Header title={"Dịch vụ tiện ích"} />
            <FlatList
                style={{backgroundColor: "#ffd3d3ff", width: "96%", borderRadius: 20, alignSelf: "center", padding: 15}}
                data={utils}
                renderItem={({item}) => <TouchableOpacity onPress={() => nav.navigate(item.navigate) } style={styles.item} key={item.key}>
                    <UtilsComponent title={item.title} icon={item.icon}/>
                </TouchableOpacity>}
                numColumns={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        width: "47%", 
        display:"flex", 
        flexDirection:"row", 
        justifyContent: "center", 
        // borderColor: "red",
        // borderWidth: 1,
        marginHorizontal: 5,
        marginVertical: 5,
    }
});

export default ManagementProvider;