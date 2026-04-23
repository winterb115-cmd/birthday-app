# 요구사항 문서

## 소개

캐릭터 생일 알림 애플리케이션은 61명의 가상 캐릭터 생일을 체계적으로 관리하고, 사용자가 설정한 주기에 따라 푸시 알림을 제공하는 크로스 플랫폼 모바일 앱이다. 소속사와 유닛 단위의 계층 구조를 통해 대규모 캐릭터 설정을 빠르고 직관적으로 관리할 수 있다. 캐릭터 데이터는 앱에 내장되어 있으며, Android와 iOS 모두 지원한다.

## 용어 사전

- **App**: 캐릭터 생일 알림 크로스 플랫폼 모바일 애플리케이션 (Android, iOS 지원)
- **Character**: 이름, 생일(월/일), 소속사 ID, 유닛 ID를 가지는 가상 캐릭터 데이터 엔티티. 각 Character는 정확히 하나의 Unit에만 소속된다
- **Agency**: 하나 이상의 Unit을 포함하는 상위 그룹 엔티티
- **Unit**: 하나의 Agency에 소속되며, 하나 이상의 Character를 포함하는 하위 그룹 엔티티
- **Notification_Stage**: 생일 기준 알림 시점을 나타내는 4단계 값 (7일 전, 3일 전, 1일 전, 당일)
- **Notification_Toggle**: 특정 Character의 특정 Notification_Stage에 대한 활성화(On) 또는 비활성화(Off) 상태
- **Notification_Time**: 사용자가 설정한 알림 발송 시각. 모든 알림(개별 생일 알림, 월간 일괄 알림)은 이 시각에 발송된다
- **Monthly_Summary_Notification**: 매월 1일 Notification_Time에 해당 월 생일 캐릭터 명단을 일괄 전달하는 푸시 알림. 사용자가 비활성화할 수 없다
- **Dashboard**: 현재 월에 생일이 있는 캐릭터를 표시하는 메인 화면
- **Settings_Screen**: 소속사/유닛/캐릭터 계층 구조로 알림 설정을 관리하는 화면
- **Local_Storage**: 기기 내부에 알림 설정 데이터를 영구 저장하는 저장소
- **Embedded_Data**: 앱 내부에 사전 내장된 61명의 캐릭터, 소속사, 유닛 데이터. 사용자가 추가하거나 수정할 수 없다

## 요구사항

### 요구사항 1: 캐릭터 데이터 관리

**사용자 스토리:** 사용자로서, 캐릭터의 이름, 생일, 소속사, 유닛 정보를 구조화된 형태로 조회하고 싶다. 이를 통해 61명의 캐릭터를 체계적으로 탐색할 수 있다.

#### 인수 조건

1. THE App SHALL 61명의 Character 데이터를 Embedded_Data로 앱 내부에 사전 내장하여 제공한다
2. THE App SHALL 각 Character에 대해 이름, 생일(월/일), 소속 Agency ID, 소속 Unit ID를 저장한다
3. THE App SHALL 각 Character를 정확히 하나의 Unit에만 소속시킨다
4. THE App SHALL 각 Agency에 대해 이름과 하위 Unit 리스트를 저장한다
5. THE App SHALL 각 Unit에 대해 이름과 소속 Character 리스트를 저장한다
6. THE App SHALL Agency > Unit > Character 순서의 계층 구조로 데이터를 구성한다
7. THE App SHALL 사용자에게 Character, Agency, Unit 데이터의 추가, 수정, 삭제 기능을 제공하지 않는다

### 요구사항 2: 월간 일괄 알림

**사용자 스토리:** 사용자로서, 매월 1일에 해당 월 생일 캐릭터 명단을 한눈에 확인하고 싶다. 이를 통해 이번 달 생일 일정을 미리 파악할 수 있다.

#### 인수 조건

1. WHEN 매월 1일 Notification_Time이 도래하면, THE App SHALL 해당 월에 생일이 있는 모든 Character의 명단을 포함한 Monthly_Summary_Notification을 푸시 알림으로 전송한다
2. WHEN 해당 월에 생일이 있는 Character가 없으면, THE App SHALL Monthly_Summary_Notification을 전송하지 않는다
3. THE App SHALL Monthly_Summary_Notification에 각 Character의 이름과 생일 날짜를 포함한다
4. THE App SHALL Monthly_Summary_Notification에 대한 On/Off 설정 기능을 제공하지 않으며, 항상 활성화 상태로 유지한다

