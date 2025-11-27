import Image from "next/image";
import Link from "next/link";

interface ImageMainLogoProps {
  width?: number;
  height?: number;
  alt?: string;
}

export default function ImageMainLogo({
  width = 48,
  height = 48,
  alt = "Amihan Staycation main logo",
}: ImageMainLogoProps) {
  return (
    <div className="w-max">
      <Link href={"/"}>
        <Image
          src="/images/amihan-staycation-mainLogo.png"
          alt={alt}
          width={width}
          height={height}
          priority
        />
      </Link>
    </div>
  );
}
