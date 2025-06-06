DuoTrak Backend: API & Architecture Overview for Frontend Integration
Overall Purpose:
The DuoTrak backend serves as the central data store and business logic engine for the AI-Assisted Accountability Partner Web Application. It handles user data, partnerships, goals, systems, check-ins, reflections, messages, progress tracking, notifications, and AI-powered planning suggestions.
Core Backend Technologies & Architecture:
Framework: FastAPI (Python)
Purpose: Provides a modern, fast (high-performance) web framework for building APIs. It's used to define all HTTP endpoints, handle incoming requests, and send responses.
Frontend Implication: The frontend will communicate with the backend via standard HTTP requests (GET, POST, PUT, DELETE) to defined API routes.
Data Validation: Pydantic
Purpose: Used by FastAPI to define and validate the structure of request bodies and response data (data schemas). Ensures data integrity.
Frontend Implication: The frontend must send data in the JSON format expected by these Pydantic schemas and can expect responses in a consistent JSON structure. Errors due to invalid data will typically result in HTTP 422 (Unprocessable Entity) responses with detailed error messages.
Database Interaction: SQLAlchemy (ORM)
Purpose: An Object-Relational Mapper that allows the backend to interact with the database using Python objects and methods instead of raw SQL queries. It manages how data is stored and retrieved.
Frontend Implication: This is mostly an internal backend detail, but it means the data the frontend receives will be structured based on these underlying database models.
Database: PostgreSQL (via Supabase)
Purpose: The actual relational database where all application data is stored. Supabase provides a hosted PostgreSQL instance.
Frontend Implication: The frontend doesn't interact directly with the database; all data access is mediated by the FastAPI backend.
Authentication: Supabase Auth (JWTs)
Purpose: Supabase handles user registration, login, password management, and issues JSON Web Tokens (JWTs).
Frontend Implication:
The frontend will likely interact with Supabase's client-side library (or dedicated backend auth endpoints) for signup/login.
Upon successful authentication, the frontend will receive JWTs (access token, refresh token).
For every request to protected backend API endpoints, the frontend MUST include the access token in the Authorization header as a Bearer token (e.g., Authorization: Bearer <your_access_token>).
The backend will verify this JWT to authenticate the user.
Layered Architecture:
API/Router Layer: Defines HTTP endpoints.
Service Layer: Contains core business logic (e.g., how to create a goal, what happens when a check-in is verified).
Data Access (CRUD) Layer: Handles direct database operations using SQLAlchemy.
Frontend Implication: This separation ensures that API endpoints are clean and business logic is centralized and reusable. The frontend interacts only with the API/Router Layer.
Asynchronous Operations (async/await):
Purpose: Ensures the backend can handle many requests concurrently without getting blocked by slow operations (like database queries or external API calls).
Frontend Implication: The backend should be responsive. The frontend should still handle loading states, as network latency is always a factor.
Key API Endpoint Groups (All prefixed with /api/v1/):
This is a high-level summary. Specific request/response bodies will be detailed by Pydantic schemas.
Authentication (/auth)
POST /auth/register: User registration.
Frontend sends (MVP): { email: "user@example.com", password: "userpassword" }
Backend expects (MVP): Email and password for initial account creation. Other details (username, timezone, bio, optional profile pic as originally listed) can be collected via a separate profile update mechanism post-registration or if the registration form is expanded.
Backend returns: 
  Success: { success: true, message: "Signup successful!", user: { id, email, /* other basic fields */ } }
  Error: { success: false, message: "Error description" }

POST /auth/login: User login.
Frontend sends: { email: "user@example.com", password: "userpassword" }
Backend returns:
  Success: { success: true, message: "Login successful!", accessToken: "your_access_token", refreshToken: "your_refresh_token", user: { id, email, username, /* other relevant non-sensitive fields */ } }
  Error: { success: false, message: "Invalid credentials or other error" }

POST /auth/request-password-reset: Request password reset link.
Frontend sends: { email: "user@example.com" }
Backend action: Generates a secure token and sends a password reset email to the user.
Backend returns:
  Success: { success: true, message: "If an account with that email exists, a password reset link has been sent." } (Generic message for security)
  Error: { success: false, message: "Error sending reset link" }

POST /auth/reset-password: Set new password using reset token.
Frontend sends: { token: "password_reset_token_from_email", newPassword: "newSecurePassword123" }
Backend action: Validates the token and updates the user's password.
Backend returns:
  Success: { success: true, message: "Password reset successful! You can now login." }
  Error: { success: false, message: "Invalid or expired token, or other error" }

