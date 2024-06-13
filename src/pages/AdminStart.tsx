import {
  Train,
  Subway,
  NavigateBefore,
  ManageAccounts,
  Groups,
} from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import Container from '@/components/Container';
import { useAuth } from '@/context/auth';

const AdminStart = () => {
  const navigate = useNavigate();
  const { instructor, logout } = useAuth();

  // const [username, setUsername] = useState("Kautsar");

  const handleLogin = () => {
    navigate('/');
  };

  const handlePeserta = () => {
    navigate('/traineelist');
  };

  const handleInstruktur = () => {
    navigate('/instructorlist');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Container w={800}>
      <div className="w-1/3 absolute -translate-y-full py-4">
        <Logo />
      </div>

      <div className="p-6">
        <h4 className="py-3 mb-2">{'Halo, ' + instructor.name + '.'}</h4>
        <div className="flex flex-col">
          <p className="mb-5">Pilih daftar halaman: </p>
          <div className="border-0 border-solid flex space-x-10 justify-center items-center">
            <Button
              variant="contained"
              type="button"
              onClick={() => handleInstruktur()}
              className="w-1/2 p-5 text-2xl bg-gray-400 hover:bg-blue-500"
              startIcon={<ManageAccounts className="text-3xl" />}
            >
              Asesor
            </Button>
            <Button
              variant="contained"
              type="button"
              onClick={() => handlePeserta()}
              className="w-1/2 p-5 text-2xl bg-gray-400 hover:bg-blue-500"
              startIcon={<Groups className="text-3xl" />}
            >
              Peserta
            </Button>
          </div>
        </div>

        <div className="flex mt-8">
          <Button
            type="button"
            color="error"
            variant="outlined"
            // startIcon={<NavigateBefore />}
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default AdminStart;
