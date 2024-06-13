import React, { useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { currentInstructor, useAuth } from '@/context/auth';

import Logo from '@/components/Logo';
import Container from '@/components/Container';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import FullPageLoading from '@/components/FullPageLoading';
import { standbyCCTV, processFile } from '@/services/file.services';
import { sendTextToClients } from '@/socket';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [exitPrompt, setExitPrompt] = useState(false);

  function offApp() {
    // TODO: close other apps and shutdown all pc (IOS 1 & 2, IG)
    try {
      standbyCCTV('config', 'off');
      processFile('config', 'off');
      window.close();

      sendTextToClients(JSON.stringify({ status: 'exit' }));
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Get form data based on input names
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username === '' || password === '') {
      setInputError(true);
      setOpen(true);
      setErrorMsg('Field cannot be empty.');
      return;
    }

    setIsLoading(true);

    try {
      await login(username, password);

      if (username === 'admin') {
        currentInstructor.isAdmin = true;
        navigate('/adminstart');
      } else {
        currentInstructor.isAdmin = false;
        navigate('/search');
      }
    } catch (e) {
      const errMsg = e.response.data.errorMessage;
      console.error(e);
      setOpen(true);
      setErrorMsg(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Container h={325} w={435}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 justify-center p-8"
        >
          {/* <Logo /> */}
          <TextField
            label="Username"
            name="username"
            required
            variant="standard"
            fullWidth
            error={inputError}
            onFocus={() => setInputError(false)}
          />
          <TextField
            label="Password"
            name="password"
            required
            variant="standard"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            error={inputError}
            onFocus={() => setInputError(false)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="text"
            type="submit"
            // onClick={() => handleLogin()}
            className="mt-4"
          >
            Login
          </Button>
        </form>
        <Button
          type="button"
          color="error"
          className="abosolute w-full bottom-0 mt-4"
          onClick={() => {
            // offApp();
            setExitPrompt(true);
          }}
        >
          Exit
        </Button>
      </Container>

      {/* Exit prompt */}
      <Dialog open={exitPrompt} onClose={() => setExitPrompt(false)}>
        <DialogContent className="min-w-[260px]">
          Keluar Aplikasi?
        </DialogContent>
        <DialogActions className="flex mb-2 justify-between">
          <Button
            className="mx-2"
            onClick={() => setExitPrompt(false)}
            color="error"
          >
            Tidak
          </Button>
          <Button className="mx-2" onClick={() => offApp()} variant="contained">
            Ya
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>

      <FullPageLoading loading={isLoading} />
    </>
  );
};

export default Login;
