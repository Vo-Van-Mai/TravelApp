import React, { useEffect } from "react";
import { View, Alert, AppState } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import { endpoints } from "../../configs/Apis";

const Payment = ({ route, navigation }) => {
  const { url, bookingId } = route.params;

  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "active") {
        // Khi user quay lại app, gọi API kiểm tra trạng thái
        try {
          const res = await axios.get(endpoints['booking'] + `${bookingId}/`);
          if (res.data.status === "paid") {
            Alert.alert("Thanh toán thành công!");
            navigation.goBack();
          }
        } catch (err) {
          console.log("Lỗi kiểm tra booking:", err);
        }
      }
    });

    return () => sub.remove();
  }, [bookingId]);

  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: url }} />
    </View>
  );
};

export default Payment;
