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

  // if (user && user.role === "provider") {
  //   return (
  //     <Card style={styles.commentCard}>
  //       <Card.Content>
  //         <View style={styles.commentHeader}>
  //           <Avatar.Text
  //             size={40}
  //             label={`T${tour?.id}` || "0"}
  //             style={styles.avatar}
  //           />
  //           <View style={styles.commentInfo}>
  //             <Text style={styles.username}> {tour?.title || "Chưa có tên"}</Text>
  //             <Text style={styles.commentDate}>{formatDate(tour.created_date)}</Text>
  //           </View>
  //         </View>
  //         <Text style={styles.commentContent}>Mô tả: {tour?.description || "Chưa có mô tả chuyến đi"}</Text>
  //       </Card.Content>
  //     </Card>
  //   );
  // }

  return (
    <Card style={[MyStyle.p, MyStyle.m]}>
      <Card.Cover source={{ uri: tour?.tourplaces[0]?.place?.images[0]?.url_path || 'https://picsum.photos/700' }} />
      <Card.Content>
        <Text style={{fontSize: 16, fontWeight: "bold"}} variant="titleLarge">{tour?.title}</Text>
        <Text style={styles.commentDate}>Ngày tạo: {formatDate(tour.created_date)}</Text>
        <Text variant="bodyMedium">{tour?.description}</Text>
        <Text variant="bodyMedium">{tour?.duration_display}</Text>
      </Card.Content>
      <Card.Actions>
        {/* <Button>Cancel</Button> */}
        <Button onPress={() => nav.navigate("detailTour", {"tourId": tour.id})} buttonColor='lightblue'>Xem chi tiết</Button>
      </Card.Actions>
    </Card>
  );

}

export default TourCard;