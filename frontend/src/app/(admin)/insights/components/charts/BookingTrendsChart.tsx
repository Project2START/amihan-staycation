import { formatMoney } from "@/app/shared/lib/formatMoney";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BookingTrendDatum } from "../../lib/insights.types";

interface BookingTrendsChartProps {
  data: BookingTrendDatum[];
  xAxisLabel: string;
  yMax: number;
  yTickStep: number;
}

type DisplayTrendPoint = {
  x: number;
  key: string;
  label: string;
  tooltipLabel: string;
  value: number | null;
  isPlaceholder: boolean;
};

export default function BookingTrendsChart({
  data,
  xAxisLabel,
  yMax,
  yTickStep,
}: BookingTrendsChartProps) {
  const minimumVisibleSlots = 7;
  const placeholderCount = Math.max(0, minimumVisibleSlots - data.length);
  const displayData: DisplayTrendPoint[] = [
    ...data.map((item, index) => ({
      x: index,
      key: item.key,
      label: item.label,
      tooltipLabel: item.tooltipLabel,
      value: item.value,
      isPlaceholder: false,
    })),
    ...Array.from({ length: placeholderCount }).map((_, index) => ({
      x: data.length + index,
      key: `placeholder-${index}`,
      label: "",
      tooltipLabel: "",
      value: null,
      isPlaceholder: true,
    })),
  ];

  const tickLabelByIndex = new Map(
    displayData.map((item) => [item.x, item.label]),
  );
  const xTicks = displayData.map((item) => item.x);

  return (
    <div className="mt-4">
      <h3 className="text-secondary-normal text-[1rem] mb-2">Booking Trends</h3>
      <div className="overflow-x-auto border border-secondary-normal/15 rounded-lg p-2">
        <div
          className="flex items-stretch gap-1"
          style={{
            width: `${Math.max(660, Math.max(displayData.length, 3) * 110)}px`,
            height: 325,
          }}
        >
          <div className="flex w-8 shrink-0 items-center justify-center">
            <span className="-rotate-90 whitespace-nowrap text-[0.75rem] text-gray-500">
              Sales (₱)
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={displayData}
                margin={{ top: 16, right: 8, left: 0, bottom: 26 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[0, Math.max(displayData.length - 1, 0)]}
                  ticks={xTicks}
                  tickMargin={10}
                  padding={{ left: 0, right: 0 }}
                  tickFormatter={(value) =>
                    tickLabelByIndex.get(Number(value)) ?? ""
                  }
                />
                <YAxis
                  width={78}
                  domain={[0, yMax]}
                  ticks={Array.from(
                    { length: Math.floor(yMax / yTickStep) + 1 },
                    (_, i) => i * yTickStep,
                  )}
                  tickFormatter={(value) =>
                    formatMoney(value as number, { symbol: "₱", decimals: 0 })
                  }
                />
                <Tooltip
                  labelFormatter={(_, payload) => {
                    const current = payload?.[0]?.payload as
                      | DisplayTrendPoint
                      | undefined;
                    return current?.isPlaceholder
                      ? ""
                      : (current?.tooltipLabel ?? "");
                  }}
                  formatter={(value, _, payload) => {
                    const current = payload?.payload as
                      | DisplayTrendPoint
                      | undefined;
                    if (!current || current.isPlaceholder || value === null) {
                      return ["", ""];
                    }

                    return [
                      formatMoney(Number(value), {
                        symbol: "₱",
                        decimals: 2,
                      }),
                      "Revenue",
                    ];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#5BB8D4"
                  strokeWidth={2}
                  dot={(dotProps) => {
                    const point = dotProps.payload as DisplayTrendPoint;
                    if (point.isPlaceholder) {
                      return <></>;
                    }

                    return (
                      <circle
                        cx={dotProps.cx}
                        cy={dotProps.cy}
                        r={3}
                        fill="#5BB8D4"
                        stroke="#5BB8D4"
                      />
                    );
                  }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <p className="text-center mt-2 text-[0.8rem] text-gray-500">
        {xAxisLabel}
      </p>
    </div>
  );
}
