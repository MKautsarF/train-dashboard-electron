import { useAuth } from '@/context/auth';
import {
  Person,
  PlayArrow,
  SettingsBackupRestore,
  Stop,
  WarningAmber,
} from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Switch,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import InstructorDetail from './InstructorDetail';
import { styled } from '@mui/material/styles';
import {
  handleClientDisconnect,
  sendTextToClients,
  server,
  socketClients,
} from '@/socket';
import {
  safetyEnabledAtom,
  HardwareStatusAtom,
  motionTestStatusAtom,
  motionTestEnabledAtom,
  isGamePlayingAtom,
  safetyOverrideAtom,
} from '@/context/atom';
import { useAtom } from 'jotai';
import { error } from 'console';

interface ContainerProps {
  children: React.ReactNode;
  h?: number;
  w?: number;
}

const Container: React.FC<ContainerProps> = ({ children, h, w }) => {
  const { instructor } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const [safetyEnabled, setSafetyEnabled] = useAtom(safetyEnabledAtom);
  const [safetyOverride, setSafetyOverride] = useAtom(safetyOverrideAtom);

  const [hardwareStatus, setHardwareStatus] = useAtom(HardwareStatusAtom);

  const [motionTestStatus, setMotionTestStatus] = useAtom(motionTestStatusAtom);
  const [motionTestEnabled, setMotionTestEnabled] = useAtom(
    motionTestEnabledAtom
  );

  const [isGamePlaying] = useAtom(isGamePlayingAtom); // if gameplay started

  const [overridePrompt, setOverridePrompt] = useState<boolean>(false);

  const handleToggleSafety = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSafetyEnabled(event.target.checked);
  };

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255,255,255,.35)'
          : 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
    },
  }));

  useEffect(() => {
    // console.log('safety feature: ', safetyEnabled);
    // console.log('current hardware status: ', hardwareStatus);

    /** sending data to UE for toggling safety feature */
    const payload = {
      status: 'EnableSafety',
      value: safetyEnabled,
    };
    // console.log(payload);
    sendTextToClients(JSON.stringify(payload, null, 2));

    /** reading hardware data from UE */
    // if (!isGamePlaying) {
    socketClients.forEach((socket) => {
      socket.on('data', (data) => {
        const stringData = data.toString();
        const payload = stringData.split('|').slice(-1)[0];
        const dataUE = JSON.parse(payload);

        if (dataUE.status === 'safety') {
          console.log('received hardware data: ', dataUE);

          if (dataUE.receive) {
            setHardwareStatus({
              cabin: dataUE.cabin,
              doorLock: dataUE.doorLock,
              bridge: dataUE.bridge,
              mouse3d: dataUE.mouse3d,
              motionTestReady: dataUE.motionTestReady,
            });
          }
          if (!dataUE.receive) {
            setHardwareStatus({
              cabin: '-',
              doorLock: '-',
              bridge: '-',
              mouse3d: false,
              motionTestReady: false,
            });
          }
        }

        if (dataUE.type === 'Motion Test') {
          console.log('received motion test data: ', dataUE);

          setMotionTestStatus(dataUE.status);
        }
      });
    });

    return () => {
      socketClients.forEach((socket) => {
        console.log('removing data listeners');
        socket.removeAllListeners('data');
      });
    };
    // }
  }, [
    safetyEnabled,
    // hardwareStatus,
    motionTestStatus,
    // isGamePlaying,
  ]);

  return (
    <div>
      <div
        className="bg-white rounded-xl relative mx-16 mt-32 mb-32"
        style={{ height: h ? h : 'auto', width: w ? w : 'auto' }}
      >
        {instructor.name !== '' && (
          <Button
            className="absolute top-0 right-2 -translate-y-full"
            variant="text"
            startIcon={<Person />}
            type="button"
            onClick={() => setIsOpen(true)}
          >
            {instructor.name}
          </Button>
        )}
        <InstructorDetail
          isOpen={isOpen}
          handleClose={() => setIsOpen(false)}
        />
        {children}
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-4">
        <section
          className="bg-slate-200 rounded-xl flex-col justify-between px-4 py-2 text-sm"
          style={{ height: 'auto', width: 200 }}
        >
          <ul>
            <li className="mt-1 mb-2 flex justify-between text-base font-medium items-center">
              <span>Status Hardware</span>
              <IconButton
                size="small"
                onClick={() => {
                  if (safetyOverride) {
                    setSafetyOverride(false);
                    setSafetyEnabled(true);
                  } else {
                    setOverridePrompt(true);
                  }
                }}
              >
                {safetyOverride ? (
                  <SettingsBackupRestore fontSize="inherit" color="primary" />
                ) : (
                  <WarningAmber fontSize="inherit" color="warning" />
                )}
              </IconButton>
            </li>

            <li className="my-1 flex justify-between">
              <span>Kabin</span>
              <span>{hardwareStatus.cabin}</span>
            </li>
            <li className="my-1 flex justify-between">
              <span>Door Lock</span>
              <span>{hardwareStatus.doorLock}</span>
            </li>
            <li className="my-1 flex justify-between">
              <span>Bridge</span>
              <span>{hardwareStatus.bridge}</span>
            </li>
            <li className="mt-2 mb-1 flex justify-between">
              <span>Sistem Keamanan</span>
              {safetyOverride ? (
                <AntSwitch
                  checked={safetyEnabled}
                  onChange={handleToggleSafety}
                  color="warning"
                />
              ) : (
                'On'
              )}
            </li>
          </ul>
        </section>
        <section
          className="bg-slate-200 rounded-xl flex-col justify-between px-4 py-2 text-sm"
          style={{ height: 'auto', width: 200 }}
        >
          <ul>
            <li className="mt-1 mb-2 flex justify-between font-medium text-base">
              <span>Tes Motion</span>
            </li>
            <li className="my-1 flex justify-between">
              <span>3D Mouse</span>
              <span>{hardwareStatus.mouse3d ? 'On' : 'Off'}</span>
            </li>
            <li className="my-1 flex justify-between">
              <span>Status</span>
              <span>{motionTestStatus}</span>
            </li>
            <li className="mt-2 mb-1 flex justify-between">
              {motionTestStatus !== 'Closed' &&
              motionTestStatus !== 'Standby' ? (
                <Button size="small" fullWidth variant="contained" disabled>
                  {motionTestStatus + '...'}
                </Button>
              ) : (
                <Button
                  size="small"
                  fullWidth
                  variant="contained"
                  disabled={!hardwareStatus.motionTestReady}
                  color={motionTestEnabled ? 'error' : 'success'}
                  startIcon={motionTestEnabled ? <Stop /> : <PlayArrow />}
                  onClick={() => {
                    setMotionTestEnabled(!motionTestEnabled);
                    const payload = {
                      status: 'MotionTestCommand',
                      value: motionTestEnabled ? 'close' : 'open',
                    };
                    sendTextToClients(JSON.stringify(payload, null, 2));
                  }}
                >
                  {motionTestEnabled ? 'Stop' : 'Start'}
                </Button>
              )}
            </li>
          </ul>
        </section>
      </div>

      {/* Override prompt */}
      <Dialog open={overridePrompt} onClose={() => setOverridePrompt(false)}>
        <DialogContent className="min-w-[260px]">
          Override Fitur Keamanan?
        </DialogContent>
        <DialogActions className="flex mb-2 justify-between">
          <Button
            className="mx-2"
            onClick={() => setOverridePrompt(false)}
            color="error"
          >
            Tidak
          </Button>
          <Button
            className="mx-2"
            onClick={() => {
              /* enable toggle safety */
              setSafetyOverride(true);
              setOverridePrompt(false);
            }}
            variant="contained"
          >
            Ya
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Container;
