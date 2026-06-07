# Screen Requirements

## Root and Authentication

- `/`: mock auth gate; redirects to login, manager dashboard, or student home based on hard-coded state.
- `/(auth)/login`: login UI.
- `/(auth)/register`: student account registration request UI.
- `/(auth)/forgot-pass`: password reset UI.
- `/(auth)/first-time-login`: first-login password-change UI.
- Authentication behavior beyond UI is not confirmed.
- Auth forms keep focused inputs reachable while the keyboard is visible and move to the next field from the keyboard action where applicable.

## Manager Bottom Tabs

### Dashboard

- Show overview metrics only: full rooms, resident students, open issues, open complaints, and active transfers.
- Show separate resolved Issue and Complaint ratings.
- Link to room breakdown, issue/complaint stats, report summary, notifications, and account requests.
- Do not place full operational lists directly on the dashboard.

### Requests

- Top tabs: Issues, Complaints, Transfer.
- Shared statuses: Pending, In Progress, Resolved.
- Issue/Complaint filters: Block, dependent Floor, Priority.
- Issue-only filter: Electric, Water, Internet, Facility.
- Transfer filters use requested Block/Floor.
- Cards open `/manager-details/ticket/[type]/[id]`.

### Manage

- Top tabs: Room and Student.
- Room view:
    - Horizontal Block tabs and Floor selector.
    - Two-column room grid with readable horizontal summary cards.
    - Room status color derives from active issue/complaint/transfer ticket types.
    - Empty rooms have no tickets.
- Student view:
    - Search by name or student ID with 300 ms debounce.
    - Filter by major, block, and floor.
    - Student cards open student detail stack screens.

### Chat

- Show searchable conversations with All, Direct, and Groups filters.
- Support direct manager-to-manager and manager-to-student conversations.
- Support group conversations; messages from other members show sender avatar and name.
- Create named groups with selected manager and student members.
- Manager chat does not include a chatbot.
- Conversation and group-creation screens use `/manager-details/chat/*` stack routes.

### Settings

- Final manager tab is labeled Settings.
- View and locally edit manager profile information.
- Link to a dedicated FAQ screen that creates and updates shared chatbot answers.
- Link to a dedicated Activity Log screen with time, actor name, and Manager/Student/System role filters.
- Provide logout action.

## Manager Detail Screens

### Student Detail

- Show student identity, room context, bed, phone, email, gender, document records, dorm contract, and emergency contact.
- Uses a normal stack screen with back navigation.

### Room Detail

- Show room code, block/floor, gender, area, occupancy, and available amenities without repeating the same metrics.
- Show monthly rent.
- Allow managers to locally edit room name/code, area, capacity, gender, amenities, and monthly rent.
- List current residents; each resident opens Student Detail.
- List active non-resolved tickets; each opens Ticket Detail.

### Ticket Detail

- Issue/Complaint: show title, category, full room location, status, report detail, reporter/time, attachments, handler choices, and progress choices.
- Selected Issue/Complaint handler and progress choices show their active colors.
- Transfer: show current and requested full room locations, reason, ticket status, and manager approve/deny controls.
- Current action changes are local to the detail screen.

## Dashboard Detail Screens

### Room Overview

- Show full-room and student totals.
- Expand block rows to inspect floor-level full rooms and vacant beds.

### Issue & Complaint Stats

- Show open totals, Pending/In Progress counts, resolved ratings, standardized issue-type breakdown, and open Issue/Complaint locations.

### Report Summary

- Show summary highlights and operational notes.
- PDF and Excel actions are mock-only and use toast feedback.

### Notifications

- Dashboard notification bell opens manager app activity/operational notifications.
- Create a draft with title, message, priority, and audience.
- Priority options: Normal, Important, Emergency.
- Audience options: All residents, selected blocks, selected floors, selected rooms.
- Non-global audiences require at least one selected target.
- Tabs: Draft, Scheduled, Sent.
- Draft/Scheduled notifications can be sent; Sent notifications can be deleted.

### Account Requests

- Tabs: Pending, Approved, Rejected.
- Pending requests can be approved or rejected.
- Rejection requires a reason.

## Student Bottom Tabs

- Home: personalized greeting and student overview, current room summary, mock weather and activity suggestion, redesigned status summaries, and the three latest notifications.
- Home quick actions link to dedicated issue and complaint forms, the dormitory hotline, and chatbot.
- Room: current room, occupancy/fee, room-related actions, roommates/history.
- Room View Contract opens a dedicated detail screen with contract dates, room/bed, monthly fee, status, and terms.
- Room issue actions offer Electric, Water, Internet, and Facility and open a detailed report form.
- Student issue forms collect type, title, description, priority, and optional file attachments.
- Student complaint forms collect title, description, priority, and optional file attachments without a type.
- Student transfer requests allow filtering available rooms by block/floor, selecting a destination, and entering a reason.
- Student request form content must begin below the colored header without overlapping it.
- Chat: student chat list; separate chat and chatbot routes exist.
- Chat supports student-created groups with selected resident members.
- Chatbot reads fee and dormitory answers from the shared manager-editable FAQ.
- Notification: filters and displays manager-created notification priority, audience, message, and time.
- Manager notifications sent during the current session appear in the student notification list.
- Profile: personal information, current room, documents, settings, and a redesigned keyboard-aware local edit modal.
- Profile document actions open a dedicated screen for uploading or replacing Citizen ID and Temporary Residence files.
- Profile Change Password opens a dedicated validated password form.
- Student request forms must keep focused fields and submit actions reachable while the keyboard is visible.
- Several student actions appear UI-only; backend behavior is not confirmed.
