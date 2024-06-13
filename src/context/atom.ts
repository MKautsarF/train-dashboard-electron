import { atom } from 'jotai';

export const safetyEnabledAtom = atom<boolean>(true);

export const safetyOverrideAtom = atom<boolean>(false);

export const HardwareStatusAtom = atom({
  cabin: '-',
  doorLock: '-',
  bridge: '-',
  mouse3d: false,
  motionTestReady: false,
});

export const motionTestStatusAtom = atom<string>('Closed');

export const motionTestEnabledAtom = atom<boolean>(false);

export const isGamePlayingAtom = atom<boolean>(false);
