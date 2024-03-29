<h1 align="center">Estagram</h1>

<h1>목차</h1>

  1. [Estagram 소개](#1)
  2. [팀원 소개 및 역할](#2)
  3. [개발 기간 및 개발 환경](#3)
  4. [주요 기능](#4)
  5. [서비스 소개](#5)
  6. [설계 문서](#6)
  7. [협업툴, 컨벤션](#7)

<hr>
  
<h1 id="1">1. Estagram 소개</h1>
<p align="center"><img src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/862d5f47-8aae-4c18-8f7b-e5cdf11cd22e"></p>
<h3>부트캠프에 참여한 학생들을 위한 커뮤니티 서비스</h3>

> 부트캠프에 참여하고 있는 사람들이 일상을 공유하고, 스터디•프로젝트 모집 혹은 참여할 수 있도록 서비스를 제공하는 커뮤니티 사이트

<br /><br />

<h1 id="2">2. 팀원 소개 및 역할</h1>
<table>
  <tr>
    <td align="center" width="150px">
      <a href="https://github.com/wjsdlsghk12" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/77328701?v=4" alt="문길호 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/Dani8175" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/137133486?v=4" alt="전은태 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/minsuhaha" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/105342203?v=4" alt="하민수 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/18063935?v=4" alt="허승범 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/NewJiSoo" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/135521917?v=4" alt="신지수 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/ansoyun12" target="_blank">
        <img src="https://avatars.githubusercontent.com/u/137133387?v=4" alt="안소윤 프로필" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/wjsdlsghk12" target="_blank">
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

### 역할분담
#### 1차 개발
<p align="center"><img src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/cfe8904b-9aca-4760-9e12-91aa9278e813" width="800"></p>

#### 2차 개발
<p align="center"><img src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/d9c951f0-04ec-470a-a3c6-62623f9d64cb" width="800"></p>
<br /><br />

<h1 id="3">3. 개발 기간 및 개발 환경</h1>
<h2>개발 기간</h2>

<strong>1️⃣ 1차 개발 : 23.10.17~23.11.2</strong>

* <strong>유저</strong> : 로그인/회원가입, 프로필 관리, 회원 검색, 실시간 알람
* <strong>스토리 페이지</strong> : 게시글 CRUD, 스토리 게시글 보기
* <strong>스터디 페이지</strong> : 게시글 CRUD, 필터 적용 및 검색
* <strong>채팅 페이지</strong> : 1:1 채팅, AI 챗봇
<p align="center"><img src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/e4af4840-fcb7-4df5-8829-c60754dc821f" width="700"></p>


<strong>2️⃣ 2차 개발 : 23.11.17~</strong>

* <strong>관리자 페이지</strong> : 회원 가입 승인 및 정보 관리
* <strong>팀 페이지</strong> : 팀 생성, 팀원 추가 및 삭제
* <strong>알람</strong> : 팀, 채팅 관련 알람기능 추가 생성
* <strong>오류 수정</strong>
  * 아이디별로 프로필 페이지가 적용되지 않았던 오류 해결
  * 프로필 페이지 피드, 스터디/프로젝트 클릭 시 작동하지 않는 오류 해결
  * 채팅
    - 본인 프로필에서 채팅버튼 클릭 할 때 본인 채팅방으로 정상 접속되도록 수정
    - 이미 해당 유저와의 채팅방이 존재한다면 새로 생성되지 않도록 설정
    - 본인과의 채팅방은 생성되지 않도록 설정
    - 현재 들어가있지 않은 채팅방 상대로부터 채팅이 올때 현재 들어가있는 채팅방으로 채팅이 오는 버그 문제 해결
    - 다른 유저의 프로필에서 채팅버튼을 클릭 했을 때 바로 해당 유저와의 채팅방으로 넘어가도록 설정
<p align="center"><img src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/6a10239c-a2c7-41c0-890a-ad9e4e7babaf" width="700"></p>
<br />
<br />

<h2>개발 환경</h2>
<h3> 🛠주요 기술</h3>
<h4>Backend</h4>

```
- Django
- Django-restframework
- Websocket
- Channels
```
<h4>Frontend</h4>

```
- JavaScript
- Figma
- HTML5
```

<h4>CI/CD</h4>

```
- Docker
- AWS EC2
```

<h4>DB</h4>

```
- AWS S3
- postgreSQL
- Redis
```

<h4>AI</h4>

```
- OpenAI API
```
<br />

<h3>💻서비스 아키텍처</h3>
<img width="1272" alt="Untitled" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/137133486/a7641045-7383-46f1-8dc1-8bee298e0a37">
<h3>📋ERD</h3>
<img width="1272" alt="Untitled" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/137133486/30cc277a-d7af-4476-8d82-b3f8a9d08067">
<h3>👩‍💼유저 플로우</h3>
<img width="1272" alt="Untitled" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/3c6c0578-0363-4bb7-98f8-aeb57b2f7e5a">   


<br />


<h1 id="4">4. 주요 기능</h1>

### User

#### 1. Custom Authentication

* 이 프로젝트에서는 Django의 기본 권한 클래스 대신 JWT 토큰을 활용한 사용자 정의 권한 클래스를 구현하였습니다.

##### permissions.py

```python
from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.tokens import AccessToken
from .models import UserProfile

class IsTokenValid(BasePermission):
    """
    사용자의 JWT 토큰이 유효한지 확인하는 권한 클래스.
    """
    def has_permission(self, request, view):
        try:
            token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
            access_token = AccessToken(token)
            user = access_token.payload.get('user_id')
            return user is not None
        except Exception as e:
            return False

class IsAdminValid(BasePermission):
    """
    사용자가 관리자인지 확인하는 권한 클래스.
    """
    def has_permission(self, request, view):
        try:
            token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
            access_token = AccessToken(token)
            user_id = access_token.payload.get('user_id')
            user = UserProfile.objects.get(pk=user_id)
            
            return user.is_active and user.is_admin
        except Exception as e:
            return False
```
</br>

#### 2. JWT Token-Based User Authentication

* 장고 기본 `request.user` 대신, JWT 토큰을 사용하여 현재 로그인한 사용자가 데이터베이스에 존재하는지 확인하는 사용자 정의 함수를 구현하였습니다. 이는 표준 Django 유저 모델 대신 장고 기본 모델을 상속받아 사용자 정의 모델을 사용하는 경우 사용.

##### utils.py

```python
from rest_framework_simplejwt.tokens import AccessToken
from .models import UserProfile
from rest_framework.response import Response
from rest_framework import status

def get_user_from_token(request):
    """
    JWT 토큰을 사용하여 현재 로그인한 사용자의 정보를 확인하는 함수.
    """
    # JWT 토큰에서 사용자 정보 추출
    token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
    access_token = AccessToken(token)
    user_id = access_token.payload['user_id']

    # 데이터베이스에서 사용자 정보 확인
    try:
        user = UserProfile.objects.get(id=user_id)
        return user
    except UserProfile.DoesNotExist:
        return Response({'detail': '사용자를 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
```

#### 3. 검색기능
</br>

### Admin
    1. 회원관리
    2. 게시글 관리

### Team
    1. 팀 멤버 관리
    2. 팀 관리
    3. 팀 수정

### Study & Project
    1. CRUD
    2. 팀 관리
    3. 댓글 및 좋아요 기능
    4. 검색기능
    5. 필터기능

### Story
    1. CRUD
    2. 댓글 및 좋아요 기능

### Chat
    1. 챗봇 채팅
    2. 1대1 채팅

### Alarm
    1. 실시간 알람 (모달 구현)
       1-1. 팀 관련 알람
       1-2. 스터디 및 프로젝트 알람
       1-3. 스토리 알람
       1-4. 댓글 및 좋아요 알람
       1-5. 채팅 알람

<h1 id="5">5. 서비스 소개</h1>

<h3>1. 회원가입 및 로그인</h3>

```
로그인, 회원가입을 통해 메인 화면으로 이동할 수 있습니다.
```
<img src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/1984d679-2231-4765-929b-97b72f430df9">

<h3>2. 스토리</h3>

```
사람들이 올릴 수 있는 SNS로 일상 혹은 공부한 내용 등을 공유하는 페이지입니다.
```
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/1c26366b-cec3-4b56-8b74-c11ae431e45a">
<p align="center">
  <img width="500" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/23128bd5-ab2a-42f3-9a52-b583fc24e314">
  <img width="500" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/b9abade0-2f04-4c17-9e9d-33e2094bbbfe">
</p>



<h3>3. 스터디&프로젝트</h3>

```
해커톤, 프로젝트 등 팀원을 모집하거나, 스터디원 모집과 참가를 할 수 있습니다.
필요에 따라 기술 스택, 포지션 등 필터를 적용할 수 있으며 검색을 할 수 있습니다.
```
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/b9281acb-12a5-45cf-9af9-32ed08a37d76">
<p align="center">
  <img width="500" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/fc08bae8-63f6-494d-bcda-ac6fd3310c2f">
  <img width="500" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/890c49de-7a2e-4c60-884f-6e9435efa574">
</p>

<h3>4. 알람</h3>

```
자신의 게시글에 다른 사람이 댓글을 남기거나 좋아요 버튼을 누를 경우 알람이 표시됩니다.
```
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/1c1ffedd-57ad-4324-8822-e05fd9fdb1a3">

<h3>5. 프로필</h3>

```
닉네임, 프로필 사진을 변경할 수 있고, 자신의 스토리 게시글, 스터디&프로젝트 게시글들을 확인할 수 있습니다.
```
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/952f9ca9-6023-4964-80e2-7cef0256dcc1">

<h3>6. 채팅</h3>

```
다른 사람들과 채팅을 나눌 수 있고, AI 챗봇을 통한 채팅도 가능합니다.
```
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/8225b00f-8c8b-416d-a668-7ef0b65323ee">
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/e4b9ca76-bff1-4710-a63e-c5287c92c8df"><br/><br/>

<h3>7. 팀</h3>

```
팀원을 모집하고 팀 멤버를 관리할 수 있습니다.
```
gif 넣기!!!

<h3>8. 회원관리</h3>

```
admin 페이지에서 회원 목록과 회원 정보를 수정할 수 있습니다.
```
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/c194f5f4-df9d-40d2-a3d8-79436faeb724">
<br/><br/>



<h1 id="6">6. 설계 문서</h1>

<h3>🎨Figma</h3>
<h4>1️⃣ 1차 개발 </h4>
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/3163e5ef-e510-4fc5-84b3-c961a9836905">
</br>

<h4>2️⃣ 2차 개발 </h4>
<img width="1272" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/105342203/1d67a7c4-ee49-46a8-9e7a-a4c1f0e47f58">
</br>

<h3>📑API 명세서</h3>
<p>
  <img width="450" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/d79f2341-8311-4fa6-b7bc-2d75aca9e403">
  <img width="450" src="https://github.com/Series-A-oreumi/Series_a_FP/assets/135521917/09434bc6-7fc2-4dc2-a3fd-7cd87f5b5761">
</p>



<h1 id="7">7. 협업툴, 컨벤션</h1> 

<h3>🗣협업툴</h3>

```
- Notion
- git
- Discord
- Jira
- Figma
```   

<h3>❗브랜치 전략</h3>

크게 **3가지 종류의 브랜치를 사용**합니다.

- **`main`**
    - **현재 제일 좋은 모델**로 합니다
    - 언제든지 즉시 배포(Production)가 가능한 상태여야 합니다.

- **`dev`**
    - feat에서 온 레포를 이전 버전과 합치는 과정입니다.
    - **실행 가능한 코드 단위**이어야 합니다.
    - dev 브랜치로 들어오는 **모든 코드는 리뷰를** 거치게 됩니다.

- **`feat`**
    - 기능 단위로 개발을 진행하는 브랜치입니다.
    - **브랜치 네이밍**은 아래 양식을 지켜주세요 🙏
        - `feat/{기능 이름}`
        - ex) feat/modeling, feat/eda, feat/preprocess
</br>

<h3>❗커밋 컨벤션</h3>

- 다음과 같은 메시지 양식을 지켜주세요.
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
