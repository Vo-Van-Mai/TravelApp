import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home/Home";
import PlaceDetail from "./components/Place/PlaceDetial";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import { useContext, useReducer } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import Profile from "./components/User/Profile";
import { MyDispatchContext, MyUserContext } from "./configs/Context";
import AddPlace from "./components/Place/AddPlace";
import ListUser from "./components/User/ListUser";

const Stack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const user = useContext(MyUserContext);
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="index" component={StackNavigator} options={{ tabBarIcon: () => <Icon source="home" size={26}></Icon> }} />

      {user === null && <>
        <Tab.Screen name="login" component={Login} options={{ tabBarIcon: () => <Icon source="account" size={26}></Icon> }} />
        <Tab.Screen name="register" component={Register} options={{ tabBarIcon: () => <Icon source="account-plus" size={26}></Icon> }} />
      </>}

      {user != null && <Tab.Screen name="account" component={ProfileStackNavigator} options={{ tabBarIcon: () => <Icon source="account-plus" size={26}></Icon> }} />}



    </Tab.Navigator>
  );
}

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home}></Stack.Screen>
      <Stack.Screen name="PlaceDetail" component={PlaceDetail} options={{ title: "Chi tiết địa điểm" }}></Stack.Screen>
    </Stack.Navigator>
  );
}

const ProfileStackNavigator = () => {
  const user = useContext(MyUserContext);
  return(
    <ProfileStack.Navigator>
      {user != null && <ProfileStack.Screen name="profile" component={Profile} options={{ tabBarIcon: () => <Icon source="account-plus" size={26}></Icon> }} />}
      
      {user != null && user.role === "admin" && <>
      <ProfileStack.Screen name="addPlace" component={AddPlace} />
      <ProfileStack.Screen name="listUser" component={ListUser} />
      </>}
    </ProfileStack.Navigator>

  );
}

const App = () => {

  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <NavigationContainer>
          <TabNavigator />

        </NavigationContainer>

      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );

}

export default App;


