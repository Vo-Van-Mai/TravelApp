import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Dimensions } from "react-native";
import { Card, Modal, Portal, Button, PaperProvider } from "react-native-paper";


const PlaceDetail = ({ route }) => {
    placeId = route.params.placeId;
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height; 

    const [placeDetail, setPlaceDetail] = useState({});
    const [loading, setLoading] = useState(true);


    const loadDetail = async () => {
        try {
            let resPlaceData = await Apis.get(endpoints['placeDetail'](placeId));
            setPlaceDetail(resPlaceData.data);
            setLoading(false);
        } catch (error) {
            console.error("Error loading place detail: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDetail();
    }, [placeId]);
    if (!placeDetail) {
        return <Text style={styles.error}>Không tìm thấy địa điểm</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <View>

                <Card style={styles.card}>
                    <Card.Cover source={
                        placeDetail.images?.[0]?.url_path
                            ? { uri: placeDetail.images[0].url_path }
                            : require('../../assets/headerCover.png')
                    } style={styles.image} />
                    <Card.Title title={placeDetail.name} titleStyle={styles.name} />
                    <Card.Content>
                        <Text style={styles.label}>Mô tả:</Text>
                        <Text style={styles.text}>{placeDetail.description}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.label}>Địa chỉ:</Text>
                            <Text style={styles.text}>{placeDetail.address}</Text>

                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.label}>Giờ mở cửa:</Text>
                            <Text style={styles.text}>{placeDetail.open_hours || "Không rõ"}</Text>

                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <Text style={styles.label}>Giờ đóng cửa:</Text>
                            <Text style={styles.text}>{placeDetail.close_hours || "Không rõ"}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.label}>Giá vé:</Text>
                            <Text style={styles.text}>{placeDetail.ticket_price?.toLocaleString()} VNĐ</Text>

                        </View>


                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.label}>Tỉnh / Thành phố:</Text>
                            <Text style={styles.text}>{placeDetail.province?.name}</Text>
                        </View>

                        <Text style={styles.label}>Phường / Xã: {placeDetail.ward?.name}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <Text style={styles.label}>Danh mục:</Text>
                            <Text style={styles.text}>{placeDetail.category?.name}</Text>
                        </View>

                    </Card.Content>
                </Card>
                <View style={{ marginBottom: 20 }}>
                    {loading && <ActivityIndicator size="large" color="#0000ff" />}
                    {!loading && placeDetail.images && placeDetail.images.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {placeDetail.images.map((image, index) => (
                                <View key={index}>

                                    <TouchableOpacity onPress={() => console.log(image.url_path)}>
                                        <Image

                                            source={{ uri: image.url_path }}
                                            style={{ width: 200, height: 150, margin: 5, borderRadius: 10 }}
                                        />
                                    </TouchableOpacity>



                                </View>
                            ))}

                        </ScrollView>
                    )}
                </View>
            </View>

               

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "#fff",
        paddingBottom: 50
    },
    card: {
        borderRadius: 10,
        elevation: 3,
    },
    image: {
        height: 200,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
    label: {
        fontWeight: "600",
        // marginTop: 10,
    },
    text: {
        fontSize: 16,
        color: "#333",
        marginLeft: 5,
    },
    error: {
        marginTop: 50,
        textAlign: "center",
        color: "red",
        fontSize: 18,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    }
});

export default PlaceDetail;

