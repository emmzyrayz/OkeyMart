// types/components.ts
export interface WaveInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}

export interface WaveSelectOption {
  value: string;
  label: string;
}

export interface WaveSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: WaveSelectOption[];
  required?: boolean;
}
