// src/components/AttributeIcons.tsx
import {
  IoBedOutline,
  IoSnowOutline,
  IoCafeOutline,
  IoLeafOutline,
} from "react-icons/io5";
import {
  MdOutlineBathtub,
  MdOutlineBedroomParent,
  MdOutlineHotel,
  MdOutlineSingleBed,
  MdOutlineKingBed,
  MdOutlineAcUnit,
  MdOutlineFireplace,
  MdOutlineCurtains,
  MdOutlineLaptopMac,
  MdOutlineDesk,
  MdOutlinePower,
  MdOutlineKitchen,
  MdOutlineMicrowave,
  MdOutlineCoffeeMaker,
  MdOutlineDining,
  MdOutlineLocalLaundryService,
  MdOutlineCleaningServices,
  MdOutlineIron,
  MdOutlineDeck,
  MdOutlineBeachAccess,
  MdOutlineSpa,
  MdOutlineChildFriendly,
  MdOutlineFamilyRestroom,
  MdOutlineGarage,
  MdOutlineElevator,
  MdOutlineAccessible,
  MdOutlineLock,
  MdOutlineSecurity,
  MdOutlineSmokeFree,
  MdOutlineCalendarMonth,
  MdOutlineEventAvailable,
  MdOutlineReceiptLong,
  MdOutlinePayments,
  MdOutlineLocationOn,
} from "react-icons/md";
import { FaWifi, FaTv, FaDog } from "react-icons/fa6";
import { GiBarbecue } from "react-icons/gi";
import type { IconType } from "react-icons";

export const attributeIcons: { id: string; icon: IconType }[] = [
  // 🛏 Sleeping / Rooms
  { icon: IoBedOutline, id: "beds-1" },
  { icon: MdOutlineBedroomParent, id: "bedroom-1" },
  { icon: MdOutlineBathtub, id: "bathroom-1" },
  { icon: MdOutlineHotel, id: "hotel-1" },
  { icon: MdOutlineSingleBed, id: "single-bed-1" },
  { icon: MdOutlineKingBed, id: "king-bed-1" },

  // ❄️ Comfort & Climate
  { icon: IoSnowOutline, id: "airconditioned-1" },
  { icon: MdOutlineAcUnit, id: "ac-unit-1" },
  { icon: MdOutlineFireplace, id: "fireplace-1" },
  { icon: MdOutlineCurtains, id: "curtains-1" },

  // 📶 Tech & Connectivity
  { icon: FaWifi, id: "free-wifi-1" },
  { icon: FaTv, id: "smart-tv-1" },
  { icon: MdOutlineLaptopMac, id: "workspace-1" },
  { icon: MdOutlineDesk, id: "desk-1" },
  { icon: MdOutlinePower, id: "power-outlet-1" },

  // 🍳 Kitchen & Dining
  { icon: MdOutlineKitchen, id: "kitchen-1" },
  { icon: MdOutlineMicrowave, id: "microwave-1" },
  { icon: MdOutlineCoffeeMaker, id: "coffee-maker-1" },
  { icon: MdOutlineDining, id: "dining-1" },
  { icon: IoCafeOutline, id: "coffee-1" },

  // 🧼 Cleaning & Laundry
  { icon: MdOutlineLocalLaundryService, id: "laundry-1" },
  { icon: MdOutlineCleaningServices, id: "cleaning-1" },
  { icon: MdOutlineIron, id: "iron-1" },

  // 🌿 Outdoor & Relaxation
  { icon: IoLeafOutline, id: "garden-1" },
  { icon: GiBarbecue, id: "bbq-1" },
  { icon: MdOutlineDeck, id: "balcony-1" },
  { icon: MdOutlineBeachAccess, id: "beach-access-1" },
  { icon: MdOutlineSpa, id: "spa-1" },

  // 🐶 Pet & Family
  { icon: FaDog, id: "pet-friendly-1" },
  { icon: MdOutlineChildFriendly, id: "child-friendly-1" },
  { icon: MdOutlineFamilyRestroom, id: "family-1" },

  // 🚗 Transport & Access
  { icon: MdOutlineGarage, id: "garage-1" },
  { icon: MdOutlineElevator, id: "elevator-1" },
  { icon: MdOutlineAccessible, id: "accessible-1" },

  // 🔒 Safety & Rules
  { icon: MdOutlineLock, id: "lock-1" },
  { icon: MdOutlineSecurity, id: "security-1" },
  { icon: MdOutlineSmokeFree, id: "smoke-free-1" },

  // 📅 Booking & Travel
  { icon: MdOutlineCalendarMonth, id: "calendar-1" },
  { icon: MdOutlineEventAvailable, id: "availability-1" },
  { icon: MdOutlineReceiptLong, id: "invoice-1" },
  { icon: MdOutlinePayments, id: "payments-1" },
  { icon: MdOutlineLocationOn, id: "location-1" },
];