POST /auth/token/refresh: (Alternative, if FastAPI manages refresh tokens, less likely with Supabase client handling).
Users & Profiles (/users)
GET /users/me: Get current authenticated user's profile.
PUT /users/me: Update current authenticated user's profile (username, timezone, bio).
POST /users/me/profile-image: Upload/update current user's profile image.
Partnerships (/partnerships)
POST /partnerships/invite: Send a partnership invitation to an email.
POST /partnerships/accept-invite: Accept a partnership invitation using an invite token.
Frontend sends: { token: "partnership_invitation_token_from_link" } (User identified by JWT in Authorization header)
Backend action: Validates the token and links the authenticated user to the partnership.
Backend returns:
  Success: { success: true, message: "Invitation accepted successfully!", partnership: { /* details */ } }
  Error: { success: false, message: "Invalid token or other error" }

GET /partnerships/invitation/{token}: (New Suggested Endpoint) Get details of an invitation.
Purpose: Allows the frontend to display inviter information before the user accepts the invitation.
Frontend sends: No body, token in path. User does not need to be authenticated to view basic invite details.
Backend returns:
  Success: { success: true, invitationDetails: { inviterName: "Inviter's Username", message?: "Optional custom message" } }
  Error: { success: false, message: "Invalid or expired token" }

POST /partnerships/setup: (New Endpoint) Initialize a new partnership.
- **Purpose**: Allows an authenticated user to create and name a new partnership.
- **Frontend Sends**:
  ```json
  {
    "name": "string (The desired name for the partnership)"
  }
  ```
- **Backend Action**: Creates a new partnership entity, links the authenticated user as one of the partners, and stores the partnership name.
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "Partnership set up successfully!",
    "partnership": {
      "id": "string (partnership ID)",
      "name": "string",
      "partner1_id": "string (ID of the creating user)",
      "partner2_id": "string (null until second partner joins via invite)"
      // ... other relevant partnership details
    }
  }
  ```

GET /partnerships/me: Get details of the current user's active partnership (if any).
DELETE /partnerships/me: Dissolve the current active partnership.

GET /partnerships/partner/systems/today: (New Endpoint) Get partner's systems for today.
- **Purpose**: Fetches the systems scheduled for the current day for the authenticated user's active partner.
- **Query Params**: None (implicitly for "today" and for the active partner).
- **Backend Returns**:
  ```json
  {
    "success": true,
    "systems": [
      {
        "id": "string (system ID)",
        "name": "string",
        "status": "string (e.g., 'Pending', 'Completed', 'In Progress')",
        "details": "string (optional)"
        // ... other relevant system details for display
      }
    ]
  }
  ```

GET /partnerships/partner/activity: (New/Clarified Endpoint) Get partner's activity feed.
- **Purpose**: Fetches a paginated list of the active partner's recent activities.
- **Query Params**:
    - `page` (integer, default 1): For pagination.
    - `limit` (integer, default 15): Items per page.
- **Backend Returns**: Similar structure to `GET /notifications`, but specifically filtered for the partner's activities.
  ```json
  {
    "success": true,
    "activities": [
      {
        "id": "string",
        "type": "string", // e.g., 'system_checkin', 'goal_achieved', 'reflection_added'
        "title": "string",
        "message": "string",
        "timestamp": "datetime",
        "actor": { "id": "string (partner's user ID)", "name": "string" },
        "target": { "type": "string", "id": "string", "name": "string (optional)" },
        "content": { /* type-specific content object, e.g. systemName, reflectionText */ }
      }
    ],
    "pagination": {
      "currentPage": "integer",
      "hasNextPage": "boolean"
    }
  }
  ```

Goals (/goals)
POST /goals: Create a new goal (can include AI assistance inputs).
GET /goals: Get a list of the current user's goals (can filter by archived).
GET /goals/{goal_id}: Get details of a specific goal (including its systems).
PUT /goals/{goal_id}: Update a specific goal.
DELETE /goals/{goal_id}: Delete/archive a specific goal.
Systems (/systems) (Often contextual to a goal)
POST /systems: Create a new system (optionally linked to a goal).
GET /systems: Get all systems for the current user (can filter by goal_id, is_active).
GET /systems/current-schedule: Get systems scheduled for "today" for the dashboard.
GET /systems/{system_id}: Get details of a specific system.
PUT /systems/{system_id}: Update a specific system.
DELETE /systems/{system_id}: Delete/deactivate a specific system.
Check-ins (/checkins)
POST /checkins: Log a new check-in for a system (status, metric value, notes, photo).
GET /checkins/me: Get current user's check-in history (paginated, filterable by system/date).
GET /checkins/partner: Get partner's check-in feed (paginated).
PUT /checkins/{checkin_id}: Edit own check-in (with limitations).
DELETE /checkins/{checkin_id}: Delete own check-in (with limitations).
Verifications (/verifications)
GET /verifications/pending-for-me: Get partner's check-ins awaiting current user's verification.
POST /verifications/{partner_checkin_id}/submit: Submit verification (approve/query/reject) for a partner's check-in.
Reflections (/reflections)
POST /reflections: Create a new daily reflection.
GET /reflections/by-date/{reflection_date_local}: Get reflection for a specific date.
GET /reflections/me: Get paginated history of own reflections.
GET /reflections/partner: Get paginated history of partner's reflections.
PUT /reflections/{reflection_id}: Update own reflection.
Direct Messages (/messages) (For partner chat)
POST /messages: Send a direct message to the partner.
- **Frontend Sends**:
  - For text messages:
    ```json
    {
      "text": "string (the message content)",
      "partnerId": "string (recipient partner's user ID or partnership ID)",
      "replyToActivityId": "string (optional, ID of activity/feed item being replied to)"
    }
    ```
  - For messages with images: (multipart/form-data)
    - `text`: string (optional message content)
    - `partnerId`: string (recipient partner's user ID or partnership ID)
    - `replyToActivityId`: string (optional)
    - `image`: file (the image file to upload)
- **Backend Action**: Stores the message, associates it with the sender (authenticated user) and the partnership/partner. If an image is present, it's uploaded and its URL is stored with the message.
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "Message sent successfully.",
    "sentMessage": {
      "id": "string (message ID)",
      "senderId": "string (sender's user ID)",
      "text": "string (optional)",
      "imageUrl": "string (optional, URL of the uploaded image)",
      "timestamp": "datetime",
      "reactions": [],
      "replyingTo": { "activityId": "string", "summary": "string" } // (optional)
      // ... other message details
    }
  }
  ```

