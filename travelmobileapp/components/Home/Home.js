import { FlatList, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { SafeAreaView } from "react-native";
import { ActivityIndicator, Chip, Searchbar } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import PlaceCard from "../Place/PlaceCard";
import Style from "./Style";
import DatetimePiker from "../Header/DatetimePicker";

const Home = ({ navigation }) => {
    const [place, setPlace] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [cateId, setCateId] = useState(null);
    const [q, setQ] = useState();
    const [refreshing, setRefreshing] = useState(false);
    // console.log("Navigation: ", navigation);

    const loadCate = async () => {
        let res = await Apis.get(endpoints['categories']);
        setCategories(res.data);
        // console.log(res.data);
    }

    const loadPlaces = async () => {
        if (page <= 0) return;
        try {
            setRefreshing(true)
            setLoading(true);
            let url = endpoints['places'] + `?page=${page}`;
            if (q) url += `&name=${q}`;
            if (cateId) url += `&cate=${cateId}`;

            console.log("URL: ", url);

            let resPlaces = await Apis.get(url);

            if (page === 1) {
                setPlace(resPlaces.data.results);
            } else {
                setPlace(prevPlaces => [
                    ...prevPlaces,
                    ...resPlaces.data.results.filter(
                        np => !prevPlaces.some(p => p.id === np.id)
                    ),
                ]);
            }

            // Nếu không còn trang tiếp theo
            if (!resPlaces.data.next) {
                setPage(0);
            }

        } catch (error) {
            // Nếu lỗi 404 thì dừng tải thêm
            if (error.response.status === 404) {
                setPage(0);
            }
            // console.error("Lỗi khi load places:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const loadMorePlaces = () => {
        if (!loading && page > 0) {
            console.log("loadmore");
            setPage(prev => prev + 1);
        }
    };



    useEffect(() => {
        loadCate();
        loadPlaces();
    }, []);


    useEffect(() => {
        let timer = setTimeout(() => {
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [q, cateId]);


    useEffect(() => {
        if (page > 0 && !loading)
            loadPlaces();
    }, [page]);

    if (place.length === 0) {
        return (
            <View style={MyStyle.container}>
                
                <View>
                    <Searchbar
                        placeholder="Nhập tên địa điểm..."
                        value={q}
                        onChangeText={setQ}
                        style={{ margin: 10, backgroundColor: "#ffffff" }}
                    />

                    {/* Khu vực category */}

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: "space-around", marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => setCateId(null)}>
                            <Chip style={MyStyle.backgroundColor} textStyle={MyStyle.textColor} > Tất cả</Chip>
                        </TouchableOpacity>
                        {
                            categories.map(c => <TouchableOpacity key={c.id} onPress={() => setCateId(c.id)}>
                                <Chip style={MyStyle.backgroundColor} textStyle={MyStyle.textColor} >{c.name}</Chip>
                            </TouchableOpacity>)
                        }
                    </View>
                </View>

                <View style={[MyStyle.mainHeaderHome]}>
                                <ImageBackground
                                    source={require('../../assets/headerCover.png')}
                                    style={{ width: '100%', height: 200 }}
                                    resizeMode="stretch"
                                    imageStyle={{ borderTopRightRadius: 50, borderTopLeftRadius: 50, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
                                >
                                    <Text style={MyStyle.mainTitle}>Welcome to the Travel app</Text>
                                </ImageBackground>
                            </View>

                <View style={Style.alertContainer}>
                    <View style={Style.alertInfo}>
                        <Text style={Style.alertText}>Không có địa điểm nào phù hợp!</Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={MyStyle.container}>
            <View>
                <Searchbar
                    placeholder="Nhập tên địa điểm..."
                    value={q}
                    onChangeText={setQ}
                    style={{ margin: 10, backgroundColor: "#ffffff" }}
                />

                {/* Khu vực category */}

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: "space-around", marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => setCateId(null)}>
                        <Chip style={MyStyle.backgroundColor} textStyle={MyStyle.textColor} > Tất cả</Chip>
                    </TouchableOpacity>
                    {
                        categories.map(c => <TouchableOpacity key={c.id} onPress={() => setCateId(c.id)}>
                            <Chip style={MyStyle.backgroundColor} textStyle={MyStyle.textColor} >{c.name}</Chip>
                        </TouchableOpacity>)
                    }
                </View>
            </View>
            <FlatList
                style={{ width: "100%" }}
                data={place}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <PlaceCard place={item} navigation={navigation} />}
                onEndReached={loadMorePlaces}
                onEndReachedThreshold={0.7}
                showsVerticalScrollIndicator={false}
                onRefresh={() => setPage(1)}
                refreshing={refreshing}
                ListFooterComponent={

                    loading && <ActivityIndicator size="30" />
                }
                horizontal={false}
                // flexWrap="wrap"
                // numColumns={2}
                ListHeaderComponent={() => (
                    <>
                        {/* Khu vực header */}
                        <View >
                            <View style={[MyStyle.mainHeaderHome]}>
                                <ImageBackground
                                    source={require('../../assets/headerCover.png')}
                                    style={{ width: '100%', height: 200 }}
                                    resizeMode="stretch"
                                    imageStyle={{ borderTopRightRadius: 50, borderTopLeftRadius: 50, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
                                >
                                    <Text style={MyStyle.mainTitle}>Chào mừng đến với TravelApp</Text>
                                </ImageBackground>
                            </View>



                            {/* Khu vực ảnh ngang */}

                            {/* <Text>
                                Danh sách địa điểm nổi bật:
                            </Text>

                            <FlatList
                                data={place}
                                keyExtractor={(item) => item.id.toString() + "header"}
                                renderItem={({ item }) => <PlaceCard width={"200"} place={item} navigation={navigation} />}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}

                            /> */}
                        </View>
                    </>
                )}

            />
        </SafeAreaView>

    );
}


export default Home;