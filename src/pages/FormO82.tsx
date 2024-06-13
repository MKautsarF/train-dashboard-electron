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

const FormO82 = () => {
  const navigate = useNavigate();

  const { settings } = useSettings();

  const [rangkaian] = useState(settings.kereta);
  const [tonage] = useState(settings.berat);
  const [taspat, setTaspat] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaspat(e.target.value);
  };

  const handleSave = () => {};

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
