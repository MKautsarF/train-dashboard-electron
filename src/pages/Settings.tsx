import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TimePicker } from '@mui/x-date-pickers';

import {
  Scale,
  Train,
  PlaceOutlined,
  PlaceRounded,
  Visibility,
  AccessTime,
  NavigateBefore,
  NavigateNext,
  CloudOutlined,
  ZoomOutMap,
  NotificationsActive,
  EditNote,
  MenuBook,
  Search,
  ArrowDropDown,
  List,
  Description,
  Edit,
} from '@mui/icons-material';
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Slider,
  TextField,
} from '@mui/material';

import Container from '@/components/Container';
import Logo from '@/components/Logo';
import { default as sourceSettings } from '@/config/settings_train.json';
import { sendTextToClients } from '@/socket';
import { standbyCCTV } from '@/services/file.services';
import { useSettings } from '@/context/settings';
import FullPageLoading from '@/components/FullPageLoading';
import { createSubmission } from '@/services/submission.services';
import { currentSubmission, currentPeserta } from '@/context/auth';
import { error } from 'console';
import { toast } from 'react-toastify';
import {
  HardwareStatusAtom,
  isGamePlayingAtom,
  motionTestEnabledAtom,
  motionTestStatusAtom,
  safetyEnabledAtom,
} from '@/context/atom';
import { useAtom } from 'jotai';
import { shell } from 'electron';

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const Settings = () => {
  const navigate = useNavigate();

  const { settings, setSettings } = useSettings();

  // const [useMotion, setUseMotion] = useState(settings.useMotionBase);
  // const [useBuzzer, setUseBuzzer] = useState(settings.useSpeedBuzzer);

  // const [selectedPeserta, setSelectedPeserta] = useState({
  //   id: "",
  //   name: "",
  //   nik: "",
  // });

  // const [currentSubmission, setCurrentSubmission] = useState();

  const query = useQuery();
  const trainType = query.get('type') as 'krl' | 'mrt';

  const trainSource = sourceSettings[trainType];

  // const [berat, setBerat] = useState(30);
  // const [kereta, setKereta] = useState("");
  // const [stasiunAsal, setStasiunAsal] = useState("");
  // const [stasiunTujuan, setStasiunTujuan] = useState("");
  // const [statusHujan, setStatusHujan] = useState<StatusHujan>("Cerah");
  // const [fog, setFog] = useState(0);
  // const [jarakPandang, setJarakPandang] = useState(0);
  // const [useMotionBase, setUseMotionBase] = useState(false);
  // const [waktu, setWaktu] = useState<Dayjs | null>(dayjs("2023-08-17T09:00"));
  const [isLoading, setIsLoading] = useState(false);

  const [modul, setModul] = useState('Testing');

  /// get safety status
  const [safetyEnabled] = useAtom(safetyEnabledAtom);
  /// get hardware status
  const [hardwareStatus] = useAtom(HardwareStatusAtom);
  /// get motion test status
  const [motionTestStatus] = useAtom(motionTestStatusAtom);
  /// check hardware safety
  const [isTrainValid, setIsTrainValid] = useState<boolean>(false);
  const [isDoorlockValid, setIsDoorlockValid] = useState<boolean>(false);

  const [canUseMotion, setCanUseMotion] = useState<boolean>(false);
  const [canStart, setCanStart] = useState<boolean>(true);

  const [isGamePlaying, setIsGamePlaying] = useAtom(isGamePlayingAtom);

  const canContinue =
    settings.kereta && settings.stasiunAsal && settings.stasiunTujuan;

  async function loadCctv() {
    try {
      await standbyCCTV('config', trainType.toUpperCase());
    } catch (error) {
      console.error(error);
    }
  }

  const handleSliderChange = (event: Event, newValue: number) => {
    const fogDistance =
      newValue >= 0.5 ? Math.round(Math.pow(newValue / 100, -0.914) * 50.6) : 0;
    setSettings({
      ...settings,
      fog: Math.round(newValue),
      jarakPandang: fogDistance,
    });
  };

  const handleMulai = async () => {
    /** hardware safety checking */
    if (safetyEnabled) {
      if (!isTrainValid) {
        toast.error(
          'Gagal memulai simulasi, mode kereta tidak sesuai dengan arah kabin',
          {
            position: 'top-center',
          }
        );
        return;
      }
      if (!isDoorlockValid) {
        toast.error(
          'Gagal memulai simulasi, door lock tidak sesuai dengan mode kabin',
          {
            position: 'top-center',
          }
        );
        return;
      }
      if (settings.useMotionBase && !canUseMotion) {
        toast.error(
          'Gagal memulai simulasi, pastikan bridge dalam status berdiri, atau matikan setting motion base',
          {
            position: 'top-center',
          }
        );
        return;
      }
      if (hardwareStatus.mouse3d || motionTestStatus !== 'Closed') {
        toast.error(
          'Gagal memulai simulasi, mohon matikan tes motion dan 3d mouse',
          {
            position: 'top-center',
          }
        );
        return;
      }
    }

    setIsGamePlaying(true);

    const payload = {
      module: modul,
      train_type: trainType.toUpperCase(),
      train: {
        weight: settings.berat.toString(),
        type: settings.kereta,
      },
      time: Number(settings.waktu.format('HH')),
      weather: [
        {
          value: settings.statusHujan,
          location: [0, 0],
          name: 'rain',
        },
        {
          value: settings.fog,
          location: [0, 0],
          name: 'fog',
        },
      ],
      route: {
        start: {
          name: settings.stasiunAsal,
        },
        finish: {
          name: settings.stasiunTujuan,
        },
      },
      motion_base: settings.useMotionBase,
      speed_buzzer: settings.useSpeedBuzzer,
      speed_limit: settings.speedLimit,
      status: 'play',
    };

    console.log(payload);

    try {
      setIsLoading(true);

      // console.log(currentPeserta.id);
      const submission = {
        owner: currentPeserta.id,
        train: payload.train_type,
        setting: payload,
      };
      const res = await createSubmission(submission);
      currentSubmission.id = res.id;
      // setCurrentSubmission(res.id);

      sendTextToClients(JSON.stringify(payload, null, 2));
      // console.log(payload);

      await loadCctv();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      navigate(`/review/${trainType}`);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setSettings(settings);
    // console.log('Motion: ' + settings.useMotionBase);
    // console.log('Buzzer: ' + settings.useSpeedBuzzer);
    // console.log('Limit: ' + settings.speedLimit);

    /** hardware safety checking */
    setIsTrainValid(trainType === hardwareStatus.cabin.toLowerCase());
    // console.log(isTrainValid);
    setIsDoorlockValid(trainType === hardwareStatus.doorLock.toLowerCase());
    setCanUseMotion(hardwareStatus.bridge === 'Berdiri');
    // console.log(canUseMotion);
    if (safetyEnabled) {
      if (
        isTrainValid &&
        isDoorlockValid &&
        motionTestStatus === 'Closed' &&
        !hardwareStatus.mouse3d
      ) {
        if (settings.useMotionBase) {
          setCanStart(canUseMotion);
        } else {
          setCanStart(true);
        }
      } else {
        setCanStart(false);
      }
    } else {
      setCanStart(true);
    }
    console.log('Can Start?: ' + canStart);
  }, [
    settings,
    safetyEnabled,
    hardwareStatus,
    isTrainValid,
    isDoorlockValid,
    motionTestStatus,
    canUseMotion,
    canStart,
  ]);

  return (
    <Container w={1000}>
      <div className="w-1/3 absolute -translate-y-full py-4">
        <Logo />
      </div>
      <div className="p-8 flex flex-wrap">
        <h1 className="w-full text-center my-4">
          Setting Simulasi {trainType.toUpperCase()}
        </h1>

        <div className="w-full my-2 flex items-center p-2">
          <MenuBook className="my-[0.5px] mr-2 text-gray-400" />
          <FormControl fullWidth>
            <InputLabel id="modul-label-id">Modul</InputLabel>
            <Select
              labelId="modul-label-id"
              label="Modul"
              value={modul}
              onChange={(e) => setModul(e.target.value)}
            >
              <MenuItem value="Learning">Learning</MenuItem>
              <MenuItem value="Testing">Testing</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Berat */}
        <div className="w-1/2 my-2 flex items-end mb-6 p-2">
          <Scale className="my-[0.5px] mr-2 text-gray-400" />
          <TextField
            label="Berat"
            type="number"
            variant="standard"
            className="w-48 mr-2 ml-1"
            value={settings.berat}
            inputProps={{
              min: 0,
              max: 72,
            }}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              setSettings({
                ...settings,
                berat: Number(e.target.value),
              })
            }
            error={settings.berat > 72}
            helperText={settings.berat > 72 && 'Maksimum berat adalah 72 ton'}
          />
          <p>ton</p>
        </div>

        {/* Jenis Kereta */}
        <div className="w-1/2 my-2 flex items-center p-2">
          <Train className="my-[0.5px] mr-2 text-gray-400" />
          <FormControl fullWidth>
            <InputLabel id="kereta-label-id">Jenis Kereta</InputLabel>
            <Select
              labelId="kereta-label-id"
              label="Jenis Kereta"
              value={settings.kereta}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  kereta: e.target.value,
                })
              }
            >
              {trainSource.jenis.map((type, idx) => (
                <MenuItem
                  key={idx}
                  value={type.split(' ').slice(0, 2).join(' ')}
                >
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Rute */}
        <div className="w-1/2 my-2 flex items-center p-2">
          <PlaceOutlined className="my-[0.5px] mr-2 text-gray-400" />
          <FormControl fullWidth>
            <InputLabel id="st-asal-label-id">Stasiun Asal</InputLabel>
            <Select
              labelId="st-asal-label-id"
              label="Stasiun Asal"
              value={settings.stasiunAsal}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  stasiunAsal: e.target.value,
                  stasiunTujuan: '',
                })
              }
            >
              {Object.entries(trainSource.rute).map((routePair, idx) => (
                <MenuItem key={idx} value={routePair[0]}>
                  {routePair[0]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="w-1/2 my-2 flex items-center p-2">
          <PlaceRounded className="my-[0.5px] mr-2 text-gray-400" />
          <FormControl fullWidth disabled={settings.stasiunAsal === ''}>
            <InputLabel id="st-tujuan-label-id">Stasiun Tujuan</InputLabel>
            <Select
              labelId="st-tujuan-label-id"
              label="Stasiun Tujuan"
              value={settings.stasiunTujuan}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  stasiunTujuan: e.target.value,
                })
              }
            >
              {(trainSource.rute as any)[settings.stasiunAsal]?.map(
                (destination: string, idx: number) => (
                  <MenuItem key={idx} value={destination}>
                    {destination}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </div>

        {/* Rain Status */}
        <div className="w-1/2 mb-2 mt-4 flex items-center p-2">
          <CloudOutlined className="my-[0.5px] mr-2 text-gray-400" />
          <FormControl fullWidth>
            <InputLabel id="status-hujan-label-id">Status Hujan</InputLabel>
            <Select
              labelId="status-hujan-label-id"
              label="Status Hujan"
              value={settings.statusHujan}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  statusHujan: e.target.value,
                })
              }
            >
              <MenuItem value="Cerah">Cerah</MenuItem>
              <MenuItem value="Ringan">Ringan</MenuItem>
              <MenuItem value="Sedang">Sedang</MenuItem>
              <MenuItem value="Deras">Deras</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Time Picker */}
        <div className="my-2 flex items-center p-2 w-1/2">
          <AccessTime className="my-[0.5px] mr-2 text-gray-400" />
          <TimePicker
            label="Waktu"
            ampm={false}
            value={settings.waktu}
            onChange={(newWaktu) =>
              setSettings({
                ...settings,
                waktu: newWaktu,
              })
            }
            className="flex-grow"
            timeSteps={{ minutes: 60 }}
          />
        </div>

        {/* Fog Slider */}
        <div className="w-full p-2">
          <p className="text-[#00000099] text-xs">Jarak Pandang (Kabut)</p>
          <div className="flex items-center mt-2 gap-4">
            <Visibility className="my-[0.5px] mr-2 text-gray-400" />
            <div className="flex-grow">
              <Slider
                className="flex-grow"
                min={0}
                max={100}
                step={0.25}
                value={settings.fog}
                onChange={handleSliderChange}
              />
            </div>

            <Input
              value={settings.jarakPandang}
              readOnly
              className="w-28"
              size="small"
              onFocus={(e) => e.target.select()}
              endAdornment={
                <InputAdornment
                  position="start"
                  className={`${
                    settings.jarakPandang !== 0 ? 'text-base' : 'text-xs'
                  }`}
                >
                  {settings.jarakPandang !== 0 ? 'meter' : 'Tidak berkabut'}
                </InputAdornment>
              }
              // inputProps={{
              //   min: 0,
              //   max: 200,
              //   step: 10,
              //   type: "number",
              // }}
            />
          </div>
        </div>

        <div className="flex items-center p-2">
          <ZoomOutMap className="my-[0.5px] mr-2 text-gray-400" />
          <FormControlLabel
            className="text-[#00000099]"
            control={
              <Checkbox
                checked={settings.useMotionBase}
                // value={settings.useMotionBase}
                onChange={() => {
                  setSettings({
                    ...settings,
                    useMotionBase: !settings.useMotionBase,
                  });
                  const payload = {
                    status: 'EnableMotion',
                    value: !settings.useMotionBase,
                  };
                  sendTextToClients(JSON.stringify(payload, null, 2));
                }}
                // disabled={!canUseMotion}
              />
            }
            label="Motion Base"
          />
        </div>

        {trainType === 'krl' ? (
          <>
            <div className="flex items-center p-2">
              <NotificationsActive className="my-[0.5px] mr-2 text-gray-400" />
              <FormControlLabel
                className="text-[#00000099] min-w-[180px]"
                control={
                  <Checkbox
                    // defaultChecked
                    checked={settings.useSpeedBuzzer}
                    // value={settings.useSpeedBuzzer}
                    onChange={() =>
                      setSettings({
                        ...settings,
                        useSpeedBuzzer: !settings.useSpeedBuzzer,
                      })
                    }
                  />
                }
                label="Buzzer Kecepatan"
              />
              <Input
                className="max-w-[50px]"
                // defaultValue={70}
                value={settings.speedLimit}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  let limit = Number(e.target.value);
                  if (limit > 100) limit = 100;
                  if (limit < 0) limit = 0;
                  // if (!settings.useSpeedBuzzer) limit = 70;

                  setSettings({
                    ...settings,
                    speedLimit: limit,
                  });
                }}
                inputProps={{
                  step: 5,
                  min: 0,
                  max: 100,
                  type: 'number',
                }}
                disabled={!settings.useSpeedBuzzer}
                // readOnly={!settings.useSpeedBuzzer}
              />
              <span className="text-[#00000099]">km/jam</span>
            </div>
          </>
        ) : (
          <></>
        )}

        <div className="flex justify-between w-full mt-8">
          {
            <div className="flex justify-start gap-4 w-full flex-wrap">
              <Button
                variant="outlined"
                startIcon={<EditNote />}
                onClick={() => {
                  navigate(`/scoring/${trainType}`);
                }}
              >
                Edit Penilaian
              </Button>
              {trainType === 'krl' ? (
                <>
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    variant="outlined"
                    startIcon={<Description />}
                    endIcon={<ArrowDropDown />}
                    color="success"
                  >
                    Dokumen KA
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        shell.openPath('C:/Train Simulator/Data/B.93.pdf');
                        // handleClose();
                      }}
                    >
                      B.93
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        shell.openPath('C:/Train Simulator/Data/B.94.pdf');
                        // handleClose();
                      }}
                    >
                      B.94
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate('/form/o82');
                      }}
                      className="flex justify-between gap-16"
                    >
                      <span>O.82</span>
                      <Chip
                        label="Edit"
                        size="small"
                        onClick={() => {
                          navigate('/form/o82');
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate('/form/o100');
                      }}
                      className="flex justify-between gap-16"
                    >
                      <span>O.100</span>
                      <Chip
                        label="Edit"
                        size="small"
                        onClick={() => {
                          navigate('/form/o100');
                        }}
                      />
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <></>
              )}

              {trainType === 'mrt' ? (
                <>
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    variant="outlined"
                    startIcon={<Description />}
                    endIcon={<ArrowDropDown />}
                    color="success"
                  >
                    Dokumen KA
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        shell.openPath('C:/Train Simulator/Data/Berita Acara Human Error.pdf');
                        // handleClose();
                      }}
                    >
                      Berita Acara
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        shell.openPath('C:/Train Simulator/Data/IBD.pdf');
                        // handleClose();
                      }}
                    >
                      Inspection Form
                    </MenuItem>
                    
                    <MenuItem
                      onClick={() => {
                        if (settings.stasiunAsal === 'Stasiun Bundaran HI') {
                          navigate('/form/o100mrt1');  // Navigate to o100 edit page
                        } else {
                          navigate('/form/o100mrt');  // Fallback edit navigation
                        }
                      }}
                      //   navigate('/form/o100mrt');
                      // }}
                      className="flex justify-between gap-16"
                    >
                      <span>O.100</span>
                      <Chip
                        label="Edit"
                        size="small"
                        onClick={() => {
                          if (settings.stasiunAsal === 'Stasiun Bundaran HI') {
                            navigate('/form/o100mrt1');  // Navigate to o100 edit page
                          } else {
                            navigate('/form/o100mrt');  // Fallback edit navigation
                          }
                        }}
                        //   navigate('/form/o100mrt');
                        // }}
                      />
                    </MenuItem>

                    {/* <MenuItem
                      onClick={() => {
                        navigate('/form/o100mrt1');
                      }}
                      className="flex justify-between gap-16"
                    >
                      <span>O.100 (BHI)</span>
                      <Chip
                        label="Edit"
                        size="small"
                        onClick={() => {
                          navigate('/form/o100mrt1');
                        }}
                      />
                    </MenuItem> */}
                  </Menu>
                </>
              ) : (
                <></>
              )}
            </div>
          }

          <div className="flex justify-end gap-4 w-full">
            <Button
              variant="contained"
              startIcon={<NavigateBefore />}
              onClick={() => {
                setSettings({
                  ...settings,
                  kereta: '',
                  stasiunAsal: '',
                  stasiunTujuan: '',
                });
                navigate('/option');
              }}
            >
              Kembali
            </Button>

            <Button
              variant="contained"
              endIcon={<NavigateNext />}
              disabled={!canContinue}
              onClick={() => {
                handleMulai();
              }}
              color={canStart ? 'success' : 'error'}
            >
              Mulai
            </Button>
          </div>
        </div>
      </div>

      <FullPageLoading loading={isLoading} />
    </Container>
  );
};

export default Settings;
