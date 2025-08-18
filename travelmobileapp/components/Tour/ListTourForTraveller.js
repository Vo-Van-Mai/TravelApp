import { FlatList, View } from "react-native";
import Header from "../Header/Header";
import MyStyle from "../../styles/MyStyle";
import { useContext, useEffect, useState } from "react";
import MyTourReducer from "../../reducers/MyTourReducer";
import { MyTourContext, MyTourDispatchContext } from "../../configs/Context";
import Apis, { endpoints } from "../../configs/Apis";
import TourCard from "../Provider/TourCard";
import AlertItem from "../Header/AlertItem";

const ListTourForTraveller = () => {
    // const tour = useContext(MyTourContext);
    // const tourDispatch = useContext(MyTourDispatchContext);
    const [tour, setTour] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [page, setPage] = useState(1);
    const loadTour = async () => {
        try{
            setLoading(true);
            console.log("========= Load tour =========")
            let url = endpoints['tour'] + `?page=${page}&status=published`;
            console.log("url", url);
            const resData = await Apis.get(url);
            console.log('resData', resData.data.results);
            if (page===1) {

                setTour([...resData.data.results]);
            }
            else{
                setTour(prevTour => [...prevTour, resData.data.results.filter(tour => !prevTour.some(p=> p.id === tour.id))])
            }

        } catch (error){
            
            console.error(error);
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTour();
    }, []);

    return (
        <View style={MyStyle.container}>
            <Header title={"Danh sách tour du lịch!"} />
            <FlatList
                data={tour}
                renderItem={({item}) => <TourCard tour={item} />}
                keyExtractor={(item) => item.id.toString()}
                
                ListEmptyComponent={
                    <View>
                        <AlertItem title="Chưa có tour nào!" />
                     </View>
                }

            />
        </View>
    );
}

export default ListTourForTraveller;