/**
 * EditorToolbar (에디터 하단 아이콘 툴바)
 * Figma node: 1097:15170  —  원본 프레임명: Frame 1948756059
 *
 * 흰 배경 pill(rounded 30) 위에 6개 아이콘이 가로로 나열된 툴바.
 * 아이콘 간격 20, 좌우 패딩 40 / 상하 10.
 *
 * 주의: 에셋 URL은 발급 후 7일이면 만료됩니다.
 */

import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

// 피그마 에셋 — 7일 후 만료, 로컬 asset으로 교체
const imgEdit = require('../../../assets/images/tini-ui/1e23991a-00d7-4dcf-b225-0dc7e1ca68d1.png');
const imgBagAlt = require('../../../assets/images/tini-ui/0085075d-2274-4cdc-8960-b790a296b587.png');
const imgFrame = require('../../../assets/images/tini-ui/6553c592-47dd-419a-a6dc-a8147f7e9af3.png');
const imgImage2 = require('../../../assets/images/tini-ui/0c1c33cd-0617-4081-ac47-039d1f2452ad.png');
const imgArhive = require('../../../assets/images/tini-ui/4ee8bd4f-6e44-472e-961a-eaff224f4a61.png');
const imgImage46 = require('../../../assets/images/tini-ui/03b14668-2c36-4fd3-9d31-ff84ecc2ff01.png');

type Props = {
  onPress?: (index: number) => void;
};

export default function EditorToolbar({ onPress }: Props) {
  const icons = [
    { src: imgEdit, w: 24, h: 24 },
    { src: imgBagAlt, w: 24, h: 24 },
    { src: imgFrame, w: 24, h: 20 },
    { src: imgImage2, w: 24, h: 24 },
    { src: imgArhive, w: 24, h: 24 },
    { src: imgImage46, w: 14, h: 18 },
  ];

  return (
    <View style={styles.bar}>
      <View style={styles.row}>
        {icons.map((ic, i) => (
          <TouchableOpacity key={i} onPress={() => onPress?.(i)} hitSlop={8}>
            <Image source={ic.src} style={{ width: ic.w, height: ic.h }} resizeMode="contain" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.white,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 10,
    // drop-shadow(0px 4px 5px rgba(0,0,0,0.25))
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
});
