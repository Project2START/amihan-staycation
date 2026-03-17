import ImageMainLogo from "../../shared/components/ImageMainLogo";
import HeaderSideBar from "./HeaderSideBar";

export default function HeaderAdmin() {
  return (
    <div>
      <div className="flex items-center justify-between bg-white shadow-lg/30 px-[1rem] py-[0.75rem]">
        <HeaderSideBar />
        <ImageMainLogo />
        <div></div>
      </div>
    </div>
  );
}
