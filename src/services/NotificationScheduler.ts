import * as Notifications from 'expo-notifications';
import { getCharacters, getCharactersByMonth } from '../data/embeddedData';
import { Character } from '../data/types';
import { AppSettings, NOTIFICATION_STAGES, NotificationStage } from './NotificationSettingsManager';

// Stage offset in days before the birthday
const STAGE_OFFSETS: Record<NotificationStage, number> = {
  '7days': -7,
  '3days': -3,
  '1day': -1,
  'dday': 0,
};

/**
 * 주어진 연도가 윤년인지 확인한다.
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 생일과 알림 stage를 기반으로 알림 날짜를 계산한다.
 *
 * - stage별 오프셋: 7days → -7, 3days → -3, 1day → -1, dday → 0
 * - 2월 29일 생일: 비윤년인 경우 2월 28일로 대체
 * - 연초 경계: 결과가 해당 연도 1월 1일 이전이면 전년도로 래핑
 * - notificationTime의 hour/minute 적용, seconds/milliseconds는 0
 */
export function calculateNotificationDate(
  birthday: { month: number; day: number },
  stage: NotificationStage,
  year: number,
  notificationTime: { hour: number; minute: number },
): Date {
  let { month, day } = birthday;

  // Handle Feb 29 birthday in non-leap years
  if (month === 2 && day === 29 && !isLeapYear(year)) {
    day = 28;
  }

  // Create the birthday date in the given year (months are 0-indexed in JS Date)
  const birthdayDate = new Date(year, month - 1, day);

  // Apply stage offset
  const offset = STAGE_OFFSETS[stage];
  birthdayDate.setDate(birthdayDate.getDate() + offset);

  // Set notification time
  birthdayDate.setHours(notificationTime.hour, notificationTime.minute, 0, 0);

  return birthdayDate;
}


/**
 * 알림 ID를 생성한다.
 * 형식: `${characterId}_${stage}`
 */
export function generateNotificationId(
  characterId: string,
  stage: NotificationStage,
): string {
  return `${characterId}_${stage}`;
}

/**
 * 특정 캐릭터의 특정 stage 알림을 스케줄링한다.
 *
 * - 현재 연도 기준으로 알림 날짜를 계산
 * - 날짜가 과거이면 다음 연도로 재계산
 * - expo-notifications를 사용하여 로컬 알림 스케줄링
 * - 실패 시 에러 로깅 후 빈 문자열 반환
 */
export async function scheduleCharacterNotification(
  character: Character,
  stage: NotificationStage,
  notificationTime: { hour: number; minute: number },
): Promise<string> {
  try {
    const now = new Date();
    let year = now.getFullYear();
    let notificationDate = calculateNotificationDate(
      character.birthday,
      stage,
      year,
      notificationTime,
    );

    // If the date is in the past, schedule for next year
    if (notificationDate.getTime() <= now.getTime()) {
      year += 1;
      notificationDate = calculateNotificationDate(
        character.birthday,
        stage,
        year,
        notificationTime,
      );
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${character.name} 생일 알림`,
        body:
          stage === 'dday'
            ? `오늘은 ${character.name}의 생일입니다! 🎂 (${character.birthday.month}월 ${character.birthday.day}일)`
            : `${character.name}의 생일이 ${stage === '7days' ? '7일' : stage === '3days' ? '3일' : '1일'} 남았습니다! (${character.birthday.month}월 ${character.birthday.day}일)`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notificationDate,
      },
      identifier: generateNotificationId(character.id, stage),
    });

    return identifier;
  } catch (error) {
    console.error(
      `Failed to schedule notification for ${character.id} (${stage}):`,
      error,
    );
    return '';
  }
}

/**
 * 특정 캐릭터의 특정 stage 알림을 취소한다.
 *
 * - 알림 ID 형식: `${characterId}_${stage}`
 * - 실패 시 에러 로깅
 */
export async function cancelCharacterNotification(
  characterId: string,
  stage: NotificationStage,
): Promise<void> {
  try {
    const notificationId = generateNotificationId(characterId, stage);
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error(
      `Failed to cancel notification for ${characterId} (${stage}):`,
      error,
    );
  }
}


/**
 * 주어진 월의 생일 캐릭터 목록을 포함한 월간 요약 메시지를 생성한다.
 *
 * - 형식: "이달의 생일 캐릭터:\n- 캐릭터이름 (M월 D일)\n- ..."
 * - 해당 월에 생일 캐릭터가 없으면 빈 문자열 반환
 */
export function generateMonthlySummaryMessage(month: number): string {
  const characters = getCharactersByMonth(month);
  if (characters.length === 0) {
    return '';
  }

  const lines = characters.map(
    (c) => `- ${c.name} (${c.birthday.month}월 ${c.birthday.day}일)`,
  );
  return `이달의 생일 캐릭터:\n${lines.join('\n')}`;
}

/**
 * 월간 요약 알림을 다음 달 1일에 스케줄링한다.
 *
 * - 현재 날짜 기준으로 다음 1일을 계산
 * - 해당 월에 생일 캐릭터가 없으면 스케줄링하지 않고 빈 문자열 반환
 * - 알림 ID: `monthly_summary`
 * - 실패 시 에러 로깅 후 빈 문자열 반환
 */
export async function scheduleMonthlySummary(
  notificationTime: { hour: number; minute: number },
): Promise<string> {
  try {
    const now = new Date();
    let nextMonth = now.getMonth() + 1; // 0-indexed, so +1 gives next month (0-indexed)
    let nextYear = now.getFullYear();

    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }

    // nextMonth is 0-indexed JS month; convert to 1-indexed for our data
    const targetMonth = nextMonth + 1;

    const message = generateMonthlySummaryMessage(targetMonth);
    if (message === '') {
      return '';
    }

    const triggerDate = new Date(
      nextYear,
      nextMonth,
      1,
      notificationTime.hour,
      notificationTime.minute,
      0,
      0,
    );

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '이달의 생일 캐릭터 🎂',
        body: message,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
      identifier: 'monthly_summary',
    });

    return identifier;
  } catch (error) {
    console.error('Failed to schedule monthly summary notification:', error);
    return '';
  }
}

/**
 * 모든 알림을 취소하고 현재 설정에 따라 전체 재스케줄링한다.
 *
 * - 기존 스케줄된 알림을 모두 취소
 * - 각 캐릭터의 각 stage에 대해 토글이 On이면 알림 스케줄링
 * - 월간 요약 알림도 재스케줄링
 */
export async function rescheduleAllNotifications(
  settings: AppSettings,
): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const characters = getCharacters();

    for (const character of characters) {
      const charSettings = settings.characterNotifications[character.id];
      if (!charSettings) continue;

      for (const stage of NOTIFICATION_STAGES) {
        if (charSettings[stage]) {
          await scheduleCharacterNotification(
            character,
            stage,
            settings.notificationTime,
          );
        }
      }
    }

    await scheduleMonthlySummary(settings.notificationTime);
  } catch (error) {
    console.error('Failed to reschedule all notifications:', error);
  }
}
