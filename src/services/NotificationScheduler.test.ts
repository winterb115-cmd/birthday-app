import { Character } from '../data/types';
import {
  calculateNotificationDate,
  cancelCharacterNotification,
  generateMonthlySummaryMessage,
  generateNotificationId,
  rescheduleAllNotifications,
  scheduleCharacterNotification,
  scheduleMonthlySummary,
} from './NotificationScheduler';
import { AppSettings, NotificationStage } from './NotificationSettingsManager';

// Mock expo-notifications
const mockScheduleNotificationAsync = jest.fn();
const mockCancelScheduledNotificationAsync = jest.fn();
const mockCancelAllScheduledNotificationsAsync = jest.fn();

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: (...args: unknown[]) => mockScheduleNotificationAsync(...args),
  cancelScheduledNotificationAsync: (...args: unknown[]) => mockCancelScheduledNotificationAsync(...args),
  cancelAllScheduledNotificationsAsync: (...args: unknown[]) => mockCancelAllScheduledNotificationsAsync(...args),
  SchedulableTriggerInputTypes: {
    DATE: 'date',
  },
}));

// Mock embeddedData
const mockGetCharacters = jest.fn();
const mockGetCharactersByMonth = jest.fn();

jest.mock('../data/embeddedData', () => ({
  getCharacters: (...args: unknown[]) => mockGetCharacters(...args),
  getCharactersByMonth: (...args: unknown[]) => mockGetCharactersByMonth(...args),
}));

// Mock NotificationSettingsManager to avoid AsyncStorage import issues
jest.mock('./NotificationSettingsManager', () => ({
  NOTIFICATION_STAGES: ['7days', '3days', '1day', 'dday'] as const,
}));

