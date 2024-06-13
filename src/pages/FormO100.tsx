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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fs from "fs";
import { Save } from "@mui/icons-material";
// import pdfgenerate from "@/pages/testingpdf";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { green } from "@mui/material/colors";

const FormO100 = () => {
  // const handleTEST = () => {
  //   navigate("/TEST");
  // };
  const navigate = useNavigate();

  const filepath = "C:/Train Simulator/Data/Tabel_0_100.json";
  const json = fs.readFileSync(filepath, "utf-8");
  const data = JSON.parse(json);

  const [trainNumber, setTrainNumber] = useState(data[0].trainNumber);
  const [rows, setRows] = useState(data[1]);

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

      console.log(payload);
      navigate(-1);
    } catch (e) {
      console.error(e);
      console.log("Unable to save to json");
    }
  };
  interface Station {
    station_km: string[];
    station_name: string;
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
      const doc = new jsPDF();
      const trainNumber = data[0].trainNumber;
      const crew = "DEPOK";

      const depokStation = data[1].find(
        (station) => station.station_name === "Depok"
      );
      const citayamStation = data[1].find(
        (station) => station.station_name === "Citayam"
      );
      const bojonggedeStation = data[1].find(
        (station) => station.station_name === "Bojonggede"
      );
      const cilebutStation = data[1].find(
        (station) => station.station_name === "Cilebut"
      );
      const bogorStation = data[1].find(
        (station) => station.station_name === "Bogor"
      );
      const formatTime = (time: string) => {
        return dayjs(time).format("HH:mm:ss");
      };

      autoTable(doc, {
        body: [
          [
            {
              content: "Tabel Kereta Api",
              colSpan: 7,
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
          [
            {
              content: `Kereta Api Nomor:\n\n${trainNumber}`,
              colSpan: 2,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "PT. KERETA API INDONESIA (Persero) DIREKTORAT OPERASI",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
              rowSpan: 2,
              colSpan: 5,
            },
          ],
          [
            {
              content: `UPT CREW KA\n\n${crew}`,
              colSpan: 2,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
          ],
          [
            {
              content: "Letak Stasiun / Perhentian pada KM",
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 8,
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "Stasiun / Perhentian",
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 8,
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "Kecepatan Operasional (KM/Jam)",
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 8,
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "Kecepatan Maksimum (KM/Jam)",
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 8,
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "Jam Datang",
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 8,
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "Jam Berangkat",
              styles: {
                halign: "center",
                valign: "middle",
                fontSize: 8,
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "Keterangan Perjalanan KA",
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
              content: "(1)",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "(2)",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "(3)",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "(4)",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "(5)",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "(6)",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: "(7)",
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
          ],
          [
            {
              content: depokStation.station_km.join("\n"),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: depokStation.station_name,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: depokStation.op_speed,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
                fillColor: "#00A933",
              },
            },
            {
              content: depokStation.max_speed,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fillColor: "#FF0000",
                textColor: "#000000",
              },
            },
            {
              content: formatTime(depokStation.arrival),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: formatTime(depokStation.departure),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: depokStation.notes,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
          ],
          [
            {
              content: citayamStation.station_km.join("\n"),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: citayamStation.station_name,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: citayamStation.op_speed,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fillColor: "#00A933",
                textColor: "#000000",
              },
            },
            {
              content: citayamStation.max_speed,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fillColor: "#FF0000",
                textColor: "#000000",
              },
            },
            {
              content: formatTime(citayamStation.arrival),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: formatTime(citayamStation.departure),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: citayamStation.notes,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
          ],
          [
            {
              content: bojonggedeStation.station_km.join("\n"),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: bojonggedeStation.station_name,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: bojonggedeStation.op_speed,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fillColor: "#00A933",
                textColor: "#000000",
              },
            },
            {
              content: bojonggedeStation.max_speed,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fillColor: "#FF0000",
                textColor: "#000000",
              },
            },
            {
              content: formatTime(bojonggedeStation.arrival),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: formatTime(bojonggedeStation.departure),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: bojonggedeStation.notes,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
          ],
          [
            {
              content: cilebutStation.station_km.join("\n"),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: cilebutStation.station_name,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: cilebutStation.op_speed,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fillColor: "#00A933",
                textColor: "#000000",
              },
            },
            {
              content: cilebutStation.max_speed,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fillColor: "#FF0000",
                textColor: "#000000",
              },
            },
            {
              content: formatTime(cilebutStation.arrival),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: formatTime(cilebutStation.departure),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: cilebutStation.notes,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
          ],
          [
            {
              content: bogorStation.station_km.join("\n"),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: bogorStation.station_name,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: bogorStation.op_speed,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fillColor: "#00A933",
                textColor: "#000000",
              },
            },
            {
              content: bogorStation.max_speed,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                fillColor: "#FF0000",
                textColor: "#000000",
              },
            },
            {
              content: formatTime(bogorStation.arrival),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: formatTime(bogorStation.departure),
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
            {
              content: bogorStation.notes,
              styles: {
                halign: "center",
                valign: "middle",
                lineColor: "#000000",
                textColor: "#000000",
              },
            },
          ],
        ],
        theme: "grid",
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
          <h1 className="w-full text-center">Tabel Kereta Api: O.100</h1>
          <h3 className="mt-8 flex items-center gap-2">
            <span>Nomor Kereta Api:</span>
            <span>
              <TextField
                size="small"
                value={trainNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTrainNumber(e.target.value)
                }
              />
            </span>
          </h3>
          <TableContainer component={Paper} className="mt-8">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className="text-xs">
                  <TableCell align="center" className="text-sm w-32">
                    Letak Stasiun / Perhentian pada KM
                  </TableCell>
                  <TableCell align="center" className="text-sm w-32">
                    Stasiun / Perhentian
                  </TableCell>
                  <TableCell align="center" className="text-sm w-28">
                    Kecepatan Operasional (km/jam)
                  </TableCell>
                  <TableCell align="center" className="text-sm w-28">
                    Kecepatan Maksimum (km/jam)
                  </TableCell>
                  <TableCell align="center" className="text-sm w-28">
                    Jam Datang
                  </TableCell>
                  <TableCell align="center" className="text-sm w-28">
                    Jam Berangkat
                  </TableCell>
                  <TableCell align="center" className="text-sm">
                    Keterangan Perjalanan KA
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => (
                  <TableRow
                    key={row.station_name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center" className="text-sm">
                      {row.station_km.map((item: any) => (
                        <p>{item}</p>
                      ))}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      {row.station_name}
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

export default FormO100;
