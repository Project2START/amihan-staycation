"use client";

import { useState } from "react";
import { LuCalendarDays } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import DialogBaseContent from "../ui/DialogBaseContent";
import CalendarBooking from "./CalendarBooking";

const GET_UNITS_BY_ROLE = gql`
  query GetUnitsByRole {
    unitsByRole {
      id
      name
    }
  }
`;

const GET_BOOKED_DATES = gql`
  query GetBookedDatesByProduct($productId: String!) {
    bookedDatesByProduct(productId: $productId)
  }
`;

const GET_BOOKED_DATES_ALL = gql`
  query GetBookedDatesByAllProducts {
    bookedDatesByAllProducts
  }
`;

interface Unit {
  id: string;
  name: string;
}

const ALL_UNITS_VALUE = "__all__";

export default function AvailabilityCalendarButton({
  bottomClassName = "bottom-20",
}: {
  bottomClassName?: string;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>(ALL_UNITS_VALUE);
  const [searchQuery, setSearchQuery] = useState("");
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [isUnitsLoading, setIsUnitsLoading] = useState(false);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  const [fetchUnits] = useLazyQuery<{ unitsByRole: Unit[] }>(
    GET_UNITS_BY_ROLE,
    { fetchPolicy: "network-only" },
  );

  const [fetchBookedDates] = useLazyQuery<{
    bookedDatesByProduct: string[];
  }>(GET_BOOKED_DATES, { fetchPolicy: "network-only" });

  const [fetchAllBookedDates] = useLazyQuery<{
    bookedDatesByAllProducts: string[];
  }>(GET_BOOKED_DATES_ALL, { fetchPolicy: "network-only" });

  const loadDatesForUnit = async (unitId: string) => {
    setIsCalendarLoading(true);
    try {
      if (unitId === ALL_UNITS_VALUE) {
        const { data } = await fetchAllBookedDates();
        setDisabledDates(
          (data?.bookedDatesByAllProducts ?? []).map((d) => new Date(d)),
        );
      } else {
        const { data } = await fetchBookedDates({
          variables: { productId: unitId },
        });
        setDisabledDates(
          (data?.bookedDatesByProduct ?? []).map((d) => new Date(d)),
        );
      }
    } finally {
      setIsCalendarLoading(false);
    }
  };

  const handleOpen = async () => {
    setOpenDialog(true);
    setSearchQuery("");
    setSelectedUnit(ALL_UNITS_VALUE);
    setIsUnitsLoading(true);

    try {
      const { data } = await fetchUnits();
      setUnits(data?.unitsByRole ?? []);
    } finally {
      setIsUnitsLoading(false);
    }

    // Load "All Units" dates by default
    await loadDatesForUnit(ALL_UNITS_VALUE);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleUnitChange = async (unitId: string) => {
    setSelectedUnit(unitId);
    await loadDatesForUnit(unitId);
  };

  const filteredUnits = units.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <button
        onClick={handleOpen}
        className={`fixed ${bottomClassName} right-3 w-11 h-11 rounded-full bg-primary-normal text-white flex items-center justify-center shadow-xl cursor-pointer z-50 md:hidden`}
        aria-label="View availability calendar"
      >
        <LuCalendarDays size={22} />
      </button>

      <button
        onClick={handleOpen}
        className="hidden md:flex fixed bottom-6 right-5 lg:right-7 h-11 lg:h-12 items-center gap-2 px-4 lg:px-5 rounded-xl bg-primary-normal text-white border border-primary-normal shadow-xl hover:bg-primary-dark transition-colors cursor-pointer z-50 hover-animation lg:hover:bg-primary-normal/90"
        aria-label="View availability calendar"
      >
        <LuCalendarDays size={20} />
        <span className="text-sm lg:text-base font-semibold">Availability</span>
      </button>

      <DialogBaseContent
        openDialog={openDialog}
        onCloseDialog={handleClose}
        enableClickOutside={true}
        scrollVertically={true}
        contentClassName="md:!w-[min(90vw,980px)] md:!max-h-[85vh] md:overflow-x-hidden"
      >
        <div className="p-[1rem] md:p-6 lg:p-7 text-secondary-normal text-xs md:text-sm lg:text-base md:w-full overflow-x-hidden">
          <div className="flex items-center justify-between mb-[0.75rem] md:mb-5 lg:mb-6">
            <h2 className="text-center md:text-left font-bold text-sm md:text-lg lg:text-xl">
              Availability Calendar
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-1.5 text-secondary-normal/70 hover:bg-secondary-normal/10 hover:text-secondary-normal transition-colors"
              aria-label="Close availability calendar"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          <div className="md:grid md:grid-cols-1 lg:grid-cols-[280px,1fr] md:gap-6 lg:gap-7">
            <div className="md:rounded-xl md:border md:border-secondary-normal/10 md:bg-white md:p-4 lg:p-5">
              <div className="hidden md:block mb-3">
                <h3 className="text-sm lg:text-base font-semibold">Units</h3>
                <p className="text-xs lg:text-sm text-secondary-normal/60 mt-0.5">
                  Select a unit to view booked dates.
                </p>
              </div>

              {/* Search input */}
              <input
                type="text"
                placeholder="Search unit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 rounded-lg border-secondary-normal/30 p-[0.5rem] mb-[0.75rem] md:mb-3 input-base-focus"
              />

              {/* Unit radio list */}
              <div className="max-h-[8rem] md:max-h-[22rem] overflow-y-auto mb-[0.75rem] md:mb-0 border rounded-lg border-secondary-normal/15 p-[0.5rem]">
                {isUnitsLoading ? (
                  <div className="flex flex-col gap-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-[1.5rem] md:h-[1.75rem] w-full animate-pulse rounded bg-secondary-normal/10"
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    {/* All Units option — always shown unless search filters it */}
                    {"all units".includes(searchQuery.toLowerCase()) && (
                      <label className="flex items-center gap-x-2 py-[0.35rem] px-[0.25rem] cursor-pointer hover:bg-secondary-normal/5 rounded md:py-2">
                        <input
                          type="radio"
                          name="unit-selection"
                          checked={selectedUnit === ALL_UNITS_VALUE}
                          onChange={() => handleUnitChange(ALL_UNITS_VALUE)}
                          className="accent-primary-normal"
                        />
                        <span className="font-bold">All Units</span>
                      </label>
                    )}

                    {filteredUnits.length === 0 &&
                    !"all units".includes(searchQuery.toLowerCase()) ? (
                      <p className="text-center opacity-50 py-[0.5rem]">
                        No units found
                      </p>
                    ) : (
                      filteredUnits.map((unit) => (
                        <label
                          key={unit.id}
                          className="flex items-center gap-x-2 py-[0.35rem] px-[0.25rem] cursor-pointer hover:bg-secondary-normal/5 rounded md:py-2"
                        >
                          <input
                            type="radio"
                            name="unit-selection"
                            checked={selectedUnit === unit.id}
                            onChange={() => handleUnitChange(unit.id)}
                            className="accent-primary-normal"
                          />
                          <span className="truncate">{unit.name}</span>
                        </label>
                      ))
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="md:rounded-xl md:border md:border-secondary-normal/10 md:bg-white md:p-4 lg:p-5 min-w-0">
              <div className="hidden md:block mb-3">
                <h3 className="text-sm lg:text-base font-semibold">
                  Booked Dates
                </h3>
                <p className="text-xs lg:text-sm text-secondary-normal/60 mt-0.5">
                  Read-only calendar of unavailable dates.
                </p>
              </div>

              {/* Calendar */}
              <div className="flex justify-center mt-[1.5rem] md:mt-0 min-w-0 overflow-x-hidden">
                {isCalendarLoading ? (
                  <div className="bg-white rounded-lg overflow-hidden min-w-0 w-full">
                    <div className="h-[16rem] md:h-[22rem] lg:h-[24rem] w-full animate-pulse rounded-md bg-secondary-normal/10" />
                  </div>
                ) : (
                  <div className="w-full overflow-x-hidden flex justify-center">
                    <CalendarBooking
                      hasPresets={false}
                      readOnly={true}
                      disabledDates={disabledDates}
                      defaultValue={[null, null]}
                      onCalendarChange={() => {
                        // Read-only calendar — no action needed on date selection
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogBaseContent>
    </>
  );
}
