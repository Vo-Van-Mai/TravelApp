import { FlatList, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { SafeAreaView } from "react-native";
import { ActivityIndicator, Chip, Searchbar } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import PlaceCard from "../Place/PlaceCard";
import Style from "./Style";
import DatetimePiker from "../Header/DatetimePicker";
import AlertItem from "../Header/AlertItem";
import LoadingItem from "../Header/LoadingItem";
import { styles } from "../Place/PlaceDetial";
import * as Location from "expo-location";

const Home = ({ navigation }) => {
    const [place, setPlace] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [cateId, setCateId] = useState(null);
    const [q, setQ] = useState();
    const [refreshing, setRefreshing] = useState(false);
    // console.log("Navigation: ", navigation);
    const [placeNear, setPlacenear] = useState([])

    const loadCate = async () => {
        let res = await Apis.get(endpoints['categories']);
        setCategories(res.data);
        // console.log(res.data);
    }

    const loadPlaces = async (isRefresh = false) => {
        if (page <= 0) return;
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

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

            if (!resPlaces.data.next) {
                setPage(0);
            }

        } catch (error) {
            if (error.response?.status === 404) {
                setPage(0);
            }
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


     const loadNearbyPlaces = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Lỗi", "Ứng dụng cần quyền truy cập vị trí!");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        console.log("Vị trí hiện tại:", latitude, longitude);

        let url = `${endpoints["places"]}nearby-current/?lat=${latitude}&lng=${longitude}`;
        let res = await Apis.get(url);
        console.log("res near", res.data)

        setPlacenear(res.data);
      } catch (error) {
        console.log(error);
        Alert.alert("Lỗi", "Không thể tải địa điểm gần đây");
      } finally {
        setLoading(false);
      }
    };


    useEffect(() => {
        loadCate();
        loadPlaces();
        loadNearbyPlaces();
    }, []);


    useEffect(() => {
        let timer = setTimeout(() => {
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [q]);

    useEffect(() => {
        setPage(1);
        loadPlaces(true);
    }, [cateId]);


    useEffect(() => {
        if (page > 0 && !loading)
            loadPlaces();
    }, [page]);

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

                <View style={{ flexWrap: "wrap", flexDirection: "row", marginBottom: 10 }}>
                    <Chip
                        style={cateId === null ? MyStyle.chipActive : MyStyle.chipNormal}
                        textStyle={cateId === null ? MyStyle.chipActiveText : MyStyle.chipNormalText}
                        onPress={() => {setCateId(null);
                        }}
                    >
                        Tất cả
                    </Chip>

                    {categories.map(c => (
                        <Chip
                            key={c.id}
                            style={cateId === c.id ? MyStyle.chipActive : MyStyle.chipNormal}
                            textStyle={cateId === c.id ? MyStyle.chipActiveText : MyStyle.chipNormalText}
                            onPress={() => {setCateId(c.id)
                                console.log("press", c.id);
                            }}
                        >
                            {c.name}
                        </Chip>
                    ))}
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
                onRefresh={() => {
                    setPage(1);
                    loadPlaces(true);
                }}
                refreshing={refreshing}
                ListFooterComponent={

                    loading && <LoadingItem></LoadingItem>
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

                            <Text style={styles.sectionTitle}>Địa điểm gần bạn</Text>
                                {placeNear.length > 0 ? (
                                <FlatList
                                    data={placeNear}
                                    keyExtractor={(item) => `place${item.id}`}
                                    renderItem={({ item }) => (
                                    <PlaceCard width={200} place={item} navigation={navigation} />
                                    )}
                                    horizontal={true}             // <-- hiển thị ngang
                                    showsHorizontalScrollIndicator={false} // ẩn thanh cuộn ngang
                                    contentContainerStyle={{ paddingHorizontal: 10 }}
                                    ItemSeparatorComponent={() => <View style={{ width: 10 }} />} // khoảng cách giữa các item
                                />
                                ) : (
                                <Text>Không tìm thấy địa điểm nào gần bạn!</Text>
                                )}
                            

                        </View>
                    </>
                )}
                ListEmptyComponent={
                    !loading && <AlertItem title="Không có địa điểm nào!" />
                }

            />
        </SafeAreaView>

    );
}


export default Home;