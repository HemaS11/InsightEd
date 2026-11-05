# InsightEd – AI-Powered Course Feedback Analyzer

<div align="center">

![InsightEd Banner](https://img.shields.io/badge/InsightEd-AI%20Powered%20Academic%20Feedback%20Analyzer-%235B4632?style=for-the-badge&logo=react&logoColor=white)

</div>

<p align="center">
  <img src="public/InsightEd Academic Growth Logo.png" alt="InsightEd Logo" width="180" />
</p>

<p align="center">
  <strong>Transforming student voices into smarter academic decisions.</strong>
</p>

---

## Overview

InsightEd is an AI-powered academic feedback analysis platform designed to collect and interpret student feedback, evaluate course performance, and generate actionable insights to improve teaching quality, course delivery, and overall student satisfaction.

The system focuses on bringing clarity to academic decision-making by combining student sentiment analysis, course analytics, and a polished dashboard experience for administrators and educators.

---

## Project Objectives

- Collect structured course feedback from students.
- Analyze teaching quality, course satisfaction, and sentiment trends.
- Visualize academic performance in a clear and actionable way.
- Support informed decision-making for faculty and academic teams.
- Deliver a premium, responsive frontend experience for dashboard-driven analytics.
- Promote student engagement through a user-friendly feedback workflow.

---

## Team Role

### Member 1 – Frontend Development & Analytics

I contributed primarily to the frontend architecture, UI design, analytics dashboard, and the feedback experience of the platform.

My responsibilities included:

1. Frontend Development
   - Built the user interface using React, TypeScript and Vite.
   - Designed a responsive and premium dashboard layout.
   - Created reusable UI components for the analytics experience.
   - Implemented sidebar navigation and top navigation.
   - Integrated the official InsightEd brand logo into the application.

2. Dashboard Development
   - Developed stat cards for total feedback, average rating, sentiment and course review summaries.
   - Displayed reporting metrics in a professional academic dashboard.
   - Integrated course-performance visualizations for academic review.
   - Added interactive charts using Recharts.
   - Designed academic overview and analytics sections for institutional insight.

3. Feedback Interface
   - Built the student feedback submission flow.
   - Implemented semester selection from Semester 1 to Semester 8.
   - Created semester-specific subject dropdowns.
   - Ensured subject lists are unique and do not repeat across semesters.
   - Added star-rating input, comment sections and anonymous feedback options.
   - Implemented validation logic and submission confirmation states.

4. UI/UX Design
   - Used Framer Motion for smooth transitions and subtle interaction feedback.
   - Designed a premium academic SaaS aesthetic using a warm earthy palette.
   - Applied consistent spacing, typography and hierarchy across the app.
   - Used Lucide React icons to improve interface clarity and consistency.

> This section reflects the frontend and analytics responsibilities carried out by Member 1. Backend and AI/ML responsibilities are not claimed here unless they were implemented and verified.

---

## Features Developed by Member 1

- Premium responsive dashboard layout
- Sidebar navigation system
- Top navigation and workspace header
- Reusable stat cards and analytics panels
- Sentiment distribution visualizations
- Course performance charts
- Feedback activity tracking charts
- Student feedback form with validation
- Semester-wise subject selection
- Subject mapping across eight academic semesters
- Anonymous submission support
- Motion enhancements and premium UI polish

---

## Technology Stack

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF7F50?style=for-the-badge&logo=bar-chart&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-React-5B4632?style=for-the-badge&logo=lucide&logoColor=white)

</div>

### Core Stack
- React
- TypeScript
- Vite
- CSS3
- Framer Motion
- Recharts
- Lucide React

---

## Design Palette

The interface uses a premium academic palette designed to reflect an intelligent and modern higher-education platform.

- Mocha Brown: `#5B4632`
- Champagne: `#F4D9A0`
- Burnt Orange: `#C8792C`
- Warm Ivory: `#FFF9F0`
- White: `#FFFFFF`

---

## Project Structure

```text
insighted/
├── public/
│   └── InsightEd Academic Growth Logo.png
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── StatCard.tsx
│   ├── data/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Feedback.tsx
│   │   ├── Recommendations.tsx
│   │   ├── Reports.tsx
│   │   ├── Sentiment.tsx
│   │   └── TopicInsights.tsx
│   └── services/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── package-lock.json
```

---

## Installation and Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/insighted.git
cd insighted
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the project in the browser:

```bash
http://localhost:5173/
```

---

## Running the Frontend Locally

Use the following commands to run the project on your machine:

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

## Screenshots

> Add screenshots of the dashboard, feedback form, analytics charts and sidebar branding here as the project evolves.

### Dashboard Preview

```md
![Dashboard Screenshot](./assets/dashboard-preview.png)
```

### Feedback Form Preview

```md
![Feedback Form Screenshot](./assets/feedback-preview.png)
```

### Analytics Overview

```md
![Analytics Screenshot](./assets/analytics-preview.png)
```

---

## Future Improvements

- Integrate backend APIs for real feedback persistence.
- Add AI-powered summarization of feedback comments.
- Implement sentiment classification using NLP models.
- Add authentication and role-based access control.
- Expand analytics with exportable reports and dashboards.
- Add admin-level filters for semester, faculty and department insights.
- Enhance recommendation generation using academic performance trends.

---

## Team Contribution

### Member 1 – Frontend Development & Analytics
- Built the user-facing dashboard and analytics experience.
- Developed the feedback form and semester-based subject workflow.
- Designed the premium academic interface and branding system.
- Implemented responsive navigation and smooth animations.
- Contributed to the core frontend experience of the InsightEd platform.

### Other Team Members
- Backend/API development and data handling
- AI/ML-based sentiment and recommendation logic
- Data collection and model integration
- Testing, validation and deployment support

> This project is structured to clearly distinguish frontend contribution from backend and AI/ML responsibilities.

---

## Conclusion

InsightEd reflects a focused effort to create a student-centered academic analytics platform that combines usability, institutional insight, and a premium design language. As Member 1, my contribution centered on building a polished and functional frontend experience that supports feedback collection, analytics, and an intuitive academic dashboard.

---

## Contact / Portfolio

This project is suitable for academic submission, hackathon presentation, and GitHub portfolio showcase.

- Project: InsightEd
- Role: Member 1 – Frontend Development & Analytics
- Focus: React, TypeScript, UI/UX, analytics dashboard, course feedback interface

---

<p align="center">
  <strong>Built with passion for better academic experiences.</strong>
</p>

