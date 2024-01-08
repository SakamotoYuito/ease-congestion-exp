import GoogleMapComponent from "./googleMap";
import { fetchAllOnlinePrograms, fetchPlace } from "@/lib/dbActions";
import { getUserFromCookie } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function EventDetailComponent() {
  const user = await getUserFromCookie();
  user === null && redirect("/login");
  const onlineProgramList = await fetchAllOnlinePrograms();
  const allPlaceList = await fetchPlace();
  const placeIdList = onlineProgramList.map((item) => item.place);
  const spotsCenter = placeIdList.map((placeId) => {
    const place = allPlaceList.find((p: { id: string }) => p.id === placeId);
    const center = place.center;
    return {
      lat: center.latitude,
      lng: center.longitude,
    };
  });
  const spotsInfo = onlineProgramList.map((item) => {
    const place = allPlaceList.find((p: { id: string }) => p.id === item.place);
    return {
      title: item.title,
      content: item.content,
      process: item.process,
      caution: item.caution,
      condition: item.condition,
      place: place.name,
    };
  });

  return (
    <div className="grid row-start-2 h-hull w-full overflow-hidden">
      {spotsCenter?.length === 0 ? (
        <div>
          <h1 className="text-2xl font-bold text-center mb-10">
            イベントはありません
          </h1>
        </div>
      ) : (
        <GoogleMapComponent spotsCenter={spotsCenter} spotsInfo={spotsInfo} />
      )}
    </div>
  );
}
