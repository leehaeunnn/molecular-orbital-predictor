import React from 'react';
import { useMoleculeStore } from './store/moleculeStore';

function AppWorking() {
  const {
    molecule,
    calculationResult,
    isCalculating,
    loadExample,
    runCalculation,
    clearMolecule
  } = useMoleculeStore();

  const handleCalculation = async () => {
    console.log('계산 시작...');
    try {
      await runCalculation();
      console.log('계산 완료!');
    } catch (error) {
      console.error('계산 에러:', error);
      alert('계산 중 오류가 발생했습니다: ' + error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      padding: '30px',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '42px', marginBottom: '10px', fontWeight: 'bold' }}>
          분자 오비탈 예측기
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>
          Extended Hückel 이론 기반 분자 오비탈 계산 및 시각화
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* 왼쪽: 제어 패널 */}
        <div style={{
          backgroundColor: '#1e293b',
          padding: '25px',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: 'bold' }}>제어 패널</h2>

          <div style={{ marginBottom: '25px' }}>
            <p style={{ marginBottom: '12px', fontSize: '14px', color: '#94a3b8' }}>예제 분자 선택:</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => loadExample('water')}
                style={{
                  padding: '12px',
                  fontSize: '14px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                💧 물
              </button>

              <button
                onClick={() => loadExample('methane')}
                style={{
                  padding: '12px',
                  fontSize: '14px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                🔥 메탄
              </button>

              <button
                onClick={() => loadExample('ammonia')}
                style={{
                  padding: '12px',
                  fontSize: '14px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
              >
                ⚗️ 암모니아
              </button>

              <button
                onClick={() => loadExample('co2')}
                style={{
                  padding: '12px',
                  fontSize: '14px',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
              >
                🌫️ CO₂
              </button>

              <button
                onClick={() => loadExample('ethylene')}
                style={{
                  padding: '12px',
                  fontSize: '14px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
              >
                🧪 에틸렌
              </button>

              <button
                onClick={() => loadExample('acetylene')}
                style={{
                  padding: '12px',
                  fontSize: '14px',
                  backgroundColor: '#14b8a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#14b8a6'}
              >
                ⚡ 아세틸렌
              </button>

              <button
                onClick={() => loadExample('formaldehyde')}
                style={{
                  padding: '12px',
                  fontSize: '14px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                🧬 포름알데히드
              </button>

              <button
                onClick={() => loadExample('methanol')}
                style={{
                  padding: '12px',
                  fontSize: '14px',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0891b2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#06b6d4'}
              >
                🍶 메탄올
              </button>

              <button
                onClick={() => loadExample('benzene')}
                style={{
                  padding: '12px',
                  fontSize: '14px',
                  backgroundColor: '#ec4899',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  gridColumn: '1 / -1'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#db2777'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ec4899'}
              >
                ⬡ 벤젠 (C₆H₆) - 방향족 화합물
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #334155', paddingTop: '20px', marginBottom: '20px' }}>
            <button
              onClick={handleCalculation}
              disabled={isCalculating || molecule.atoms.length === 0}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '18px',
                backgroundColor: isCalculating || molecule.atoms.length === 0 ? '#475569' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isCalculating || molecule.atoms.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}
              onMouseOver={(e) => {
                if (!isCalculating && molecule.atoms.length > 0) {
                  e.currentTarget.style.backgroundColor = '#059669';
                }
              }}
              onMouseOut={(e) => {
                if (!isCalculating && molecule.atoms.length > 0) {
                  e.currentTarget.style.backgroundColor = '#10b981';
                }
              }}
            >
              {isCalculating ? '⏳ 계산 중...' : '🚀 오비탈 계산 실행'}
            </button>

            <button
              onClick={clearMolecule}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              🗑️ 초기화
            </button>
          </div>

          <div style={{
            backgroundColor: '#0f172a',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <p style={{ color: '#94a3b8', marginBottom: '8px' }}>💡 사용 방법:</p>
            <ol style={{ marginLeft: '20px', lineHeight: '1.8', color: '#cbd5e1' }}>
              <li>위에서 예제 분자를 선택하세요</li>
              <li>"오비탈 계산 실행" 버튼을 누르세요</li>
              <li>오른쪽에서 결과를 확인하세요</li>
            </ol>
          </div>
        </div>

        {/* 오른쪽: 결과 패널 */}
        <div style={{
          backgroundColor: '#1e293b',
          padding: '25px',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: 'bold' }}>계산 결과</h2>

          {/* 분자 정보 */}
          <div style={{
            backgroundColor: '#0f172a',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #1e293b'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#60a5fa' }}>📊 분자 정보</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>분자 이름</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{molecule.name}</p>
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>전하</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{molecule.charge}</p>
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>원자 개수</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#22d3ee' }}>{molecule.atoms.length}</p>
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>결합 개수</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#a78bfa' }}>{molecule.bonds.length}</p>
              </div>
            </div>
          </div>

          {/* 계산 결과 */}
          {calculationResult ? (
            <div style={{
              backgroundColor: '#064e3b',
              padding: '20px',
              borderRadius: '8px',
              border: '2px solid #10b981'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#6ee7b7' }}>✅ 계산 완료!</h3>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: '#a7f3d0', fontSize: '13px', marginBottom: '5px' }}>분자 오비탈 개수</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ee7b7' }}>
                  {calculationResult.molecularOrbitals.length}개
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                <div>
                  <p style={{ color: '#a7f3d0', fontSize: '13px' }}>HOMO (최고 점유 오비탈)</p>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#fca5a5' }}>
                    #{calculationResult.homo + 1}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#a7f3d0', fontSize: '13px' }}>LUMO (최저 비점유 오비탈)</p>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#93c5fd' }}>
                    #{calculationResult.lumo + 1}
                  </p>
                </div>
              </div>

              <div style={{
                backgroundColor: '#065f46',
                padding: '15px',
                borderRadius: '6px',
                marginBottom: '15px'
              }}>
                <p style={{ color: '#a7f3d0', fontSize: '13px', marginBottom: '5px' }}>HOMO-LUMO 에너지 갭</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#fbbf24' }}>
                  {calculationResult.homoLumoGap.toFixed(3)} eV
                </p>
                <p style={{ color: '#d1fae5', fontSize: '12px', marginTop: '5px' }}>
                  큰 갭 = 안정적, 작은 갭 = 반응성 높음
                </p>
              </div>

              <div>
                <p style={{ color: '#a7f3d0', fontSize: '13px', marginBottom: '8px' }}>에너지 레벨 (처음 5개):</p>
                {calculationResult.molecularOrbitals.slice(0, 5).map((mo, i) => (
                  <div key={i} style={{
                    backgroundColor: '#065f46',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    marginBottom: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '14px' }}>
                      {i === calculationResult.homo && '🔴 '}
                      {i === calculationResult.lumo && '🔵 '}
                      MO-{i + 1} ({mo.type})
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>
                      {mo.energy.toFixed(2)} eV
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#422006',
              padding: '40px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '2px dashed #f59e0b'
            }}>
              <p style={{ fontSize: '48px', marginBottom: '10px' }}>⚗️</p>
              <p style={{ fontSize: '18px', color: '#fbbf24', marginBottom: '8px' }}>
                계산 결과 없음
              </p>
              <p style={{ fontSize: '14px', color: '#fcd34d' }}>
                분자를 선택하고 계산을 실행하세요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 푸터 */}
      <div style={{
        marginTop: '30px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '14px'
      }}>
        <p>Extended Hückel 분자 오비탈 이론 | 고급화학 주제발표</p>
      </div>
    </div>
  );
}

export default AppWorking;
