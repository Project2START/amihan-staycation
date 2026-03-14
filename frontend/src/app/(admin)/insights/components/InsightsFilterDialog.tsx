import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import { MODE_LABELS } from "../lib/insights.utils";
import { ViewMode } from "../lib/insights.types";

interface InsightsFilterDialogProps {
  open: boolean;
  pendingMode: ViewMode;
  pendingStart: string;
  pendingEnd: string;
  startDateError?: string;
  endDateError?: string;
  onClose: () => void;
  onModeChange: (mode: ViewMode) => void;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onApply: () => void;
}

export default function InsightsFilterDialog({
  open,
  pendingMode,
  pendingStart,
  pendingEnd,
  startDateError,
  endDateError,
  onClose,
  onModeChange,
  onStartChange,
  onEndChange,
  onApply,
}: InsightsFilterDialogProps) {
  return (
    <DialogBaseContent openDialog={open} onCloseDialog={onClose}>
      <div className="p-4 text-secondary-normal">
        <h3 className="font-bold text-center text-[1.05rem] mb-3">
          Filter Insights View
        </h3>

        <div className="space-y-2">
          {(Object.keys(MODE_LABELS) as ViewMode[]).map((mode) => (
            <label key={mode} className="flex items-center gap-2 text-[0.9rem]">
              <input
                type="radio"
                name="view-mode"
                value={mode}
                checked={pendingMode === mode}
                onChange={() => onModeChange(mode)}
                className="accent-secondary-normal"
              />
              <span>{MODE_LABELS[mode]}</span>
            </label>
          ))}
        </div>

        {pendingMode === "custom" && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <label className="text-[0.75rem] opacity-75">Start Date</label>
              <input
                type="date"
                value={pendingStart}
                onChange={(e) => onStartChange(e.target.value)}
                max={pendingEnd || undefined}
                className={`w-full border-2 rounded-lg p-2 text-[0.85rem] ${
                  startDateError
                    ? "border-reject-normal"
                    : "border-secondary-normal/30"
                }`}
              />
              {startDateError ? (
                <p className="mt-1 text-[0.75rem] text-reject-normal">
                  {startDateError}
                </p>
              ) : null}
            </div>
            <div>
              <label className="text-[0.75rem] opacity-75">End Date</label>
              <input
                type="date"
                value={pendingEnd}
                onChange={(e) => onEndChange(e.target.value)}
                min={pendingStart || undefined}
                className={`w-full border-2 rounded-lg p-2 text-[0.85rem] ${
                  endDateError
                    ? "border-reject-normal"
                    : "border-secondary-normal/30"
                }`}
              />
              {endDateError ? (
                <p className="mt-1 text-[0.75rem] text-reject-normal">
                  {endDateError}
                </p>
              ) : null}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg border border-secondary-normal/30 text-[0.85rem]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onApply}
            className="px-3 py-2 rounded-lg bg-secondary-normal text-white text-[0.85rem]"
          >
            Apply
          </button>
        </div>
      </div>
    </DialogBaseContent>
  );
}