GET /messages/thread: Get message history with the partner (paginated).
- **Query Params**:
    - `partnerId`: "string (ID of the partnership or partner to fetch messages for)"
    - `page`: "integer (default 1)"
    - `limit`: "integer (default 20)"
- **Backend Returns**:
  ```json
  {
    "success": true,
    "messages": [
      {
        "id": "string",
        "senderId": "string",
        "text": "string (optional)",
        "imageUrl": "string (optional)",
        "timestamp": "datetime",
        "reactions": [
          {
            "id": "string (reaction instance id or emoji id)",
            "emoji": "string (the emoji character)",
            "name": "string (emoji name, optional)",
            "users": ["string (user ID of reactor)"],
            "count": "integer"
          }
        ],
        "replyingTo": { "activityId": "string", "summary": "string" } // (optional)
        // ... other message details
      }
    ],
    "pagination": {
      "currentPage": "integer",
      "hasNextPage": "boolean"
    }
  }
  ```
POST /messages/{message_id}/react: (Post-MVP) Add reaction to a message.
- **Path Params**: `message_id` (string)
- **Frontend Sends**:
  ```json
  {
    "emoji": "string (the emoji character)",
    "messageSenderId": "string (ID of the user who sent the original message, for notification)" 
  }
  ```
- **Backend Action**: Adds/updates the reaction for the given message and user. If `messageSenderId` is different from the reactor, potentially triggers a notification to `messageSenderId`.
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "Reaction added/updated.",
    "updatedMessage": {
      // ... full message object with updated reactions
    }
  }
  ```

Progress/Stats (/progress)
GET /progress/summary: Get aggregated progress data for charts/stats (filterable by date range, compare with partner, system).
Notifications (/notifications)
GET /notifications: Get current user's notifications (paginated, filterable).
POST /notifications/{notification_id}/mark-read: Mark a specific notification as read.
POST /notifications/mark-all-read: Mark all notifications as read.
(Note: Notification creation is typically triggered internally by other service actions, not direct API calls from frontend).
AI Planner (/ai-planner)
POST /ai-planner/suggest-goal-plan: Get AI-generated suggestions for a goal and its systems based on user input.
General Frontend Expectations for API Interaction:
Loading States: Implement loading indicators for all operations that involve backend calls.
Error Handling: Gracefully handle API errors (e.g., 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Validation Error, 5xx Server Errors) and display user-friendly messages.
Optimistic Updates: Where appropriate (as detailed in the UI/UX spec), update the UI immediately upon user action and then sync with the backend, reverting if the backend call fails.
Data Hydration: Fetch necessary data on page/component load to populate views.

## Frontend Service Layer & Mock Data Integration (Auth Focus)

The frontend utilizes a service layer (e.g., `services/authService.js`, `services/partnershipService.js`) to encapsulate API interactions. The following services/methods related to the `pages/auth` flow are currently stubs and need to be implemented to call the actual backend API endpoints defined above:

*   **`authService.signup({ email, password })`**:
    *   Should make a `POST` request to `/api/v1/auth/register`.
*   **`authService.login({ email, password })`**: (Called within `AuthContext`)
    *   Should make a `POST` request to `/api/v1/auth/login`.
    *   The `AuthContext` will handle storing JWTs and user data upon successful login.
*   **`authService.forgotPassword(email)`**:
    *   Should make a `POST` request to `/api/v1/auth/request-password-reset`.
*   **`authService.resetPassword(token, newPassword)`**:
    *   Should make a `POST` request to `/api/v1/auth/reset-password`.
*   **`partnershipService.acceptInvitation(invitationToken)`**:
    *   Should make a `POST` request to `/api/v1/partnerships/accept-invite`.
    *   The request must include the `Authorization` header with the user's JWT.

**Mock Data to Replace:**

*   **`pages/auth/accept-invitation.js`**:
    *   The `inviterName` state is currently hardcoded: `useState("Your Partner")`.
    *   **Integration Plan**: This should be replaced by fetching data using the new suggested endpoint `GET /api/v1/partnerships/invitation/{token}`. When the page loads and a token is present in the URL, call this endpoint to get the `inviterName` and display it.

POST /auth/accept-invitation: Accept a partnership invitation.
Frontend sends: { token: "invitation_token_from_url", /* potentially user details if they are signing up during acceptance */ }
Backend should: Validate token. If valid, associate users as partners. If the accepting user is new, create their account.
Backend returns:
  Success: { success: true, message: "Invitation accepted! You are now partners." }
  Error: { success: false, message: "Invalid or expired token." }


## User Profile & Settings (/users/me, /settings, /profile)

This section covers endpoints related to fetching and managing the authenticated user's profile information and application settings. The base path could be `/users/me` or separate paths like `/profile` and `/settings`.

**GET /users/me** (or **GET /profile**)
- **Purpose**: Fetches the current authenticated user's comprehensive profile data.
- **Query Params**: None.
- **Backend Returns**:
  ```json
  {
    "success": true,
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "username": "string (optional, distinct from name)",
      "avatarUrl": "string (URL, optional)",
      "timezone": "string (e.g., 'America/New_York', optional)",
      "bio": "string (optional)",
      // Any other core user details needed globally or for profile display
    }
  }
  ```
- **Mock Data**: `mockUser` in `pages/settings.js`.

**PUT /profile** (or **PUT /users/me**)
- **Purpose**: Updates the authenticated user's mutable profile information (e.g., name, username, bio, timezone).
- **Frontend Sends**: An object containing only the fields to be updated.
  ```json
  {
    "name": "New User Name",
    "username": "new_username",
    "bio": "Updated user biography.",
    "timezone": "Europe/London"
  }
  ```
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "Profile updated successfully.",
    "user": {
      // ... updated user object as in GET /users/me
    }
  }
  ```

