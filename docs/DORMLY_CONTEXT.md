# DORMLY Project Context

## Product

- DORMLY is a mobile dormitory management prototype with separate student and manager experiences.
- Current UI copy is primarily English.
- Most operational data and actions are mock-only. There is no confirmed API, database, global store, or persistence layer.
- `docs/DORMLY.pdf` exists as a reference, but current code is the source of truth for implemented behavior.

## Technology

- Expo SDK 55, React Native 0.83, React 19, TypeScript strict mode.
- Expo Router provides file-based routing and typed routes.
- NativeWind/Tailwind classes are the main styling method.
- Ionicons and other `@expo/vector-icons` sets provide icons.
- `sonner-native` is configured globally for toast notifications.
- `moti` and `react-native-reanimated` are installed, but animation usage is not widespread.
- `expo-image` is used by several student-facing screens.

## Important Commands

- Install: `npm install`
- Start: `npm run start`
- Type check: `node node_modules\typescript\bin\tsc --noEmit`
- Lint: `npm run lint` or `node node_modules\expo\bin\cli lint`
- There is no confirmed automated test suite.

## Repository Structure

- `src/app/`: Expo Router routes.
- `src/app/(auth)/`: login, password reset, first-time login.
- `src/app/(student)/`: student bottom-tab screens.
- `src/app/(manager)/`: manager bottom-tab screens.
- `src/app/manager-details/`: stack detail screens for students, rooms, and tickets.
- `src/app/manager-dashboard-details/`: stack screens linked from the manager dashboard.
- `src/components/manager-dashboard/`: shared dashboard UI.
- `src/components/manager-dashboard-actions/`: notification and account-request UI.
- `src/components/manager-requests/`: request lists, filters, and ticket UI.
- `src/components/manager-management/`: room/student management UI.
- `src/components/manager-chat/`: manager conversation, avatar, filter, and member-selection UI.
- `src/data/`: typed mock data and derived dashboard summaries.
- `src/utils/manager-room-tickets.ts`: derives active room tickets from request mock data.

## Navigation

- Root stack is declared in `src/app/_layout.tsx`; headers are hidden.
- Root stack registers auth, student tabs, manager tabs, manager details, and manager dashboard details.
- Student bottom tabs: Home, Room, Chat, Notification, Profile.
- Manager bottom tabs: Dashboard, Requests, Manage, Chat, Settings.
- Manager Settings is implemented at `/(manager)/settings`.
- Manager FAQ and Activity Log details use `/manager-settings-details/*`.
- Dashboard notification bell opens `/manager-dashboard-details/notification-inbox`; notification administration remains a separate dashboard detail route.
- Manager details are normal stack screens so back navigation preserves the previous screen.
- Manager chat details and group creation use `/manager-details/chat/*` stack routes.
- Student issue, complaint, transfer, and contract details use `/student-request-details/*` stack routes.
- Student document upload and password change use `/student-profile-details/*` stack routes.

## Data and State

- Manager mock data:
    - `manager-dashboard.ts`: room/dashboard summaries and analytics.
    - `manager-requests.ts`: issues, complaints, transfers, filters, handlers.
    - `manager-management.ts`: rooms, residents, documents, contracts.
    - `manager-dashboard-actions.ts`: notifications and account requests.
    - `manager-chat.ts`: chat participants, direct/group conversations, messages, and in-memory group creation.
    - `manager-settings.ts`: manager profile information.
    - `dorm-faq.ts`: shared manager-editable FAQ used by the student chatbot.
    - `activity-log.ts`: shared in-memory operational activity records.
    - `student-notifications.ts`: resident notifications using the manager notification contract.
    - `student-home.ts`: student identity, room overview, weather/activity, and request-status mock summaries.
    - `student-requests.ts`: student request form options, available transfer rooms, hotline, and in-memory submissions.
    - `student-profile.ts`: student personal-document upload metadata.
    - `manager-app-notifications.ts`: manager-facing app activity and operational alerts.
- Dashboard issue/complaint counts are derived from `manager-requests.ts`.
- Empty rooms intentionally return no active tickets.
- Screen actions generally update local React state only and reset after leaving/reloading the screen.
- Manager-created chat groups and sent messages persist only in memory for the current app session.
- Manager profile, FAQ, activity log, room edits, and student-created chat groups are mock/in-memory only.
- Sending a manager notification publishes it to the in-memory student notification list for the current session.
- Student issue, complaint, and transfer submissions persist only in memory for the current app session.
- Student profile edits, document uploads, and password changes are local mock actions.

## Confirmed Limitations

- `src/app/index.tsx` uses a hard-coded mock auth hook and currently redirects unauthenticated users to login.
- PDF/Excel report export is mock-only and shows toast feedback.
- Attachments and document image paths commonly use `mock://` URIs; real media loading is not confirmed.
- Student request attachments use the local Expo document picker; uploaded files are not persisted to a backend.
- Notification sending/deleting and account approval/rejection are local mock actions.
- Ticket updates are local to the ticket detail screen and are not persisted back to request lists.
- Some older student screens contain encoding artifacts and legacy styling patterns.
