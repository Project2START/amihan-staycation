import Link from "next/link";
import { FaFacebookF } from "react-icons/fa";

export default function FacebookIcon() {
  return (
    <Link
      href="https://www.facebook.com/profile.php?id=61579954581291"
      className="block bg-[#3E89F6] w-max p-[0.25rem] rounded-full"
    >
      <span className="text-white">
        <FaFacebookF />
      </span>
    </Link>
  );
}
