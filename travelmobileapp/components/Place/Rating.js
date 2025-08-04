import React, { useState, useEffect, useContext } from "react";
import { View, Text, Alert } from "react-native";
import { Card, Button, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import Apis, { endpoints, authAPI } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./PlaceStyle";
import { MyUserContext } from "../../configs/Context";

const Rating = ({ placeId, onRatingChanged }) => {
    const [userRating, setUserRating] = useState({});
    const [averageRating, setAverageRating] = useState({});
    const [loading, setLoading] = useState(false);
    const user = useContext(MyUserContext);
    const [rating, setRating] = useState([]);

    useEffect(() => {
        loadRating();
        loadAverageRating();
        
    }, [placeId]);

    useEffect(() => {
        checkRating(rating);
    }, [rating]);

    const loadRating = async () => {
        try{
            const ratingData = await Apis.get(endpoints['ratings'](placeId));
            setRating(ratingData.data.results);
            console.log("ratingData",ratingData.data.results);

        } catch (error) {
            console.error("Error loading rating data:", error);
        }
    }

    const loadAverageRating = async () => {
        try {
            setLoading(true);
            
            const averageRatingRes = await Apis.get(endpoints['averageRating'](placeId));
            setAverageRating(averageRatingRes.data);
            console.log("AverageRating",averageRatingRes.data);
        } catch (error) {
            console.error("Error loading rating data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRating = async (rating) => {
        if (!user) {
            Alert.alert("Thông báo", "Vui lòng đăng nhập để đánh giá");
            return;
        }

        try {
            const ratingData = {
                star: rating,
            };
            console.log("access_token", await AsyncStorage.getItem('token'))
            const ratingRes = await authAPI(await AsyncStorage.getItem('token')).post(endpoints['ratings'](placeId), ratingData);
            setUserRating(ratingRes.data);
            console.log("raingRes Post: ", ratingRes)
            loadAverageRating();
            if (onRatingChanged) {
                onRatingChanged();
            }
            Alert.alert("Thành công", "Đánh giá của bạn đã được ghi nhận");
        } catch (error) {
            console.error("Error submitting rating:", error);
            Alert.alert("Lỗi", "Không thể gửi đánh giá");
        }
    };

    const checkRating = (rating) => {
        if (user && rating){
            const ratingUser = rating.find(r => r.user.id===user.id);
            console.log("userRating", ratingUser)

            if (ratingUser) {
                setUserRating(ratingUser);
            } else {
                setUserRating(null);
            }
        }
        else{
            setUserRating(null);
        }
    }

    const renderStars = (rating, interactive = false, onPress = null) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <MaterialIcons
                        key={star}
                        name={star <= rating ? "star" : "star-border"}
                        size={24}
                        color={star <= rating ? "#FFD700" : "#ccc"}
                        style={styles.star}
                        onPress={interactive ? () => onPress(star) : null}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.ratingContainer}>
            <Text style={styles.sectionTitle}>Đánh giá</Text>
            
            <Card style={styles.ratingCard}>
                <Card.Content>
                    <View style={styles.averageRatingContainer}>
                        <Text style={styles.averageRatingText}>
                            {averageRating.star_average}
                        </Text>
                        {renderStars(Math.round(averageRating.star_average))}
                        <Text style={styles.totalRatingsText}>
                            ({averageRating.total_rating} đánh giá)
                        </Text>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.userRatingContainer}>
                        <Text style={styles.userRatingTitle}>
                            {user ? "Đánh giá của bạn:" : "Đăng nhập để đánh giá"}
                            
                        </Text>
                        {user && userRating && (
                            <View style={styles.userRatingStars}>
                                {renderStars(userRating.star)}
                               
                                <Text style={styles.userRatingText}>
                                    Bạn đã đánh giá {userRating.star} sao
                                </Text>
                                

                                
                            </View>
                        )}

                        {user && !userRating && (
                            <View> 
                                <Text>Bạn chưa có đánh giá!</Text>
                                {renderStars(userRating?.star || 0, true, handleRating)}

                            </View>

                            )}
                        
                            
                        
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
};

export default Rating; 