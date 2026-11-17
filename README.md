# SRL Analytics Platform

A front-end prototype of a learning management system (LMS) that turns student activity into **Self-Regulated Learning (SRL)** analytics. Students watch course videos, take in-video quizzes and polls, and browse chapters. Every interaction is logged as a telemetry event. Teachers get dashboards that score each student on SRL dimensions (planning, monitoring, control, reflection, motivation), group students into behaviour types, show live activity, and let the teacher assign support material.

It is built for demos and research prototyping. There is **no real backend**: users, courses and events live in React state inside the browser (see [How it works](#how-it-works)).

> **Related repo:** [`srl-using-lms-data`](https://github.com/geethatigulla/srl-using-lms-data) holds an earlier snapshot of this same app, uploaded as one flat folder. **This repo (`srl`) is the current, runnable version.** It adds teacher interventions, confusion-spot detection, video drop-out tracking, click tracking, course/chapter IDs on every event, and data-driven behaviour clusters.

## Features

**Student side**
- Sign up with a class join code, or log in with a demo account.
- **Learning Progress**: subjects and chapters (videos, quizzes, assignments), some locked. Expanding a subject logs a `chapter_preview` event. Opening an assignment logs `assignment_view` / `assignment_submit`.
- **Video Player** (sample video), instrumented to log play, pause (with pause count), seek-back (`video_rewind`), skip-ahead attempts, completion, and drop-out when you leave between 5% and 95%. It shows an in-video quiz at 45% and a reflection poll at 75%. It also keeps a per-10-second watch heatmap and emits `confusion_spot` when one segment gets very heavy use.
- **Dashboard** that shows interventions your teacher assigned. Its skill radar and weekly activity charts use static sample data.
- **Leaderboard** and **AI Report** pages, both static mock content.

**Teacher side**
- Sign up and create a class ("cluster") with a generated join code.
- **SRL Analytics** (`/teacher/advanced`): class-average SRL radar, a strategy-vs-motivation scatter of students labelled by behaviour type, and a trajectory chart.
- **Behavior** (`/teacher/behavior`): rule-based behaviour clusters (Strategic, Passive, At Risk, Inconsistent) worked out from the events, plus class SRL averages.
- **Live Monitor** (`/teacher/live`): polls the event store every 2 s and shows a rolling event stream with counters (watching, quizzing, idle).
- **Video Data** (`/teacher/video-analytics`): completion rate, pause and rewind frequency, and a "confusion map" by video segment.
- **Student Profile** (`/teacher/student/:id`): per-student SRL scores and an **intervention** form (pick a material type and assign it). The assignment appears on that student's dashboard.
- **Class Analytics**, **Dashboard**, **Courses**: overview pages, mostly static sample data.

**Passive telemetry** (students only): tab focus and blur, mouse clicks, scroll depth (throttled to every 2 s), and an `idle_state` event after 60 s with no mouse or keyboard input.

## Tech stack

- React 19 + Vite 7
- React Router 7
- Recharts (charts), lucide-react (icons)
- ESLint 9 (flat config)
- Plain CSS (`src/index.css`, `src/App.css`)

## Project structure

```
srl/
├── index.html                 # Vite entry HTML
├── vite.config.js             # Vite + React plugin
├── eslint.config.js
├── package.json
└── src/
    ├── main.jsx               # React root
    ├── App.jsx                # Routes; role-based (teacher / student)
    ├── context/
    │   ├── MockBackendContext.jsx  # In-memory "backend": users, classes, subjects,
    │   │                           # event store, SRL scoring, clustering, interventions, auth
    │   └── TelemetryContext.jsx    # track() API + passive tracking (focus, scroll, click, idle)
    ├── components/            # Layout, Sidebar, TopNav
    └── pages/
        ├── auth/              # Login, StudentSignup, TeacherSignup
        ├── student/           # Dashboard, LearningProgress, VideoPlayer, Leaderboards, AIReport
        └── teacher/           # Dashboard, ClassAnalytics, RealTimeMonitor, VideoAnalytics,
                               # AdvancedAnalytics, BehaviorAnalytics, StudentProfile, CourseManagement
```

## Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (Vite 7 needs one of these) and npm

### Install and run
```bash
git clone https://github.com/geethatigulla/srl.git
cd srl
npm install
npm run dev        # dev server at http://localhost:5173
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | Run ESLint |

No environment variables or config files are needed.

### Demo accounts
These accounts are seeded in `src/context/MockBackendContext.jsx` for local testing only:

| Role | Email | Password |
|---|---|---|
| Student | `student@edu.com` | `password` |
| Teacher | `teacher@edu.com` | `password` |

Student sign-up is pre-filled with the demo class code `AI-ML-B-2026`. Accounts you create through sign-up also get the password `password`.

**To see the analytics change:** log in as the student, watch a video, answer the quiz or poll, and open chapters or assignments. Then log out and log in as the teacher **in the same tab, without reloading**, and open SRL Analytics, Behavior, Video Data or Live Monitor. A page reload clears all data.

## How it works

1. **Event capture.** `TelemetryContext.track(eventType, metadata)` builds an event `{ timestamp, student_id, course_id, chapter_id, event_type, event_metadata }` and passes it to `logEvent` in the mock backend. Only logged-in students are tracked.
2. **Event store.** `MockBackendContext` adds each event to an in-memory array. It also updates simple running counters (`processedMetrics`) that the Live Monitor shows.
3. **SRL scoring** (`computeStudentSRL`). Each dimension is a capped 0–100 score from event counts:
   | Dimension | Driven by |
   |---|---|
   | Planning | `chapter_preview`, `assignment_view` |
   | Monitoring | `quiz_submit`, `poll_answer` |
   | Control | `video_rewind` (up), `confusion_spot` (down) |
   | Reflection | `video_complete`, `assignment_submit`, `poll_answer` |
   | Motivation | total event volume |
4. **Behaviour clustering** (`getBehaviorClusters`). Threshold rules on the SRL scores, labelled in the UI as simulated k-means, sort students into Strategic Learners, Passive Learners, At Risk or Inconsistent.
5. **Interventions.** `assignIntervention` stores a support item for a student and logs an `assign_intervention` event. The student dashboard lists active interventions.

## Known limitations

- **No persistence and no server.** Everything resets on page reload. Nothing reads real LMS logs. Events come only from the in-browser session.
- Several pages and charts use **hard-coded sample data**: student dashboard charts, Leaderboard, AI Report, Class Analytics, teacher Dashboard, parts of Student Profile and Behavior risk alerts.
- The video is a public sample clip, the same for every chapter.
- "Settings" links in the sidebar have no route and redirect to the dashboard.
- The Video Data confusion map reads `video_timestamp` from the top level of each event, but the current telemetry nests it under `event_metadata`. So the segment bins stay at zero.
- The demo accounts and passwords are plain text in client code. This is fine for a mock, but it is not real authentication.
