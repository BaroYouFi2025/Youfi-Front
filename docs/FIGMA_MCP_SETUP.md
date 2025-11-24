# Figma MCP 서버 등록 가이드

Figma MCP(Model Context Protocol) 서버를 Cursor에 등록하여 Figma 디자인을 코드로 변환하고 디자인 정보를 활용할 수 있습니다.

## 1. Figma 데스크톱 앱에서 MCP 서버 활성화

### 사전 요구사항 확인

1. **Figma 데스크톱 애플리케이션 실행**
   - Figma Desktop 앱이 설치되어 있어야 합니다
   - 웹 버전이 아닌 데스크톱 앱을 사용해야 합니다
   - 최신 버전으로 업데이트되어 있는지 확인하세요

2. **플랜 및 팀 확인**
   - **유료 플랜 필요**: Professional, Organization, 또는 Enterprise 플랜의 Dev 또는 Full 시트 사용자여야 합니다
   - **팀 위치 확인**: 작업 중인 파일이 Professional 팀에 속해 있어야 합니다
     - `Drafts` 폴더나 `Starter` 팀에 있는 파일에서는 옵션이 나타나지 않을 수 있습니다

3. **Dev Mode 활성화 (필수!)**
   - **중요**: `Enable Dev Mode MCP Server` 옵션은 Dev Mode가 활성화된 상태에서만 나타납니다
   - Dev Mode 활성화 방법:
     - 단축키: `Shift + D`
     - 또는 상단 메뉴에서 `View` → `Switch to Dev Mode` 선택
   - Dev Mode가 활성화되면 상단에 "Dev Mode" 표시가 나타납니다

### MCP 서버 활성화

1. **Preferences 메뉴 열기**
   - **MacOS 주의**: 두 개의 Figma 메뉴가 있습니다
     - 상단 메뉴바의 `Figma` 메뉴가 아닌
     - **앱 창 내의 Figma 로고 메뉴**에서 `Preferences`를 선택해야 합니다
   - Windows/Linux: 상단 메뉴에서 `Figma` → `Preferences` 선택

2. **MCP 서버 옵션 찾기**
   - Preferences 창에서 `Enable Dev Mode MCP Server` 옵션을 찾습니다
   - 이 옵션을 활성화합니다
   - 활성화되면 로컬에서 MCP 서버가 `http://127.0.0.1:3845/mcp` 주소로 실행됩니다

## 2. Cursor에서 MCP 서버 등록

### 방법 1: Cursor 설정 UI를 통한 등록

1. **Cursor 설정 열기**
   - `CMD + ,` (Mac) 또는 `Ctrl + ,` (Windows/Linux)로 설정 열기
   - 또는 `Cursor` → `Settings` 메뉴 선택

2. **MCP 설정 찾기**
   - 설정 검색창에 "MCP" 또는 "Model Context Protocol" 검색
   - MCP 관련 설정 섹션으로 이동

3. **서버 추가**
   - "Add Server" 또는 "서버 추가" 버튼 클릭
   - 다음 정보 입력:
     - **서버 이름**: `Figma Dev Mode MCP` (또는 원하는 이름)
     - **타입**: `HTTP` 또는 `http`
     - **URL**: `http://127.0.0.1:3845/mcp`

### 방법 2: 설정 파일 직접 편집

1. **설정 파일 위치 확인**
   - Cursor의 MCP 설정 파일은 보통 다음 위치에 있습니다:
     - Mac: `~/Library/Application Support/Cursor/User/globalStorage/mcp.json`
     - Windows: `%APPDATA%\Cursor\User\globalStorage\mcp.json`
     - Linux: `~/.config/Cursor/User/globalStorage/mcp.json`

2. **설정 파일 편집**
   - `mcp.json` 파일을 열고 다음 내용 추가:

