import Image from "next/image";
interface IUnitImageProps {
  src: string;
  alt?: string;
  style?: string;
  sizes?: string;
}

export default function UnitImage({
  src,
  style = "w-[10rem] h-[6rem]",
  alt = "Amihan Staycation Unit Image",
  sizes = "100vw",
}: IUnitImageProps) {
  return (
    <div className={`relative rounded-lg ${style}`}>
      <Image
        src={src}
        fill
        className="object-cover object-center rounded-lg"
        alt={alt}
        sizes={sizes}
      />
    </div>
  );
}
