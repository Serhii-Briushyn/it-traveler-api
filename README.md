# Project Architecture Overview

## 📂 Project Structure (src/)

```bash
src/
├── app/                # Application logic (feature-based)
│   ├── auth/           # Authentication module
│   │   ├── Auth.checkers.ts
│   │   ├── Auth.controller.ts
│   │   ├── Auth.dto.ts
│   │   ├── Auth.errors.ts
│   │   ├── Auth.service.ts
│   │   ├── Auth.types.ts
│   │   └── index.ts
│   ├── markers/         # Business logic for "markers"
│   │   ├── Marker.controller.ts
│   │   ├── Marker.dto.ts
│   │   ├── Marker.service.ts
│   │   └── Marker.types.ts
│   └── index.ts      # Aggregates feature controllers
│
├── domain/             # Entry point to app domain (aggregates controllers)
│   └── index.ts
│
├── helpers/            # Helper utilities
│   ├── ApiError.ts
│   └── ApiResponse.ts
│
├── infra/              # Infrastructure (Express app, DB init, etc)
│   ├── App.ts
│   ├── Tcp.ts
│   └── initMongoConnection.ts
│
├── middlewares/        # Express middlewares
│   ├── HTTPRequestLogger.ts
│   ├── HTTPResponseLogger.ts
│   └── index.ts
│
├── models/             # Mongoose schemas (database models)
│   ├── User/
│   │   └── User.model.ts
│   ├── Session/
│   │   └── Session.model.ts
│   ├── Marker/
│   │   └── Marker.model.ts
│   └── index.ts
│
├── types/              # Global TypeScript types
│   ├── services.ts
│   └── user.types.ts
│
├── utils/              # Utility functions (env, tokens, etc)
│   ├── env.ts
│   └── main.ts
```

---

## 🌎 Architectural Principles

- **Feature-based structure**: logic по модулям (`auth`, `places`, и т.д.)
- **Separation of Concerns**:
  - `app/` — бизнес-логика
  - `infra/` — инфраструктура
  - `models/` — доступ к БД (Mongoose)
  - `helpers/`, `utils/`, `types/` — вспомогательные слои
- **Routing-controllers**: удобный declarative routing
- **Middleware-driven logging**

---

## 💡 Основные паттерны

- `Service Layer` — логика в `*.service.ts`
- `DTO` + `class-validator` — валидация входных данных
- `Error Handling` — через `ApiError` + централизованную обработку
- `Session Auth` — через JWT + сессии в MongoDB

---

## 🏠 Пример запроса (Auth Flow)

```ts
POST /api/auth/login
-> AuthService.login()
-> Validates & checks user
-> Creates new session (MongoDB)
-> Returns accessToken + refreshToken
```

```ts
POST /api/auth/logout
-> @Authorized() + @CurrentUser()
-> AuthService.logout(user.id)
-> Deletes session from DB
```

---

## 🚀 Команды запуска

```bash
# Запуск проекта
npm run dev

# Production build
npm run build
```

---

## 🔧 Рекомендации по расширению

- Новая фича? — создавай в `app/{feature}` со следующими файлами:
  - `{Feature}.controller.ts`
  - `{Feature}.dto.ts`
  - `{Feature}.service.ts`
  - `{Feature}.types.ts`
- Если модель растёт — можешь разбить `User.model.ts` в папку `models/User/`
- Ошибки? — лучше выносить в `{Feature}.errors.ts`

---

Если хочешь — могу сгенерировать шаблон новой фичи под твой стиль (`npx create-feature user`).