```json
{
  "servers": {
    "Figma Dev Mode MCP": {
      "type": "http",
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

   - 기존 서버가 있다면 `servers` 객체에 추가:

```json
{
  "servers": {
    "user-unityMCP": {
      // ... 기존 Unity MCP 설정 ...
    },
    "Figma Dev Mode MCP": {
      "type": "http",
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

3. **Cursor 재시작**
   - 설정 파일을 저장한 후 Cursor를 재시작하여 변경사항 적용

## 3. 연결 확인

1. **Figma 앱 실행 확인**
   - Figma 데스크톱 앱이 실행 중이고 MCP 서버가 활성화되어 있는지 확인

2. **Cursor에서 테스트**
   - Cursor의 AI 채팅에서 Figma 관련 질문을 해보거나
   - Figma 디자인 링크를 제공하여 디자인 정보를 가져올 수 있는지 테스트

## 4. 사용 예시

Figma MCP가 등록되면 다음과 같이 사용할 수 있습니다:

```
이 Figma 디자인을 React Native 컴포넌트로 변환해줘:
https://www.figma.com/design/abcdefghijklmnopqrstuvwxyz/helloworld?node-id=12345-1234567&m=dev
```

또는:

```
Figma에서 선택한 프레임의 디자인 정보를 가져와서 styled-components로 스타일을 작성해줘
```

## 5. 문제 해결

### MCP 서버에 연결할 수 없는 경우

1. **Figma 앱이 실행 중인지 확인**
   - Figma 데스크톱 앱이 실행되어 있어야 합니다
   - 웹 버전에서는 MCP 서버가 작동하지 않습니다

2. **포트 확인**
   - 기본 포트는 `3845`입니다
   - 다른 포트를 사용하는 경우 URL을 수정하세요

3. **방화벽 확인**
   - 로컬호스팅이 차단되지 않았는지 확인

4. **Cursor 재시작**
   - 설정 변경 후 Cursor를 완전히 재시작하세요

### "Enable Dev Mode MCP Server" 옵션이 보이지 않는 경우

이 문제는 가장 흔한 문제입니다. 다음 순서대로 확인하세요:

1. **Dev Mode 활성화 확인 (가장 중요!)**
   - `Enable Dev Mode MCP Server` 옵션은 **Dev Mode가 활성화된 상태에서만** 나타납니다
   - `Shift + D`를 눌러 Dev Mode를 활성화하세요
   - 또는 `View` → `Switch to Dev Mode` 선택
   - Dev Mode가 활성화되면 상단에 "Dev Mode" 표시가 보입니다
   - Dev Mode 활성화 후 Preferences를 다시 열어보세요

2. **플랜 및 팀 확인**
   - Professional, Organization, 또는 Enterprise 플랜의 Dev/Full 시트 사용자인지 확인
   - 무료 플랜(Starter)에서는 사용할 수 없습니다
   - 파일이 Professional 팀에 속해 있는지 확인 (Drafts 폴더가 아닌지 확인)

3. **메뉴 위치 확인 (MacOS)**
   - MacOS에서는 두 개의 Figma 메뉴가 있습니다
   - 상단 메뉴바의 `Figma` 메뉴가 아닌
   - **앱 창 내의 Figma 로고(왼쪽 상단)를 클릭**하여 메뉴를 열고 `Preferences`를 선택하세요

4. **Figma 버전 확인**
   - 최신 버전의 Figma 데스크톱 앱을 사용하고 있는지 확인
   - 오래된 버전에서는 MCP 서버 기능이 없을 수 있습니다
   - `Help` → `About Figma`에서 버전 확인
   - 필요시 Figma 앱을 업데이트하세요

5. **파일 위치 확인**
   - 현재 열려있는 파일이 Professional 팀에 속해 있는지 확인
   - Drafts 폴더나 Starter 팀의 파일에서는 옵션이 나타나지 않을 수 있습니다
   - Professional 팀의 파일을 열어서 다시 시도해보세요

6. **Figma 앱 재시작**
   - 위의 모든 사항을 확인한 후에도 옵션이 보이지 않으면
   - Figma 앱을 완전히 종료하고 다시 시작해보세요

## 참고 자료

- [Figma Dev Mode MCP Server 공식 문서](https://www.figma.com/developers/api#mcp)
- [Model Context Protocol 공식 문서](https://modelcontextprotocol.io/)

