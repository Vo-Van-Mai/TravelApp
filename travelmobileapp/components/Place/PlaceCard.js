import * as React from 'react';
import { View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import MyStyle from '../../styles/MyStyle';
import Style from '../Home/Style';
import PlaceStyle from './PlaceStyle';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const PlaceCard = ({ place, navigation, width }) => (
  <View style={[PlaceStyle.container , { width: width || '95%' }]}>
    <Card style={PlaceStyle.bgColor}>

      <Card.Cover  source={{ uri: place.images?.[0]?.url_path || "None" }} />
      <Card.Content>
        <Text ellipsizeMode='tail' numberOfLines={1} style={{marginTop: 5, fontSize: 18, color: "#000000"}} variant="titleLarge">{place.name} </Text>
        <Text variant="bodyMedium">{place.province.name} </Text>
      </Card.Content>

      <Card.Actions>
        <Button mode="contained" onPress={() => navigation.navigate("PlaceDetail", {"placeId": place.id})} style={{backgroundColor: "#84d5e9ff"}}>View Details</Button>
      </Card.Actions>

    </Card>
  </View>
);

export default PlaceCard;