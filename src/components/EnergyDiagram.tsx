import React, { useRef, useEffect } from 'react';
import { useMoleculeStore } from '../store/moleculeStore';

const EnergyDiagram: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { calculationResult, visualization, selectOrbital } = useMoleculeStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !calculationResult) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawEnergyDiagram(ctx, canvas.width, canvas.height);
  }, [calculationResult, visualization]);

  const drawEnergyDiagram = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    if (!calculationResult) return;

    // 배경
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    const { molecularOrbitals, homo, lumo } = calculationResult;

    // 에너지 범위 계산
    const energies = molecularOrbitals.map(mo => mo.energy);
    const minEnergy = Math.min(...energies);
    const maxEnergy = Math.max(...energies);
    const energyRange = maxEnergy - minEnergy;

    const padding = 60;
    const orbitalWidth = 80;
    const orbitalSpacing = 10;
    const availableHeight = height - 2 * padding;

    // 에너지 축 그리기
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // 에너지 레이블
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 5; i++) {
      const energy = maxEnergy - (energyRange * i) / 5;
      const y = padding + (availableHeight * i) / 5;

      ctx.fillText(`${energy.toFixed(1)} eV`, padding - 10, y + 4);

      ctx.strokeStyle = '#3a3a4e';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // 오비탈 그리기
    molecularOrbitals.forEach((mo, index) => {
      const x = padding + 50 + index * (orbitalWidth + orbitalSpacing);
      const yNormalized = (maxEnergy - mo.energy) / energyRange;
      const y = padding + yNormalized * availableHeight;

      // 오비탈 선
      let color = '#888888';
      if (index === homo) color = '#ff4444'; // HOMO는 빨강
      if (index === lumo) color = '#4444ff'; // LUMO는 파랑
      if (index === visualization.orbitalIndex) color = '#00ff00'; // 선택된 오비탈은 초록

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - orbitalWidth / 2, y);
      ctx.lineTo(x + orbitalWidth / 2, y);
      ctx.stroke();

      // 전자 표시
      if (mo.occupancy > 0) {
        drawElectrons(ctx, x, y, mo.occupancy);
      }

      // 오비탈 타입 표시
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(mo.type[0].toUpperCase(), x, y + 20);

      // 클릭 가능 영역
      if (index === visualization.orbitalIndex) {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - orbitalWidth / 2 - 5, y - 15, orbitalWidth + 10, 30);
      }
    });

    // HOMO-LUMO 갭 표시
    if (homo >= 0 && lumo >= 0) {
      const homoEnergy = molecularOrbitals[homo].energy;
      const lumoEnergy = molecularOrbitals[lumo].energy;
      const gap = lumoEnergy - homoEnergy;

      ctx.fillStyle = '#ffff00';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`HOMO-LUMO Gap: ${gap.toFixed(2)} eV`, width / 2, 30);
    }

    // 범례
    drawLegend(ctx, width, height, homo, lumo);
  };

  const drawElectrons = (ctx: CanvasRenderingContext2D, x: number, y: number, count: number) => {
    const arrowSize = 8;
    const spacing = 15;

    for (let i = 0; i < count; i++) {
      const ex = x - spacing / 2 + i * spacing;
      const ey = y - 10;

      // 화살표 (스핀)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      if (i === 0) {
        // 위쪽 화살표
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - arrowSize / 3, ey + arrowSize);
        ctx.lineTo(ex + arrowSize / 3, ey + arrowSize);
      } else {
        // 아래쪽 화살표
        ctx.moveTo(ex, ey + arrowSize);
        ctx.lineTo(ex - arrowSize / 3, ey);
        ctx.lineTo(ex + arrowSize / 3, ey);
      }
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawLegend = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    homo: number,
    lumo: number
  ) => {
    const legendX = width - 150;
    const legendY = height - 100;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(legendX - 10, legendY - 10, 140, 90);

    const items = [
      { color: '#ff4444', label: 'HOMO' },
      { color: '#4444ff', label: 'LUMO' },
      { color: '#00ff00', label: '선택됨' },
      { color: '#888888', label: '기타' }
    ];

    items.forEach((item, i) => {
      const y = legendY + i * 20;

      ctx.strokeStyle = item.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(legendX, y);
      ctx.lineTo(legendX + 30, y);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legendX + 40, y + 4);
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!calculationResult) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const { molecularOrbitals } = calculationResult;
    const energies = molecularOrbitals.map(mo => mo.energy);
    const minEnergy = Math.min(...energies);
    const maxEnergy = Math.max(...energies);
    const energyRange = maxEnergy - minEnergy;

    const padding = 60;
    const orbitalWidth = 80;
    const orbitalSpacing = 10;
    const availableHeight = canvas.height - 2 * padding;

    // 클릭한 오비탈 찾기
    molecularOrbitals.forEach((mo, index) => {
      const x = padding + 50 + index * (orbitalWidth + orbitalSpacing);
      const yNormalized = (maxEnergy - mo.energy) / energyRange;
      const y = padding + yNormalized * availableHeight;

      const inXRange = mouseX >= x - orbitalWidth / 2 - 5 && mouseX <= x + orbitalWidth / 2 + 5;
      const inYRange = mouseY >= y - 15 && mouseY <= y + 15;

      if (inXRange && inYRange) {
        selectOrbital(index);
      }
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white font-bold mb-2">에너지 레벨 다이어그램</h3>
      {calculationResult ? (
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border border-gray-700 rounded cursor-pointer"
          onClick={handleCanvasClick}
        />
      ) : (
        <div className="text-gray-400 text-center py-20">
          계산을 실행하면 에너지 다이어그램이 표시됩니다
        </div>
      )}
    </div>
  );
};

export default EnergyDiagram;
