"use client";

import { HOST } from "@/app/shared/constants/config";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoPersonRemove } from "react-icons/io5";

export default function AgentRemove({ agentId }: { agentId: string }) {
  const [removeDialog, setRemoveDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const router = useRouter();

  const handleOpenRemoveDialog = () => {
    setRemoveDialog(true);
  };
  const handleCloseRemoveDialog = () => {
    setRemoveDialog(false);
  };

  const handleDeleteAgent = async () => {
    setLoading(true);
    setSubmitError("");

    try {
      await axios.delete(`${HOST}/api/agents/${agentId}`, {
        withCredentials: true,
      });

      CustomToast.show("Agent successfully removed", { indicator: "success" });

      router.push("/agents");
    } catch (err) {
      setSubmitError(errorHandler(err).message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button
        onClick={handleOpenRemoveDialog}
        className="px-3 border-2 bg-reject-normal text-white font-bold py-2 flex items-center gap-x-2 rounded-lg absolute top-2 right-2 transition-all md:hover:bg-reject-normal/90 md:hover:shadow-md"
      >
        <span className="text-base">
          <IoPersonRemove />
        </span>
        <span className="text-xs">Remove</span>
      </button>

      <DialogBaseContent
        openDialog={removeDialog}
        onCloseDialog={handleCloseRemoveDialog}
        enableClickOutside={!loading}
      >
        <div className="text-center text-secondary-normal p-5 relative lg:text-base">
          <div className="pb-5 md:pb-6">
            <p className="font-bold">Do want to remove this agent?</p>
            <p className="text-xs opacity-70 italic mt-1 md:mt-2">
              If yes, all active bookings associated with this agent will be
              cancelled.
            </p>
            {submitError ? (
              <p className="text-xs text-reject-normal mt-2">{submitError}</p>
            ) : null}
          </div>
          <div className="flex items-center justify-center gap-x-5 md:gap-x-7">
            <button
              onClick={handleCloseRemoveDialog}
              className="transition-colors md:hover:text-secondary-normal/70"
            >
              <span>No</span>
            </button>
            <button
              onClick={handleDeleteAgent}
              className="bg-reject-normal text-white font-bold px-10 py-1 rounded-lg transition-all md:hover:bg-reject-normal/90 md:hover:shadow-md"
            >
              <span>Yes</span>
            </button>
          </div>
          {loading && (
            <div className="flex items-center justify-center top-0 left-0 absolute w-full h-full bg-secondary-opacity">
              <span>
                <CircularProgress
                  sx={{ color: "var(--color-primary-normal)" }}
                />
              </span>
            </div>
          )}
        </div>
      </DialogBaseContent>
    </div>
  );
}
