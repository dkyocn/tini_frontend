import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// tini-ui — 모달로 뜨는 것
import AchievementList from '../components/tiny-ui/components/AchievementList';
import AchievementMethodCard from '../components/tiny-ui/components/AchievementMethodCard';
import AddPageCard from '../components/tiny-ui/components/AddPageCard';
import BookmarkCard from '../components/tiny-ui/components/BookmarkCard';
import ColorThemeCard from '../components/tiny-ui/components/ColorThemeCard';
import ConsentAgreementCard from '../components/tiny-ui/components/ConsentAgreementCard';
import DiaryContextMenu from '../components/tiny-ui/components/DiaryContextMenu';
import DiaryPageSelectCard from '../components/tiny-ui/components/DiaryPageSelectCard';
import EditorToolbar from '../components/tiny-ui/components/EditorToolbar';
import MyPageMenuCard from '../components/tiny-ui/components/MyPageMenuCard';
import StickerProductCard from '../components/tiny-ui/components/StickerProductCard';
import StreakCalendarCard from '../components/tiny-ui/components/StreakCalendarCard';

// tini-ui — 그대로 표시
import CreatePostHeader from '../components/tiny-ui/components/CreatePostHeader';
import DiaryDetailHeader from '../components/tiny-ui/components/DiaryDetailHeader';
import PostCard from '../components/tiny-ui/components/PostCard';
import ProfileInfoForm from '../components/tiny-ui/components/ProfileInfoForm';
import SearchBar from '../components/tiny-ui/components/SearchBar';
import ShelfItemSheet from '../components/tiny-ui/components/ShelfItemSheet';
import StreakCalendar from '../components/tiny-ui/components/StreakCalendar';
import TextFormatToolbar from '../components/tiny-ui/components/TextFormatToolbar';
import WritingDiaryCardCompact from '../components/tiny-ui/components/WritingDiaryCardCompact';
import WritingDiaryCardHighlighted from '../components/tiny-ui/components/WritingDiaryCardHighlighted';
import WritingDiaryCardWide from '../components/tiny-ui/components/WritingDiaryCardWide';
import StreakGuideCard from '../components/tiny-ui/components/StreakGuideCard';
import RecoveryPenModal from '../components/tiny-ui/components/RecoveryPenModal';

// common
import ButtonDefault from '../components/common/button_default';
import ButtonSecondary from '../components/common/button_secondary';
import ButtonLoading from '../components/common/button_loading';
import CloverCount from '../components/common/clover_count';
import LabelBadge from '../components/common/label_badge';
import CircleNumber from '../components/common/circle_number';

const modalItems: { title: string; render: () => React.ReactNode }[] = [
  { title: 'AchievementList', render: () => <AchievementList /> },
  { title: 'AchievementMethodCard', render: () => <AchievementMethodCard /> },
  { title: 'AddPageCard', render: () => <AddPageCard /> },
  { title: 'BookmarkCard', render: () => <BookmarkCard /> },
  { title: 'ColorThemeCard', render: () => <ColorThemeCard /> },
  { title: 'ConsentAgreementCard', render: () => <ConsentAgreementCard /> },
  { title: 'DiaryContextMenu', render: () => <DiaryContextMenu /> },
  { title: 'DiaryPageSelectCard', render: () => <DiaryPageSelectCard /> },
  { title: 'EditorToolbar', render: () => <EditorToolbar /> },
  {
    title: 'MyPageMenuCard',
    render: () => (
      <MyPageMenuCard
        title="프로필"
        items={[{ label: '기본 정보' }, { label: '성별' }, { label: '아이디' }]}
      />
    ),
  },
  { title: 'StickerProductCard', render: () => <StickerProductCard /> },
  { title: 'StreakCalendarCard', render: () => <StreakCalendarCard /> },
];

const inlineItems: { title: string; render: () => React.ReactNode }[] = [
  { title: 'CreatePostHeader', render: () => <CreatePostHeader /> },
  { title: 'DiaryDetailHeader', render: () => <DiaryDetailHeader /> },
  { title: 'PostCard', render: () => <PostCard /> },
  { title: 'ProfileInfoForm', render: () => <ProfileInfoForm /> },
  { title: 'SearchBar', render: () => <SearchBar /> },
  { title: 'ShelfItemSheet', render: () => <ShelfItemSheet /> },
  { title: 'StreakCalendar', render: () => <StreakCalendar /> },
  { title: 'TextFormatToolbar', render: () => <TextFormatToolbar /> },
  { title: 'WritingDiaryCardCompact', render: () => <WritingDiaryCardCompact /> },
  { title: 'WritingDiaryCardHighlighted', render: () => <WritingDiaryCardHighlighted /> },
  { title: 'WritingDiaryCardWide', render: () => <WritingDiaryCardWide /> },
  { title: 'StreakGuideCard', render: () => <StreakGuideCard /> },
  { title: 'RecoveryPenModal', render: () => <RecoveryPenModal /> },
  { title: 'ButtonDefault', render: () => <ButtonDefault label="티니 시작하기" onPress={() => {}} /> },
  { title: 'ButtonSecondary', render: () => <ButtonSecondary label="애플 계정으로 로그인" onPress={() => {}} /> },
  { title: 'ButtonLoading', render: () => <ButtonLoading label="로딩중..." /> },
  { title: 'CloverCount', render: () => <CloverCount count={10} /> },
  { title: 'LabelBadge', render: () => <LabelBadge label="나의 다이어리" /> },
  { title: 'CircleNumber', render: () => <CircleNumber value="3,200" /> },
];

export default function ComponentPreview() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const current = modalItems.find((it) => it.title === openModal);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Modals ({modalItems.length})</Text>
        {modalItems.map(({ title }) => (
          <TouchableOpacity
            key={title}
            style={styles.modalBtn}
            onPress={() => setOpenModal(title)}
            activeOpacity={0.7}
          >
            <Text style={styles.modalBtnText}>{title}</Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.header, { marginTop: 16 }]}>Inline ({inlineItems.length})</Text>
        {inlineItems.map(({ title, render }) => (
          <View key={title} style={styles.section}>
            <Text style={styles.label}>{title}</Text>
            {render()}
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={openModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenModal(null)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpenModal(null)}>
          <Pressable onPress={() => {}}>{current?.render()}</Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#DDDDDD',
    paddingTop: 40,
  },
  container: {
    padding: 16,
    gap: 12,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  section: {
    gap: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  label: {
    fontSize: 12,
    color: '#666666',
  },
  modalBtn: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  modalBtnText: {
    fontSize: 14,
    color: '#333333',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
