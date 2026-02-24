"use client";

import { HOST } from "@/app/shared/constants/config";
import { getRemainingSeconds } from "@/app/shared/lib/getRemainingSeconds";
import axios from "axios";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import toast from "react-hot-toast";
import Snackbar from "@/app/shared/ui/Snackbar";
import ErrorIcon from "@mui/icons-material/Error";

export default function ResendVerifyCode({ id }: { id?: string }) {
  const [seconds, setSeconds] = useState(0);
  const [resendLoading, setResendLoading] = useState(true);

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      const res = await axios.post<{ nextAllowedResend: string }>(
        `${HOST}/api/registrees/resend-v-code`,
        { id },
      );

      const nextAllowedResend = res.data.nextAllowedResend;
      const remainingSeconds = getRemainingSeconds(nextAllowedResend);

      localStorage.setItem(
        "registree_client_resendCountdown",
        JSON.stringify(new Date(Date.now() + 30 * 1000)),
      );

      setSeconds(remainingSeconds);
    } catch (error) {
      const errorResult = errorHandler(error);
      toast.custom((t) => (
        <Snackbar
          isVisible={t.visible}
          style="bg-red-900 text-xs"
          text={errorResult.message}
          icon={<ErrorIcon fontSize="small" />}
        />
      ));
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (seconds <= 0) return;

    const countDown = setTimeout(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearTimeout(countDown);
  }, [seconds]);

  useEffect(() => {
    const resendCountdown = localStorage.getItem(
      "registree_client_resendCountdown",
    );
    if (!resendCountdown) return;

    const remainingSeconds = getRemainingSeconds(JSON.parse(resendCountdown));

    setSeconds(remainingSeconds > 0 ? remainingSeconds : 0);
    setResendLoading(false);
  }, []);

  const noAllowedResend = seconds > 0;

  return (
    <p className="mt-[1rem]">
      Didn’t receive it?{" "}
      {resendLoading ? (
        <span className="mt-[1rem] ml-[1rem]">
          <CircularProgress size={12} />
        </span>
      ) : (
        <>
          <button
            onClick={handleResendCode}
            disabled={noAllowedResend}
            className={`${noAllowedResend && "opacity-[30%]"} mr-[0.10rem]`}
          >
            <strong>
              <em className="text-primary-normal">Click here to resend</em>
            </strong>
          </button>{" "}
          <strong className={`${!noAllowedResend && "opacity-[30%]"}`}>
            {seconds}s
          </strong>
        </>
      )}
    </p>
  );
}
