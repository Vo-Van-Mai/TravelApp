import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home/Home";
import PlaceDetail from "./components/Place/PlaceDetial";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return(
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home}></Stack.Screen>
      <Stack.Screen name="PlaceDetail" component={PlaceDetail} options={{title:"Chi tiết địa điểm"}}></Stack.Screen>
    </Stack.Navigator>
  );
}

const App = () => {

  return(
    <NavigationContainer>
      <StackNavigator/>

    </NavigationContainer>
  );

}

export default App;


