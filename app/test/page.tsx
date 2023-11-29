"use client";

import { sample } from "@/lib/actions";
import TestComponent from "../ui/test";
import { useRouter } from "next/navigation";
import { getUidFromCookie } from "@/lib/session";
import { useState, useEffect } from "react";
import { analytics, auth } from "@/lib/firebase/client";
import LogoutComponent from "../ui/logout";
import { logEvent } from "firebase/analytics";
// import ReactMapGL from "react-map-gl";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import DeckGL from "@deck.gl/react/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
// import { ViewportProps } from "react-map-gl";

function renderTooltip(hoverInfo: any) {
  const { object, x, y } = hoverInfo;
  if (!object) {
    return null;
  }
  return (
    <div className="tooltip" style={{ position: "absolute", left: x, top: y }}>
      <big>test</big>
    </div>
  );
}

export default function Test() {
  const router = useRouter();
  const [viewState, setViewState] = useState({
    latitude: 35.6895, // 東京の緯度
    longitude: 139.6917, // 東京の経度
    zoom: 10,
  });
  const [hoverInfo, setHoverInfo] = useState({});
  const layer = new GeoJsonLayer({
    id: "geojson-layer",
    // data,
    filled: true,
    stroked: true,
    getLineWidth: 40,
    getLineColor: [255, 0, 0],
    getFillColor: [255, 255, 0, 50],
  });
  const polygon = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [139.7380683850485, 35.609983775090214],
          [139.7323157802146, 35.6137715585613],
          [139.73816346942544, 35.6200712501424],
          [139.7465308946397, 35.620032603240034],
          [139.7483850399991, 35.61748186642562],
          [139.74905063064136, 35.612921255435],
          [139.74781453373384, 35.60836038441386],
          [139.7431553992402, 35.60863095181429],
          [139.7380683850485, 35.609983775090214],
        ],
      ],
    },
  };

  const layer2 = new GeoJsonLayer({
    id: "geojson-layer2",
    data: polygon,
    stroked: true,
    filled: true,
    lineWidthMinPixels: 2,
    getLineColor: [255, 0, 0, 255],
    getFillColor: [0, 255, 0, 200],
    pickable: true,
    onHover: setHoverInfo,
  });

  useEffect(() => {
    const _initialize = async () => {
      await auth.authStateReady();
      const uid = auth.currentUser?.uid;
      console.log("test uid: ", uid);
      const cookie = await getUidFromCookie();
      // logEvent(analytics, "test_authStateReady");
      console.log("test cookie: ", cookie);
      if (!uid) {
        router.push("/login");
      }
    };
    _initialize();
  });
  return (
    <div>
      <TestComponent action={sample} />
      {/* <DeckGL
        initialViewState={viewState}
        controller={true}
        layers={[layer, layer2]}
      >
        <Map
          mapStyle="https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json"
          maplibreLogo
          styleDiffing
        />
        {renderTooltip(hoverInfo)}
      </DeckGL> */}
      <LogoutComponent />
    </div>
  );
}
