/**
 * PostCard (게시물)
 * Figma node: 1097:15016  —  file: 티니 UI 제작
 *
 * 피그마에서 뽑은 정확한 값으로 구현했습니다.
 *  - 카드: 353 x 430, borderRadius 30, 흰 배경
 *  - 캡션 폰트: "Nanum GgocNaeEum" Regular 18 (본문18 스타일)
 *  - 이미지 영역: 272 높이, 세로 그라데이션 rgba(136,136,136,0.2) → rgba(176,202,103,0.2) 위에 #F6F6F9
 *
 * 주의(라이브러리 없이 StyleSheet만 사용):
 *  1) 그라데이션은 순정 StyleSheet로 표현이 안 됩니다. 아래에서는 베이스 색(#F6F6F9)으로
 *     대체했고, 정확히 재현하려면 expo-linear-gradient 등이 필요합니다(값은 주석에 남겨둠).
 *  2) 아바타/메뉴/좋아요 아이콘은 피그마 원본 에셋 URL을 그대로 참조합니다.
 *     이 URL은 발급 후 7일이면 만료되니, 실제 프로젝트에선 로컬 asset으로 교체하세요.
 *  3) "Nanum GgocNaeEum" / "Inter"는 커스텀 폰트라 앱에 폰트 로딩/링크가 필요합니다.
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// 피그마 원본 에셋 (7일 후 만료 — 로컬 asset으로 교체 권장)
const imgLikeComment = require('../../../assets/images/tini-ui/d1c9ca4d-0a2c-45b9-98b0-051a5a8fe46d.png');
const imgDots = require('../../../assets/images/tini-ui/e2de98a5-243e-4319-a562-896b345ddb7e.png');
const imgAvatar = require('../../../assets/images/tini-ui/21cc2712-841a-4270-9c06-68babab7f410.png');
const imgMenu = require('../../../assets/images/tini-ui/0ac893a6-97fe-4436-8ef6-e7b3016c6714.png');

type PostCardProps = {
  authorInitial?: string;   // 아바타 옆 글자 (예: "J")
  caption?: string;         // 하단 캡션
  onPressMenu?: () => void;
};

export default function PostCard({
  authorInitial = 'J',
  caption = '오늘의 데일리 노트 공유!',
  onPressMenu,
}: PostCardProps) {
  return (
    <View style={styles.card}>
      {/* 헤더: 아바타 + 이니셜 / 메뉴 */}
      <View style={styles.header}>
        <View style={styles.authorGroup}>
          <Image source={imgAvatar} style={styles.avatar} />
          <Text style={styles.authorInitial}>{authorInitial}</Text>
        </View>
        <TouchableOpacity onPress={onPressMenu} hitSlop={8}>
          <Image source={imgMenu} style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      {/* 이미지 영역 */}
      {/*
        정확한 그라데이션(순정 StyleSheet 미지원, 참고용):
        linear-gradient(180deg, rgba(136,136,136,0.2) 0%, rgba(176,202,103,0.2) 100%)
        위에 base #F6F6F9
      */}
      <View style={styles.imageArea} />

      {/* 좋아요 / 댓글 아이콘 행 */}
      <View style={styles.actionRow}>
        <Image source={imgLikeComment} style={styles.likeComment} resizeMode="contain" />
        <Image source={imgDots} style={styles.dots} resizeMode="contain" />
      </View>

      {/* 캡션 */}
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 353,
    height: 430,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  header: {
    position: 'absolute',
    top: 23,
    left: 20,
    width: 313,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorGroup: {
    width: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 30,
    height: 30,
  },
  authorInitial: {
    fontFamily: 'Inter',
    fontSize: 28,
    lineHeight: 16,
    letterSpacing: -0.5,
    color: '#000000',
    textAlign: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  imageArea: {
    position: 'absolute',
    top: 65,
    left: 0,
    width: 353,
    height: 272,
    backgroundColor: '#F6F6F9',
  },
  actionRow: {
    position: 'absolute',
    top: 349,
    left: 20,
    width: 186,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likeComment: {
    width: 58,
    height: 22,
  },
  dots: {
    width: 20,
    height: 8,
  },
  caption: {
    position: 'absolute',
    top: 384,
    width: 353,
    textAlign: 'center',
    fontFamily: 'Nanum GgocNaeEum',
    fontSize: 18,
    color: '#000000',
  },
});
