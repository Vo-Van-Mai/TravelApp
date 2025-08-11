import * as React from 'react';
import { List } from 'react-native-paper';

const TourCard = ({tour}) => (
  <List.Item
    title={tour?.title}
    description={tour?.description}
    left={props => <List.Icon {...props} icon="folder" />}
  />
);

export default TourCard;