**POST /profile/avatar** (or **POST /users/me/avatar**)
- **Purpose**: Uploads or updates the authenticated user's profile picture.
- **Frontend Sends**: Image file (e.g., via multipart/form-data).
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "Avatar updated successfully.",
    "avatarUrl": "string (URL of the new avatar)"
  }
  ```

**GET /settings/notifications** (or **GET /users/me/notification-preferences**)
- **Purpose**: Fetches the authenticated user's current notification preferences.
- **Backend Returns**:
  ```json
  {
    "success": true,
    "preferences": [
      { "id": "systemUpdates", "label": "System Updates", "enabled": true },
      { "id": "goalProgress", "label": "Goal Progress & Streaks", "enabled": true },
      // ... other preference items
    ]
  }
  ```
- **Mock Data**: `mockNotificationPrefs` in `pages/settings.js`.

**PUT /settings/notifications** (or **PUT /users/me/notification-preferences**)
- **Purpose**: Updates the authenticated user's notification preferences.
- **Frontend Sends**: An array of all preference objects (or just those changed).
  ```json
  {
    "preferences": [
      { "id": "systemUpdates", "enabled": false },
      { "id": "goalProgress", "enabled": true }
      // ... all other preferences with their current state
    ]
  }
  ```
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "Notification preferences updated."
  }
  ```

**PUT /settings/theme** (or **PUT /users/me/theme-preference**)
- **Purpose**: (Optional) Saves the user's preferred application theme.
- **Frontend Sends**: `{ "theme": "dark" }` or `{ "theme": "light" }` or `{ "theme": "system" }`.
- **Backend Returns**: `{ "success": true, "message": "Theme preference updated." }`

