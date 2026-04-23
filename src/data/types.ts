export interface Character {
  id: string;
  name: string;
  birthday: { month: number; day: number };
  agencyId: string;
  unitId: string;
}

export interface Unit {
  id: string;
  name: string;
  agencyId: string;
  characterIds: string[];
}

export interface Agency {
  id: string;
  name: string;
  unitIds: string[];
}
