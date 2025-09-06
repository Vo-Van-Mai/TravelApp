import { useContext, useEffect, useState } from "react";
import Header from "../Header/Header";
import { MyTourContext, MyUserContext } from "../../configs/Context";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Apis, { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStyle from "../../styles/MyStyle";
import { Button, Card, Icon, List } from "react-native-paper";
import { formatDate } from "../Comment/Comment";
import FormatCurrency from "../../utils/FormatCurrency";
import AlertItem from "../Header/AlertItem";
import { useNavigation } from "@react-navigation/native";

const DetailTour = ({ route }) => {
    const user = useContext(MyUserContext);
    const listTour = useContext(MyTourContext);
    const tourId = route?.params?.tourId;
    const [loading, setLoading] = useState(false);
    const [tour, setTour] = useState({});
    const nav = useNavigation();

    const getDetailTour = async () => {
        try {
            setLoading(true);
            const resDetaiTour = await Apis.get(endpoints['detailTour'](tourId));
            console.log("resTourDetail", resDetaiTour.data);
            setTour(resDetaiTour.data);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    const publicTour = async () => {
        try {
            setLoading(true);
            console.log("press");
            const res = await authAPI(await AsyncStorage.getItem("token")).post(endpoints["publicTour"](tourId));
            console.log("res", res.status)
            if (res.status === 200) {

                Alert.alert("Thông báo", "Đã đăng tin thành công!", [
                    {
                        text: "Đồng ý",
                        onPress: () => nav.goBack()
                    }
                ])
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const rejectTour = async () => {
        try {
            setLoading(true);
            console.log("press");
            const url = endpoints["detailTour"](tourId) + "reject-tour/";
            res = await authAPI(await AsyncStorage.getItem("token")).post(url);
            console.log("res", res.status)
            if (res.status === 200) {

                Alert.alert("Thông báo", "Đã hủy tin thành công!", [
                    {
                        text: "Đồng ý",
                        onPress: () => nav.goBack()
                    }
                ])
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getDetailTour();
    }, []);

    const renderFooterComponent = () => {
        if (user && user.role === "provider") {
            if (user?.id !== tour?.provider?.id) {
                return
            }
            else {
                switch (tour.status) {
                    case "draft":
                        return (
                            <View style={styles.footer}>
                                <Button 
                                    style={[styles.btnFooter, styles.btnSecondary]} 
                                    mode="contained" 
                                    buttonColor="#FFD700" 
                                    textColor="#000000" 
                                    onPress={() => nav.navigate("AddTourPlace", {tourId: tourId})}
                                >
                                    Thêm địa điểm
                                </Button>
                                <Button 
                                    style={[styles.btnFooter, styles.btnPrimary]} 
                                    mode="contained" 
                                    loading={loading} 
                                    disabled={loading} 
                                    buttonColor="#4CAF50" 
                                    textColor="#ffffff" 
                                    onPress={publicTour}
                                >
                                    Đăng tin
                                </Button>
                            </View>
                        );
                    case "rejected":
                        return (
                            <View style={styles.footer}>
                                <Button 
                                    style={[styles.btnFooter, styles.btnPrimary, { width: "100%" }]} 
                                    mode="contained" 
                                    loading={loading} 
                                    disabled={loading} 
                                    buttonColor="#4CAF50" 
                                    onPress={publicTour}
                                >
                                    Đăng lại
                                </Button>
                            </View>
                        );
                    default:
                        return (
                            <View style={styles.footer}>
                                <Button 
                                    style={[styles.btnFooter, styles.btnSecondary]} 
                                    mode="contained" 
                                    textColor="#000000"
                                >
                                    Cập nhật
                                </Button>
                                <Button 
                                    style={[styles.btnFooter, styles.btnDanger]} 
                                    mode="contained" 
                                    loading={loading} 
                                    disabled={loading} 
                                    buttonColor="#F44336" 
                                    onPress={rejectTour}
                                >
                                    Xóa
                                </Button>
                            </View>
                        );
                }
            }
        }

        if (user && user.role === "traveler") {
            return (
                <View style={styles.footer}>
                    <Button 
                        style={[styles.btnFooter, styles.btnSecondary]} 
                        mode="contained" 
                        textColor="#000000"
                    >
                        Liên hệ
                    </Button>
                    <Button 
                        style={[styles.btnFooter, styles.btnPrimary]} 
                        mode="contained" 
                        buttonColor="#4CAF50" 
                        textColor="#ffffff"
                    >
                        Đặt tour
                    </Button>
                </View>
            );
        }
        if (!user) {
        return (
            <View style={styles.loginContainer}>
                <AlertItem title={"Vui lòng đăng nhập để đặt tour!"} />
                <Button 
                    onPress={() => nav.navigate("login", { "params": { "screen": "authLogin" } })} 
                    mode="contained" 
                    buttonColor="#4CAF50" 
                    textColor="#ffffff" 
                    style={styles.loginButton}
                > 
                    Đăng nhập
                </Button>
            </View>
        );
    }
    }

    return (
        <View style={MyStyle.container}>
            <Header title={"Thông tin chuyến đi"} />
            <FlatList
                data={tour?.tourplaces}
                renderItem={({ item }) =>
                    <View style={styles.itemContainer}>
                        <View style={styles.placeItem}>
                            <View style={styles.orderContainer}>
                                <Text style={styles.orderText}>{item.order}</Text>
                            </View>
                            <List.Item
                                title={item.place?.name}
                                titleStyle={styles.placeTitle}
                                description={item.place?.full_address}
                                descriptionStyle={styles.placeDescription}
                                left={() => (
                                    <TouchableOpacity style={styles.imageContainer}>
                                        <Image 
                                            source={{ uri: item?.place?.images[0]?.url_path }} 
                                            style={styles.placeImage} 
                                        />
                                    </TouchableOpacity>
                                )}
                                style={styles.listItem}
                            />
                        </View>

                        {user && user.role === "provider" && user.id === tour?.provider?.id && tour.status!=="published" && (
                            <TouchableOpacity style={styles.btnDelete}>
                                <Icon source="delete-circle-outline" size={24} color="#F44336" />
                                <Text style={styles.deleteText}> Xóa địa điểm</Text>
                            </TouchableOpacity>
                            
                        )}
                    </View>
                }
                keyExtractor={(item) => item.place.id.toString()}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                       <AlertItem title="Chưa có danh sách địa điểm!" />
                       {user && user.role=="provider" && tour?.provider?.id===user.id && (
                           <Button 
                               onPress={() => nav.navigate("AddTourPlace", {tourId: tourId})} 
                               style={styles.addPlaceButton} 
                               mode="contained" 
                               buttonColor="#4CAF50" 
                               textColor="#ffffff"
                           > 
                               Thêm địa điểm
                           </Button>
                       )}
                    </View>
                }
                ListHeaderComponent={
                <View style={styles.headerContainer}>
                    <Card style={styles.tourCard}>
                        <Card.Content style={styles.cardContent}>
                            <Text style={styles.tourTitle}> {tour.title}</Text>
                            <Text style={styles.tourDescription}>Mô tả: {tour.description}</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Ngày tạo:</Text>
                                <Text style={styles.infoValue}>{formatDate(tour.created_date)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Trạng thái:</Text>
                                <Text style={[styles.infoValue, styles.statusText]}>{tour.status}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Giá:</Text>
                                <Text style={[styles.infoValue, styles.priceText]}>{FormatCurrency(tour.price)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Giảm giá:</Text>
                                <Text style={styles.infoValue}>{tour.discount}%</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Số lượng hành khách tối đa:</Text>
                                <Text style={styles.infoValue}>{tour.capacity}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Thời gian:</Text>
                                <Text style={styles.infoValue}>{tour.duration_display}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Ngày bắt đầu:</Text>
                                <Text style={styles.infoValue}>{tour.start_date}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Ngày kết thúc:</Text>
                                <Text style={styles.infoValue}>{tour.end_date}</Text>
                            </View>
                        </Card.Content>
                    </Card>
                    
                    <View style={styles.providerContainer}> 
                        <List.Item
                            title={tour?.provider?.name}
                            titleStyle={styles.providerTitle}
                            description="Thông tin công ty"
                            descriptionStyle={styles.providerDescription}
                            left={() => (
                                <TouchableOpacity style={styles.providerAvatarContainer}>
                                    <Image 
                                        source={{ uri: tour?.provider?.avatar }} 
                                        style={styles.providerAvatar} 
                                    />
                                </TouchableOpacity>
                            )}
                            style={styles.providerListItem}
                        />
                    </View>

                    {tour?.tourplaces?.length > 0 &&
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, paddingLeft: 4 }}>
                        Danh sách địa điểm:
                    </Text>
                    }
                </View>    
                }
                ListFooterComponent={renderFooterComponent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 20,
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    tourCard: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardContent: {
        padding: 20,
    },
    tourTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: "center"
    },
    tourDescription: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
        lineHeight: 22,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
    },
    statusText: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    priceText: {
        color: '#FF6B35',
        fontWeight: 'bold',
        fontSize: 16,
    },
    providerContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    providerListItem: {
        backgroundColor: 'transparent',
    },
    providerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    providerDescription: {
        fontSize: 14,
        color: '#666',
    },
    providerAvatarContainer: {
        marginRight: 16,
    },
    providerAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    itemContainer: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        // marginVertical: 8,
        marginBottom: 8,
        padding: 16,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        
    },
    placeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    orderContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    orderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    listItem: {
        backgroundColor: 'transparent',
        width: "90%"
    },
    placeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    placeDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
    },
    imageContainer: {
        marginRight: 5,
    },
    placeImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#f0f0f0',
    },
    btnDelete: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff5f5',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#ffebee',
    },
    deleteText: {
        color: '#F44336',
        fontSize: 14,
        fontWeight: '500',
    },
    emptyContainer: {
        paddingHorizontal: 16,
        paddingVertical: 32,
        alignItems: 'center',
    },
    addPlaceButton: {
        marginTop: 16,
        borderRadius: 25,
        paddingHorizontal: 24,
    },
    loginContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        alignItems: 'center',
    },
    loginButton: {
        marginTop: 16,
        borderRadius: 25,
        paddingHorizontal: 32,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 16,
        marginTop: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    btnFooter: {
        borderRadius: 25,
        paddingVertical: 8,
        width: '48%',
    },
    btnPrimary: {
        backgroundColor: '#4CAF50',
    },
    btnSecondary: {
        backgroundColor: '#FFD700',
    },
    btnDanger: {
        backgroundColor: '#F44336',
    },
});
export default DetailTour;