**DELETE /account** (or **DELETE /users/me**)
- **Purpose**: Deletes the authenticated user's account. This is a critical action.
- **Frontend Sends (Potentially)**: `{ "currentPassword": "user_password_for_confirmation" }` for verification.
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "Account deletion process initiated/completed."
  }
  ```
- **Note**: Requires careful implementation regarding data retention policies, partner notifications, etc.

## Dashboard (/dashboard)

Endpoints related to the user's main dashboard.

**GET /dashboard**
- **Purpose**: Fetches all data required for the authenticated user's dashboard view.
- **Query Params (Optional)**:
    - `date` (string, e.g., "YYYY-MM-DD"): Specifies the target date for "today's" data. Defaults to current server date.
- **Backend Returns**:
  ```json
  {
    "success": true,
    "data": {
      "userGreetingName": "string (e.g., 'Jamie')",
      "streak": {
        "currentStreak": "number (days)",
        "longestStreak": "number (days)"
        // Potentially other streak related data like start/end dates
      },
      "pendingVerificationCount": "number",
      "pendingSystemsCount": "number", // Systems due today but not yet actioned
      "systemsForToday": [
        {
          "id": "string (system instance ID or system ID if unique for day)",
          "name": "string (e.g., 'Morning Jog (30 mins)')",
          "status": "string (e.g., 'Pending', 'Completed', 'Skipped', 'Awaiting Verification')",
          "details": "string (optional, brief details or last check-in note)",
          "scheduleTime": "string (e.g., '07:00 AM', optional)"
        }
        // ... more systems for today
      ],
      "dailyReflectionPrompts": [
        { "id": "string (prompt ID)", "text": "string (prompt question)" }
        // ... more prompts
      ],
      "verificationAlerts": [
        {
          "id": "string (alert ID or related system instance ID)",
          "systemName": "string",
          "message": "string (e.g., 'Awaiting partner verification for run on YYYY-MM-DD')"
        }
      ]
    }
  }
  ```
- **Mock Data**: `MOCK_STREAK`, `MOCK_PENDING_VERIFICATIONS_COUNT`, `MOCK_PENDING_SYSTEMS_COUNT`, and structure within `dashboardData` state in `pages/dashboard.js`.

**POST /reflections**
- **Purpose**: Allows the authenticated user to log a daily reflection.
- **Frontend Sends**:
  ```json
  {
    "promptId": "string (ID of the chosen prompt, optional if custom)",
    "promptText": "string (text of the prompt, esp. if custom or for record)",
    "reflectionContent": "string (user's reflection text)",
    "date": "string (YYYY-MM-DD, optional, server can default to current date)"
  }
  ```
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "Reflection logged successfully.",
    "reflection": {
      "id": "string (ID of the logged reflection)",
      "promptId": "string (optional)",
      "promptText": "string",
      "reflectionContent": "string",
      "date": "string (YYYY-MM-DD)",
      "createdAt": "datetime"
    }
  }
  ```
- **Mock Data**: `loggedReflections` local state in `pages/dashboard.js`.


## Notifications & Activity Feed (/notifications, /activity)

Endpoints for user notifications and a more general activity feed. These might be consolidated or differentiated by type.

**GET /notifications**
- **Purpose**: Fetches notifications for the currently authenticated user. Can also serve as the basis for the Activity Feed if event types are filtered.
- **Query Params**:
    - `page` (integer, default 1): For pagination.
    - `limit` (integer, default 15): Items per page.
    - `filter` (string, e.g., "all", "unread", default "all"): Filters by read status.
    - `eventType` (string or array of strings, optional): To filter by specific notification/activity types (e.g., "goal_progress", "new_message", "system_checkin").
- **Backend Returns**:
  ```json
  {
    "success": true,
    "notifications": [ // or "activities"
      {
        "id": "string",
        "type": "string", // e.g., 'goal_achieved', 'system_checkin_due', 'partner_message', 'verification_request', 'system_checked_in', 'partner_commented'
        "title": "string (concise summary)",
        "message": "string (detailed message)",
        "timestamp": "datetime",
        "isRead": "boolean",
        "actionLink": "string (URL, optional, for deep-linking into the app)",
        "icon": "string (identifier for an icon, optional)",
        "actor": { // Optional, who performed the action
            "id": "string (user ID)",
            "name": "string",
            "avatarUrl": "string (optional)"
        },
        "target": { // Optional, what the action pertains to
            "type": "string (e.g., 'goal', 'system', 'messageThread')",
            "id": "string",
            "name": "string (optional)"
        }
      }
    ],
    "pagination": {
      "currentPage": "integer",
      "hasNextPage": "boolean",
      "totalPages": "integer (optional)",
      "unreadCount": "integer (optional, total unread for the user)"
    }
  }
  ```
- **Mock Data**: Used by `useNotifications` hook in `pages/activity.jsx` and directly in `pages/notifications.jsx`.

