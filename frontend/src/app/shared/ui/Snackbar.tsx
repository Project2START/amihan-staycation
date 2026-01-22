import toast from "react-hot-toast";
import { motion } from "motion/react";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface SnackbarProps {
  style?: string;
  text?: string;
  icon?: React.ReactNode;
  isVisible: boolean;
}

export default function Snackbar({
  style,
  text = "Done",
  icon = <CheckCircleIcon fontSize="small" />,
  isVisible,
}: SnackbarProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={isVisible ? { scale: 1 } : { scale: 0 }}
      transition={{ duration: 0.25 }}
      className={
        style +
        " px-[1.5rem] py-[1rem] rounded-lg shadow-lg text-sm text-white bg-primary-normal"
      }
    >
      <span className="mr-[0.5rem]">{icon}</span>
      <span>{text}</span>
    </motion.div>
  );
}
