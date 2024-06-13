import React, { useEffect, useMemo, useRef, useState } from 'react';
import Container from '@/components/Container';
import {
  AlertColor,
  Box,
  Button,
  FormControl,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FullPageLoading from '@/components/FullPageLoading';
import { AddBox, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import fs from 'fs';
import { flushSync } from 'react-dom';

interface ToastData {
  severity: AlertColor;
  msg: string;
}

const ScoringKRL = () => {
  const navigate = useNavigate();

  const jsonPath = 'C:/Train Simulator/Data/MockJSON_KRL.json';

  const krljson = fs.readFileSync(jsonPath, 'utf-8');

  const [jsonToWrite, setJsonToWrite] = useState(JSON.parse(krljson));

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [toastData, setToastData] = useState<ToastData>({
    severity: 'error',
    msg: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setNotesOpen(false);
    const { currentTarget } = e;

    try {
      setIsLoading(true);

      // Get input data from form
      const data = new FormData(currentTarget);
      const judulAll = data.getAll('judul');
      const langkahKerjaAll = data.getAll('langkah_kerja');
      const observasiAll = data.getAll('observasi');
      const bobotPoinAll = data.getAll('bobot-poin');
      const bobotDataAll = data.getAll('bobot-data');

      let judulIndex = 0;
      let langkahKerjaIndex = 0;
      let observasiIndex = 0;
      let bobotPoinIndex = 0;
      let bobotDataIndex = 0;

      jsonToWrite.penilaian.forEach((penilaian: any, i: number) => {
        penilaian.judul = judulAll[judulIndex];
        penilaian.unit = i + 1;

        penilaian.data.forEach((data: any, j: number) => {
          data.langkah_kerja = langkahKerjaAll[langkahKerjaIndex];
          data.no = j + 1;
          data.bobot = bobotDataAll[bobotDataIndex];

          data.poin.forEach((poin: any, k: number) => {
            poin.observasi = observasiAll[observasiIndex];
            poin.id = `K${i + 1}.${j + 1}.${k + 1}`;
            poin.bobot = bobotPoinAll[bobotPoinIndex];

            observasiIndex++;
            bobotPoinIndex++;
          });
          langkahKerjaIndex++;
          bobotDataIndex++;
        });
        judulIndex++;
      });

      console.log(jsonPath);

      fs.writeFileSync(jsonPath, JSON.stringify(jsonToWrite, null, 2));
    } catch (e) {
      console.error(e);
      setToastData({
        severity: 'error',
        msg: `Failed to save json. Please try again later.`,
      });
      setOpen(true);
    } finally {
      navigate(-1);
      setIsLoading(false);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    const currentVal = Number(e.target.value);
    if (currentVal > 10) e.target.value = (10).toString();
    if (currentVal < 1) e.target.value = (1).toString();
  };

  const bottom = useRef(null);

  useEffect(() => {
    setJsonToWrite(jsonToWrite);
  }, [jsonToWrite]);

  return (
    <Container w={1000}>
      <div className="p-8">
        <h1 className="w-full text-center">
          Penilaian Kereta: KRL
          <IconButton
            aria-label="add unit kompetensi"
            size="large"
            color="success"
            className="mb-1"
            onClick={() => {
              const newNilai = {
                unit: jsonToWrite.penilaian.length + 1,
                judul: '',
                disable: false,
                data: new Array<any>(),
              };
              jsonToWrite.penilaian.push(newNilai);
              setJsonToWrite({ ...jsonToWrite });

              flushSync;
              bottom.current.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <AddBox fontSize="inherit" />
          </IconButton>
        </h1>

        <Box component="form" id="penilaian-form" onSubmit={handleSubmit}>
          <div>
            {jsonToWrite.penilaian.map((nilai: any, i: number) => {
              const { disable: nilaiDisabled } = nilai;

              return (
                <div key={nilai.unit} className="pt-8">
                  <section
                    className={`flex p-2 w-full border border-solid border-slate-200 rounded-lg min-h-[40px] ${
                      nilaiDisabled ? 'bg-slate-100' : ''
                    }`}
                  >
                    <IconButton
                      aria-label="hide penilaian"
                      onClick={() => {
                        nilai.disable = !nilaiDisabled;
                        nilai.data.forEach((data: any) => {
                          data.disable = nilai.disable;
                          data.poin.forEach(
                            (poin: any) => (poin.disable = nilai.disable)
                          );
                        });
                        setJsonToWrite({ ...jsonToWrite });
                      }}
                    >
                      {nilaiDisabled ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <h2 className="basis-52 self-center mx-1">
                      Unit Kompetensi {nilai.unit}:
                    </h2>
                    <TextField
                      defaultValue={nilai.judul}
                      type="string"
                      className="flex-auto mx-1"
                      size="small"
                      name="judul"
                      inputProps={{
                        readOnly: nilaiDisabled,
                      }}
                      multiline
                    />
                    <IconButton
                      color="success"
                      onClick={() => {
                        const newData = {
                          no: nilai.data.length + 1,
                          langkah_kerja: '',
                          disable: nilaiDisabled,
                          poin: new Array<any>(),
                        };
                        nilai.data.push(newData);
                        setJsonToWrite({ ...jsonToWrite });
                      }}
                    >
                      <AddBox />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        jsonToWrite.penilaian.splice(i, 1);
                        setJsonToWrite({ ...jsonToWrite });
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </section>

                  <div>
                    {nilai.data.map((data: any, j: number) => {
                      const { disable: dataDisabled } = data;

                      return (
                        <div key={data.no} className="ml-12">
                          <section
                            className={`mt-8 flex p-2 border border-solid border-slate-200 rounded-lg min-h-[40px] ${
                              dataDisabled ? 'bg-slate-100' : ''
                            }`}
                          >
                            <IconButton
                              aria-label="hide data"
                              onClick={() => {
                                if (!nilaiDisabled) {
                                  data.disable = !dataDisabled;
                                  data.poin.forEach(
                                    (poin: any) => (poin.disable = data.disable)
                                  );
                                  setJsonToWrite({ ...jsonToWrite });
                                }
                              }}
                            >
                              {dataDisabled ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>

                            <p className="mx-1 self-center px-3">{j + 1}.</p>

                            <Tooltip
                              title="Langkah Kerja"
                              placement="top-start"
                              slotProps={{
                                popper: {
                                  modifiers: [
                                    {
                                      name: 'offset',
                                      options: {
                                        offset: [0, -14],
                                      },
                                    },
                                  ],
                                },
                              }}
                            >
                              <TextField
                                defaultValue={data.langkah_kerja}
                                type="string"
                                className="w-full mx-1"
                                size="small"
                                // disabled={dataDisabled}
                                name="langkah_kerja"
                                inputProps={{
                                  readOnly: dataDisabled,
                                }}
                                multiline
                              >
                                {data.langkah_kerja}
                              </TextField>
                            </Tooltip>

                            <Tooltip
                              title="Bobot nilai"
                              placement="top"
                              slotProps={{
                                popper: {
                                  modifiers: [
                                    {
                                      name: 'offset',
                                      options: {
                                        offset: [0, -14],
                                      },
                                    },
                                  ],
                                },
                              }}
                            >
                              <TextField
                                defaultValue={data.bobot}
                                type="number"
                                size="small"
                                className="w-24 mx-2"
                                name="bobot-data"
                                inputProps={{
                                  readOnly: dataDisabled,
                                  min: 1,
                                  max: 10,
                                }}
                                onBlur={handleBlur}
                              />
                            </Tooltip>

                            <IconButton
                              color="success"
                              onClick={() => {
                                const newPoin = {
                                  observasi: '',
                                  id: `K${i + 1}.${j + 1}.${
                                    data.poin.length + 1
                                  }`,
                                  nilai: 0,
                                  disable: dataDisabled,
                                };
                                data.poin.push(newPoin);
                                setJsonToWrite({ ...jsonToWrite });
                              }}
                            >
                              <AddBox />
                            </IconButton>

                            <IconButton
                              color="error"
                              onClick={() => {
                                nilai.data.splice(j, 1);
                                setJsonToWrite({ ...jsonToWrite });
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </section>

                          <section>
                            {data.poin.map((poin: any, k: number) => {
                              const { disable: poinDisabled } = poin;

                              return (
                                <FormControl
                                  key={poin.id}
                                  className={`flex flex-row gap-4 my-2 ml-12 items-center rounded-lg p-2 border border-solid border-slate-200 min-h-[40px] ${
                                    poinDisabled ? 'bg-slate-100' : ''
                                  }`}
                                >
                                  <IconButton
                                    aria-label="hide poin"
                                    onClick={() => {
                                      if (!dataDisabled) {
                                        poin.disable = !poinDisabled;
                                        setJsonToWrite({ ...jsonToWrite });
                                      }
                                    }}
                                  >
                                    {poinDisabled ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </IconButton>

                                  <Tooltip
                                    title="Poin Observasi"
                                    placement="top-start"
                                    slotProps={{
                                      popper: {
                                        modifiers: [
                                          {
                                            name: 'offset',
                                            options: {
                                              offset: [0, -14],
                                            },
                                          },
                                        ],
                                      },
                                    }}
                                  >
                                    <TextField
                                      defaultValue={poin.observasi}
                                      type="string"
                                      className="w-full"
                                      size="small"
                                      // disabled={poinDisabled}
                                      name="observasi"
                                      inputProps={{
                                        readOnly: poinDisabled,
                                      }}
                                      multiline
                                    />
                                  </Tooltip>

                                  <Tooltip
                                    title="Bobot nilai"
                                    placement="top"
                                    slotProps={{
                                      popper: {
                                        modifiers: [
                                          {
                                            name: 'offset',
                                            options: {
                                              offset: [0, -14],
                                            },
                                          },
                                        ],
                                      },
                                    }}
                                  >
                                    <TextField
                                      defaultValue={poin.bobot}
                                      type="number"
                                      size="small"
                                      className="w-24"
                                      name="bobot-poin"
                                      inputProps={{
                                        readOnly: poinDisabled,
                                        min: 1,
                                        max: 10,
                                      }}
                                      onBlur={handleBlur}
                                    />
                                  </Tooltip>

                                  <IconButton
                                    aria-label="delete poin"
                                    color="error"
                                    onClick={() => {
                                      data.poin.splice(k, 1);
                                      setJsonToWrite({ ...jsonToWrite });
                                    }}
                                    // disabled
                                  >
                                    <Delete />
                                  </IconButton>
                                </FormControl>
                              );
                            })}
                          </section>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Box>

        <div className="flex w-full justify-center items-center fixed bottom-0 left-0 shadow-lg">
          <div className="w-[600px] rounded-full flex px-4 py-3 mb-4 border-2 border-solid border-blue-400 bg-slate-50">
            <Button variant="text" color="error" onClick={() => navigate(-1)}>
              Batal
            </Button>

            <Button
              variant="contained"
              className="ml-auto"
              type="submit"
              form="penilaian-form"
              color="success"
            >
              Simpan
            </Button>
          </div>
        </div>
      </div>

      <FullPageLoading loading={isLoading} />
      <footer ref={bottom}></footer>
    </Container>
  );
};

export default ScoringKRL;
