/**
 * NotificationSettingsPage (마이페이지 > 계정관리 > 알림 설정)
 *
 * Figma "계정관리_알림설정" (node 35:1114) + "일일 리마인드 시간" 바텀시트 (35:1179).
 * 항목마다 토글. "전체 알림"은 나머지 항목을 한꺼번에 켜고 끔.
 * "일일 리마인드" 시간(회색)을 누르면 시간 선택 시트가 열림.
 * 서버 API가 아직 없어 기기(AsyncStorage)에 저장.
 */

import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';

import MyPageItemCard, {
  ItemValueText,
} from '../../components/tiny-ui/components/MyPageItemCard';
import ToggleSwitch from '../../components/tiny-ui/components/ToggleSwitch';
import TimePickerSheet, {
  TimeValue,
  formatTimeShort,
} from '../../components/tiny-ui/components/TimePickerSheet';
import useStoredState from '../../utils/useStoredState';
import SubPageLayout from './SubPageLayout';
import type { TabKey } from '../main/MainPage';

type ToggleKey = 'dailyReminder' | 'goalAchieved' | 'serviceNews' | 'marketing';

const ITEMS: { key: ToggleKey; label: string }[] = [
  { key: 'dailyReminder', label: '일일 리마인드' },
  { key: 'goalAchieved', label: '목표 달성 알림' },
  { key: 'serviceNews', label: '서비스 소식 및 이벤트' },
  { key: 'marketing', label: '마케팅 정보 수신 및 혜택 알림' },
];

const DEFAULT_SETTINGS: Record<ToggleKey, boolean> & { reminderTime: TimeValue } = {
  dailyReminder: true,
  goalAchieved: true,
  serviceNews: false,
  marketing: false,
  reminderTime: { hour: 9, minute: 0 },
};

type Props = {
  onBack?: () => void;
  onTabPress?: (key: TabKey) => void;
};

export default function NotificationSettingsPage({ onBack, onTabPress }: Props) {
  const [settings, update] = useStoredState('notificationSettings', DEFAULT_SETTINGS);
  const [pickerVisible, setPickerVisible] = useState(false);

  const allOn = ITEMS.every(({ key }) => settings[key]);

  const setAll = (on: boolean) => {
    update({ dailyReminder: on, goalAchieved: on, serviceNews: on, marketing: on });
  };

  return (
    <SubPageLayout title="알림 설정" onBack={onBack} onTabPress={onTabPress}>
      <MyPageItemCard label="전체 알림" trailing={<ToggleSwitch value={allOn} onValueChange={setAll} />} />

      {ITEMS.map(({ key, label }) => (
        <MyPageItemCard
          key={key}
          label={label}
          trailing={
            <>
              {key === 'dailyReminder' && (
                <TouchableOpacity onPress={() => setPickerVisible(true)} activeOpacity={0.6}>
                  <ItemValueText>{formatTimeShort(settings.reminderTime)}</ItemValueText>
                </TouchableOpacity>
              )}
              <ToggleSwitch value={settings[key]} onValueChange={(v) => update({ [key]: v })} />
            </>
          }
        />
      ))}

      <TimePickerSheet
        visible={pickerVisible}
        title="일일 리마인드 시간"
        value={settings.reminderTime}
        onClose={() => setPickerVisible(false)}
        onConfirm={(time) => {
          update({ reminderTime: time });
          setPickerVisible(false);
        }}
      />
    </SubPageLayout>
  );
}
