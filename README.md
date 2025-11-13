# 분자 오비탈 예측기

Extended Hückel 이론 기반 인터랙티브 분자 오비탈 계산 및 시각화 도구

## 주요 기능

- **분자 구조 그리기**: 인터랙티브 2D 캔버스에서 원자 배치 및 결합 생성
- **Extended Hückel 계산**: 분자 오비탈 에너지 및 계수 계산
- **오비탈 시각화**: 전자 밀도 및 위상 표시
- **에너지 레벨 다이어그램**: HOMO-LUMO 갭 및 에너지 준위 시각화
- **예제 분자**: 벤젠, 에틸렌, 물 등 사전 정의된 분자

## 기술 스택

- React 19 + TypeScript
- Vite (빌드 도구)
- Zustand (상태 관리)
- mathjs (행렬 연산)
- Tailwind CSS (스타일링)

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 사용 방법

1. **원자 추가**: 원자 모드에서 캔버스를 클릭하여 원자 추가
2. **결합 생성**: 결합 모드에서 두 원자를 순서대로 클릭
3. **계산 실행**: "오비탈 계산 실행" 버튼 클릭
4. **오비탈 선택**: 에너지 다이어그램에서 오비탈 클릭하여 시각화

## Extended Hückel 이론

Extended Hückel 이론은 분자 오비탈을 근사적으로 계산하는 semi-empirical 방법입니다:

- **Wolfsberg-Helmholz 근사**: H_ij = K * S_ij * (H_ii + H_jj) / 2
- **Slater 타입 궤도함수**: 원자 궤도함수 겹침 계산
- **일반화된 고유값 문제**: H * C = E * S * C

## 화학 이론 배경

### 분자 오비탈 이론
- LCAO (Linear Combination of Atomic Orbitals)
- 결합성, 반결합성, 비결합성 오비탈
- HOMO-LUMO 갭과 화학 반응성

### 궤도함수 매개변수
- 각 원소의 원자가 오비탈 에너지 (eV)
- Slater 지수 (유효 핵전하)
- 겹침 적분 계산

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── MoleculeEditor.tsx
│   ├── OrbitalVisualization.tsx
│   ├── EnergyDiagram.tsx
│   └── ControlPanel.tsx
├── store/              # Zustand 상태 관리
│   └── moleculeStore.ts
├── utils/              # 계산 유틸리티
│   ├── extendedHuckel.ts
│   ├── slaterOrbitals.ts
│   └── matrixUtils.ts
├── types/              # TypeScript 타입
│   └── index.ts
├── App.tsx
└── main.tsx
```

## 개발자 노트

- 계산은 클라이언트 사이드에서 수행됩니다
- 대형 분자의 경우 계산 시간이 걸릴 수 있습니다
- 시각화는 2D 투영으로 근사됩니다

## 향후 개선 사항

- [ ] 3D 오비탈 시각화 (Three.js)
- [ ] DFT (Density Functional Theory) 지원
- [ ] 분자 최적화 (기하 구조 최적화)
- [ ] IR/UV 스펙트럼 예측
- [ ] 더 많은 원소 지원

## 라이선스

MIT License

## 기여

고급화학 주제발표용 프로젝트
