import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
import { MyDispatchContext, MyDispatchFavouriteContext, MyFavouriteContext, MyProviderContext, MyProviderDispatchContext, MyTourContext, MyTourDispatchContext, MyUserContext } from "./configs/Context";
import AddPlace from "./components/Place/AddPlace";
import ListUser from "./components/User/ListUser";
import ListProvider from "./components/User/ListProvider";
import Favourite from "./components/Favourite/Favourite";
import MyFavouritePlaceReducer from "./reducers/MyFavouritePlaceReducer";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import ManagementProvider from "./components/Provider/ManagementProvider";
import ProfileProvider from "./components/Provider/ProfileProvider";
import ListTour from "./components/Provider/ListTour";
import MyTourReducer from "./reducers/MyTourReducer";
import AddTour from "./components/Provider/AddTour";
import AddProfile from "./components/Provider/AddProfile";
import MyProviderReducer from "./reducers/MyProviderReducer";
import Stats from "./components/Provider/Stats";
import DetailTour from "./components/Provider/DetailTour";
import ListTourForTraveller from "./components/Tour/ListTourForTraveller";
import AddTourPlace from "./components/TourPlace/AddTourPlace";
import UpdateProfile from "./components/User/UpdateProfile";
import Booking from "./components/Booking/Booking";
import Payment from "./components/Booking/Payment";
import ListBooking from "./components/Booking/ListBooking";

const Stack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = () => {
  const user = useContext(MyUserContext);
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="index" component={StackNavigator} options={{ tabBarIcon: () => <Icon source="home" size={26}></Icon>, title: "Trang chủ", headerShown: false }} />
      <Tab.Screen name="tour" component={TourStackNavigator} options={{ tabBarIcon: () => <Icon source="wallet-travel" size={26}></Icon>, title: "Chuyến đi", headerShown: false }} />

      {user === null && <>
        <Tab.Screen name="login" component={AuthStackNavigator} options={{ tabBarIcon: () => <Icon source="account" size={26}></Icon>, title: "Đăng nhập" }} />
      </>}

      {user !== null &&
        <>
          {user !== null && user.role === "traveler" && <Tab.Screen name="favourites" component={FavouriteStackNavigator} options={{ tabBarIcon: () => <Icon source="star" size={26}></Icon> }} />}
          <Tab.Screen name="account" component={ProfileStackNavigator} options={{ tabBarIcon: () => <Icon source="account" size={26}></Icon>, title:"Tài khoản" }} />
        </>
      }
    </Tab.Navigator>
  );
}

const AuthStackNavigator = () => {
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="authLogin" component={Login}/>
    <Stack.Screen name="register" component={Register}/>
  </Stack.Navigator>
  );
}

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} options={{ title: "Trang chủ", headerShown: false }}></Stack.Screen>
      <Stack.Screen name="PlaceDetail" component={PlaceDetail} options={{ title: "Chi tiết địa điểm", headerShown: false }}></Stack.Screen>
    </Stack.Navigator>
  );
}


const FavouriteStackNavigator = () => {
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>  
    <Stack.Screen name="favourite" component={Favourite} options={{ title: "Địa điểm yêu thích" }}></Stack.Screen>
    <Stack.Screen name="placeDetail" component={PlaceDetail} options={{ title: "Địa điểm yêu thích" }}></Stack.Screen>
  </Stack.Navigator>
  );
}


const TourStackNavigator = () => {
  return(
    <Stack.Navigator initialRouteName="listTour" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="listTour" component={ListTourForTraveller} options={{ title: "danh sách chuyển đi"}}></Stack.Screen>
      <Stack.Screen name="detailTour" component={DetailTour} options={{ title: "Chi tiết chuyến đi" ,headerShown: false}}></Stack.Screen>
      <Stack.Screen name="placeDetail" component={PlaceDetail} options={{ title: "Địa điểm yêu thích" }}></Stack.Screen>
    </Stack.Navigator>
  );
}


