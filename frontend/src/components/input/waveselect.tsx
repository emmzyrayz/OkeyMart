// components/WaveSelect.tsx
import React, {CSSProperties} from "react";
import styles from "./waveinput.module.css";
import { WaveSelectProps } from '@/types/component'


export const WaveSelect: React.FC<WaveSelectProps> = ({
  label,
  name,
  required = false,
  value,
  onChange,
  options,
}) => {
  return (
    <div className={styles.waveGroup}>
      <select
        required={required}
        className={styles.input}
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={styles.bar}></span>
      <label className={styles.label}>
        {label.split("").map((char, i) => (
          <span
            key={i}
            className={styles.labelChar}
            style={{"--index": i} as CSSProperties}
          >
            {char}
          </span>
        ))}
      </label>
    </div>
  );
};