**PUT /notifications/{notificationId}/read** (or **PUT /activity/{activityId}/read**)
- **Purpose**: Marks a single notification or activity item as read.
- **Frontend Sends**: Nothing in body if ID is in path.
- **Backend Returns**: `{ "success": true, "message": "Marked as read." }` or the updated notification object.

**POST /notifications/mark-all-read** (or **POST /activity/mark-all-read**)
- **Purpose**: Marks all unread notifications/activities as read for the user.
- **Frontend Sends**: `{}` (empty body) or specify a filter e.g. `{ "filter": "olderThanSomeDate" }`
- **Backend Returns**: `{ "success": true, "message": "All notifications marked as read.", "markedCount": "integer" }`

## User Tasks (/tasks/my)

Endpoints for tasks assigned to the authenticated user.

**GET /tasks/my** (or **GET /users/me/tasks**)
- **Purpose**: Fetches tasks assigned to or associated with the currently authenticated user. These can be system check-ins, verification tasks, etc.
- **Query Params**:
    - `page` (integer, default 1): For pagination.
    - `limit` (integer, default 10): Items per page.
    - `status` (string, optional): Filter by task status (e.g., "Pending", "Completed", "Awaiting Verification").
    - `dueDateFrom` (date, optional): Filter tasks due from this date.
    - `dueDateTo` (date, optional): Filter tasks due up to this date.
    - `sortBy` (string, optional): e.g., "dueDate_asc", "status_desc".
- **Backend Returns**:
  ```json
  {
    "success": true,
    "tasks": [
      {
        "id": "string (task instance ID)",
        "title": "string (e.g., 'Morning Run - Check-in', 'Verify Partner\'s Gym Session')",
        "type": "string (e.g., 'system_checkin', 'partner_verification', 'manual_task')",
        "status": "string (e.g., 'Pending', 'In Progress', 'Completed', 'Skipped', 'Awaiting Verification', 'Verified', 'Queried')",
        "dueDate": "datetime (optional)",
        "description": "string (details about the task)",
        "relatedGoal": { // Optional
          "id": "string",
          "name": "string"
        },
        "relatedSystem": { // Optional, if it's a system check-in task
          "id": "string",
          "name": "string"
        },
        "requiresImageVerification": "boolean (default false, for system check-ins)",
        "verificationImageUrl": "string (URL, if image submitted for verification)",
        "partnerComments": "string (if partner queried the verification)"
        // Any other fields necessary for display in MyTaskItemCard
      }
    ],
    "pagination": {
      "currentPage": "integer",
      "hasNextPage": "boolean",
      "totalPages": "integer (optional)"
    }
  }
  ```
- **Mock Data**: `MOCK_USER_ID` used in `pages/my-tasks.jsx`. Structure needs to be inferred from `MyTaskItemCard` and related system/goal data.

**GET /tasks/my/{taskId}** (New Endpoint)
- **Purpose**: Fetches detailed information for a specific task assigned to the authenticated user, often a "system task" instance.
- **Path Params**: `taskId` (string - this is the `systemId` from the frontend context of `pages/systems/[systemId].jsx`).
- **Backend Returns**:
  ```json
  {
    "success": true,
    "task": {
      "id": "string (task ID)",
      "name": "string (System name / Task title, e.g., 'Morning Jog')",
      "status": "string (e.g., 'Pending', 'Completed', 'Awaiting Verification', 'Queried')",
      "goalName": "string (Name of the associated goal, optional)",
      "assignedDate": "datetime (or due date)",
      "details": "string (Description of the system/task)",
      "requiresImageVerification": "boolean",
      "verificationImageUrl": "string (URL of the submitted image, if any)",
      "partnerComments": "string (Feedback from partner if status is 'Queried', optional)",
      "recentActivity": [
        { 
          "status": "string (e.g., 'Created', 'Completed', 'Verification Submitted')", 
          "date": "datetime",
          "actorName": "string (e.g., 'You', 'Partner Name')" // Optional
        }
      ],
      "scheduleDescription": "string (e.g., 'Daily at 08:00 AM', 'Mon, Wed, Fri')",
      "currentStreakForSystem": "integer (days, specific to this system template)",
      "longestStreakForSystem": "integer (days, specific to this system template)",
      "totalCompletions": "integer (count for this system template)"
    }
  }
  ```

- **Mock Data**: Used by `myTasksService.getSystemTaskDetails` in `pages/systems/[systemId].jsx`.

## Progress & Statistics (/progress)

Endpoints for fetching and displaying user progress data, possibly goal-specific or overall.

