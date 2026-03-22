import { FaStar } from "react-icons/fa";

interface RatingProps {
  value: number; // the rating value, e.g., 4.5
  textColor?: string; // optional text color for the rating value
  starColor?: string; // optional color for the star
  className?: string; // optional extra classes for container
}

export default function Rating({
  value,
  textColor = "text-secondary-normal",
  starColor = "text-yellow-normal",
  className = "",
}: RatingProps) {
  return (
    <div
      className={`text-sm flex items-center gap-x-1 ${className} xl:text-lg`}
    >
      <span className={textColor}>{value}</span>
      <span className={`${starColor}`}>
        <FaStar />
      </span>
    </div>
  );
}
