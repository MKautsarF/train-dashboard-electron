import React, { useState } from "react";
import Container from "@/components/Container";
import Logo from "@/components/Logo";
// const { app, BrowserWindow } = require("electron");

const PDF = () => {
  // app.once("ready", () => {
  //   let win = new BrowserWindow({
  //     webPreferences: {
  //       plugins: true,
  //     },
  //   });
  //   win.loadURL(
  //     "/dashboard_kereta_electron/app-1.0.0/penilaian/PDF" +
  //       "/KRL_2023-10-18_15-51-14.pdf"
  //   );
  // });
  return (
    <Container h={420} w={435}>
      <div className="flex flex-col gap-4 justify-center p-8">
        <Logo />
      </div>
    </Container>
  );
};

export default PDF;
