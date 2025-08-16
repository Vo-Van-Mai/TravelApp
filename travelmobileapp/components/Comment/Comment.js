import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView } from "react-native";
import { Avatar, Card, Button, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import Apis, { endpoints, authAPI } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./CommentStyles";
import { MyUserContext } from "../../configs/Context";

export const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

const Comment = ({ placeId, onCommentAdded }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const user = useContext(MyUserContext);
    const [page, setPage] = useState(1);
    const [totalComments, setTotalComments] = useState(0);

    useEffect(() => {
        setComments([]);
        setPage(1);
        setTotalComments(0);
    }, [placeId]);

    useEffect(() => {
        if (page > 0 && !loading)
            loadComments();
    }, [page]);


    const loadComments = async () => {
        console.log("page-comment", page)
        if (page <= 0 || !placeId) return;
        try {
            setLoading(true);
            let url = endpoints['comments'](placeId) + `?page=${page}`;
            console.log("Url", url)
            const res = await Apis.get(url);
            if (totalComments === 0)
                setTotalComments(res.data?.count || 0);
            if (page === 1) {
                setComments(res.data.results);
            } else {
                setComments(prevComment => [...prevComment, ...res.data.results.filter(newComment => !prevComment.some(c => c.id === newComment.id))])
            }

        } catch (error) {
            if (error.response) {
                // Lỗi từ phía server, có response
                const status = error.response.status;

                if (status === 404) {
                    console.log("Lỗi 404: Không tìm thấy trang");
                    setPage(0);
                } else if (status === 500) {
                    console.log("Lỗi 500: Server lỗi");
                } else {
                    console.log("Lỗi server khác:", status);
                }

            } else if (error.request) {
                // Request đã gửi nhưng không có phản hồi
                console.log("Không có phản hồi từ server:", error.request);
            } else {
                // Lỗi khi thiết lập request
                console.log("Lỗi không xác định:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && page > 0) {
            setPage(page + 1);
            console.log("loadMore")
        }
    }

    const addComment = async () => {
        if (!user) {
            Alert.alert("Thông báo", "Vui lòng đăng nhập để bình luận");
            return;
        }

        if (!newComment.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập nội dung bình luận");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");

            const commentData = {
                content: newComment.trim(),
            };

            const resNewComment = await authAPI(token).post(endpoints["comments"](placeId), commentData)
            setNewComment("");
            if (resNewComment.status === 201) {
                setPage(1);
                setTotalComments(0);
                if (onCommentAdded) {
                    onCommentAdded();
                }

                Alert.alert("Thành công", "Bình luận đã được thêm");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            if (error.response?.status === 400) {
                Alert.alert("Lỗi", "Dữ liệu không hợp lệ");
            } else if (error.response?.status === 401) {
                Alert.alert("Lỗi", "Bạn cần đăng nhập để bình luận");
            } else {
                Alert.alert("Lỗi", "Không thể thêm bình luận");
            }
        }
    };

    

    const renderComment = ({ item }) => (
        <Card style={styles.commentCard}>
            <Card.Content>
                <View style={styles.commentHeader}>
                    <Avatar.Text
                        size={40}
                        label={item.user?.username?.charAt(0)?.toUpperCase() || "U"}
                        style={styles.avatar}
                    />
                    <View style={styles.commentInfo}>
                        <Text style={styles.username}>{item.user?.username || "Người dùng"}</Text>
                        <Text style={styles.commentDate}>{formatDate(item.created_date)}</Text>
                    </View>
                </View>
                <Text style={styles.commentContent}>{item.content}</Text>
            </Card.Content>
        </Card>
    );

    return (
        <FlatList
            onEndReached={loadMore}
            extraData={comments}
            ListHeaderComponent={
                <View style={styles.container}>
                    <Text style={styles.sectionTitle}>Bình luận ({totalComments})</Text>

                    {/* Add Comment Form */}
                    <Card style={styles.addCommentCard}>
                        <Card.Content>
                            <KeyboardAvoidingView behavior="height" >
                                <TextInput
                                style={styles.commentInput}
                                placeholder="Viết bình luận của bạn..."
                                value={newComment}
                                onChangeText={setNewComment}
                                multiline
                                numberOfLines={3}
                            />
                            </KeyboardAvoidingView>
                            <Button
                                mode="contained"
                                onPress={addComment}
                                style={styles.addButton}
                                disabled={!newComment.trim() || !user}
                            >
                                {user ? "Gửi bình luận" : "Đăng nhập để bình luận"}
                            </Button>
                        </Card.Content>
                    </Card>

                    <Divider style={styles.divider} />
                </View>
            }
            ListFooterComponent={
                <>
                    {loading && <Text style={styles.loadingText}>Đang tải bình luận...</Text>}
                    {comments?.length < 0 && <Text style={styles.noCommentsText}>Chưa có bình luận nào</Text>}
                </>

            }
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.commentsList}

        >
        </FlatList>
    );
};

export default Comment;