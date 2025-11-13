/**
 * Extended Hückel 분자 오비탈 계산
 */

import {
  Molecule,
  AtomicOrbital,
  MolecularOrbital,
  OrbitalCalculationResult,
  ELEMENTS
} from '../types';
import { calculateOverlap } from './slaterOrbitals';
import { solveGeneralizedEigenvalueProblem, zeroMatrix } from './matrixUtils';

const K_WOLFSBERG_HELMHOLZ = 1.75; // Wolfsberg-Helmholz 상수

/**
 * Extended Hückel 계산 메인 함수
 */
export function calculateExtendedHuckel(
  molecule: Molecule
): OrbitalCalculationResult {
  console.log('Starting Extended Hückel calculation...');

  // 1. 원자 궤도함수 생성
  const atomicOrbitals = generateAtomicOrbitals(molecule);
  console.log(`Generated ${atomicOrbitals.length} atomic orbitals`);

  // 2. 겹침 행렬 계산
  const overlapMatrix = calculateOverlapMatrix(molecule, atomicOrbitals);
  console.log('Calculated overlap matrix');

  // 3. 해밀토니안 행렬 계산
  const hamiltonianMatrix = calculateHamiltonianMatrix(
    molecule,
    atomicOrbitals,
    overlapMatrix
  );
  console.log('Calculated Hamiltonian matrix');

  // 4. 고유값 문제 풀기
  const { eigenvalues, eigenvectors } = solveGeneralizedEigenvalueProblem(
    hamiltonianMatrix,
    overlapMatrix
  );
  console.log('Solved eigenvalue problem');

  // 5. 전자 배치
  const totalElectrons = calculateTotalElectrons(molecule);
  const molecularOrbitals = constructMolecularOrbitals(
    eigenvalues,
    eigenvectors,
    atomicOrbitals,
    totalElectrons
  );

  // 6. HOMO/LUMO 찾기
  const { homo, lumo, homoLumoGap } = findHOMOLUMO(molecularOrbitals);

  // 7. 전체 에너지 계산
  const totalEnergy = calculateTotalEnergy(molecularOrbitals);

  console.log('Calculation complete!');
  console.log(`HOMO: ${homo}, LUMO: ${lumo}, Gap: ${homoLumoGap.toFixed(2)} eV`);

  return {
    molecularOrbitals,
    atomicOrbitals,
    overlapMatrix,
    hamiltonianMatrix,
    energyLevels: eigenvalues,
    homo,
    lumo,
    homoLumoGap,
    totalEnergy
  };
}

/**
 * 원자 궤도함수 생성
 */
function generateAtomicOrbitals(molecule: Molecule): AtomicOrbital[] {
  const orbitals: AtomicOrbital[] = [];

  molecule.atoms.forEach((atom, atomIndex) => {
    const element = ELEMENTS[atom.element];
    if (!element) {
      console.warn(`Unknown element: ${atom.element}`);
      return;
    }

    // s 오비탈
    if (element.orbitalEnergies.s !== undefined) {
      orbitals.push({
        atomId: atom.id,
        atomIndex,
        type: 's',
        energy: element.orbitalEnergies.s,
        slaterExponent: element.slaterExponents.s || 1.0
      });
    }

    // p 오비탈들
    if (element.orbitalEnergies.p !== undefined && element.atomicNumber > 2) {
      ['px', 'py', 'pz'].forEach(type => {
        orbitals.push({
          atomId: atom.id,
          atomIndex,
          type: type as 'px' | 'py' | 'pz',
          energy: element.orbitalEnergies.p!,
          slaterExponent: element.slaterExponents.p || 1.0
        });
      });
    }
  });

  return orbitals;
}

/**
 * 겹침 행렬 S 계산
 */
function calculateOverlapMatrix(
  molecule: Molecule,
  atomicOrbitals: AtomicOrbital[]
): number[][] {
  const n = atomicOrbitals.length;
  const S = zeroMatrix(n, n);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      const ao1 = atomicOrbitals[i];
      const ao2 = atomicOrbitals[j];
      const atom1 = molecule.atoms[ao1.atomIndex];
      const atom2 = molecule.atoms[ao2.atomIndex];

      const overlap = calculateOverlap(
        ao1.type,
        ao2.type,
        ao1.slaterExponent,
        ao2.slaterExponent,
        atom1,
        atom2
      );

      S[i][j] = overlap;
      S[j][i] = overlap; // 대칭
    }
  }

  return S;
}