**GET /progress**
- **Purpose**: Fetches progress data for the authenticated user.
- **Query Params**:
    - `goalId` (string, optional): If provided, scopes progress to this specific goal. If omitted, provides overall user progress summary.
    - `dateRangePreset` (string, e.g., "last7d", "last30d", "monthToDate", "allTime", "custom"; default "last7d").
    - `startDate` (date, optional): Custom start date if `dateRangePreset` is "custom".
    - `endDate` (date, optional): Custom end date if `dateRangePreset` is "custom".
    - `comparePartner` (boolean, default false): If true, the backend should attempt to include comparable data for the user's active partner.
- **Backend Returns**:
  ```json
  {
    "success": true,
    "data": {
      "goalTitle": "string (e.g., 'Run a 5k', or 'Overall Progress')",
      "partnerProfile": { // Included if comparePartner is true and partner exists
        "userId": "string",
        "username": "string"
      },
      "personalStats": {
        "overallConsistency": "number (percentage, 0-100)",
        "currentStreak": "number (days)",
        "longestStreak": "number (days)",
        "mostConsistentDay": "string (e.g., 'Wednesdays', 'N/A')",
        "totalCheckIns": "number (for the period/goal)",
        "systemsCompleted": "number (for the period/goal)"
        // ... other summary stats
      },
      "partnerStats": { // Included if comparePartner is true
        "overallConsistency": "number (percentage, 0-100)",
        // ... other comparable partner stats
      },
      "userSystemsList": [ // Relevant systems for context, esp. if goal-specific
        { "id": "string (system ID)", "name": "string" }
      ],
      "consistencyOverTime": [ // Data points for line chart
        // Each point represents a unit of time within the dateRange (e.g., day, week)
        {
          "dateLabel": "string (e.g., 'YYYY-MM-DD', 'Week 42', 'Mon')",
          "userConsistency": "number (percentage)",
          "partnerConsistency": "number (percentage, optional, if comparing)"
        }
      ],
      "systemEngagement": [ // Data for bar chart (metrics logged per system)
        {
          "systemId": "string",
          "systemName": "string",
          "userLoggedCount": "number",
          "partnerLoggedCount": "number (optional, if comparing)"
        }
      ]
      // Potentially other chart data like 'Achievements Unlocked'
    }
  }
  ```
- **Mock Data**: `mockInitialProgressData` and `userId` in `pages/progress.jsx`.

This covers the main files in the `pages` directory. The sub-directories like `pages/goals`, `pages/partnership`, `pages/systems` will be analyzed next.

## Goals API (/goals)

Endpoints for managing user goals. Goals are assumed to be associated with the authenticated user.

**GET /goals**
- **Purpose**: Fetches a list of all goals for the authenticated user.
- **Query Params (Optional)**:
    - `status` (string): Filter by goal status.
    - `priority` (string): Filter by priority.
    - `category` (string): Filter by category.
    - `sortBy` (string): e.g., "targetDate_asc", "priority_desc".
- **Backend Returns**:
  ```json
  {
    "success": true,
    "goals": [
      {
        "id": "string",
        "title": "string",
        "description": "string (optional)",
        "category": "string (optional)",
        "priority": "string (e.g., 'High', 'Medium', 'Low')",
        "status": "string (e.g., 'Not Started', 'In Progress', 'Achieved', 'On Hold', 'Abandoned')",
        "startDate": "date (YYYY-MM-DD, optional)",
        "targetDate": "date (YYYY-MM-DD, optional)",
        "progressValue": "number (0-100, calculated or stored)",
        "aiAssistedPlan": "string (optional, if AI helped generate a plan)",
        "partnerId": "string (optional, if goal is shared or linked to a partner)"
        // userId is implicit
      }
    ]
  }
  ```
- **Mock Data**: `progressValue` is mocked in `pages/goals/index.js`.

**POST /goals**
- **Purpose**: Creates a new goal for the authenticated user.
- **Frontend Sends**:
  ```json
  {
    "title": "string",
    "description": "string (optional)",
    "category": "string (optional)",
    "priority": "string (e.g., 'High', 'Medium', 'Low')",
    "status": "string (e.g., 'Not Started', defaults by backend if not sent)",
    "startDate": "date (YYYY-MM-DD, optional)",
    "targetDate": "date (YYYY-MM-DD, optional)",
    "aiAssistedPlan": "string (optional)"
    // userId is implicit from auth token
  }
  ```
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "Goal created successfully!",
    "goal": {
      // ... full new goal object, including its 'id'
    }
  }
  ```

**GET /goals/{goalId}**
- **Purpose**: Fetches details for a specific goal.
- **Path Params**: `goalId` (string).
- **Backend Returns**:
  ```json
  {
    "success": true,
    "goal": {
      // ... full goal object as in GET /goals list
    }
  }
  ```
  Returns 404 if not found or user not authorized.

**PUT /goals/{goalId}**
- **Purpose**: Updates an existing goal.
- **Path Params**: `goalId` (string).
- **Frontend Sends**: Object with fields to update (or full goal object).
  ```json
  {
    "title": "string",
    "description": "string (optional)",
    // ... any other updatable goal fields
    "status": "string"
  }
  ```
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "Goal updated successfully!",
    "goal": {
      // ... full updated goal object
    }
  }
  ```

