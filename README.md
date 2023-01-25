# 다목적 캘린더 컴포넌트


### 컴포넌트 기획 목적

- 일반적인 캘린더의 기능 구현
- 어느 정도의 모바일 환경 레이아웃 지원
- 브라우저 저장소를 사용하여 초기 설정 없이 사용

### 개발 주요 목표

- 월간, 주간, 일간 데이터 C, R, U, D 기능
- 백업 혹은 활용용 데이터 export 기능 및 데이터 import 기능
- 사용자 편의 기능 구현 (정기적인 일정 등록, 기간으로 등록하기 등)
- npm 배포

### 컴포넌트 구성

![월간 캘린더](https://user-images.githubusercontent.com/32836490/214499795-670f6d7d-c05f-490d-9182-15f4380864fe.png)


월간 캘린더

![주간 캘린더](https://user-images.githubusercontent.com/32836490/214499896-480a4264-2ee6-416a-bb00-58c98c3f17fc.png)

주간 캘린더

![일간 캘린더](https://user-images.githubusercontent.com/32836490/214500026-4751bd04-5f24-454b-8809-541d81a8bb9c.png)

일간 캘린더

![레이아웃 구성도](https://user-images.githubusercontent.com/32836490/214499965-9496d24d-0938-4d54-a7ac-c21c91386750.png)


레이아웃 구성도

### 구현 방법

- Date 객체와 제공되는 함수들, 적절한 논리적 계산을 활용하여 월간, 주간의 날짜를 계산
- ref, click, model 등 각종 vue 디렉티브를 적절히 사용하여 C, R, U, D 기능 및 사용자 경험 제공
- 데이터베이스를 구성하여 사용하지 않고 localStorage 사용하여 데이터를 구성 및 적절한 기능을 하도록 구현
- 적절한 레이아웃을 가지도록 css를 활용하여 구현

### 추가 개발 로드맵

- 거의 모든 캘린더에 있는 정기적 이벤트 추가하기 기능
- 기간을 정해 등록을 하고 ui적으로 이어지는 일정이라는 것을 표현
- 드래그 혹은 터치를 통한 캘린더 month, week, day 이동하기 기능

### 컴포넌트 데모 사이트

- 소스코드 : https://github.com/dnfwlxo11/vue-calendar.git
- 컴포넌트 배포 : [https://www.npmjs.com/package/daein-calendar](https://www.npmjs.com/package/daein-calendar)
- 데모사이트 : https://portfolio.daein.dev/vue-calendar