describe('calculateNotificationDate', () => {
  describe('normal dates', () => {
    it('calculates dday (0 offset) correctly', () => {
      const result = calculateNotificationDate(
        { month: 6, day: 15 },
        'dday',
        2025,
        { hour: 9, minute: 0 },
      );
      expect(result).toEqual(new Date(2025, 5, 15, 9, 0, 0, 0));
    });

    it('calculates 1day before correctly', () => {
      const result = calculateNotificationDate(
        { month: 6, day: 15 },
        '1day',
        2025,
        { hour: 9, minute: 0 },
      );
      expect(result).toEqual(new Date(2025, 5, 14, 9, 0, 0, 0));
    });

    it('calculates 3days before correctly', () => {
      const result = calculateNotificationDate(
        { month: 6, day: 15 },
        '3days',
        2025,
        { hour: 9, minute: 0 },
      );
      expect(result).toEqual(new Date(2025, 5, 12, 9, 0, 0, 0));
    });

    it('calculates 7days before correctly', () => {
      const result = calculateNotificationDate(
        { month: 6, day: 15 },
        '7days',
        2025,
        { hour: 9, minute: 0 },
      );
      expect(result).toEqual(new Date(2025, 5, 8, 9, 0, 0, 0));
    });
  });

  describe('Feb 29 leap year handling', () => {
    it('uses Feb 29 in a leap year', () => {
      const result = calculateNotificationDate(
        { month: 2, day: 29 },
        'dday',
        2024,
        { hour: 9, minute: 0 },
      );
      expect(result).toEqual(new Date(2024, 1, 29, 9, 0, 0, 0));
    });

    it('falls back to Feb 28 in a non-leap year', () => {
      const result = calculateNotificationDate(
        { month: 2, day: 29 },
        'dday',
        2025,
        { hour: 9, minute: 0 },
      );
      expect(result).toEqual(new Date(2025, 1, 28, 9, 0, 0, 0));
    });

    it('applies offset from Feb 28 in a non-leap year', () => {
      const result = calculateNotificationDate(
        { month: 2, day: 29 },
        '3days',
        2025,
        { hour: 9, minute: 0 },
      );
      // Feb 28 - 3 = Feb 25
      expect(result).toEqual(new Date(2025, 1, 25, 9, 0, 0, 0));
    });

    it('applies offset from Feb 29 in a leap year', () => {
      const result = calculateNotificationDate(
        { month: 2, day: 29 },
        '7days',
        2024,
        { hour: 9, minute: 0 },
      );
      // Feb 29 - 7 = Feb 22
      expect(result).toEqual(new Date(2024, 1, 22, 9, 0, 0, 0));
    });
  });

  describe('year boundary (Jan birthday with 7-day offset)', () => {
    it('wraps to previous year for Jan 3 birthday with 7days stage', () => {
      const result = calculateNotificationDate(
        { month: 1, day: 3 },
        '7days',
        2025,
        { hour: 9, minute: 0 },
      );
      // Jan 3 - 7 = Dec 27 of previous year
      expect(result).toEqual(new Date(2024, 11, 27, 9, 0, 0, 0));
    });

    it('wraps to previous year for Jan 1 birthday with 3days stage', () => {
      const result = calculateNotificationDate(
        { month: 1, day: 1 },
        '3days',
        2025,
        { hour: 9, minute: 0 },
      );
      // Jan 1 - 3 = Dec 29 of previous year
      expect(result).toEqual(new Date(2024, 11, 29, 9, 0, 0, 0));
    });

    it('wraps to previous year for Jan 1 birthday with 7days stage', () => {
      const result = calculateNotificationDate(
        { month: 1, day: 1 },
        '7days',
        2025,
        { hour: 9, minute: 0 },
      );
      // Jan 1 - 7 = Dec 25 of previous year
      expect(result).toEqual(new Date(2024, 11, 25, 9, 0, 0, 0));
    });

    it('stays in same year for Jan 10 birthday with 7days stage', () => {
      const result = calculateNotificationDate(
        { month: 1, day: 10 },
        '7days',
        2025,
        { hour: 9, minute: 0 },
      );
      // Jan 10 - 7 = Jan 3
      expect(result).toEqual(new Date(2025, 0, 3, 9, 0, 0, 0));
    });
  });

  describe('different notification times', () => {
    it('applies midnight time', () => {
      const result = calculateNotificationDate(
        { month: 3, day: 15 },
        'dday',
        2025,
        { hour: 0, minute: 0 },
      );
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });

    it('applies afternoon time', () => {
      const result = calculateNotificationDate(
        { month: 3, day: 15 },
        'dday',
        2025,
        { hour: 14, minute: 30 },
      );
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
    });

    it('applies end-of-day time', () => {
      const result = calculateNotificationDate(
        { month: 3, day: 15 },
        'dday',
        2025,
        { hour: 23, minute: 59 },
      );
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
    });

    it('always sets seconds and milliseconds to 0', () => {
      const result = calculateNotificationDate(
        { month: 7, day: 20 },
        '1day',
        2025,
        { hour: 10, minute: 45 },
      );
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('dday (0 offset)', () => {
    it('returns the birthday date itself', () => {
      const result = calculateNotificationDate(
        { month: 12, day: 25 },
        'dday',
        2025,
        { hour: 9, minute: 0 },
      );
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(11); // December is 11 in JS
      expect(result.getDate()).toBe(25);
    });

    it('returns Feb 28 for Feb 29 birthday in non-leap year', () => {
      const result = calculateNotificationDate(
        { month: 2, day: 29 },
        'dday',
        2023,
        { hour: 9, minute: 0 },
      );
      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(28);
    });
  });
});


describe('generateNotificationId', () => {
  it('returns characterId_stage format', () => {
    expect(generateNotificationId('char_001', 'dday')).toBe('char_001_dday');
  });

  it('works with all stages', () => {
    const stages: NotificationStage[] = ['7days', '3days', '1day', 'dday'];
    for (const stage of stages) {
      expect(generateNotificationId('char_042', stage)).toBe(`char_042_${stage}`);
    }
  });
});

describe('scheduleCharacterNotification', () => {
  const mockCharacter: Character = {
    id: 'char_001',
    name: '테스트캐릭터',
    birthday: { month: 12, day: 25 },
    agencyId: 'agency_001',
    unitId: 'unit_001',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('schedules a notification and returns the identifier', async () => {
    mockScheduleNotificationAsync.mockResolvedValue('notif-id-123');

    const result = await scheduleCharacterNotification(
      mockCharacter,
      'dday',
      { hour: 9, minute: 0 },
    );

    expect(result).toBe('notif-id-123');
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1);
    const call = mockScheduleNotificationAsync.mock.calls[0][0];
    expect(call.content.title).toContain('테스트캐릭터');
    expect(call.identifier).toBe('char_001_dday');
    expect(call.trigger.type).toBe('date');
    expect(call.trigger.date).toBeInstanceOf(Date);
  });

  it('includes birthday info in the notification body for dday', async () => {
    mockScheduleNotificationAsync.mockResolvedValue('notif-id');

    await scheduleCharacterNotification(mockCharacter, 'dday', { hour: 9, minute: 0 });

    const call = mockScheduleNotificationAsync.mock.calls[0][0];
    expect(call.content.body).toContain('오늘은');
    expect(call.content.body).toContain('12월 25일');
  });

  it('includes days remaining in the notification body for non-dday stages', async () => {
    mockScheduleNotificationAsync.mockResolvedValue('notif-id');

    await scheduleCharacterNotification(mockCharacter, '7days', { hour: 9, minute: 0 });

    const call = mockScheduleNotificationAsync.mock.calls[0][0];
    expect(call.content.body).toContain('7일');
    expect(call.content.body).toContain('12월 25일');
  });

  it('returns empty string on failure', async () => {
    mockScheduleNotificationAsync.mockRejectedValue(new Error('API error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await scheduleCharacterNotification(
      mockCharacter,
      'dday',
      { hour: 9, minute: 0 },
    );

    expect(result).toBe('');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('schedules for next year if the date is in the past', async () => {
    // Character with birthday in January - if current date is after Jan, it should schedule next year
    const janCharacter: Character = {
      id: 'char_002',
      name: '1월캐릭터',
      birthday: { month: 1, day: 1 },
      agencyId: 'agency_001',
      unitId: 'unit_001',
    };

    mockScheduleNotificationAsync.mockResolvedValue('notif-id-next-year');

    const result = await scheduleCharacterNotification(
      janCharacter,
      'dday',
      { hour: 9, minute: 0 },
    );

    expect(result).toBe('notif-id-next-year');
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1);

    // Verify the scheduled date is in the future
    const call = mockScheduleNotificationAsync.mock.calls[0][0];
    const scheduledDate: Date = call.trigger.date;
    expect(scheduledDate.getTime()).toBeGreaterThan(Date.now());
  });
});

describe('cancelCharacterNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cancels a notification with the correct ID', async () => {
    mockCancelScheduledNotificationAsync.mockResolvedValue(undefined);

    await cancelCharacterNotification('char_001', 'dday');

    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('char_001_dday');
  });

  it('cancels with correct ID for all stages', async () => {
    mockCancelScheduledNotificationAsync.mockResolvedValue(undefined);

    const stages: NotificationStage[] = ['7days', '3days', '1day', 'dday'];
    for (const stage of stages) {
      await cancelCharacterNotification('char_042', stage);
    }

    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledTimes(4);
    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('char_042_7days');
    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('char_042_3days');
    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('char_042_1day');
    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('char_042_dday');
  });

  it('logs error silently on failure', async () => {
    mockCancelScheduledNotificationAsync.mockRejectedValue(new Error('Cancel failed'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await cancelCharacterNotification('char_001', 'dday');

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});


describe('generateMonthlySummaryMessage', () => {
  const sampleCharacters: Character[] = [
    { id: 'char_001', name: '캐릭터A', birthday: { month: 3, day: 5 }, agencyId: 'a1', unitId: 'u1' },
    { id: 'char_002', name: '캐릭터B', birthday: { month: 3, day: 20 }, agencyId: 'a1', unitId: 'u1' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns formatted message with all characters for the month', () => {
    mockGetCharactersByMonth.mockReturnValue(sampleCharacters);

    const result = generateMonthlySummaryMessage(3);

    expect(result).toBe(
      '이달의 생일 캐릭터:\n- 캐릭터A (3월 5일)\n- 캐릭터B (3월 20일)',
    );
    expect(mockGetCharactersByMonth).toHaveBeenCalledWith(3);
  });

  it('returns empty string when no characters in the month', () => {
    mockGetCharactersByMonth.mockReturnValue([]);

    const result = generateMonthlySummaryMessage(8);

    expect(result).toBe('');
  });

  it('handles single character', () => {
    mockGetCharactersByMonth.mockReturnValue([sampleCharacters[0]]);

    const result = generateMonthlySummaryMessage(3);

    expect(result).toBe('이달의 생일 캐릭터:\n- 캐릭터A (3월 5일)');
  });
});

describe('scheduleMonthlySummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('schedules a monthly summary notification for the 1st of next month', async () => {
    const chars: Character[] = [
      { id: 'c1', name: '테스트', birthday: { month: 1, day: 10 }, agencyId: 'a1', unitId: 'u1' },
    ];
    // Mock current date to be in December so next month is January
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 11, 15)); // Dec 15, 2025

    mockGetCharactersByMonth.mockReturnValue(chars);
    mockScheduleNotificationAsync.mockResolvedValue('monthly-id');

    const result = await scheduleMonthlySummary({ hour: 9, minute: 0 });

    expect(result).toBe('monthly-id');
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1);
    const call = mockScheduleNotificationAsync.mock.calls[0][0];
    expect(call.content.title).toBe('이달의 생일 캐릭터 🎂');
    expect(call.identifier).toBe('monthly_summary');
    expect(call.trigger.date).toEqual(new Date(2026, 0, 1, 9, 0, 0, 0));

    jest.useRealTimers();
  });

  it('returns empty string when no birthdays in next month', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 5, 10)); // June 10

    mockGetCharactersByMonth.mockReturnValue([]);

    const result = await scheduleMonthlySummary({ hour: 9, minute: 0 });

    expect(result).toBe('');
    expect(mockScheduleNotificationAsync).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('returns empty string on scheduling failure', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 5, 10));

    const chars: Character[] = [
      { id: 'c1', name: '테스트', birthday: { month: 7, day: 1 }, agencyId: 'a1', unitId: 'u1' },
    ];
    mockGetCharactersByMonth.mockReturnValue(chars);
    mockScheduleNotificationAsync.mockRejectedValue(new Error('fail'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await scheduleMonthlySummary({ hour: 9, minute: 0 });

    expect(result).toBe('');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
    jest.useRealTimers();
  });
});

