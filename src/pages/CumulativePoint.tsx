import { Button, IconButton } from "@mui/material";
import React, { useState } from "react";
import Logo from "@/components/Logo";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "@/components/Container";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const CumulativePoint = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const trainType = query.get("type") as "krl" | "mrt";

  const [score, setScore] = useState(50);
  const plusOperation = () => {
    setScore((prevScore) => Math.min(prevScore + 1, 100));
  };
  const minusOperation = () => {
    setScore((prevScore) => Math.max(prevScore - 1, 0));
  };

  return (
    <Container w={870}>
      <div className="w-1/3 absolute -translate-y-full">
        <Logo />
      </div>

      <div className="p-6">
        <h1 className="w-full text-center mb-8">
          Penilaian Simulasi {trainType.toUpperCase()}
        </h1>
        <div className="flex justify-center items-center gap-5">
          <IconButton onClick={() => minusOperation()}>
            <RemoveCircle className="text-5xl text-blue-400" />
          </IconButton>
          <div className=" flex w-1/2 h-56 bg-slate-100 shadow-md justify-center items-center rounded-lg mb-8">
            {/* <IconButton onClick={() => minusOperation()}>
              <RemoveCircle className="text-5xl text-blue-400" />
            </IconButton> */}
            <div className="flex flex-col justify-center items-center">
              <h1 className="justify-center items-center text-5xl mb-2">
                {score}
              </h1>
              <p>dari 100</p>
            </div>
            {/* <IconButton onClick={() => plusOperation()}>
              <AddCircle className="text-5xl text-blue-400" />
            </IconButton> */}
          </div>
          <IconButton onClick={() => plusOperation()}>
            <AddCircle className="text-5xl text-blue-400" />
          </IconButton>
        </div>
        {/* <div className="w-3/4 border-0 border-solid flex justify-center items-center">
          <IconButton onClick={() => minusOperation()} className="ml-auto">
            <RemoveCircle className="text-6xl text-blue-400" />
          </IconButton>
          <IconButton onClick={() => plusOperation()} className="ml-auto">
            <AddCircle className=" text-6xl text-blue-400" />
          </IconButton>
        </div> */}
      </div>
      <div className="flex w-full justify-center items-center">
        <div className="w-[850px] flex px-4 py-3 mb-4 border-2 ">
          <Button
            variant="text"
            color="error"
            onClick={() => navigate(`/settings?type=${trainType}`)}
          >
            Kembali
          </Button>
          <Button
            variant="contained"
            className="ml-auto"
            onClick={() => navigate(`/review/${trainType}`)}
          >
            Selesai
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default CumulativePoint;
