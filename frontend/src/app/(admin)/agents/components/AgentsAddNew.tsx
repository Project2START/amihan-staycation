"use client";

import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
} from "@/app/shared/constants/authFormValidation";
import { HOST } from "@/app/shared/constants/config";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import z from "zod";
import { revalidatePathAgents } from "../api/revalidatePathAgents";

const emailSchema = z.object({
  email: z
    .email()
    .min(
      EMAIL_MIN_LENGTH,
      `Email must have a minimum ${EMAIL_MIN_LENGTH} characters length`,
    )
    .max(
      EMAIL_MAX_LENGTH,
      `Email exceeded ${EMAIL_MAX_LENGTH} max characters length`,
    ),
});

export default function AgentsAddNew() {
  const [dialog, setDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [inputError, setInputError] = useState("");
  const [formError, setFormError] = useState("");
  const [loadingOverlay, setLoadingOverlay] = useState(false);

  const handleOpenDialog = () => {
    setDialog(true);
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const handleAddAgent = async () => {
    const result = z.safeParse(emailSchema, { email });

    if (!result.success) {
      setInputError(result.error.issues[0].message);
      return;
    }
    setInputError("");
    setFormError("");
    setLoadingOverlay(true);

    try {
      const agentResult = await axios.post(
        `${HOST}/api/agents/`,
        { email },
        { withCredentials: true },
      );

      CustomToast.show(agentResult.data.message, { indicator: "success" });
      handleCloseDialog();
      revalidatePathAgents();
    } catch (error) {
      setFormError(errorHandler(error).message);
    } finally {
      setLoadingOverlay(false);
    }
  };

  return (
    <div className="mt-[0.5rem]">
      <PrimaryButton onClick={handleOpenDialog}>
        <div className="flex items-center gap-x-3">
          <span className="text-2xl">
            <IoIosAdd />
          </span>
          <span className="text-xs font-bold">Add new agent</span>
        </div>
      </PrimaryButton>

      <DialogBaseContent
        onCloseDialog={handleCloseDialog}
        openDialog={dialog}
        enableClickOutside={false}
      >
        <div className="p-5 text-xs relative">
          <div className="flex flex-col">
            <span className="font-bold">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Please enter the agent's email..."
              type="text"
              className="mt-[0.5rem] border-b-2 border-secondary-normal/30 p-[0.5rem] input-base-focus"
            />
            {inputError.length !== 0 && (
              <p className="text-red-900 text-[0.65rem]">{inputError}</p>
            )}
          </div>
          {formError.length !== 0 && (
            <div className="flex justify-center mt-3">
              <p className="text-red-900 text-[0.65rem]">{formError}</p>
            </div>
          )}
          <div className="flex justify-center items-center gap-x-7 mt-3">
            <button onClick={handleCloseDialog}>
              <span className="text-xs">Cancel</span>
            </button>
            <PrimaryButton
              style={{ width: "max-content" }}
              onClick={handleAddAgent}
            >
              <span className="text-xs block px-5">Add</span>
            </PrimaryButton>
          </div>
          {loadingOverlay && (
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
