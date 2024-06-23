"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import logo from "@/assets/images/logo_pc.svg";
import axios from "axios";

export default function Home() {
  return (
    <>
      <nav>
        <Image src={logo} alt="cart savior logo"></Image>
      </nav>
      <main className={styles.main}>
        <h1>cart savior</h1>
        <button
          onClick={async () => {
            const { data } = await axios.get("/api/price");
            console.log(data);
          }}
        >
          click to get data
        </button>
      </main>
    </>
  );
}
