import Link from "next/link";
import { FaTiktok } from "react-icons/fa";

export default function TiktokIcon() {
  return (
    <Link
      href="https://www.facebook.com/profile.php?id=61579954581291"
      className="block bg-[#000000] w-max p-[0.25rem] rounded-full"
    >
      <span className="text-white">
        <FaTiktok />
      </span>
    </Link>
  );
}
