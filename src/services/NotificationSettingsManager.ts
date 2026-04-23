import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCharacters, getCharactersByUnit } from '../data/embeddedData';

// --- Type Definitions ---

export type NotificationStage = '7days' | '3days' | '1day' | 'dday';

export type CharacterNotificationSettings = {
  [characterId: string]: {
    [stage in NotificationStage]: boolean;
  };
};

export type AppSettings = {
  characterNotifications: CharacterNotificationSettings;
  notificationTime: { hour: number; minute: number };
  isInitialized: boolean;
};

export interface PersistedSettings {
  version: number;
  characterNotifications: CharacterNotificationSettings;
  notificationTime: { hour: number; minute: number };
  isInitialized: boolean;
}

// --- Constants ---

export const NOTIFICATION_STAGES: NotificationStage[] = ['7days', '3days', '1day', 'dday'];

export const DEFAULT_NOTIFICATION_TIME = { hour: 9, minute: 0 };

export const STORAGE_KEY = 'app_settings';

const CURRENT_VERSION = 1;
const MAX_RETRIES = 2;

// --- Functions ---

/**
 * 모든 캐릭터에 대해 기본 알림 설정을 생성한다.
 * - dday: true (당일 알림 활성화)
 * - 7days, 3days, 1day: false (나머지 비활성화)
 * - notificationTime: 09:00
 * - isInitialized: true
 */
export function initializeDefaultSettings(): AppSettings {
  const characters = getCharacters();
  const characterNotifications: CharacterNotificationSettings = {};

  for (const character of characters) {
    characterNotifications[character.id] = {
      '7days': false,
      '3days': false,
      '1day': false,
      'dday': true,
    };
  }

  return {
    characterNotifications,
    notificationTime: { ...DEFAULT_NOTIFICATION_TIME },
    isInitialized: true,
  };
}

/**
 * AsyncStorage에서 설정을 로드한다.
 * - JSON 파싱 실패 또는 스키마 불일치 시 기본값으로 초기화
 * - version 필드를 통한 스키마 검증
 */
export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return initializeDefaultSettings();
    }

    const parsed: PersistedSettings = JSON.parse(raw);

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      parsed.version !== CURRENT_VERSION ||
      typeof parsed.characterNotifications !== 'object' ||
      typeof parsed.notificationTime !== 'object' ||
      typeof parsed.notificationTime?.hour !== 'number' ||
      typeof parsed.notificationTime?.minute !== 'number' ||
      typeof parsed.isInitialized !== 'boolean'
    ) {
      return initializeDefaultSettings();
    }

    return {
      characterNotifications: parsed.characterNotifications,
      notificationTime: parsed.notificationTime,
      isInitialized: parsed.isInitialized,
    };
  } catch {
    return initializeDefaultSettings();
  }
}

/**
 * 설정을 AsyncStorage에 저장한다.
 * - PersistedSettings 형태로 version 필드를 포함하여 저장
 * - 실패 시 최대 2회 재시도 (총 3회 시도)
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
  const persisted: PersistedSettings = {
    version: CURRENT_VERSION,
    characterNotifications: settings.characterNotifications,
    notificationTime: settings.notificationTime,
    isInitialized: settings.isInitialized,
  };

  const json = JSON.stringify(persisted);

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, json);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  throw new Error(
    `설정 저장에 실패했습니다 (${MAX_RETRIES + 1}회 시도): ${lastError instanceof Error ? lastError.message : String(lastError)}`
  );
}


/**
 * 특정 캐릭터의 특정 stage 토글을 반전시킨다 (true↔false).
 * 불변 업데이트: 새로운 AppSettings 객체를 반환한다.
 */
export function toggleCharacterStage(
  settings: AppSettings,
  characterId: string,
  stage: NotificationStage
): AppSettings {
  const current = settings.characterNotifications[characterId]?.[stage] ?? false;
  return {
    ...settings,
    characterNotifications: {
      ...settings.characterNotifications,
      [characterId]: {
        ...settings.characterNotifications[characterId],
        [stage]: !current,
      },
    },
  };
}

/**
 * 유닛 내 모든 캐릭터의 특정 stage를 지정된 값으로 일괄 설정한다.
 * 불변 업데이트: 새로운 AppSettings 객체를 반환한다.
 */
export function toggleUnitStage(
  settings: AppSettings,
  unitId: string,
  stage: NotificationStage,
  value: boolean
): AppSettings {
  const characters = getCharactersByUnit(unitId);
  const updatedNotifications = { ...settings.characterNotifications };

  for (const char of characters) {
    updatedNotifications[char.id] = {
      ...updatedNotifications[char.id],
      [stage]: value,
    };
  }

  return {
    ...settings,
    characterNotifications: updatedNotifications,
  };
}

/**
 * 유닛 내 모든 캐릭터의 특정 stage가 전부 true인지 확인한다.
 * 하나라도 false이면 false를 반환한다.
 */
export function getUnitStageState(
  settings: AppSettings,
  unitId: string,
  stage: NotificationStage
): boolean {
  const characters = getCharactersByUnit(unitId);
  return characters.every(
    (char) => settings.characterNotifications[char.id]?.[stage] === true
  );
}

/**
 * 알림 시간을 변경한다.
 * 불변 업데이트: 새로운 AppSettings 객체를 반환한다.
 */
export function setNotificationTime(
  settings: AppSettings,
  hour: number,
  minute: number
): AppSettings {
  return {
    ...settings,
    notificationTime: { hour, minute },
  };
}
