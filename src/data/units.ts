import { Unit } from './types';

export const UNITS: readonly Unit[] = [
  {
    id: 'UN001',
    name: 'fine',
    agencyId: 'AG001',
    characterIds: ['CH001', 'CH002', 'CH003', 'CH004'],
  },
  {
    id: 'UN002',
    name: 'Trickstar',
    agencyId: 'AG001',
    characterIds: ['CH005', 'CH006', 'CH007', 'CH008'],
  },
  {
    id: 'UN003',
    name: '유성대',
    agencyId: 'AG001',
    characterIds: ['CH009', 'CH010', 'CH011', 'CH012', 'CH013'],
  },
  {
    id: 'UN004',
    name: 'ALKALOID',
    agencyId: 'AG001',
    characterIds: ['CH014', 'CH015', 'CH016', 'CH017'],
  },
  {
    id: 'UN005',
    name: 'Eden',
    agencyId: 'AG002',
    characterIds: ['CH018', 'CH019', 'CH020', 'CH021'],
  },
  {
    id: 'UN006',
    name: 'Valkyrie',
    agencyId: 'AG002',
    characterIds: ['CH022', 'CH023'],
  },
  {
    id: 'UN007',
    name: '2wink',
    agencyId: 'AG002',
    characterIds: ['CH024', 'CH025'],
  },
  {
    id: 'UN008',
    name: 'Crazy:B',
    agencyId: 'AG002',
    characterIds: ['CH026', 'CH027', 'CH028', 'CH029'],
  },
  {
    id: 'UN009',
    name: 'UNDEAD',
    agencyId: 'AG003',
    characterIds: ['CH030', 'CH031', 'CH032', 'CH033'],
  },
  {
    id: 'UN010',
    name: 'Ra*bits',
    agencyId: 'AG003',
    characterIds: ['CH034', 'CH035', 'CH036', 'CH037'],
  },
  {
    id: 'UN011',
    name: '홍월',
    agencyId: 'AG003',
    characterIds: ['CH038', 'CH039', 'CH040', 'CH041'],
  },
  {
    id: 'UN012',
    name: 'MELLOW DEAR US',
    agencyId: 'AG003',
    characterIds: ['CH042', 'CH043', 'CH044', 'CH045'],
  },
  {
    id: 'UN013',
    name: 'Knights',
    agencyId: 'AG004',
    characterIds: ['CH046', 'CH047', 'CH048', 'CH049', 'CH050'],
  },
  {
    id: 'UN014',
    name: 'Switch',
    agencyId: 'AG004',
    characterIds: ['CH051', 'CH052', 'CH053'],
  },
  {
    id: 'UN015',
    name: 'MaM',
    agencyId: 'AG004',
    characterIds: ['CH054'],
  },
  {
    id: 'UN016',
    name: 'Special for Princess!',
    agencyId: 'AG004',
    characterIds: ['CH055', 'CH056', 'CH057', 'CH058'],
  },
  {
    id: 'UN017',
    name: 'teacher',
    agencyId: 'AG005',
    characterIds: ['CH059', 'CH060'],
  },
  {
    id: 'UN018',
    name: 'producer',
    agencyId: 'AG005',
    characterIds: ['CH061'],
  },
] as const;
