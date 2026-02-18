import AvatarHead from "../../(visitor)/(user)/components/AvatarHead";
import HeaderSearch from "../../shared/components/HeaderSearch";
import ImageMainLogo from "../../shared/components/ImageMainLogo";
import HeaderSideBar from "./HeaderSideBar";

export default function HeaderAdmin() {
  return (
    <div>
      <div className="flex items-center justify-between bg-white shadow-lg/30 px-[1rem] py-[0.75rem]">
        {/* <AvatarHead /> */}
        <HeaderSideBar />
        <ImageMainLogo />
        <HeaderSearch />
      </div>
    </div>
  );
}
