import { create } from 'zustand';
import {
  Molecule,
  Atom,
  Bond,
  BondType,
  OrbitalCalculationResult,
  VisualizationSettings,
  EXAMPLE_MOLECULES,
  DEFAULT_CHARGE,
  DEFAULT_MULTIPLICITY
} from '../types';
import { calculateExtendedHuckel } from '../utils/extendedHuckel';
import { calculateSimpleHuckel } from '../utils/simpleHuckel';

interface MoleculeStore {
  // 분자 데이터
  molecule: Molecule;
  calculationResult: OrbitalCalculationResult | null;

  // UI 상태
  editMode: 'atom' | 'bond' | 'delete' | 'move';
  selectedAtomElement: string;
  selectedBondType: BondType;
  selectedAtomId: string | null;
  isCalculating: boolean;

  // 시각화 설정
  visualization: VisualizationSettings;

  // 액션
  setMolecule: (molecule: Molecule) => void;
  loadExample: (exampleId: string) => void;
  addAtom: (element: string, x: number, y: number, z?: number) => void;
  removeAtom: (atomId: string) => void;
  moveAtom: (atomId: string, x: number, y: number, z?: number) => void;
  addBond: (atom1Id: string, atom2Id: string, type: BondType) => void;
  removeBond: (bondId: string) => void;
  updateBondType: (bondId: string, type: BondType) => void;

  setEditMode: (mode: 'atom' | 'bond' | 'delete' | 'move') => void;
  setSelectedAtomElement: (element: string) => void;
  setSelectedBondType: (type: BondType) => void;
  setSelectedAtomId: (atomId: string | null) => void;

  runCalculation: () => Promise<void>;

  setVisualization: (settings: Partial<VisualizationSettings>) => void;
  selectOrbital: (index: number) => void;

  clearMolecule: () => void;
}

const createEmptyMolecule = (): Molecule => ({
  id: 'new-molecule',
  name: 'New Molecule',
  atoms: [],
  bonds: [],
  charge: DEFAULT_CHARGE,
  multiplicity: DEFAULT_MULTIPLICITY
});

const defaultVisualization: VisualizationSettings = {
  showAtoms: true,
  showBonds: true,
  showOrbital: true,
  orbitalIndex: 0,
  orbitalOpacity: 0.7,
  isovalue: 0.02,
  colorScheme: 'phase',
  showEnergyLevels: true,
  cameraPosition: 'perspective'
};

