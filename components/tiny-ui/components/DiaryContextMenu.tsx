/**
 * DiaryContextMenu (다이어리 컨텍스트 메뉴)
 * Figma node: 1097:15376  —  원본 프레임명: Frame 1948755761
 *
 * 다이어리 롱프레스 시 뜨는 흰 배경(rounded 10) 팝오버 메뉴.
 * 항목: 다이어리 삭제(#ff3672) / 대표 다이어리로 설정 / 책장으로 옮기기.
 * 원본 프레임에 명시적 사이즈가 없어 컨텐츠 기준으로 173x100 로 추정.
 *
 * 주의: 에셋 URL은 발급 후 7일이면 만료됩니다.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
import ImgMinus from '../../../assets/images/tini-ui/963de233-f371-4654-8380-f363860e702c.svg';

type Props = {
  onDelete?: () => void;
  onSetPrimary?: () => void;
  onMoveToShelf?: () => void;
};

export default function DiaryContextMenu({ onDelete, onSetPrimary, onMoveToShelf }: Props) {
  return (
    <View style={styles.menu}>
      {/* 다이어리 삭제 */}
      <ImgMinus style={styles.minusIcon} />
      <TouchableOpacity style={styles.deleteHit} onPress={onDelete}>
        <Text style={styles.deleteText}>다이어리 삭제</Text>
      </TouchableOpacity>

      {/* 대표 다이어리로 설정 */}
      <TouchableOpacity style={styles.setPrimaryHit} onPress={onSetPrimary}>
        <Text style={styles.itemText}>대표 다이어리로 설정</Text>
      </TouchableOpacity>

      {/* 책장으로 옮기기 */}
      <TouchableOpacity style={styles.moveHit} onPress={onMoveToShelf}>
        <Text style={styles.itemText}>책장으로 옮기기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    width: 173,
    height: 100,
    backgroundColor: colors.white,
    borderRadius: 10,
    overflow: 'hidden',
    // shadow: 0px 4px 4px rgba(0,0,0,0.25)
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  minusIcon: {
    position: 'absolute',
    left: 33,
    top: 15,
    width: 16,
    height: 16,
  },
  deleteHit: {
    position: 'absolute',
    left: 45, // calc(50% - 41px) 기준 텍스트 시작
    top: 15,
  },
  deleteText: {
    fontFamily: fonts.inter,
    fontWeight: '500',
    fontSize: 14,
    color: '#ff3672',
  },
  setPrimaryHit: {
    position: 'absolute',
    left: 33,
    top: 44,
  },
  moveHit: {
    position: 'absolute',
    left: 22, // calc(50% - 64px)
    top: 73,
  },
  itemText: {
    fontFamily: fonts.inter,
    fontWeight: '500',
    fontSize: 14,
    color: colors.black,
  },
});
