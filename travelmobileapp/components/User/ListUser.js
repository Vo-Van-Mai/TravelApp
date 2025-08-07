import { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Button, Card, Text, List, Chip, ActivityIndicator, IconButton, Portal, Modal, PaperProvider } from 'react-native-paper';
import { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStyle from "../../styles/MyStyle";
import { ceil, flatMap } from "lodash";

// const renderUserItem = () => {
//     return (

//     );
// }


const ListUser = () => {
    const [listUser, setListUser] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(null);
    const [roleChoice, setRoleChoice] = useState(null);
    const [selectedUser, setSeletedUser] = useState(null);

    const [visible, setVisible] = useState(false);

    const showModal = (item) => {
        setVisible(true);
        setSeletedUser(item);
    }
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20, width: "95%", margin: 5, borderRadius: 30 };

    const loadListUser = async () => {
        if (page <= 0) return;
        try {
            setLoading(true);
            let url = endpoints['users'] + `?page=${page}`;
            if (roleChoice) {
                url = `${url}&role=${roleChoice}`
            }
            console.log("url: ", url)
            resData = await authAPI(await AsyncStorage.getItem("token")).get(url);
            console.log("list User", resData.data.results);
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

    useEffect(() => {
        setPage(1);
    }, [roleChoice]);

    useEffect(() => {
        loadRole();
        loadListUser();
    }, [page]);

    const loadRole = async () => {
        res = await authAPI(await AsyncStorage.getItem("token")).get(endpoints['role']);
        setRole(res.data);
        console.log("role", res.data);
    }

    const loadMore = () => {
        if (!loading && page > 0) {
            setPage(page + 1);
        }
    }

    return (
        <PaperProvider>

            <SafeAreaView style={MyStyle.container}>
                <View horizontal style={styles.displayCate}>
                    <Chip style={styles.subCateItem} onPress={() => setRoleChoice(null)} > Tất cả</Chip>

                    {role?.map((item, index) =>
                        <Chip onPress={() => {
                            setRoleChoice(item.id);
                            console.log("press", item.id);
                        }} key={index} style={styles.subCateItem}>{item?.name} </Chip>
                    )}
                </View>
                <FlatList
                    data={listUser}
                    renderItem={({ item }) => <List.Item
                        style={styles.userCard}
                        title={item.username}
                        description={item.first_name + item.last_name}
                        left={() => <Image source={item?.avatar ? { uri: item?.avatar } : require('../../assets/defaultAvatarAdmin.jpg')} style={styles.avatar}></Image>}
                        right={() => <Button onPress={() => showModal(item)} mode="elevated" style={{ height: 50, alignItems: "center", justifyContent: "center" }}>Chi tiết</Button>}
                    />
                    }
                    onEndReached={loadMore}
                    ListHeaderComponent={loading && <ActivityIndicator size={26} />}
                />

                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                        <View style={{ width: "100%" }}>
                            <Image source={selectedUser?.avatar ? { uri: selectedUser?.avatar } : require('../../assets/defaultAvatarAdmin.jpg')} style={styles.avatarModal} />
                            <Text>Username: {selectedUser?.username}</Text>
                            <Text>Họ và tên: {selectedUser?.last_name + selectedUser?.first_name || "Không có"}</Text>
                            <Text>Email: {selectedUser?.email || "Không có"}</Text>
                            <Text>Số điện thoại: {selectedUser?.phone || "Không có"}</Text>
                            <Text>Ngày tham gia: {selectedUser?.date_joined || "Không rõ"}</Text>
                            <Text>Trạng thái: {selectedUser?.is_active ? "Đang hoạt động" : " Đã khóa"}</Text>

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
        width: 100
    },
    avatarModal: {
        width: "65%",
        height: 200,
        borderRadius: 30,
        alignSelf: "center",
        marginBottom: 10
    }
});

export default ListUser;