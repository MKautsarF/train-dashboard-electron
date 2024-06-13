import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Container from "@/components/Container";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const testingpdf = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/form/o100");
  };
  const pdfgenerate = () => {
    const doc = new jsPDF();
    const trainNumber = 1234;
    const crew = "DEPOK";

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
              textColor: "#000000", // Black text color
              lineColor: "black", // Black border color
            },
          },
        ],
        [
          {
            content: `Kereta Api Nomor:\n\n${trainNumber}`,
            colSpan: 2,
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "PT. KERETA API INDONESIA (Persero) DIREKTORAT OPERASI",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
            rowSpan: 2,
            colSpan: 5,
          },
        ],
        [
          {
            content: `UPT CREW KA\n\n${crew}`,
            colSpan: 2,
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
        ],
        [
          {
            content: "Letak Stasiun / Perhentian pada KM",
            styles: {
              halign: "center",
              valign: "middle",
              fontSize: 8,
              lineColor: "black",
            },
          },
          {
            content: "Stasiun / Perhentian",
            styles: {
              halign: "center",
              valign: "middle",
              fontSize: 8,
              lineColor: "black",
            },
          },
          {
            content: "Kecepatan Operasional (KM/Jam)",
            styles: {
              halign: "center",
              valign: "middle",
              fontSize: 8,
              lineColor: "black",
            },
          },
          {
            content: "Kecepatan Maksimum (KM/Jam)",
            styles: {
              halign: "center",
              valign: "middle",
              fontSize: 8,
              lineColor: "black",
            },
          },
          {
            content: "Jam Datang",
            styles: {
              halign: "center",
              valign: "middle",
              fontSize: 8,
              lineColor: "black",
            },
          },
          {
            content: "Jam Berangkat",
            styles: {
              halign: "center",
              valign: "middle",
              fontSize: 8,
              lineColor: "black",
            },
          },
          {
            content: "Keterangan Perjalanan KA",
            styles: {
              halign: "center",
              valign: "middle",
              fontSize: 8,
              lineColor: "black",
            },
          },
        ],
        [
          {
            content: "(1)",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "(2)",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "(3)",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "(4)",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "(5)",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "(6)",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "(7)",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
        ],
        [
          {
            content: "32.684",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "Depok",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
        ],
        [
          {
            content: "37.810\n37.768",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "Citayam",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
        ],
        [
          {
            content: "42.965",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "Bojonggede",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
        ],
        [
          {
            content: "47.296",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "Cilebut",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
        ],
        [
          {
            content: "0.000\n54.810",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "Bogor",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "isi",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
          {
            content: "",
            styles: { halign: "center", valign: "middle", lineColor: "black" },
          },
        ],
      ],
      theme: "grid",
    });

    return doc.save("invoice.pdf");

    // return doc.save("invoice.pdf");
  };

  return (
    <Container w={800}>
      <div>
        <Button variant="contained" type="button" onClick={() => pdfgenerate()}>
          Test PDF
        </Button>
        <Button variant="contained" type="button" onClick={() => handleBack()}>
          Back
        </Button>
      </div>
    </Container>
  );
};

export default testingpdf;
