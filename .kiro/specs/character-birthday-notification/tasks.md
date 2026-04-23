# 구현 계획: 캐릭터 생일 알림 (Character Birthday Notification)

## 개요

React Native + Expo (TypeScript) 기반의 캐릭터 생일 알림 앱을 구현한다. CSV 파일로 제공되는 캐릭터/소속사/유닛 데이터를 파싱하여 내장 데이터로 변환하고, 알림 설정 관리, Unit-Character 동기화 로직, 로컬 알림 스케줄링, Dashboard/Settings 화면을 단계적으로 구현한다.

## Tasks

- [x] 1. 프로젝트 구조 설정 및 CSV 데이터 변환
  - [x] 1.1 Expo 프로젝트 초기화 및 의존성 설치
    - `expo-notifications`, `@react-native-async-storage/async-storage`, `expo-router`, `fast-check` 설치
    - TypeScript 설정 확인 및 디렉토리 구조 생성 (`data/`, `services/`, `logic/`, `components/`, `app/`)
    - _Requirements: 12.4_

  - [x] 1.2 CSV 파싱 스크립트 작성 및 내장 데이터 생성
    - 사용자 제공 CSV 파일(캐릭터, 소속사, 유닛)을 파싱하는 Node.js 스크립트 작성
    - CSV → TypeScript 상수 파일(`data/characters.ts`, `data/units.ts`, `data/agencies.ts`)로 변환
    - `Character`, `Unit`, `Agency` 인터페이스 정의 (`data/types.ts`)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 1.3 EmbeddedData 모듈 구현
    - `getCharacters()`, `getUnits()`, `getAgencies()` 함수 구현
    - `getCharactersByUnit(unitId)`, `getCharactersByMonth(month)` 함수 구현
    - 데이터는 읽기 전용으로 외부 수정 불가하도록 설계
    - _Requirements: 1.1, 1.6, 1.7, 8.1_

  - [ ]* 1.4 Property 1: 내장 데이터 무결성 테스트 작성
    - **Property 1: 내장 데이터 무결성**
    - 모든 Character가 유효한 이름, 생일(month 1-12, day 1-31), agencyId, unitId를 가지는지 검증
    - Unit의 characterIds에 해당 캐릭터가 포함되고, Unit의 agencyId가 캐릭터의 agencyId와 일치하는지 검증
    - **Validates: Requirements 1.2, 1.3, 1.6**

  - [ ]* 1.5 Property 2: 월별 캐릭터 필터링 정확성 테스트 작성
    - **Property 2: 월별 캐릭터 필터링 정확성**
    - 임의의 월(1-12)에 대해 `getCharactersByMonth`가 정확한 결과를 반환하는지 검증
    - 반환된 캐릭터의 birthday.month가 해당 월과 일치하고, 누락이 없는지 검증
    - **Validates: Requirements 2.1, 8.1**

- [x] 2. 알림 설정 관리 모듈 구현 (NotificationSettingsManager)
  - [x] 2.1 타입 정의 및 기본 설정 초기화 구현
    - `NotificationStage`, `CharacterNotificationSettings`, `AppSettings` 타입 정의
    - `initializeDefaultSettings()` 구현: 모든 캐릭터 dday=true, 나머지=false, 시간=09:00
    - _Requirements: 3.1, 11.1, 11.2, 11.3_

  - [ ]* 2.2 Property 4: 기본 설정 초기화 정확성 테스트 작성
    - **Property 4: 기본 설정 초기화 정확성**
    - 임의의 캐릭터 ID 목록에 대해 dday=true, 7days/3days/1day=false, 정확히 4개 stage 존재 검증
    - **Validates: Requirements 3.1, 11.1, 11.2**

  - [x] 2.3 AsyncStorage 저장/복원 로직 구현
    - `loadSettings()`: AsyncStorage에서 설정 로드, JSON 파싱 실패 시 기본값 초기화
    - `saveSettings(settings)`: AsyncStorage에 설정 저장, 실패 시 최대 2회 재시도
    - `version` 필드를 통한 스키마 마이그레이션 지원
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 2.4 Property 8: 설정 저장/복원 라운드 트립 테스트 작성
    - **Property 8: 설정 저장/복원 라운드 트립**
    - 임의의 유효한 AppSettings에 대해 save → load 후 원본과 동일한지 검증
    - **Validates: Requirements 7.3**

  - [x] 2.5 토글 변경 함수 구현
    - `toggleCharacterStage(settings, characterId, stage)` 구현
    - `toggleUnitStage(settings, unitId, stage, value)` 구현
    - `getUnitStageState(settings, unitId, stage)` 구현
    - `setNotificationTime(settings, hour, minute)` 구현
    - _Requirements: 3.1, 5.1, 5.2, 6.1, 6.3, 10.1, 10.4_

