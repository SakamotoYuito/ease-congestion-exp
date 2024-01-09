import DetailCardComponent from "./detailCard";
import { fetchCheckinProgramIds, fetchProgramInfo } from "@/lib/dbActions";

export default async function CheckinDetailComponent() {
  const checkinProgramIdList = await fetchCheckinProgramIds();
  const checkinProgramList = await Promise.all(
    checkinProgramIdList.map(async (programId) => {
      const programInfo = await fetchProgramInfo(programId);
      return { programId, programInfo };
    })
  );
  const spotsInfo = checkinProgramList.map((item) => {
    if (item.programInfo.link !== null) {
      return {
        title: item.programInfo.title,
        content: item.programInfo.content,
        process: item.programInfo.process,
        caution: item.programInfo.caution,
        condition: item.programInfo.condition,
        link: `${item.programInfo.link}?programId=${item.programId}&rewardPoint=${item.programInfo.rewardPoint}`,
      };
    }
    return {
      title: item.programInfo.title,
      content: item.programInfo.content,
      process: item.programInfo.process,
      caution: item.programInfo.caution,
      condition: item.programInfo.condition,
    };
  });

  return (
    <div className="grid row-start-2 h-hull overflow-auto w-full px-5 justify-center">
      <div className="mt-5">
        <h1 className="text-xl font-bold text-center mb-10">
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
