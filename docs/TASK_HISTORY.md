# Task History

This file records implemented project direction visible in the repository, not a complete chronological changelog.

## Manager Dashboard

- Replaced the manager dashboard placeholder with mock operational metrics.
- Added full-room, resident, issue, complaint, transfer, and resolved-rating summaries.
- Added separate dashboard detail routes for room breakdown, issue/complaint statistics, and report summary.
- Added issue/complaint Pending and In Progress counts.
- Added open issue and complaint breakdowns by location.
- Kept PDF/Excel export as mock toast actions.

## Manager Requests

- Added Issue, Complaint, and Transfer top-tab workflows.
- Added Pending, In Progress, and Resolved status views.
- Added dependent Block/Floor filters, priority filter, and clear-filter behavior.
- Standardized Issue types to Electric, Water, Internet, and Facility.
- Added Issue Type filtering.
- Added request cards with reporter avatar, report time, room location, and priority.
- Added stack ticket detail screens with descriptions, attachments, handler assignment, progress updates, and transfer approve/deny actions.

## Manager Manage

- Added Room and Student top tabs.
- Added two-column room grid with block/floor navigation, horizontal summary cards, and ticket-derived color states.
- Added student search with 300 ms debounce and filters for major/block/floor.
- Converted room, student, and ticket details from single modals to stack screens.
- Room detail links to resident student details and active ticket details.
- Added student details for documents, contract, emergency contact, and room context.
- Simplified room detail to focus on location, area, occupancy, gender, and amenities.
- Added monthly rent and local room-information editing for room name/code, area, capacity, gender, amenities, and rent.

## Request Detail Refinements

- Added visible active colors for Issue/Complaint handler and progress selections.
- Applied the default `shadow-xl` treatment to request information cards.

## Dashboard Administration

- Added notification creation and management.
- Added notification priority: Normal, Important, Emergency.
- Added audience targeting for all residents or selected blocks, floors, and rooms.
- Added send and sent-notification deletion mock actions.
- Added new-account request review with Pending/Approved/Rejected views.
- Added approve and required-rejection-reason flows.

## Manager Chat

- Added searchable Direct and Group conversation views without a chatbot.
- Added direct mock conversations with managers and resident students.
- Added group conversations that identify other senders with avatar and name.
- Added group creation with selectable manager/student members and in-memory mock persistence.
- Added manager chat detail and group-creation stack routes.

## Settings And Shared Student Content

- Replaced the final manager Profile tab presentation with Settings and a settings icon.
- Added manager profile editing, shared chatbot FAQ editing, activity log, and logout.
- Moved FAQ management and Activity Log into dedicated Settings detail screens.
- Added FAQ creation alongside editing and category management.
- Added manager app-notification inbox and linked the dashboard bell to it.
- Updated student chatbot to use the shared manager-editable FAQ.
- Added student group-chat creation with selectable residents.
- Standardized student notifications to the manager notification contract and priority semantics.

## Student Home

- Redesigned the student Home overview with personalized resident, room, weather, activity, and request-status summaries.
- Connected Home quick actions to dedicated issue/complaint forms, the dormitory hotline, and chatbot.
- Home now previews the three latest shared student notifications and links to the full notification tab.

## Student Requests

- Added dedicated Stack screens for student issue, complaint, and room-transfer requests.
- Added detailed issue and complaint forms with priority, validation, and local file attachments.
- Standardized student issue choices to Electric, Water, Internet, and Facility.
- Added an available-room transfer browser with dependent Block/Floor filters, room selection, and transfer reason.
- Redesigned the Room request actions to open the new student request flows.
- Fixed request-form header overlap by separating form content from the colored headers.
- Added a student contract detail screen and linked it from Room.
- Made issue, complaint, and transfer forms keyboard-aware with additional scroll space.

## Student Profile

- Redesigned the student Edit Profile bottom-sheet modal with keyboard-aware scrolling and clearer form hierarchy.
- Added a dedicated personal-document upload and replacement screen.
- Added a dedicated validated change-password screen.

## Cross-Cutting Decisions

- Adopted `sonner-native` toast feedback for newer flows.
- Split manager feature components into dedicated folders instead of large route files.
- Kept operational data typed and mock-based under `src/data`.

## Known Follow-Up Risks

- Mock actions are not persisted across routes or app reloads.
- Ticket detail updates do not update dashboard/request source arrays.
- Existing lint warnings remain in unrelated legacy student/auth/chat files.
- Real exports, media/document loading, authentication, and backend integration are unconfirmed.
