import React, { useRef, useEffect } from 'react';
import { useMoleculeStore } from '../store/moleculeStore';
import { ELEMENTS, GRID_SIZE } from '../types';

const OrbitalVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { molecule, calculationResult, visualization } = useMoleculeStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !calculationResult) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawOrbitalVisualization(ctx, canvas.width, canvas.height);
  }, [molecule, calculationResult, visualization]);

  const drawOrbitalVisualization = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // 배경
    ctx.fillStyle = '#0a0a1e';
    ctx.fillRect(0, 0, width, height);

    if (!calculationResult) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('계산을 실행하여 오비탈을 시각화하세요', width / 2, height / 2);
      return;
    }

    const { molecularOrbitals } = calculationResult;
    const selectedOrbital = molecularOrbitals[visualization.orbitalIndex];

    if (!selectedOrbital) return;

    const centerX = width / 2;
    const centerY = height / 2;

    // 전자 밀도 히트맵 그리기 (간단한 2D 투영)
    const gridResolution = 2;
    const densityRange = 4; // Angstroms

    for (let px = 0; px < width; px += gridResolution) {
      for (let py = 0; py < height; py += gridResolution) {
        const worldX = (px - centerX) / GRID_SIZE;
        const worldY = (centerY - py) / GRID_SIZE;

        // 이 위치에서의 전자 밀도 계산
        const density = calculateElectronDensity(
          worldX,
          worldY,
          selectedOrbital.coefficients,
          calculationResult.atomicOrbitals,
          molecule.atoms
        );

        if (Math.abs(density) > visualization.isovalue) {
          // 위상에 따라 색상 결정
          const alpha = Math.min(Math.abs(density) * visualization.orbitalOpacity * 2, 1);
          const color = density > 0
            ? `rgba(255, 100, 100, ${alpha})` // 양의 위상 (빨강)
            : `rgba(100, 100, 255, ${alpha})`; // 음의 위상 (파랑)

          ctx.fillStyle = color;
          ctx.fillRect(px, py, gridResolution, gridResolution);
        }
      }
    }

    // 분자 구조 오버레이
    if (visualization.showBonds) {
      molecule.bonds.forEach(bond => {
        const atom1 = molecule.atoms.find(a => a.id === bond.atom1Id);
        const atom2 = molecule.atoms.find(a => a.id === bond.atom2Id);
        if (atom1 && atom2) {
          const x1 = centerX + atom1.position.x * GRID_SIZE;
          const y1 = centerY - atom1.position.y * GRID_SIZE;
          const x2 = centerX + atom2.position.x * GRID_SIZE;
          const y2 = centerY - atom2.position.y * GRID_SIZE;

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      });
    }

    if (visualization.showAtoms) {
      molecule.atoms.forEach(atom => {
        const element = ELEMENTS[atom.element];
        if (!element) return;

        const screenX = centerX + atom.position.x * GRID_SIZE;
        const screenY = centerY - atom.position.y * GRID_SIZE;
        const radius = element.radius * 8;

        ctx.fillStyle = element.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(element.symbol, screenX, screenY);
      });
    }

    // 오비탈 정보 표시
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 250, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`오비탈 ${visualization.orbitalIndex + 1}`, 20, 30);
    ctx.fillText(`에너지: ${selectedOrbital.energy.toFixed(2)} eV`, 20, 50);
    ctx.fillText(`점유: ${selectedOrbital.occupancy} 전자`, 20, 70);
    ctx.fillText(`타입: ${selectedOrbital.type}`, 20, 90);

    // 범례
    drawPhaseLegend(ctx, width);
  };

  /**
   * 특정 위치에서의 전자 밀도 계산 (간단한 근사)
   */
  const calculateElectronDensity = (
    x: number,
    y: number,
    coefficients: number[],
    atomicOrbitals: any[],
    atoms: any[]
  ): number => {
    let density = 0;

    atomicOrbitals.forEach((ao, i) => {
      const atom = atoms[ao.atomIndex];
      if (!atom) return;

      const dx = x - atom.position.x;
      const dy = y - atom.position.y;
      const r = Math.sqrt(dx * dx + dy * dy);

      // Slater 타입 궤도함수 근사
      const zeta = ao.slaterExponent;
      const orbital = Math.exp(-zeta * r);

      // 방향성 고려 (간단한 근사)
      let angularPart = 1;
      if (ao.type === 'px') {
        angularPart = dx / (r + 0.01);
      } else if (ao.type === 'py') {
        angularPart = dy / (r + 0.01);
      }

      density += coefficients[i] * orbital * angularPart;
    });

    return density;
  };

  const drawPhaseLegend = (ctx: CanvasRenderingContext2D, width: number) => {
    const legendX = width - 130;
    const legendY = 20;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(legendX - 10, legendY - 10, 120, 80);

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('위상:', legendX, legendY + 10);

    // 양의 위상
    ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
    ctx.fillRect(legendX, legendY + 20, 30, 20);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('양 (+)', legendX + 35, legendY + 35);

    // 음의 위상
    ctx.fillStyle = 'rgba(100, 100, 255, 0.8)';
    ctx.fillRect(legendX, legendY + 45, 30, 20);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('음 (-)', legendX + 35, legendY + 60);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white font-bold mb-2">분자 오비탈 시각화</h3>
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        className="border border-gray-700 rounded"
      />
      {calculationResult && (
        <div className="mt-2 text-gray-400 text-sm">
          <p>빨강: 양의 위상, 파랑: 음의 위상</p>
          <p>진한 색: 높은 전자 밀도</p>
        </div>
      )}
    </div>
  );
};

export default OrbitalVisualization;
