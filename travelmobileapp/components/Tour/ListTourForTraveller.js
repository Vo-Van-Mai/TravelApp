import { FlatList, View, Text } from "react-native";
import { useEffect, useState, useCallback } from "react";
import Header from "../Header/Header";
import MyStyle from "../../styles/MyStyle";
import Apis, { endpoints } from "../../configs/Apis";
import TourCard from "../Provider/TourCard";
import AlertItem from "../Header/AlertItem";
import LoadingItem from "../Header/LoadingItem";

const ListTourForTraveller = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadTours = useCallback(async (reset = false) => {
        if (loading || (!hasMore && !reset)) return;

        try {
            setLoading(true);
            console.log("========= Load tour =========");

            const url = `${endpoints['tour']}?page=${reset ? 1 : page}&status=published`;
            console.log("url", url);

            const res = await Apis.get(url);
            const newTours = res.data.results;

            if (reset) {
                setTours(newTours);
                setPage(1);
                setHasMore(newTours.length > 0);
            } else {
                setTours(prev => [
                    ...prev,
                    ...newTours.filter(tour => !prev.some(p => p.id === tour.id))
                ]);
                setHasMore(newTours.length > 0);
            }

        } catch (error) {
            if (error.response?.status === 404) {
                setHasMore(false);
            } else {
                console.error("API error:", error.message, error.response?.data);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        loadTours();
    }, [page]);

    const onRefresh = () => {
        setRefreshing(true);
        setHasMore(true);
        loadTours(true);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <View style={MyStyle.container}>
            <Header title="Danh sách tour du lịch!" />

            {loading && tours.length === 0 ? (
                <LoadingItem />
            ) : (
                <FlatList
                    data={tours}
                    renderItem={({ item }) => <TourCard tour={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.7}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ListEmptyComponent={
                        !loading && (
                            <View>
                                <AlertItem title="Chưa có tour nào!" />
                            </View>
                        )
                    }
                    ListFooterComponent={
                        loading && tours.length > 0 ? <LoadingItem /> : null
                    }
                />
            )}
        </View>
    );
};

export default ListTourForTraveller;
