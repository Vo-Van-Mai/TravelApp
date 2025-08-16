import * as React from 'react';
import { Avatar, Card, List } from 'react-native-paper';
import { Text, View } from 'react-native';
import { formatDate } from '../Comment/Comment';
import styles from '../Comment/CommentStyles';

const TourCard = ({ tour }) => (
  <Card style={styles.commentCard}>
    <Card.Content>
      <View style={styles.commentHeader}>
        <Avatar.Text
          size={40}
          label={`T${tour?.id}` || "0"}
          style={styles.avatar}
        />
        <View style={styles.commentInfo}>
          <Text style={styles.username}> {tour?.title || "Chưa có tên"}</Text>
          <Text style={styles.commentDate}>{formatDate(tour.created_date)}</Text>
        </View>
      </View>
      <Text style={styles.commentContent}>Mô tả: {tour?.description || "Chưa có mô tả chuyến đi"}</Text>
    </Card.Content>
  </Card>
);

export default TourCard;