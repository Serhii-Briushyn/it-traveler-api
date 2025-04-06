# 🌍 It-Traveler API

Backend API for the **It-Traveler** project — a location-based marker platform allowing users to create and manage geospatial markers with image upload support.

---

## 🚀 Features

- 🌐 REST API powered by [Routing-Controllers](https://github.com/typestack/routing-controllers)
- 📦 File uploads with Cloudinary integration (via `multer`)
- 🧭 GeoJSON marker support with MongoDB (`geometry: Point`)
- 🔐 Secure authentication using JWT (via access/refresh sessions)
- 🧾 Full request validation with `class-validator` + `class-transformer`
- 📁 Clean architecture with feature-based modularity
- 🪝 Built-in request/response logging and error handling

---

## 📁 Project Structure

```
src/
├── app/                # Controllers, DTOs, services by feature (auth, markers)
│   ├── auth/
│   └── markers/
├── domain/             # Aggregated controllers for Routing-Controllers
├── infra/              # Infrastructure layer (app init, security, DB)
├── middlewares/        # Custom middlewares (logger, error handlers, multer)
├── models/             # Mongoose models
├── shared/             # Shared helpers like ApiResponse, ApiError
├── types/              # Global types
├── utils/              # Reusable utility functions (cloudinary, etc)
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Serhii-Briushyn/it-traveler-api.git
cd it-traveler-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create `.env` from `.env.example` and set:

```
PORT=3000
MONGODB_USER=your_db_user
MONGODB_PASSWORD=your_db_pass
MONGODB_URL=cluster.mongodb.net
MONGODB_DB=it-traveler
JWT_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the app

```bash
npm run dev
```

---

## 🛠 Technologies Used

- **Node.js**, **TypeScript**
- **Express.js**, **Routing-Controllers**
- **MongoDB** with **Mongoose**
- **JWT authentication** with **jsonwebtoken**, **bcryptjs**
- **Multer** + **Cloudinary** for image upload
- **class-validator** + **class-transformer** for request validation
- **dotenv** for env config
- **ts-node**, **tsconfig-paths**, **nodemon** for development
- **Custom ApiError / ApiResponse** system for consistent error handling
- **depcheck**, **eslint**, **typescript-eslint** for code quality and maintenance

---

## ✅ API Overview

### 🔐 Auth

| Method | Endpoint             | Description                   |
| ------ | -------------------- | ----------------------------- |
| `POST` | `/api/auth/register` | Register new user             |
| `POST` | `/api/auth/login`    | Login user and create session |
| `POST` | `/api/auth/refresh`  | Refresh access token          |
| `POST` | `/api/auth/logout`   | Logout and delete session     |
| `GET`  | `/api/auth/me`       | Get current user profile      |

### 📍 Markers

| Method   | Endpoint           | Description              |
| -------- | ------------------ | ------------------------ |
| `GET`    | `/api/markers`     | Get all user markers     |
| `POST`   | `/api/markers`     | Create new marker (file) |
| `PUT`    | `/api/markers/:id` | Update existing marker   |
| `DELETE` | `/api/markers/:id` | Delete marker by ID      |

> 🧾 [View Full Swagger Spec](https://it-traveler-api.onrender.com/api-docs)

---

## 🧪 Testing

✅ All endpoints tested manually using Postman.

---

## 🧑‍💻 Author

Created with ❤️ by **Serhii Briushyn**

---

## 📜 License

MIT
