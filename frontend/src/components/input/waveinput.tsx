"use client";
import React from "react";
import {CSSProperties} from "react";
import styles from "./waveinput.module.css";
import {WaveInputProps} from '@/types/component'

export const WaveInput: React.FC<WaveInputProps> = ({
  label,
  name,
  required = false,
  value,
  onChange,
  type,
}) => {
  return (
    <div className={styles.waveGroup}>
      <input
        required={required}
        type={type}
        className={styles.input}
        name={name}
        value={value}
        onChange={onChange}
      />
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