# FeedFlow App 🌐

Frontend client for the **FeedFlow Social Media Platform** — a modern, responsive, and real-time social networking application built with **React, Vite, Redux Toolkit, Tailwind CSS, and Socket.IO**.

FeedFlow delivers a modern social media experience with real-time messaging, media sharing, reels, stories, notifications, and interactive user engagement.

---

# 🚀 Live Application

🔗 Frontend Live URL:  
https://feedflow-app-social-media-website.vercel.app/login

🔗 Backend API:  
https://feedflow-server-scoial-media-website.onrender.com

---

# ✨ Features

- 🔐 Authentication & Authorization
- 👤 User Profile System
- 📝 Create Text/Image/Video Posts
- 🎬 Reels Feature
- 📖 Stories System
- ❤️ Like & Comment Functionality
- 👥 Follow / Unfollow Users
- 💬 Real-Time Chat System
- 🟢 Online User Tracking
- 🔔 Real-Time Notifications
- 📱 Fully Responsive Design
- 🌙 Modern Dark UI
- ⚡ Fast Client-Side Routing
- ☁️ Cloud Media Integration
- 📦 State Management with Redux Toolkit
- 🔄 Real-Time Socket.IO Communication

---

# 🛠️ Tech Stack

## Frontend Framework
- React 19
- Vite

## Styling
- Tailwind CSS v4
- tw-animate-css
- shadcn/ui
- Geist Variable Font

## State Management
- Redux Toolkit
- React Redux

## Routing
- React Router DOM

## Real-Time Communication
- Socket.IO Client

## Utilities
- Axios
- clsx
- tailwind-merge
- react-hot-toast
- emoji-picker-react

## Icons
- lucide-react

---

# 📂 Project Structure

```bash
feedflow_app
│
├── public
│   ├── icon
│   ├── image
│   ├── Favicon.png
│   └── icons.svg
│
├── src
│   ├── assets
│   │   └── hero.png
│   │
│   ├── components
│   │   ├── ui
│   │   ├── AuthForm.jsx
│   │   ├── ChatInput.jsx
│   │   ├── CommentForm.jsx
│   │   ├── CommentSection.jsx
│   │   ├── CreateMedia.jsx
│   │   ├── Feed.jsx
│   │   ├── FollowButton.jsx
│   │   ├── LikeButton.jsx
│   │   ├── Media.jsx
│   │   ├── MediaIcon.jsx
│   │   ├── MessageSidebar.jsx
│   │   ├── Modal.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── PostCard.jsx
│   │   ├── ProfileImage.jsx
│   │   ├── ProfileViewer.jsx
│   │   ├── SaveButton.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Stories.jsx
│   │   └── SuggestedUser.jsx
│   │
│   ├── lib
│   │   ├── axios.js
│   │   ├── socket.js
│   │   ├── timeAgo.js
│   │   └── utils.js
│   │
│   ├── pages
│   │   ├── AccountEdit.jsx
│   │   ├── Explore.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Market.jsx
│   │   ├── Message.jsx
│   │   ├── Profile.jsx
│   │   ├── Reels.jsx
│   │   └── SuggestedUsersPage.jsx
│   │
│   ├── protectedRoute
│   │   └── ProtectedRoute.jsx
│   │
│   ├── redux
│   │   ├── slices
│   │   └── store.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── vercel.json
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd feedflow_app
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Create `.env` File

Create a `.env` file in the root directory.

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
```

Production Example:

```env
VITE_API_URL=https://feedflow-server-scoial-media-website.onrender.com/api/v1
VITE_SOCKET_URL=https://feedflow-server-scoial-media-website.onrender.com
```

---

# ▶️ Run Development Server

```bash
npm run dev
```

---

# 🏗️ Build Production

```bash
npm run build
```

---

# 👀 Preview Production Build

```bash
npm run preview
```

---

# 🧠 Application Features Overview

## 🔐 Authentication System

- Secure Login & Registration
- Protected Routes
- Persistent Authentication
- Cookie-Based Sessions

---

## 📝 Posts System

Users can:

- Create text posts
- Upload images
- Upload videos
- Like posts
- Comment on posts
- Delete their own posts
- View posts in modal layout

---

## 🎬 Reels Feature

- Short video reels
- Auto-play functionality
- Like & comment support
- Full-screen reel viewer

---

## 📖 Stories Feature

- Upload temporary stories
- Story viewer UI
- Media-based stories

---

## 💬 Real-Time Messaging

Built using Socket.IO.

### Features:
- Instant messaging
- Online user status
- Live updates
- Real-time communication

---

## 🔔 Notification System

Users receive notifications for:
- Likes
- Comments
- Follow requests
- Interactions

---

## 👤 Profile System

- Editable profile
- User bio
- Website links
- Education & Job Info
- Followers / Following
- Saved Posts

---

# ⚡ State Management

The application uses **Redux Toolkit** for scalable and maintainable state management.

### Redux Slices

- userSlices.js
- postSlice.js
- reelSlice.js
- storiesSlice.js
- messageSlice.js

---

# 🎨 UI & Design

FeedFlow focuses heavily on modern UI/UX principles.

### Design Features

- Dark Modern Theme
- Responsive Layout
- Animated Interactions
- Glassmorphism Effects
- Smooth Hover Effects
- Modal-Based Media Viewer

---

# 📡 API Integration

Axios is used for API communication.

### Features

- Centralized Axios Instance
- Credentials Support
- Clean API Structure
- Error Handling

---

# 🌐 Deployment

## Frontend
- Vercel

## Backend
- Render

---

# 📱 Responsive Design

The application is fully optimized for:

- Desktop
- Tablet
- Mobile Devices

---

# 🚀 Performance Optimizations

- Vite Fast Build System
- Lazy Rendering Techniques
- Optimized State Updates
- Reusable Components
- Efficient Socket Management

---

# 🔮 Future Improvements

- Video Calling
- Group Chat
- AI Feed Recommendation
- Push Notifications
- Post Scheduling
- Advanced Search
- Marketplace Features
- Admin Dashboard

---

# 👨‍💻 Developer

Developed by **Jakaria Ahmed**

A passionate Full Stack Developer focused on building scalable, modern, and user-friendly web applications.

---

# 📜 License

This project is licensed under the ISC License.

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

It helps support the project and motivates future improvements.

---