### 요구사항 3: 개별 캐릭터 생일 알림

**사용자 스토리:** 사용자로서, 캐릭터별로 생일 7일 전, 3일 전, 1일 전, 당일에 알림을 받고 싶다. 이를 통해 중요한 캐릭터의 생일을 놓치지 않을 수 있다.

#### 인수 조건

1. THE App SHALL 각 Character에 대해 4개의 Notification_Stage(7일 전, 3일 전, 1일 전, 당일)별 Notification_Toggle을 제공한다
2. WHEN 특정 Character의 Notification_Stage가 활성화(On) 상태이고 해당 시점의 Notification_Time이 도래하면, THE App SHALL 해당 Character의 이름과 생일 정보를 포함한 푸시 알림을 전송한다
3. WHEN 특정 Character의 Notification_Stage가 비활성화(Off) 상태이면, THE App SHALL 해당 시점에 푸시 알림을 전송하지 않는다

### 요구사항 4: 설정 화면 계층 구조 표시

**사용자 스토리:** 사용자로서, 소속사와 유닛 단위로 캐릭터를 그룹화하여 보고 싶다. 이를 통해 61명의 캐릭터 알림 설정을 효율적으로 탐색할 수 있다.

#### 인수 조건

1. THE Settings_Screen SHALL Agency > Unit 순서의 계층 구조로 목록을 표시한다
2. THE Settings_Screen SHALL 각 Unit 행에 유닛명과 4개의 Notification_Stage 버튼(7, 3, 1, D)을 표시한다
3. WHEN 사용자가 Unit 행을 선택하면, THE Settings_Screen SHALL 해당 Unit에 소속된 Character 목록을 펼쳐서 표시한다
4. THE Settings_Screen SHALL 각 Character 행에 캐릭터명과 4개의 Notification_Stage 버튼(7, 3, 1, D)을 표시한다

### 요구사항 5: 유닛 일괄 설정 변경

**사용자 스토리:** 사용자로서, 유닛 단위로 알림 설정을 한 번에 변경하고 싶다. 이를 통해 여러 캐릭터의 설정을 개별적으로 변경하는 번거로움을 줄일 수 있다.

#### 인수 조건

1. WHEN 사용자가 Unit 행의 특정 Notification_Stage 버튼을 On으로 변경하면, THE App SHALL 해당 Unit에 소속된 모든 Character의 동일 Notification_Stage Notification_Toggle을 즉시 On으로 변경한다
2. WHEN 사용자가 Unit 행의 특정 Notification_Stage 버튼을 Off로 변경하면, THE App SHALL 해당 Unit에 소속된 모든 Character의 동일 Notification_Stage Notification_Toggle을 즉시 Off로 변경한다

### 요구사항 6: 캐릭터 개별 설정과 유닛 상태 동기화

**사용자 스토리:** 사용자로서, 개별 캐릭터의 알림 설정을 변경했을 때 유닛 상태가 정확히 반영되길 원한다. 이를 통해 유닛 버튼의 상태만 보고도 하위 캐릭터들의 설정 일관성을 파악할 수 있다.

#### 인수 조건

1. WHEN 사용자가 특정 Character의 Notification_Stage 버튼을 변경하여 해당 Unit 내 모든 Character의 동일 Notification_Stage 설정이 일치하지 않게 되면, THE App SHALL 해당 Unit 행의 동일 Notification_Stage 버튼을 즉시 Off로 변경한다
2. WHILE Unit 행의 특정 Notification_Stage 버튼이 Off로 변경되는 동안, THE App SHALL 해당 Unit 내 다른 Character들의 Notification_Toggle 상태를 변경 전 상태 그대로 유지한다
3. WHEN 사용자가 특정 Character의 Notification_Stage 버튼을 변경하여 해당 Unit 내 모든 Character의 동일 Notification_Stage 설정이 모두 On이 되면, THE App SHALL 해당 Unit 행의 동일 Notification_Stage 버튼을 즉시 On으로 변경한다

### 요구사항 7: 자동 저장

**사용자 스토리:** 사용자로서, 알림 설정 변경 시 별도의 저장 버튼 없이 즉시 저장되길 원한다. 이를 통해 설정 변경 후 저장을 잊어버리는 실수를 방지할 수 있다.

#### 인수 조건

