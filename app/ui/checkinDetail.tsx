import DetailCardComponent from "./detailCard";
import {
  fetchCheckinProgramIds,
  fetchPlace,
  fetchProgramInfo,
} from "@/lib/dbActions";

export default async function CheckinDetailComponent() {
  const checkinProgramIdList = await fetchCheckinProgramIds();
  const allPlaceList = await fetchPlace();
  const checkinProgramList = await Promise.all(
    checkinProgramIdList.map(async (programId) => {
      const programInfo = await fetchProgramInfo(programId);
      return programInfo;
    })
  );
  const spotsInfo = checkinProgramList.map((item) => {
    // const place = allPlaceList.find((p: { id: string }) => p.id === item.place);
    if (item.link !== null) {
      console.log("item.link: ", item.link);
      return {
        title: item.title,
        content: item.content,
        link: item.link,
      };
    }
    return {
      title: item.title,
      content: item.content,
    };
  });
  console.log("spotsInfo: ", spotsInfo);

  return (
    <div className="grid row-start-2 h-hull overflow-auto w-full px-5 justify-center">
      <div className="mt-5">
        <h1 className="text-2xl font-bold text-center mb-10">
          チェックイン中のイベント
        </h1>
        <p className="text-right">{spotsInfo.length}件</p>
        {spotsInfo.length === 0 ? (
          <h1>イベントはありません</h1>
        ) : (
          <>
            {spotsInfo.map((spotInfo, index) => {
              return (
                <div key={index}>
                  <DetailCardComponent
                    spotInfo={spotInfo}
                    thema="white"
                    textColor="dark"
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
