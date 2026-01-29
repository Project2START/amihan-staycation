import { PiImageBrokenThin } from "react-icons/pi";

interface IImageBroken {
  style?: string;
  iconStyle?: string;
}

export default function ImageBroken({ style, iconStyle }: IImageBroken) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg shadow-lg ${style}`}
    >
      <span className={iconStyle}>
        <PiImageBrokenThin />
      </span>
    </div>
  );
}
