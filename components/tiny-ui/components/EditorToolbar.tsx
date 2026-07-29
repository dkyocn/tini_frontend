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
import ImgEdit from '../../../assets/images/tini-ui/1e23991a-00d7-4dcf-b225-0dc7e1ca68d1.svg';
import ImgBagAlt from '../../../assets/images/tini-ui/0085075d-2274-4cdc-8960-b790a296b587.svg';
import ImgFrame from '../../../assets/images/tini-ui/6553c592-47dd-419a-a6dc-a8147f7e9af3.svg';
import ImgImage2 from '../../../assets/images/tini-ui/0c1c33cd-0617-4081-ac47-039d1f2452ad.svg';
import ImgArhive from '../../../assets/images/tini-ui/4ee8bd4f-6e44-472e-961a-eaff224f4a61.svg';
const imgImage46 = require('../../../assets/images/tini-ui/03b14668-2c36-4fd3-9d31-ff84ecc2ff01.png');

type Props = {
  onPress?: (index: number) => void;
};

export default function EditorToolbar({ onPress }: Props) {
  const icons: React.ReactNode[] = [
    <ImgEdit width={24} height={24} />,
    <ImgBagAlt width={24} height={24} />,
    <ImgFrame width={24} height={20} />,
    <ImgImage2 width={24} height={24} />,
    <ImgArhive width={24} height={24} />,
    <Image source={imgImage46} style={{ width: 14, height: 18 }} resizeMode="contain" />,
  ];

  return (
    <View style={styles.bar}>
      <View style={styles.row}>
        {icons.map((el, i) => (
          <TouchableOpacity key={i} onPress={() => onPress?.(i)} hitSlop={8}>
            {el}
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
