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
const countries: CountryData[] = [
  {
    code: "NG",
    flag: "🇳🇬",
    dialCode: "+234",
    format: "XXX XXX XXXX",
    validation: /^[0-9]{10}$/,
    placeholder: "801 234 5678",
    maxLength: 10,
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

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, "");
    let formatted = cleaned;

    // Apply country-specific formatting
    if (selectedCountry.code === "NG") {
      if (cleaned.length > 0) {
        formatted = cleaned.match(new RegExp(".{1,3}", "g"))?.join(" ") || "";
      }
    } else if (selectedCountry.code === "US") {
      if (cleaned.length > 0) {
        formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      }
    }

    setPhoneNumber(formatted);
    validatePhoneNumber(formatted);
  };

  const validatePhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    let isValid = false;
    let errorMessage = "";

    if (cleaned.length === 0) {
      errorMessage = "Phone number is required";
    } else if (cleaned.length !== selectedCountry.maxLength) {
      errorMessage = `Phone number must be ${selectedCountry.maxLength} digits for ${selectedCountry.code}`;
    } else if (!selectedCountry.validation.test(cleaned)) {
      errorMessage = "Invalid phone number format";
    } else {
      isValid = true;
    }

    setError(errorMessage);
    onChange(number, isValid);
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
                  <span className="mr-2">{country.flag}</span>
                  <span className="text-sm">{country.dialCode}</span>
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
          maxLength={selectedCountry.format.length}
        />
      </div>
    </div>
  );
};

export default PhoneInput;
