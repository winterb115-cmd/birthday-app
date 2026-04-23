import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import NotificationToggleButton from '@/src/components/NotificationToggleButton';
import {
    getAgencies,
    getCharactersByUnit,
    getUnits,
} from '@/src/data/embeddedData';
import { Agency, Character, Unit } from '@/src/data/types';
import {
    cancelCharacterNotification,
    rescheduleAllNotifications,
    scheduleCharacterNotification,
} from '@/src/services/NotificationScheduler';
import {
    AppSettings,
    getUnitStageState,
    loadSettings,
    NOTIFICATION_STAGES,
    NotificationStage,
    saveSettings,
    setNotificationTime,
    toggleCharacterStage,
    toggleUnitStage,
} from '@/src/services/NotificationSettingsManager';

const STAGE_LABELS: Record<NotificationStage, string> = {
  '7days': '7',
  '3days': '3',
  '1day': '1',
  dday: 'D',
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const agencies = getAgencies();
  const units = getUnits();

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const toggleUnitExpand = useCallback((unitId: string) => {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.add(unitId);
      }
      return next;
    });
  }, []);

  const handleCharacterToggle = useCallback(
    async (character: Character, stage: NotificationStage) => {
      if (!settings) return;
      const prevSettings = settings;
      const updated = toggleCharacterStage(settings, character.id, stage);
      setSettings(updated);

      try {
        await saveSettings(updated);
        const isNowOn = updated.characterNotifications[character.id]?.[stage];
        if (isNowOn) {
          await scheduleCharacterNotification(
            character,
            stage,
            updated.notificationTime,
          );
        } else {
          await cancelCharacterNotification(character.id, stage);
        }
      } catch {
        setSettings(prevSettings);
        Alert.alert('오류', '설정 저장에 실패했습니다. 다시 시도해주세요.');
      }
    },
    [settings],
  );

  const handleUnitToggle = useCallback(
    async (unit: Unit, stage: NotificationStage) => {
      if (!settings) return;
      const prevSettings = settings;
      const currentlyAllOn = getUnitStageState(settings, unit.id, stage);
      const newValue = !currentlyAllOn;
      const updated = toggleUnitStage(settings, unit.id, stage, newValue);
      setSettings(updated);

      try {
        await saveSettings(updated);
        const characters = getCharactersByUnit(unit.id);
        for (const char of characters) {
          if (newValue) {
            await scheduleCharacterNotification(
              char,
              stage,
              updated.notificationTime,
            );
          } else {
            await cancelCharacterNotification(char.id, stage);
          }
        }
      } catch {
        setSettings(prevSettings);
        Alert.alert('오류', '설정 저장에 실패했습니다. 다시 시도해주세요.');
      }
    },
    [settings],
  );

  const handleTimeChange = useCallback(
    async (hour: number, minute: number) => {
      if (!settings) return;
      const prevSettings = settings;
      const updated = setNotificationTime(settings, hour, minute);
      setSettings(updated);
      setTimePickerVisible(false);

      try {
        await saveSettings(updated);
        await rescheduleAllNotifications(updated);
      } catch {
        setSettings(prevSettings);
        Alert.alert('오류', '설정 저장에 실패했습니다. 다시 시도해주세요.');
      }
    },
    [settings],
  );

  if (!settings) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>설정 로딩 중...</Text>
      </View>
    );
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <ScrollView style={styles.container}>
      {/* Time Picker Section */}
      <View style={styles.timeSection}>
        <Text style={styles.timeSectionLabel}>알림 시간</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setTimePickerVisible(true)}
        >
          <Text style={styles.timeText}>
            {pad(settings.notificationTime.hour)}:
            {pad(settings.notificationTime.minute)}
          </Text>
          <Text style={styles.timeChangeHint}>변경</Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={timePickerVisible}
        currentHour={settings.notificationTime.hour}
        currentMinute={settings.notificationTime.minute}
        onConfirm={handleTimeChange}
        onCancel={() => setTimePickerVisible(false)}
      />

      {/* Agency > Unit > Character Hierarchy */}
      {agencies.map((agency) => (
        <AgencySection
          key={agency.id}
          agency={agency}
          units={units.filter((u) => u.agencyId === agency.id)}
          settings={settings}
          expandedUnits={expandedUnits}
          onToggleExpand={toggleUnitExpand}
          onCharacterToggle={handleCharacterToggle}
          onUnitToggle={handleUnitToggle}
        />
      ))}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

/* ─── Sub-components ─── */

