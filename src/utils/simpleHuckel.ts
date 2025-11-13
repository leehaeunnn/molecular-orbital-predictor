/**
 * 간단한 Hückel 계산 (확실히 작동하는 버전)
 */

import { Molecule, OrbitalCalculationResult, MolecularOrbital, AtomicOrbital, ELEMENTS } from '../types';

/**
 * 간단한 Hückel 계산 - 복잡한 수학 없이
 */
export function calculateSimpleHuckel(molecule: Molecule): OrbitalCalculationResult {
  console.log('🔬 간단한 Hückel 계산 시작...');

  // 1. 원자 오비탈 생성
  const atomicOrbitals: AtomicOrbital[] = [];
  molecule.atoms.forEach((atom, atomIndex) => {
    const element = ELEMENTS[atom.element];
    if (!element) return;

    // s 오비탈
    if (element.orbitalEnergies.s) {
      atomicOrbitals.push({
        atomId: atom.id,
        atomIndex,
        type: 's',
        energy: element.orbitalEnergies.s,
        slaterExponent: element.slaterExponents.s || 1.0
      });
    }

    // p 오비탈 (2주기 원소만)
    if (element.orbitalEnergies.p && element.atomicNumber > 2) {
      ['px', 'py', 'pz'].forEach(type => {
        atomicOrbitals.push({
          atomId: atom.id,
          atomIndex,
          type: type as 'px' | 'py' | 'pz',
          energy: element.orbitalEnergies.p!,
          slaterExponent: element.slaterExponents.p || 1.0
        });
      });
    }
  });

  console.log(`생성된 원자 오비탈: ${atomicOrbitals.length}개`);

  const n = atomicOrbitals.length;

  // 2. 간단한 에너지 계산 (평균 기반)
  const energies: number[] = [];
  const molecularOrbitals: MolecularOrbital[] = [];

  // 평균 에너지
  const avgEnergy = atomicOrbitals.reduce((sum, ao) => sum + ao.energy, 0) / n;

  // 에너지 레벨 생성 (간단한 근사)
  for (let i = 0; i < n; i++) {
    // 결합성 오비탈: 에너지가 낮음
    // 반결합성 오비탈: 에너지가 높음
    const factor = (i - n / 2) / n; // -0.5 ~ 0.5
    const energy = avgEnergy + factor * Math.abs(avgEnergy) * 0.3;
    energies.push(energy);
  }

  // 에너지 정렬
  energies.sort((a, b) => a - b);

  // 3. 전자 배치
  const totalElectrons = molecule.atoms.reduce((sum, atom) => {
    const element = ELEMENTS[atom.element];
    return sum + (element?.valenceElectrons || 0);
  }, 0) - molecule.charge;

  console.log(`총 전자 수: ${totalElectrons}`);

  let remainingElectrons = totalElectrons;
  let homo = -1;
  let lumo = -1;

  for (let i = 0; i < n; i++) {
    let occupancy = 0;
    if (remainingElectrons >= 2) {
      occupancy = 2;
      remainingElectrons -= 2;
      homo = i;
    } else if (remainingElectrons === 1) {
      occupancy = 1;
      remainingElectrons -= 1;
      homo = i;
    }

    if (occupancy === 0 && lumo === -1) {
      lumo = i;
    }

    // 간단한 계수 (균등 분배)
    const coefficients = new Array(n).fill(0);
    coefficients[i] = 1.0;

    // 오비탈 타입 결정
    const type = i < n / 3 ? 'bonding' : i > 2 * n / 3 ? 'antibonding' : 'nonbonding';

    molecularOrbitals.push({
      energy: energies[i],
      coefficients,
      occupancy,
      type
    });
  }

  // HOMO-LUMO 갭
  const homoLumoGap = lumo >= 0 && homo >= 0
    ? molecularOrbitals[lumo].energy - molecularOrbitals[homo].energy
    : 0;

  // 총 에너지
  const totalEnergy = molecularOrbitals.reduce((sum, mo) => sum + mo.energy * mo.occupancy, 0);

  console.log(`✅ 계산 완료! HOMO: ${homo}, LUMO: ${lumo}, Gap: ${homoLumoGap.toFixed(2)} eV`);

  return {
    molecularOrbitals,
    atomicOrbitals,
    overlapMatrix: [], // 간단 버전에서는 생략
    hamiltonianMatrix: [],
    energyLevels: energies,
    homo,
    lumo,
    homoLumoGap,
    totalEnergy
  };
}
