import Image from "next/image";
import Link from "next/link";

interface ImageMainLogoProps {
  width?: number;
  height?: number;
  alt?: string;
}

export default function ImageMainLogo({
  alt = "Amihan Staycation main logo",
}: ImageMainLogoProps) {
  return (
    <Link href={"/"}>
      <div className="relative w-12 h-12 lg:w-14 lg:h-14">
        <Image
          src="/images/amihan-staycation-mainLogo.png"
          alt={alt}
          priority
          fill
          className="object-cover"
        />
      </div>
    </Link>
  );
}