- [x] 3. Unit-Character 동기화 로직 구현 (UnitCharacterSyncLogic)
  - [x] 3.1 applyUnitToggle 함수 구현
    - Unit 토글 변경 시 하위 모든 Character의 동일 stage를 일괄 변경하는 순수 함수 구현
    - _Requirements: 5.1, 5.2_

  - [ ]* 3.2 Property 5: Unit 일괄 토글 전파 테스트 작성
    - **Property 5: Unit 일괄 토글 전파**
    - 임의의 설정 상태, unitId, stage, boolean에 대해 applyUnitToggle 후 모든 하위 Character의 해당 stage가 value와 동일한지 검증
    - **Validates: Requirements 5.1, 5.2**

  - [x] 3.3 computeUnitStageState 함수 구현
    - Character 토글 변경 후 Unit의 stage 상태를 재계산하는 순수 함수 구현
    - 모든 Character가 On → Unit On, 하나라도 불일치 → Unit Off
    - _Requirements: 6.1, 6.3_

  - [ ]* 3.4 Property 6: Unit 상태는 하위 Character 일치 여부를 반영 테스트 작성
    - **Property 6: Unit 상태는 하위 Character 일치 여부를 반영**
    - 임의의 설정 상태, unitId, stage에 대해 computeUnitStageState가 모든 Character On일 때만 true 반환 검증
    - **Validates: Requirements 6.1, 6.3**

  - [ ]* 3.5 Property 7: 개별 토글 변경 시 다른 캐릭터 상태 보존 테스트 작성
    - **Property 7: 개별 토글 변경 시 다른 캐릭터 상태 보존**
    - 임의의 Unit 내 특정 Character의 stage 토글 변경 시, 다른 모든 Character의 모든 stage 값이 변경 전과 동일한지 검증
    - **Validates: Requirements 6.2**

- [x] 4. 체크포인트 - 핵심 로직 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

- [x] 5. 알림 스케줄러 구현 (NotificationScheduler)
  - [x] 5.1 알림 날짜 계산 로직 구현
    - `calculateNotificationDate(birthday, stage, year)` 구현
    - stage별 날짜 오프셋 적용 (7days→-7, 3days→-3, 1day→-1, dday→0)
    - 연말/연초 경계 처리 (1월 생일의 7일 전 → 전년도 12월)
    - 2월 29일 생일 윤년 처리 (비윤년 시 2월 28일 대체)
    - notificationTime(hour, minute) 적용
    - _Requirements: 10.2_

  - [ ]* 5.2 Property 10: 알림 날짜 계산 시 설정 시간 적용 테스트 작성
    - **Property 10: 알림 날짜 계산 시 설정 시간 적용**
    - 임의의 생일, stage, notificationTime에 대해 반환 Date의 hour/minute이 notificationTime과 일치하고, 날짜가 생일로부터 stage 일수만큼 이전인지 검증
    - **Validates: Requirements 10.2**

  - [x] 5.3 개별 캐릭터 알림 스케줄링/취소 구현
    - `scheduleCharacterNotification(character, stage, notificationTime)` 구현
    - `cancelCharacterNotification(characterId, stage)` 구현
    - 알림 ID 생성 규칙: `${characterId}_${stage}_${year}`
    - expo-notifications API 호출 실패 시 에러 로깅
    - _Requirements: 3.2, 3.3_

  - [x] 5.4 월간 요약 알림 및 전체 재스케줄링 구현
    - `scheduleMonthlySummary(notificationTime)` 구현: 매월 1일 알림 스케줄링
    - 월간 알림 메시지에 해당 월 모든 캐릭터 이름과 생일 날짜 포함
    - `rescheduleAllNotifications(settings)` 구현: 시간 변경 시 전체 재스케줄링
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 10.4_

  - [ ]* 5.5 Property 3: 월간 알림 메시지 완전성 테스트 작성
    - **Property 3: 월간 알림 메시지 완전성**
    - 임의의 캐릭터 목록에 대해 월간 요약 메시지에 모든 캐릭터의 이름과 생일 날짜가 포함되는지 검증
    - **Validates: Requirements 2.3**

  - [ ]* 5.6 Property 9: 알림 스케줄은 토글 상태를 반영 테스트 작성
    - **Property 9: 알림 스케줄은 토글 상태를 반영**
    - 임의의 Character와 stage에 대해 On이면 알림 스케줄됨, Off이면 스케줄되지 않음 검증
    - **Validates: Requirements 3.2, 3.3**

