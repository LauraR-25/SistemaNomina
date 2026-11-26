const VIEW_BOX = '0 0 24 24';

export const ICONOS = {
  dashboard: {
    viewBox: VIEW_BOX,
    paths: [
      'M4 4h6v6H4z',
      'M14 4h6v6h-6z',
      'M4 14h6v6H4z',
      'M14 14h6v6h-6z',
    ],
  },
  building: {
    viewBox: VIEW_BOX,
    paths: [
      'M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16',
      'M16 9h2a2 2 0 0 1 2 2v10',
      'M2 21h20',
      'M8 7h4M8 11h4M8 15h4',
    ],
  },
  bank: {
    viewBox: VIEW_BOX,
    paths: [
      'M3 10 12 4l9 6',
      'M5 10v9M9 10v9M15 10v9M19 10v9',
      'M3 21h18',
    ],
  },
  'credit-card': {
    viewBox: VIEW_BOX,
    paths: ['M3 6h18v12H3z', 'M3 10h18', 'M7 14h4'],
  },
  users: {
    viewBox: VIEW_BOX,
    paths: [
      'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
      'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
      'M22 21v-2a4 4 0 0 0-3-3.87',
      'M16 3.13a4 4 0 0 1 0 7.75',
    ],
  },
  user: {
    viewBox: VIEW_BOX,
    paths: [
      'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
      'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
    ],
  },
  briefcase: {
    viewBox: VIEW_BOX,
    paths: [
      'M3 8h18v12H3z',
      'M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3',
      'M3 13h18',
      'M10 12v2h4v-2',
    ],
  },
  'file-text': {
    viewBox: VIEW_BOX,
    paths: [
      'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z',
      'M14 3v5h5',
      'M9 13h6M9 17h6',
    ],
  },
  receipt: {
    viewBox: VIEW_BOX,
    paths: [
      'M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z',
      'M9 8h6M9 12h6',
    ],
  },
  wallet: {
    viewBox: VIEW_BOX,
    paths: [
      'M5 5h13a2 2 0 0 1 2 2v1',
      'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1',
      'M16 13h3',
    ],
  },
  shield: {
    viewBox: VIEW_BOX,
    paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  },
  'shield-check': {
    viewBox: VIEW_BOX,
    paths: [
      'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      'M9 12l2 2 4-4',
    ],
  },
  bell: {
    viewBox: VIEW_BOX,
    paths: [
      'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9',
      'M10 21h4',
    ],
  },
  search: {
    viewBox: VIEW_BOX,
    paths: [
      'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16',
      'M21 21l-4.35-4.35',
    ],
  },
  plus: {
    viewBox: VIEW_BOX,
    paths: ['M12 5v14', 'M5 12h14'],
  },
  edit: {
    viewBox: VIEW_BOX,
    paths: ['M12 20H4', 'M14.5 4.5a2.12 2.12 0 0 1 3 3L8 17l-4 1 1-4z'],
  },
  trash: {
    viewBox: VIEW_BOX,
    paths: [
      'M3 6h18',
      'M8 6V4h8v2',
      'M6 6l1 15h10l1-15',
      'M10 10v7M14 10v7',
    ],
  },
  eye: {
    viewBox: VIEW_BOX,
    paths: [
      'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7',
      'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
    ],
  },
  'eye-off': {
    viewBox: VIEW_BOX,
    paths: [
      'M3 3l18 18',
      'M10.6 5.2A10.6 10.6 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3 3.7',
      'M6.2 6.2C3.5 8 2 12 2 12s4 7 10 7a10 10 0 0 0 4-.8',
      'M9.9 9.9a3 3 0 0 0 4.2 4.2',
    ],
  },
  'chevron-down': {
    viewBox: VIEW_BOX,
    paths: ['M6 9l6 6 6-6'],
  },
  'chevron-left': {
    viewBox: VIEW_BOX,
    paths: ['M15 18l-6-6 6-6'],
  },
  'chevron-right': {
    viewBox: VIEW_BOX,
    paths: ['M9 6l6 6-6 6'],
  },
  x: {
    viewBox: VIEW_BOX,
    paths: ['M18 6 6 18', 'M6 6l12 12'],
  },
  check: {
    viewBox: VIEW_BOX,
    paths: ['M20 6 9 17l-5-5'],
  },
  alert: {
    viewBox: VIEW_BOX,
    paths: ['M12 3 2 21h20z', 'M12 9v5', 'M12 17h.01'],
  },
  info: {
    viewBox: VIEW_BOX,
    paths: [
      'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20',
      'M12 11v6',
      'M12 7h.01',
    ],
  },
  logout: {
    viewBox: VIEW_BOX,
    paths: [
      'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4',
      'M16 17l5-5-5-5',
      'M21 12H9',
    ],
  },
  menu: {
    viewBox: VIEW_BOX,
    paths: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  },
  settings: {
    viewBox: VIEW_BOX,
    paths: [
      'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
      'M12 2v3M12 19v3M2 12h3M19 12h3',
      'M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1',
    ],
  },
  calendar: {
    viewBox: VIEW_BOX,
    paths: [
      'M4 6h16v15H4z',
      'M4 10h16',
      'M8 3v4M16 3v4',
    ],
  },
  clock: {
    viewBox: VIEW_BOX,
    paths: [
      'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20',
      'M12 6v6l4 2',
    ],
  },
  download: {
    viewBox: VIEW_BOX,
    paths: ['M12 3v12', 'M7 10l5 5 5-5', 'M4 21h16'],
  },
  filter: {
    viewBox: VIEW_BOX,
    paths: ['M3 5h18l-7 8v6l-4 2v-8z'],
  },
  lock: {
    viewBox: VIEW_BOX,
    paths: [
      'M5 11h14v10H5z',
      'M8 11V7a4 4 0 0 1 8 0v4',
      'M12 15v2',
    ],
  },
  key: {
    viewBox: VIEW_BOX,
    paths: [
      'M14 7a5 5 0 1 0-4.5 7L3 20v-3l3-3 2 2 2-2-2-2 2.5-2.5A5 5 0 0 0 14 7',
      'M16 7h.01',
    ],
  },
  clipboard: {
    viewBox: VIEW_BOX,
    paths: [
      'M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3',
      'M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2',
      'M9 4h6v4H9z',
      'M9 12h6M9 16h6',
    ],
  },
  'trending-up': {
    viewBox: VIEW_BOX,
    paths: ['M3 17l6-6 4 4 8-8', 'M15 7h6v6'],
  },
  percent: {
    viewBox: VIEW_BOX,
    paths: [
      'M19 5 5 19',
      'M7.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3',
      'M16.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3',
    ],
  },
  inbox: {
    viewBox: VIEW_BOX,
    paths: ['M4 4h16v16H4z', 'M4 14h5l2 3h2l2-3h5'],
  },
};

export default ICONOS;

export { default as Icon } from './Icon.jsx';
