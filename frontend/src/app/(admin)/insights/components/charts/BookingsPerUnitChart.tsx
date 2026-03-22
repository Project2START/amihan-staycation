import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BookingsPerUnitDatum } from "../../lib/insights.types";

interface BookingsPerUnitChartProps {
  data: BookingsPerUnitDatum[];
  yMax: number;
  yTickStep: number;
}

export default function BookingsPerUnitChart({
  data,
  yMax,
  yTickStep,
}: BookingsPerUnitChartProps) {
  const hasRealData = data.some((item) => !item.isPlaceholder);
  const minimumVisibleSlots = 6;
  const displayData = hasRealData
    ? [
        ...data,
        ...Array.from({
          length: Math.max(0, minimumVisibleSlots - data.length),
        }).map((_, index) => ({
          name: `placeholder-${index}`,
          value: 0,
          color: "#227E98",
          isPlaceholder: true,
        })),
      ]
    : data;

  return (
    <div className="mt-6">
      <h3 className="text-secondary-normal text-[1rem] mb-2">
        Bookings Per Unit
      </h3>
      <div className="overflow-x-auto border border-secondary-normal/15 rounded-lg p-2">
        <div
          className="flex items-stretch gap-1 min-w-[620px] w-full"
          style={{
            minWidth: `${Math.max(620, Math.max(displayData.length, 3) * 110)}px`,
            height: 325,
          }}
        >
          <div className="flex w-8 shrink-0 items-center justify-center">
            <span className="-rotate-90 whitespace-nowrap text-[0.75rem] text-gray-500">
              Bookings
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayData}
                margin={{ top: 16, right: 8, left: 0, bottom: 26 }}
                barCategoryGap="18%"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickMargin={10}
                  interval={0}
                  padding={{ left: 0, right: 0 }}
                  tick={
                    hasRealData
                      ? (props) => {
                          const { x, y, payload, index } = props;
                          const currentDatum = displayData[index];
                          if (!currentDatum || currentDatum.isPlaceholder) {
                            return null;
                          }

                          const color = currentDatum.color ?? "#225E98";
                          return (
                            <text
                              x={x}
                              y={Number(y) + 16}
                              textAnchor="middle"
                              fill={color}
                              fontWeight={700}
                              fontSize={13}
                            >
                              {payload.value}
                            </text>
                          );
                        }
                      : false
                  }
                />
                <YAxis
                  width={56}
                  domain={[0, yMax]}
                  ticks={Array.from(
                    { length: Math.floor(yMax / yTickStep) + 1 },
                    (_, i) => i * yTickStep,
                  )}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    const currentDatum = payload?.[0]?.payload as
                      | BookingsPerUnitDatum
                      | undefined;

                    if (
                      !active ||
                      !currentDatum ||
                      currentDatum.isPlaceholder
                    ) {
                      return null;
                    }

                    return (
                      <div className="rounded-md border border-secondary-normal/15 bg-white px-3 py-2 text-[0.85rem] shadow-md">
                        <p className="font-semibold text-secondary-normal">
                          {currentDatum.name}
                        </p>
                        <p className="text-gray-600">
                          Bookings: {currentDatum.value}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" barSize={48} maxBarSize={48}>
                  {displayData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.color}
                      fillOpacity={entry.isPlaceholder ? 0 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <p className="text-center mt-2 text-[0.8rem] text-gray-500">Unit Name</p>
    </div>
  );
}
