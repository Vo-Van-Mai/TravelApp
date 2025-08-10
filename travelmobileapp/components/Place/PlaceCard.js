import { Alert, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import PlaceStyle from './PlaceStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useContext, useState } from 'react';
import { MyDispatchFavouriteContext, MyFavouriteContext, MyUserContext } from '../../configs/Context';
import { useNavigation } from '@react-navigation/native';
import { authAPI, endpoints } from '../../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';


const PlaceCard = ({ place, navigation, width }) => {
  const user = useContext(MyUserContext);
  const nav = useNavigation();
  const favourite = useContext(MyFavouriteContext);
  const dispatch = useContext(MyDispatchFavouriteContext);
  const handleLike = async () => {
    if (!user) {
      Alert.alert("Cảnh báo", "Vui lòng đăng nhập để thích địa điểm", [
        {
          text: "Hủy",
          style: "cancel"
        }, {
          text: "Đồng ý",
          onPress: () => nav.navigate("login")
        }
      ]);
    }
    else{
      const url = endpoints['placeDetail'](place?.id) + "get-favourite/";
      const resLike = await authAPI(await AsyncStorage.getItem("token")).post(url);
      if (resLike.data.is_like===true){

        dispatch({
          "type": "add_favourite",
          "payload": resLike.data
        });
      }
      else{
        dispatch({
          "type": "del_favourite",
          "payload": resLike.data.id
        });
      }
    }
  }
    return (

      <View style={[PlaceStyle.container, { width: width || '95%' }]}>
        <Card style={PlaceStyle.bgColor}>
          
          <Card.Cover source={{ uri: place.images?.[0]?.url_path || "None" }} />
          <Card.Content>
            <Text ellipsizeMode='tail' numberOfLines={1} style={{ marginTop: 5, fontSize: 18, color: "#000000" }} variant="titleLarge">{place.name} </Text>
            <Text variant="bodyMedium">{place.province.name} </Text>
          </Card.Content>

          <Card.Actions>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "100%", alignItems: "center" }}>
              <TouchableOpacity onPress={handleLike}>
                {favourite?.some(f => f.place?.id === place?.id && f.is_like) ? <Icon name='heart' color="red" size={20}></Icon> : <Icon name='heart-o' size={20}></Icon>}
              </TouchableOpacity>
              <Button mode="contained" onPress={() => navigation.navigate("PlaceDetail", { "placeId": place.id })} style={{ backgroundColor: "#84d5e9ff" }}>Chi tiết</Button>

            </View>
          </Card.Actions>

        </Card>
      </View>
    );
  }

  export default PlaceCard;