describe('rescheduleAllNotifications', () => {
  const chars: Character[] = [
    { id: 'char_001', name: 'A', birthday: { month: 6, day: 15 }, agencyId: 'a1', unitId: 'u1' },
    { id: 'char_002', name: 'B', birthday: { month: 12, day: 25 }, agencyId: 'a1', unitId: 'u1' },
  ];

  const settings: AppSettings = {
    characterNotifications: {
      char_001: { '7days': false, '3days': false, '1day': true, dday: true },
      char_002: { '7days': true, '3days': false, '1day': false, dday: true },
    },
    notificationTime: { hour: 10, minute: 30 },
    isInitialized: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCharacters.mockReturnValue(chars);
    mockGetCharactersByMonth.mockReturnValue([]);
    mockCancelAllScheduledNotificationsAsync.mockResolvedValue(undefined);
    mockScheduleNotificationAsync.mockResolvedValue('notif-id');
  });

  it('cancels all existing notifications first', async () => {
    await rescheduleAllNotifications(settings);

    expect(mockCancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
  });

  it('schedules notifications only for enabled stages', async () => {
    await rescheduleAllNotifications(settings);

    // char_001: 1day + dday = 2 calls
    // char_002: 7days + dday = 2 calls
    // Total = 4 schedule calls (monthly summary returns empty so no extra call)
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(4);
  });

  it('does not schedule for disabled stages', async () => {
    await rescheduleAllNotifications(settings);

    const identifiers = mockScheduleNotificationAsync.mock.calls.map(
      (call: unknown[]) => (call[0] as { identifier: string }).identifier,
    );
    expect(identifiers).not.toContain('char_001_7days');
    expect(identifiers).not.toContain('char_001_3days');
    expect(identifiers).not.toContain('char_002_3days');
    expect(identifiers).not.toContain('char_002_1day');
  });

  it('also schedules monthly summary', async () => {
    const monthlyChars: Character[] = [
      { id: 'c1', name: '월간', birthday: { month: 1, day: 1 }, agencyId: 'a1', unitId: 'u1' },
    ];
    // Make monthly summary have characters
    mockGetCharactersByMonth.mockReturnValue(monthlyChars);

    await rescheduleAllNotifications(settings);

    const identifiers = mockScheduleNotificationAsync.mock.calls.map(
      (call: unknown[]) => (call[0] as { identifier: string }).identifier,
    );
    expect(identifiers).toContain('monthly_summary');
  });

  it('handles errors gracefully', async () => {
    mockCancelAllScheduledNotificationsAsync.mockRejectedValue(new Error('cancel fail'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await rescheduleAllNotifications(settings);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
