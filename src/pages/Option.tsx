import { Train, Subway, NavigateBefore } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import Container from '@/components/Container';
import { useAuth } from '@/context/auth';
const Option = () => {
  const navigate = useNavigate();
  const { instructor } = useAuth();

  // const [username, setUsername] = useState("Kautsar");

  const handleLogin = () => {
    navigate('/');
  };
  const handleMRT = () => {
    navigate('/settings?type=mrt');
  };
  const handleKRL = () => {
    navigate('/settings?type=krl');
  };

  return (
    <Container w={800}>
      <div className="w-1/3 absolute -translate-y-full py-4">
        <Logo />
      </div>

      <div className="p-6">
        <h4 className="py-3 mb-2">{'Halo, ' + instructor.name + '.'}</h4>
        <div className="flex flex-col">
          <p className="mb-5">Pilih jenis kereta yang akan dioperasikan: </p>
          <div className="border-0 border-solid flex space-x-10 justify-center items-center">
            <Button
              variant="contained"
              type="button"
              onClick={() => handleKRL()}
              className="w-1/2 p-5 text-2xl bg-gray-400 hover:bg-blue-500"
              startIcon={<Train className="text-3xl" />}
            >
              KRL
            </Button>
            <Button
              variant="contained"
              type="button"
              onClick={() => handleMRT()}
              className="w-1/2 p-5 text-2xl bg-gray-400 hover:bg-blue-500"
              startIcon={<Subway className="text-3xl" />}
            >
              MRT
            </Button>
          </div>
        </div>

        <div className="flex mt-8">
          <Button
            type="button"
            variant="contained"
            startIcon={<NavigateBefore />}
            onClick={() => navigate('/search')}
          >
            Kembali
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Option;
