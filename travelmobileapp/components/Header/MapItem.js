import React from 'react';
import { Text, View } from 'react-native';
import MapView, { UrlTile, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
// import Constants from 'expo-constants';
// const MAPBOX_TOKEN = Constants.manifest.extra.MAPBOX_TOKEN;

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

export default function MapItem({ lat = 10.768211, long = 106.706670 }) {
    console.log("URL", `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`);
    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ width: '100%', height: 200 }}
                provider={PROVIDER_DEFAULT}
                region={{
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                onMapReady={() => console.log("Map Ready")}
            >
                <UrlTile
                    urlTemplate={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`}
                    maximumZ={19}
                    flipY={false}
                    onTileError={(e) => console.log("Tile load error:", e.nativeEvent)}
                />
                <Marker coordinate={{ latitude: lat, longitude: long }} />
            </MapView>
            <Text>{`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/0/0/0@2x?access_token=${MAPBOX_TOKEN}`}</Text>
            <Text>{lat} {long} {MAPBOX_TOKEN}</Text>
        </View>
    );
}
