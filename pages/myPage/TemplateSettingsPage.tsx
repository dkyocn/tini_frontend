/**
 * TemplateSettingsPage (마이페이지 > 설정 > 템플릿 설정(시간 설정))
 *
 * Figma "템플릿 설정" 섹션 (node 35:1202)
 *  - 설정 팝업 (35:1366)     : 일주일 시작일 / 시간 표기 / 하루 종료 시간 / 월 표시 / 요일 표시
 *  - 하루 종료 시간 (35:1271) : 시간 선택 바텀시트, 현재 값은 카드 오른쪽에 굵게 표시
 *  - 나머지 항목             : OptionSelectPage(일주일 시작일 35:1335 등)로 이동
 */

import React, { useState } from 'react';

import MyPageItemCard, {
  ItemValueText,
} from '../../components/tiny-ui/components/MyPageItemCard';
import TimePickerSheet, {
  TimeValue,
  formatTimePadded,
} from '../../components/tiny-ui/components/TimePickerSheet';
import SubPageLayout from './SubPageLayout';
import type { TabKey } from '../main/MainPage';

export type TemplateSettings = {
  weekStart: string;
  timeFormat: string;
  dayEndTime: TimeValue;
  monthFormat: string;
  weekdayFormat: string;
};

export type TemplateOptionKey = Exclude<keyof TemplateSettings, 'dayEndTime'>;

export const DEFAULT_TEMPLATE_SETTINGS: TemplateSettings = {
  weekStart: '월요일',
  timeFormat: '12시간제',
  dayEndTime: { hour: 19, minute: 30 },
  monthFormat: '숫자',
  weekdayFormat: '한글',
};

/** 옵션 선택형 항목 — 화면 제목과 선택지 (Figma 각 프레임 순서 그대로) */
export const TEMPLATE_OPTIONS: Record<TemplateOptionKey, { title: string; options: string[] }> = {
  weekStart: { title: '일주일 시작일', options: ['일요일', '월요일'] },
  timeFormat: { title: '시간 표기', options: ['12시간제', '24시간제'] },
  monthFormat: { title: '월 표시', options: ['숫자', '영문'] },
  weekdayFormat: { title: '요일 표시', options: ['한글', '영문', '한문'] },
};

const ROWS: (TemplateOptionKey | 'dayEndTime')[] = [
  'weekStart',
  'timeFormat',
  'dayEndTime',
  'monthFormat',
  'weekdayFormat',
];

type Props = {
  settings: TemplateSettings;
  onChange: (patch: Partial<TemplateSettings>) => void;
  onOpenOption: (key: TemplateOptionKey) => void;
  onBack?: () => void;
  onTabPress?: (key: TabKey) => void;
};

export default function TemplateSettingsPage({
  settings,
  onChange,
  onOpenOption,
  onBack,
  onTabPress,
}: Props) {
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <SubPageLayout title="설정 팝업" onBack={onBack} onTabPress={onTabPress}>
      {ROWS.map((key) =>
        key === 'dayEndTime' ? (
          <MyPageItemCard
            key={key}
            label="하루 종료 시간"
            onPress={() => setPickerVisible(true)}
            trailing={<ItemValueText dark>{formatTimePadded(settings.dayEndTime)}</ItemValueText>}
          />
        ) : (
          <MyPageItemCard
            key={key}
            label={TEMPLATE_OPTIONS[key].title}
            onPress={() => onOpenOption(key)}
          />
        ),
      )}

      <TimePickerSheet
        visible={pickerVisible}
        title="하루 종료 시간"
        value={settings.dayEndTime}
        onClose={() => setPickerVisible(false)}
        onConfirm={(time) => {
          onChange({ dayEndTime: time });
          setPickerVisible(false);
        }}
      />
    </SubPageLayout>
  );
}
