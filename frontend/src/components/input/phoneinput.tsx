import React, {useState, useEffect} from "react";
import Image from "next/image";

// Interface for country data
interface CountryData {
  code: string;
  flag: string;
  dialCode: string;
  format: string;
  validation: RegExp;
  placeholder: string;
  maxLength: number;
}

// Sample country data - you can expand this
export const countries: CountryData[] = [
  {
    code: "NG",
    flag: "🇳🇬",
    dialCode: "+234",
    format: "XXX XXX XXXX",
    // Updated validation to allow 11 digits starting with 0 or 11 digits starting with country code
    validation: /^(0|(\+)?234)[789]\d{9}$/,
    placeholder: "801 234 5678",
    // Updated max length to allow both 11 and 13 digit formats
    maxLength: 13,
  },
  {
    code: "US",
    flag: "🇺🇸",
    dialCode: "+1",
    format: "XXX-XXX-XXXX",
    validation: /^[2-9]\d{2}[2-9]\d{6}$/,
    placeholder: "555-555-5555",
    maxLength: 10,
  },
  // Add more countries as needed
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(
    countries[0]
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Initialize with Nigeria as default
    formatPhoneNumber(value);
  }, [value]);

  const normalizePhoneNumber = (
    input: string,
    country: CountryData
  ): string => {
    // Remove all non-digit characters
    let cleaned = input.replace(/\D/g, "");

    if (country.code === "NG") {
      // Convert +234 to 0 if present
      if (cleaned.startsWith("234")) {
        cleaned = "0" + cleaned.slice(3);
      }
      // Add leading 0 if not present and number is 10 digits
      else if (cleaned.length === 10 && /^[789]/.test(cleaned)) {
        cleaned = "0" + cleaned;
      }
    }

    return cleaned;
  };

  const formatPhoneNumber = (input: string) => {
    const normalized = normalizePhoneNumber(input, selectedCountry);
    let formatted = normalized;

    if (selectedCountry.code === "NG") {
      // Format Nigerian numbers (11 digits)
      if (normalized.length > 0) {
        formatted = normalized
          .replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
          .trim();
      }
    } else if (selectedCountry.code === "US") {
      // Format US numbers (10 digits)
      if (normalized.length > 0) {
        formatted = normalized
          .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
          .trim();
      }
    }

    setPhoneNumber(formatted);
    validatePhoneNumber(normalized);
  };

 const validatePhoneNumber = (number: string) => {
   const normalized = normalizePhoneNumber(number, selectedCountry);
   let isValid = false;
   let errorMessage = "";

   if (normalized.length === 0) {
     errorMessage = "Phone number is required";
   } else if (selectedCountry.code === "NG") {
     if (normalized.length !== 11) {
       errorMessage = "Nigerian phone number must be 11 digits";
     } else if (!/^0[789]\d{9}$/.test(normalized)) {
       errorMessage = "Invalid Nigerian phone number format";
     } else {
       isValid = true;
     }
   } else {
     // Validation for other countries
     if (normalized.length !== selectedCountry.maxLength) {
       errorMessage = `Phone number must be ${selectedCountry.maxLength} digits`;
     } else if (!selectedCountry.validation.test(normalized)) {
       errorMessage = "Invalid phone number format";
     } else {
       isValid = true;
     }
   }

   setError(errorMessage);
   onChange(normalized, isValid); // Send normalized number to parent
 };

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setPhoneNumber("");
    onChange("", false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-[370px]">
      <div className="flex flex-row justify-center items-center w-full h-[33px]">
        <div className="relative flex flex-row items-center justify-center h-full">
          <button
            type="button"
            className="flex items-center h-full p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
          >
            <span className="mr-2">{selectedCountry.flag}</span>
            <span className="text-sm">{selectedCountry.dialCode}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {countries.map((country) => (
                <button
                  key={country.code}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="mr-1 text-[14px]">{country.flag}</span>
                  <span className="text-[12px]">{country.dialCode}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="tel"
          className={`flex-1 p-2 border rounded-r focus:outline-none  h-full ${className}`}
          value={phoneNumber}
          onChange={(e) => formatPhoneNumber(e.target.value)}
          placeholder={selectedCountry.placeholder}
          disabled={disabled}
          // maxLength={selectedCountry.format.length}
        />
      </div>
    </div>
  );
};

export default PhoneInput;
