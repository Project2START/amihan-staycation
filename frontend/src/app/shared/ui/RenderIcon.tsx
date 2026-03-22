"use client";

import { attributeIcons } from "@/app/(admin)/spaces/constants/attributeIcons";
import React from "react";
import type { IconType } from "react-icons";

interface RenderIconProps {
  iconId: string;
  className?: string; // optional styling
}

const RenderIcon: React.FC<RenderIconProps> = ({ iconId, className }) => {
  // Find the icon component by id
  const attribute = attributeIcons.find((attr) => attr.id === iconId);

  if (!attribute) {
    // Fallback if icon not found
    return null;
  }

  const Icon: IconType = attribute.icon;

  return <Icon className={className} />;
};

export default RenderIcon;
