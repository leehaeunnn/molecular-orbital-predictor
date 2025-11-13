import React from 'react';
import MoleculeEditor from './components/MoleculeEditor';
import ControlPanel from './components/ControlPanel';
import EnergyDiagram from './components/EnergyDiagram';
import OrbitalVisualization from './components/OrbitalVisualization';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* 헤더 */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          분자 오비탈 예측기
        </h1>
        <p className="text-gray-400 text-center">
          Extended Hückel 이론 기반 인터랙티브 분자 오비탈 계산 및 시각화
        </p>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-12 gap-4">
        {/* 왼쪽: 제어 패널 */}
        <div className="col-span-3">
          <ControlPanel />
        </div>

        {/* 중앙: 분자 에디터 */}
        <div className="col-span-5">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">분자 에디터</h2>
            <MoleculeEditor />
          </div>
        </div>

        {/* 오른쪽: 시각화 */}
        <div className="col-span-4 space-y-4">
          <OrbitalVisualization />
        </div>
      </div>

      {/* 하단: 에너지 다이어그램 */}
      <div className="mt-4">
        <EnergyDiagram />
      </div>

      {/* 푸터 */}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Extended Hückel 분자 오비탈 이론 | 고급화학 주제발표</p>
        <p className="mt-1">
          개발: React + TypeScript + Vite + mathjs
        </p>
      </footer>
    </div>
  );
}

export default App;
