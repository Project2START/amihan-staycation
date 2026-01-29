"use client";
import { MdArrowBackIos } from "react-icons/md";

export default function PrimaryBackButton({
  style = "",
  onClick,
}: {
  style?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={() => onClick()}>
      <span className={style}>
        <MdArrowBackIos />
      </span>
    </button>
  );
}
