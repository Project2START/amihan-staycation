"use client";
import { useEffect, useState } from "react";
import { ISearchUnitState } from "./SearchUnit";
import PrimaryButton from "../../ui/PrimaryButton";

interface IOccupancyProps {
  search: ISearchUnitState;
  onSetSearch: (s: Partial<ISearchUnitState>) => void;
  onSetOccupancy: (open: boolean) => void;
}

interface IOccupancyState {
  adults: number;
  children: number;
  // rooms: number;
}

type OccupancyType = keyof IOccupancyState;

export default function Occupancy({
  onSetSearch,
  search,
  onSetOccupancy,
}: IOccupancyProps) {
  const [occupancy, setOccupancy] = useState<IOccupancyState>({
    adults: 0,
    children: 0,
    // rooms: 0,
  });

  useEffect(() => {
    setOccupancy({
      adults: search.adults,
      children: search.children,
      // rooms: search.rooms,
    });
  }, [search.adults, search.children]);

  const handleIncreaseOccupancy = (field: OccupancyType) => {
    setOccupancy((occ) => ({ ...occ, [field]: occ[field] + 1 }));
  };

  const handleDecreaseOccupancy = (field: OccupancyType) => {
    setOccupancy((occ) => ({ ...occ, [field]: occ[field] - 1 }));
  };
  return (
    <div className="grid gap-y-3 p-[1rem] text-xs bg-white shadow-xl/10 rounded-xl relative lg:text-base lg:p-[1.5rem] lg:pt-[2rem]">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-bold">Adults</span>
        </div>

        <div className="w-[8.5rem] flex justify-between items-center border-1 border-gray-300 rounded p-[0.5rem]">
          <button
            disabled={occupancy.adults <= 1}
            onClick={() => handleDecreaseOccupancy("adults")}
            className="disabled:opacity-50"
          >
            <span className="text-secondary-normal text-xl">-</span>
          </button>
          <span className="text-md font-bold">{occupancy.adults}</span>
          <button
            disabled={occupancy.adults >= 10}
            onClick={() => handleIncreaseOccupancy("adults")}
            className="disabled:opacity-50"
          >
            <span className="text-secondary-normal text-xl">+</span>
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <span className="font-bold">Children</span>
        </div>

        <div className="w-[8.5rem] flex justify-between items-center border-1 border-gray-300 rounded p-[0.5rem]">
          <button
            disabled={occupancy.children <= 0}
            onClick={() => handleDecreaseOccupancy("children")}
            className="disabled:opacity-50"
          >
            <span className="text-secondary-normal text-xl">-</span>
          </button>
          <span className="text-md font-bold">{occupancy.children}</span>
          <button
            disabled={occupancy.children >= 10}
            onClick={() => handleIncreaseOccupancy("children")}
            className="disabled:opacity-50"
          >
            <span className="text-secondary-normal text-xl">+</span>
          </button>
        </div>
      </div>
      {/* <div className="flex justify-between items-center">
        <div>
          <span className="font-bold">Rooms</span>
        </div>

        <div className="w-[8.5rem] flex justify-between items-center border-1 border-gray-300 rounded p-[0.5rem]">
          <button
            disabled={occupancy.rooms <= 1}
            onClick={() => handleDecreaseOccupancy("rooms")}
            className="disabled:opacity-50"
          >
            <span className="text-secondary-normal text-xl">-</span>
          </button>
          <span className="text-md font-bold">{occupancy.rooms}</span>
          <button
            disabled={occupancy.rooms >= 2}
            onClick={() => handleIncreaseOccupancy("rooms")}
            className="disabled:opacity-50"
          >
            <span className="text-secondary-normal text-xl">+</span>
          </button>
        </div>
      </div> */}
      <div className="mt-[1rem]">
        <PrimaryButton
          onClick={() => {
            onSetSearch({
              children: occupancy.children,
              adults: occupancy.adults,
              // rooms: occupancy.rooms,
            });
            onSetOccupancy(false);
          }}
        >
          <span className="text-xs lg:text-base">Done</span>
        </PrimaryButton>
      </div>
    </div>
  );
}