- [x] 6. 체크포인트 - 알림 스케줄러 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

- [x] 7. Dashboard 화면 구현
  - [x] 7.1 Dashboard 화면 레이아웃 및 데이터 바인딩
    - `app/(tabs)/index.tsx`에 Dashboard 화면 구현
    - `getCharactersByMonth(currentMonth)`로 현재 월 생일 캐릭터 목록 표시
    - 각 캐릭터의 이름과 생일 날짜 표시
    - 생일 캐릭터가 없을 경우 안내 메시지 표시
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 7.2 Dashboard 단위 테스트 작성
    - 현재 월 캐릭터 목록 렌더링 검증
    - 빈 월 안내 메시지 표시 검증
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 8. Settings 화면 구현
  - [x] 8.1 Settings 화면 계층 구조 및 토글 UI 구현
    - `app/(tabs)/settings.tsx`에 Settings 화면 구현
    - Agency > Unit > Character 계층 구조 목록 표시
    - Unit 행: 유닛명 + 4개 Notification_Stage 버튼 (7, 3, 1, D)
    - Unit 행 선택 시 하위 Character 목록 펼침/접기
    - Character 행: 캐릭터명 + 4개 Notification_Stage 버튼 (7, 3, 1, D)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 8.2 NotificationToggleButton 컴포넌트 구현
    - On 상태: 브랜드 컬러 적용, Off 상태: 회색 적용
    - 터치 시 즉시 색상 전환
    - 라벨 표시: '7', '3', '1', 'D'
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 8.3 Settings 화면 상태 관리 연동
    - NotificationSettingsManager와 연동하여 토글 상태 관리
    - Character 토글 변경 → UnitCharacterSyncLogic으로 Unit 상태 재계산
    - Unit 토글 변경 → 하위 Character 일괄 변경
    - 토글 변경 시 AsyncStorage 즉시 저장 + NotificationScheduler 알림 갱신
    - 저장 실패 시 토스트 메시지 표시 및 상태 롤백
    - _Requirements: 5.1, 5.2, 6.1, 6.2, 6.3, 7.1, 7.2_

  - [x] 8.4 알림 시간 설정 (TimePicker) 구현
    - TimePicker 컴포넌트로 Notification_Time 설정 기능 제공
    - 시간 변경 시 AsyncStorage 즉시 저장
    - 시간 변경 시 `rescheduleAllNotifications` 호출하여 모든 알림 재스케줄링
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 8.5 Settings 화면 단위 테스트 작성
    - 계층 구조 렌더링 검증
    - 토글 버튼 색상 전환 검증
    - Unit/Character 동기화 UI 반영 검증
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 9.1, 9.2, 9.3_

- [x] 9. 앱 초기화 및 네비게이션 연결
  - [x] 9.1 앱 초기화 로직 구현
    - 앱 최초 실행 시 알림 권한 요청
    - `isInitialized` 확인 후 기본 설정 초기화 또는 저장된 설정 복원
    - 권한 거부 시 Settings 화면에 안내 배너 표시
    - _Requirements: 7.3, 11.1, 11.2, 11.3_

  - [x] 9.2 expo-router 탭 네비게이션 설정
    - Dashboard ↔ Settings 탭 네비게이션 구성
    - `app/_layout.tsx` 및 `app/(tabs)/_layout.tsx` 설정
    - _Requirements: 8.1, 10.1_

- [x] 10. 최종 체크포인트 - 전체 통합 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

## Notes

- `*` 표시된 태스크는 선택 사항이며, 빠른 MVP를 위해 건너뛸 수 있습니다
- 각 태스크는 추적 가능성을 위해 특정 요구사항을 참조합니다
- 체크포인트에서 점진적 검증을 수행합니다
- Property 테스트는 `fast-check` 라이브러리를 사용하여 최소 100회 반복 실행합니다
- 단위 테스트는 Jest를 사용합니다
- CSV 파싱 스크립트는 빌드 타임에 실행되며, 런타임에는 변환된 TypeScript 상수를 사용합니다
