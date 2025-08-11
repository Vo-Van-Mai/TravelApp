import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import TourCard from "./TourCard";
import { useContext, useEffect, useState } from "react";
import { MyTourContext, MyTourDispatchContext, MyUserContext } from "../../configs/Context";
import { authAPI, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../Header/Header";

const ListTour = () => {
    const [loading, setLoading] = useState(false);
    const tour = useContext(MyTourContext);
    const tourDispatch = useContext(MyTourDispatchContext);
    const user = useContext(MyUserContext);

    const loadTour = async () => {
        try {
            setLoading(true);

            let url = endpoints['tour'] + `?provider_id=${user?.id}`;
            console.log('url', url)
            const resTour = await authAPI(await AsyncStorage.getItem("token")).get(url);
            console.log("resTour", resTour.data.results);
            tourDispatch({
                "type": "set_tour",
                "payload": resTour.data.results
                });

        } catch (error) {
            if (error.response.status === 404) {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTour();
    }, []);

    if(!tour || tour.length === 0){
        return(
            <View style={{alignItems: "center"}}>
                <Header title={"Chưa có tour nào!"} />
            </View>
        );
    }
    return (
        <View>
            {tour.map(t => <TouchableOpacity key={t.id}>
                <TourCard tour={t}/>
            </TouchableOpacity> )}
        </View>
    );
}

export default ListTour;