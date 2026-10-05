/**
 * TodayTracking (오늘의 트래킹)
 *
 * MainPage 일러스트의 세잎클로버(우하단) 터치 시 뜨는 팝업.
 * Figma "오늘의 트래킹" 섹션(node 6:515) 기준. 353 x 520 카드.
 *
 * 상단 X(닫기) / 제목 / 완료 버튼 + 날짜, 10개 탭. 탭 바는 좌우로 자유롭게 스크롤되고,
 * 탭을 눌러 선택했을 때만 아래 내용이 바뀜 (아래 내용은 위아래로 스크롤):
 *   생체건강 · 생활습관 · 감정 · 에너지 상태 · 자기인식 · 사회활동 여가 · 디지털 집중 · 환경 · 북트래커 · 가계부
 *
 * 입력값은 전부 컴포넌트 내부 state(data)에 모아 두고, "완료"를 누르면 onComplete(data)로 넘김.
 * (서버 연동 전이라 저장은 부모 쪽에서 처리)
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  LayoutChangeEvent,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '../../components/tiny-ui/theme';

const CARD_WIDTH = 353;
const CARD_HEIGHT = 520;
const HEADER_HEIGHT = 91;
const TAB_HEIGHT = 43;
const TAB_ITEM_WIDTH = 113; // 탭 라벨 폭(86) + 간격(27)
const TAB_BAR_PADDING = 1;
const PAGE_HEIGHT = CARD_HEIGHT - HEADER_HEIGHT - TAB_HEIGHT;

const ORANGE = '#FA855A'; // 입력된 값 강조색
const SLIDER_MAX = 5;
const SLIDER_KNOB = 16;

type Value = number | string | string[];
type Data = Record<string, Value>;

/** 각 탭 페이지가 받는 공용 props */
type PageProps = {
  data: Data;
  set: (key: string, value: Value) => void;
};

const TABS = [
  { key: 'bio', label: '생체건강' },
  { key: 'habit', label: '생활습관' },
  { key: 'emotion', label: '감정' },
  { key: 'energy', label: '에너지 상태' },
  { key: 'self', label: '자기인식' },
  { key: 'leisure', label: '사회활동 여가' },
  { key: 'digital', label: '디지털 집중' },
  { key: 'env', label: '환경' },
  { key: 'book', label: '북트래커' },
  { key: 'ledger', label: '가계부' },
] as const;

// 2열 그리드에 행 순서(왼쪽, 오른쪽, 왼쪽, …)대로 흘러가므로 Figma 화면 배치에 맞춰 나열
const WEATHER_OPTIONS = ['바람 심함', '맑음', '구름 있음', '흐림', '여우비', '비', '천둥번개', '눈'];
const LEISURE_OPTIONS = ['취미, 오락', '휴식', '관계, 사회참여', '운동', '자기계발, 배움', '기타'];
// 가계부 섹션 항목 (Figma 위→아래 순서 그대로)
const VARIABLE_ITEMS = ['생활비', '비상지출', '절약가능', '관계비용', '특별 소비'];
const INVEST_ITEMS = [
  '현금, CMA', '국내 주식', 'ETF', '채권', '코인, 크립토', '고위험 투자',
  '예적금', '해외 주식', '배당 투자', '금, 원자재', '연금, 노후', '부동산',
];
const SAVING_ITEMS = [
  '비상금', '취미', '전자기기', '연애, 기념일', '자동차, 이동', '투자 종잣돈',
  '여행', '자기개발', '건강', '독립, 이사', '꿈, 목표', '기타 저축',
];

