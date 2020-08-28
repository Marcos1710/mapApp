import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Dimensions, View, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";

import Search from "../Seacrh";
import Directions from "../Directions";
import Details from "../Details";
import { getPixelSize } from "../../utils";

import markerImage from "../../assets/marker.png";
import backImage from "../../assets/back.png";

import {
  Back,
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
} from "./styles";

import { APIKEY } from "@env";

function Map() {
  const [region, setRegion] = useState(null);
  const [destination, setDestination] = useState(null);
  const [duration, setDuration] = useState(null);
  const [city, setCity] = useState(null);

  let mapView = useRef(null);
  Geocoder.init(APIKEY);

  // o segundo parametro é um obj details que tem um obj geometry dentro
  function handleLocationSelected(data, { geometry }) {
    const { location } = geometry;
    const locale = {
      latitude: location.lat,
      longitude: location.lng,
    };

    setDestination({
      ...locale,
      title: data.structured_formatting.main_text,
    });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      // success
      async ({ coords: { latitude, longitude } }) => {
        const response = await Geocoder.from({ latitude, longitude });
        const address = response.results[0].formatted_address;
        const end = address.substring(0, address.indexOf(","));

        setCity(end);
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      // error
      () => {},
      {
        timeout: 2000,
        enableHighAccuracy: true, // get location with gps of device
        maximumAge: 1000, // cache
      }
    );
  }, []);

  function handleBack() {
    setDestination(null);
  }

  return (
    <View>
      <MapView
        style={styles.mapStyle}
        initialRegion={region}
        showsUserLocation
        loadingEnabled
        ref={(el) => (mapView = el)}
      >
        {destination && (
          <>
            <Directions
              origin={region}
              destination={destination}
              onReady={(result) => {
                setDuration(Math.floor(result.duration));
                mapView.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(50),
                    bottom: getPixelSize(350),
                  },
                });
              }}
            />
            <Marker
              coordinate={destination}
              anchor={{ x: 0, y: 0 }}
              image={markerImage}
            >
              <LocationBox>
                <LocationText>{destination.title}</LocationText>
              </LocationBox>
            </Marker>

            <Marker coordinate={region} anchor={{ x: 0, y: 0 }}>
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{duration}</LocationTimeText>
                  <LocationTimeTextSmall>Min</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>{city}</LocationText>
              </LocationBox>
            </Marker>
          </>
        )}
      </MapView>

      {destination ? (
        <>
          <Back onPress={handleBack}>
            <Image source={backImage} />
          </Back>
          <Details />
        </>
      ) : (
        <Search onLocationSelected={handleLocationSelected} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default Map;
