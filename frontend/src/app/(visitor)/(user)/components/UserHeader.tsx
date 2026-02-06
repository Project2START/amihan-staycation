import AvatarHead from "../../../shared/components/AvatarHead";
import ImageMainLogo from "../../../shared/components/ImageMainLogo";

export default function UserHeader() {
  return (
    <header>
      <div className="flex items-center justify-between bg-white shadow-lg/30 px-[1rem] py-[0.75rem]">
        <div className="flex-1/3 flex justify-start">
          <AvatarHead />
        </div>
        <div className="flex-1/3 flex justify-center">
          <ImageMainLogo />
        </div>
        <div className="flex-1/3"></div>
      </div>
    </header>
  );
}
