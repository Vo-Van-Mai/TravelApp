import { useEffect, useState } from "react";
import { Alert, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Button, Card, Text, List, Chip, ActivityIndicator, IconButton, Portal, Modal, PaperProvider } from 'react-native-paper';
import { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStyle from "../../styles/MyStyle";
import { ceil, flatMap } from "lodash";


const ListProvider = () => {
    const [listUser, setListUser] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(null);
    const [statusChoice, setStatusChoice] = useState(null);
    const [selectedUser, setSeletedUser] = useState(null);
    const [token, setToken] = useState(null);

    const [visible, setVisible] = useState(false);

    const showModal = (item) => {
        setVisible(true);
        setSeletedUser(item);
    }
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20, width: "95%", margin: 5, borderRadius: 30 };

    const loadListProvider = async () => {
        if (page <= 0) return;
        try {
            setLoading(true);
            let url = "";
            if (role.id) {
                url = endpoints['users'] + `?page=${page}&role=${role.id}`;
                console.log("url: ", url);
            }

            if (statusChoice) {
                url = `${url}&provider=${statusChoice}`;
                console.log("Url have status", url);
            }

            resData = await authAPI(token).get(url);
            console.log("list User", resData.data.count);
            if (page === 1) {
                setListUser(resData.data.results);
            }
            else {
                setListUser(prev => [...prev, ...resData.data.results.filter(nUser => !prev.some(p => p.id === nUser.id))]);
            }

            if (resData.data.next === null) {
                setPage(0);
            }

        } catch (error) {
            if (error.response.status === 404) {
                setPage(0);
            }
        } finally {
            setLoading(false);
        }
    }

    const getProviderRole = async () => {
        setToken(await AsyncStorage.getItem("token"));
        res = await authAPI(await AsyncStorage.getItem("token")).get(endpoints['role']);
        for (let i of res.data) {
            if (i.name === "provider") {
                setRole(i);
                console.log("đây là role", i.name)
            }
        }
    }

    const handleVerified = async (userId) => {
        try {
            console.log("da vao ham");
            setLoading(true);
            console.log("token", token);
            await authAPI(token).patch(endpoints['verified'](userId));
            setListUser(prev => prev.filter(user => user.id !== userId));
        } catch {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = async (userId) => {
        Alert.alert("Cảnh bảo", "Bạn có chắc muốn hủy quyền người dùng này?", [
            {
                text: "Hủy",
                style: "cancel"
            }, {
                text: "Xác nhận",
                onPress: async () => {
                    try {
                        console.log("da vao ham");
                        setLoading(true);
                        await authAPI(token).patch(endpoints['cancel'](userId));
                        setListUser(prev => prev.filter(user => user.id !== userId));
                    } catch {
                        console.error(error);
                    } finally {
                        setLoading(false);
                    }
                }
            }
        ])

    }

    useEffect(() => {
        console.log("Load1")
        getProviderRole();
    }, []);


    useEffect(() => {
        setPage(1);
        setListUser([]);
    }, [statusChoice]);


    useEffect(() => {
        if (role)
            loadListProvider();
    }, [page, role]);



    const loadMore = () => {
        if (!loading && page > 0) {
            setPage(page + 1);
        }
    }

    return (
        <PaperProvider>

            <SafeAreaView style={MyStyle.container}>
                <View style={styles.displayCate}>
                    <Chip style={styles.subCateItem} onPress={() => {
                        setStatusChoice(null);
                        console.log("statuschoice", statusChoice);
                    }} > Tất cả</Chip>
                    <Chip style={styles.subCateItem} onPress={() => setStatusChoice("True")} > Đã xác thực</Chip>
                    <Chip style={styles.subCateItem} onPress={() => setStatusChoice("False")} > Chưa xác thực</Chip>
                </View>
                <FlatList
                    data={listUser}
                    renderItem={({ item }) => <List.Item
                        style={styles.userCard}
                        title={item.username}
                        description={item.first_name + item.last_name}
                        left={() => <Image source={item?.avatar ? { uri: item?.avatar } : require('../../assets/defaultAvatarAdmin.jpg')} style={styles.avatar}></Image>}
                        right={() => <>
                            <View style={{ display: "flex" }}>
                                <Button onPress={() => showModal(item)} mode="elevated" style={styles.btn}>Chi tiết</Button>
                                {statusChoice === "False" && <Button loading={loading} disabled={loading} onPress={() => { handleVerified(item.id) }} mode="elevated" style={[styles.btn, { backgroundColor: "lightgreen" }]}>Xác thực</Button>}
                                {statusChoice === "True" && <Button loading={loading} disabled={loading} textColor="white" onPress={() => handleCancel(item.id)} mode="elevated" style={[styles.btn, { backgroundColor: "red" }]}>Hủy quyền</Button>}
                            </View>
                        </>}
                    />
                    }
                    onEndReached={loadMore}
                    ListHeaderComponent={loading && <ActivityIndicator size={26} />}
                />

                <Portal>
                    <Modal visible={visible} onDismiss={hideModal}
                        contentContainerStyle={containerStyle}
                    >
                        <View style={{ width: "100%" }}>
                            <Image source={selectedUser?.avatar ? { uri: selectedUser?.avatar } : require('../../assets/defaultAvatarAdmin.jpg')} style={styles.avatarModal} />
                            <Text>Username: {selectedUser?.username}</Text>
                            <Text>Họ và tên: {selectedUser?.last_name + selectedUser?.first_name || "Không có"}</Text>
                            <Text>Email: {selectedUser?.email || "Không có"}</Text>
                            <Text>Số điện thoại: {selectedUser?.phone || "Không có"}</Text>
                            <Text>Ngày tham gia: {selectedUser?.date_joined || "Không rõ"}</Text>
                            <Text>Trạng thái: {selectedUser?.is_active ? "Đang hoạt động" : " Đã khóa"}</Text>
                            <Text> Xác thực: {selectedUser?.is_provider ? "Đã xác thực" : "Chưa xác thực"}</Text>
                        </View>
                        <View>
                            <Button mode="contained" style={{ marginTop: 10 }} onPress={() => setVisible(false)}>Đóng</Button>


                        </View>
                    </Modal>
                </Portal>
            </SafeAreaView>
        </PaperProvider>

    );
}

const styles = StyleSheet.create({
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 20
    },
    userCard: {
        borderWidth: 1,
        borderColor: "white",
        margin: 3,
        padding: 5,
    },
    displayCate: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    subCateItem: {
        margin: 5,
        padding: 5,
    },
    avatarModal: {
        width: "65%",
        height: 200,
        borderRadius: 30,
        alignSelf: "center",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#000000"
    },
    btn: {
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        margin: 5
    }
});

export default ListProvider;