/**
 * NotificationSettingsPage (마이페이지 > 계정관리 > 알림 설정)
 *
 * Figma "계정관리_알림설정" (node 61:1771) + "일일 리마인드 시간" 바텀시트 (35:1179).
 * 항목마다 토글. "전체 알림"은 나머지 항목을 한꺼번에 켜고 끔.
 * "일일 리마인드" 시간(회색)을 누르면 시간 선택 시트가 열림.
 * "마케팅 알림 설정" 카드:
 *  - "내용보기 >" → 마케팅 정보 활용 약관(onOpenMarketingTerms)
 *  - "마케팅 목적의 개인정보 수집 및 이용" 동의 토글 (MarketingConsentPage와 같은 저장값)
 *  - "마케팅 정보 수신 및 혜택 알림" 아래 SMS / SNS / 이메일 채널별 토글
 *    → 동의 전에는 비활성화, 동의를 끄면 채널도 모두 꺼짐
 * 서버 API가 아직 없어 기기(AsyncStorage)에 저장.
 */

import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import MyPageItemCard, {
  ItemValueText,
} from '../../components/tiny-ui/components/MyPageItemCard';
import ToggleSwitch from '../../components/tiny-ui/components/ToggleSwitch';
import TimePickerSheet, {
  TimeValue,
  formatTimeShort,
} from '../../components/tiny-ui/components/TimePickerSheet';
import { colors, fonts } from '../../components/tiny-ui/theme';
import ChevronRight from '../../assets/images/mypage/chevron-right.svg';
import useStoredState from '../../utils/useStoredState';
import SubPageLayout from './SubPageLayout';
import { MARKETING_CONSENT_KEY, DEFAULT_MARKETING_CONSENT } from './marketingConsent';
import type { TabKey } from '../main/MainPage';

type ToggleKey = 'dailyReminder' | 'goalAchieved' | 'serviceNews';

const ITEMS: { key: ToggleKey; label: string }[] = [
  { key: 'dailyReminder', label: '일일 리마인드' },
  { key: 'goalAchieved', label: '목표 달성 알림' },
  { key: 'serviceNews', label: '서비스 소식 및 이벤트' },
];

type MarketingChannel = 'sms' | 'sns' | 'email';

const MARKETING_CHANNELS: { key: MarketingChannel; label: string }[] = [
  { key: 'sms', label: 'SMS' },
  { key: 'sns', label: 'SNS' },
  { key: 'email', label: '이메일' },
];

const ALL_CHANNELS: Record<MarketingChannel, boolean> = { sms: true, sns: true, email: true };
const NO_CHANNELS: Record<MarketingChannel, boolean> = { sms: false, sns: false, email: false };

const DEFAULT_SETTINGS: Record<ToggleKey, boolean> & {
  /** 채널 중 하나라도 켜져 있으면 true (마케팅 수신 여부) */
  marketing: boolean;
  reminderTime: TimeValue;
  marketingChannels: Record<MarketingChannel, boolean>;
} = {
  dailyReminder: true,
  goalAchieved: true,
  serviceNews: false,
  marketing: false,
  reminderTime: { hour: 9, minute: 0 },
  marketingChannels: NO_CHANNELS,
};

const STORAGE_KEY = 'notificationSettings';

/**
 * 마케팅 알림(SMS/SNS/이메일 채널)을 모두 끔.
 * 마케팅 정보 활용 동의를 철회할 때 호출 (MarketingConsentPage).
 * 다른 알림 항목은 건드리지 않도록 저장된 값을 읽어 병합한 뒤 저장.
 */
export async function disableMarketingNotifications() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const saved = raw ? JSON.parse(raw) : {};
  const next = { ...DEFAULT_SETTINGS, ...saved, marketing: false, marketingChannels: NO_CHANNELS };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

type Props = {
  onBack?: () => void;
  onTabPress?: (key: TabKey) => void;
  /** "내용보기" → 마케팅 정보 활용 약관 */
  onOpenMarketingTerms?: () => void;
};

