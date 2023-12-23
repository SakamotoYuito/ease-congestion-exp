import DetailCardComponent from "./detailCard";
import GoogleMapComponent from "./googleMap";

export default async function EventDetailComponent() {
  return (
    <div className="grid row-start-2 h-hull w-full overflow-hidden">
      <div className="grid grid-rows-5">
        <div className="absolute z-10 p-1 w-full md:w-5/12 items-center">
          <DetailCardComponent
            title="タイトル"
            content="コンテンツsssssssssssssssssssssssssssss"
            place="14号館"
          />
        </div>
        <div className="">
          <GoogleMapComponent />
        </div>
      </div>
    </div>
  );
}
