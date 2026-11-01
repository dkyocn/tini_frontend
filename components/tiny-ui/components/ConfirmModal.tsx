/**
 * ConfirmModal (마이페이지 확인 팝업)
 * Figma: 마이페이지_수정 > 계정관리 (계정 연동 해제 35:963 / 앱 초기화 / 다이어리 전체 삭제 / 계정 탈퇴)
 *
 * 353 x 250 흰 카드(radius 20) + 제목(20, bold) + 설명(14, 줄간격 1.7)
 * + 취소(연회색) / 확인(연두) 버튼 130 x 48.
 *
 * 화면마다 visible state를 두기 번거로우면 ConfirmProvider의 useConfirm()으로 띄우세요.
 */

import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** false면 확인 버튼 하나만 (안내용 팝업) */
  showCancel?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  showCancel = true,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.dim}>
        <View style={styles.card}>
          <View style={styles.textBlock}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
          <View style={styles.buttons}>
            {showCancel && (
              <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel} activeOpacity={0.7}>
                <Text style={styles.buttonText}>{cancelLabel}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm} activeOpacity={0.7}>
              <Text style={styles.buttonText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 353,
    minHeight: 250,
    borderRadius: 20,
    backgroundColor: colors.white,
    paddingTop: 47,
    paddingBottom: 23,
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  textBlock: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontFamily: fonts.inter,
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  message: {
    fontFamily: fonts.inter,
    fontSize: 14,
    lineHeight: 24,
    color: colors.black,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    width: 130,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    backgroundColor: colors.bg,
  },
  confirm: {
    backgroundColor: colors.accent,
  },
  buttonText: {
    fontFamily: fonts.inter,
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
  },
});
