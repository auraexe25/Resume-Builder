# AI Resume Builder
> A modern, intelligent full-stack web application designed to help users create, manage, and download professional, ATS-friendly resumes in minutes.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

---

## Features

* **Interactive Dashboard:** Seamlessly manage multiple resumes, track creation dates, and easily edit or delete existing ones.
* **Real-time Preview:** See your resume update instantly as you type out your experience, education, and skills.
* **Customizable Templates:** Choose from various professional layouts (e.g., Classic, Modern) and personalize them with custom accent colors.
* **AI-Powered Suggestions (Coming Soon):** Smart content generation to help you articulate your professional summary and experience bullet points.
* **Responsive Design:** A beautifully styled, mobile-friendly interface built with Tailwind CSS.

---

## Project Structure

```plaintext
Resume-Builder/
├── Client/       # React + Vite frontend application
└── Server/       # Node.js + Express backend
```

---

## Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, Lucide React, React Router DOM
* **Backend:** Node.js, Express.js, Mongoose
* **Database:** MongoDB Atlas

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

* Node.js (v16.0 or higher)
* npm or yarn
* A MongoDB Atlas cluster and connection string

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/auraexe25/Resume-Builder.git
cd Resume-Builder
```

---

**2. Server Setup (Backend)**

Open your **first terminal window** and navigate to the Server directory:

```bash
cd Server
npm install
```

Create a `.env` file inside the `Server` folder and add your database credentials:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0...
PORT=3000
```

Start the backend server:

```bash
npm run server
```

---

**3. Client Setup (Frontend)**

Open a **second, separate terminal window** and navigate to the Client directory:

```bash
cd Client
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Open your browser and visit [http://localhost:5173/](http://localhost:5173/) to view the app!

---

## Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [issues page](../../issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch:
```bash
git checkout -b feature/AmazingFeature
```
3. Commit your Changes:
```bash
git commit -m 'Add some AmazingFeature'
```
4. Push to the Branch:
```bash
git push origin feature/AmazingFeature
```
5. Open a Pull Request

---

## 📄 License
© 2026 Veena Sahu. All Rights Reserved.
This project is not open source. No part of this codebase may be copied, modified, distributed, or used without the express written permission of the author.
