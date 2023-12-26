import AboutComponent from "../ui/about";
import HeaderComponent from "../ui/header";

export default function About() {
  return (
    <main className="grid grid-rows-base-layout min-h-screen w-full pb-40 overflow-auto justify-items-center items-center pl-2 pr-2">
      <HeaderComponent />
      <div className="row-start-2 pt-2">
        <AboutComponent />
      </div>
    </main>
  );
}
