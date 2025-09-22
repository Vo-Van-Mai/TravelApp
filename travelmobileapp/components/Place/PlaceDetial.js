import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Dimensions, Alert, FlatList, useWindowDimensions, Platform, Linking } from "react-native";
import { Card, Modal, Portal, Button, PaperProvider, Divider, List, Chip } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import Comment from "../Comment/Comment";
import Rating from "./Rating";
import LoadingItem from "../Header/LoadingItem";
import MyStyle from "../../styles/MyStyle";
import MapItem from "../Header/MapItem";
import RenderHTML from "react-native-render-html";
import AlertItem from "../Header/AlertItem";
import { useNavigation } from "@react-navigation/native";

const PlaceDetail = ({ route, navigation }) => {
    const placeId = route.params.placeId;
    // const windowWidth = Dimensions.get('window').width;
    // const windowHeight = Dimensions.get('window').height;
    const { width } = useWindowDimensions();

    const [placeDetail, setPlaceDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [placeNear, setPlaceNear] = useState([]);
    const nav = useNavigation();

    const loadDetail = async () => {
        try {
            let resPlaceData = await Apis.get(endpoints['placeDetail'](placeId));
            setPlaceDetail(resPlaceData.data);
            setLoading(false);
        } catch (error) {
            console.error("Error loading place detail: ", error);
            Alert.alert("Lỗi", "Không thể tải thông tin địa điểm");
        } finally {
            setLoading(false);
        }
    };

    const loadPlaceNearBy = async () => {
        try {
            let url = endpoints["placeDetail"](placeId) + "nearby/";
            console.log("url near", url)
            const res = await Apis.get(url);
            console.log("PlaceNear: ", placeNear);
            setPlaceNear(res.data);
        } catch (error) {
            console.log(error);
            setPlaceNear([]);
        }
    }

    useEffect(() => {
        loadDetail();
        loadPlaceNearBy();
    }, [placeId]);

    const handleImagePress = (image) => {
        setSelectedImage(image);
        setImageModalVisible(true);
    };

    const handleCommentAdded = () => {
        console.log("Tạo comment thành công");
    };

    const handleRatingChanged = () => {
        console.log("Đánh giá thành công!");
    };

    const openMap = (lat, lng, label = "Vị trí") => {
        let url = "";

        if (Platform.OS === "ios") {
            // iOS mở Apple Maps
            url = `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`;
        } else {
            // Android mở Google Maps
            url = `geo:${lat},${lng}?q=${lat},${lng}(${label})`;
        }

            Linking.openURL(url).catch(() => {
                Alert.alert("Lỗi", "Không thể mở bản đồ");
            });
        };

    if (loading) {
        return (
            <LoadingItem />
        );
    }

    if (!placeDetail) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error" size={64} color="red" />
                <Text style={styles.error}>Không tìm thấy địa điểm</Text>
            </View>
        );
    }

    return (
        <PaperProvider>
            <FlatList style={MyStyle.container}
            
                ListHeaderComponent={
                    <View>
                        {/* Main Place Card */}
                        <Card style={styles.card}>
                            <Card.Cover
                                source={
                                    placeDetail.images?.[0]?.url_path
                                        ? { uri: placeDetail.images[0].url_path }
                                        : require('../../assets/headerCover.png')
                                }
                                style={styles.image}
                            />
                            <Card.Title
                                title={placeDetail.name}
                                titleStyle={styles.name}
                                subtitle={placeDetail.category?.name}
                                subtitleStyle={styles.category}
                            />
                            <Card.Content>
                                <Text style={styles.label}>Mô tả:</Text>
                                {/* <Text style={styles.text}>{placeDetail.description}</Text> */}
                                <RenderHTML source={{html: placeDetail.description}} contentWidth={width} />

                                <View style={styles.infoRow}>
                                    <MaterialIcons name="location-on" size={20} color="#666" />
                                    <Text style={styles.label}>Địa chỉ:</Text>
                                    <Text numberOfLines={1} style={styles.text}>{placeDetail.full_address}</Text>
                                </View>     

                                <View style={styles.infoRow}>
                                    <MaterialIcons name="access-time" size={20} color="#666" />
                                    <Text style={styles.label}>Giờ mở cửa:</Text>
                                    <Text style={styles.text}>{placeDetail.open_hours || "Không rõ"}</Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <MaterialIcons name="access-time-filled" size={20} color="#666" />
                                    <Text style={styles.label}>Giờ đóng cửa:</Text>
                                    <Text style={styles.text}>{placeDetail.close_hours || "Không rõ"}</Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <MaterialIcons name="attach-money" size={20} color="#666" />
                                    <Text style={styles.label}>Giá vé:</Text>
                                    <Text style={styles.text}>
                                        {placeDetail.ticket_price?.toLocaleString()} VNĐ
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <MaterialIcons name="location-city" size={20} color="#666" />
                                    <Text style={styles.label}>Tỉnh / Thành phố:</Text>
                                    <Text style={styles.text}>{placeDetail.province?.name}</Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <MaterialIcons name="home" size={20} color="#666" />
                                    <Text style={styles.label}>Phường / Xã:</Text>
                                    <Text style={styles.text}>{placeDetail.ward?.name}</Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <MaterialIcons name="map" size={20} color="#666" />
                                    <TouchableOpacity style={styles.button} onPress={() => openMap(placeDetail.latitude, placeDetail.longitude, placeDetail.name)}>
                                        <Text style={styles.textButton}>Mở bản đồ</Text>
                                    </TouchableOpacity>
                                </View>

                                
                            </Card.Content>
                        </Card>

                        <Rating
                            placeId={placeId}
                            onRatingChanged={handleRatingChanged}
                        />

                        
                        {placeDetail.images && placeDetail.images.length > 0 && (
                            <View style={styles.galleryContainer}>
                                <Text style={styles.sectionTitle}>Hình ảnh ({placeDetail.images.length})</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {placeDetail.images.map((image, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => handleImagePress(image)}
                                            style={styles.imageContainer}
                                        >
                                            <Image
                                                source={{ uri: image.url_path }}
                                                style={styles.galleryImage}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {placeNear.length > 0 ? <>
                            <Text style={styles.sectionTitle}>5 địa điểm lân cận</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
                                >
                                {placeNear.map(p => (
                                    <Chip 
                                    key={`place${p.id}`} 
                                    onPress={() => nav.navigate("index", { screen: "PlaceDetail", params: { "placeId": p.id }})}
                                    >
                                    {p.name}
                                    </Chip>
                                ))}
                                </ScrollView>
                        </>:<>
                        <AlertItem  title={"Không có địa điểm nào gần đây"} />
                        </>}


                    </View>
                }
                ListFooterComponent={
                    <Comment
                        placeId={placeId}
                        onCommentAdded={handleCommentAdded}
                    />
                }
            />
            {/* Image Modal */}
            <Portal>
                <Modal
                    visible={imageModalVisible}
                    onDismiss={() => setImageModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    {selectedImage && (
                        <View style={styles.modalContent}>
                            <Image
                                source={{ uri: selectedImage.url_path }}
                                style={styles.modalImage}
                                resizeMode="contain"
                            />
                            <Button
                                mode="contained"
                                onPress={() => setImageModalVisible(false)}
                                style={styles.closeButton}
                            >
                                Đóng
                            </Button>
                        </View>
                    )}
                </Modal>
            </Portal>
        </PaperProvider>
    );
};

export const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "#fff",
        paddingBottom: 50
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    card: {
        borderRadius: 10,
        elevation: 3,
        marginBottom: 20,
    },
    image: {
        height: 200,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },
    category: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    label: {
        fontWeight: "600",
        marginLeft: 5,
        marginRight: 5,
    },
    text: {
        fontSize: 16,
        color: "#333",
        flex: 1,
    },
    error: {
        marginTop: 20,
        textAlign: "center",
        color: "red",
        fontSize: 18,
    },
    galleryContainer: {
        marginBottom: 20,
        marginLeft: 10
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
    },
    imageContainer: {
        marginRight: 10,
    },
    galleryImage: {
        width: 200,
        height: 150,
        borderRadius: 10,
    },
    modalContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        alignItems: "center",
    },
    modalImage: {
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.7,
        borderRadius: 10,
    },
    closeButton: {
        marginTop: 20,
    },
    button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2ecc71",   // xanh lá nổi bật
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
    marginLeft: 10
  },
  textButton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PlaceDetail;