function formatKoreanDate(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/* ───────────────────────── 공용 입력 요소 ───────────────────────── */

/** 0~5 슬라이더. 트랙의 원하는 단계를 탭해서 값 변경. */
function Slider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [width, setWidth] = useState(0);
  const span = Math.max(width - SLIDER_KNOB, 0);
  // 값이 0이어도 왼쪽 끝에 16px 연두 원(노브)이 보이도록 항상 노브 폭 이상
  const fillWidth = SLIDER_KNOB + (span * value) / SLIDER_MAX;

  return (
    <View style={styles.sliderRow}>
      <View
        style={styles.sliderTrack}
        onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      >
        <View style={[styles.sliderFill, { width: fillWidth }]} />
        <View style={[styles.sliderKnob, { left: fillWidth - 10 }]} />
        {Array.from({ length: SLIDER_MAX - value }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.sliderDot,
              { left: SLIDER_KNOB / 2 + (span * (value + i + 1)) / SLIDER_MAX - 2 },
            ]}
          />
        ))}
        {/* 0~5 각 단계 위치에 탭 영역을 배치. 제스처 responder를 쓰지 않아 스크롤과 충돌하지 않음 */}
        {span > 0 &&
          Array.from({ length: SLIDER_MAX + 1 }).map((_, k) => {
            const zone = span / SLIDER_MAX;
            const center = SLIDER_KNOB / 2 + zone * k;
            return (
              <Pressable
                key={k}
                style={[styles.sliderZone, { left: center - zone / 2, width: zone }]}
                onPress={() => onChange(k)}
              />
            );
          })}
      </View>
      <Text style={styles.sliderValue}>{value}</Text>
    </View>
  );
}

function SliderField({
  label,
  dataKey,
  data,
  set,
}: { label: string; dataKey: string } & PageProps) {
  const value = typeof data[dataKey] === 'number' ? (data[dataKey] as number) : 0;
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Slider value={value} onChange={(v) => set(dataKey, v)} />
      </View>
    </View>
  );
}

/** 라벨 + 숫자 직접 입력 + 단위 */
function InputRow({
  label,
  unit,
  dataKey,
  data,
  set,
  unitAccent,
  labelNode,
}: {
  label?: string;
  unit: string;
  dataKey: string;
  unitAccent?: boolean;
  labelNode?: React.ReactNode;
} & PageProps) {
  const value = typeof data[dataKey] === 'string' ? (data[dataKey] as string) : '';
  // 평소에는 가벼운 Text로 보여 주고, 탭했을 때만 TextInput으로 교체.
  // (가계부 섹션을 펼칠 때 TextInput 수십 개가 한꺼번에 생성되면 UI가 잠깐 멈춰 스크롤이 먹통이 됨)
  const [editing, setEditing] = useState(false);
  const valueStyle = [styles.input, value !== '' && styles.inputFilled];

  return (
    <View style={styles.row}>
      {labelNode ?? <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrap}>
        {editing ? (
          <TextInput
            style={valueStyle}
            value={value}
            onChangeText={(t) => set(dataKey, t)}
            onBlur={() => setEditing(false)}
            placeholder="입력하기"
            placeholderTextColor="rgba(0,0,0,0.6)"
            keyboardType="numeric"
            autoFocus
          />
        ) : (
          <Pressable style={styles.inputTouch} onPress={() => setEditing(true)}>
            <Text style={[valueStyle, value === '' && styles.inputPlaceholder]}>
              {value === '' ? '입력하기' : value}
            </Text>
          </Pressable>
        )}
        <Text style={[styles.unit, unitAccent && styles.unitAccent]}>{unit}</Text>
      </View>
    </View>
  );
}

/** 연두색 원 + 플러스 아이콘 (북트래커 책 추가, 가계부 항목 추가 공용) */
function PlusIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <Path d="M15 29A14 14 0 1 0 15 1a14 14 0 0 0 0 28Z" stroke={colors.olive} strokeWidth={2} />
      <Path d="M15 9v12M9 15h12" stroke={colors.olive} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.radio, selected && styles.radioSelected]}>
      {selected && <View style={styles.radioDot} />}
    </View>
  );
}

