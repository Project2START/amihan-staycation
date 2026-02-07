// components/PhoneFormatter.tsx
import { useState, ChangeEvent, useMemo } from "react";
import {
  getCountryCallingCode,
  getExampleNumber,
  CountryCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";
import metadata from "libphonenumber-js/metadata.full.json";
import ReactCountryFlag from "react-country-flag";
import SelectCountryCode from "./SelectCountryCode";

const countryKeys = Object.keys(metadata.countries) as CountryCode[];

// Specify priority countries first
const priorityCountries: CountryCode[] = ["PH", "US", "GB"];

const countries = [
  // First, the priority countries
  ...priorityCountries.map((code) => ({
    countryCode: code,
    callingCode: `+${getCountryCallingCode(code)}`,
  })),
  // Then, all other countries excluding priority ones
  ...countryKeys
    .filter((code) => !priorityCountries.includes(code))
    .map((code) => ({
      countryCode: code,
      callingCode: `+${getCountryCallingCode(code)}`,
    })),
];

console.log(countries);

interface PhoneFormatterProps {
  defaultCountry?: CountryCode;
}

const PhoneFormatter: React.FC<PhoneFormatterProps> = ({
  defaultCountry = "PH",
}) => {
  const [value, setValue] = useState("");

  const countryCodes: string[] = Object.keys(metadata.countries);

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

    setValue(groups.join(" "));
  };

  return (
    <div className="h-full flex">
      <div>
        <SelectCountryCode codes={countries} />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-full border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
      />
    </div>
  );
};

export default PhoneFormatter;
