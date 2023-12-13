export default function PhotoAlbumComponent() {
  const photos = [{ url: "" }];
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 text-center">
      <div className="justify-center mt-24">
        <h1 className="text-2xl font-bold mb-4">アルバム</h1>
        <div className="grid grid-cols-3 gap-4">
          {/* 写真のデータをループして表示する */}
          {photos.map((photo, index) => (
            <div key={index} className="border border-gray-300 p-4">
              <img
                src={photo.url}
                alt={`写真${index + 1}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
