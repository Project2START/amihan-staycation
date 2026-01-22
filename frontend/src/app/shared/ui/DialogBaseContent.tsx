"use client";

import { AnimatePresence, motion } from "motion/react";
import ClickOutside from "./ClickOutside";

export default function DialogBaseContent({
  openDialog,
  children,
  onCloseDialog,
  enableClickOutside = true,
}: {
  enableClickOutside?: boolean;
  openDialog: boolean;
  onCloseDialog: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <AnimatePresence initial={false}>
        {openDialog ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-[100vw] h-[100vh] fixed top-0 left-0 bg-black/50 flex justify-center items-center z-999"
          >
            <div className="rounded-lg bg-white w-[85%] h-auto max-h-[80%] overflow-y-auto">
              {enableClickOutside ? (
                <ClickOutside onClickOutside={onCloseDialog}>
                  {children}
                </ClickOutside>
              ) : (
                children
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
