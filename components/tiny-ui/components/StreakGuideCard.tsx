/**
 * StreakGuideCard (연속 기록 유지하는 법 안내 카드)
 * Figma node: 1097:15533  —  원본 프레임: Frame 1948756066
 *
 * "연속 기록 유지하는 법" 안내 카드: 타이틀 + 닫기 체크박스 + 티니 캐릭터 이미지 +
 * 강조(#25EEBA) 문구가 섞인 안내 본문 2단락.
 *
 * 주의:
 *  - 캐릭터 이미지는 피그마 에셋 사용.
 *  - 폰트 'Inter'는 앱에 폰트 로딩/링크 필요.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';
import TiniFrame from '../../../assets/images/tiniFrame.svg';

export default function StreakGuideCard() {
  return (
    <View style={styles.container}>
      {/* 카드 배경 */}
      <View style={styles.card} />

      {/* 타이틀 */}
      <Text style={styles.title}>연속 기록 유지하는 법</Text>

      {/* 닫기 체크박스 */}
      <View style={styles.checkbox} />

      {/* 본문 영역 */}
      <View style={styles.body}>
        <TiniFrame width={80} height={96} />

        <View style={styles.paragraphs}>
          <Text style={styles.paragraph}>
            <Text style={styles.highlight}>하루에 템플릿 5개</Text>
            <Text> 이상 </Text>
            {'\n'}
            <Text>작성하거나 </Text>
            <Text style={styles.highlight}>글상자에 50자 이상</Text>
            <Text> 작성하면 연속 작성 기록이 유지돼요.</Text>
          </Text>

          <Text style={styles.paragraph}>
            작성을 건너뛰면{'\n'}연속 작성 기록이 초기화될 수 있어요.{'\n'}오늘도 연속 작성을 이어가세요!
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 353,
    height: 360,
  },
  card: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 353,
    height: 360,
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  title: {
    position: 'absolute',
    top: 21,
    left: 353 / 2 - 109.5,
    fontFamily: fonts.inter,
    fontSize: 24,
    color: colors.black,
  },
  checkbox: {
    position: 'absolute',
    top: 26,
    left: 20,
    width: 20,
    height: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,
  },
  body: {
    position: 'absolute',
    top: 69,
    left: 353 / 2 - 140,
    width: 280,
    alignItems: 'center',
    gap: 16,
  },
  character: {
    width: 80,
    height: 96,
  },
  paragraphs: {
    width: '100%',
    gap: 20,
  },
  paragraph: {
    fontFamily: fonts.inter,
    fontSize: 16,
    lineHeight: 22.4, // 1.4 * 16
    color: colors.black,
    textAlign: 'center',
  },
  highlight: {
    fontFamily: fonts.inter,
    fontWeight: '600',
    color: '#25EEBA',
  },
});
