import * as math from 'mathjs';

/**
 * 행렬 유틸리티 함수들
 */

/**
 * 고유값 문제를 풀어서 정렬된 고유값과 고유벡터 반환
 * H * C = E * S * C 형태의 일반화된 고유값 문제
 */
export function solveGeneralizedEigenvalueProblem(
  H: number[][],
  S: number[][]
): { eigenvalues: number[]; eigenvectors: number[][] } {
  try {
    // S^(-1/2) 계산
    const n = S.length;
    const SInvSqrt = computeInverseSqrt(S);

    // H' = S^(-1/2) * H * S^(-1/2)
    const HPrime = math.multiply(math.multiply(SInvSqrt, H), SInvSqrt) as number[][];

    // H'의 고유값 문제 풀기
    const result = math.eigs(HPrime);

    // 고유값과 고유벡터 추출
    let eigenvalues: number[] = [];
    let eigenvectorsRaw: number[][] = [];

    if (result.values && Array.isArray(result.values)) {
      eigenvalues = result.values.map((v: any) =>
        typeof v === 'object' && 're' in v ? v.re : Number(v)
      );
    }

    if (result.vectors && Array.isArray(result.vectors)) {
      eigenvectorsRaw = result.vectors.map((col: any) =>
        Array.isArray(col) ? col.map((v: any) =>
          typeof v === 'object' && 're' in v ? v.re : Number(v)
        ) : [Number(col)]
      );
    }

    // C = S^(-1/2) * C'로 원래 공간으로 변환
    const eigenvectors = math.multiply(SInvSqrt, eigenvectorsRaw) as number[][];

    // 에너지 순서로 정렬
    const indices = eigenvalues
      .map((val, idx) => ({ val, idx }))
      .sort((a, b) => a.val - b.val)
      .map(item => item.idx);

    const sortedEigenvalues = indices.map(i => eigenvalues[i]);
    const sortedEigenvectors = indices.map(i =>
      eigenvectors.map(row => row[i])
    );

    return {
      eigenvalues: sortedEigenvalues,
      eigenvectors: math.transpose(sortedEigenvectors) as number[][]
    };
  } catch (error) {
    console.error('Error solving eigenvalue problem:', error);
    // 폴백: 단순 대각화
    const result = math.eigs(H);
    const eigenvalues = (result.values as any[]).map(v =>
      typeof v === 'object' && 're' in v ? v.re : Number(v)
    );
    const eigenvectors = result.vectors as number[][];

    return { eigenvalues, eigenvectors };
  }
}

/**
 * 행렬의 역제곱근 S^(-1/2) 계산
 */
function computeInverseSqrt(S: number[][]): number[][] {
  const n = S.length;

  // 고유값 분해: S = V * D * V^T
  const result = math.eigs(S);
  const eigenvalues = (result.values as any[]).map(v =>
    typeof v === 'object' && 're' in v ? v.re : Number(v)
  );
  const V = result.vectors as number[][];

  // D^(-1/2) 계산
  const DInvSqrt: number[][] = Array(n).fill(0).map((_, i) =>
    Array(n).fill(0).map((_, j) =>
      i === j ? 1 / Math.sqrt(Math.abs(eigenvalues[i]) + 1e-10) : 0
    )
  );

  // S^(-1/2) = V * D^(-1/2) * V^T
  const VT = math.transpose(V) as number[][];
  const temp = math.multiply(V, DInvSqrt) as number[][];
  return math.multiply(temp, VT) as number[][];
}

/**
 * 행렬 출력 (디버깅용)
 */
export function printMatrix(matrix: number[][], label: string): void {
  console.log(`\n${label}:`);
  matrix.forEach(row => {
    console.log(row.map(val => val.toFixed(4)).join('\t'));
  });
}

/**
 * 단위 행렬 생성
 */
export function identityMatrix(n: number): number[][] {
  return Array(n).fill(0).map((_, i) =>
    Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
  );
}

/**
 * 영 행렬 생성
 */
export function zeroMatrix(rows: number, cols: number): number[][] {
  return Array(rows).fill(0).map(() => Array(cols).fill(0));
}
