import React from 'react';
import { useMoleculeStore } from './store/moleculeStore';

function AppSimple() {
  const {
    molecule,
    editMode,
    selectedAtomElement,
    isCalculating,
    setEditMode,
    setSelectedAtomElement,
    addAtom,
    loadExample,
    runCalculation,
    clearMolecule,
    calculationResult
  } = useMoleculeStore();

  const handleAddAtom = () => {
    console.log('Adding atom:', selectedAtomElement);
    addAtom(selectedAtomElement, 0, 0, 0);
  };

  const handleCalculate = async () => {
    console.log('Running calculation...');
    try {
      await runCalculation();
      console.log('Calculation complete!');
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">분자 오비탈 예측기 - 디버그 모드</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* 제어 패널 */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">제어</h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-2">편집 모드:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode('atom')}
                  className={`px-4 py-2 rounded ${
                    editMode === 'atom' ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  원자
                </button>
                <button
                  onClick={() => setEditMode('bond')}
                  className={`px-4 py-2 rounded ${
                    editMode === 'bond' ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  결합
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-2">현재 모드: {editMode}</p>
            </div>

            <div>
              <label className="block mb-2">원소 선택:</label>
              <select
                value={selectedAtomElement}
                onChange={(e) => setSelectedAtomElement(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded"
              >
                <option value="H">H (수소)</option>
                <option value="C">C (탄소)</option>
                <option value="N">N (질소)</option>
                <option value="O">O (산소)</option>
              </select>
            </div>

            <button
              onClick={handleAddAtom}
              className="w-full px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            >
              원자 추가 (테스트)
            </button>

            <div className="border-t border-gray-700 pt-4">
              <label className="block mb-2">예제 분자:</label>
              <button
                onClick={() => loadExample('water')}
                className="w-full px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 mb-2"
              >
                물 (H2O)
              </button>
              <button
                onClick={() => loadExample('ethylene')}
                className="w-full px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 mb-2"
              >
                에틸렌 (C2H4)
              </button>
              <button
                onClick={() => loadExample('benzene')}
                className="w-full px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
              >
                벤젠 (C6H6)
              </button>
            </div>

            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className={`w-full px-4 py-3 rounded font-bold ${
                isCalculating
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isCalculating ? '계산 중...' : '오비탈 계산 실행'}
            </button>

            <button
              onClick={clearMolecule}
              className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            >
              초기화
            </button>
          </div>
        </div>

        {/* 정보 패널 */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">분자 정보</h2>

          <div className="space-y-3">
            <div>
              <p className="font-bold">원자 개수: {molecule.atoms.length}</p>
              <p className="font-bold">결합 개수: {molecule.bonds.length}</p>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <p className="font-bold mb-2">원자 목록:</p>
              <div className="max-h-40 overflow-y-auto">
                {molecule.atoms.map((atom, i) => (
                  <div key={atom.id} className="text-sm text-gray-300">
                    {i + 1}. {atom.element} ({atom.position.x.toFixed(2)}, {atom.position.y.toFixed(2)})
                  </div>
                ))}
              </div>
            </div>

            {calculationResult && (
              <div className="border-t border-gray-700 pt-3">
                <p className="font-bold text-green-400">계산 완료!</p>
                <p className="text-sm">오비탈 개수: {calculationResult.molecularOrbitals.length}</p>
                <p className="text-sm">HOMO: {calculationResult.homo}</p>
                <p className="text-sm">LUMO: {calculationResult.lumo}</p>
                <p className="text-sm">
                  HOMO-LUMO 갭: {calculationResult.homoLumoGap.toFixed(2)} eV
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 디버그 정보 */}
      <div className="mt-6 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">디버그 정보</h2>
        <pre className="text-xs text-gray-400 overflow-auto max-h-60">
          {JSON.stringify({
            editMode,
            selectedAtomElement,
            atomCount: molecule.atoms.length,
            bondCount: molecule.bonds.length,
            isCalculating,
            hasResult: !!calculationResult
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default AppSimple;
