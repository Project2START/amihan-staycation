import Image from "next/image";
interface IUnitImageProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

export default function UnitImage({
  src,
  width = 10,
  height = 6,
  alt = "Amihan Staycation Unit Image",
}: IUnitImageProps) {
  return (
    <div
      style={{
        width: `${width}rem`,
        height: `${height}rem`,
      }}
      className="relative rounded-lg"
    >
      <Image
        src={src}
        fill
        className="object-cover object-center rounded-lg"
        alt={alt}
      />
    </div>
  );
}
