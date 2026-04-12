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
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
      await revalidatePathAgents();

      window.dispatchEvent(new Event("agents:updated"));

      router.refresh();
      setEmail("");
    } catch (error) {
      setFormError(errorHandler(error).message);
    } finally {
      setLoadingOverlay(false);
    }
  };

  return (
    <div className="mt-[0.5rem]">
      <div className="lg:flex lg:justify-center">
        <div className="lg:w-[24rem]">
          <PrimaryButton onClick={handleOpenDialog}>
            <div className="flex items-center gap-x-3 ">
              <span className="text-2xl">
                <IoIosAdd />
              </span>
              <span className="text-xs font-bold">Add new agent</span>
            </div>
          </PrimaryButton>
        </div>
      </div>

      <DialogBaseContent
        onCloseDialog={handleCloseDialog}
        openDialog={dialog}
        enableClickOutside={false}
      >
        <div className="p-5 text-xs relative md:p-7 lg:p-8 lg:text-sm">
          <div className="mb-4 md:mb-5 lg:mb-6">
            <p className="font-bold text-secondary-normal">Add New Agent</p>
            <p className="text-secondary-normal/70 mt-1 md:mt-2">
              Enter the email address to invite an agent.
            </p>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Please enter the agent's email..."
              type="text"
              className="mt-[0.5rem] md:mt-3 border-b-2 border-secondary-normal/30 p-[0.5rem] md:py-[0.7rem] md:mb-1 input-base-focus"
            />
            {inputError.length !== 0 && (
              <p className="text-red-900 text-[0.65rem] md:text-xs mt-1 md:mt-2">
                {inputError}
              </p>
            )}
          </div>
          {formError.length !== 0 && (
            <div className="flex justify-center mt-3 md:mt-4">
              <p className="text-red-900 text-[0.65rem] md:text-xs">
                {formError}
              </p>
            </div>
          )}
          <div className="flex justify-center items-center gap-x-7 mt-3 md:mt-6 lg:mt-8">
            <button
              onClick={handleCloseDialog}
              className="transition-colors md:hover:text-secondary-normal/70"
            >
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
