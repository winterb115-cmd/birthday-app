import { Agency } from './types';

export const AGENCIES: readonly Agency[] = [
  {
    id: 'AG001',
    name: 'Star Maker Production',
    unitIds: ['UN001', 'UN002', 'UN003', 'UN004'],
  },
  {
    id: 'AG002',
    name: 'Cosmic Production',
    unitIds: ['UN005', 'UN006', 'UN007', 'UN008'],
  },
  {
    id: 'AG003',
    name: 'Rhythm Link',
    unitIds: ['UN009', 'UN010', 'UN011', 'UN012'],
  },
  {
    id: 'AG004',
    name: 'New Dimention',
    unitIds: ['UN013', 'UN014', 'UN015', 'UN016'],
  },
  {
    id: 'AG005',
    name: 'Other',
    unitIds: ['UN017', 'UN018'],
  },
] as const;
