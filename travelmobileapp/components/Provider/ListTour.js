import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import TourCard from "./TourCard";
import { useContext, useEffect, useState } from "react";
import { MyTourContext, MyTourDispatchContext, MyUserContext } from "../../configs/Context";
import { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../Header/Header";
import MyStyle from "../../styles/MyStyle";
import { Chip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const ListTour = () => {
    const [loading, setLoading] = useState(false);
    // const tour = useContext(MyTourContext);\
    // const tourDispatch = useContext(MyTourDispatchContext);
    const [tour, setTour] = useState([]);
    const user = useContext(MyUserContext);
    const [page, setPage] = useState(1);
    const [statusChoice, setStatusChoice] = useState(null);
    const nav = useNavigation();

    const status = [{
        label: "Tất cả",
        value: null
    }, {
        label: "Đã đăng",
        value: "published"
    }, {
        label: "Nháp",
        value: "draft"
    }, {
        label: "Đã hủy",
        value: "rejected"
    }, {
        label: "Đã hoàn thành",
        value: "completed"
    }, {
        label: "Đang diễn ra",
        value: "running"
    }]


    const loadTour = async () => {
        try {
            setLoading(true);

            let url = endpoints['tour'] + `?page=${page}&provider_id=${user?.id}`;
            console.log('url', url);

            if (statusChoice) {
                url = `${url}&status=${statusChoice}`;
            }

            const resTour = await authAPI(await AsyncStorage.getItem("token")).get(url);
            console.log("resTour", resTour.data.results);
            if (page === 1){
                setTour(...resTour.data.results);
            }
            else {
                setTour(prev => [...prev, resTour.data.results.filter(tour => !prev.some(t => t.id === tour.id))])
            }

        } catch (error) {
            if (error.response.status === 404) {
                setPage(0);
                console.log(error)
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTour();
    }, []);

    useEffect(() => {
        loadTour();
    }, [statusChoice]);

    if (!tour || tour.length === 0) {
        return (
            <View style={MyStyle.container}>
                <View style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
                    {status.map(s => <TouchableOpacity onPress={() => setStatusChoice(s.value)} style={{ margin: 4 }} key={s.label}>
                        <Chip >{s.label}</Chip>
                    </TouchableOpacity>)}
                </View>
                <Header title={"Chưa có tour nào!"} />

            </View>
        );
    }
    return (
        <View style={[MyStyle.container, { paddingTop: 10 }]}>
            <View style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
                {status.map(s => <TouchableOpacity onPress={() => setStatusChoice(s.value)} style={{ margin: 4 }} key={s.label}>
                    <Chip >{s.label}</Chip>
                </TouchableOpacity>)}
            </View>
            {tour.map(t => <TouchableOpacity onPress={() => nav.navigate("DetailTour", {"tourId": t.id})} key={t.id}>
                <TourCard tour={t} />
            </TouchableOpacity>)}
        </View>
    );
}

export default ListTour;