"use client";

import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { InterfaceMap } from "@/lib/mapStyle";
import { useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useState } from "react";
// import { use100vh}  from "react-div-100vh";

export type Map = google.maps.Map;

type Props = {
  spots: { lat: number; lng: number }[];
};

const googleMapOptions = {
  // styles: InterfaceMap,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: false,
  language: "ja",
};

export const useMap = ({ spots }: Props) => {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const { isLoaded } = useJsApiLoader({
    id: "google-map",
    googleMapsApiKey,
  });

  const onLoad = (map: Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    spots.forEach((spot) => {
      const marker = new window.google.maps.Marker({
        position: {
          lat: spot.lat,
          lng: spot.lng,
        },
        map,
      });
      bounds.extend(spot);
    });
    map.fitBounds(bounds, 100);
  };

  const onUnmount = useCallback(() => {}, []);

  return { isLoaded, onLoad, onUnmount };
};

export default function GoogleMapComponent() {
  // const height = use100vh();
  const wrapperHeight = `calc(100vh - 160px)`;
  const containerStyle = {
    width: "100%",
    height: wrapperHeight,
  };

  const spots = [
    {
      lat: 35.07034683227539,
      lng: 135.75721740722656,
    },
    {
      lat: 35.06928618423005,
      lng: 135.75647342793118,
    },
  ];

  const { isLoaded, onLoad } = useMap({
    spots,
  });

  // const zoom = 10;

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          options={googleMapOptions}
          // zoom={zoom}
          mapContainerStyle={containerStyle}
          onLoad={onLoad}
        ></GoogleMap>
      ) : (
        "loading"
      )}
    </>
  );
}
