import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import TourCard from "./TourCard";
import { useContext, useEffect, useState } from "react";
import { MyTourContext, MyTourDispatchContext, MyUserContext } from "../../configs/Context";
import { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../Header/Header";
import MyStyle from "../../styles/MyStyle";
import { Chip, PaperProvider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import LoadingItem from "../Header/LoadingItem";
import { set } from "lodash";

const ListTour = () => {
    const [loading, setLoading] = useState(false);
    // const tour = useContext(MyTourContext);
    // const tourDispatch = useContext(MyTourDispatchContext);
    const [tour, setTour] = useState([]);
    const user = useContext(MyUserContext);
    const [page, setPage] = useState(1);
    const [statusChoice, setStatusChoice] = useState(null);
    const [hasMore, setHasMore] = useState(false);
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
            if (page === 1) {
                setTour(resTour.data.results);
            }
            else {
                setTour(prev => [
                    ...prev,
                    ...resTour.data.results.filter(tour => !prev.some(t => t.id === tour.id))
                ]);
                setHasMore(false);
            }

        } catch (error) {
            if (error.response.status === 404) {
                setPage(0);
                console.log(error);
                setHasMore(false);

            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!loading && page > 0) {
            loadTour();
        }
    }, [page]);

    useEffect(() => {
        setPage(1);
        setTour([]);
    }, [statusChoice]);
 
    if (loading && !hasMore) {
        return (
            <LoadingItem />
        );
    }

    const loadMore = () => {
        if (!loading && page > 0) {
            console.log("loadmore")
            setPage(page + 1);
            setHasMore(true);
        }
    }

    return (
        <View style={[MyStyle.container, { paddingTop: 10 }]}>

            <FlatList
                data={tour}
                renderItem={({ item }) => <TourCard tour={item} />}
                keyExtractor={(item) => item.id.toString()} 
                onEndReached={loadMore}
                // onEndReachedThreshold={0.8}
                ListEmptyComponent={
                    !loading && <View style={MyStyle.container}>
                        <Header title={"Chưa có tour nào!"} />
                    </View>
                }
                ListHeaderComponent={
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        {status.map(s => (
                            <TouchableOpacity
                                onPress={() => setStatusChoice(s.value)}
                                style={{ margin: 4 }}
                                key={s.label}
                            >
                                <Chip>{s.label}</Chip>
                            </TouchableOpacity>
                        ))}
                    </View>
                }
            />

        </View>
    );
}

export default ListTour;


