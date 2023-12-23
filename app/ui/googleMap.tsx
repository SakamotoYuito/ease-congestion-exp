"use client";

import { GoogleMap } from "@react-google-maps/api";
import { useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useState, useRef } from "react";
import DetailCardComponent from "./detailCard";

type Map = google.maps.Map;

const googleMapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: false,
  language: "ja",
};

type Spots = {
  spotsCenter: { lat: number; lng: number }[];
  spotsInfo: {
    title: string;
    content: string;
    place: string;
    link?: string;
  }[];
};

export default function GoogleMapComponent({ spotsCenter, spotsInfo }: Spots) {
  const [spotInfo, setSpotInfo] = useState(spotsInfo[0]);
  const wrapperHeight = `calc(100vh - 160px)`;
  const containerStyle = {
    width: "100%",
    height: wrapperHeight,
  };

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const { isLoaded } = useJsApiLoader({
    id: "google-map",
    googleMapsApiKey,
  });

  const mapRef = useRef<Map>();
  const onLoad = useCallback(
    (map: Map) => {
      mapRef.current = map;
      const bounds = new window.google.maps.LatLngBounds();
      spotsCenter.forEach((spot, index) => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: spot.lat,
            lng: spot.lng,
          },
          map,
        });
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<p>${spotsInfo[index].title}</p>`,
        });
        marker.addListener("click", () => {
          map.panTo(spot);
          setSpotInfo(spotsInfo[index]);
          infoWindow.open(map, marker);
        });
        bounds.extend(spot);
      });
      spotsCenter.length > 2 && map.fitBounds(bounds, 100);
    },
    [spotsCenter, spotsInfo]
  );

  return (
    <>
      {isLoaded ? (
        <>
          <div className="absolute z-10 p-1 w-full md:w-5/12 items-center">
            <DetailCardComponent
              spotInfo={spotInfo}
              thema="dark"
              textColor="white"
            />
          </div>
          {spotsCenter.length <= 2 ? (
            <GoogleMap
              zoom={17}
              center={spotsCenter[0]}
              options={googleMapOptions}
              mapContainerStyle={containerStyle}
              onLoad={onLoad}
            ></GoogleMap>
          ) : (
            <GoogleMap
              options={googleMapOptions}
              mapContainerStyle={containerStyle}
              onLoad={onLoad}
            ></GoogleMap>
          )}
        </>
      ) : (
        "loading"
      )}
    </>
  );
}
