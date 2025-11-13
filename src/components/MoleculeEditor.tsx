import React, { useRef, useEffect, useState } from 'react';
import { useMoleculeStore } from '../store/moleculeStore';
import { ELEMENTS, GRID_SIZE } from '../types';

const MoleculeEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredAtomId, setHoveredAtomId] = useState<string | null>(null);

  const {
    molecule,
    editMode,
    selectedAtomElement,
    selectedBondType,
    selectedAtomId,
    addAtom,
    removeAtom,
    addBond,
    removeBond,
    setSelectedAtomId
  } = useMoleculeStore();

  // 캔버스 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 그리드
    drawGrid(ctx, canvas.width, canvas.height);

    // 결합 그리기
    molecule.bonds.forEach(bond => {
      const atom1 = molecule.atoms.find(a => a.id === bond.atom1Id);
      const atom2 = molecule.atoms.find(a => a.id === bond.atom2Id);
      if (atom1 && atom2) {
        drawBond(ctx, atom1.position, atom2.position, bond.type);
      }
    });

    // 원자 그리기
    molecule.atoms.forEach(atom => {
      const isSelected = atom.id === selectedAtomId;
      const isHovered = atom.id === hoveredAtomId;
      drawAtom(ctx, atom, isSelected, isHovered);
    });
  }, [molecule, selectedAtomId, hoveredAtomId]);

  // 그리드 그리기
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#2a2a3e';
    ctx.lineWidth = 0.5;

    const centerX = width / 2;
    const centerY = height / 2;

    // 수직선
    for (let x = centerX % GRID_SIZE; x < width; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 수평선
    for (let y = centerY % GRID_SIZE; y < height; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 중심 축
    ctx.strokeStyle = '#4a4a5e';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
  };

  // 원자 그리기
  const drawAtom = (
    ctx: CanvasRenderingContext2D,
    atom: any,
    isSelected: boolean,
    isHovered: boolean
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const screenX = centerX + atom.position.x * GRID_SIZE;
    const screenY = centerY - atom.position.y * GRID_SIZE;

    const element = ELEMENTS[atom.element];
    if (!element) return;

    const radius = element.radius * 10;

    // 선택/호버 효과
    if (isSelected || isHovered) {
      ctx.strokeStyle = isSelected ? '#00ff00' : '#ffff00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 원자 원
    ctx.fillStyle = element.color;
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 원자 기호
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(element.symbol, screenX, screenY);
  };

  // 결합 그리기
  const drawBond = (
    ctx: CanvasRenderingContext2D,
    pos1: any,
    pos2: any,
    type: string
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const x1 = centerX + pos1.x * GRID_SIZE;
    const y1 = centerY - pos1.y * GRID_SIZE;
    const x2 = centerX + pos2.x * GRID_SIZE;
    const y2 = centerY - pos2.y * GRID_SIZE;

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = type === 'single' ? 2 : type === 'double' ? 4 : 6;

    if (type === 'aromatic') {
      ctx.setLineDash([5, 5]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.setLineDash([]);
  };

  // 캔버스 클릭 처리
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 월드 좌표로 변환
    const worldX = (mouseX - centerX) / GRID_SIZE;
    const worldY = (centerY - mouseY) / GRID_SIZE;

    // 클릭한 원자 찾기
    const clickedAtom = molecule.atoms.find(atom => {
      const dx = atom.position.x - worldX;
      const dy = atom.position.y - worldY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 0.3; // 클릭 범위
    });

    if (editMode === 'atom') {
      if (!clickedAtom) {
        // 새 원자 추가
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
      } else {
        // 클릭한 결합 찾기
        const clickedBond = molecule.bonds.find(bond => {
          const atom1 = molecule.atoms.find(a => a.id === bond.atom1Id);
          const atom2 = molecule.atoms.find(a => a.id === bond.atom2Id);
          if (!atom1 || !atom2) return false;

          // 선분과 점 사이 거리 계산
          const dist = pointToLineDistance(
            worldX, worldY,
            atom1.position.x, atom1.position.y,
            atom2.position.x, atom2.position.y
          );
          return dist < 0.2;
        });

        if (clickedBond) {
          removeBond(clickedBond.id);
        }
      }
    }
  };

  // 마우스 이동 처리
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
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 0.3;
    });

    setHoveredAtomId(hoveredAtom ? hoveredAtom.id : null);
  };

  // 점과 선분 사이 거리
  const pointToLineDistance = (
    px: number, py: number,
    x1: number, y1: number,
    x2: number, y2: number
  ): number => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;

    if (lenSq === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);

    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));

    const projX = x1 + t * dx;
    const projY = y1 + t * dy;

    return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-2 border-gray-700 rounded-lg cursor-crosshair"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
      />
      <div className="absolute top-4 left-4 bg-gray-800 p-2 rounded text-white text-sm">
        <div>모드: {editMode === 'atom' ? '원자 추가' : editMode === 'bond' ? '결합 추가' : editMode === 'delete' ? '삭제' : '이동'}</div>
        {editMode === 'atom' && <div>선택 원소: {selectedAtomElement}</div>}
        {editMode === 'bond' && <div>결합 타입: {selectedBondType}</div>}
      </div>
    </div>
  );
};

export default MoleculeEditor;
