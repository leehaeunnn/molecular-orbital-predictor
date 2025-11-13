import React, { useRef, useEffect, useState } from 'react';
import { useMoleculeStore } from './store/moleculeStore';
import { ELEMENTS, GRID_SIZE } from './types';
import { testMathjs, testSimpleMolecule } from './utils/testCalculation';

function AppFinal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredAtomId, setHoveredAtomId] = useState<string | null>(null);

  const {
    molecule,
    calculationResult,
    isCalculating,
    editMode,
    selectedAtomElement,
    selectedBondType,
    selectedAtomId,
    setEditMode,
    setSelectedAtomElement,
    setSelectedBondType,
    setSelectedAtomId,
    addAtom,
    removeAtom,
    addBond,
    removeBond,
    loadExample,
    runCalculation,
    clearMolecule
  } = useMoleculeStore();

  // 캔버스 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 그리드
    ctx.strokeStyle = '#2a2a3e';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 중심 축
    ctx.strokeStyle = '#4a4a5e';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // 결합 그리기
    molecule.bonds.forEach(bond => {
      const atom1 = molecule.atoms.find(a => a.id === bond.atom1Id);
      const atom2 = molecule.atoms.find(a => a.id === bond.atom2Id);
      if (atom1 && atom2) {
        const x1 = centerX + atom1.position.x * GRID_SIZE;
        const y1 = centerY - atom1.position.y * GRID_SIZE;
        const x2 = centerX + atom2.position.x * GRID_SIZE;
        const y2 = centerY - atom2.position.y * GRID_SIZE;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = bond.type === 'single' ? 2 : bond.type === 'double' ? 4 : 6;
        ctx.setLineDash(bond.type === 'aromatic' ? [5, 5] : []);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // 원자 그리기
    molecule.atoms.forEach(atom => {
      const element = ELEMENTS[atom.element];
      if (!element) return;

      const screenX = centerX + atom.position.x * GRID_SIZE;
      const screenY = centerY - atom.position.y * GRID_SIZE;
      const radius = element.radius * 10;

      const isSelected = atom.id === selectedAtomId;
      const isHovered = atom.id === hoveredAtomId;

      if (isSelected || isHovered) {
        ctx.strokeStyle = isSelected ? '#00ff00' : '#ffff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = element.color;
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.symbol, screenX, screenY);
    });
  }, [molecule, selectedAtomId, hoveredAtomId]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const worldX = (mouseX - centerX) / GRID_SIZE;
    const worldY = (centerY - mouseY) / GRID_SIZE;

    // 클릭한 원자 찾기
    const clickedAtom = molecule.atoms.find(atom => {
      const dx = atom.position.x - worldX;
      const dy = atom.position.y - worldY;
      return Math.sqrt(dx * dx + dy * dy) < 0.3;
    });

    if (editMode === 'atom') {
      if (!clickedAtom) {
        addAtom(selectedAtomElement, worldX, worldY);
      }
    } else if (editMode === 'bond') {
      if (clickedAtom) {
        if (!selectedAtomId) {
          setSelectedAtomId(clickedAtom.id);
        } else if (selectedAtomId !== clickedAtom.id) {
          addBond(selectedAtomId, clickedAtom.id, selectedBondType);
          setSelectedAtomId(null);
        }
      }
    } else if (editMode === 'delete') {
      if (clickedAtom) {
        removeAtom(clickedAtom.id);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const worldX = (mouseX - centerX) / GRID_SIZE;
    const worldY = (centerY - mouseY) / GRID_SIZE;

    const hoveredAtom = molecule.atoms.find(atom => {
      const dx = atom.position.x - worldX;
      const dy = atom.position.y - worldY;
      return Math.sqrt(dx * dx + dy * dy) < 0.3;
    });

    setHoveredAtomId(hoveredAtom ? hoveredAtom.id : null);
  };

  const handleCalculation = async () => {
    console.log('=== 계산 시작 ===');
    console.log('분자:', molecule);
    console.log('원자 개수:', molecule.atoms.length);
    console.log('결합 개수:', molecule.bonds.length);

    // mathjs 테스트
    const mathjsOk = testMathjs();
    if (!mathjsOk) {
      alert('mathjs 라이브러리 문제 발견! Console을 확인하세요.');
      return;
    }

    // 간단한 분자 테스트
    testSimpleMolecule();

    try {
      await runCalculation();
      console.log('=== 계산 완료! ===');
      console.log('결과:', calculationResult);
    } catch (error) {
      console.error('❌ 계산 에러:', error);
      console.error('에러 상세:', error);
      alert('계산 중 오류가 발생했습니다.\n\nConsole(F12)을 확인하세요.\n\n에러: ' + String(error));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      padding: '20px',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '5px', fontWeight: 'bold' }}>
          분자 오비탈 예측기
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Extended Hückel 이론 기반 분자 오비탈 계산
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 350px', gap: '15px', maxWidth: '1600px', margin: '0 auto' }}>

        {/* 왼쪽: 도구 */}
        <div>
          <div style={{
            backgroundColor: '#1e293b',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '15px'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>🛠️ 편집 도구</h3>

            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>모드:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {(['atom', 'bond', 'delete'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setEditMode(mode)}
                    style={{
                      padding: '10px',
                      fontSize: '13px',
                      backgroundColor: editMode === mode ? '#3b82f6' : '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {mode === 'atom' ? '➕ 원자' : mode === 'bond' ? '🔗 결합' : '🗑️ 삭제'}
                  </button>
                ))}
              </div>
            </div>

            {editMode === 'atom' && (
              <div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>원소 선택:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {['H', 'C', 'N', 'O', 'F', 'S'].map(element => (
                    <button
                      key={element}
                      onClick={() => setSelectedAtomElement(element)}
                      style={{
                        padding: '10px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        backgroundColor: ELEMENTS[element].color,
                        color: element === 'H' || element === 'F' ? '#000' : '#fff',
                        border: selectedAtomElement === element ? '3px solid #fff' : 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {element}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {editMode === 'bond' && (
              <div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>결합 타입:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {(['single', 'double', 'triple'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedBondType(type)}
                      style={{
                        padding: '10px',
                        fontSize: '13px',
                        backgroundColor: selectedBondType === type ? '#8b5cf6' : '#374151',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {type === 'single' ? '단일' : type === 'double' ? '이중' : '삼중'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: '#1e293b',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>📚 예제 분자</h3>
            <div style={{ display: 'grid', gap: '6px' }}>
              {[
                { id: 'water', name: '💧 물', color: '#3b82f6' },
                { id: 'methane', name: '🔥 메탄', color: '#10b981' },
                { id: 'ethylene', name: '🧪 에틸렌', color: '#8b5cf6' },
                { id: 'benzene', name: '⬡ 벤젠', color: '#ec4899' }
              ].map(mol => (
                <button
                  key={mol.id}
                  onClick={() => loadExample(mol.id)}
                  style={{
                    padding: '10px',
                    fontSize: '13px',
                    backgroundColor: mol.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {mol.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 중앙: 캔버스 */}
        <div style={{
          backgroundColor: '#1e293b',
          padding: '15px',
          borderRadius: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '18px' }}>🎨 분자 에디터</h3>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              원자: {molecule.atoms.length} | 결합: {molecule.bonds.length}
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={700}
            height={500}
            style={{
              border: '2px solid #374151',
              borderRadius: '8px',
              cursor: 'crosshair',
              display: 'block'
            }}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
          />

          <div style={{
            marginTop: '10px',
            padding: '12px',
            backgroundColor: '#0f172a',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#94a3b8'
          }}>
            💡 <strong>사용법:</strong> {
              editMode === 'atom' ? '캔버스를 클릭하여 원자 추가' :
              editMode === 'bond' ? '두 원자를 순서대로 클릭하여 결합 생성' :
              '원자를 클릭하여 삭제'
            }
          </div>
        </div>

        {/* 오른쪽: 결과 */}
        <div>
          <div style={{
            backgroundColor: '#1e293b',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '15px'
          }}>
            <button
              onClick={handleCalculation}
              disabled={isCalculating || molecule.atoms.length === 0}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                backgroundColor: isCalculating || molecule.atoms.length === 0 ? '#475569' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isCalculating || molecule.atoms.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                marginBottom: '10px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isCalculating && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shimmer 1s infinite'
                }} />
              )}
              <style>{`
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
              `}</style>
              {isCalculating ? '⚡ 계산 중...' : '🚀 오비탈 계산'}
            </button>

            <button
              onClick={clearMolecule}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🗑️ 전체 초기화
            </button>
          </div>

          {calculationResult ? (
            <div style={{
              backgroundColor: '#064e3b',
              padding: '20px',
              borderRadius: '10px',
              border: '2px solid #10b981'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#6ee7b7' }}>✅ 계산 완료!</h3>

              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', color: '#a7f3d0' }}>분자 오비탈</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#6ee7b7' }}>
                  {calculationResult.molecularOrbitals.length}개
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#a7f3d0' }}>HOMO</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#fca5a5' }}>
                    #{calculationResult.homo + 1}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#a7f3d0' }}>LUMO</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#93c5fd' }}>
                    #{calculationResult.lumo + 1}
                  </p>
                </div>
              </div>

              <div style={{
                backgroundColor: '#065f46',
                padding: '12px',
                borderRadius: '6px'
              }}>
                <p style={{ fontSize: '11px', color: '#a7f3d0', marginBottom: '4px' }}>HOMO-LUMO 갭</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#fbbf24' }}>
                  {calculationResult.homoLumoGap.toFixed(3)} eV
                </p>
              </div>

              <div style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '11px', color: '#a7f3d0', marginBottom: '6px' }}>에너지 레벨:</p>
                {calculationResult.molecularOrbitals.slice(0, 5).map((mo, i) => (
                  <div key={i} style={{
                    backgroundColor: '#065f46',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span>
                      {i === calculationResult.homo && '🔴 '}
                      {i === calculationResult.lumo && '🔵 '}
                      MO-{i + 1}
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
              padding: '40px 20px',
              borderRadius: '10px',
              textAlign: 'center',
              border: '2px dashed #f59e0b'
            }}>
              <p style={{ fontSize: '36px', marginBottom: '8px' }}>⚗️</p>
              <p style={{ fontSize: '14px', color: '#fbbf24' }}>
                계산 결과 없음
              </p>
              <p style={{ fontSize: '12px', color: '#fcd34d', marginTop: '4px' }}>
                분자를 만들고 계산하세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppFinal;
