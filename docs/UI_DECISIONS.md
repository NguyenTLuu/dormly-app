# UI Decisions

## General Style

- Use NativeWind `className` for layout and styling; use inline styles mainly for dynamic colors and safe-area values.
- Primary page background for newer manager screens: `#F4FAFD`.
- Primary brand/header blue: Tailwind `bg-blue-600`; active navigation blue is approximately `#208AEF`/`#2563EB`.
- Main text: `#1E293B`; secondary text: `#64748B`; muted text: `#94A3B8`.
- Use white cards with restrained borders/shadows and rounded corners.
- Prefer icon-led labels and compact operational layouts over decorative/marketing layouts.

## Authentication

- Auth screens use the light-blue background, DORMLY logo image, white rounded input rows, and blue primary actions.
- Auth forms use chat-style animated keyboard lifting, keyboard-aware scrolling, and keyboard Next/Done actions to move through input fields.

## Manager Screen Pattern

- Bottom-tab screens use `ManagerHeader`: blue rounded-bottom header, title, subtitle, safe-area spacing.
- Content commonly overlaps the header using `-mt-8 px-4`.
- Detail screens linked from manager lists use normal Stack routes with a back button, not nested modals.
- Dashboard is overview-only; detailed lists and expandable breakdowns belong in detail routes.
- Reuse `SectionCard`, `SectionTitle`, `MetricTile`, `ProgressRow`, and `DetailLinkCard`.

## Color Semantics

- Issue: orange, usually `#F97316` with `#FFEDD5`.
- Complaint: purple, usually `#7C3AED`/`#A855F7` with `#EDE9FE`/`#F3E8FF`.
- Transfer: blue, usually `#2563EB` with `#DBEAFE`.
- Pending: amber; In Progress: blue; Resolved/approved: green; rejected/error: red.
- Notification priority:
    - Normal: blue.
    - Important: amber.
    - Emergency: red.

## Cards and Lists

- Dashboard metric layout is intentionally two larger cards on the first row and three compact cards on the second row.
- Compact metric cards must constrain labels/captions to prevent text jumping.
- Room management uses a two-column grid so operational room cards remain readable.
- Room cards use a horizontal summary layout and show room code, occupancy, gender icon, status color, and active-ticket count.
- Empty rooms are gray and must not show active tickets.
- Room detail emphasizes location, area, occupancy, gender, and amenities without repeating room metrics.
- Room detail includes monthly rent and an Edit action; room edits are local mock state.
- Student management uses a vertical list with avatar, name, student ID, major, and room context.

## Tabs and Filters

- Manager Requests has colored top tabs: Issue orange, Complaint purple, Transfer blue.
- Manage has two top tabs: Room and Student.
- Request status is limited to Pending, In Progress, and Resolved.
- Location filters are dependent: select Block before Floor.
- Issue types are standardized to Electric, Water, Internet, and Facility.
- Student search is debounced by 300 ms; advanced filters open in a bottom-sheet-style modal.

## Feedback and Interaction

- Use `sonner-native` toast feedback instead of React Native `Alert`.
- Use Ionicons where possible.
- Notification audience selection supports All residents or multiple selected blocks, floors, or rooms.
- New-account rejection must validate that a reason was entered before applying.
- Manager notification deletion is currently offered only for sent notifications.
- Request information cards use the default `shadow-xl` treatment.
- Selected handler and progress controls must visibly reflect their active state.

## Manager Chat

- Manager Chat uses the standard blue `ManagerHeader` and stack detail screens.
- Conversation filters are All, Direct, and Groups; manager chat has no chatbot.
- Group message bubbles from other members always show the sender avatar and name.
- Group creation requires a name and at least two selected members.

## Settings And Shared Content

- The final manager tab is Settings and uses a settings icon.
- Settings contains manager profile editing, links to chatbot FAQ and activity-log detail screens, and logout.
- FAQ management supports creating, editing, categorizing, and deleting FAQ drafts before saving.
- Student chatbot answers are sourced from the manager-editable shared FAQ.
- Student notifications display the manager notification fields: title, message, priority, audience, and creation time.
- Dashboard header notification bell opens the manager app-notification inbox, not notification administration.
- Manager app-notification inbox follows the same priority filters and card layout as student notifications.

## Student Home

- Student Home uses the newer light-blue page background, blue personalized header, and compact white overview cards.
- Home previews the three newest shared student notifications; each preview and View all open the Notification tab.
- Weather, activity suggestion, room overview, and request-status values remain typed mock data under `src/data`.
- Issue and complaint quick actions open dedicated student request forms; emergency contact calls the dormitory hotline.

## Student Requests

- Student request forms use normal Stack routes under `/student-request-details/*` with a colored back header and non-overlapping content spacing.
- Issue reports require one of Electric, Water, Internet, or Facility, plus title, description, and priority.
- Complaints use the same detailed form without an issue-type field.
- Issue and complaint forms support local photo, video, and PDF attachment selection.
- Transfer requests list rooms with available beds, sort them by block/floor/code, and support dependent Block/Floor filters.
- Student contract detail uses the same Stack/header pattern and displays the current mock contract, resident/room context, fee, and terms.
- Student request forms use keyboard-aware scrolling with extra bottom space so inputs and submit actions remain reachable.

## Student Profile

- Edit Profile uses a keyboard-aware bottom-sheet modal with a resident summary, editable contact fields, and fixed visual hierarchy.
- Personal document management and password change use dedicated Stack screens under `/student-profile-details/*`.
- Student document uploads accept local image or PDF files and remain mock-only.

## Existing Inconsistencies

- Newer manager screens follow the patterns above; some older student/auth screens use different spacing, icon sets, white backgrounds, and modal styling.
- Do not broadly restyle legacy screens unless the task explicitly requests it.
