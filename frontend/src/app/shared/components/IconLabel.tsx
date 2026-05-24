import RenderIcon from "@/app/shared/ui/RenderIcon";
import clsx from "clsx";

interface IconLabelProps {
  iconId: string;
  name: string;
  quantity?: number;
  className?: string; // allows parent extension
}

export default function IconLabel({
  iconId,
  name,
  quantity,
  className,
}: IconLabelProps) {
  return (
    <div
      className={clsx(
        "border border-secondary-normal/50 rounded-lg p-[0.5rem] flex items-center gap-x-1",
        className,
      )}
    >
      <span className="text-base">
        <RenderIcon iconId={iconId} />
      </span>
      {quantity && quantity > 0 ? <span>{quantity}</span> : null}

      <span>{name}</span>
    </div>
  );
}
