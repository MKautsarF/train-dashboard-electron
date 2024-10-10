import { Add, PersonAdd } from '@mui/icons-material';
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
import React, { useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import Container from '@/components/Container';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useAuth, currentPeserta, currentInstructor } from '@/context/auth';
import {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
} from '@/services/user.services';
import { useSettings } from '@/context/settings';
import FullPageLoading from '@/components/FullPageLoading';
import TraineeDetail from '@/components/TraineeDetail';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { toast } from 'react-toastify';
import { getSubmissionList } from '@/services/submission.services';

interface RowData {
  id: string;
  name: string;
  nip: string;
}

const Search = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { settings, setSettings } = useSettings();

  const [open, setOpen] = useState(false);
  const [selectedPeserta, setSelectedPeserta] = useState({
    id: '',
    name: '',
    nip: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Detail peserta
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState('');

  // Full page loading
  const [pageLoading, setPageLoading] = useState(false);

  // Register Purposes
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [nip, setNip] = useState('');
  const [code, setCode] = useState('');
  const [position, setPosition] = useState('');
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);

  const [rows, setRows] = useState<RowData[]>([
    // Local testing purposes
    // {
    //   id: "123",
    //   name: "Dummy user",
    //   nip: "123456",
    // },
  ]);
  const [totalData, setTotalData] = useState(0);
  const [page, setPage] = useState(1);

  const [editPrompt, setEditPrompt] = useState(false);
  const [detailPeserta, setDetailPeserta] = useState({
    username: '',
    name: '',
    email: '',
    nip: '',
    born: '',
    position: '',
  });
  const [newBirthDate, setNewBirthDate] = useState<Dayjs | null>(null);

  currentInstructor.isAdmin = false;
  currentInstructor.isInstructor = false;

  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogoutOpen = () => setLogoutOpen(true);
  const handleLogoutClose = () => setLogoutOpen(false);

  const handleConfirmLogout = () => {
    logout();
    navigate('/');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDaftar = () => {
    setOpen(true);
  };

  const handleGetLog = async () => {
    setPageLoading(true);

    try {
      navigate(`/userlog?id=${detailId}`);
    } catch (e) {
      console.error(e);
    } finally {
      setPageLoading(false);
    }
  };

  const handleStart = async () => {
    setPageLoading(true);

    try {
      const userData = await getUserById(selectedPeserta.id);
      setSettings({
        ...settings,
        trainee: {
          name: userData.name,
          nip: userData.username,
          bio: userData.bio,
        },
      });

      currentPeserta.id = userData.id; // owner id for use in submission
      // console.log(currentPeserta);

      navigate('/option');
    } catch (e) {
      console.error(e);
    } finally {
      setPageLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const validateRegister = (): boolean => {
    return (
      nama.length >= 3 &&
      nip !== '' &&
      email.length >= 8 &&
      // code !== '' &&
      birthDate !== null &&
      position !== ''
    );
  };

  const handleRegister = async () => {
    const isValid = validateRegister();

    if (!isValid) {
      toast.error(
        'Input registrasi tidak valid! Mohon gunakan nama dengan minimal 3 huruf, email yang valid, dan tidak mengosongkan input lain',
        {
          position: 'top-center',
          autoClose: 7500,
        }
      );
      return;
    }

    const payload = {
      name: nama,
      username: nip,

      email: email,
      password: 'P@ssword!23',
      bio: {
        officialCode: nip,
        born: birthDate.format('YYYY-MM-DD'),
        position: position,
      },
    };

    try {
      setPageLoading(true);
      const res = await createUser(payload);
      setRows(
        [
          {
            id: res.id,
            name: res.name,
            nip: res.username,
          },
        ].concat(rows)
      );
      setPage(1);

      setPageLoading(false);
      setOpen(false);
      setNama('');
      setNip('');
      setEmail('');
      setCode('');
      setPosition('');
      setBirthDate(null);
    } catch (e) {
      const errMsg = e.response.data.errorMessage;
      console.error(errMsg);
      toast.error(
        'Email peserta sudah terdaftar di database, mohon gunakan email yang berbeda',
        { position: 'top-center' }
      );
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setPage(1);
    setTotalData(0);

    const data = new FormData(e.currentTarget);
    const query = data.get('query') as string;

    try {
      const res = await getUsers(1, 5, query);
      const resRows = res.results.map((data: any) => ({
        id: data.id,
        name: data.name,
        nip: data.username,
      }));

      setRows(resRows);
      setTotalData(res.total);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPeserta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newName = formData.get('new-name') as string;
    const newEmail = formData.get('new-email') as string;
    const newNIP = formData.get('new-nip') as string;
    const newPosition = formData.get('new-position') as string;

    const payload = {
      name: newName,
      username: newNIP,
      email: newEmail,
      bio: {
        officialCode: newNIP,
        born: newBirthDate.format('YYYY-MM-DD'),
        position: newPosition,
      },
    };

    try {
      const res = await updateUserById(selectedPeserta.id, payload);

      setEditPrompt(false);
      toast.success('Data peserta berhasil diubah', { position: 'top-center' });
    } catch (e) {
      const errMsg = e.response.data.errorMessage;
      toast.error(errMsg, { position: 'top-center' });
    }
  };

  useEffect(() => {
    async function getRows(page: number) {
      try {
        setIsLoading(true);
        const res = await getUsers(page, 5);
        const resRows = res.results.map((data: any) => ({
          id: data.id,
          name: data.name,
          nip: data.username,
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
        {/* Search bar */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="flex gap-4 w-full"
        >
          <TextField
            id="input-with-icon-textfield"
            fullWidth
            name="query"
            placeholder="Cari berdasarkan NIP"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="outlined"
            className="w-20 bg-white text-blue-600 hover:bg-blue-600 hover:text-white border-solid border-blue-600"
          >
            Cari
          </Button>
        </Box>

        <div>
          <Button
            type="button"
            variant="contained"
            className="my-4"
            onClick={() => handleDaftar()}
            startIcon={<PersonAdd />}
          >
            Daftar Baru
          </Button>
        </div>

        {/* tabel preview */}
        <TableContainer className="mb-8" component={Paper}>
          <Table stickyHeader aria-label="Tabel Peserta">
            <colgroup>
              <col width="50%" />
              <col width="30%" />
              <col width="20%" />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>NIP</TableCell>
                <TableCell></TableCell>
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
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.nip}</TableCell>
                    <TableCell align="right">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outlined"
                          onClick={() => {
                            setDetailId(row.id), setDetailOpen(true);
                          }}
                        >
                          Detail
                        </Button>
                        <Button
                          color="success"
                          type="button"
                          variant={
                            selectedPeserta.nip === row.nip
                              ? 'contained'
                              : 'text'
                          }
                          onClick={() =>
                            setSelectedPeserta({
                              id: row.id,
                              name: row.name,
                              nip: row.nip,
                            })
                          }
                          className="w-20 ml-2"
                        >
                          Select
                        </Button>
                      </div>
                    </TableCell>
                    {/* <TableCell align="right">
                  </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <p className="absolute w-full top-1/3 left-0 flex justify-center">
                Data user tidak ditemukan
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
            color="error"
            className="bg-white text-red-600 hover:bg-red-600 hover:text-white"
            onClick={handleLogoutOpen}
          >
            Logout
          </Button>
          {selectedPeserta.nip !== '' && (
            <Button
              type="button"
              variant="outlined"
              className="bg-white text-blue-500 hover:bg-blue-500 hover:text-white ml-auto"
              onClick={() => handleStart()}
            >
              Lanjut ({selectedPeserta.name})
            </Button>
          )}
        </div>
      </div>

      {/* pop up registrasi */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Daftar Peserta Baru</DialogTitle>
        <DialogContent className="w-[400px]">
          <DialogContentText>Pendaftaran kandidat</DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            id="nama"
            label="Nama"
            type="text"
            fullWidth
            variant="standard"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          <TextField
            margin="normal"
            id="email"
            label="E-Mail"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            // className="w-1/2"
            margin="normal"
            id="nip"
            label="NIP"
            type="number"
            fullWidth
            variant="standard"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
          />
          <div className="flex gap-4 items-center">
            <TextField
              className="w-1/2"
              margin="normal"
              id="position"
              label="Kedudukan"
              type="text"
              variant="standard"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <DatePicker
              className="w-1/2"
              label="Tanggal Lahir"
              value={birthDate}
              format="DD/MM/YYYY"
              onChange={(newValue) => setBirthDate(newValue)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Kembali
          </Button>
          <Button onClick={handleRegister}>Tambah</Button>
        </DialogActions>
      </Dialog>

      {/* Detail peserta */}
      <TraineeDetail
        id={detailId}
        isOpen={detailOpen}
        handleClose={() => {
          setDetailOpen(false);
          setDetailId("");
        }}
        handleLog={() => {
          setDetailOpen(false);
          handleGetLog();
        }}
        handleEdit={async () => {
          const peserta = await getUserById(detailId);
          setDetailPeserta({
            username: peserta.username,
            name: peserta.name,
            email: peserta.email,
            nip: peserta.bio === null ? '' : peserta.bio.officialCode,
            born: peserta.bio === null ? '' : peserta.bio.born,
            position: peserta.bio === null ? '' : peserta.bio.position,
          });
          setNewBirthDate(
            peserta.bio === null ? null : dayjs(peserta.bio.born)
          );
          setEditPrompt(true);
        }}
      />

      {/* Edit Peserta Prompt */}
      <Dialog open={editPrompt} onClose={() => setEditPrompt(false)}>
        <DialogTitle className="min-w-[400px]">Edit Detail Peserta</DialogTitle>
        <DialogContent className="m-2 max-w-[400px]">
          <form id="edit" onSubmit={handleEditPeserta}>
            <TextField
              className="my-4"
              id="new-name"
              label="Nama"
              name="new-name"
              variant="standard"
              fullWidth
              defaultValue={selectedPeserta.name}
            />
            <TextField
              className="my-4"
              id="new-email"
              label="Email"
              name="new-email"
              variant="standard"
              fullWidth
              defaultValue={detailPeserta.email}
            />
            <TextField
              className="my-4"
              id="new-nip"
              label="NIP"
              type='number'
              name="new-nip"
              variant="standard"
              fullWidth
              defaultValue={selectedPeserta.nip}
            />
            <div className="my-4 flex gap-4 items-center">
              <TextField
                className="w-1/2"
                id="new-position"
                label="Kedudukan"
                name="new-position"
                variant="standard"
                fullWidth
                defaultValue={detailPeserta.position}
              />
              <DatePicker
                className="w-1/2"
                label="Tanggal Lahir"
                value={newBirthDate}
                format="DD/MM/YYYY"
                onChange={(date) => setNewBirthDate(date)}
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions className="mb-2 flex justify-between">
          <Button
            className="mx-2"
            onClick={() => setEditPrompt(false)}
            color="error"
          >
            Batal
          </Button>

          <Button
            className="mx-2"
            type="submit"
            form="edit"
            variant="contained"
            color="success"
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <FullPageLoading loading={pageLoading} />

      {/* Logout Confirmation Dialog */}
      <Dialog
          open={logoutOpen}
          onClose={handleLogoutClose}
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description"
          className="p-6"
        >
          <DialogTitle id="logout-dialog-title">Konfirmasi Logout</DialogTitle>
          <DialogContent>
            <DialogContentText id="logout-dialog-description">
              Apakah Anda yakin ingin logout?
            </DialogContentText>
          </DialogContent>
          <DialogActions className="flex p-6 justify-between w-full">
            <Button 
              onClick={handleLogoutClose}
              color="primary"
            >
              Batal
            </Button>
            <Button 
              onClick={handleConfirmLogout} color="error" variant="outlined"
              sx={{
                color: "#df2935",
                borderColor: "#df2935",
                backgroundColor: "#ffffff",
                "&:hover": {
                  borderColor: "#df2935",
                  backgroundColor: "#df2935",
                  color: "#ffffff",
                },
              }}
              >
                Logout
            </Button>
          </DialogActions>
        </Dialog>

    </Container>
  );
};

export default Search;