/** 2열 라디오/체크 그리드. multi면 여러 개 선택 가능. */
function ChipGrid({
  options,
  selected,
  multi,
  onChange,
}: {
  options: string[];
  selected: string[];
  multi?: boolean;
  onChange: (next: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (multi) {
      onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
    } else {
      onChange([opt]);
    }
  };

  return (
    <View style={styles.chipGrid}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={styles.chip}
          activeOpacity={0.7}
          onPress={() => toggle(opt)}
        >
          <Radio selected={selected.includes(opt)} />
          <Text style={styles.chipLabel} numberOfLines={1}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function asList(v: Value | undefined): string[] {
  return Array.isArray(v) ? v : [];
}

/* ───────────────────────── 탭 페이지 ───────────────────────── */

function BioPage({ data, set }: PageProps) {
  const p = { data, set };
  return (
    <>
      <View style={styles.card}>
        <InputRow label="수면 시간" unit="시간" unitAccent dataKey="habit.sleepHours" {...p} />
      </View>
      <SliderField label="수면 만족도" dataKey="habit.sleepSatisfaction" {...p} />
      <SliderField label={'컨디션\n/ 피로도'} dataKey="habit.condition" {...p} />

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.sliderLabel}>{'생리 양\n/주기 체크'}</Text>
          <Slider
            value={typeof data['habit.period'] === 'number' ? (data['habit.period'] as number) : 0}
            onChange={(v) => set('habit.period', v)}
          />
        </View>
        <View style={styles.periodOptions}>
          <ChipGrid
            options={['배란일', '가임기']}
            multi
            selected={asList(data['habit.periodType'])}
            onChange={(v) => set('habit.periodType', v)}
          />
        </View>
      </View>
    </>
  );
}

function HabitPage({ data, set }: PageProps) {
  const p = { data, set };
  return (
    <>
      <SliderField label="물 섭취" dataKey="habit.water" {...p} />
      <SliderField label="카페인 섭취" dataKey="habit.caffeine" {...p} />
      <SliderField label="음주" dataKey="habit.alcohol" {...p} />
      <SliderField label="운동" dataKey="habit.exercise" {...p} />
      <SliderField label={'식단 구성\n만족도'} dataKey="habit.diet" {...p} />
      <View style={styles.card}>
        <InputRow label="걸음수" unit="걸음" dataKey="habit.steps" {...p} />
      </View>
    </>
  );
}

function EmotionPage({ data, set }: PageProps) {
  const p = { data, set };
  return (
    <>
      <SliderField label="행복도" dataKey="self.happiness" {...p} />
      <SliderField label="우울지수" dataKey="self.depression" {...p} />
      <SliderField label="불안감" dataKey="self.anxiety" {...p} />
      <SliderField label="스트레스" dataKey="self.stress" {...p} />
      <SliderField label="외로움" dataKey="self.loneliness" {...p} />
    </>
  );
}

function EnergyPage({ data, set }: PageProps) {
  const p = { data, set };
  return (
    <>
      <SliderField label="에너지 점수" dataKey="habit.energy" {...p} />
      <SliderField label="집중력" dataKey="self.focus" {...p} />
      <SliderField label="피곤함" dataKey="self.tired" {...p} />
      <SliderField label="무기력" dataKey="self.lethargy" {...p} />
    </>
  );
}

function SelfPage({ data, set }: PageProps) {
  const p = { data, set };
  return (
    <>
      <SliderField label="오늘 충만도" dataKey="leisure.fulfillment" {...p} />
      <SliderField label="오늘 만족도" dataKey="leisure.satisfaction" {...p} />
      <SliderField label="여가 만족도" dataKey="leisure.leisureSatisfaction" {...p} />
      <SliderField label="자기효능감" dataKey="leisure.efficacy" {...p} />
    </>
  );
}

function LeisurePage({ data, set }: PageProps) {
  const p = { data, set };
  return (
    <>
      <View style={styles.card}>
        <InputRow
          labelNode={<Text style={styles.centerLabel}>{'SNS 사용 시간\n목표 체크'}</Text>}
          unit="시간"
          dataKey="leisure.snsHours"
          {...p}
        />
      </View>

      <View style={styles.card}>
        <View style={[styles.row, styles.rowTop]}>
          <Text style={styles.centerLabel}>{'여가 항목\n구분'}</Text>
          <ChipGrid
            options={LEISURE_OPTIONS}
            selected={asList(data['leisure.category'])}
            onChange={(v) => set('leisure.category', v)}
          />
        </View>
      </View>
    </>
  );
}

function DigitalPage({ data, set }: PageProps) {
  const goals = [
    { key: 'digital.screen', label: '스크린타임' },
    { key: 'digital.work', label: '작업 시간' },
    { key: 'digital.study', label: '공부 시간' },
  ];
  return (
    <>
      {goals.map((g) => (
        <View key={g.key} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.goalLabel}>
              <Text style={styles.goalTag}>목표</Text>
              <Text style={styles.label}>{g.label}</Text>
            </View>
            <View style={styles.goalChoices}>
              {['달성', '미달성'].map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.chipInline}
                  activeOpacity={0.7}
                  onPress={() => set(g.key, opt)}
                >
                  <Radio selected={data[g.key] === opt} />
                  <Text style={styles.chipLabel}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ))}
    </>
  );
}

function EnvPage({ data, set }: PageProps) {
  return (
    <>
      <View style={styles.card}>
        <View style={[styles.row, styles.rowTop]}>
          <Text style={styles.centerLabel}>날씨</Text>
          <ChipGrid
            options={WEATHER_OPTIONS}
            selected={asList(data['env.weather'])}
            onChange={(v) => set('env.weather', v)}
          />
        </View>
      </View>
      <View style={styles.card}>
        <InputRow label="기온" unit="℃" dataKey="env.temperature" data={data} set={set} />
      </View>
    </>
  );
}

type Book = { id: number; title: string; genre?: string };

function BookPage({ data, set }: PageProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const addBook = () => {
    const title = draft.trim();
    if (title) setBooks((prev) => [...prev, { id: Date.now(), title }]);
    setDraft('');
    setAdding(false);
  };

  return (
    <>
      {books.map((b) => (
        <View key={b.id} style={styles.card}>
          <View style={styles.bookTitleRow}>
            <Text style={styles.bookTitle} numberOfLines={1}>{`<${b.title}>`}</Text>
            {b.genre ? <Text style={styles.bookGenre}>{b.genre}</Text> : null}
          </View>
          <InputRow
            label="오늘 읽은 쪽 수"
            unit="쪽"
            dataKey={`book.${b.id}.pages`}
            data={data}
            set={set}
          />
        </View>
      ))}

      {adding && (
        <View style={styles.card}>
          <View style={styles.row}>
            <TextInput
              style={styles.bookInput}
              value={draft}
              onChangeText={setDraft}
              placeholder="책 제목을 입력해 주세요."
              placeholderTextColor="rgba(0,0,0,0.6)"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={addBook}
            />
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.addBook}
        activeOpacity={0.7}
        onPress={() => setAdding(true)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <PlusIcon size={30} />
      </TouchableOpacity>
    </>
  );
}

/** 가계부 섹션: 헤더의 + 버튼을 누르면 모든 항목(입력하기 / 원)이 펼쳐지고, 다시 누르면 접힘 */
function LedgerSection({
  title,
  items,
  sectionKey,
  data,
  set,
}: {
  title: string;
  items: string[];
  sectionKey: string;
} & PageProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setOpen((v) => !v)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <PlusIcon size={19} />
        </TouchableOpacity>
      </View>

      {open &&
        items.map((item) => (
          <View key={item} style={styles.itemRow}>
            <InputRow
              label={item}
              unit="원"
              dataKey={`${sectionKey}.amount.${item}`}
              data={data}
              set={set}
            />
          </View>
        ))}
    </View>
  );
}

function LedgerPage({ data, set }: PageProps) {
  return (
    <>
      <SliderField label={'하루 소비\n만족도'} dataKey="ledger.satisfaction" data={data} set={set} />
      <LedgerSection title="변동지출" items={VARIABLE_ITEMS} sectionKey="ledger.variable" data={data} set={set} />
      <LedgerSection title="투자 내역" items={INVEST_ITEMS} sectionKey="ledger.invest" data={data} set={set} />
      <LedgerSection title="저축 내역" items={SAVING_ITEMS} sectionKey="ledger.saving" data={data} set={set} />
    </>
  );
}

const PAGES: Record<(typeof TABS)[number]['key'], React.ComponentType<PageProps>> = {
  bio: BioPage,
  habit: HabitPage,
  emotion: EmotionPage,
  energy: EnergyPage,
  self: SelfPage,
  leisure: LeisurePage,
  digital: DigitalPage,
  env: EnvPage,
  book: BookPage,
  ledger: LedgerPage,
};

/* ───────────────────────── 본체 ───────────────────────── */

type Props = {
  onClose?: () => void;
  /** 완료 버튼 → 입력값 전달 (이후 onClose 호출) */
  onComplete?: (data: Data) => void;
};

export default function TodayTracking({ onClose, onComplete }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState<Data>({});
  const tabRef = useRef<ScrollView>(null);

  const set = (key: string, value: Value) => setData((prev) => ({ ...prev, [key]: value }));

  // 탭을 "선택"했을 때만 내용이 바뀜. 탭 바를 좌우로 밀어도 선택은 그대로(그냥 스크롤).
  // 선택한 탭이 가운데 오도록 탭 바만 이동 (양 끝은 넘어가지 않게 clamp)
  const selectTab = (index: number) => {
    setActiveIndex(index);
    const maxX = TABS.length * TAB_ITEM_WIDTH + TAB_BAR_PADDING * 2 - CARD_WIDTH;
    const x = index * TAB_ITEM_WIDTH + TAB_ITEM_WIDTH / 2 - CARD_WIDTH / 2;
    tabRef.current?.scrollTo({ x: Math.min(Math.max(x, 0), maxX), animated: true });
  };

  const handleComplete = () => {
    onComplete?.(data);
    onClose?.();
  };

  return (
    <View style={styles.root}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
            <Path d="M1 1l16 16M17 1L1 17" stroke={colors.black} strokeWidth={1.6} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">오늘의 트래킹</Text>
        <Text style={styles.date} pointerEvents="none">{formatKoreanDate(new Date())}</Text>
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete} activeOpacity={0.8}>
          <Text style={styles.completeText}>완료</Text>
        </TouchableOpacity>
      </View>

      {/* 탭: 좌우로 자유롭게 스크롤, 눌러서 선택 */}
      <View style={styles.tabBar}>
        <ScrollView
          ref={tabRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContent}
        >
          {TABS.map((t, i) => (
            <TouchableOpacity
              key={t.key}
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => selectTab(i)}
            >
              <Text style={[styles.tabLabel, i === activeIndex && styles.tabLabelActive]}>
                {t.label}
              </Text>
              {i === activeIndex && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 선택된 탭의 내용만 표시(위아래 스크롤). 나머지는 숨겨서 입력값/상태 유지 */}
      {TABS.map((t, i) => {
        const Page = PAGES[t.key];
        return (
          <ScrollView
            key={t.key}
            style={[styles.page, i !== activeIndex && styles.pageHidden]}
            contentContainerStyle={styles.pageContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
            // 내용이 영역보다 짧아도(가계부 접힌 상태) 스크롤 제스처가 시작되도록 함.
            // 없으면 펼친 직후 늘어난 높이가 반영되기 전까지 iOS가 드래그를 스크롤로 인식하지 않음
            alwaysBounceVertical
          >
            <Page data={data} set={set} />
          </ScrollView>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.bg,
    borderRadius: 30,
    overflow: 'hidden',
  },

  /* 헤더 */
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: colors.white,
  },
  closeButton: {
    position: 'absolute',
    left: 21,
    top: 28,
    zIndex: 1,
  },
  title: {
    position: 'absolute',
    top: 22,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: fonts.inter,
    fontSize: 24,
    lineHeight: 29,
    color: colors.black,
  },
  date: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: fonts.inter,
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: colors.black,
  },
  completeButton: {
    position: 'absolute',
    right: 15,
    top: 20,
    width: 63,
    height: 30,
    borderRadius: 50,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeText: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },

  /* 탭 */
  tabBar: {
    height: TAB_HEIGHT,
    backgroundColor: colors.white,
  },
  tabContent: {
    paddingHorizontal: TAB_BAR_PADDING,
  },
  tabItem: {
    width: TAB_ITEM_WIDTH,
    alignItems: 'center',
    paddingTop: 6,
  },
  tabLabel: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
  tabLabelActive: {
    fontWeight: '600',
    color: colors.olive,
  },
  tabUnderline: {
    marginTop: 12,
    width: 86,
    height: 2,
    backgroundColor: colors.olive,
  },

  /* 페이지 */
  page: {
    width: CARD_WIDTH,
    height: PAGE_HEIGHT,
  },
  pageHidden: {
    display: 'none',
  },
  pageContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 12,
  },

  /* 카드 / 행 */
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 18,
    overflow: 'visible',
  },
  row: {
    minHeight: 63,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTop: {
    alignItems: 'flex-start',
    paddingVertical: 20,
  },
  label: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
  centerLabel: {
    width: 70,
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
  },

  /* 슬라이더 */
  sliderLabel: {
    width: 70,
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
  sliderRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    gap: 10,
  },
  sliderTrack: {
    flex: 1,
    height: SLIDER_KNOB,
    justifyContent: 'center',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: SLIDER_KNOB,
    borderRadius: SLIDER_KNOB / 2,
    backgroundColor: colors.accent,
  },
  sliderKnob: {
    position: 'absolute',
    top: (SLIDER_KNOB - 4) / 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  sliderZone: {
    position: 'absolute',
    top: -12,
    bottom: -12,
  },
  sliderDot: {
    position: 'absolute',
    top: (SLIDER_KNOB - 4) / 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.placeholderBar2,
  },
  sliderValue: {
    width: 12,
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
    textAlign: 'right',
  },

  /* 숫자 입력 */
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  input: {
    minWidth: 60,
    padding: 0,
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
    textAlign: 'right',
  },
  inputTouch: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  inputPlaceholder: {
    color: 'rgba(0,0,0,0.6)',
  },
  inputFilled: {
    fontWeight: '700',
    color: ORANGE,
  },
  unit: {
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
  unitAccent: {
    fontWeight: '600',
    color: colors.accent,
  },

  /* 라디오 / 칩 */
  chipGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
  },
  chip: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipLabel: {
    flexShrink: 1,
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.handle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: colors.accent,
  },
  radioDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.white,
  },
  periodOptions: {
    flexDirection: 'row',
    paddingBottom: 16,
    paddingLeft: 86,
  },

  /* 디지털 집중 */
  goalLabel: {
    width: 90,
  },
  goalTag: {
    fontFamily: fonts.inter,
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  goalChoices: {
    flexDirection: 'row',
    gap: 24,
  },

  /* 북트래커 */
  bookTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  bookTitle: {
    flex: 1,
    fontFamily: fonts.inter,
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  bookGenre: {
    marginLeft: 8,
    fontFamily: fonts.inter,
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  bookInput: {
    flex: 1,
    padding: 0,
    fontFamily: fonts.inter,
    fontSize: 14,
    color: colors.black,
  },
  addBook: {
    alignSelf: 'center',
    marginTop: 12,
  },

  sectionTitle: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.black,
  },
  // 섹션 안 항목 행은 헤더보다 13px 안쪽으로 들여쓰기
  itemRow: {
    paddingHorizontal: 13,
  },

});
