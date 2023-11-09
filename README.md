<h1>1. Estagram 소개</h1>이미지 바꿀 예정
<img width="1272" alt="Untitled" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/cb05ae65-1635-45a1-8a17-e1bb68ecdea7">

<h3>부트캠프에 참여한 학생들을 위한 커뮤니티 서비스</h3>
> 부트캠프에 참여하고 있는 사람들이 일상을 공유하고, 스터디•프로젝트 모집 혹은 참여할 수 있도록 서비스를 제공하는 커뮤니티 사이트      

<h1>2. 개발 환경</h1>

<h3>🛠주요 기술</h3>
Backend
```
- Django
- Ddjango-restframework
```

Frontend
```
- JavaScript
- Figma
- HTML5
```
CI/CD
```
- Docker
- Jenkins
- AWS EC2
- AWS S3
```
DB
```
- postgreSQL
```
<h3>💻서비스 아키텍처</h3>아키텍처 바꿀 예정
<img width="1272" alt="Untitled" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/462d060a-3642-4f03-b6ce-89ed16e60323">
<h3>📋ERD</h3> 수정 예정
<img width="1272" alt="Untitled" src="">
<h3>👩‍💼유저 플로우</h3> 수정 예정
<img width="1272" alt="Untitled" src="">   


<h1>3. 주요 기능</h1>
<h3>서비스 소개</h3> gif 전부 바꿀 예정

<h4>1. 회원가입 및 로그인</h4>
```
로그인, 회원가입을 통해 메인 화면으로 이동할 수 있습니다.
```
<img src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/1984d679-2231-4765-929b-97b72f430df9">

<h4>2. 스토리</h4>
```사람들이 올릴 수 있는 SNS로 일상 혹은 공부한 내용 등을 공유하는 페이지입니다.```
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/5e1eab75-fc86-4088-91be-f528ac24b192">

<h4>3. 스터디&프로젝트</h4>
```
해커톤, 프로젝트 등 팀원을 모집하거나, 스터디원 모집과 참가를 할 수 있습니다. 필요에 따라 기술 스택, 포지션 등 필터를 적용할 수 있으며 검색을 할 수 있습니다.
```
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/e09f0d9e-4d3d-4624-ae40-aa6a0ae0ab92">

<h4>4. 알람</h4>바꿀예정
```
자신의 게시글에 다른 사람이 댓글을 남기거나 좋아요 버튼을 누를 경우 알람이 표시됩니다.
```
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/44717e10-cde9-4808-87c6-71c1cc6123ac">

<h4>5. 프로필</h4>바꿀예정
```
닉네임, 프로필 사진을 변경할 수 있고, 자신의 스토리 게시글, 스터디&프로젝트 게시글들을 확인할 수 있습니다.
```
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/db967112-1691-41e3-a406-769ca29bb145">

<h4>6. 채팅</h4>바꿀예정
```
다른 사람들과 채팅을 나눌 수 있고, AI 챗봇을 통한 채팅도 가능합니다.
```
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/05e0e33b-2862-4cf1-8724-0e86b18e983b">

<h3>기술 특이점</h3>
1. openAI API 활용
2. WebSocket을 통한 실시간 알람
3. WebSocket을 통한 실시간 채팅

<h1>4. 설계 문서</h1>
<h3>Figma</h3>
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/3163e5ef-e510-4fc5-84b3-c961a9836905">

<h3>API 명세서</h3>
<img width="700" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/47171395-6ef0-4fce-a868-78b696c259b4">

<h1>4. 협업툴, 컨벤션</h1>
<h3>협업툴</h3>
```
- Notion
  - git
- Discode
- Figma
```   

