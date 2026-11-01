/**
 * ConfirmActionPage (항목을 누르면 확인 팝업이 뜨는 마이페이지 하위 화면)
 *
 * Figma "계정관리_기기정보삭제" (앱 초기화 / 다이어리 전체 삭제)
 *       "계정관리_로그아웃"     (로그아웃 / 계정 탈퇴)
 * 항목마다 팝업 문구가 다르고, 팝업에서 확인을 누르면 onConfirm 실행.
 * confirm이 없는 항목은 팝업 없이 바로 onConfirm 실행.
 */

import React from 'react';

import MyPageItemCard from '../../components/tiny-ui/components/MyPageItemCard';
import {
  ConfirmOptions,
  useConfirm,
} from '../../components/tiny-ui/components/ConfirmProvider';
import SubPageLayout from './SubPageLayout';
import type { TabKey } from '../main/MainPage';

export type ConfirmAction = {
  label: string;
  confirm?: ConfirmOptions;
  onConfirm: () => void;
};

type Props = {
  title: string;
  actions: ConfirmAction[];
  onBack?: () => void;
  onTabPress?: (key: TabKey) => void;
};

export default function ConfirmActionPage({ title, actions, onBack, onTabPress }: Props) {
  const confirm = useConfirm();

  const handlePress = async (action: ConfirmAction) => {
    if (!action.confirm || (await confirm(action.confirm))) {
      action.onConfirm();
    }
  };

  return (
    <SubPageLayout title={title} onBack={onBack} onTabPress={onTabPress}>
      {actions.map((action) => (
        <MyPageItemCard key={action.label} label={action.label} onPress={() => handlePress(action)} />
      ))}
    </SubPageLayout>
  );
}
