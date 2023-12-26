type Props = {
  info: {
    modalTitle: string;
    mainMessage: string;
    subMessage?: string;
    leftTitle: string;
    rightTitle: string;
    leftOnClick: () => void;
    rightOnClick: () => void;
  };
};

export default function ModalComponent({ info }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-4 bg-white rounded shadow-xl">
        <h2 className="text-2xl font-bold mb-4">{info.modalTitle}</h2>
        <p className="mb-4">{info.mainMessage}</p>
        {info.subMessage !== undefined && (
          <p className="mb-4">{info.subMessage}</p>
        )}
        <div className="flex space-x-4">
          <button
            onClick={info.leftOnClick}
            className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white"
          >
            {info.leftTitle}
          </button>
          <button
            onClick={info.rightOnClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {info.rightTitle}
          </button>
        </div>
      </div>
    </div>
  );
}
