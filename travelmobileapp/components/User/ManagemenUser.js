import { ScrollView, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import Styles from "./Styles";
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet } from "react-native";

const ManagementUser = () => {
    const iconSize = 24
    return(
        <ScrollView>
            <View>
                <Text style={Styles.mainTitle}>Quản lý người dùng</Text>
                <TouchableOpacity style={styles.container}>
                    <Icon style={[styles.m, styles.p]} size={iconSize} name="user"/>
                    <Text style={[styles.m, styles.p, styles.titleName]}>Danh sách người dùng</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.container}>
                    <Icon style={[styles.m, styles.p]} size={iconSize} name="male" />
                    <Text style={[styles.m, styles.p, styles.titleName]}>Danh sách nhà cung cấp</Text>
                </TouchableOpacity>
                
            </View>
            
            <View>
                <Text style={Styles.mainTitle}>Quản lý địa điểm </Text>
                <TouchableOpacity style={styles.container}>
                    <Icon style={[styles.m, styles.p]} size={iconSize} name="fort-awesome"/>
                    <Text style={[styles.m, styles.p, styles.titleName]}>Danh sách địa điểm</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.container}>
                    <Icon style={[styles.m, styles.p]} size={iconSize} name="calendar-plus-o" />
                    <Text style={[styles.m, styles.p, styles.titleName]}>Thêm địa điểm</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.container}>
                    <Icon style={[styles.m, styles.p]} size={iconSize} name="pencil-square" />
                    <Text style={[styles.m, styles.p, styles.titleName]}>Cập nhật địa điểm</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
    },
    m: {
        margin: 4
    },
    p: {
        padding: 3
    },
    titleName: {
        fontSize: 16,
        color: "darkblue"
    }
});

export default ManagementUser;