import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import TiniSvg from '../../assets/tini.svg';
import { API_BASE_URL } from '../../utils/api';

const { height } = Dimensions.get('window');

type Gender = 'FEMALE' | 'MALE' | 'NONBINARY' | 'SKIP';

type Props = {
  initialProfile?: {
    birthdate?: string;
    gender?: Exclude<Gender, 'SKIP'>;
  };
  onNext: (data: {
    nickname: string;
    birthdate: string;
    gender: Gender | null;
  }) => void;
};

const GENDER_OPTIONS: Gender[] = ['FEMALE', 'MALE', 'NONBINARY', 'SKIP'];
const GENDER_LABELS: Record<Gender, string> = {
  FEMALE: '여성',
  MALE: '남성',
  NONBINARY: '해당사항없음',
  SKIP: '선택 안함',
};

export default function ProfileInputPage({ initialProfile, onNext }: Props) {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('');
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date(2000, 0, 1));
  const [birthdateText, setBirthdateText] = useState(
    initialProfile?.birthdate ?? '',
  );
  const [gender, setGender] = useState<Gender | null>(
    initialProfile?.gender ?? null,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  const parseBirthdateText = (text: string): Date | null => {
    const match = text.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
    if (!match) return null;
    const [, y, m, d] = match;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const handleBirthdateTextChange = (text: string) => {
    const digits = text.replace(/\./g, '');
    let formatted = digits.slice(0, 8);
    if (formatted.length > 6) {
      formatted =
        formatted.slice(0, 4) +
        '.' +
        formatted.slice(4, 6) +
        '.' +
        formatted.slice(6);
    } else if (formatted.length > 4) {
      formatted = formatted.slice(0, 4) + '.' + formatted.slice(4);
    }
    setBirthdateText(formatted);
    setBirthdate(null);
  };

  const handleDatePickerChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (selected) {
        setBirthdate(selected);
        setBirthdateText(formatDate(selected));
      }
    } else if (selected) {
      setTempDate(selected);
    }
  };

  const confirmDateSelection = () => {
    setBirthdate(tempDate);
    setBirthdateText(formatDate(tempDate));
    setShowDatePicker(false);
  };

  const handleNext = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      await axios.patch(
        `${API_BASE_URL}/user/profile`,
        {
          nickname,
          birthdate: birthdateText ? birthdateText.replace(/\./g, '-') : undefined,
          gender: gender && gender !== 'SKIP' ? gender : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            RefreshToken: refreshToken ?? '',
          },
        },
      );
      onNext({ nickname, birthdate: birthdateText, gender });
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      Alert.alert('오류', '프로필 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerIcon}
          >
            <TiniSvg width={20} height={20} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>프로필 입력</Text>
        </View>

        {/* Mascot */}
        <View style={styles.imageWrapper}>
          <TiniSvg width={height * 0.2} height={height * 0.2} />
        </View>

        {/* Nickname */}
        <View style={styles.fieldBlock}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>닉네임</Text>
            <Text style={styles.required}> (필수)</Text>
          </View>
          <TextInput
            style={styles.textInput}
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력해주세요."
            placeholderTextColor="#AAAAAA"
          />
          <View style={styles.divider} />
        </View>

        {/* Birthdate */}
        <View style={styles.fieldBlock}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>생년월일</Text>
            <Text style={styles.required}> (필수)</Text>
          </View>
          <View style={styles.birthdateRow}>
            <TextInput
              style={styles.birthdateInput}
              value={birthdateText}
              onChangeText={handleBirthdateTextChange}
              placeholder="0000.00.00"
              placeholderTextColor="#AAAAAA"
              keyboardType="number-pad"
              maxLength={10}
            />
            <TouchableOpacity
              style={styles.calendarButton}
              onPress={() => {
                const parsed = parseBirthdateText(birthdateText);
                if (parsed) {
                  setTempDate(parsed);
                  setBirthdate(parsed);
                }
                setShowDatePicker(true);
              }}
            >
              <TiniSvg width={24} height={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
        </View>

        {/* Gender */}
        <View style={styles.fieldBlock}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>성별</Text>
            <Text style={styles.optional}> (선택)</Text>
          </View>
          <TouchableOpacity
            style={styles.dropdownTrigger}
            onPress={() => setShowGenderModal(true)}
          >
            <Text
              style={
                gender ? styles.dropdownSelected : styles.dropdownPlaceholder
              }
            >
              {gender ? GENDER_LABELS[gender] : '성별을 선택 해주세요.'}
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
        </View>

        <View style={styles.spacer} />

        {/* Next button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>

        {/* Date Picker - Android: native dialog */}
        {showDatePicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={birthdate ?? new Date(2000, 0, 1)}
            mode="date"
            display="default"
            onChange={handleDatePickerChange}
            maximumDate={new Date()}
          />
        )}

        {/* Date Picker - iOS: bottom sheet */}
        <Modal
          visible={showDatePicker && Platform.OS === 'ios'}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          >
            <View style={styles.bottomSheet}>
              <View style={styles.bottomSheetHandle} />
              <Text style={styles.bottomSheetTitle}>생년월일 선택</Text>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDatePickerChange}
                maximumDate={new Date()}
                locale="ko-KR"
                themeVariant="light"
                style={styles.datePicker}
              />
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmDateSelection}
              >
                <Text style={styles.confirmButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Gender Bottom Sheet Modal */}
        <Modal
          visible={showGenderModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowGenderModal(false)}
          >
            <View style={styles.bottomSheet}>
              <View style={styles.bottomSheetHandle} />
              <Text style={styles.bottomSheetTitle}>성별 선택</Text>
              {GENDER_OPTIONS.map((option, index) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownItem,
                    index < GENDER_OPTIONS.length - 1 &&
                      styles.dropdownItemBorder,
                  ]}
                  onPress={() => {
                    setGender(option);
                    setShowGenderModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      gender === option && styles.dropdownItemSelected,
                    ]}
                  >
                    {GENDER_LABELS[option]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F6F9',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#F6F6F9',
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 28,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 44,
  },
  fieldBlock: {
    marginBottom: 28,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  required: {
    fontSize: 14,
    color: '#A8C62E',
  },
  optional: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  textInput: {
    width: 353,
    height: 58,
    fontSize: 16,
    color: '#1A1A1A',
    paddingVertical: 8,
  },
  birthdateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  birthdateInput: {
    width: 109,
    height: 50,
    fontSize: 16,
    color: '#1A1A1A',
    paddingVertical: 8,
  },
  calendarButton: {
    marginLeft: 12,
    padding: 4,
  },
  dropdownTrigger: {
    width: 353,
    height: 58,
    justifyContent: 'center',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  dropdownSelected: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  divider: {
    height: 1,
    backgroundColor: '#C8C8C8',
  },
  spacer: {
    flex: 1,
    minHeight: 60,
  },
  button: {
    width: 353,
    height: 50,
    backgroundColor: '#D1E795',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDDDDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  dropdownItemSelected: {
    color: '#A8C62E',
    fontWeight: '600',
  },
  datePicker: {
    width: '100%',
  },
  confirmButton: {
    width: 353,
    height: 50,
    backgroundColor: '#D1E795',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 12,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
});