export default function NotificationSettingsPage({ onBack, onTabPress, onOpenMarketingTerms }: Props) {
  const [settings, update] = useStoredState(STORAGE_KEY, DEFAULT_SETTINGS);
  const [consent, updateConsent] = useStoredState(MARKETING_CONSENT_KEY, DEFAULT_MARKETING_CONSENT);
  const [pickerVisible, setPickerVisible] = useState(false);

  // 동의 전에는 채널을 켤 수 없고, 저장값과 무관하게 꺼진 것으로 표시
  const consented = consent.personalInfoForMarketing;
  const channelOn = (channel: MarketingChannel) => consented && settings.marketingChannels[channel];

  // 전체 알림: 동의 전이면 마케팅 채널은 제외하고 판단
  const allOn =
    ITEMS.every(({ key }) => settings[key]) &&
    (!consented || MARKETING_CHANNELS.every(({ key }) => channelOn(key)));

  const setAll = (on: boolean) => {
    const marketingOn = on && consented;
    update({
      dailyReminder: on,
      goalAchieved: on,
      serviceNews: on,
      marketing: marketingOn,
      marketingChannels: marketingOn ? ALL_CHANNELS : NO_CHANNELS,
    });
  };

  const setConsent = (on: boolean) => {
    updateConsent({ personalInfoForMarketing: on });
    // 동의 철회 시 마케팅 알림도 모두 끔
    if (!on) update({ marketing: false, marketingChannels: NO_CHANNELS });
  };

  const toggleChannel = (channel: MarketingChannel) => {
    const next = { ...settings.marketingChannels, [channel]: !settings.marketingChannels[channel] };
    update({ marketingChannels: next, marketing: Object.values(next).some(Boolean) });
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

      {/* 마케팅 알림 설정 (Figma 61:1819) */}
      <View style={styles.marketingCard}>
        <MyPageItemCard
          label="마케팅 알림 설정"
          style={styles.transparentHeader}
          trailing={
            <TouchableOpacity
              style={styles.viewTerms}
              onPress={onOpenMarketingTerms}
              disabled={!onOpenMarketingTerms}
              activeOpacity={0.6}
            >
              <Text style={styles.viewTermsText}>내용보기</Text>
              <ChevronRight width={5.2} height={10.032} />
            </TouchableOpacity>
          }
        />

        <View style={[styles.row, styles.subRow]}>
          <Text style={styles.rowLabel}>마케팅 목적의 개인정보 수집 및 이용</Text>
          <ToggleSwitch value={consented} onValueChange={setConsent} />
        </View>

        <View style={[styles.row, styles.subRow, styles.gapSmall]}>
          <Text style={styles.rowLabel}>마케팅 정보 수신 및 혜택 알림</Text>
        </View>

        {MARKETING_CHANNELS.map(({ key: channel, label }, i) => (
          <View
            key={channel}
            style={[styles.row, styles.channelRow, i === 0 ? styles.gapSmall : styles.gapLarge]}
          >
            <Text style={styles.rowLabel}>{label}</Text>
            <ToggleSwitch
              value={channelOn(channel)}
              disabled={!consented}
              onValueChange={() => toggleChannel(channel)}
            />
          </View>
        ))}
      </View>

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

// Figma 61:1819 — 마케팅 카드(302): 헤더 60 + 행(30) 5개, 간격 0/14/14/20/20, 하단 여백 24
const styles = StyleSheet.create({
  marketingCard: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: colors.white,
    paddingBottom: 24,
  },
  transparentHeader: {
    backgroundColor: 'transparent',
  },
  viewTerms: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewTermsText: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: '#A1A1A1',
  },
  row: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  // 불릿(16) + 간격(16) + 카드 좌측 여백(24) → 헤더 라벨과 정렬
  subRow: {
    paddingLeft: 56,
  },
  // 채널은 한 단계 더 들여쓰기
  channelRow: {
    paddingLeft: 73,
  },
  gapSmall: {
    marginTop: 14,
  },
  gapLarge: {
    marginTop: 20,
  },
  rowLabel: {
    flexShrink: 1,
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
});