1. WHEN 사용자가 Notification_Toggle 버튼을 터치하면, THE App SHALL 변경된 설정을 즉시 Local_Storage에 저장한다
2. IF Local_Storage 저장에 실패하면, THEN THE App SHALL 사용자에게 저장 실패 메시지를 표시한다
3. WHEN App이 재시작되면, THE App SHALL Local_Storage에서 마지막으로 저장된 Notification_Toggle 설정을 복원한다

### 요구사항 8: 대시보드 (메인 화면)

**사용자 스토리:** 사용자로서, 앱을 열었을 때 이번 달 생일 캐릭터를 바로 확인하고 싶다. 이를 통해 다가오는 생일 일정을 빠르게 파악할 수 있다.

#### 인수 조건

1. WHEN 사용자가 App을 실행하면, THE Dashboard SHALL 현재 월에 생일이 있는 Character 목록을 표시한다
2. THE Dashboard SHALL 각 Character의 이름과 생일 날짜를 표시한다
3. WHEN 현재 월에 생일이 있는 Character가 없으면, THE Dashboard SHALL 생일 캐릭터가 없음을 안내하는 메시지를 표시한다

### 요구사항 9: 알림 설정 버튼 시각적 피드백

**사용자 스토리:** 사용자로서, 알림 설정의 활성화/비활성화 상태를 시각적으로 명확히 구분하고 싶다. 이를 통해 현재 설정 상태를 한눈에 파악할 수 있다.

#### 인수 조건

1. WHILE Notification_Toggle이 활성화(On) 상태인 동안, THE App SHALL 해당 버튼에 브랜드 컬러(선명한 색상)를 적용하여 표시한다
2. WHILE Notification_Toggle이 비활성화(Off) 상태인 동안, THE App SHALL 해당 버튼에 회색(Gray)을 적용하여 표시한다
3. WHEN 사용자가 Notification_Toggle 버튼을 터치하면, THE App SHALL 버튼의 색상을 즉시 변경하여 상태 전환을 시각적으로 반영한다


### 요구사항 10: 알림 시간 설정

**사용자 스토리:** 사용자로서, 알림을 받을 시간을 직접 설정하고 싶다. 이를 통해 원하는 시간에 생일 알림을 받을 수 있다.

#### 인수 조건

1. THE Settings_Screen SHALL 사용자가 Notification_Time을 설정할 수 있는 시간 선택 기능을 제공한다
2. THE App SHALL 모든 알림(개별 생일 알림, Monthly_Summary_Notification)을 사용자가 설정한 Notification_Time에 발송한다
3. THE App SHALL Notification_Stage별로 서로 다른 알림 시간 설정 기능을 제공하지 않는다
4. WHEN 사용자가 Notification_Time을 변경하면, THE App SHALL 변경된 시간을 즉시 Local_Storage에 저장하고 이후 모든 알림에 적용한다

### 요구사항 11: 알림 기본값 설정

**사용자 스토리:** 사용자로서, 앱을 처음 설치했을 때 합리적인 기본 알림 설정이 적용되어 있길 원한다. 이를 통해 별도의 설정 없이도 당일 생일 알림을 바로 받을 수 있다.

#### 인수 조건

1. WHEN App이 최초 설치되면, THE App SHALL 모든 Character의 '당일' Notification_Stage Notification_Toggle을 활성화(On)로 설정한다
2. WHEN App이 최초 설치되면, THE App SHALL 모든 Character의 '7일 전', '3일 전', '1일 전' Notification_Stage Notification_Toggle을 비활성화(Off)로 설정한다
3. WHEN App이 최초 설치되면, THE App SHALL Notification_Time을 오전 09:00으로 설정한다

### 요구사항 12: 크로스 플랫폼 지원

**사용자 스토리:** 사용자로서, Android와 iOS 기기 모두에서 동일한 기능의 앱을 사용하고 싶다. 이를 통해 사용하는 기기 종류에 관계없이 캐릭터 생일 알림을 받을 수 있다.

#### 인수 조건

1. THE App SHALL Android 플랫폼에서 정상 동작한다
2. THE App SHALL iOS 플랫폼에서 정상 동작한다
3. THE App SHALL Android와 iOS에서 동일한 기능을 제공한다
4. THE App SHALL 유지보수 용이성을 위해 단일 코드베이스 크로스 플랫폼 프레임워크를 사용하여 개발한다
