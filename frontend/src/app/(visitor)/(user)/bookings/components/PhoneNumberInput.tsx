"use client";

import { useState, ChangeEvent, useMemo } from "react";
import {
  getCountryCallingCode,
  getExampleNumber,
  CountryCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";
import metadata from "libphonenumber-js/metadata.full.json";
import SelectCountryCode from "./SelectCountryCode";
import { useFormContext } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";

const countryKeys = Object.keys(metadata.countries) as CountryCode[];

const priorityCountries: CountryCode[] = [
  "PH",
  "US",
  "JP",
  "KR",
  "CN",
  "CA",
  "GB",
  "AU",
  "SG",
  "MY",
  "TW",
  "IN",
  "NZ",
  "MX",
  "AE",
  "SA",
  "TH",
  "ID",
  "VN",
];

const countries = [
  ...priorityCountries.map((code) => ({
    countryCode: code,
    callingCode: `+${getCountryCallingCode(code)}`,
  })),
  ...countryKeys
    .filter((code) => !priorityCountries.includes(code))
    .map((code) => ({
      countryCode: code,
      callingCode: `+${getCountryCallingCode(code)}`,
    })),
];

interface INumberInputProps {
  defaultCountry?: CountryCode;
}

export default function PhoneNumberInput({
  defaultCountry = "PH",
}: INumberInputProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const { register } = useFormContext<BookingSchema>();

  // Determine max digits dynamically based on national number length
  const maxDigits = useMemo(() => {
    try {
      const exampleNumber = getExampleNumber(defaultCountry, examples);
      if (!exampleNumber) return 10;
      const national = exampleNumber.nationalNumber as unknown as string;
      return national.length;
    } catch {
      return 10;
    }
  }, [defaultCountry]);

  // Generate placeholder dynamically
  const placeholder = useMemo(() => {
    try {
      const exampleNumber = getExampleNumber(defaultCountry, examples);
      if (!exampleNumber) return "Enter number";
      const national = exampleNumber.nationalNumber as unknown as string;

      const groups: string[] = [];
      let i = 0;
      while (i < national.length) {
        const remaining = national.length - i;
        if (remaining > 7) {
          groups.push("X".repeat(3));
          i += 3;
        } else if (remaining === 7) {
          groups.push("X".repeat(3));
          i += 3;
        } else if (remaining === 6) {
          groups.push("X".repeat(3));
          i += 3;
        } else if (remaining === 5) {
          groups.push("X".repeat(2));
          i += 2;
        } else {
          groups.push("X".repeat(remaining));
          i = national.length;
        }
      }

      return groups.join(" ");
    } catch {
      return "Enter number";
    }
  }, [defaultCountry]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Keep all digits, including leading 0
    let digits = e.target.value.replace(/\D/g, "");

    // Limit to max digits for the country
    if (digits.length > maxDigits) digits = digits.slice(0, maxDigits);

    // Format dynamically into groups
    const groups: string[] = [];
    let i = 0;
    while (i < digits.length) {
      const remaining = digits.length - i;
      if (remaining > 7) {
        groups.push(digits.slice(i, i + 3));
        i += 3;
      } else if (remaining === 7) {
        groups.push(digits.slice(i, i + 3));
        i += 3;
      } else if (remaining === 6) {
        groups.push(digits.slice(i, i + 3));
        i += 3;
      } else if (remaining === 5) {
        groups.push(digits.slice(i, i + 2));
        i += 2;
      } else {
        groups.push(digits.slice(i));
        i = digits.length;
      }
    }

    setPhoneNumber(groups.join(" "));
  };

  return (
    <div className="h-full flex">
      <div>
        <SelectCountryCode codes={countries} />
      </div>
      <input
        {...register("contact_number.number")}
        type="text"
        value={phoneNumber}
        onChange={handleChange}
        placeholder={placeholder}
        className="rounded-tr-lg rounded-br-lg w-full h-full border-2 border-l-0 border-secondary-normal/30 pl-[1rem] py-[0.5rem] input-base-focus"
      />
    </div>
  );
}
