"use client";

import { useState } from "react";

export default function DepositStatusControl() {
  const [depositStatus, setDepositStatus] = useState<string>("pending");

  const handleUpdate = () => {
    // Handle status update logic here
    console.log("Updating status to:", depositStatus);
  };

  return (
    <div className="flex-1 mr-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
      <div className="flex gap-2">
        <select
          value={depositStatus}
          onChange={(e) => setDepositStatus(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          type="button"
          onClick={handleUpdate}
          className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded transition-colors"
        >
          Update
        </button>
      </div>
    </div>
  );
}