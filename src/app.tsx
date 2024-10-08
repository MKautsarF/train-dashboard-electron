import React, { useEffect } from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/auth';
import { processFile, standbyCCTV } from './services/file.services';

import Login from './pages/Login';
import Option from './pages/Option';
import Settings from './pages/Settings';
import StartKRL from './pages/StartKRL';
import StartMRT from './pages/StartMRT';
import Search from './pages/Search';
import CumulativePoint from './pages/CumulativePoint';
import Finish from './pages/Finish';
import { ToastContainer } from 'react-toastify';
import UserLog from './pages/UserLog';
import AdminStart from './pages/AdminStart';
import TraineeList from './pages/TraineeList';
import InstructorList from './pages/InstructorList';
import ScoringMRT from './pages/ScoringMRT';
import ScoringKRL from './pages/ScoringKRL';
import FormO100 from './pages/FormO100';
import FormO82 from './pages/FormO82';

import TEST from './pages/testingpdf';

const routerData = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/option',
    element: <Option />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/start',
    element: <CumulativePoint />,
  },
  {
    path: '/review/krl',
    element: <StartKRL />,
  },
  {
    path: '/review/mrt',
    element: <StartMRT />,
  },
  {
    path: '/search',
    element: <Search />,
  },
  {
    path: '/finish',
    element: <Finish />,
  },
  {
    path: '/userlog',
    element: <UserLog />,
  },
  {
    path: '/adminstart',
    element: <AdminStart />,
  },
  {
    path: '/traineelist',
    element: <TraineeList />,
  },
  {
    path: '/instructorlist',
    element: <InstructorList />,
  },
  {
    path: '/scoring/mrt',
    element: <ScoringMRT />,
  },
  {
    path: '/scoring/krl',
    element: <ScoringKRL />,
  },
  {
    path: '/form/o100',
    element: <FormO100 />,
  },
  {
    path: '/form/o82',
    element: <FormO82 />,
  },
];

const router = createHashRouter(
  routerData.map((route) => ({
    ...route,
    element: <AuthProvider>{route.element}</AuthProvider>,
  }))
);
function offApp() {
  try {
    standbyCCTV('config', 'off');
    processFile('config', 'off');
  } catch (error) {
    console.error(error);
  }
}

const App = () => {
  useEffect(() => {
    return () => {
      offApp();
    };
  }, []);

  // Add a beforeunload event listener to handle when the entire application is closing
  useEffect(() => {
    const handleBeforeUnload = () => {
      offApp();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <main className="flex justify-center items-center min-h-screen min-w-screen bg-slate-300">
      <RouterProvider router={router} />
      <ToastContainer theme="colored" />
    </main>
  );
};

export default App;
