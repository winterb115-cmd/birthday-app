import { getCharactersByUnit } from '../data/embeddedData';
import { CharacterNotificationSettings, NotificationStage } from '../services/NotificationSettingsManager';

/**
 * Unit 토글 변경 시: 하위 모든 Character의 동일 stage를 일괄 변경.
 * 순수 함수 — 새로운 객체를 반환하며 원본을 변경하지 않는다.
 * 지정된 stage만 변경하고, 다른 stage는 그대로 유지한다.
 */
export function applyUnitToggle(
  settings: CharacterNotificationSettings,
  unitId: string,
  stage: NotificationStage,
  value: boolean
): CharacterNotificationSettings {
  const characters = getCharactersByUnit(unitId);
  const updated = { ...settings };

  for (const char of characters) {
    updated[char.id] = {
      ...updated[char.id],
      [stage]: value,
    };
  }

  return updated;
}

/**
 * Unit 내 모든 Character의 특정 stage가 전부 true인지 확인한다.
 * 모든 Character가 On → true, 하나라도 Off(또는 미설정) → false.
 */
export function computeUnitStageState(
  settings: CharacterNotificationSettings,
  unitId: string,
  stage: NotificationStage
): boolean {
  const characters = getCharactersByUnit(unitId);
  return characters.every(
    (char) => settings[char.id]?.[stage] === true
  );
}
