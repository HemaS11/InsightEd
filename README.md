# InsightEd

InsightEd is a role-aware academic intelligence platform for collecting student feedback, analyzing course sentiment, and presenting actionable reports for students, faculty, and administrators.

## Features

- Student feedback form with star ratings and written comments
- JWT-based authentication and role-based permissions
- Student-only feedback history and submission tracking
- Faculty/admin analytics for ratings, sentiment, course summaries, and trends
- Topic insights, recommendations, and CSV reports
- Admin user account management for faculty and student roles
- Existing design preserved with the warm academic dashboard styling

## Stack

- Frontend: React + TypeScript + Vite
- Backend: FastAPI + SQLAlchemy + SQLite
- Authentication: JWT + Bearer auth
- AI / sentiment: TextBlob-based sentiment analysis

## Project layout

```text
insighted/
├── Backend/
│   ├── auth.py
│   ├── create_admin.py
│   ├── create_test_users.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── schemas.py
│   ├── sentiment.py
│   └── feedbackiq.db
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── components/
│   ├── pages/
│   └── services/
├── .env.example
├── index.html
├── package.json
├── vite.config.ts
├── README.md
└── public/
```

## Environment setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Set a production-safe JWT secret before deployment:

```bash
JWT_SECRET_KEY=your-long-random-secret
```

For local development, the backend falls back to a development secret if the environment variable is not set, but production should always use a strong environment value.

## Backend setup

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export JWT_SECRET_KEY="change-me-in-production"
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

## Frontend setup

From the repo root:

```bash
npm install
npm run dev
```

The frontend expects the API at `http://127.0.0.1:8000` by default. If you need a different base URL, set:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Backend verification

A live verification script is included at `Backend/test_permissions.py`. It exercises role-based access for admin, faculty, and student accounts.

```bash
cd Backend
JWT_SECRET_KEY="change-me-in-production" ./venv/bin/python test_permissions.py
```

## Build

```bash
npm run build
```

## Production notes

- Use a strong `JWT_SECRET_KEY` outside local development.
- Keep SQLite data in a persistent volume if you deploy the backend in production.
- Allow only trusted frontend origins in CORS for deployed environments.
- Prefer a managed deployment for the backend and a production-grade reverse proxy in front of the API.

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
- Role: Hema S – Frontend Development & Analytics
- Focus: React, TypeScript, UI/UX, analytics dashboard, course feedback interface

---

<p align="center">
  <strong>Built with passion for better academic experiences.</strong>
</p>

