// ============= 원소 정보 =============
export interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  mass: number;
  color: string;
  radius: number; // van der Waals radius in Angstroms
  electronConfiguration: string;
  valenceElectrons: number;
  // Extended Hückel parameters
  orbitalEnergies: {
    s?: number;  // eV
    p?: number;  // eV
    d?: number;  // eV
  };
  slaterExponents: {
    s?: number;
    p?: number;
    d?: number;
  };
}

// ============= 분자 구조 =============
export interface Atom {
  id: string;
  element: string;
  position: {
    x: number;  // Angstroms
    y: number;
    z: number;
  };
  charge?: number;  // formal charge
}

export type BondType = 'single' | 'double' | 'triple' | 'aromatic';

export interface Bond {
  id: string;
  atom1Id: string;
  atom2Id: string;
  type: BondType;
  order: number;  // 1, 2, 3, or 1.5 for aromatic
}

export interface Molecule {
  id: string;
  name: string;
  atoms: Atom[];
  bonds: Bond[];
  charge: number;
  multiplicity: number;  // 2S+1, where S is total spin
}

// ============= 오비탈 및 계산 결과 =============
export interface MolecularOrbital {
  energy: number;  // eV
  coefficients: number[];  // LCAO coefficients for each atomic orbital
  occupancy: number;  // 0, 1, or 2
  type: 'bonding' | 'antibonding' | 'nonbonding';
}

export interface OrbitalCalculationResult {
  molecularOrbitals: MolecularOrbital[];
  atomicOrbitals: AtomicOrbital[];
  overlapMatrix: number[][];
  hamiltonianMatrix: number[][];
  energyLevels: number[];
  homo: number;  // index of HOMO
  lumo: number;  // index of LUMO
  homoLumoGap: number;  // eV
  totalEnergy: number;  // eV
}

export interface AtomicOrbital {
  atomId: string;
  atomIndex: number;
  type: 's' | 'px' | 'py' | 'pz' | 'dxy' | 'dyz' | 'dxz' | 'dx2y2' | 'dz2';
  energy: number;  // eV
  slaterExponent: number;
}

// ============= 시각화 설정 =============
export interface VisualizationSettings {
  showAtoms: boolean;
  showBonds: boolean;
  showOrbital: boolean;
  orbitalIndex: number;
  orbitalOpacity: number;
  isovalue: number;  // electron density threshold
  colorScheme: 'phase' | 'density';
  showEnergyLevels: boolean;
  cameraPosition: 'front' | 'side' | 'top' | 'perspective';
}

// ============= 앱 상태 =============
export interface AppState {
  molecule: Molecule;
  calculationResult: OrbitalCalculationResult | null;
  visualization: VisualizationSettings;
  isCalculating: boolean;
  editMode: 'atom' | 'bond' | 'delete' | 'move';
  selectedAtomElement: string;
  selectedBondType: BondType;
}

// ============= 원소 데이터베이스 =============
export const ELEMENTS: Record<string, Element> = {
  H: {
    symbol: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    mass: 1.008,
    color: '#FFFFFF',
    radius: 1.20,
    electronConfiguration: '1s1',
    valenceElectrons: 1,
    orbitalEnergies: { s: -13.6 },
    slaterExponents: { s: 1.0 }
  },
  C: {
    symbol: 'C',
    name: 'Carbon',
    atomicNumber: 6,
    mass: 12.011,
    color: '#909090',
    radius: 1.70,
    electronConfiguration: '1s2 2s2 2p2',
    valenceElectrons: 4,
    orbitalEnergies: { s: -21.4, p: -11.4 },
    slaterExponents: { s: 1.625, p: 1.625 }
  },
  N: {
    symbol: 'N',
    name: 'Nitrogen',
    atomicNumber: 7,
    mass: 14.007,
    color: '#3050F8',
    radius: 1.55,
    electronConfiguration: '1s2 2s2 2p3',
    valenceElectrons: 5,
    orbitalEnergies: { s: -26.0, p: -13.4 },
    slaterExponents: { s: 1.950, p: 1.950 }
  },
  O: {
    symbol: 'O',
    name: 'Oxygen',
    atomicNumber: 8,
    mass: 15.999,
    color: '#FF0D0D',
    radius: 1.52,
    electronConfiguration: '1s2 2s2 2p4',
    valenceElectrons: 6,
    orbitalEnergies: { s: -32.3, p: -14.8 },
    slaterExponents: { s: 2.275, p: 2.275 }
  },
  F: {
    symbol: 'F',
    name: 'Fluorine',
    atomicNumber: 9,
    mass: 18.998,
    color: '#90E050',
    radius: 1.47,
    electronConfiguration: '1s2 2s2 2p5',
    valenceElectrons: 7,
    orbitalEnergies: { s: -40.0, p: -18.1 },
    slaterExponents: { s: 2.600, p: 2.600 }
  },
  S: {
    symbol: 'S',
    name: 'Sulfur',
    atomicNumber: 16,
    mass: 32.065,
    color: '#FFFF30',
    radius: 1.80,
    electronConfiguration: '1s2 2s2 2p6 3s2 3p4',
    valenceElectrons: 6,
    orbitalEnergies: { s: -20.0, p: -11.0 },
    slaterExponents: { s: 1.817, p: 1.817 }
  },
  Cl: {
    symbol: 'Cl',
    name: 'Chlorine',
    atomicNumber: 17,
    mass: 35.453,
    color: '#1FF01F',
    radius: 1.75,
    electronConfiguration: '1s2 2s2 2p6 3s2 3p5',
    valenceElectrons: 7,
    orbitalEnergies: { s: -26.3, p: -14.2 },
    slaterExponents: { s: 2.033, p: 2.033 }
  }
};

