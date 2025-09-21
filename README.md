# REST Client App

A lightweight Postman-like REST client built with **Next.js (App Router)** and **TypeScript**.  
The application allows users to send API requests, manage variables, view request history with analytics, and generate request code snippets.

## 🚀 Features

- 🔐 **Authentication** – Sign up, Sign in, Sign out (Firebase).
- 🌐 **REST Client** – send requests with method selector, headers, body editor, and view responses.
- 💻 **Code Generation** – export request as `cURL`, Fetch API, Node.js, Python, Java, C#, Go.
- 📝 **Variables** – define and reuse variables in requests (`{{variableName}}`).
- 📊 **History & Analytics** – track executed requests (method, URL, status, latency, sizes, timestamp).
- 🌍 **Internationalization (i18n)** – multiple languages supported.
- ⚡ **Error Handling** – user-friendly error messages.
- 🎨 **UI/UX** – sticky header.

## 🛠️ Tech Stack

- Next.js (App Router)
- Zustand
- i18n
- React-hook-form + Zod
- Material ui + Tailwind
- Prettier, Husky, Eslint
- Vitest + React Testing Library
- Firebase

## Getting Started

### 1. Clone repo

git clone https://github.com/<your-org>/rest-client-app.git
cd rest-client-app

### 2. Install dependencies

npm install

### 3. Environment variables

npm install