/**
 * 해밀토니안 행렬 H 계산 (Wolfsberg-Helmholz 근사)
 */
function calculateHamiltonianMatrix(
  molecule: Molecule,
  atomicOrbitals: AtomicOrbital[],
  overlapMatrix: number[][]
): number[][] {
  const n = atomicOrbitals.length;
  const H = zeroMatrix(n, n);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      if (i === j) {
        // 대각 원소: 원자 궤도함수 에너지
        H[i][i] = atomicOrbitals[i].energy;
      } else {
        // 비대각 원소: Wolfsberg-Helmholz 공식
        // H_ij = K * S_ij * (H_ii + H_jj) / 2
        const ao1 = atomicOrbitals[i];
        const ao2 = atomicOrbitals[j];

        H[i][j] = K_WOLFSBERG_HELMHOLZ * overlapMatrix[i][j] *
                  (ao1.energy + ao2.energy) / 2;
        H[j][i] = H[i][j]; // 대칭
      }
    }
  }

  return H;
}

/**
 * 분자 오비탈 구성
 */
function constructMolecularOrbitals(
  eigenvalues: number[],
  eigenvectors: number[][],
  atomicOrbitals: AtomicOrbital[],
  totalElectrons: number
): MolecularOrbital[] {
  const molecularOrbitals: MolecularOrbital[] = [];
  let remainingElectrons = totalElectrons;

  for (let i = 0; i < eigenvalues.length; i++) {
    const coefficients = eigenvectors.map(row => row[i]);

    // 전자 점유
    let occupancy = 0;
    if (remainingElectrons >= 2) {
      occupancy = 2;
      remainingElectrons -= 2;
    } else if (remainingElectrons === 1) {
      occupancy = 1;
      remainingElectrons -= 1;
    }

    // 결합 타입 판단 (간단한 휴리스틱)
    const type = determineOrbitalType(eigenvalues[i], i, eigenvalues.length);

    molecularOrbitals.push({
      energy: eigenvalues[i],
      coefficients,
      occupancy,
      type
    });
  }

  return molecularOrbitals;
}

/**
 * 오비탈 타입 판단
 */
function determineOrbitalType(
  energy: number,
  index: number,
  totalOrbitals: number
): 'bonding' | 'antibonding' | 'nonbonding' {
  // 간단한 휴리스틱: 낮은 에너지 = bonding, 높은 에너지 = antibonding
  if (index < totalOrbitals / 3) {
    return 'bonding';
  } else if (index > (2 * totalOrbitals) / 3) {
    return 'antibonding';
  } else {
    return 'nonbonding';
  }
}

/**
 * 총 전자 수 계산
 */
function calculateTotalElectrons(molecule: Molecule): number {
  let total = 0;

  molecule.atoms.forEach(atom => {
    const element = ELEMENTS[atom.element];
    if (element) {
      total += element.valenceElectrons;
    }
  });

  return total - molecule.charge;
}

/**
 * HOMO/LUMO 찾기
 */
function findHOMOLUMO(molecularOrbitals: MolecularOrbital[]): {
  homo: number;
  lumo: number;
  homoLumoGap: number;
} {
  let homo = -1;
  let lumo = -1;

  for (let i = 0; i < molecularOrbitals.length; i++) {
    if (molecularOrbitals[i].occupancy > 0) {
      homo = i;
    } else if (lumo === -1) {
      lumo = i;
      break;
    }
  }

  const homoLumoGap =
    homo >= 0 && lumo >= 0
      ? molecularOrbitals[lumo].energy - molecularOrbitals[homo].energy
      : 0;

  return { homo, lumo, homoLumoGap };
}

/**
 * 전체 전자 에너지 계산
 */
function calculateTotalEnergy(molecularOrbitals: MolecularOrbital[]): number {
  return molecularOrbitals.reduce(
    (sum, mo) => sum + mo.energy * mo.occupancy,
    0
  );
}
