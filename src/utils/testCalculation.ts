/**
 * 계산 테스트 - mathjs가 제대로 작동하는지 확인
 */

import * as math from 'mathjs';

export function testMathjs() {
  console.log('=== mathjs 테스트 시작 ===');

  try {
    // 1. 기본 행렬 연산 테스트
    const A = [[1, 2], [3, 4]];
    const B = [[5, 6], [7, 8]];
    const C = math.multiply(A, B);
    console.log('✅ 행렬 곱셈 성공:', C);

    // 2. 고유값 테스트
    const M = [[3, -1], [-1, 3]];
    const result = math.eigs(M);
    console.log('✅ 고유값 계산 성공:', result);

    // 3. 전치 테스트
    const T = math.transpose(A);
    console.log('✅ 전치 성공:', T);

    console.log('=== mathjs 모든 테스트 통과! ===');
    return true;
  } catch (error) {
    console.error('❌ mathjs 테스트 실패:', error);
    return false;
  }
}

export function testSimpleMolecule() {
  console.log('=== 간단한 분자 테스트 (H2) ===');

  try {
    // H-H 분자의 간단한 Hückel 계산
    const H_alpha = -13.6; // H의 1s 에너지
    const beta = -1.0; // 공명 적분

    // 해밀토니안 행렬
    const H = [
      [H_alpha, beta],
      [beta, H_alpha]
    ];

    // 겹침 행렬 (단순화)
    const S = [
      [1, 0.5],
      [0.5, 1]
    ];

    console.log('H 행렬:', H);
    console.log('S 행렬:', S);

    // 고유값 계산
    const result = math.eigs(H);
    console.log('고유값:', result.values);
    console.log('고유벡터:', result.vectors);

    console.log('=== H2 계산 성공! ===');
    return true;
  } catch (error) {
    console.error('❌ H2 계산 실패:', error);
    return false;
  }
}