<h3>컨벤션 및 브랜치 전략</h3> 수정 예정
```
## 브랜치 전략

크게 **3종류의 브랜치를 사용**합니다.

- **`main`**
    - **현재 제일 좋은 모델**로 합니다
    - 언제든지 즉시 **배포(Production)**가 가능한 상태여야 합니다.
- `**dev**`
    - feat에서 온 레포를 이전 버전과 합치는 과정입니다.
    - **실행 가능한 코드 단위**이어야 합니다.
    - dev 브랜치로 들어오는 **모든 코드는 리뷰를** 거치게 됩니다.
- **`feat`**
    - 기능 단위로 개발을 진행하는 브랜치입니다.
    - **브랜치 네이밍**은 아래 양식을 지켜주세요 🙏
        - `feat/{기능 이름}`
        - ex) feat/modeling, feat/eda, feat/preprocess
- **아래 순서와 같이** 작업이 진행됩니다.
    - **`feat` → PR(코드 리뷰) → `dev` → Testing → `main` → Production**
        - **`feat` → PR(코드 리뷰)  → `dev`**
            1. `feat` 에서 각 기능 개발을 수행합니다.
            2. 완성된 기능은 `dev` 로 PR 합니다.
            3. PR에 배정된 **코드 리뷰**가 완료되면, `dev`로 merge를 승인합니다.
        - **`dev` → Testing → `main` → Production**
            1. 배포할 준비가 완료되면 `dev` 에서 `main` 으로 PR 합니다.
            2. **Testing**을 수행하고 이상이 없으면, `main`로 merge를 승인합니다.
            3. 작업이 완료된 `main` 을 바탕으로 **Production**를 진행합니다.

## 컨벤션 가이드

작업을 진행할 때에는 아래와 같은 컨벤션을 지켜주세요 🙏

자세한 내용은 ‣ 참고해주세요.

- 커밋 할때 : **Commit Message** [[링크](https://github.com/EarthCodingLab/ECL-python-template/blob/master/.gitmessage)]
    
    [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)
    
    - 다음과 같은 메시지 양식을 지켜주세요. 🙏
    - `feat: {커밋메시지 title}`
    
    ```python
    
    #   ACTION  : Detail
    #   TASKS   : main / dev / feat - fix
    
    #   feat    : 기능 한 줄 설명 (새로운 기능, 새로운 브랜치 생성)
    #   예시) feat : 알림 읽음 처리 기능 추가
    
    #   fix     : 버그 수정 설명
    #   예시) fix : 스토리 댓글 기능 게시 버튼 작동
    
    #   style   : 스타일 (코드 형식, pythonic, 명칭 변경, 주석 추가 또는 수정 -> 동작에 영향 없음)
    #   예시) style : 알림 리스트 클래스 뷰 변수() 문구 변경
    
    #   docs    : 문서 (README 등 각종 Markdown만)
    #   예시) docs : readme 팀원 추가
     
    #   test    : 테스트 (테스트 코드 추가, 수정, 삭제 -> test 코드 외 동작에 변경 없음)
    #   예시) test : 알람기능 테스트 코드 추가
    
    #   chore   : 기타 변경사항 (빌드 스크립트 수정 등 MD 제외 모든 파일)
    #   예시) chore : gitignore redis 추가, chore : migrations 파일 추가
    ```
    
    ```json
    feat: add login form. (X)
    
    feat: add login form (O)
    ```
    
    ```python
    docs: fixed typo in README (X)
    docs: fix typo in README (O)
    
    feat: adds auth api (X)
    feat: add auth api (O)
    
    ```
    
- Request 요청 왔을 때 : **Pull Request** [[링크](https://github.com/EarthCodingLab/ECL-python-template/blob/master/.github/PULL_REQUEST_TEMPLATE.md?plain=1)]
    
    ```python
    pull request시 작성 가이드
    
    ## Description
    - model.py에 linear lr scheduler 추가
    - pytorch lightning 라이브러리의 lr_scheduler 사용
    - https://pytorch-lightning.readthedocs.io/en/stable/common/optimization.html
    <!-- Add a more detailed description of the changes if needed. -->
    
    ## Related Issue
    - issue #31
    <!-- If your PR refers to a related issue, link it here. -->
    ```
    
- **PR리뷰**&**Issue** [[링크](https://github.com/EarthCodingLab/ECL-python-template/tree/master/.github/ISSUE_TEMPLATE)]
    - 새로운 dev가 나왔을 때 같이 리뷰를 해본다.
    
     ⇒ 해결하지 못한 오류나 의문이 있을 때는 issue에 남겨두기
    

## 파일이름 규칙 → 파일 명 통일해야 함

- 스네이크 케이스로 작성
    - carrot_bunny

## Series A 브랜치 전략

- `**main**`
    - `**dev**` 브랜치에서 최종 배포 테스트 작업 끝난 후 올리기
- **`dev`**
    - main 브랜치로 머지 전 배포가 정상적으로 되는 상태의 브랜치
    - feat/기능 브랜치에서 기능개발이 완료되면 `**dev**` 브랜치로 머지
- **`feat/기능`**
    - front : **`feat/f_기능`**
    - back : **`feat/b_기능`**
- 커밋 메세지
    
    ```json
    
    #   ACTION  : Detail
    #   TASKS   : main / dev / feat - fix
    
    #   feat    : 기능 한 줄 설명 (새로운 기능, 새로운 브랜치 생성)
    #   예시) feat : 알림 읽음 처리 기능 추가
    
    #   fix     : 버그 수정 설명
    #   예시) fix : 스토리 댓글 기능 게시 버튼 작동
    
    #   style   : 스타일 (코드 형식, pythonic, 명칭 변경, 주석 추가 또는 수정 -> 동작에 영향 없음)
    #   예시) style : 알림 리스트 클래스 뷰 변수() 문구 변경
    
    #   docs    : 문서 (README 등 각종 Markdown만)
    #   예시) docs : readme 팀원 추가
     
    #   test    : 테스트 (테스트 코드 추가, 수정, 삭제 -> test 코드 외 동작에 변경 없음)
    #   예시) test : 알람기능 테스트 코드 추가
    
    #   chore   : 기타 변경사항 (빌드 스크립트 수정 등 MD 제외 모든 파일)
    #   예시) chore : gitignore redis 추가, chore : migrations 파일 추가
    ```
```

<h1>5. 팀원 소개</h1>
<table>
  <tr>
    <td align="center" width="150px">
      <a href="" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/49267413?v=4" alt="문길호 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/Dani8175" target="_blank">
        <img src="" alt="전은태 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/minsuhaha" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/120551363?v=4" alt="하민수 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="" target="_blank">
        <img src="" alt="허승범 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/NewJiSoo" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/135521917?v=4" alt="신지수 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/ansoyun12" target="_blank">
        <img src="" alt="안소윤 프로필" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="" target="_blank">
        문길호
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Dani8175" target="_blank">
        전은태
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/minsuhaha" target="_blank">
        하민수
      </a>
    </td>
    <td align="center">
      <a href="" target="_blank">
        허승범
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/NewJiSoo" target="_blank">
        신지수
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ansoyun12" target="_blank">
        안소윤
      </a>
    </td>
  </tr>
</table>
