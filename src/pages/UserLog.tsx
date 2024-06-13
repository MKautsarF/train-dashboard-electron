import FullPageLoading from '@/components/FullPageLoading';
import { getUsers } from '@/services/user.services';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import Container from '@/components/Container';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentPeserta } from '@/context/auth';
import {
  getSubmissionById,
  getSubmissionList,
  getSubmissionLogByFileIndex,
} from '@/services/submission.services';
import dayjs from 'dayjs';
import { sendTextToClients } from '@/socket';
import FileSaver = require('file-saver');
import { shell } from 'electron';
import fs from 'fs';
import { config } from '@/config';
import { processFile, processFileExcel } from '@/services/file.services';
import { toast } from 'react-toastify';
import Logo from '@/components/Logo';

interface RowData {
  id: any;
  date: string;
  train: string;
  start: string;
  finish: string;
  // status: string;
  module: string;
}

const UserLog = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(false);

  const [rows, setRows] = useState<RowData[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [page, setPage] = useState(1);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleBack = () => {
    navigate('/search');
  };

  useEffect(() => {
    async function getRows(page: number) {
      try {
        setIsLoading(true);

        const res = await getSubmissionList(page, 5, currentPeserta.id);
        const resRows = res.results.map((data: any) => ({
          id: data.id,
          date: data.createdAt,
          train: data.train,
          start: data.setting.route.start.name,
          finish: data.setting.route.finish.name,
          // status: data.status,
          module: !data.setting.module ? 'Testing' : data.setting.module,
        }));

        setRows(resRows);
        setTotalData(res.total);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    getRows(page);
  }, [page]);

  return (
    <Container w={1000} h={700}>
      <div className="w-1/3 absolute -translate-y-full py-4">
        <Logo />
      </div>
      <div className="flex flex-col p-6 h-full">
        {/* Detail peserta */}
        <Box component="form" className="flex gap-4 w-full">
          <div className="title">
            <h3>Log Peserta</h3>
            <br />
            <p>
              <b>Nama:</b> {currentPeserta.name}
            </p>
            <p>
              <b>NIP:</b> {currentPeserta.nip}
            </p>
            <br />
          </div>
        </Box>

        {/* tabel preview */}
        <TableContainer className="mb-8" component={Paper}>
          <Table stickyHeader aria-label="Tabel Peserta">
            <colgroup>
              <col width="20%" />
              <col width="10%" />
              <col width="20%" />
              <col width="20%" />
              <col width="15%" />
              <col width="15%" />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Train</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>Finish</TableCell>
                <TableCell>Modul</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            {isLoading ? (
              <div className="absolute w-full top-1/3 left-0 flex justify-center">
                <CircularProgress />
              </div>
            ) : rows.length > 0 ? (
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell>
                      {dayjs(row.date).format('DD MMM YYYY, HH:mm')}
                    </TableCell>
                    <TableCell>{row.train}</TableCell>
                    <TableCell>{row.start}</TableCell>
                    <TableCell>{row.finish}</TableCell>
                    <TableCell>{row.module}</TableCell>
                    <TableCell align="right">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outlined"
                          onClick={async () => {
                            const res = await getSubmissionById(row.id);
                            const logs = res.log;

                            // let pdfId: number;
                            // for (const log of logs) {
                            //   if (log.tag === "pdf") {
                            //     pdfId = log.id;
                            //   }
                            // }
                            // console.log(row.id);
                            // console.log(pdfId);

                            // const pdf = await getSubmissionLogByFileIndex(
                            //   row.id,
                            //   pdfId
                            // );

                            /// 1
                            // const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });
                            // const pdfFile = new File([pdfBlob], "Preview.pdf");
                            // FileSaver.saveAs(pdfFile);

                            /// 2
                            // fs.writeFileSync("C:/Users/USER/Documents/Preview.pdf", pdf.data);
                            // shell.openPath("C:/Users/USER/Documents/Preview.pdf");

                            /// 3
                            // window.open(`${config.API_URL}/instructor/submission/${row.id}/log/${pdfId}?access_token=${sessionStorage.getItem("jwt")}`);

                            let jsonId: number;
                            for (const log of logs) {
                              if (log.tag === 'json') {
                                jsonId = log.id;
                              }
                            }
                            console.log(row.id);
                            console.log(jsonId);

                            if (!jsonId) {
                              toast.error('File tidak ditemukan di server', {
                                position: 'top-center',
                              });
                              return;
                            }

                            const json = await getSubmissionLogByFileIndex(
                              row.id,
                              jsonId
                            );

                            try {
                              fs.writeFileSync(
                                `C:/Train Simulator/Data/penilaian/Preview.json`,
                                JSON.stringify(json.data)
                              );

                              const jsonPdf = await processFile(
                                `C:/Train Simulator/Data/penilaian/PDF/Preview`,
                                'on'
                              );

                              shell.openPath(
                                `C:/Train Simulator/Data/penilaian/PDF/Preview.pdf`
                              );
                            } catch (err) {
                              const errMsg = err.response.data.errorMessage;
                              console.error(errMsg);
                              toast.error('Gagal membuka pdf', {
                                position: 'top-center',
                              });
                            }
                          }}
                        >
                          PDF
                        </Button>
                        <Button
                          type="button"
                          variant="outlined"
                          onClick={async () => {
                            const res = await getSubmissionById(row.id);
                            const logs = res.log;

                            let jsonId: number;
                            for (const log of logs) {
                              if (log.tag === 'json') {
                                jsonId = log.id;
                              }
                            }
                            console.log(row.id);
                            console.log(jsonId);

                            if (!jsonId) {
                              toast.error('File tidak ditemukan di server', {
                                position: 'top-center',
                              });
                              return;
                            }

                            const json = await getSubmissionLogByFileIndex(
                              row.id,
                              jsonId
                            );

                            try {
                              fs.writeFileSync(
                                `C:/Train Simulator/Data/penilaian/Preview.json`,
                                JSON.stringify(json.data)
                              );

                              const jsonExcel = await processFileExcel(
                                `C:/Train Simulator/Data/penilaian/Excel/Preview`,
                                'on'
                              );

                              shell.openPath(
                                `C:/Train Simulator/Data/penilaian/Excel/Preview.xlsx`
                              );
                            } catch (err) {
                              const errMsg = err.response.data.errorMessage;
                              console.error(errMsg);
                              toast.error('Gagal membuka excel', {
                                position: 'top-center',
                              });
                            }
                          }}
                        >
                          Excel
                        </Button>
                        {/* <Button
                          type="button"
                          variant="outlined"
                          onClick={async () => {
                            const res = await getSubmissionById(row.id);
                            const logs = res.log;

                            let videoId: number;
                            for (const log of logs) {
                              if (log.tag === "video") {
                                videoId = log.id;
                              }
                            }
                            console.log(videoId);

                            const video = await getSubmissionLogByFileIndex(
                              row.id,
                              videoId
                            );

                            sendTextToClients(JSON.stringify(video)); // perlu di tes
                          }}
                          className="w-20 ml-2"
                        >
                          Video
                        </Button> */}
                      </div>
                    </TableCell>
                    {/* <TableCell align="right">
                  </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <p className="absolute w-full top-1/3 left-0 flex justify-center">
                Data log user tidak ditemukan
              </p>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          // rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalData}
          rowsPerPage={5}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5]}
          className="overflow-hidden mt-auto"
          // onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outlined"
            // color="error"
            className="bg-white text-blue-700 hover:bg-blue-500 hover:text-white"
            onClick={() => handleBack()}
          >
            Kembali
          </Button>
        </div>
      </div>

      <FullPageLoading loading={pageLoading} />
    </Container>
  );
};

export default UserLog;