// ============= 상수 =============
export const BOND_LENGTHS: Record<string, number> = {
  'H-H': 0.74,
  'C-H': 1.09,
  'C-C': 1.54,
  'C=C': 1.34,
  'C≡C': 1.20,
  'C-N': 1.47,
  'C=N': 1.29,
  'C≡N': 1.16,
  'C-O': 1.43,
  'C=O': 1.20,
  'N-H': 1.01,
  'O-H': 0.96,
  'N-N': 1.45,
  'N=N': 1.25,
  'O-O': 1.48
};

export const GRID_SIZE = 40; // pixels per Angstrom for 2D canvas
export const DEFAULT_CHARGE = 0;
export const DEFAULT_MULTIPLICITY = 1;

// ============= 예제 분자 =============
export const EXAMPLE_MOLECULES: Record<string, Molecule> = {
  benzene: {
    id: 'benzene',
    name: 'Benzene',
    charge: 0,
    multiplicity: 1,
    atoms: [
      { id: 'C1', element: 'C', position: { x: 1.2, y: 0, z: 0 } },
      { id: 'C2', element: 'C', position: { x: 0.6, y: 1.04, z: 0 } },
      { id: 'C3', element: 'C', position: { x: -0.6, y: 1.04, z: 0 } },
      { id: 'C4', element: 'C', position: { x: -1.2, y: 0, z: 0 } },
      { id: 'C5', element: 'C', position: { x: -0.6, y: -1.04, z: 0 } },
      { id: 'C6', element: 'C', position: { x: 0.6, y: -1.04, z: 0 } },
      { id: 'H1', element: 'H', position: { x: 2.28, y: 0, z: 0 } },
      { id: 'H2', element: 'H', position: { x: 1.14, y: 1.98, z: 0 } },
      { id: 'H3', element: 'H', position: { x: -1.14, y: 1.98, z: 0 } },
      { id: 'H4', element: 'H', position: { x: -2.28, y: 0, z: 0 } },
      { id: 'H5', element: 'H', position: { x: -1.14, y: -1.98, z: 0 } },
      { id: 'H6', element: 'H', position: { x: 1.14, y: -1.98, z: 0 } }
    ],
    bonds: [
      { id: 'B1', atom1Id: 'C1', atom2Id: 'C2', type: 'aromatic', order: 1.5 },
      { id: 'B2', atom1Id: 'C2', atom2Id: 'C3', type: 'aromatic', order: 1.5 },
      { id: 'B3', atom1Id: 'C3', atom2Id: 'C4', type: 'aromatic', order: 1.5 },
      { id: 'B4', atom1Id: 'C4', atom2Id: 'C5', type: 'aromatic', order: 1.5 },
      { id: 'B5', atom1Id: 'C5', atom2Id: 'C6', type: 'aromatic', order: 1.5 },
      { id: 'B6', atom1Id: 'C6', atom2Id: 'C1', type: 'aromatic', order: 1.5 },
      { id: 'B7', atom1Id: 'C1', atom2Id: 'H1', type: 'single', order: 1 },
      { id: 'B8', atom1Id: 'C2', atom2Id: 'H2', type: 'single', order: 1 },
      { id: 'B9', atom1Id: 'C3', atom2Id: 'H3', type: 'single', order: 1 },
      { id: 'B10', atom1Id: 'C4', atom2Id: 'H4', type: 'single', order: 1 },
      { id: 'B11', atom1Id: 'C5', atom2Id: 'H5', type: 'single', order: 1 },
      { id: 'B12', atom1Id: 'C6', atom2Id: 'H6', type: 'single', order: 1 }
    ]
  },
  ethylene: {
    id: 'ethylene',
    name: 'Ethylene',
    charge: 0,
    multiplicity: 1,
    atoms: [
      { id: 'C1', element: 'C', position: { x: 0, y: 0, z: 0 } },
      { id: 'C2', element: 'C', position: { x: 1.34, y: 0, z: 0 } },
      { id: 'H1', element: 'H', position: { x: -0.54, y: 0.93, z: 0 } },
      { id: 'H2', element: 'H', position: { x: -0.54, y: -0.93, z: 0 } },
      { id: 'H3', element: 'H', position: { x: 1.88, y: 0.93, z: 0 } },
      { id: 'H4', element: 'H', position: { x: 1.88, y: -0.93, z: 0 } }
    ],
    bonds: [
      { id: 'B1', atom1Id: 'C1', atom2Id: 'C2', type: 'double', order: 2 },
      { id: 'B2', atom1Id: 'C1', atom2Id: 'H1', type: 'single', order: 1 },
      { id: 'B3', atom1Id: 'C1', atom2Id: 'H2', type: 'single', order: 1 },
      { id: 'B4', atom1Id: 'C2', atom2Id: 'H3', type: 'single', order: 1 },
      { id: 'B5', atom1Id: 'C2', atom2Id: 'H4', type: 'single', order: 1 }
    ]
  },
  water: {
    id: 'water',
    name: 'Water',
    charge: 0,
    multiplicity: 1,
    atoms: [
      { id: 'O1', element: 'O', position: { x: 0, y: 0, z: 0 } },
      { id: 'H1', element: 'H', position: { x: 0.76, y: 0.59, z: 0 } },
      { id: 'H2', element: 'H', position: { x: -0.76, y: 0.59, z: 0 } }
    ],
    bonds: [
      { id: 'B1', atom1Id: 'O1', atom2Id: 'H1', type: 'single', order: 1 },
      { id: 'B2', atom1Id: 'O1', atom2Id: 'H2', type: 'single', order: 1 }
    ]
  },
  methane: {
    id: 'methane',
    name: 'Methane',
    charge: 0,
    multiplicity: 1,
    atoms: [
      { id: 'C1', element: 'C', position: { x: 0, y: 0, z: 0 } },
      { id: 'H1', element: 'H', position: { x: 0.63, y: 0.63, z: 0.63 } },
      { id: 'H2', element: 'H', position: { x: -0.63, y: -0.63, z: 0.63 } },
      { id: 'H3', element: 'H', position: { x: -0.63, y: 0.63, z: -0.63 } },
      { id: 'H4', element: 'H', position: { x: 0.63, y: -0.63, z: -0.63 } }
    ],
    bonds: [
      { id: 'B1', atom1Id: 'C1', atom2Id: 'H1', type: 'single', order: 1 },
      { id: 'B2', atom1Id: 'C1', atom2Id: 'H2', type: 'single', order: 1 },
      { id: 'B3', atom1Id: 'C1', atom2Id: 'H3', type: 'single', order: 1 },
      { id: 'B4', atom1Id: 'C1', atom2Id: 'H4', type: 'single', order: 1 }
    ]
  },
  ammonia: {
    id: 'ammonia',
    name: 'Ammonia',
    charge: 0,
    multiplicity: 1,
    atoms: [
      { id: 'N1', element: 'N', position: { x: 0, y: 0, z: 0 } },
      { id: 'H1', element: 'H', position: { x: 0, y: 0.94, z: 0.38 } },
      { id: 'H2', element: 'H', position: { x: 0.81, y: -0.47, z: 0.38 } },
      { id: 'H3', element: 'H', position: { x: -0.81, y: -0.47, z: 0.38 } }
    ],
    bonds: [
      { id: 'B1', atom1Id: 'N1', atom2Id: 'H1', type: 'single', order: 1 },
      { id: 'B2', atom1Id: 'N1', atom2Id: 'H2', type: 'single', order: 1 },
      { id: 'B3', atom1Id: 'N1', atom2Id: 'H3', type: 'single', order: 1 }
    ]
  },
  co2: {
    id: 'co2',
    name: 'Carbon Dioxide',
    charge: 0,
    multiplicity: 1,
    atoms: [
      { id: 'C1', element: 'C', position: { x: 0, y: 0, z: 0 } },
      { id: 'O1', element: 'O', position: { x: -1.16, y: 0, z: 0 } },
      { id: 'O2', element: 'O', position: { x: 1.16, y: 0, z: 0 } }
    ],
    bonds: [
      { id: 'B1', atom1Id: 'C1', atom2Id: 'O1', type: 'double', order: 2 },
      { id: 'B2', atom1Id: 'C1', atom2Id: 'O2', type: 'double', order: 2 }
    ]
  },
  acetylene: {
    id: 'acetylene',
    name: 'Acetylene',
    charge: 0,
    multiplicity: 1,
    atoms: [
      { id: 'C1', element: 'C', position: { x: -0.6, y: 0, z: 0 } },
      { id: 'C2', element: 'C', position: { x: 0.6, y: 0, z: 0 } },
      { id: 'H1', element: 'H', position: { x: -1.66, y: 0, z: 0 } },
      { id: 'H2', element: 'H', position: { x: 1.66, y: 0, z: 0 } }
    ],
    bonds: [
      { id: 'B1', atom1Id: 'C1', atom2Id: 'C2', type: 'triple', order: 3 },
      { id: 'B2', atom1Id: 'C1', atom2Id: 'H1', type: 'single', order: 1 },
      { id: 'B3', atom1Id: 'C2', atom2Id: 'H2', type: 'single', order: 1 }
    ]
  },
  formaldehyde: {
    id: 'formaldehyde',
    name: 'Formaldehyde',
    charge: 0,
    multiplicity: 1,
    atoms: [
      { id: 'C1', element: 'C', position: { x: 0, y: 0, z: 0 } },
      { id: 'O1', element: 'O', position: { x: 0, y: 1.21, z: 0 } },
      { id: 'H1', element: 'H', position: { x: 0.94, y: -0.59, z: 0 } },
      { id: 'H2', element: 'H', position: { x: -0.94, y: -0.59, z: 0 } }
    ],
    bonds: [
      { id: 'B1', atom1Id: 'C1', atom2Id: 'O1', type: 'double', order: 2 },
      { id: 'B2', atom1Id: 'C1', atom2Id: 'H1', type: 'single', order: 1 },
      { id: 'B3', atom1Id: 'C1', atom2Id: 'H2', type: 'single', order: 1 }
    ]
  },
  methanol: {
    id: 'methanol',
    name: 'Methanol',
    charge: 0,
    multiplicity: 1,
    atoms: [
      { id: 'C1', element: 'C', position: { x: 0, y: 0, z: 0 } },
      { id: 'O1', element: 'O', position: { x: 1.43, y: 0, z: 0 } },
      { id: 'H1', element: 'H', position: { x: -0.36, y: 1.03, z: 0 } },
      { id: 'H2', element: 'H', position: { x: -0.36, y: -0.52, z: 0.89 } },
      { id: 'H3', element: 'H', position: { x: -0.36, y: -0.52, z: -0.89 } },
      { id: 'H4', element: 'H', position: { x: 1.79, y: 0.59, z: 0.59 } }
    ],
    bonds: [
      { id: 'B1', atom1Id: 'C1', atom2Id: 'O1', type: 'single', order: 1 },
      { id: 'B2', atom1Id: 'C1', atom2Id: 'H1', type: 'single', order: 1 },
      { id: 'B3', atom1Id: 'C1', atom2Id: 'H2', type: 'single', order: 1 },
      { id: 'B4', atom1Id: 'C1', atom2Id: 'H3', type: 'single', order: 1 },
      { id: 'B5', atom1Id: 'O1', atom2Id: 'H4', type: 'single', order: 1 }
    ]
  }
};
