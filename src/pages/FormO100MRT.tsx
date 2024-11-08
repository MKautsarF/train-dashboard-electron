import Container from "@/components/Container";
import {
  Box,
  Button,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { TimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
// import { useEffect, useState } from "react";
import React, { useEffect, useMemo, useState } from 'react';
import { default as sourceSettings } from '@/config/settings_train.json';
// import { useNavigate } from "react-router-dom";
import fs from "fs";
import { Save } from "@mui/icons-material";
// import pdfgenerate from "@/pages/testingpdf";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { green } from "@mui/material/colors";
import { useLocation, useNavigate } from 'react-router-dom';

const FormO100MRT = () => {
  // const handleTEST = () => {
  //   navigate("/TEST");
  // };
  const navigate = useNavigate();
  

  const filepath = "C:/Train Simulator/Data/Tabel_0_100mrt.json";
  const json = fs.readFileSync(filepath, "utf-8");
  const data = JSON.parse(json);
  const occFilePath = "C:/Train Simulator/Data/occ.json";
  const occJson = fs.readFileSync(occFilePath, "utf-8");
  const occData = JSON.parse(occJson);
  // exclude the first element from the data
  

  const [trainNumber, setTrainNumber] = useState(data[0].trainNumber);
  const [rows, setRows] = useState(data[1]);
  // const nexttrainNumber =trainNumber+1;
  // const initialTrainNumber = parseInt(data[0].trainNumber) + 1;
  // const initialTrainNumber = data[0].trainNumber + 1;

  // Set trainNumber using the pre-calculated value
  // const [trainNumber, setTrainNumber] = useState(initialTrainNumber);
  
;

  const handleTimeChange = (newValue: any, station: string, key: string) => {
    const editRows = rows.map((row: any) =>
      row.station_name === station ? { ...row, [key]: newValue } : row
    );

    setRows(editRows);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: string,
    key: string
  ) => {
    const editRows = rows.map((row: any) =>
      row.station_name === index
        ? { ...row, [key]: e.target.value.toString() }
        : row
    );

    setRows(editRows);
  };

  const handleSave = () => {
    try {
      const payload = [{ trainNumber }, rows];

      fs.writeFileSync(
        filepath,
        JSON.stringify([{ trainNumber }, rows], null, 2)
      );
      setOCCData();
      fs.writeFileSync(
        occFilePath,
        JSON.stringify(occData, null, 2)
      );

      console.log(payload);
      navigate(-1);
    } catch (e) {
      console.error(e);
      console.log("Unable to save to json");
    }
  };

  const setOCCData = () => {
    for (let j = 1; j < occData.ROUTE.length; j++) {
      for (let k = 1; k < occData.ROUTE[j].line2.length; k++) {
        //convert string to number
        occData.ROUTE[j].line2[k].speedLimit = Number(rows[j-1].max_speed);
      }
    }
  }
  interface Station {
    station_name: string;
    train_route: string[];
    op_speed: string;
    max_speed: string;
    arrival: string;
    departure: string;
    notes: string;
  }

  // Define the structure for train data
  interface TrainData {
    trainNumber: string;
  }
  const readDataFromFile = () => {
    const json = fs.readFileSync(filepath, "utf-8");
    return JSON.parse(json);
  };
  // Define a type representing your JSON data
  type JsonData = [TrainData, Station[]];

  const pdfgenerate = () => {
    try {
      handleSave();
      const data: JsonData = readDataFromFile();
      const doc = new jsPDF('l', 'pt', 'a4');
      const trainNumber = data[0].trainNumber;
      const crew = "Lebak Bulus";

      const lebakbulusStation = data[1].find(
        (station) => station.station_name === "Lebak Bulus"
      );
      const fatmawatiStation = data[1].find(
        (station) => station.station_name === "Fatmawati"
      );
      const cipeterayaStation = data[1].find(
        (station) => station.station_name === "Cipete Raya"
      );
      const hajinawiStation = data[1].find(
        (station) => station.station_name === "Haji Nawi"
      );
      const blokaStation = data[1].find(
        (station) => station.station_name === "Blok A"
      );
      const blokmStation = data[1].find(
        (station) => station.station_name === "Blok M"
      );
      const aseanStation = data[1].find(
        (station) => station.station_name === "Sisingamangaraja"
      );
      const senayanStation = data[1].find(
        (station) => station.station_name === "Senayan"
      );
      const istoraStation = data[1].find(
        (station) => station.station_name === "Istora"
      );
      const benhilStation = data[1].find(
        (station) => station.station_name === "Bendungan Hilir"
      );
      const setiabudiStation = data[1].find(
        (station) => station.station_name === "Setiabudi"
      );
      const dukuhatasStation = data[1].find(
        (station) => station.station_name === "Dukuh Atas"
      );
      const BundHIStation = data[1].find(
        (station) => station.station_name === "Bundaran HI"
      );
      const formatTime = (time: string) => {
        return dayjs(time).format("HH:mm:ss");
      };
      const subtractFormattedTimes = (time1: string, time2: string) => {
        const start = dayjs(time1);
        const end = dayjs(time2);
    
        // Calculate the difference in milliseconds
        const differenceInMillis = start.diff(end); 
    
        // Convert difference to minutes
        const differenceInMinutes = Math.floor(differenceInMillis / 60000);
    
        // Format the result as a string
        const hours = Math.floor(Math.abs(differenceInMinutes) / 60);
        const minutes = Math.abs(differenceInMinutes) % 60;
        const seconds = Math.abs(differenceInMillis) % 60;
    
        return dayjs(start.diff(end)).format("mm:ss");
    };
      const nextTime = (time: string, minutesToAdd: number) => {
        const newTime = dayjs(time).add(minutesToAdd, 'minute');
        return dayjs(newTime).format("HH:mm:ss"); // Format the new time
    };
      
      autoTable(doc, {
        body: [
          [
            {
              content: "Tabel Penomoran Kereta Api ",
              colSpan: 4,
              rowSpan: 1,
              
              styles: {
                halign: "center",
                valign: "middle",
                fillColor: "#ffffff", // White background
                fontStyle: "bold", // Bold text
                textColor: "#000000", // #000000 text color
                lineColor: "#000000", // #000000 border color
                fontSize: 16,
                cellPadding: 0,
                
              },
            },
          ],],theme: "grid",})
          autoTable(doc, {
            body: [
              [
                {
                  content: "Waktu Meninggalkan Kantor",
                  colSpan: 2,
                  rowSpan: 1,
                  styles: {
                    cellPadding:0,
                    halign: "center",
                    valign: "middle",
                    fillColor: "#ffffff", // White background
                    textColor: "#000000", // #000000 text color
                    lineColor: "#000000", // #000000 border color
                  },
                },
              ],
              [
                {
                  content: "",
                  colSpan: 1,
                  rowSpan: 3,
                  styles: {
                    halign: "center",
                    valign: "middle",
                    fillColor: "#ffffff", // White background
                    fontStyle: "bold", // Bold text
                    textColor: "#000000", // #000000 text color
                    lineColor: "#000000", // #000000 border color
                  },
                  
                },
                {
                  content: "",
                  colSpan: 1,
                  rowSpan: 3,
                  styles: {
                    halign: "center",
                    valign: "middle",
                    fillColor: "#ffffff", // White background
                    fontStyle: "bold", // Bold text
                    textColor: "#000000", // #000000 text color
                    lineColor: "#000000", // #000000 border color
                  },
                },
              ],
            ],
              theme: "grid",
              startY: 70,
              margin: { left: 40, right: 600 }, // General margins
            })
            autoTable(doc, {
              styles: {
                cellPadding: 0,
                fontSize: 10,
            },
              body: [
                [
                  {
                    content: "Nomor Kereta Api",
                    colSpan: 1,
                    rowSpan: 1,
                    styles: {
                      cellPadding: 3,
                      halign: "center",
                      valign: "middle",
                      fillColor: "#ffffff", // White background
                      textColor: "#000000", // #000000 text color
                      lineColor: "#000000", // #000000 border color
                    },
                  },
                  {
                    content: trainNumber,
                    colSpan: 1,
                    rowSpan: 1,
                    styles: {
                      halign: "center",
                      valign: "middle",
                      fillColor: "#ffffff", // White background
                      textColor: "#000000", // #000000 text color
                      lineColor: "#000000", // #000000 border color
                    },
                  },
                  {
                    content: "Kereta Api Biasa / Normal",
                    colSpan: 1,
                    rowSpan: 1,
                    styles: {
                      halign: "center",
                      valign: "middle",
                      fillColor: "#ffffff", // White background
                      textColor: "#000000", // #000000 text color
                      lineColor: "#000000", // #000000 border color
                    },
                  },
                ],
                [
                  {
                    content: "Arah",
                    colSpan: 1,
                    rowSpan: 1,
                    styles: {
                      cellPadding:0,
                      halign: "center",
                      valign: "middle",
                      fillColor: "#ffffff", // White background
                      textColor: "#000000", // #000000 text color
                      lineColor: "#000000", // #000000 border color
                    },
                  },
                  {
                    content: "Up Line",
                    colSpan: 1,
                    rowSpan: 1,
                    styles: {
                      cellPadding:1,
                      halign: "center",
                      valign: "middle",
                      fillColor: "#ffffff", // White background
                      textColor: "#000000", // #000000 text color
                      lineColor: "#000000", // #000000 border color
                    },
                  },
                  
                ],
                [
                  {
                    content: "Jenis Gapeka",
                    colSpan: 1,
                    rowSpan: 1,
                    styles: {
                      cellPadding:1,
                      halign: "center",
                      valign: "middle",
                      fillColor: "#ffffff", // White background
                      textColor: "#000000", // #000000 text color
                      lineColor: "#000000", // #000000 border color
                    },
                  },
                  {
                    content: "Hari Kerja",
                    colSpan: 1,
                    rowSpan: 1,
                    styles: {
                      cellPadding:1,
                      halign: "center",
                      valign: "middle",
                      fillColor: "#ffffff", // White background
                      textColor: "#000000", // #000000 text color
                      lineColor: "#000000", // #000000 border color
                    },
                  },
                  
                ],
                [
                  {
                    content: "Jenis Zona Waktu",
                    colSpan: 1,
                    rowSpan: 1,
                    styles: {
                      cellPadding:1,
                      halign: "center",
                      valign: "middle",
                      fillColor: "#ffffff", // White background
                      textColor: "#000000", // #000000 text color
                      lineColor: "#000000", // #000000 border color
                    },
                  },
                  {
                    content: "Waktu Puncak/Sibuk",
                    colSpan: 1,
                    rowSpan: 1,
                    styles: {
                      cellPadding:1,
                      halign: "center",
                      valign: "middle",
                      fillColor: "#ffffff", // White background
                      textColor: "#000000", // #000000 text color
                      lineColor: "#000000", // #000000 border color
                    },
                  },
                  
                ],
              ],
                theme: "grid",
                startY: 70,
                margin: { left: 20 + 300 + 10 }, // General margins
              })      
      autoTable(doc, {
        styles: {
          cellPadding: 1,
      },
        body: [
          [
            {
              content: "Waktu\nPerjalanan",
              colSpan: 1,
              rowSpan: 2,
              styles: {
                halign: "center",
                valign: "middle",
                fillColor: "#ffffff", // White background
                //fontStyle: "bold", // Bold text
                fontSize: 8,
                textColor: "#000000", // #000000 text color
                lineColor: "#000000", // #000000 border color
              },
            },
        
            {
              content: `Waktu\nBerhenti`,
              colSpan: 1,
              rowSpan: 2,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Jarak",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
              rowSpan: 1,
              colSpan: 2,
            },
            {
              content: "Kecepatan\nOperasional\nMaksimum\n(km/jam)",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
              rowSpan: 2,
              colSpan: 1,
            },
            {
              content: "Maximum\nSpeed\n(km/jam)",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
              rowSpan: 2,
              colSpan: 1,
            },
            {
              content: "Stasiun",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
              rowSpan: 2,
              colSpan: 2,
            },
            {
              content: "Rute KA\n(jalur)",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
              rowSpan: 2,
              colSpan: 1,
            },
            {
              content: "Waktu\nKedatangan",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
              rowSpan: 2,
              colSpan: 1,
            },
            {
              content: "Waktu\nKeberangkatan",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
              rowSpan: 2,
              colSpan: 1,
            },
            {
              content: "Penjelasan Operasional",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
              rowSpan: 2,
              colSpan: 1,
            },
          ],
          
          [
            {
              content: "Total",
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 8,
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "Antar\nStasiun",
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 8,
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            
          ],
          [
            {
              content: "-",
              rowSpan: 1,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "-",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "-",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "-",
              rowSpan: 1,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "-",
              rowSpan: 1,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "-",
              rowSpan: 1,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: lebakbulusStation.station_name,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,
                fontStyle: "bold",

              },
            },
            {
              content: lebakbulusStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(lebakbulusStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: lebakbulusStation.notes,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
          ],
          [
            {
              content: subtractFormattedTimes(fatmawatiStation.arrival,lebakbulusStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "2.018",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: lebakbulusStation.op_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,


              },
            },
            {
              content: lebakbulusStation.max_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fillColor: "#FFFFFF",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "e5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "k2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "k3",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "k4",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: "k5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "k6",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "k7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "k8",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: "00:50",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "2.018",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: fatmawatiStation.station_name,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: fatmawatiStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(fatmawatiStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(fatmawatiStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: fatmawatiStation.notes,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: "L4",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "L5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "L6",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "L7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            }
          ],
          [
            {
              content: subtractFormattedTimes(cipeterayaStation.arrival,fatmawatiStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "1.811",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            
            {
              content: fatmawatiStation.op_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: fatmawatiStation.max_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "L9",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "M1",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "a14",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "M2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: "M3",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "M4",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "M5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "M6",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            }
          ],
          [
            {
              content: "00:30",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "3.829",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: cipeterayaStation.station_name,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: cipeterayaStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(cipeterayaStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(cipeterayaStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,
              },
            },
            {
              content: cipeterayaStation.notes,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: "N1",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "N2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "N3",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "N4",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: subtractFormattedTimes(hajinawiStation.arrival,cipeterayaStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "1.292",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: cipeterayaStation.op_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: cipeterayaStation.max_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "N5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "N6",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "a16",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "N7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,
                fontStyle: "bold",

              },
            },
            {
              content: "N8",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "N9",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "O1",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "O2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: "00:30",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "5.121",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: hajinawiStation.station_name,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: hajinawiStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(hajinawiStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(hajinawiStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: hajinawiStation.notes,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: "O7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "O8",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "O9",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "P1",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: subtractFormattedTimes(blokaStation.arrival,hajinawiStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "1.217",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: hajinawiStation.op_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: hajinawiStation.max_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "P2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "P3",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "a18",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "P4",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: "P5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "P6",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "P7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "P8",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: "00:30",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "6.338",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: blokaStation.station_name,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: blokaStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(blokaStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(blokaStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: blokaStation.notes,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: "Q6",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Q7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Q8",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Q9",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: subtractFormattedTimes(blokmStation.arrival,blokaStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "1.267",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: blokaStation.op_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: blokaStation.max_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "R1",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "R2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "a20",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "R3",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: "R4",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "R5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "R6",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "R7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: "00:50",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "7.605",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: blokmStation.station_name,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,
                fontStyle: "bold",

              },
            },
            {
              content: blokmStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(blokmStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(blokmStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: blokmStation.notes,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: "S4",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "S5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "S6",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "S7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: subtractFormattedTimes(aseanStation.arrival,blokmStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "631",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: blokmStation.op_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: blokmStation.max_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "S8",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "S9",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "a22",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "T1",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: "T2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "T3",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "T4",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "T5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: "00:40",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "8.236",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fontSize: 8,
                textColor: "#000000",
              },
            },
            {
              content: aseanStation.station_name,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: aseanStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(aseanStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(aseanStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: aseanStation.notes,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,
              },
            },
            {
              content: "U1",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "U2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "U3",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "U4",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: subtractFormattedTimes(senayanStation.arrival,aseanStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "1.526",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: aseanStation.op_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fontSize: 8,
                textColor: "#000000",
              },
            },
            {
              content: aseanStation.max_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "U5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "U6",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "a24",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "U7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,
                fontStyle: "bold",

              },
            },
            {
              content: "U8",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "U9",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "V1",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "V2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: "00:40",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "9.762",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fontSize: 8,
                textColor: "#000000",
              },
            },
            {
              content: senayanStation.station_name,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: senayanStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(senayanStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(senayanStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: senayanStation.notes,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,
              },
            },
            {
              content: "V6",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "V7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "V8",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "V9",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: subtractFormattedTimes(istoraStation.arrival,senayanStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "814",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: senayanStation.op_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fontSize: 8,
                textColor: "#000000",
              },
            },
            {
              content: senayanStation.max_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "W1",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "W2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "a26",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "W3",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,
                fontStyle: "bold",

              },
            },
            {
              content: "W4",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "W5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "W6",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "W7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: "00:40",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "10.576",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fontSize: 8,
                textColor: "#000000",
              },
            },
            {
              content: istoraStation.station_name,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: istoraStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(istoraStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(istoraStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: istoraStation.notes,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: "X2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "X3",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "X4",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "X5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: subtractFormattedTimes(benhilStation.arrival,istoraStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "1.314",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: istoraStation.op_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fontSize: 8,
                textColor: "#000000",
              },
            },
            {
              content: istoraStation.max_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "X6",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "X7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "a28",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "X8",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,
                fontStyle: "bold",

              },
            },
            {
              content: "X9",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Y1",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Y2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Y3",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: "00:40",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "11.890",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fontSize: 8,
                textColor: "#000000",
              },
            },
            {
              content: benhilStation.station_name,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: benhilStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(benhilStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(benhilStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: benhilStation.notes,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: "Y7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Y8",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Y9",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Z1",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: subtractFormattedTimes(setiabudiStation.arrival,benhilStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "775",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: benhilStation.op_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fontSize: 8,
                textColor: "#000000",
              },
            },
            {
              content: benhilStation.max_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Z2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Z3",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "a30",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Z4",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,
                fontStyle: "bold",

              },
            },
            {
              content: "Z5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Z6",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Z7",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "Z8",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: "00:40",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "12.665",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fontSize: 8,
                textColor: "#000000",
              },
            },
            {
              content: setiabudiStation.station_name,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: setiabudiStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(setiabudiStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(setiabudiStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: setiabudiStation.notes,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: setiabudiStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(BundHIStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "A2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: subtractFormattedTimes(dukuhatasStation.arrival,setiabudiStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "913",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: setiabudiStation.op_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fontSize: 8,
                textColor: "#000000",
              },
            },
            {
              content: setiabudiStation.max_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "B1",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "B2",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "a32",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "ww",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,
                fontStyle: "bold",

              },
            },
            {
              content: "A9",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(BundHIStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "A3",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: "00:40",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "13.578",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fontSize: 8,
                textColor: "#000000",
              },
            },
            {
              content: dukuhatasStation.station_name,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: dukuhatasStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(dukuhatasStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(dukuhatasStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: dukuhatasStation.notes,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,

              },
            },
            {
              content: dukuhatasStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(BundHIStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "A4",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: subtractFormattedTimes(BundHIStation.arrival,dukuhatasStation.departure),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "1.073",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: dukuhatasStation.op_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fontSize: 8,
                textColor: "#000000",
              },
            },
            {
              content: dukuhatasStation.max_speed,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "B5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: BundHIStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "a34",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "ll",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,
                fontStyle: "bold",

              },
            },
            {
              content: "-",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(BundHIStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "A5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: "-",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "16.651",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fontSize: 8,
                textColor: "#000000",
              },
            },
            {
              content: BundHIStation.station_name,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,
                fontStyle: "bold"
              },
            },
            {
              content: BundHIStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(BundHIStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: BundHIStation.notes,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 10,
              },
            },
            {
              content: BundHIStation.train_route,
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: formatTime(BundHIStation.arrival),
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
            {
              content: "A5",
              rowSpan: 2,
              //colSpan: 1,
              styles: {
                halign: "left",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,

              },
            },
          ],
          [
            {
              content: "-",
              rowSpan: 1,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,
              },
            },
            {
              content: "-",
              rowSpan: 1,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,
              },
            },
            {
              content: "-",
              rowSpan: 1,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,
              },
            },
            {
              content: "-",
              rowSpan: 1,
              //colSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fontSize: 8,
              },
            },
          ],
        ],
        theme: "grid",
      })
      autoTable(doc, {
        body: [
          [
            {
              content: "A full scale the opening (From         ,2019)",
              colSpan: 3,
              rowSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                fillColor: "#ffffff", // White background
                fontSize: 8,
                textColor: "#000000", // #000000 text color
                lineColor: "#000000", // #000000 border color
              },
            },
          ],
          [
            {
              content: "Nomor\nPenugasan",
              colSpan: 1,
              rowSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                fillColor: "#ffffff", // White background
                textColor: "#000000", // #000000 text color
                lineColor: "#000000", // #000000 border color
              },
              
            },
            {
              content: "W12",
              colSpan: 1,
              rowSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                fillColor: "#ffffff", // White background
                textColor: "#000000", // #000000 text color
                lineColor: "#000000", // #000000 border color
              },
            },
            {
              content: "-3",
              colSpan: 1,
              rowSpan: 1,
              styles: {
                halign: "center",
                valign: "middle",
                fillColor: "#ffffff", // White background
                textColor: "#000000", // #000000 text color
                lineColor: "#000000", // #000000 border color
              },
            },
          ],
          
        ],
          theme: "grid",
          startY: 400,
          margin: { left: 40, right: 600 }, // General margins
        })
        autoTable(doc, {
          styles: {
            cellPadding: 1,
            fontSize:8,
        },
          body: [
            [
              {
                content: "Informasi untuk tugas selanjutnya",
                colSpan: 4,
                rowSpan: 1,
                styles: {
                  fontSize: 8,
                  halign: "center",
                  valign: "middle",
                  fillColor: "#ffffff", // White background
                  textColor: "#000000", // #000000 text color
                  lineColor: "#000000", // #000000 border color
                },
              },
            ],
            [
              {
                content: "Nomor KA",
                colSpan: 1,
                styles: {
                  halign: "center",
                  valign: "middle",
                  fillColor: "#ffffff", // White background
                  textColor: "#000000", // #000000 text color
                  lineColor: "#000000", // #000000 border color
                },
              },
              {
                content: "Tujuan",
                colSpan: 1,
                rowSpan: 1,
                styles: {
                  halign: "center",
                  valign: "middle",
                  fillColor: "#ffffff", // White background
                  textColor: "#000000", // #000000 text color
                  lineColor: "#000000", // #000000 border color
                },
              },
              {
                content: "Waktu\nkeberangkatan",
                colSpan: 1,
                styles: {
                  halign: "center",
                  valign: "middle",
                  fillColor: "#ffffff", // White background
                  textColor: "#000000", // #000000 text color
                  lineColor: "#000000", // #000000 border color
                },
              },
              {
                content: "Penjelasan Operasional",
                colSpan: 1,
                rowSpan: 1,
                styles: {
                  halign: "center",
                  valign: "middle",
                  fillColor: "#ffffff", // White background
                  textColor: "#000000", // #000000 text color
                  lineColor: "#000000", // #000000 border color
                },
              },
            ],
            [
              {
                content: parseInt(data[0].trainNumber) + 1 + "\nKereta api biasa / normal",
                colSpan: 1,
                styles: {
                  halign: "center",
                  valign: "middle",
                  fillColor: "#ffffff", // White background
                  textColor: "#000000", // #000000 text color
                  lineColor: "#000000", // #000000 border color
                },
              },
              {
                content: "Lebak Bulus",
                colSpan: 1,
                styles: {
                  halign: "center",
                  valign: "middle",
                  fillColor: "#ffffff", // White background
                  textColor: "#000000", // #000000 text color
                  lineColor: "#000000", // #000000 border color
                },
              },
              {
                content: nextTime(BundHIStation.arrival, 5),
                colSpan: 1,
                styles: {
                  halign: "center",
                  valign: "middle",
                  fillColor: "#ffffff", // White background
                  textColor: "#000000", // #000000 text color
                  lineColor: "#000000", // #000000 border color
                },
              },
              {
                content: "Harap kembali dengan KA yang sama",
                colSpan: 1,
                styles: {
                  halign: "left",
                  valign: "middle",
                  fillColor: "#ffffff", // White background
                  textColor: "#000000", // #000000 text color
                  lineColor: "#000000", // #000000 border color
                },
              },
            ],
            
          ],
            theme: "grid",
            startY: 400,
            margin: { left: 20 + 300 + 10 }, // General margins
          });
      

      return doc.save("invoice.pdf");
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  return (
    <>
      <Container w={1000}>
        <div className="p-8">
          <h1 className="w-full text-center">Tabel Penomoran Kereta Api</h1>
          <h3 className="mt-8 flex items-center gap-2">
            <span>Nomor Kereta Api:</span>
            <span>
              <TextField
                size="small"
                value={trainNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTrainNumber(parseInt(e.target.value))
                }
              />
            </span>
          </h3>
          <TableContainer component={Paper} className="mt-8">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className="text-xs">
                  <TableCell align="center" className="text-sm w-32">
                    Stasiun
                  </TableCell>
                  <TableCell align="center" className="text-sm w-32">
                    Rute KA (jalur)
                  </TableCell>
                  <TableCell align="center" className="text-sm w-32">
                    Waktu Kedatangan 
                  </TableCell>
                  <TableCell align="center" className="text-sm w-32">
                    Waktu Keberangkatan
                  </TableCell>
                  <TableCell align="center" className="text-sm w-32">
                    Kecepatan Operasi Maksimum (km/jam)
                  </TableCell>
                  <TableCell align="center" className="text-sm w-32">
                    Maximum Speed (km/jam)
                  </TableCell>
                  <TableCell align="center" className="text-sm">
                    Penjelasan Operasional
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => (
                  <TableRow
                    key={row.station_name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                    {row.station_name}
                    </TableCell>
                      <TableCell align="center" className="text-sm">
                      {row.train_route.map((item: any) => (
                        <p>{item}</p>
                      ))}
                    </TableCell>
                    <TableCell align="center">
                    <TimeField
                        ampm={false}
                        format="HH:mm:ss"
                        size="small"
                        variant="standard"
                        name="arrival"
                        value={dayjs(row.arrival)}
                        onChange={(newValue) =>
                          handleTimeChange(
                            newValue,
                            row.station_name,
                            "arrival"
                          )
                        }
                        sx={{ input: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                    <TimeField
                        ampm={false}
                        format="HH:mm:ss"
                        size="small"
                        variant="standard"
                        name="departure"
                        value={dayjs(row.departure)}
                        onChange={(newValue) =>
                          handleTimeChange(
                            newValue,
                            row.station_name,
                            "departure"
                          )
                        }
                        sx={{
                          input: { textAlign: "center" },
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                    <TextField
                        type="number"
                        size="small"
                        value={row.op_speed}
                        color="success"
                        sx={{
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                            {
                              display: "none",
                            },
                          "& input[type=number]": {
                            MozAppearance: "textfield",
                          },
                          input: { textAlign: "center" },
                        }}
                        className="w-3/5"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(e, row.station_name, "op_speed")
                        }
                      />
                      
                    </TableCell>
                    <TableCell align="center">
                    <TextField
                        type="number"
                        size="small"
                        value={row.max_speed}
                        color="error"
                        sx={{
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                            {
                              display: "none",
                            },
                          "& input[type=number]": {
                            MozAppearance: "textfield",
                          },
                          input: { textAlign: "center" },
                        }}
                        className="w-3/5"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(e, row.station_name, "max_speed")
                        }
                      />
                      
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        value={row.notes}
                        name="notes"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e, row.station_name, "notes");
                        }}
                        variant="standard"
                        multiline
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="flex w-full justify-center items-center fixed bottom-0 left-0 shadow-lg">
          <div className="w-[600px] rounded-full flex px-4 py-3 mb-4 border-2 border-solid border-blue-400 bg-slate-50 justify-between">
            <Button variant="text" color="error" onClick={() => navigate(-1)}>
              Batal
            </Button>
            <div className="flex gap-4">
              <Button
                // variant="contained"
                // className="ml-auto"
                // type="submit"
                // form="penilaian-form"
                color="success"
                onClick={handleSave}
              >
                Simpan
              </Button>

              <Button onClick={() => pdfgenerate()}>Export PDF</Button>
              {/* <Button>Export PDF</Button> */}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default FormO100MRT;