**DELETE /goals/{goalId}**
- **Purpose**: Deletes a specific goal.
- **Path Params**: `goalId` (string).
- **Backend Policy**:
    - **Option 1 (Cascade Delete)**: Deletes the goal AND all associated systems. (As suggested by `pages/goals/[goalId]/index.js` dialog).
    - **Option 2 (Unlink/Orphan)**: Deletes the goal but unlinks or orphans associated systems. (As suggested by `pages/goals/index.js` dialog).
    - **This needs to be a firm decision.** For now, documentation will assume Option 1 based on the more specific UI warning.
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "Goal and associated systems deleted successfully." // Message reflects cascade
  }
  ```

## Systems API (/systems, /goals/{goalId}/systems)

Endpoints for managing systems, which are actionable components of goals.

**GET /goals/{goalId}/systems** (or **GET /systems?goalId={goalId}**)
- **Purpose**: Fetches all systems associated with a specific goal.
- **Path Params**: `goalId` (string) (if using first URL pattern).
- **Query Params**: `goalId` (string) (if using second URL pattern).
- **Backend Returns**:
  ```json
  {
    "success": true,
    "systems": [
      {
        "id": "string",
        "goalId": "string",
        "title": "string",
        "description": "string (optional)",
        "status": "string (e.g., 'Active', 'Inactive', 'Paused')",
        "frequency": "string (e.g., 'Daily', 'Weekly', 'Mon,Wed,Fri')",
        "frequencyDetails": { /* e.g., { "type": "daily", "time": "09:00" } or { "type": "weekly", "days": ["Mon", "Wed"], "time": "17:30" } */ },
        "checkInType": "string (e.g., 'Simple', 'Numeric', 'Photo')",
        "checkInReminder": "boolean (optional, default false)",
        "reminderTime": "string (HH:MM, optional if reminder is true)",
        "enableImageVerification": "boolean (optional, default false)",
        "aiAssistanceUsed": "boolean (optional)"
      }
    ]
  }
  ```

**POST /systems** (or **POST /goals/{goalId}/systems**)
- **Purpose**: Creates a new system and associates it with a goal.
- **Frontend Sends**:
  ```json
  {
    "goalId": "string (mandatory)",
    "title": "string",
    "description": "string (optional)",
    "status": "string (e.g., 'Active', defaults by backend if not sent)",
    "frequency": "string",
    "frequencyDetails": { /* structured object for schedule */ },
    "checkInType": "string",
    "checkInReminder": "boolean (optional)",
    "reminderTime": "string (HH:MM, optional)",
    "enableImageVerification": "boolean (optional)",
    "aiAssistanceUsed": "boolean (optional)"
    // userId is implicit from auth token
  }
  ```
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "System created successfully!",
    "system": {
      // ... full new system object, including its 'id' and 'goalId'
    }
  }
  ```

**GET /systems/{systemId}**
- **Purpose**: Fetches details for a specific system.
- **Path Params**: `systemId` (string).
- **Backend Returns**:
  ```json
  {
    "success": true,
    "system": {
      // ... full system object as defined in GET /goals/{goalId}/systems list
    }
  }
  ```
  Returns 404 if not found or user not authorized (e.g., if system belongs to a goal of another user).

**PUT /systems/{systemId}**
- **Purpose**: Updates an existing system.
- **Path Params**: `systemId` (string).
- **Frontend Sends**: Object with fields to update. `goalId` is usually not changed here, but if sent, backend should validate it matches the existing `goalId`.
  ```json
  {
    "title": "string",
    "description": "string (optional)",
    // ... any other updatable system fields
    "status": "string"
  }
  ```
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "System updated successfully!",
    "system": {
      // ... full updated system object
    }
  }
  ```

**DELETE /systems/{systemId}**
- **Purpose**: Deletes a specific system. (Note: UI for this is not explicitly in `pages/goals` but is a standard CRUD operation).
- **Path Params**: `systemId` (string).
- **Backend Returns**:
  ```json
  {
    "success": true,
    "message": "System deleted successfully."
  }
  ```
- **Note**: If a system is deleted, consider implications for task generation, progress tracking, etc.

This completes the analysis of the `/pages/goals` directory.