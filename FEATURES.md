# 📚 기능 명세서: courseitda

## 1. 애플리케이션 개요
이 프로젝트는 사용자가 자신만의 코스를 생성하고, 탐색하며, 저장하고 관리할 수 있는 웹 애플리케이션입니다. Leaflet 기반의 지도 컴포넌트를 활용하여 장소 간의 경로를 시각화하며, 로컬 스토리지를 통해 사용자 데이터를 관리합니다. GitHub Pages 배포를 염두에 둔 환경 설정이 특징입니다.

## 2. 주요 모듈 및 화면 구성
애플리케이션은 크게 4가지 핵심 기능을 탭 형태로 제공하여 사용자 접근성을 높였습니다.
-   **코스 만들기 (CourseCreation)**
-   **코스 탐색 (CourseExplorer)**
-   **찜한 코스 (FavoriteCourses)**
-   **나의 보관함 (SavedCourses)**

## 3. 상세 기능 명세
### 3.1. 코스 만들기 (CourseCreation)
-   **목적**: 사용자가 방문하고 싶은 장소들을 직접 선택하고 조합하여 새로운 코스를 생성합니다.
-   **주요 기능**:
    -   **장소 검색 및 추가**: 사용자는 다양한 추천 장소 목록에서 장소를 검색하고, 원하는 장소를 코스에 추가할 수 있습니다.
    -   **코스 구성**:
        -   추가된 장소들의 순서를 드래그 앤 드롭으로 자유롭게 변경할 수 있습니다.
        -   원치 않는 장소는 코스에서 제외할 수 있습니다.
    -   **코스 정보 입력**:
        -   `제목`: 코스의 대표적인 이름을 입력합니다.
        -   `카테고리`: 데이트, 맛집, 관광, 워크숍, 기타 등 미리 정의된 카테고리 중 하나를 선택합니다.
        -   `메모`: 코스에 대한 자유로운 설명을 추가할 수 있습니다.
        -   `해시태그`: 코스를 설명하는 키워드를 `#` 형태로 추가할 수 있습니다. (여러 개 추가 가능)
    -   **코스 저장**: 완성된 코스를 "나의 보관함"에 저장합니다.
-   **UI 요소**:
    -   장소 검색 입력창 및 결과 목록
    -   드래그 앤 드롭 가능한 장소 목록
    -   코스 제목, 카테고리 선택, 메모, 해시태그 입력 필드
    -   저장 버튼

### 3.2. 코스 탐색 (CourseExplorer)
-   **목적**: 추천 코스 및 다른 사용자의 코스를 탐색하고, 관심 있는 코스를 찜하거나 자신의 보관함으로 가져옵니다.
-   **주요 기능**:
    -   **코스 목록**: 미리 정의된 추천 코스 목록을 표시합니다.
    -   **검색 및 필터**:
        -   `검색창`: 코스 이름, 포함된 장소명, 태그 등으로 코스를 검색할 수 있습니다.
        -   `카테고리 필터`: 데이트, 맛집 등 카테고리별로 코스를 필터링하여 볼 수 있습니다.
    -   **코스 정보 표시**: 각 코스 카드에는 코스 제목, 주요 장소, 카테고리, 태그, 활동 구성 비율 등의 상세 정보가 표시됩니다.
    -   **찜하기**: 마음에 드는 코스를 찜하여 "찜한 코스" 목록에 추가합니다. 찜 상태는 UI에 즉시 반영됩니다.
    -   **코스 복제**: 찜한 코스를 "나의 보관함"에 새로운 코스로 복제하여 저장합니다. 이때 원본 코스의 정보(제목, 장소, 태그 등)를 그대로 가져오며, 새로운 ID가 부여됩니다.
-   **UI 요소**:
    -   코스 검색 입력 필드
    -   카테고리 필터 뱃지 그룹
    -   개별 코스 카드 (제목, 장소, 카테고리, 태그, 찜 버튼, 복제 버튼 포함)

### 3.3. 찜한 코스 (FavoriteCourses)
-   **목적**: 사용자가 "코스 탐색"에서 찜한 코스들을 한눈에 모아보고 관리합니다.
-   **주요 기능**:
    -   **찜 목록 표시**: 사용자가 찜한 모든 코스들이 카드 형태로 나열됩니다.
    -   **찜 해제**: 찜한 코스를 목록에서 제거할 수 있습니다.
    -   **코스 복제**: 찜한 코스를 "나의 보관함"에 복제하여 저장할 수 있습니다.
    -   **코스 상세 정보**: 각 코스 카드에는 찜한 날짜, 카테고리, 활동 구성, 개인 메모(존재하는 경우), 태그 등의 정보가 표시됩니다.
-   **UI 요소**:
    -   찜한 코스 카드 (제목, 찜 해제 버튼, 복제 버튼 등)
    -   개인 메모 및 태그 표시 영역

