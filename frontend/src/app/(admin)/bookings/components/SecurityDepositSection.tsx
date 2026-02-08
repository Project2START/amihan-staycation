"use client";

import { BsImage } from "react-icons/bs";
import { useState } from "react";

export default function SecurityDepositSection() {
  const [depositView, setDepositView] = useState<"from" | "to">("from");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-teal-800">Security Deposit</h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setDepositView("from")}
            className={`px-3 py-1 text-xs font-medium rounded-l transition-colors ${
              depositView === "from"
                ? "bg-teal-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            From
          </button>
          <button
            type="button"
            onClick={() => setDepositView("to")}
            className={`px-3 py-1 text-xs font-medium rounded-r transition-colors ${
              depositView === "to"
                ? "bg-teal-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            To
          </button>
        </div>
      </div>

      {/* Deposit Receipt/Image */}
      <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 mb-4">
        <div className="border-4 border-blue-500 rounded-lg bg-white p-4 flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <BsImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Receipt Image</p>
          </div>
        </div>
      </div>
    </div>
  );
}