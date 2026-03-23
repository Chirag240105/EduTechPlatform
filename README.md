🎓 EduTech Platform – AI-Powered Learning System
```
A full-stack AI-powered learning platform built using the MERN Stack that transforms traditional study materials into interactive flashcards and intelligent learning experiences.

This project demonstrates scalable backend architecture, secure authentication, AI integration, and modern frontend design.
```
📌 Overview
```
EduTech Platform enables students to:

Upload learning documents

Automatically generate AI-powered flashcards

Review and track progress

Interact with intelligent AI explanations

The system integrates openRouter(llama 4 maverick) API with a secure MERN-based architecture to deliver structured, dynamic learning experiences.
```
🚀 Key Features
```
🔐 Authentication & Authorization

JWT-based secure authentication

Role-based access (Student / Teacher)

Password hashing using bcrypt

Protected API routes

Axios interceptors for token handling
```
📄 Document Processing
```
Upload learning documents

Structured content parsing

AI-powered content transformation

Document-based flashcard generation
```
🧠 AI Integration
```
Integrated with llama 4 Maverick

Automatic flashcard generation

Structured response validation

Error-handled AI parsing logic

```
🃏 Smart Flashcard System
```
Auto-generated Q&A flashcards

Review mode

Star / Unstar functionality

Learning progress tracking

Backend-controlled update logic
```
🎨 Modern Frontend Experience
```
Built with React + Vite

Tailwind CSS styling

GSAP-powered animations

Clean dashboard layout

Toast notifications

Responsive design
```
🛠 Tech Stack
```
Frontend

React.js

Vite

Tailwind CSS

GSAP

Axios

React Router

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcrypt

AI Integration
openRouter

llama 4 maverick
```
🏗 System Architecture
```
User → React Frontend → Express API → MongoDB
                          ↓
                    openRouter
Flow:

User uploads document

Backend processes content

Content sent to Gemini AI

AI returns structured flashcards

Flashcards stored in MongoDB

Frontend renders interactive review interface
```
📁 Project Structure
```
EduPlatform/
│
├── EduFrontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── Services/
│   │   ├── Context/
│   │   ├── Utils/
│   │   └── App.jsx
│
├── EduBackend/
│   ├── Config/
│   ├── Controllers/
│   ├── Middleware/
│   ├── Models/
│   ├── Routes/
│   ├── Utils/
│   └── server.js
│
└── README.md
```
⚙️ Environment Variables
```
Backend (.env)
PORT=3010
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_KEY=your_gemini_api_key
Frontend (.env)
VITE_APP_URL=http://localhost:5173
```
🧪 Local Setup
```
Clone Repository
git clone https://github.com/Chirag240105/edutech-platform.git
cd edutech-platform
Backend Setup
cd EduBackend
npm install
npm run dev
Frontend Setup
cd EduFrontend
npm install
npm run dev`
```
🔐 Security Implementation
```
Password hashing using bcrypt

JWT authentication with expiration

Token validation middleware

Role-based route protection

Environment variable isolation

CORS configuration for production
```
🌍 Deployment
```
Frontend: Vercel

Backend: Render

MongoDB Atlas (Cloud Database)

Ensure:

Environment variables are configured

CORS origin matches frontend domain

API base URL is updated in production
```
📈 Future Enhancements
```
Adaptive learning difficulty

Spaced repetition algorithm

AI quiz generation

Performance analytics dashboard

File storage integration (Cloudinary)

Admin management panel
```
👥 Contributors
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/jackstealer">
        <img src="https://github.com/jackstealer.png" width="100px;" alt="Atul"/><br />
        <sub><b>Atul</b></sub>
      </a><br />
      🤖 Machine Learning
    </td>
    <td align="center">
      <a href="https://github.com/arpitpandey0307">
        <img src="https://github.com/arpitpandey0307.png" width="100px;" alt="Arpit Pandey"/><br />
        <sub><b>Arpit Pandey</b></sub>
      </a><br />
      🤖 AI / ML
    </td>
    <td align="center">
      <a href="https://github.com/SinghCharanjeet11">
        <img src="https://github.com/SinghCharanjeet11.png" width="100px;" alt="Charanjeet Singh"/><br />
        <sub><b>Charanjeet Singh</b></sub>
      </a><br />
      🎨 Frontend
    </td>
  </tr>
</table>Stack Developer | AI Learning Systems Enthusiast
```
📜 License
```
This project is licensed under the MIT License.
```
