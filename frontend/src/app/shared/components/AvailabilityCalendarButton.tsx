"use client";

import { useState } from "react";
import { LuCalendarDays } from "react-icons/lu";
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
        className={`fixed ${bottomClassName} right-3 w-11 h-11 rounded-full bg-primary-normal text-white flex items-center justify-center shadow-xl cursor-pointer z-50`}
        aria-label="View availability calendar"
      >
        <LuCalendarDays size={22} />
      </button>

      <DialogBaseContent
        openDialog={openDialog}
        onCloseDialog={handleClose}
        enableClickOutside={true}
        scrollVertically={true}
      >
        <div className="p-[1rem] text-secondary-normal text-xs">
          <h2 className="text-center font-bold text-sm mb-[0.75rem]">
            Availability Calendar
          </h2>

          {/* Search input */}
          <input
            type="text"
            placeholder="Search unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-2 rounded-lg border-secondary-normal/30 p-[0.5rem] mb-[0.75rem] input-base-focus"
          />

          {/* Unit radio list */}
          <div className="max-h-[8rem] overflow-y-auto mb-[0.75rem] border rounded-lg border-secondary-normal/15 p-[0.5rem]">
            {isUnitsLoading ? (
              <div className="flex flex-col gap-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[1.5rem] w-full animate-pulse rounded bg-secondary-normal/10"
                  />
                ))}
              </div>
            ) : (
              <>
                {/* All Units option — always shown unless search filters it */}
                {"all units".includes(searchQuery.toLowerCase()) && (
                  <label className="flex items-center gap-x-2 py-[0.35rem] px-[0.25rem] cursor-pointer hover:bg-secondary-normal/5 rounded">
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
                      className="flex items-center gap-x-2 py-[0.35rem] px-[0.25rem] cursor-pointer hover:bg-secondary-normal/5 rounded"
                    >
                      <input
                        type="radio"
                        name="unit-selection"
                        checked={selectedUnit === unit.id}
                        onChange={() => handleUnitChange(unit.id)}
                        className="accent-primary-normal"
                      />
                      <span>{unit.name}</span>
                    </label>
                  ))
                )}
              </>
            )}
          </div>

          {/* Calendar */}
          <div className="flex justify-center mt-[1.5rem]">
            {isCalendarLoading ? (
              <div className="bg-white p-[1.5rem] rounded-lg overflow-hidden min-w-0 w-full">
                <div className="h-[16rem] w-full animate-pulse rounded-md bg-secondary-normal/10" />
              </div>
            ) : (
              <CalendarBooking
                hasPresets={false}
                readOnly={true}
                disabledDates={disabledDates}
                defaultValue={[null, null]}
                onCalendarChange={() => {
                  // Read-only calendar — no action needed on date selection
                }}
              />
            )}
          </div>
        </div>
      </DialogBaseContent>
    </>
  );
}
