# iDecide

EventBond is a full-stack college major and career recommendation app that allows students to browse universities, colleges, majors, and career paths. It provides a chatbot that collects the data from the student and use a machine learning model to recommend the best-suited majors for him. The advisor is able to register his own university and add it's colleges and majors and communicate with students.

---

## Features

- **Student Features:**
  - Browse and search for universities, colleges, and majors
  - Add universities to favorites
  - Chat with the chatbot and get college major recommendations based on his data
  - Chat with the advisor and ask for information about his university

- **Advisor Features:**
  - Manage his university (create, edit, delete, upload images)
  - Manage colleges, and majors (create, edit, delete)
  - Chat with students, giving information about the university
---

## Tech Stack

- **Frontend:** React (with TypeScript, Vite), Tailwind CSS
- **Backend:** NestJS (TypeScript), TypeORM, JWT Auth, REST API
- **Database:** PostgreSQL

---

## Project Structure

```
iDecide/         # Frontend (React + Vite)
iDecide-API/      # Backend (NestJS)
iDecide-AI/      # Chatbot API and Machine Learning Model
```

---

## Prerequisites

- Node.js (v16+ recommended)
- npm (v8+ recommended)
- PostgreSQL (v12+ recommended)

---

## Getting Started

### Note: The following instructions only contains the frontend setup, go to the iDecide-API for the backend setup instructions

### **Clone the Repository**

```bash
git clone https://github.com/iDecide-Org/iDecide.git
cd EventBond
```

### **Frontend Setup (`eventbond-client`)**

**Install dependencies:**
```bash
npm install
```

**Start the frontend:**
```bash
# For development
npm run dev

# For production build
npm run build
npm run preview
```

The frontend will typically run on [http://localhost:5173](http://localhost:5173)

---

### 5. **Access the App**

- **Frontend:** [http://localhost:5173](http://localhost:5173)

---