function AgencySection({
  agency,
  units,
  settings,
  expandedUnits,
  onToggleExpand,
  onCharacterToggle,
  onUnitToggle,
}: {
  agency: Agency;
  units: readonly Unit[];
  settings: AppSettings;
  expandedUnits: Set<string>;
  onToggleExpand: (unitId: string) => void;
  onCharacterToggle: (character: Character, stage: NotificationStage) => void;
  onUnitToggle: (unit: Unit, stage: NotificationStage) => void;
}) {
  return (
    <View style={styles.agencyContainer}>
      <Text style={styles.agencyName}>{agency.name}</Text>
      {units.map((unit) => (
        <UnitSection
          key={unit.id}
          unit={unit}
          settings={settings}
          isExpanded={expandedUnits.has(unit.id)}
          onToggleExpand={() => onToggleExpand(unit.id)}
          onCharacterToggle={onCharacterToggle}
          onUnitToggle={onUnitToggle}
        />
      ))}
    </View>
  );
}

function UnitSection({
  unit,
  settings,
  isExpanded,
  onToggleExpand,
  onCharacterToggle,
  onUnitToggle,
}: {
  unit: Unit;
  settings: AppSettings;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCharacterToggle: (character: Character, stage: NotificationStage) => void;
  onUnitToggle: (unit: Unit, stage: NotificationStage) => void;
}) {
  const characters = getCharactersByUnit(unit.id);

  return (
    <View style={styles.unitContainer}>
      <View style={styles.unitRow}>
        <TouchableOpacity
          style={styles.unitNameArea}
          onPress={onToggleExpand}
        >
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
          <Text style={styles.unitName}>{unit.name}</Text>
        </TouchableOpacity>
        <View style={styles.toggleRow}>
          {NOTIFICATION_STAGES.map((stage) => (
            <NotificationToggleButton
              key={stage}
              isOn={getUnitStageState(settings, unit.id, stage)}
              label={STAGE_LABELS[stage]}
              onPress={() => onUnitToggle(unit, stage)}
            />
          ))}
        </View>
      </View>

      {isExpanded &&
        characters.map((char) => (
          <View key={char.id} style={styles.characterRow}>
            <Text style={styles.characterName}>{char.name}</Text>
            <View style={styles.toggleRow}>
              {NOTIFICATION_STAGES.map((stage) => (
                <NotificationToggleButton
                  key={stage}
                  isOn={
                    settings.characterNotifications[char.id]?.[stage] ?? false
                  }
                  label={STAGE_LABELS[stage]}
                  onPress={() => onCharacterToggle(char, stage)}
                />
              ))}
            </View>
          </View>
        ))}
    </View>
  );
}

function TimePickerModal({
  visible,
  currentHour,
  currentMinute,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  currentHour: number;
  currentMinute: number;
  onConfirm: (hour: number, minute: number) => void;
  onCancel: () => void;
}) {
  const [hour, setHour] = useState(currentHour);
  const [minute, setMinute] = useState(currentMinute);

  useEffect(() => {
    if (visible) {
      setHour(currentHour);
      setMinute(currentMinute);
    }
  }, [visible, currentHour, currentMinute]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>알림 시간 설정</Text>
          <View style={styles.pickerRow}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>시</Text>
              <ScrollView style={styles.pickerScroll}>
                {HOURS.map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={[
                      styles.pickerItem,
                      h === hour && styles.pickerItemSelected,
                    ]}
                    onPress={() => setHour(h)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        h === hour && styles.pickerItemTextSelected,
                      ]}
                    >
                      {pad(h)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <Text style={styles.pickerSeparator}>:</Text>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>분</Text>
              <ScrollView style={styles.pickerScroll}>
                {MINUTES.map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.pickerItem,
                      m === minute && styles.pickerItemSelected,
                    ]}
                    onPress={() => setMinute(m)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        m === minute && styles.pickerItemTextSelected,
                      ]}
                    >
                      {pad(m)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => onConfirm(hour, minute)}
            >
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ─── Styles ─── */

const BRAND_COLOR = '#4A90D9';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
  /* Time Section */
  timeSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeSectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 22,
    fontWeight: '700',
    color: BRAND_COLOR,
  },
  timeChangeHint: {
    fontSize: 13,
    color: '#999',
  },
  /* Agency */
  agencyContainer: {
    marginHorizontal: 12,
    marginTop: 8,
  },
  agencyName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  /* Unit */
  unitContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 6,
    overflow: 'hidden',
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  unitNameArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expandIcon: {
    fontSize: 12,
    color: '#888',
    marginRight: 8,
    width: 16,
  },
  unitName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  /* Character */
  characterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingLeft: 40,
    paddingRight: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEE',
  },
  characterName: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 20,
    width: 280,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerColumn: {
    alignItems: 'center',
    width: 80,
  },
  pickerLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
  },
  pickerScroll: {
    height: 180,
  },
  pickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  pickerItemSelected: {
    backgroundColor: BRAND_COLOR,
  },
  pickerItemText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  pickerItemTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
  pickerSeparator: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginHorizontal: 8,
    marginTop: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#EEE',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: BRAND_COLOR,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
