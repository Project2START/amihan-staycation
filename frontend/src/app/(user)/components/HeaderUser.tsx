import AvatarHead from "../../shared/components/AvatarHead";
import ImageMainLogo from "../../shared/components/ImageMainLogo";

export default function HeaderUser() {
  return (
    <header>
      <div className="flex items-center justify-between bg-white shadow-lg/30 px-[1rem] py-[0.75rem]">
        <AvatarHead />
        <ImageMainLogo />
        <div></div>
      </div>
    </header>
  );
}
