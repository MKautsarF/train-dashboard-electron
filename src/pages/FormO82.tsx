import Container from '@/components/Container';
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
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pdfgenerate from '@/pages/testingpdf';
import { useSettings } from '@/context/settings';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import { Page, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";
import fs from 'fs';

const FormO82 = () => {
  const navigate = useNavigate();

  const { settings } = useSettings();

  const [rangkaian] = useState(settings.kereta);
  const [tonage] = useState(settings.berat);
  const [taspat, setTaspat] = useState<string>('');
  const filepath = 'C:/Train Simulator/Data/Tabel_0_100.json';
  const json = fs.readFileSync(filepath, 'utf-8');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaspat(e.target.value);
  };

  const handleSave = () => {};
  const pdfgenerate = () => {
    try {
      handleSave();
      const doc = new jsPDF();
      const topMargin = 20;
      const leftMargin = 15;
      autoTable(doc, {
        body: [
          [
            {
              content:
                'O.82\n\nLAPORAN PERJALANAN KERETA API (LAPKA)\nTGL        /       /20  \n\nNO.        /LAPKA/BPUJI/       /20       ',
              colSpan: 2,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff', // White background
                fontStyle: 'bold', // Bold text
                fontSize: 12, // font size
                textColor: '#000000', // #000000 text color
                lineColor: '#000000', // #000000 border color
              },
            },
            {
              content: 'KA 58, BPUJI 01, ',
              colSpan: 1,
              styles: {
                halign: 'right',
                valign: 'middle',
                fillColor: '#ffffff', // White background
                fontStyle: 'bold', // Bold text
                fontSize: 12,
                textColor: '#000000', // #000000 text color
                lineColor: '#000000', // #000000 border color
              },
            },
          ],

          [
            {
              content: '1. MASINIS',
              colSpan: 1,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
            {
              content: '',
              colSpan: 1,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
            {
              content: '',
              colSpan: 1,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
          ],
          [
            {
              content: '2. PPK',
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
            {
              content: '',
              colSpan: 1,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
            {
              content: '',
              colSpan: 1,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
          ],
          [
            {
              content: '3. PENGAWALAN',
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
            {
              content: '',
              colSpan: 1,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
            {
              content: '',
              colSpan: 1,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
          ],
          [
            {
              content: '4. RANGKAIAN    : ' + rangkaian,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
            {
              content: '',
              colSpan: 1,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
            {
              content: '',
              colSpan: 1,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
          ],
          [
            {
              content: '5. TONAGE           : ' + tonage,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
          ],
          [
            {
              content: '6. TASPAT            : ' + taspat,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
            {
              content: '',
              colSpan: 1,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
            {
              content: '',
              colSpan: 1,
              styles: {
                halign: 'left',
                valign: 'middle',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
          ],
          [
            {
              content:
                '7.CATATAN PENTING DALAM PERJALANAN\n  BLB DI STASIUN\n    \u2022 DEPOK\n    \u2022 CITAYAM\n    \u2022 BOJONGGEDE\n    \u2022 CILEBUT\n    \u2022 BOGOR',
              styles: {
                halign: 'left',
                valign: 'top',
                fillColor: '#ffffff',
                fontSize: 12,
                fontStyle: 'bold',
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
          ],
          [
            {
              content:
                '\n\n\n\n\n\n\n\n\n    Petugas Schowing/TKA\n\n\n\n    ___________________\n    NIP,',
              styles: {
                halign: 'left',
                valign: 'bottom',
                fillColor: '#ffffff',
                fontSize: 12,
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
            {
              content: '',
              styles: {
                halign: 'left',
                valign: 'top',
                fillColor: '#ffffff',
                fontSize: 12,
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
            {
              content:
                '\n\n\n\n\n\n\n\n\nPPKA/PAP\n\n\n\n___________________\nNIP,',
              styles: {
                halign: 'left',
                valign: 'bottom',
                fillColor: '#ffffff',
                fontSize: 12,
                lineColor: '#000000',
                textColor: '#000000',
              },
            },
          ],
        ],
      });

      return doc.save('invoice.pdf');
    } catch (error) {
      console.error('Error generating PDF', error);
    }
  };
  return (
    <>
      <Container w={1000}>
        <div className="p-8">
          <h1 className="w-full text-center mb-8">
            Laporan Perjalanan Kereta Api: O.82
          </h1>
          <article>
            <h4 className="py-2">1. MASINIS</h4>
            <h4 className="py-2">2. PPK</h4>
            <h4 className="py-2">3. PENGAWALAN</h4>
            <h4 className="py-2">
              4. RANGKAIAN:&ensp;{rangkaian ? rangkaian : '-'}
            </h4>
            <h4 className="py-2">5. TONAGE:&ensp;{tonage} ton</h4>
            <h4 className="py-2 flex gap-1 items-center">
              <span>6.</span>
              <span>TASPAT:&nbsp;</span>
              <TextField
                size="small"
                multiline
                fullWidth
                value={taspat}
                onChange={handleChange}
              />
            </h4>
            <h4 className="py-2">
              7. CATATAN PENTING DALAM PERJALANAN BLB DI STASIUN:
              <ul className="py-2 ml-14">
                <li className="py-1">Depok</li>
                <li className="py-1">Citayam</li>
                <li className="py-1">Bojonggede</li>
                <li className="py-1">Cilebut</li>
                <li className="py-1">Bogor</li>
              </ul>
            </h4>
          </article>
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

              <Button onClick={pdfgenerate}>Export PDF</Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default FormO82;
