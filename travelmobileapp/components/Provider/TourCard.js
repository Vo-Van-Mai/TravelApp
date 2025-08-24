import { Avatar, Button, Card, List } from 'react-native-paper';
import { Image, Text, View } from 'react-native';
import { formatDate } from '../Comment/Comment';
import styles from '../Comment/CommentStyles';
import { useContext } from 'react';
import { MyUserContext } from '../../configs/Context';
import MyStyle from '../../styles/MyStyle';
import { useNavigation } from '@react-navigation/native';

const TourCard = ({ tour }) => {
  const user = useContext(MyUserContext);
  const nav = useNavigation();
  console.info("Tour", tour);

  return (
    <Card style={[MyStyle.p, MyStyle.m]}>
      <Card.Cover source={{ uri: tour?.tourplaces?.[0]?.place?.images?.[0]?.url_path ?? 'https://picsum.photos/700' }} />
      <Card.Content>
        <Text style={{ fontSize: 16, fontWeight: "bold" }} variant="titleLarge">{tour?.title}</Text>
        <Text style={styles.commentDate}>Ngày tạo: {formatDate(tour.created_date)}</Text>
        <Text variant="bodyMedium">{tour?.description}</Text>
        <Text variant="bodyMedium">{tour?.duration_display}</Text>
      </Card.Content>
      <Card.Actions>
        {/* <Button>Cancel</Button> */}
        {/* <Button onPress={() => nav.navigate("tour", {screen:"detailTour", params: {"tourId": tour.id},})} buttonColor='lightblue'>Xem chi tiết</Button> */}
        <Button onPress={() => {
          nav.navigate("main", {
            screen: "tour",
            params: {
              screen: "detailTour",
              params: { tourId: tour.id }
            }
          });
        }} buttonColor='lightblue'>Xem chi tiết</Button>
      </Card.Actions>
    </Card>
  );

}

export default TourCard;