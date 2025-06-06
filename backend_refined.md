# Refined DuoTrak Backend Specification (MVP)

**Document Version:** 2.0
**Date:** June 5, 2025
**Project:** DuoTrak - AI-Assisted Accountability Partner Web Application

---

## 1. Overall Architecture & Principles

### 1.1. Core Purpose
The DuoTrak backend serves as the central data repository and business logic engine for the AI-Assisted Accountability Partner Web Application. It is responsible for managing user data, partnerships, goals, systems, check-ins, daily reflections, direct messaging, progress tracking, notifications, and interactions with AI for planning assistance. It provides a secure and scalable API for the Next.js frontend.

### 1.2. Core Technologies
*   **Framework:** FastAPI (Python 3.9+)
*   **Database:** PostgreSQL (managed via Supabase)
*   **ORM:** SQLAlchemy (with Alembic for migrations)
*   **Data Validation/Serialization:** Pydantic
*   **Authentication:** Supabase Auth (JWT-based)
*   **Asynchronous Server Gateway Interface (ASGI):** Uvicorn/Gunicorn
*   **External Service Integrations (Conceptual for MVP, via SDKs):**
    *   Resend SDK (for transactional emails)
    *   Google Gemini SDK (for AI planning assistance)
    *   Supabase Python Client (for Auth interactions and potentially Storage)

### 1.3. Architectural Principles

*   **Layered Architecture:** The backend will follow a clear separation of concerns through a layered architecture:
    *   **API/Router Layer (FastAPI):** Defines HTTP endpoints, handles request validation using Pydantic, and delegates business logic to the Service Layer. Responsible for crafting appropriate HTTP responses.
    *   **Service Layer (Business Logic):** Contains the core application logic, orchestrates operations, interacts with the Data Access Layer, and calls external services. This layer enforces business rules and authorization.
    *   **Data Access (CRUD) Layer (SQLAlchemy):** Encapsulates direct database interactions (Create, Read, Update, Delete) using SQLAlchemy ORM models. Provides an abstraction over the database for the Service Layer.
    *   *(Frontend Implication: The frontend interacts exclusively with the API/Router Layer.)*

*   **Stateless Design:** The FastAPI application itself will be stateless. All persistent state will be managed in the Supabase PostgreSQL database or through client-side sessions (JWTs managed by Supabase Auth and utilized by the frontend). This facilitates scalability and simplifies deployment.

*   **Asynchronous Operations (`async/await`):** All I/O-bound operations (database queries, external API calls to services like Gemini, Resend, or Supabase) **MUST** be implemented using Python's `async` and `await` keywords. This ensures non-blocking behavior, allowing FastAPI to handle a high number of concurrent requests efficiently.

*   **Dependency Injection (FastAPI):** FastAPI's dependency injection system will be leveraged extensively for:
    *   Managing database sessions (`AsyncSession`) per request.
    *   Providing the current authenticated user context to protected endpoints.
    *   Injecting service instances or configurations where needed.

*   **Configuration Management:**
    *   Sensitive information (database URL, API keys for external services, JWT secret for Supabase token verification) **MUST** be managed via environment variables.
    *   Pydantic's `Settings` management will be used to load and validate these configurations, providing typed access within the application.

*   **Modularity:** The codebase will be organized into logical modules (e.g., by feature or layer) to promote maintainability, testability, and reusability.

---

## 2. API Design Philosophy

### 2.1. RESTful Principles
*   The API will adhere to RESTful design principles.
*   **HTTP Methods:** Standard HTTP methods (GET, POST, PUT, DELETE, PATCH) will be used according to their semantic meaning for resource manipulation.
*   **Resource-Oriented URLs:** URLs will be designed around resources (e.g., `/users`, `/goals`, `/systems`).
*   **Statelessness:** Each request from a client to the server must contain all the information needed to understand the request. The server will not store any client context between requests (session state is managed via JWTs).

### 2.2. Data Format
*   **JSON for Request/Response:** All data exchanged between the frontend and backend (request bodies and response payloads) **MUST** be in JSON format. FastAPI handles this natively with Pydantic.

### 2.3. API Versioning
*   The API will be versioned via a URL prefix. The initial version will be `/api/v1/`.
    *   Example: `https://yourdomain.com/api/v1/users/me`

### 2.4. Request & Response Structure (Pydantic-driven)
*   **Request Validation:** All incoming request bodies and query parameters will be strictly validated using Pydantic models defined in `app/schemas/`.
*   **Response Serialization:** All API responses will be serialized using Pydantic models to ensure a consistent and well-defined structure.
*   **Common Response Pattern (as per `backend.md` expectation):** Many responses, especially for mutations (POST, PUT, DELETE), should aim to include:
    ```json
    {
      "success": true, // or false
      "message": "Descriptive message about the operation's outcome.",
      "data": { /* optional: payload if applicable */ }
    }
    ```
    For list endpoints, a pagination object should be included if pagination is applied.

