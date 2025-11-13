import React from 'react';
import { useMoleculeStore } from '../store/moleculeStore';
import { ELEMENTS, EXAMPLE_MOLECULES } from '../types';

const ControlPanel: React.FC = () => {
  const {
    editMode,
    selectedAtomElement,
    selectedBondType,
    isCalculating,
    setEditMode,
    setSelectedAtomElement,
    setSelectedBondType,
    loadExample,
    runCalculation,
    clearMolecule
  } = useMoleculeStore();

  const elements = ['H', 'C', 'N', 'O', 'F', 'S', 'Cl'];
  const bondTypes = ['single', 'double', 'triple', 'aromatic'] as const;

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">제어 패널</h2>

      {/* 편집 모드 */}
      <div>
        <label className="block text-white mb-2">편집 모드</label>
        <div className="grid grid-cols-2 gap-2">
          {(['atom', 'bond', 'delete', 'move'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setEditMode(mode)}
              className={`px-4 py-2 rounded ${
                editMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {mode === 'atom' ? '원자' : mode === 'bond' ? '결합' : mode === 'delete' ? '삭제' : '이동'}
            </button>
          ))}
        </div>
      </div>

      {/* 원자 선택 */}
      {editMode === 'atom' && (
        <div>
          <label className="block text-white mb-2">원소 선택</label>
          <div className="grid grid-cols-4 gap-2">
            {elements.map(element => (
              <button
                key={element}
                onClick={() => setSelectedAtomElement(element)}
                className={`px-3 py-2 rounded font-bold ${
                  selectedAtomElement === element
                    ? 'ring-2 ring-white'
                    : ''
                }`}
                style={{
                  backgroundColor: ELEMENTS[element].color,
                  color: element === 'H' || element === 'F' ? '#000' : '#fff'
                }}
              >
                {element}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 결합 타입 선택 */}
      {editMode === 'bond' && (
        <div>
          <label className="block text-white mb-2">결합 타입</label>
          <div className="grid grid-cols-2 gap-2">
            {bondTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedBondType(type)}
                className={`px-4 py-2 rounded ${
                  selectedBondType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type === 'single' ? '단일' : type === 'double' ? '이중' : type === 'triple' ? '삼중' : '방향족'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 예제 분자 */}
      <div>
        <label className="block text-white mb-2">예제 분자</label>
        <div className="space-y-2">
          {Object.keys(EXAMPLE_MOLECULES).map(key => (
            <button
              key={key}
              onClick={() => loadExample(key)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              {EXAMPLE_MOLECULES[key].name}
            </button>
          ))}
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="space-y-2">
        <button
          onClick={runCalculation}
          disabled={isCalculating}
          className={`w-full px-4 py-3 rounded font-bold ${
            isCalculating
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isCalculating ? '계산 중...' : '오비탈 계산 실행'}
        </button>

        <button
          onClick={clearMolecule}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          분자 초기화
        </button>
      </div>

      {/* 도움말 */}
      <div className="text-gray-400 text-sm space-y-1">
        <p>• 원자 모드: 클릭하여 원자 추가</p>
        <p>• 결합 모드: 두 원자를 순서대로 클릭</p>
        <p>• 삭제 모드: 원자/결합 클릭하여 삭제</p>
      </div>
    </div>
  );
};

export default ControlPanel;
