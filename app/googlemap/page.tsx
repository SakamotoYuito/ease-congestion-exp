"use client";

import React from "react";
// import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "50vh",
};

const center = {
  lat: 35.07034683227539,
  lng: 135.75721740722656,
};

const zoom = 17;

export default function Map() {
  // const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  return (
    <main className="flex flex-col items-center min-h-screen py-2">
      {/* <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
        ></GoogleMap>
      </LoadScript> */}
    </main>
  );
}
