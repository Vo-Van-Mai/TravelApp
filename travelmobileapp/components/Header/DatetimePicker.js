import React, { useState } from 'react';
import { View, Button, Platform, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Icon } from 'react-native-paper';

const DatetimePiker = ({ setOpenHours}) => {
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedTime) => {
    if (event.type === "dismissed") return; // Người dùng bấm Cancel
    const currentTime = selectedTime || time;
    setShow(Platform.OS === 'ios');
    setTime(currentTime);

    // Lấy giờ phút theo giờ VN
    const vnTime = currentTime.toLocaleTimeString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit"
    });
    setOpenHours(vnTime);
    console.log("Giờ VN:", vnTime);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Icon source="alarm-multiple" size={36} />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={time}
          mode="time" // có thể là 'date', 'time', 'datetime'
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

export default DatetimePiker;