export const useMoleculeStore = create<MoleculeStore>((set, get) => ({
  // 초기 상태
  molecule: EXAMPLE_MOLECULES.benzene,
  calculationResult: null,
  editMode: 'atom',
  selectedAtomElement: 'C',
  selectedBondType: 'single',
  selectedAtomId: null,
  isCalculating: false,
  visualization: defaultVisualization,

  // 분자 설정
  setMolecule: (molecule) => set({ molecule, calculationResult: null }),

  // 예제 로드
  loadExample: (exampleId) => {
    const example = EXAMPLE_MOLECULES[exampleId];
    if (example) {
      set({ molecule: example, calculationResult: null });
    }
  },

  // 원자 추가
  addAtom: (element, x, y, z = 0) => {
    const { molecule } = get();
    const newAtom: Atom = {
      id: `atom-${Date.now()}-${Math.random()}`,
      element,
      position: { x, y, z }
    };

    set({
      molecule: {
        ...molecule,
        atoms: [...molecule.atoms, newAtom]
      },
      calculationResult: null
    });
  },

  // 원자 제거
  removeAtom: (atomId) => {
    const { molecule } = get();
    set({
      molecule: {
        ...molecule,
        atoms: molecule.atoms.filter(a => a.id !== atomId),
        bonds: molecule.bonds.filter(b =>
          b.atom1Id !== atomId && b.atom2Id !== atomId
        )
      },
      calculationResult: null
    });
  },

  // 원자 이동
  moveAtom: (atomId, x, y, z = 0) => {
    const { molecule } = get();
    set({
      molecule: {
        ...molecule,
        atoms: molecule.atoms.map(a =>
          a.id === atomId ? { ...a, position: { x, y, z } } : a
        )
      },
      calculationResult: null
    });
  },

  // 결합 추가
  addBond: (atom1Id, atom2Id, type) => {
    const { molecule } = get();

    // 이미 결합이 존재하는지 확인
    const existingBond = molecule.bonds.find(b =>
      (b.atom1Id === atom1Id && b.atom2Id === atom2Id) ||
      (b.atom1Id === atom2Id && b.atom2Id === atom1Id)
    );

    if (existingBond) {
      console.warn('Bond already exists between these atoms');
      return;
    }

    const bondOrder = type === 'single' ? 1 : type === 'double' ? 2 :
                      type === 'triple' ? 3 : 1.5;

    const newBond: Bond = {
      id: `bond-${Date.now()}-${Math.random()}`,
      atom1Id,
      atom2Id,
      type,
      order: bondOrder
    };

    set({
      molecule: {
        ...molecule,
        bonds: [...molecule.bonds, newBond]
      },
      calculationResult: null
    });
  },

  // 결합 제거
  removeBond: (bondId) => {
    const { molecule } = get();
    set({
      molecule: {
        ...molecule,
        bonds: molecule.bonds.filter(b => b.id !== bondId)
      },
      calculationResult: null
    });
  },

  // 결합 타입 업데이트
  updateBondType: (bondId, type) => {
    const { molecule } = get();
    const bondOrder = type === 'single' ? 1 : type === 'double' ? 2 :
                      type === 'triple' ? 3 : 1.5;

    set({
      molecule: {
        ...molecule,
        bonds: molecule.bonds.map(b =>
          b.id === bondId ? { ...b, type, order: bondOrder } : b
        )
      },
      calculationResult: null
    });
  },

  // UI 상태 설정
  setEditMode: (mode) => set({ editMode: mode }),
  setSelectedAtomElement: (element) => set({ selectedAtomElement: element }),
  setSelectedBondType: (type) => set({ selectedBondType: type }),
  setSelectedAtomId: (atomId) => set({ selectedAtomId: atomId }),

  // 계산 실행
  runCalculation: async () => {
    const { molecule } = get();

    if (molecule.atoms.length === 0) {
      alert('분자에 원자가 없습니다!');
      return;
    }

    set({ isCalculating: true });

    try {
      // 즉시 계산 실행 (지연 제거)
      const result = await new Promise<OrbitalCalculationResult>((resolve, reject) => {
        // UI 업데이트를 위한 최소 지연
        setTimeout(() => {
          try {
            const startTime = performance.now();

            // 간단한 버전 먼저 시도 (더 안정적)
            console.log('📊 간단한 Hückel 계산 사용 중...');
            const calculationResult = calculateSimpleHuckel(molecule);

            const endTime = performance.now();
            console.log(`⏱️ 계산 완료: ${(endTime - startTime).toFixed(0)}ms`);
            resolve(calculationResult);
          } catch (error) {
            console.error('계산 실패:', error);
            reject(error);
          }
        }, 10);
      });

      set({
        calculationResult: result,
        isCalculating: false,
        visualization: {
          ...get().visualization,
          orbitalIndex: result.homo >= 0 ? result.homo : 0
        }
      });

      console.log('Calculation completed successfully!');
    } catch (error) {
      console.error('Calculation error:', error);
      set({ isCalculating: false });
      alert('계산 중 오류가 발생했습니다.');
    }
  },

  // 시각화 설정
  setVisualization: (settings) => {
    set({
      visualization: {
        ...get().visualization,
        ...settings
      }
    });
  },

  // 오비탈 선택
  selectOrbital: (index) => {
    const { calculationResult } = get();
    if (calculationResult && index >= 0 && index < calculationResult.molecularOrbitals.length) {
      set({
        visualization: {
          ...get().visualization,
          orbitalIndex: index
        }
      });
    }
  },

  // 분자 초기화
  clearMolecule: () => {
    set({
      molecule: createEmptyMolecule(),
      calculationResult: null,
      selectedAtomId: null
    });
  }
}));