### 3.4. 나의 보관함 (SavedCourses)
-   **목적**: 사용자가 생성, 복제, 또는 완주한 모든 코스들을 보관하고 상세 관리합니다.
-   **주요 기능**:
    -   **저장 코스 목록**: 사용자의 모든 저장 코스들을 카드 형태로 표시합니다.
    -   **코스 삭제**: 원치 않는 코스를 보관함에서 영구적으로 삭제할 수 있습니다.
    -   **코스 공유**: 코스 정보를 텍스트로 정리하여 클립보드에 복사할 수 있는 기능을 제공합니다. 복사된 텍스트는 메신저나 SNS에 바로 붙여넣기 편리하도록 구성됩니다.
    -   **해시태그 관리**:
        -   `해시태그 추가`: 각 코스 카드 내에 해시태그 입력 필드와 '추가' 버튼이 제공됩니다.
            -   사용자는 입력 필드에 해시태그를 입력하고 `Enter` 키를 누르거나 '추가' 버튼을 클릭하여 해당 코스에 태그를 추가할 수 있습니다.
            -   동일한 태그는 중복으로 추가되지 않습니다.
            -   새롭게 추가된 태그는 해당 코스의 태그 목록에 즉시 반영되며, 로컬 스토리지에 저장되어 영구적으로 유지됩니다.
        -   `태그 표시`: 코스에 추가된 모든 태그는 Badge 형태로 시각적으로 표시됩니다.
    -   **코스 재탐방**: 저장된 코스를 선택하여 "코스 만들기" 화면으로 가져와 다시 탐방(내비게이션 모드 시작)할 수 있습니다.
-   **UI 요소**:
    -   저장 코스 카드 (제목, 생성일, 카테고리, 탐방 경로, 메모, 통계, 액션 버튼 포함)
    -   `해시태그 입력 필드` 및 `추가 버튼` (각 코스 카드 내)
    -   `Badge` 형태의 태그 목록

### 3.5. 지도 및 경로 안내 (MapComponent)
-   **목적**: 코스의 장소들과 경로를 시각적으로 보여주고, 내비게이션 모드에서 현재 위치 및 경로 이탈 시 재경로를 안내(목업)합니다.
-   **주요 기능**:
    -   **장소 마커**: 코스에 포함된 각 장소의 위도/경도 정보를 바탕으로 지도에 마커를 표시합니다.
    -   **경로 폴리라인**: 장소들 간의 이동 경로를 지도에 선(polyline)으로 연결하여 시각화합니다.
    -   **현재 위치 표시**: 사용자의 현재 위치를 나타내는 특별한 마커를 표시합니다.
    -   **경로 이탈 시뮬레이션**: (프로토타입 범위) 경로 이탈 시 가상의 재경로 안내 로직을 실행합니다.
-   **UI 요소**:
    -   Leaflet 기반 지도 컨테이너
    -   다양한 색상의 장소 마커 및 현재 위치 마커
    -   경로를 나타내는 폴리라인

## 4. 공통 인프라 및 기술 스택

### 4.1. 라우팅 및 페이지 전환
-   **React Router DOM**: SPA (Single Page Application)의 효율적인 라우팅을 위해 사용됩니다.
-   **404 페이지**: 정의되지 않은 URL로 접근 시 사용자에게 "404 Not Found" 페이지를 표시하여 안내합니다.
### 4.2. 빌드 및 배포 환경 설정
-   **GitHub Pages 배포 지원**:
    - 배포 스크립트가 정의되어 있어 GitHub Pages로의 원활한 배포를 지원합니다.
    - 로컬 개발 환경과 배포 환경(GitHub Pages) 모두에서 라우팅이 정상적으로 동작하도록 동적으로 경로를 지정합니다.
### 4.3. UI 프레임워크 및 스타일링
-   접근성과 재사용성을 고려한 컴포넌트 라이브러리로, 프로젝트의 UI 일관성을 유지합니다.
-   **반응형 디자인**: 다양한 화면 크기(모바일, 태블릿, 데스크톱)에서 최적화된 사용자 경험을 제공합니다.

### 4.4. 데이터 저장 및 관리
-   **Web Storage (localStorage)**: 모든 코스 정보(생성된 코스, 찜한 코스, 태그, 메모 등)는 사용자의 브라우저 로컬 스토리지에 저장됩니다. 이를 통해 페이지 새로고침이나 브라우저 재시작 후에도 데이터가 유지됩니다.

### 4.5. 기타 편의 기능
-   **Toast 알림**: 사용자 동작(예: 코스 삭제, 찜하기, 클립보드 복사 등)에 대한 즉각적인 시각적 피드백을 제공하여 사용자 경험을 향상시킵니다.
-   **아이콘**: 다양한 기능에 직관적인 아이콘을 사용하여 UI 이해도를 높입니다.
-   **폰트**: 가독성이 높은 폰트를 사용하여 전체적인 디자인 품질을 높입니다.
## 5. 향후 확장 가능성
-   **실시간 지도 API 연동**: 현재 목업 데이터를 사용하는 Leaflet 지도를 Google Maps, Naver Maps, Kakao Maps 등 실제 지도 API와 연동하여 실시간 경로 탐색 및 위치 추적 기능을 구현합니다.
-   **사용자 인증 및 서버 연동**: 사용자 계정 시스템을 도입하고 백엔드 서버와 연동하여 코스 데이터를 중앙에서 관리하고, 사용자 간 코스 공유 기능을 강화합니다.
-   **SNS 연동 강화**: 직접적인 SNS 공유 기능 및 외부 공유 링크를 통한 코스 미리보기 페이지를 제공합니다.

---
## REAME.md 작성
- 로컬에서 실행하기 위한 방법을 안내합니다.
- GitHub Pages에 배포하기 위한 방법을 안내합니다.