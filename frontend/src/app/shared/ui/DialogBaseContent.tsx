"use client";

import { AnimatePresence, motion } from "motion/react";

export default function DialogBaseContent({
  openDialog,
  scrollVertically = true,
  children,
  onCloseDialog,
  enableClickOutside = true,
  overlayClassName = "",
  contentClassName = "",
}: {
  scrollVertically?: boolean;
  enableClickOutside?: boolean;
  openDialog: boolean;
  onCloseDialog: () => void;
  children: React.ReactNode;
  overlayClassName?: string;
  contentClassName?: string;
}) {
  return (
    <>
      <AnimatePresence initial={false}>
        {openDialog ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`w-[100vw] h-[100vh] fixed top-0 left-0 bg-black/50 flex justify-center items-center z-999 ${overlayClassName}`}
            onMouseDown={(event) => {
              if (enableClickOutside && event.target === event.currentTarget) {
                onCloseDialog();
              }
            }}
          >
            <div
              className={`rounded-lg bg-white w-[85%] h-auto max-h-[80%] md:w-[50%] xl:w-[40%] ${contentClassName}`}
              style={
                scrollVertically
                  ? { overflowY: "auto" }
                  : { overflowY: "hidden" }
              }
            >
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
