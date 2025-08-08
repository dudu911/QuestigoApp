"use client";

import { Button } from "@repo/ui";

import styles from "../styles/index.module.css";

export default function Web() {
  return (
    <div className={styles.container}>
      <h1>Web</h1>
      <p className="text-orange">Hi</p>
      <p className="text-orange text-xl font-bold mb-4">Hi from Tailwind!</p>
      <Button onClick={() => console.log("Pressed!")} text="Boop" />
    </div>
  );
}
