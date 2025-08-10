import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home/Home";
import PlaceDetail from "./components/Place/PlaceDetial";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import { use, useContext, useReducer } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import Profile from "./components/User/Profile";
import { MyDispatchContext, MyDispatchFavouriteContext, MyFavouriteContext, MyUserContext } from "./configs/Context";
import AddPlace from "./components/Place/AddPlace";
import ListUser from "./components/User/ListUser";
import ListProvider from "./components/User/ListProvider";
import Favourite from "./components/Favourite/Favourite";
import MyFavouritePlaceReducer from "./reducers/MyFavouritePlaceReducer";

const Stack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const user = useContext(MyUserContext);
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="index" component={StackNavigator} options={{ tabBarIcon: () => <Icon source="home" size={26}></Icon>, title: "Trang chủ" }} />

      {user === null && <>
        <Tab.Screen name="login" component={Login} options={{ tabBarIcon: () => <Icon source="account" size={26}></Icon>, title: "Đăng nhập" }} />
        <Tab.Screen name="register" component={Register} options={{ tabBarIcon: () => <Icon source="account-plus" size={26}></Icon>, title: "Đăng kí" }} />
      </>}

      {user !== null &&
        <>
          {user !== null && user.role === "traveler" && <Tab.Screen name="favourite" component={Favourite} options={{ tabBarIcon: () => <Icon source="star" size={26}></Icon> }} />}
          <Tab.Screen name="account" component={ProfileStackNavigator} options={{ tabBarIcon: () => <Icon source="account" size={26}></Icon> }} />
        </>
      }






    </Tab.Navigator>
  );
}

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{title: "Trang chủ"}}></Stack.Screen>
      <Stack.Screen name="PlaceDetail" component={PlaceDetail} options={{ title: "Chi tiết địa điểm" }}></Stack.Screen>
    </Stack.Navigator>
  );
}

const ProfileStackNavigator = () => {
  const user = useContext(MyUserContext);
  return (
    <ProfileStack.Navigator>
      {user != null && <ProfileStack.Screen name="profile" component={Profile} options={{ tabBarIcon: () => <Icon source="account-plus" size={26}></Icon>, title: "Tài khoản" }} />}

      {user != null && user.role === "admin" && <>
        <ProfileStack.Screen name="addPlace" component={AddPlace} options={{ title: "Thêm địa điểm" }} />
        <ProfileStack.Screen name="listUser" component={ListUser} options={{ title: "Danh sách người dùng" }} />
        <ProfileStack.Screen name="listProvider" component={ListProvider} options={{ title: "Danh sách nhà cung cấp" }} />
      </>}
    </ProfileStack.Navigator>

  );
}

const App = () => {

  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [favourite, favouriteDispatch] = useReducer(MyFavouritePlaceReducer, []);

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <MyFavouriteContext.Provider value={favourite}>
          <MyDispatchFavouriteContext.Provider value={favouriteDispatch}>
            <NavigationContainer>
              <TabNavigator />
            </NavigationContainer>
          </MyDispatchFavouriteContext.Provider>
        </MyFavouriteContext.Provider>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );

}

export default App;


