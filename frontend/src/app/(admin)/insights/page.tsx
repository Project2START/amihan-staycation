"use client";

import { useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import dayjs, { Dayjs } from "dayjs";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import {
  LuCalendarDays,
  LuCircleDollarSign,
  LuDoorOpen,
  LuDownload,
  LuFilter,
  LuLoaderCircle,
  LuUsers,
} from "react-icons/lu";
import { formatMoney } from "@/app/shared/lib/formatMoney";
import NavigationBottom from "../components/NavigationBottom";
import InsightsHeader from "./components/InsightsHeader";
import InsightsDateNavigator from "./components/InsightsDateNavigator";
import InsightsSummaryCards from "./components/InsightsSummaryCards";
import InsightsOverviewSection from "./components/InsightsOverviewSection";
import InsightsFilterDialog from "./components/InsightsFilterDialog";
import InsightsBookingsSection from "./components/InsightsBookingsSection";
import {
  GET_ADMIN_INSIGHTS_BOOKINGS,
  IGetAdminInsightsBookings,
} from "./lib/insights-queries";
import { ViewMode } from "./lib/insights.types";
import {
  ALL_BOOKING_STATUSES,
  buildBookingTrendData,
  buildBookingsPerUnitData,
  computeOccupancyStats,
  computeMetrics,
  filterBookingsByRange,
  filterCheckedOutBookings,
  getCurrentRange,
  getRevenueChartMax,
  getYAxisStep,
} from "./lib/insights.utils";

type FilterErrors = {
  startDate?: string;
  endDate?: string;
};

function InsightsLoadingState() {
  return (
    <div className="mt-[1rem] space-y-4 lg:mt-5">
      <div className="lg:hidden space-y-4">
        <div className="h-[8rem] rounded-xl bg-secondary-normal/10 animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-[8rem] rounded-xl bg-secondary-normal/10 animate-pulse" />
          <div className="h-[8rem] rounded-xl bg-secondary-normal/10 animate-pulse" />
        </div>
        <div className="h-[8rem] rounded-xl bg-secondary-normal/10 animate-pulse" />
      </div>

      <div className="hidden lg:block lg:space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="h-[7.5rem] rounded-xl bg-secondary-normal/10 animate-pulse" />
          <div className="h-[7.5rem] rounded-xl bg-secondary-normal/10 animate-pulse" />
          <div className="h-[7.5rem] rounded-xl bg-secondary-normal/10 animate-pulse" />
          <div className="h-[7.5rem] rounded-xl bg-secondary-normal/10 animate-pulse" />
        </div>

        <div className="grid grid-cols-[300px_minmax(0,1fr)] gap-6">
          <div className="space-y-4 rounded-2xl border border-secondary-normal/10 bg-white p-4 shadow-sm">
            <div className="h-[8rem] rounded-xl bg-secondary-normal/10 animate-pulse" />
            <div className="h-[14rem] rounded-xl bg-secondary-normal/10 animate-pulse" />
          </div>

          <div className="space-y-4">
            <div className="h-[22rem] rounded-2xl bg-secondary-normal/10 animate-pulse" />
            <div className="h-[22rem] rounded-2xl bg-secondary-normal/10 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [anchorDate, setAnchorDate] = useState<Dayjs>(dayjs());
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [pendingMode, setPendingMode] = useState<ViewMode>("monthly");
  const [pendingStart, setPendingStart] = useState<string>("");
  const [pendingEnd, setPendingEnd] = useState<string>("");
  const [filterErrors, setFilterErrors] = useState<FilterErrors>({});
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const pdfTargetRef = useRef<HTMLDivElement>(null);

  const { data, loading } = useQuery<IGetAdminInsightsBookings>(
    GET_ADMIN_INSIGHTS_BOOKINGS,
    { fetchPolicy: "network-only" },
  );

  const currentRange = useMemo(
    () => getCurrentRange(viewMode, anchorDate, customStart, customEnd),
    [viewMode, anchorDate, customStart, customEnd],
  );

  const checkedOutBookings = useMemo(() => {
    return filterCheckedOutBookings(data?.bookingsByAdmin ?? [], currentRange);
  }, [data?.bookingsByAdmin, currentRange]);

  const totalUnits = useMemo(() => {
    const unitsByRoleCount = data?.unitsByRole?.length ?? 0;
    if (unitsByRoleCount > 0) {
      return unitsByRoleCount;
    }

    const fallbackUniqueUnitIds = new Set(
      (data?.bookingsByAdmin ?? [])
        .map((booking) => booking.product?.id)
        .filter((id): id is string => Boolean(id)),
    );

    return fallbackUniqueUnitIds.size;
  }, [data?.unitsByRole, data?.bookingsByAdmin]);

  const occupancyStats = useMemo(() => {
    return computeOccupancyStats(
      data?.bookingsByAdmin ?? [],
      currentRange,
      totalUnits,
    );
  }, [data?.bookingsByAdmin, currentRange, totalUnits]);

  const metrics = useMemo(() => {
    const base = computeMetrics(checkedOutBookings);

    return {
      ...base,
      occupancyRate: occupancyStats.occupancyRate,
    };
  }, [checkedOutBookings, occupancyStats.occupancyRate]);

  const bookingTrendData = useMemo(() => {
    return buildBookingTrendData(checkedOutBookings, currentRange, viewMode);
  }, [checkedOutBookings, currentRange, viewMode]);

  const bookingsPerUnitData = useMemo(() => {
    return buildBookingsPerUnitData(checkedOutBookings);
  }, [checkedOutBookings]);

  const revenueMax = useMemo(() => {
    const max = Math.max(...bookingTrendData.map((item) => item.value), 0);
    return getRevenueChartMax(max);
  }, [bookingTrendData]);

  const bookingsPerUnitMax = useMemo(() => {
    const max = Math.max(...bookingsPerUnitData.map((item) => item.value), 0);
    return Math.max(20, Math.ceil(max / 5) * 5);
  }, [bookingsPerUnitData]);

  const bookingsInRange = useMemo(() => {
    return filterBookingsByRange(data?.bookingsByAdmin ?? [], currentRange);
  }, [data?.bookingsByAdmin, currentRange]);

  const revenueTickStep = getYAxisStep(revenueMax, 5000);
  const bookingTickStep = getYAxisStep(bookingsPerUnitMax, 5);

  const handlePrevious = () => {
    if (viewMode === "custom" && customStart && customEnd) {
      const start = dayjs(customStart);
      const end = dayjs(customEnd);
      const diff = end.diff(start, "day") + 1;
      setCustomStart(start.subtract(diff, "day").format("YYYY-MM-DD"));
      setCustomEnd(end.subtract(diff, "day").format("YYYY-MM-DD"));
      return;
    }

    const unit =
      viewMode === "yearly"
        ? "year"
        : viewMode === "weekly"
          ? "week"
          : viewMode === "daily"
            ? "day"
            : "month";

    setAnchorDate((prev) => prev.subtract(1, unit));
  };

  const handleNext = () => {
    if (viewMode === "custom" && customStart && customEnd) {
      const start = dayjs(customStart);
      const end = dayjs(customEnd);
      const diff = end.diff(start, "day") + 1;
      setCustomStart(start.add(diff, "day").format("YYYY-MM-DD"));
      setCustomEnd(end.add(diff, "day").format("YYYY-MM-DD"));
      return;
    }

    const unit =
      viewMode === "yearly"
        ? "year"
        : viewMode === "weekly"
          ? "week"
          : viewMode === "daily"
            ? "day"
            : "month";

    setAnchorDate((prev) => prev.add(1, unit));
  };

  const openFilter = () => {
    setPendingMode(viewMode);
    setPendingStart(customStart);
    setPendingEnd(customEnd);
    setFilterErrors({});
    setOpenFilterDialog(true);
  };

  const handlePendingModeChange = (mode: ViewMode) => {
    setPendingMode(mode);
    setFilterErrors({});

    if (mode === "custom" && !pendingStart && !pendingEnd) {
      const today = dayjs().format("YYYY-MM-DD");
      setPendingStart(today);
      setPendingEnd(today);
    }
  };

  const handlePendingStartChange = (value: string) => {
    setPendingStart(value);
    setFilterErrors((prev) => ({ ...prev, startDate: undefined }));
  };

  const handlePendingEndChange = (value: string) => {
    setPendingEnd(value);
    setFilterErrors((prev) => ({ ...prev, endDate: undefined }));
  };

  const applyFilter = () => {
    if (pendingMode === "custom") {
      const nextErrors: FilterErrors = {};

      if (!pendingStart || !pendingEnd) {
        if (!pendingStart) {
          nextErrors.startDate = "Start date is required.";
        }
        if (!pendingEnd) {
          nextErrors.endDate = "End date is required.";
        }
      }

      if (
        pendingStart &&
        pendingEnd &&
        dayjs(pendingEnd).isBefore(dayjs(pendingStart), "day")
      ) {
        nextErrors.endDate = "End date cannot be earlier than start date.";
      }

      if (Object.keys(nextErrors).length > 0) {
        setFilterErrors(nextErrors);
        return;
      }
    }

    setFilterErrors({});
    setViewMode(pendingMode);
    setCustomStart(pendingStart);
    setCustomEnd(pendingEnd);
    setOpenFilterDialog(false);
  };

  const exportAsPdf = async () => {
    if (!pdfTargetRef.current) return;

    setExportingPdf(true);
    // Let React paint the loading indicator before starting heavy image/PDF work.
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    try {
      const dataUrl = await toPng(pdfTargetRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        skipFonts: false,
      });

      const formatReportMoney = (amount: number) =>
        `PHP ${formatMoney(amount, { decimals: 2 })}`;

      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () =>
          reject(new Error("Failed to render insights image for PDF export."));
        image.src = dataUrl;
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (image.height * imgWidth) / image.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pageMarginX = 12;
      const pageMarginTop = 12;
      const pageMarginBottom = 12;
      const contentWidth = pageWidth - pageMarginX * 2;
      const lineHeight = 5;

      let cursorY = pageMarginTop;

      const beginReportPage = () => {
        pdf.addPage();
        cursorY = pageMarginTop;

        pdf.setFillColor(11, 81, 115);
        pdf.rect(0, 0, pageWidth, 18, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text("Insights Summary Report", pageMarginX, 11.5);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.text(
          dayjs().format("MMMM D, YYYY h:mm A"),
          pageWidth - pageMarginX,
          11.5,
          {
            align: "right",
          },
        );
        pdf.setTextColor(35, 35, 35);
        cursorY = 26;
      };

      const ensureSpace = (height: number) => {
        if (cursorY + height > pageHeight - pageMarginBottom) {
          beginReportPage();
        }
      };

      const drawSectionTitle = (text: string) => {
        ensureSpace(11);
        pdf.setFillColor(229, 239, 244);
        pdf.roundedRect(pageMarginX, cursorY, contentWidth, 8, 1, 1, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(11, 81, 115);
        pdf.text(text, pageMarginX + 3, cursorY + 5.5);
        pdf.setTextColor(35, 35, 35);
        cursorY += 11;
      };

      const drawLabelValue = (label: string, value: string) => {
        ensureSpace(6);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9.5);
        const labelText = `${label}:`;
        pdf.text(labelText, pageMarginX, cursorY);
        pdf.setFont("helvetica", "normal");
        const valueOffset = Math.max(36, pdf.getTextWidth(labelText) + 4);
        pdf.text(value, pageMarginX + valueOffset, cursorY);
        cursorY += 6;
      };

      const drawMetricCard = (
        x: number,
        y: number,
        width: number,
        title: string,
        value: string,
      ) => {
        pdf.setDrawColor(218, 226, 232);
        pdf.setFillColor(249, 251, 252);
        pdf.roundedRect(x, y, width, 17, 1.5, 1.5, "FD");
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8.5);
        pdf.setTextColor(100, 100, 100);
        pdf.text(title, x + 3, y + 5.5);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(11, 81, 115);
        pdf.text(value, x + 3, y + 12.2);
        pdf.setTextColor(35, 35, 35);
      };

      const drawTableHeader = (leftTitle: string, rightTitle: string) => {
        ensureSpace(8);
        pdf.setFillColor(236, 241, 245);
        pdf.rect(pageMarginX, cursorY, contentWidth, 7, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 60);
        pdf.text(leftTitle, pageMarginX + 2, cursorY + 4.8);
        pdf.text(rightTitle, pageWidth - pageMarginX - 2, cursorY + 4.8, {
          align: "right",
        });
        pdf.setTextColor(35, 35, 35);
        cursorY += 7;
      };

      const drawTableRow = (
        left: string,
        right: string,
        rowIndex: number,
        leftWrapWidth: number,
      ) => {
        const leftLines = pdf.splitTextToSize(left, leftWrapWidth) as string[];
        const rowHeight = Math.max(6, leftLines.length * lineHeight);
        ensureSpace(rowHeight);

        if (rowIndex % 2 === 0) {
          pdf.setFillColor(250, 252, 253);
          pdf.rect(pageMarginX, cursorY - 0.5, contentWidth, rowHeight, "F");
        }

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        leftLines.forEach((line, idx) => {
          pdf.text(line, pageMarginX + 2, cursorY + idx * lineHeight + 4.3);
        });
        pdf.setFont("helvetica", "bold");
        pdf.text(right, pageWidth - pageMarginX - 2, cursorY + 4.3, {
          align: "right",
        });

        cursorY += rowHeight;
      };

      const realUnitRows = bookingsPerUnitData.filter(
        (item) => !item.isPlaceholder,
      );

      beginReportPage();

      drawSectionTitle("Report Context");
      drawLabelValue(
        "View Mode",
        viewMode === "all"
          ? "All Time"
          : viewMode.charAt(0).toUpperCase() + viewMode.slice(1),
      );
      drawLabelValue("Date Range", currentRange.label);
      drawLabelValue(
        "Occupancy Rate",
        `${occupancyStats.bookedNights} booked nights / ${occupancyStats.totalNightsAvailable} available nights x 100 = ${occupancyStats.occupancyRate}%`,
      );
      cursorY += 3;

      drawSectionTitle("Key Metrics");
      ensureSpace(40);
      const cardGap = 3;
      const cardWidth = (contentWidth - cardGap) / 2;
      drawMetricCard(
        pageMarginX,
        cursorY,
        cardWidth,
        "Total Revenue",
        formatReportMoney(metrics.totalRevenue),
      );
      drawMetricCard(
        pageMarginX + cardWidth + cardGap,
        cursorY,
        cardWidth,
        "Total Bookings",
        String(metrics.totalBookings),
      );
      drawMetricCard(
        pageMarginX,
        cursorY + 20,
        cardWidth,
        "Occupancy Rate",
        `${metrics.occupancyRate}%`,
      );
      drawMetricCard(
        pageMarginX + cardWidth + cardGap,
        cursorY + 20,
        cardWidth,
        "Guests Hosted",
        String(metrics.totalGuestsHosted),
      );
      cursorY += 41;

      drawSectionTitle("Booking Trends Detailed Rows");
      if (bookingTrendData.length === 0) {
        drawLabelValue("Status", "No trend data available for this range");
      } else {
        drawTableHeader("Date", "Revenue");
        bookingTrendData.forEach((item, index) => {
          drawTableRow(
            item.tooltipLabel,
            formatReportMoney(item.value),
            index,
            contentWidth - 42,
          );
        });
      }

      cursorY += 3;
      drawSectionTitle("Bookings Per Unit Detailed Rows");
      if (realUnitRows.length === 0) {
        drawLabelValue(
          "Status",
          "No unit booking data available for this range",
        );
      } else {
        drawTableHeader("Unit Name", "Bookings");
        realUnitRows.forEach((item, index) => {
          drawTableRow(item.name, `${item.value}`, index, contentWidth - 26);
        });
      }

      cursorY += 3;
      drawSectionTitle("Bookings by Status Summary");

      const totalBookingsInRange = bookingsInRange.length;

      if (totalBookingsInRange === 0) {
        drawLabelValue("Status", "No bookings found for the selected period");
      } else {
        drawLabelValue(
          "Total Bookings in Period",
          String(totalBookingsInRange),
        );
        drawTableHeader("Status", "Count");

        ALL_BOOKING_STATUSES.forEach((statusMeta, index) => {
          const count = bookingsInRange.filter(
            (booking) => booking.status === statusMeta.status,
          ).length;
          const percent = Math.round((count / totalBookingsInRange) * 100);

          drawTableRow(
            statusMeta.name,
            `${count} (${percent}%)`,
            index,
            contentWidth - 36,
          );
        });
      }

      pdf.save(`insights-${dayjs().format("YYYY-MM-DD")}.pdf`);
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">
      <div className="flex-1 overflow-y-auto">
        <div ref={pdfTargetRef}>
          <InsightsHeader />

          <div className="px-[1rem] pb-[1rem] lg:mx-auto lg:w-full lg:max-w-[1280px] lg:px-6 lg:pb-6">
            <div className="lg:rounded-2xl lg:border lg:border-secondary-normal/10 lg:bg-white lg:px-5 lg:py-2 lg:shadow-sm lg:mt-[1.5rem]">
              <InsightsDateNavigator
                label={currentRange.label}
                onPrevious={handlePrevious}
                onNext={handleNext}
                hideNavigation={viewMode === "all"}
                rightActions={
                  <>
                    <button
                      type="button"
                      onClick={exportAsPdf}
                      className="p-1 rounded hover:bg-secondary-normal/10 disabled:opacity-70"
                      aria-label="Export insights to PDF"
                      disabled={exportingPdf}
                    >
                      {exportingPdf ? (
                        <LuLoaderCircle className="text-[1.15rem] text-gray-500 animate-spin" />
                      ) : (
                        <LuDownload className="text-[1.15rem] text-gray-500" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={openFilter}
                      className="p-1 rounded hover:bg-secondary-normal/10"
                      aria-label="Open insights filter"
                    >
                      <LuFilter className="text-[1.15rem] text-gray-500" />
                    </button>
                  </>
                }
              />
            </div>

            {loading ? (
              <InsightsLoadingState />
            ) : (
              <>
                <div className="lg:hidden">
                  <InsightsSummaryCards metrics={metrics} />

                  <InsightsOverviewSection
                    bookingTrendData={bookingTrendData}
                    bookingsPerUnitData={bookingsPerUnitData}
                    xAxisLabel={currentRange.xAxisLabel}
                    revenueMax={revenueMax}
                    revenueTickStep={revenueTickStep}
                    bookingsPerUnitMax={bookingsPerUnitMax}
                    bookingTickStep={bookingTickStep}
                  />

                  <InsightsBookingsSection bookings={bookingsInRange} />
                </div>

                <div className="hidden lg:block lg:mt-5 lg:space-y-4">
                  <section className="grid grid-cols-4 gap-4">
                    <div className="rounded-xl p-4 shadow-lg text-white bg-secondary-normal">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#8AD34E] text-secondary-normal">
                        <LuCircleDollarSign className="text-[1rem]" />
                      </div>
                      <p className="text-[0.78rem] font-bold uppercase tracking-[0.06em] text-white">
                        Total Revenue
                      </p>
                      <p className="mt-1 text-xl font-semibold text-white">
                        {formatMoney(metrics.totalRevenue, {
                          symbol: "₱",
                          decimals: 2,
                        })}
                      </p>
                    </div>

                    <div className="rounded-xl p-4 shadow-lg text-white bg-[#227E98]">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                        <LuCalendarDays className="text-[1rem]" />
                      </div>
                      <p className="text-[0.78rem] font-bold uppercase tracking-[0.06em] text-white">
                        Total Bookings
                      </p>
                      <p className="mt-1 text-xl font-semibold text-white">
                        {metrics.totalBookings}
                      </p>
                    </div>

                    <div className="rounded-xl p-4 shadow-lg text-white bg-[#587DBD]">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                        <LuDoorOpen className="text-[1rem]" />
                      </div>
                      <p className="text-[0.78rem] font-bold uppercase tracking-[0.06em] text-white">
                        Occupancy Rate
                      </p>
                      <p className="mt-1 text-xl font-semibold text-white">
                        {metrics.occupancyRate}%
                      </p>
                    </div>

                    <div className="rounded-xl p-4 shadow-lg text-white bg-[#617A7D]">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                        <LuUsers className="text-[1rem]" />
                      </div>
                      <p className="text-[0.78rem] font-bold uppercase tracking-[0.06em] text-white">
                        Guests Hosted
                      </p>
                      <p className="mt-1 text-xl font-semibold text-white">
                        {metrics.totalGuestsHosted}
                      </p>
                    </div>
                  </section>

                  <div className="grid grid-cols-[300px_minmax(0,1fr)] gap-6 items-start">
                    <aside className="sticky top-4 space-y-4 self-start">
                      <div className="rounded-2xl border border-secondary-normal/10 bg-gradient-to-br from-[#eef6fa] to-white p-4 shadow-sm">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-secondary-normal/60">
                          Analytics Window
                        </p>
                        <p className="mt-1 text-sm font-semibold text-secondary-normal">
                          {currentRange.label}
                        </p>
                        <p className="mt-2 text-xs text-secondary-normal/75">
                          Monitor performance, demand, and guest movement for
                          the selected period.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-secondary-normal/10 bg-white p-4 shadow-sm">
                        <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-secondary-normal/60">
                          Status Snapshot
                        </h3>
                        <div className="mt-3 space-y-2">
                          {ALL_BOOKING_STATUSES.map((statusMeta) => {
                            const count = bookingsInRange.filter(
                              (booking) => booking.status === statusMeta.status,
                            ).length;

                            return (
                              <div
                                key={statusMeta.status}
                                className="flex items-center justify-between rounded-lg border border-secondary-normal/10 px-3 py-2"
                              >
                                <span className="text-xs text-secondary-normal/80">
                                  {statusMeta.name}
                                </span>
                                <span className="text-xs font-semibold text-secondary-normal">
                                  {count}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </aside>

                    <main className="space-y-4">
                      <section className="rounded-2xl border border-secondary-normal/10 bg-white p-5 shadow-sm">
                        <InsightsOverviewSection
                          bookingTrendData={bookingTrendData}
                          bookingsPerUnitData={bookingsPerUnitData}
                          xAxisLabel={currentRange.xAxisLabel}
                          revenueMax={revenueMax}
                          revenueTickStep={revenueTickStep}
                          bookingsPerUnitMax={bookingsPerUnitMax}
                          bookingTickStep={bookingTickStep}
                        />
                      </section>

                      <section className="rounded-2xl border border-secondary-normal/10 bg-white p-5 shadow-sm">
                        <InsightsBookingsSection bookings={bookingsInRange} />
                      </section>
                    </main>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <NavigationBottom />

      <InsightsFilterDialog
        open={openFilterDialog}
        pendingMode={pendingMode}
        pendingStart={pendingStart}
        pendingEnd={pendingEnd}
        startDateError={filterErrors.startDate}
        endDateError={filterErrors.endDate}
        onClose={() => {
          setFilterErrors({});
          setOpenFilterDialog(false);
        }}
        onModeChange={handlePendingModeChange}
        onStartChange={handlePendingStartChange}
        onEndChange={handlePendingEndChange}
        onApply={applyFilter}
      />
    </div>
  );
}
