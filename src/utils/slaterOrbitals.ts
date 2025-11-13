/**
 * Slater 타입 궤도함수 겹침 적분 계산
 */

import { Atom } from '../types';

/**
 * 두 원자 사이의 거리 계산 (Angstroms)
 */
export function distance(atom1: Atom, atom2: Atom): number {
  const dx = atom1.position.x - atom2.position.x;
  const dy = atom1.position.y - atom2.position.y;
  const dz = atom1.position.z - atom2.position.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Slater s-오비탈 간 겹침 적분
 * S_ss(R) 계산
 */
export function overlapSS(
  zeta1: number,
  zeta2: number,
  R: number
): number {
  if (R < 1e-6) return 1.0; // 같은 원자

  const xi = (zeta1 + zeta2) * R / 2;
  const delta = (zeta1 - zeta2) * R / 2;

  const S = Math.exp(-xi) * (
    1 + xi + xi * xi / 3
  );

  return S;
}

/**
 * s-오비탈과 p-오비탈 간 겹침 적분
 * S_sp(R) 계산
 */
export function overlapSP(
  zetaS: number,
  zetaP: number,
  R: number,
  cosTheta: number
): number {
  if (R < 1e-6) return 0.0;

  const xi = (zetaS + zetaP) * R / 2;

  const S = Math.exp(-xi) * xi * cosTheta * (1 + xi / 3);

  return S;
}

/**
 * p-오비탈 간 σ 겹침 적분
 * S_pσpσ(R) 계산
 */
export function overlapPSigma(
  zeta1: number,
  zeta2: number,
  R: number
): number {
  if (R < 1e-6) return 1.0;

  const xi = (zeta1 + zeta2) * R / 2;

  const S = Math.exp(-xi) * (
    1 + xi + (2 * xi * xi) / 5 + (xi * xi * xi) / 15
  );

  return S;
}

/**
 * p-오비탈 간 π 겹침 적분
 * S_pπpπ(R) 계산
 */
export function overlapPPi(
  zeta1: number,
  zeta2: number,
  R: number
): number {
  if (R < 1e-6) return 0.0;

  const xi = (zeta1 + zeta2) * R / 2;

  const S = Math.exp(-xi) * (
    1 - (xi * xi) / 5 - (xi * xi * xi) / 15
  );

  return S;
}

/**
 * 방향 코사인 계산
 */
export function directionCosines(
  atom1: Atom,
  atom2: Atom
): { x: number; y: number; z: number } {
  const dx = atom2.position.x - atom1.position.x;
  const dy = atom2.position.y - atom1.position.y;
  const dz = atom2.position.z - atom1.position.z;
  const r = Math.sqrt(dx * dx + dy * dy + dz * dz);

  if (r < 1e-6) {
    return { x: 0, y: 0, z: 0 };
  }

  return {
    x: dx / r,
    y: dy / r,
    z: dz / r
  };
}

/**
 * 두 궤도함수 간 겹침 적분 계산
 */
export function calculateOverlap(
  orbital1Type: string,
  orbital2Type: string,
  zeta1: number,
  zeta2: number,
  atom1: Atom,
  atom2: Atom
): number {
  const R = distance(atom1, atom2);

  // 같은 원자의 같은 궤도함수
  if (R < 1e-6 && orbital1Type === orbital2Type) {
    return 1.0;
  }

  // 같은 원자의 다른 궤도함수 (직교)
  if (R < 1e-6) {
    return 0.0;
  }

  const dc = directionCosines(atom1, atom2);

  // s-s 겹침
  if (orbital1Type === 's' && orbital2Type === 's') {
    return overlapSS(zeta1, zeta2, R);
  }

  // s-p 겹침
  if (orbital1Type === 's' && orbital2Type.startsWith('p')) {
    const axis = orbital2Type[1]; // 'x', 'y', or 'z'
    const cosTheta = axis === 'x' ? dc.x : axis === 'y' ? dc.y : dc.z;
    return overlapSP(zeta1, zeta2, R, cosTheta);
  }

  if (orbital1Type.startsWith('p') && orbital2Type === 's') {
    const axis = orbital1Type[1];
    const cosTheta = axis === 'x' ? dc.x : axis === 'y' ? dc.y : dc.z;
    return -overlapSP(zeta2, zeta1, R, cosTheta);
  }

  // p-p 겹침
  if (orbital1Type.startsWith('p') && orbital2Type.startsWith('p')) {
    const axis1 = orbital1Type[1];
    const axis2 = orbital2Type[1];

    // σ 결합 (같은 축)
    if (axis1 === axis2) {
      if (axis1 === 'x') {
        return overlapPSigma(zeta1, zeta2, R) * dc.x * dc.x +
               overlapPPi(zeta1, zeta2, R) * (1 - dc.x * dc.x);
      } else if (axis1 === 'y') {
        return overlapPSigma(zeta1, zeta2, R) * dc.y * dc.y +
               overlapPPi(zeta1, zeta2, R) * (1 - dc.y * dc.y);
      } else { // z
        return overlapPSigma(zeta1, zeta2, R) * dc.z * dc.z +
               overlapPPi(zeta1, zeta2, R) * (1 - dc.z * dc.z);
      }
    }

    // π 결합 (다른 축)
    const cosTheta1 = axis1 === 'x' ? dc.x : axis1 === 'y' ? dc.y : dc.z;
    const cosTheta2 = axis2 === 'x' ? dc.x : axis2 === 'y' ? dc.y : dc.z;
    return (overlapPSigma(zeta1, zeta2, R) - overlapPPi(zeta1, zeta2, R)) *
           cosTheta1 * cosTheta2;
  }

  // 기본값
  return 0.0;
}
