# 티니 UI — React Native 컴포넌트

피그마 파일 **"티니 UI 제작"** 상단 컴포넌트 클러스터를 React Native + TypeScript(StyleSheet)로 변환한 결과물입니다. 각 컴포넌트는 피그마에서 추출한 **정확한 값**(크기·위치·색상·라운드·폰트)을 그대로 반영합니다.

## 구성

```
tiny-ui/
├─ theme.ts              # 공용 디자인 토큰 (색상/폰트/라운드/간격)
└─ components/
   ├─ index.ts           # 배럴 export
   ├─ PostCard.tsx       # 게시물 카드
   └─ ... (총 28개 컴포넌트)
```

## 사용법

```tsx
import { PostCard, StreakCalendar, ColorThemeCard } from './components';

<PostCard authorInitial="J" caption="오늘의 데일리 노트 공유!" />
```

## 적용 전 반드시 처리해야 할 3가지

1. **커스텀 폰트 로딩** — `Nanum GgocNaeEum`, `Inter`는 앱에 폰트를 등록해야 표시됩니다.
   Expo면 `expo-font`, 베어 RN이면 `react-native.config.js` + `npx react-native-asset`로 링크하세요.

2. **이미지 에셋 교체** — 아바타·아이콘·썸네일은 피그마 원본 URL(`figma.com/api/mcp/asset/...`)을
   참조합니다. **이 URL은 발급 후 7일이면 만료**되니, 실제 이미지를 다운로드해 로컬 `assets/`로 옮기고
   `require('../assets/...')`로 교체하세요.

3. **그라데이션** — 순정 StyleSheet는 그라데이션을 지원하지 않아, 그라데이션 배경은 베이스 색으로
   대체하고 정확한 스펙을 주석으로 남겨뒀습니다. 원본과 똑같이 하려면 `expo-linear-gradient`(또는
   `react-native-linear-gradient`)를 설치해 주석의 값으로 `<LinearGradient>`를 적용하세요.

## 참고

- 레이아웃은 피그마의 절대 좌표를 그대로 옮겨 `position:'absolute'` + left/top으로 배치한 곳이 많습니다.
  반응형이 필요하면 flex 기반으로 리팩터링하세요.
- 추출 중 발견된 색상은 `theme.ts`에 토큰으로 정리해 두었고, 일부 컴포넌트는 아직 리터럴 값으로
  인라인되어 있습니다. 필요 시 토큰으로 통일하면 됩니다.