const ProfileStackNavigator = () => {
  const user = useContext(MyUserContext);
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      {user != null && 
      <>
      <ProfileStack.Screen name="profile" component={Profile} options={{ tabBarIcon: () => <Icon source="account-plus" size={26}></Icon>, title: "Tài khoản" }} />
      <ProfileStack.Screen name="updateProfile" component={UpdateProfile} options={{ tabBarIcon: () => <Icon source="account" size={26}></Icon>, title: "Cập nhật hồ sơ" }} />
      </>}

      {user != null && user.role === "admin" && <>
        <ProfileStack.Screen name="addPlace" component={AddPlace} options={{ title: "Thêm địa điểm" }} />
        <ProfileStack.Screen name="listUser" component={ListUser} options={{ title: "Danh sách người dùng" }} />
        <ProfileStack.Screen name="listProvider" component={ListProvider} options={{ title: "Danh sách nhà cung cấp" }} />
      </>}
    </ProfileStack.Navigator>

  );
}

const ManagementProviderStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Management" component={ManagementProvider} />
      <Stack.Screen name="ProfileProvider" component={ProfileProvider} />
      <Stack.Screen name="ListTour" component={ListTour} />
      <Stack.Screen name="AddTour" component={AddTour} />
      <Stack.Screen name="AddProfile" component={AddProfile} />
      <Stack.Screen name="Stats" component={Stats} />
      <Stack.Screen name="DetailTour" component={DetailTour} />
      <Stack.Screen name="AddTourPlace" component={AddTourPlace} />
    </Stack.Navigator>
  );
}


const BookingStack = () => {
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="listBooking" component={ListBooking} options={{ title: "Danh sách tour đã đặt" }}></Stack.Screen>
      <Stack.Screen name="booking" component={Booking} options={{ title: "Thông tin đặt tour" }}></Stack.Screen>
      <Stack.Screen name="payment" component={Payment} options={{ title: "Thông tin đặt tour" }}></Stack.Screen>
    </Stack.Navigator>
  );

}



const DrawerNavigation = () => {
  const user = useContext(MyUserContext);
  return (
    <Drawer.Navigator screenOptions={{headerShown: true}}  >
      <Drawer.Screen name="main" component={TabNavigator} options={{ title: "Travel app", drawerIcon: () => <Icon source="biathlon" size={26}></Icon> }} />
      {user && user.role === "provider" && <>
        <Drawer.Screen name="managementProvider" component={ManagementProviderStack} options={{ title: "Quản lý công ty" }} />

      </>}
      {user && user.role === "traveler" && <>
        <Drawer.Screen name="bookingStack" component={BookingStack} options={{ title: "Tour đã đặt" }} />
      </>}
    </Drawer.Navigator>
  );
}

// const MyDrawerItem = (props) => {
//   const nav = useNavigation();
//   const { userDispatch } = useContext(MyDispatchContext);
//   const user = useContext(MyUserContext);

//   const logout = () => {
//     userDispatch({ type: "logout" });
//     nav.navigate("index", { screen: "Home" });
//   };

//   return (
//     <DrawerContentScrollView {...props}>
//       <DrawerItemList {...props} />
//       {user && <DrawerItem label="Đăng xuất" onPress={logout} />}
//     </DrawerContentScrollView>
//   );
// };

const App = () => {

  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [provider, providerDispatch] = useReducer(MyProviderReducer, null);
  const [favourite, favouriteDispatch] = useReducer(MyFavouritePlaceReducer, []);
  const [tour, tourDispatch] = useReducer(MyTourReducer, []);

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>

        <MyProviderContext.Provider value={provider}>
          <MyProviderDispatchContext.Provider value={providerDispatch}>

              <MyFavouriteContext.Provider value={favourite}>
                <MyDispatchFavouriteContext.Provider value={favouriteDispatch}>

                  <MyTourContext.Provider value={tour}>
                    <MyTourDispatchContext.Provider value={tourDispatch}>

                      <NavigationContainer>
                        <DrawerNavigation />
                      </NavigationContainer>

                    </MyTourDispatchContext.Provider>
                  </MyTourContext.Provider>

                </MyDispatchFavouriteContext.Provider>
              </MyFavouriteContext.Provider>

          </MyProviderDispatchContext.Provider>
        </MyProviderContext.Provider>

        
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );

}

export default App;


