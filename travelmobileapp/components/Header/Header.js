import { Text, View } from "react-native";
import Styles from "../User/Styles";
import MyStyle from "../../styles/MyStyle";

const Header = ({ title }) => {
    return (
        <View style={{alignItems: "center"}}>
            <View style={Styles.headerStyle}>
                <Text style={[Styles.titleRegister, MyStyle.m]}>
                    {title}
                </Text>
            </View>
        </View>
    );
}



export default Header;