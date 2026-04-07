# vibe-todo-backend

Node.js + MongoDB(Mongoose) 기반 Todo 백엔드입니다.

## 요구 사항

- Node.js 20+
- MongoDB Atlas 또는 로컬 MongoDB

## 설치

```bash
npm install
```

## 환경 변수

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 설정합니다.

```env
MONGODB_URI=your_mongodb_connection_string
```

## 실행

```bash
npm start
```

서버는 `http://localhost:5000` 에서 실행됩니다.

## API

### 헬스 체크

- `GET /health`

응답 예시:

```json
{ "ok": true }
```

### 할 일 생성

- `POST /todos`
- Body(JSON): `{ "title": "할 일 내용" }`

### 할 일 목록 조회

- `GET /todos`

### 할 일 수정

- `PATCH /todos/:id` 또는 `PUT /todos/:id`
- Body(JSON): `{ "title": "수정할 내용" }`

### 할 일 삭제

- `DELETE /todos/:id`

## 상태 코드

- `200` 성공 조회/수정
- `201` 생성 성공
- `204` 삭제 성공 (본문 없음)
- `400` 잘못된 요청/ID/JSON
- `404` 리소스 없음
- `500` 서버 오류

