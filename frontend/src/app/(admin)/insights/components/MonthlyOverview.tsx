"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MonthlyOverviewProps {
  monthYear: string;
}

import { bookingTrendsData, bookingsPerUnitData, COLORS } from "../lib/chartsData";

export default function MonthlyOverview({ monthYear }: MonthlyOverviewProps) {
  return (
    <div className="space-y-6 mb-8">
      {/* Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Overview</h3>
        <p className="text-gray-600 mb-4">
          Your insights for <span className="font-semibold">{monthYear}</span> are ready. Track your property's performance and optimize your pricing strategy.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Revenue growth of 15% from last month</li>
          <li>Average guest rating: 4.8/5 stars</li>
          <li>Most popular booking length: 3-4 days</li>
          <li>Peak booking day: Weekends</li>
        </ul>
      </div>

      {/* Booking Trends Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Booking Trends</h4>
        <div className="w-full h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={bookingTrendsData}
              margin={{ top: 5, right: 30, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#9CA3AF"
                fontSize={12}
                label={{
                  value: "Day of the Month",
                  position: "insideBottomRight",
                  offset: -15,
                  fill: "#6B7280",
                  fontSize: 12,
                }}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `$${(value as number / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value) => `$${(value as number).toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: "12px",
                }}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#0B8AC7"
                dot={{ fill: "#0B8AC7", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bookings Per Unit Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Bookings Per Unit</h4>
        <div className="w-full h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookingsPerUnitData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {bookingsPerUnitData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