### 2.5. HTTP Status Codes
Standard HTTP status codes will be used to indicate the outcome of API requests:
*   `200 OK`: Successful GET, PUT, PATCH.
*   `201 Created`: Successful POST (resource creation).
*   `202 Accepted`: Request accepted for processing (e.g., for an async task, though less common for DuoTrak MVP).
*   `204 No Content`: Successful DELETE, or successful PUT/PATCH where no content is returned.
*   `400 Bad Request`: General client-side error (e.g., malformed JSON, invalid parameters not caught by Pydantic).
*   `401 Unauthorized`: Authentication is required and has failed or has not yet been provided. JWT is missing, invalid, or expired.
*   `403 Forbidden`: Authenticated user does not have permission to access the requested resource.
*   `404 Not Found`: The requested resource does not exist.
*   `409 Conflict`: Request could not be processed because of a conflict in the current state of the resource (e.g., trying to create a resource that already exists, like a username).
*   `422 Unprocessable Entity`: The request was well-formed but contained semantic errors (FastAPI's default for Pydantic validation errors).
*   `500 Internal Server Error`: A generic error message for unexpected server-side conditions.
*   `502 Bad Gateway` / `503 Service Unavailable`: If an upstream service (e.g., external AI API) is down or unresponsive.

### 2.6. Authentication
*   Authentication for protected endpoints **MUST** be JWT-based, using tokens issued by Supabase Auth.
*   The frontend will send the JWT access token in the `Authorization` header as a Bearer token: `Authorization: Bearer <token>`.
*   A FastAPI dependency (`get_current_user`) will verify the token and retrieve the authenticated user.

### 2.7. Idempotency
*   `PUT` and `DELETE` operations should be designed to be idempotent where appropriate (i.e., making the same request multiple times has the same effect as making it once).
*   `POST` operations for resource creation are typically not idempotent.

### 2.8. Pagination
*   All API endpoints returning lists of resources (e.g., `GET /goals`, `GET /notifications`) **MUST** implement pagination to prevent excessive data transfer and ensure responsive performance.
*   Offset/limit based pagination is standard (e.g., `?page=1&limit=20`).
*   Responses for paginated lists should include pagination metadata (e.g., `currentPage`, `hasNextPage`, `totalPages`, `totalItems`).

---

## 3. Directory Structure (Illustrative for FastAPI)

The project will adhere to a logical directory structure to organize code by responsibility and feature. This promotes maintainability and scalability.
duotrak-backend/
├── app/ # Main application module
│ ├── init.py
│ ├── main.py # FastAPI app instance, middleware, lifespan events
│ │
│ ├── api/ # API Routers and dependencies
│ │ ├── init.py
│ │ ├── deps.py # Dependency injection functions (get_db, get_current_user)
│ │ └── routers/ # FastAPI routers (endpoints)
│ │ ├── init.py
│ │ ├── auth.py
│ │ ├── users.py
│ │ ├── partnerships.py
│ │ ├── goals.py
│ │ ├── systems.py
│ │ ├── checkins.py
│ │ ├── verifications.py
│ │ ├── reflections.py
│ │ ├── messages.py
│ │ ├── progress.py
│ │ ├── notifications.py
│ │ └── ai_planner.py
│ │
│ ├── core/ # Core application logic, configuration, security
│ │ ├── init.py
│ │ ├── config.py # Pydantic settings, environment variable loading
│ │ └── security.py # Password hashing (if not fully Supabase), JWT utils (if needed beyond Supabase verification)
│ │
│ ├── db/ # Database related modules
│ │ ├── init.py
│ │ ├── base_class.py # SQLAlchemy Base declarative class
│ │ ├── models/ # SQLAlchemy ORM models
│ │ │ ├── init.py
│ │ │ ├── user.py
│ │ │ ├── partnership.py
│ │ │ └── ... (other model files)
│ │ └── session.py # SQLAlchemy engine, SessionLocal setup
│ │
│ ├── schemas/ # Pydantic schemas for request/response validation & serialization
│ │ ├── init.py
│ │ ├── user_schemas.py
│ │ ├── token_schemas.py # Schemas for JWTs/tokens
│ │ ├── goal_schemas.py
│ │ └── ... (other schema files, organized by resource)
│ │
│ ├── services/ # Business logic layer
│ │ ├── init.py
│ │ ├── auth_service.py
│ │ ├── user_service.py
│ │ ├── partnership_service.py
│ │ └── ... (other service files, corresponding to resources/features)
│ │
│ └── crud/ # Data Access Layer (CRUD operations)
│ ├── init.py
│ ├── base_crud.py # (Optional) Base CRUD class with common methods
│ ├── crud_user.py
│ ├── crud_goal.py
│ └── ... (other CRUD modules for each model)
│
├── alembic/ # Alembic migration scripts and configuration
│ └── ...
├── alembic.ini # Alembic configuration file
├── .env.example # Example environment variables file
├── requirements.txt # Python dependencies
├── README.md
└── ... (other project files like .gitignore, Dockerfile (Post-MVP))


*   **Core Guideline for AI (Directory Structure):** Generate code files according to this structure or a similar logical FastAPI convention. This organization is key for managing complexity.

---

## 4. Database Schema & Models (SQLAlchemy)

**General Implementation Notes for AI (Models):**
*   All SQLAlchemy models will be defined in separate Python files within `app/db/models/`.
*   Models will inherit from a `Base` class defined in `app/db/base_class.py` (`Base = declarative_base()`).
*   Primary keys will typically be UUIDs, imported from `sqlalchemy.dialects.postgresql import UUID` and using `default=uuid.uuid4`.
*   All `DateTime` fields **MUST** use `DateTime(timezone=True)` to ensure timezone awareness.
*   Relationships between models will be defined using SQLAlchemy's `relationship()` construct, with appropriate `back_populates` or `backref` arguments.
*   Foreign keys will use `ForeignKey("tablename.columnname")`.
*   Indexes should be created for frequently queried columns and all foreign keys (`index=True`).
*   Table names (`__tablename__`) will be lowercase and plural (e.g., "users", "goals").

---

### 4.1. User Model (`app/db/models/user.py`)

```python
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from ..base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4) # Maps to Supabase auth.users.id
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=True) # Primary unique identifier for app logic
    name = Column(String, nullable=True) # Optional display name, as per backend.md
    
    # Hashed password is NOT stored here if relying solely on Supabase Auth for password management.
    # If direct backend password management were ever needed (e.g., for admin-created users outside Supabase flow),
    # a hashed_password field would be added here. For now, assume Supabase handles it.

    profile_image_url = Column(String, nullable=True) # Corresponds to avatarUrl in frontend expectations
    bio = Column(Text, nullable=True)
    timezone = Column(String, nullable=False) # IANA timezone name

    is_active = Column(Boolean, default=True, nullable=False)
    is_email_verified = Column(Boolean, default=False, nullable=False) # Synced from/with Supabase Auth

    # Partnership (One-to-One or One-to-Many if user can be in multiple, but MVP is one)
    # Assuming a user can be part of at most one active partnership at a time as either user1 or user2
    # This partnership_id directly links to the partnership they are currently active in.
    current_partnership_id = Column(UUID(as_uuid=True), ForeignKey("partnerships.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Relationships
    # This relationship helps fetch the partnership details if current_partnership_id is set.
    current_partnership = relationship("Partnership", foreign_keys=[current_partnership_id], backref="active_partners_via_current_id", lazy="selectin")

    # Relationships to partnerships where this user is user1 or user2
    # These are useful for finding all partnerships a user has ever been part of, if needed.
    partnerships_as_user1 = relationship("Partnership", foreign_keys="[Partnership.user1_id]", back_populates="user1", lazy="selectin")
    partnerships_as_user2 = relationship("Partnership", foreign_keys="[Partnership.user2_id]", back_populates="user2", lazy="selectin")

    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    systems_created = relationship("System", back_populates="user", cascade="all, delete-orphan", lazy="selectin") # Systems this user owns/created
    checkins_made = relationship("Checkin", back_populates="user", cascade="all, delete-orphan", lazy="selectin") # Checkins made by this user
    
    # Checkins this user verified for their partner
    verified_checkins = relationship("Checkin", foreign_keys="[Checkin.verified_by_partner_id]", back_populates="verifier", lazy="selectin")

    reflections = relationship("Reflection", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    
    messages_sent = relationship("DirectMessage", foreign_keys="[DirectMessage.sender_id]", back_populates="sender", lazy="selectin")
    # messages_received is implicitly handled by querying messages where partnership_id matches and sender_id is not current_user.id

    notifications_received = relationship("Notification", foreign_keys="[Notification.recipient_id]", back_populates="recipient", cascade="all, delete-orphan", lazy="selectin")
    notifications_acted = relationship("Notification", foreign_keys="[Notification.actor_user_id]", back_populates="actor", lazy="selectin") # Notifications where this user was the actor

    # Theme preference, as per backend.md
    theme_preference = Column(String, nullable=True, default="system") # e.g., 'light', 'dark', 'system'

    # Notification preferences, as per backend.md
    # Storing as JSONB for flexibility, or could be separate related table for more complex prefs.
    notification_preferences = Column(JSONB, nullable=True, default=lambda: [
        { "id": "systemUpdates", "label": "System Updates", "enabled": True },
        { "id": "goalProgress", "label": "Goal Progress & Streaks", "enabled": True },
        # Add other default preferences here
    ])


    last_daily_summary_sent_at = Column(DateTime(timezone=True), nullable=True)
    last_daily_summary_local_date = Column(Date, nullable=True) # Tracks the local date for which summary was sent

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    Developer Action Point (User Model):
Confirm if username should be mandatory or if email is the primary login identifier and username is optional/display. The current model makes username nullable but indexed and unique if provided.
The current_partnership_id and current_partnership relationship assumes a user is in at most one active partnership. If historical partnerships need to be easily queried directly from the user, the partnerships_as_user1 and partnerships_as_user2 are useful. For MVP, focusing on the current active one via current_partnership_id is key.
Review default notification_preferences.

4.2. Partnership Model (app/db/models/partnership.py)

from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime, timedelta
from enum import Enum as PyEnum
from ..base_class import Base

class PartnershipStatus(PyEnum):
    PENDING_INVITE = "pending_invite" # User1 invited User2
    ACTIVE = "active"
    DISSOLVED = "dissolved" # Ended by one of the users
    EXPIRED_INVITE = "expired_invite" # Invite token expired

class Partnership(Base):
    __tablename__ = "partnerships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True) # As per backend.md (POST /partnerships/setup)

    user1_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True) # Initiator
    user2_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)  # Accepter (nullable until accepted)

    status = Column(SQLAlchemyEnum(PartnershipStatus), default=PartnershipStatus.PENDING_INVITE, nullable=False, index=True)

    # Invitation specific fields
    invite_token = Column(String, unique=True, index=True, nullable=True) # Null after acceptance/expiry
    invite_token_expires_at = Column(DateTime(timezone=True), nullable=True)
    invite_email = Column(String, nullable=True) # Email the invite was sent to (for User2 before they sign up/accept)

    # Relationships
    user1 = relationship("User", foreign_keys=[user1_id], back_populates="partnerships_as_user1")
    user2 = relationship("User", foreign_keys=[user2_id], back_populates="partnerships_as_user2")

    direct_messages = relationship("DirectMessage", back_populates="partnership", cascade="all, delete-orphan", lazy="selectin")

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # When partnership becomes active
    activated_at = Column(DateTime(timezone=True), nullable=True)
    # When partnership is dissolved
    dissolved_at = Column(DateTime(timezone=True), nullable=True)


Developer Action Point (Partnership Model):
The ondelete="CASCADE" for user1_id and user2_id means if a user is deleted, their partnerships are also deleted. This might be desired, or ondelete="SET NULL" with logic to handle orphaned partnerships might be preferred (e.g., dissolve them). For MVP, CASCADE is simpler if user deletion means full data removal.
Consider logic for invite_token_expires_at (e.g., default to 7 days from creation).


4.3. Goal Model (app/db/models/goal.py)

from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Date, Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from enum import Enum as PyEnum
from ..base_class import Base

class GoalStatus(PyEnum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    ACHIEVED = "achieved"
    ON_HOLD = "on_hold"
    ABANDONED = "abandoned"

class GoalPriority(PyEnum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class Goal(Base):
    __tablename__ = "goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    category = Column(String, nullable=True, index=True) # As per backend.md
    priority = Column(SQLAlchemyEnum(GoalPriority), default=GoalPriority.MEDIUM, nullable=True) # As per backend.md
    status = Column(SQLAlchemyEnum(GoalStatus), default=GoalStatus.NOT_STARTED, nullable=False, index=True) # As per backend.md
    
    start_date = Column(Date, nullable=True) # As per backend.md
    target_date = Column(Date, nullable=True, index=True) # As per backend.md
    
    # progress_value is likely a calculated field for responses, not stored directly unless denormalized.
    # For MVP, calculate on the fly or omit from DB model.
    
    ai_assistance_inputs = Column(JSONB, nullable=True) # To store original user inputs for AI planning
    ai_generated_plan_details = Column(Text, nullable=True) # Store AI's raw plan/suggestions if needed, as per backend.md "aiAssistedPlan"

    # If a goal can be directly linked to a partner (beyond the user's main partnership)
    # This is a new concept from backend.md, original spec implied goals are personal.
    # For MVP, let's assume goals are primarily personal and partnership context comes from the user.
    # If direct goal-to-partner linking is needed, this would be:
    # shared_with_partner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)

    is_archived = Column(Boolean, default=False, nullable=False, index=True) # For soft deletes/archiving

    # Relationships
    user = relationship("User", back_populates="goals")
    systems = relationship("System", back_populates="goal", cascade="all, delete-orphan", lazy="selectin")

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


Developer Action Point (Goal Model):
Decide on progress_value storage: calculated or denormalized. For MVP, calculated is fine.
Clarify shared_with_partner_id necessity. The current model assumes goals are primarily tied to the user_id.


4.4. System Model (app/db/models/system.py)

from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Enum as SQLAlchemyEnum, Time, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from enum import Enum as PyEnum
from ..base_class import Base

class SystemFrequency(PyEnum):
    DAILY = "daily"
    WEEKLY = "weekly"
    # Potentially MONTHLY or specific days like "Mon,Wed,Fri" if stored as string. JSONB for frequency_details is more flexible.

class SystemMetricType(PyEnum):
    BINARY = "binary" # Done / Not Done
    COUNTER = "counter" # e.g., reps, items
    DURATION = "duration" # e.g., minutes, hours
    PAGES = "pages" # e.g., pages written

class SystemStatus(PyEnum): # Status of the system template itself, not daily check-in
    ACTIVE = "active"
    INACTIVE = "inactive"
    PAUSED = "paused"

class System(Base):
    __tablename__ = "systems"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True) # Owner of the system
    goal_id = Column(UUID(as_uuid=True), ForeignKey("goals.id", ondelete="CASCADE"), nullable=True, index=True) # Optional: system can be standalone

    title = Column(String, nullable=False) # Concise name/title for the system
    description = Column(Text, nullable=False) # Detailed description of what to do

    status = Column(SQLAlchemyEnum(SystemStatus), default=SystemStatus.ACTIVE, nullable=False, index=True) # Status of the system template

    # Scheduling and Metrics (incorporating backend.md details)
    frequency = Column(SQLAlchemyEnum(SystemFrequency), nullable=False) # e.g., daily, weekly
    frequency_details = Column(JSONB, nullable=True) 
    # For 'weekly': { "days_of_week": [0,1,2,3,4,5,6] } (0=Monday)
    # For 'daily': can be null or {}
    
    metric_type = Column(SQLAlchemyEnum(SystemMetricType), nullable=False)
    target_value = Column(Float, nullable=True) # For quantifiable metrics
    target_unit = Column(String, nullable=True) # e.g., "minutes", "pages", "reps"
    
    target_time_local = Column(Time, nullable=True) # HH:MM local time for daily systems, if specified

    verification_required = Column(Boolean, default=False, nullable=False)
    # enableImageVerification from backend.md is essentially this field.
    
    checkin_reminder = Column(Boolean, default=False, nullable=True) # As per backend.md
    reminder_time_local = Column(Time, nullable=True) # As per backend.md, if reminder is true

    ai_assistance_used = Column(Boolean, default=False, nullable=True) # As per backend.md

    # Relationships
    user = relationship("User", back_populates="systems_created")
    goal = relationship("Goal", back_populates="systems")
    checkins = relationship("Checkin", back_populates="system", cascade="all, delete-orphan", lazy="selectin") # All checkins for this system template

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


Developer Action Point (System Model):
The frequency_details JSONB structure needs to be well-defined for how "weekly" (specific days) or other complex frequencies are stored and queried.
target_time_local and reminder_time_local store Time objects. Logic will be needed to combine these with dates and user timezones.

4.5. Check-in Model (app/db/models/checkin.py)
Purpose: Represents a single instance of a user performing or logging activity against one of their defined Systems. This is a core interaction in the application.
Key Fields & Explanations:
id (UUID, Primary Key): Unique identifier for the check-in record.
user_id (UUID, ForeignKey to users.id, Indexed): The user who performed and logged this check-in. This is crucial for ownership and data retrieval.
system_id (UUID, ForeignKey to systems.id, Indexed): The specific System this check-in pertains to.
partnership_id (UUID, ForeignKey to partnerships.id, Indexed, Nullable): The partnership active at the time of this check-in. This is important for associating the check-in with the partner, especially for verification and activity feeds. It's nullable in case a user is checking in systems while not in an active partnership (though MVP focuses on partnered use).
checkin_timestamp_utc (DateTime with Timezone, Indexed): The exact UTC timestamp when the check-in was recorded on the server. This is the authoritative time for sequencing and data processing.
original_local_timestamp_str (String, Nullable): The user's local date and time string (e.g., "2025-06-05 08:30:00") when they performed the action, captured for context. This helps reconcile user perception with server time.
status (String Enum, Indexed): The outcome of the check-in. Values based on original spec and refined by frontend needs:
'completed': The user successfully completed the system.
'skipped': The user consciously skipped the system.
'pending_verification': The user completed it, but it requires partner verification (if System.verification_required is true).
'verified_completed': The partner has verified this check-in as completed.
'queried_by_partner': The partner has queried this check-in, seeking more information or clarification.
(Note: 'awaitingUserVerification' from the frontend spec for SystemCardData is a derived state for the current viewing user, not a status of the check-in itself. It means a partner's check-in is 'pending_verification' by them, and the current user needs to act.)
metric_value_logged (Float, Nullable): If the System has a quantifiable metric (e.g., pages written, minutes exercised), this stores the value logged by the user.
notes (Text, Nullable): Any textual notes or comments the user added for this specific check-in.
photo_url (String, Nullable): If the user uploaded a photo as part of the check-in (e.g., for verification or just as a record), this field stores the URL to the image (likely hosted on Supabase Storage).
verified_by_partner_id (UUID, ForeignKey to users.id, Nullable, Indexed): If the check-in was verified or queried, this stores the ID of the partner who performed the verification action.
verified_at_utc (DateTime with Timezone, Nullable): The UTC timestamp when the verification action (approve/query) was performed.
verifier_query (Text, Nullable): If the partner queried the check-in, their specific question or comment is stored here.
created_at (DateTime with Timezone): Timestamp of record creation.
updated_at (DateTime with Timezone): Timestamp of last update.
Relationships:
user (Many-to-One with User): The user who made the check-in.
system (Many-to-One with System): The system this check-in is for.
partnership (Many-to-One with Partnership): The partnership context.
verifier (Many-to-One with User, using verified_by_partner_id): The partner who verified/queried.
comments (One-to-Many with Comment - Post-MVP): If check-ins can have comment threads.
reactions (One-to-Many with Reaction - Post-MVP): If check-ins can be reacted to.
Developer Action Point (Check-in Model):
Ensure the status enum covers all necessary states for the verification workflow.
The logic for deriving 'awaitingUserVerification' for display on the dashboard will happen in the service layer, not by storing this status directly on the check-in.
4.6. Reflection Model (app/db/models/reflection.py)
Purpose: Stores users' daily reflections on their progress, challenges, and learnings.
Key Fields & Explanations:
id (UUID, Primary Key): Unique identifier for the reflection.
user_id (UUID, ForeignKey to users.id, Indexed): The user who wrote this reflection.
partnership_id (UUID, ForeignKey to partnerships.id, Indexed, Nullable): The partnership active at the time of this reflection, to associate it with the partner for potential sharing or activity feeds.
reflection_date_local (Date, Indexed): The specific local date for which this reflection is being made (e.g., "2025-06-05"). This is crucial as reflections are daily. A unique constraint on (user_id, reflection_date_local) ensures only one reflection per user per day.
content (Text, Nullable): The main body of the user's reflection. The original spec mentioned went_well, did_not_go_well, can_improve. For MVP, a single content field is simpler. If structured reflection is desired, these could be separate Text fields or a JSONB field. backend.md (POST /reflections) implies a single reflectionContent.
Decision: Use a single content: Text field for MVP.
prompt_id (String, Nullable): If the reflection was based on a specific prompt from backend.md (POST /reflections).
prompt_text (Text, Nullable): The actual text of the prompt used, for record-keeping.
created_at (DateTime with Timezone): Timestamp of record creation.
updated_at (DateTime with Timezone): Timestamp of last update.
Relationships:
user (Many-to-One with User): The author of the reflection.
partnership (Many-to-One with Partnership): The partnership context.
Developer Action Point (Reflection Model):
Confirm if structured reflection fields (went_well, etc.) are needed for MVP or if a single content field suffices based on the frontend's expectation for logging and display. The backend.md POST /reflections payload suggests a single reflectionContent.
4.7. Direct Message Model (app/db/models/direct_message.py)
Purpose: Stores direct messages exchanged between partners within an active partnership.
Key Fields & Explanations:
id (UUID, Primary Key): Unique identifier for the message.
partnership_id (UUID, ForeignKey to partnerships.id, Indexed): The partnership this message belongs to. This is the primary way to scope messages to a specific pair of users.
sender_id (UUID, ForeignKey to users.id, Indexed): The user who sent the message.
receiver_id (UUID, ForeignKey to users.id, Indexed): The user who is the recipient of the message. (While partnership_id defines the pair, explicitly storing receiver_id can simplify some queries, though it's somewhat redundant if the partnership context is always used).
Decision: For simplicity and to avoid redundancy, receiver_id can be omitted if all message queries are scoped by partnership_id and sender_id (the receiver is the other user in the partnership). Let's omit receiver_id and derive it in the service layer.
text_content (Text, Nullable): The textual content of the message. Nullable if the message is emoji-only or image-only.
emoji_content (String, Nullable): If the message consists solely of an emoji, store the emoji character(s) here.
image_url (String, Nullable): As per backend.md, if an image is sent, its URL is stored here.
sent_at_utc (DateTime with Timezone, Indexed): The UTC timestamp when the message was sent/recorded.
read_at_utc (DateTime with Timezone, Nullable, Indexed): UTC timestamp when the recipient read the message (for read receipts - Post-MVP).
reply_to_activity_id (String, Nullable): As per backend.md, to link a message as a reply to a specific activity feed item.
reply_to_activity_summary (String, Nullable): A short summary of the activity being replied to, for display context in the chat.
created_at (DateTime with Timezone): Timestamp of record creation.
updated_at (DateTime with Timezone): Timestamp of last update (e.g., if reactions are edited).
Relationships:
partnership (Many-to-One with Partnership): The conversation thread.
sender (Many-to-One with User): The message sender.
reactions (One-to-Many with Reaction - Post-MVP): Reactions to this message.
Developer Action Point (Direct Message Model):
Confirm the strategy for receiver_id. Omitting it simplifies the model but requires deriving the receiver in services.
Read receipts (read_at_utc) are a Post-MVP feature but the field can be included.
4.8. Notification Model (app/db/models/notification.py)
Purpose: Stores notifications for users about various events within the application. This model needs to be flexible enough to cover the diverse notification types mentioned in backend.md.
Key Fields & Explanations:
id (UUID, Primary Key): Unique identifier for the notification.
recipient_id (UUID, ForeignKey to users.id, Indexed): The user who should receive this notification.
actor_user_id (UUID, ForeignKey to users.id, Nullable, Indexed): The user who initiated the action that triggered this notification (e.g., the partner who completed a check-in). Nullable for system-generated notifications.
type (String, Indexed): A string code representing the type of notification (e.g., 'partner_checkin_completed', 'verification_requested', 'new_direct_message', 'goal_milestone'). This aligns with backend.md.
title (String, Nullable): A concise title for the notification, as per backend.md.
message (Text, Nullable): The main textual content of the notification, as per backend.md. (Original spec used text).
link_to (String, Nullable): A frontend route (URL path) that the user should be navigated to when they click on the notification.
is_read (Boolean, default=False, Indexed): Flag indicating whether the recipient has read the notification.
read_at_utc (DateTime with Timezone, Nullable): Timestamp when the notification was marked as read.
icon_identifier (String, Nullable): A string key that the frontend can map to a specific Lucide icon, as per backend.md.
target_type (String, Nullable, Indexed): The type of entity the notification pertains to (e.g., 'goal', 'system', 'checkin', 'message_thread'), as per backend.md.
target_id (String, Nullable, Indexed): The ID of the target entity. Could be UUID if always our entities, or string for flexibility.
target_name (String, Nullable): A display name for the target entity, for richer notification text.
created_at (DateTime with Timezone, Indexed): Timestamp of notification creation.
Relationships:
recipient (Many-to-One with User): The user receiving the notification.
actor (Many-to-One with User, using actor_user_id): The user who performed the action.
Developer Action Point (Notification Model):
Maintain a clear, documented list of all possible type and icon_identifier strings and ensure the frontend can interpret them.
The target_id might need to be a generic string or use polymorphic associations if it can refer to different tables with different ID types, but for MVP, a string that can hold UUIDs is likely sufficient.
4.9. Reaction Model (app/db/models/reaction.py)
Purpose: Stores user reactions (e.g., emojis) to specific items like check-ins, messages, or reflections. (Primarily Post-MVP as per backend.md for messages/feed, but schema can be defined).
Key Fields & Explanations:
id (UUID, Primary Key): Unique identifier for the reaction instance.
user_id (UUID, ForeignKey to users.id, Indexed): The user who made the reaction.
emoji (String): The emoji character(s) used for the reaction (e.g., "👍", "🎉").
target_type (String Enum, Indexed): The type of entity being reacted to (e.g., 'checkin', 'direct_message', 'reflection', 'feed_item').
target_id (UUID, Indexed): The ID of the specific check-in, message, reflection, or feed item being reacted to. (Using UUID assumes our target entities have UUID PKs).
created_at (DateTime with Timezone): Timestamp of reaction creation.
Constraints:
A unique constraint on (user_id, target_type, target_id, emoji) could prevent a user from adding the exact same emoji reaction multiple times to the same item. Alternatively, a simpler approach is one reaction object per user per target item, and changing the emoji updates the existing reaction record. The original backend spec leaned towards the latter for simplicity.
Relationships:
user (Many-to-One with User): The user who reacted.
(Polymorphic relationship to target_type/target_id is complex. For MVP, querying reactions might involve joining based on target_type and target_id in service layer logic rather than direct ORM relationships if target_id refers to different tables.)
Developer Action Point (Reaction Model):
Decide on the reaction constraint strategy (one emoji type per user per item, or multiple distinct emoji reactions per user per item). The backend.md POST /messages/{message_id}/react implies adding/updating a single emoji reaction from a user to a message.
4.10. Comment Model (app/db/models/comment.py)
Purpose: Stores user comments on items like check-ins or reflections. (Primarily Post-MVP as per original spec).
Key Fields & Explanations:
id (UUID, Primary Key): Unique identifier for the comment.
user_id (UUID, ForeignKey to users.id, Indexed): The user who wrote the comment.
text_content (Text): The content of the comment.
target_type (String Enum, Indexed): The type of entity being commented on (e.g., 'checkin', 'reflection', 'feed_item').
target_id (UUID, Indexed): The ID of the specific item being commented on.
parent_comment_id (UUID, ForeignKey to comments.id, Nullable, Indexed): For threaded comments (Post-MVP), linking a reply to its parent comment.
created_at (DateTime with Timezone): Timestamp of comment creation.
updated_at (DateTime with Timezone): Timestamp of last update.
Relationships:
user (Many-to-One with User): The author of the comment.
parent_comment (Many-to-One with Comment self-referentially): The parent comment.
replies (One-to-Many with Comment self-referentially): Replies to this comment.
Developer Action Point (Comment Model):
Threaded comments add complexity. For MVP, simple, non-threaded comments might be sufficient if comments are implemented at all.
4.11. Alembic Migrations
Purpose: Alembic will be used to manage database schema changes.
Developer Action Points:
AI Notification: "SQLAlchemy models incorporating requirements from both backend design documents have been defined conceptually. You will need to:
Implement these Python model files in app/db/models/.
Ensure Alembic is initialized (alembic init alembic) and env.py is configured to target Base.metadata from app.db.base_class and use the correct database URL.
Generate migration scripts using alembic revision --autogenerate -m "description_of_changes".
Crucially, manually review every autogenerated migration script to ensure its correctness, especially for new tables, added columns, foreign key constraints, indexes, and any enum type changes.
Apply migrations to your Supabase database using alembic upgrade head."
Changes to enums or complex constraint alterations might require manual crafting of Alembic migration steps.


Refined Email Notification Strategy (Incorporating Your New Points):
We'll update the "Activity & Notification Emails" section and add a new "Onboarding & Engagement Emails" category.
1. User Account Emails (Primarily Supabase Auth)
* Welcome Email / Email Verification (as before)
* Password Reset Email (as before)
2. Partnership Lifecycle Emails (DuoTrak Backend via Resend)
* Partnership Invitation Email (as before)
* Partnership Accepted Notification Email (as before)
* Partnership Dissolved Notification Email (as before)
3. Activity & Notification Emails (DuoTrak Backend via Resend)
* Daily Summary Email (as before)
* Aggregated Verification Request Notification Email (NEW & REFINED):
* Trigger: This will require a more sophisticated trigger than an immediate email for every verification request. Options:
1. Scheduled Check: A periodic task (e.g., hourly or a few times a day, separate from the daily summary) checks for users who have two or more unverified check-ins from their partner that they haven't acted upon (e.g., older than a few hours).
2. Event-Driven with Threshold: When a second (or subsequent) verification request is created for a user by their partner, and the previous one(s) are still pending and un-notified via this aggregated email, then trigger the email.
* Purpose: To gently remind User B that multiple tasks from User A are awaiting their verification, without sending an email for every single one.
* Content: A summary message like "You have [X] items from [Partner's Name] awaiting your verification." Include a list of the systems/check-ins (or just a count) and a single deep link to the verification queue in the app (e.g., /activity?filter=verifications or /partner?section=verifications).
* Frequency Cap: Ensure this aggregated email isn't sent too frequently (e.g., no more than once or twice a day per user, even if new items keep hitting the threshold).
* Task Verified/Queried Notification Email (Potentially, or rely on in-app):
* (As before) Consider if in-app is sufficient for MVP. If emails are sent, they should be for immediate important feedback.
4. Onboarding & Engagement Emails (DuoTrak Backend via Resend) (NEW CATEGORY)
* "Create Your First Goal" Encouragement Email (NEW):
* Trigger:
1. User successfully completes email verification (Supabase webhook notifies backend, or backend checks on first login post-verification).
2. AND the user has not yet created any goals (backend checks goalsList for the user).
3. AND a certain time has passed since signup/verification without goal creation (e.g., 24-48 hours) to avoid being too immediate if they are actively exploring.
* Purpose: To encourage newly verified users who haven't started creating goals to take that first important step.
* Content:
* Congratulatory tone for getting set up.
* Highlight the core value of DuoTrak (achieving goals with a partner).
* Briefly explain the benefit of setting up their first goal.
* Clear Call to Action: A button/link like "Create Your First Goal" that deep-links to pages/goals/new.jsx or pages/goals/index.jsx.
* Optionally, link to a very short "Getting Started" guide or a few tips on defining effective goals.
* Frequency Cap: Send only once per user.
Implementation Considerations for these New Email Triggers:
Aggregated Verification Request Email:
Service Logic (VerificationService or NotificationService):
A function like checkAndSendAggregatedVerificationAlerts(userId) would be needed.
This function queries pending verifications for the user.
It checks if the count meets the threshold (e.g., >= 2).
It checks when the last aggregated alert was sent to this user to avoid spamming.
Trigger Mechanism:
Could be a scheduled task (e.g., a cron job running every few hours that iterates through users with pending verifications).
Could be event-driven: when a new Checkin is saved with status='pending_verification', the system checks the recipient's current queue size and notification history.
"Create Your First Goal" Encouragement Email:
Service Logic (UserService or NotificationService):
A function like checkAndSendFirstGoalEncouragement(userId).
This function checks user.is_email_verified, user.created_at (or a new email_verified_at timestamp), and if the user has any goals associated with their user_id.
It also checks if this encouragement email has already been sent to this user (e.g., by using a flag on the User model like first_goal_email_sent: Boolean).
Trigger Mechanism:
Could be triggered by a Supabase webhook after email verification, which calls a backend endpoint. This endpoint then queues a delayed task (e.g., for 24 hours later) to run checkAndSendFirstGoalEncouragement.
Alternatively, a daily scheduled task could scan for newly verified users who meet the criteria.
Impact on Backend Models:
UserModel:
Might need a field like last_aggregated_verification_email_sent_at: DateTime(nullable=True) to manage frequency of the aggregated verification alerts.
Might need first_goal_email_sent: Boolean(default=False) to ensure the "Create Your First Goal" email is sent only once.
Potentially email_verified_at: DateTime(nullable=True) if the exact verification time is needed for the trigger logic, rather than just is_email_verified.
Frontend Implications:
No direct frontend changes are needed to trigger these specific emails, as they are backend-driven based on user state and activity.
The frontend should ensure that the deep links provided in these emails (e.g., to the verification queue or the "create goal" page) are valid and lead the user to the correct place in the application.