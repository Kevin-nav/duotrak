# Duotrak Backend API Documentation

This document provides a comprehensive overview of the Duotrak FastAPI backend, designed to help frontend developers integrate with the API.

## Table of Contents
1.  [Architecture Overview](#architecture-overview)
2.  [Authentication](#authentication)
3.  [API Endpoints](#api-endpoints)
    -   [Auth](#auth)
    -   [Users](#users)
    -   [Goals](#goals)
    -   [Systems](#systems)
    -   [Check-ins](#check-ins)
    -   [Reflections](#reflections)
    -   [Partnerships](#partnerships)
    -   [Direct Messages](#direct-messages)
    -   [Reactions](#reactions)
    -   [Comments](#comments)
4.  [Enums and Statuses](#enums-and-statuses)

---

## Architecture Overview

The backend is built using a layered architecture to ensure a clean separation of concerns:

-   **API Routers (`/api/routers`)**: Defines the HTTP endpoints (e.g., `GET /api/v1/goals`). They handle request validation (using Pydantic schemas) and dependency injection (e.g., getting the database session and current user).
-   **Services (`/services`)**: Contains all business logic and permission checking. This is the core layer. Routers call service methods to perform actions. This layer ensures a user can only access or modify data they are authorized to.
-   **CRUD (`/crud`)**: Stands for Create, Read, Update, Delete. This layer contains functions that interact directly with the database (querying, inserting, etc.). Services call CRUD functions to fetch or persist data.
-   **Schemas (`/schemas`)**: Pydantic models that define the shape of API requests and responses. They are used for data validation and serialization.
-   **DB Models (`/db/models`)**: SQLAlchemy ORM models that define the database tables and their relationships.

---

## Authentication

The API uses JSON Web Tokens (JWTs) for authentication, which are expected to be provided by Supabase on the frontend.

-   **Mechanism**: To access any protected endpoint, the frontend must include an `Authorization` header with the JWT.
-   **Format**: `Authorization: Bearer <your_supabase_jwt>`
-   **Protection**: All endpoints (except for `/auth/signup`) are protected. The backend validates the token and extracts the current user's information for every authenticated request.

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth

Handles user creation.

-   **`POST /auth/signup`**
    -   **Description**: Creates a new user in the database. This is the only endpoint that does not require authentication.
    -   **Request Body**: `UserCreate` schema (`username`, `email`, `password`, `full_name`).
    -   **Response Body**: `User` schema (the newly created user object).
    -   **Logic**: Checks if a username or email already exists.

### Users

Handles user profile management.

-   **`GET /users/me`**
    -   **Description**: Retrieves the profile of the currently authenticated user.
    -   **Response Body**: `User` schema.
-   **`PUT /users/me`**
    -   **Description**: Updates the profile of the currently authenticated user.
    -   **Request Body**: `UserUpdate` schema (all fields optional: `username`, `email`, `password`, `full_name`, `avatar_url`).
    -   **Response Body**: `User` schema (the updated user object).
    -   **Logic**: Prevents updating username or email to one that is already taken.

### Goals

-   **`GET /goals/`**
    -   **Description**: Retrieves all goals belonging to the current user.
    -   **Response Body**: `List[Goal]`.
-   **`POST /goals/`**
    -   **Description**: Creates a new goal for the current user.
    -   **Request Body**: `GoalCreate` schema.
    -   **Response Body**: `Goal`.
-   **`GET /goals/{goal_id}`**
    -   **Description**: Retrieves a specific goal by its ID.
    -   **Logic**: Fails if the goal does not belong to the current user.
-   **`PUT /goals/{goal_id}`**
    -   **Description**: Updates a specific goal.
    -   **Request Body**: `GoalUpdate` schema.
    -   **Logic**: Fails if the goal does not belong to the current user.
-   **`DELETE /goals/{goal_id}`**
    -   **Description**: Deletes a specific goal.
    -   **Logic**: Fails if the goal does not belong to the current user.

### Systems

Systems are children of Goals.

-   **`POST /systems/`**
    -   **Description**: Creates a new system for one of the user's goals.
    -   **Request Body**: `SystemCreate` schema (requires `goal_id`).
    -   **Logic**: Verifies the current user owns the parent `goal_id`.
-   **`GET /systems/by_goal/{goal_id}`**
    -   **Description**: Retrieves all systems for a specific goal.
    -   **Logic**: Verifies the current user owns the parent `goal_id`.
-   **`GET /systems/{system_id}`**
    -   **Description**: Retrieves a specific system.
    -   **Logic**: Verifies the current user owns the system's parent goal.
-   **`PUT /systems/{system_id}`**
    -   **Description**: Updates a specific system.
    -   **Request Body**: `SystemUpdate` schema.
    -   **Logic**: Verifies the current user owns the system's parent goal.
-   **`DELETE /systems/{system_id}`**
    -   **Description**: Deletes a specific system.
    -   **Logic**: Verifies the current user owns the system's parent goal.

### Check-ins

Check-ins are children of Systems.

-   **`POST /checkins/`**
    -   **Description**: Creates a new check-in for a user's system.
    -   **Request Body**: `CheckinCreate` schema (requires `system_id`).
    -   **Logic**: Verifies the user owns the parent system.
-   **`GET /checkins/by_system/{system_id}`**
    -   **Description**: Retrieves all check-ins for a specific system.
    -   **Logic**: Verifies the user owns the parent system.
-   ...and so on for `GET`, `PUT`, `DELETE` by `{checkin_id}`.

### Reflections

Reflections are children of Goals.

-   **`POST /reflections/`**
    -   **Description**: Creates a new reflection for a user's goal.
    -   **Request Body**: `ReflectionCreate` schema (requires `goal_id`).
    -   **Logic**: Verifies the user owns the parent goal.
-   **`GET /reflections/by_goal/{goal_id}`**
    -   **Description**: Retrieves all reflections for a specific goal.
    -   **Logic**: Verifies the user owns the parent goal.
-   ...and so on for `GET`, `PUT`, `DELETE` by `{reflection_id}`.

### Partnerships

-   **`POST /partnerships/request`**
    -   **Description**: Sends a partnership request to another user.
    -   **Request Body**: `PartnershipCreate` schema (requires `approver_id`).
    -   **Logic**: Fails if a request/partnership already exists, or if trying to partner with oneself.
-   **`GET /partnerships/requests/pending`**
    -   **Description**: Gets all *incoming* pending partnership requests for the current user.
-   **`GET /partnerships/current`**
    -   **Description**: Gets the current user's active (`ACCEPTED`) partnership. Returns 404 if none exists.
-   **`PUT /partnerships/requests/{partnership_id}/respond`**
    -   **Description**: Responds to a request. Only the `approver` can call this.
    -   **Request Body**: `PartnershipUpdate` schema (status must be `ACCEPTED` or `DECLINED`).
-   **`DELETE /partnerships/{partnership_id}`**
    -   **Description**: Terminates an `ACCEPTED` partnership. Can be called by either partner.

### Direct Messages

-   **`POST /direct_messages/`**
    -   **Description**: Sends a message to the user's partner.
    -   **Request Body**: `DirectMessageCreate` schema (requires `recipient_id` and `partnership_id`).
    -   **Logic**: Verifies the sender is in an active partnership that matches the one specified, and that the recipient is their partner.
-   **`GET /direct_messages/{partnership_id}`**
    -   **Description**: Gets the full conversation history for a partnership.
    -   **Response Body**: `List[DirectMessage]`. Each `DirectMessage` object now contains a `reactions` list. Each `Reaction` in that list contains a `user` object with the author's info.
    -   **Logic**: Verifies the user is a member of the requested partnership.

### Reactions

Reactions are for Direct Messages.

-   **`POST /reactions/`**
    -   **Description**: Adds an emoji reaction to a message.
    -   **Request Body**: `ReactionCreate` schema (requires `message_id` and `emoji`).
    -   **Response Body**: `Reaction` object, which now includes a `user` object with the author's details.
    -   **Logic**: Verifies the user is part of the message's partnership. Fails on duplicate emoji reactions.
-   **`DELETE /reactions/{reaction_id}`**
    -   **Description**: Removes a reaction.
    -   **Logic**: Verifies the user is the author of the reaction.
-   **`GET /reactions/by_message/{message_id}`**
    -   **Description**: Gets all reactions for a specific message.
    -   **Response Body**: `List[Reaction]`. Each `Reaction` object now includes a `user` object with the author's details.
    -   **Logic**: Verifies the user is part of the message's partnership.

### Comments

Comments can be on Goals or Check-ins.

-   **`POST /comments/`**
    -   **Description**: Creates a new comment.
    -   **Request Body**: `CommentCreate` schema (requires `content` and exactly one of `goal_id` or `checkin_id`).
    -   **Logic**: Verifies the user can access the item (either owns it or is partnered with the owner).
-   **`GET /comments/by_goal/{goal_id}`**
    -   **Description**: Gets all comments for a goal.
    -   **Logic**: Verifies the user can access the goal.
-   **`GET /comments/by_checkin/{checkin_id}`**
    -   **Description**: Gets all comments for a check-in.
    -   **Logic**: Verifies the user can access the check-in.
-   **`PUT /comments/{comment_id}`**
    -   **Description**: Updates a comment.
    -   **Logic**: Verifies the user is the author of the comment.
-   **`DELETE /comments/{comment_id}`**
    -   **Description**: Deletes a comment.
    -   **Logic**: Verifies the user is the author of the comment.

---

## Enums and Statuses

-   **`GoalStatus`**: `"NOT_STARTED"`, `"IN_PROGRESS"`, `"COMPLETED"`, `"ARCHIVED"`
-   **`GoalPriority`**: `"LOW"`, `"MEDIUM"`, `"HIGH"`
-   **`PartnershipStatus`**: `"PENDING"`, `"ACCEPTED"`, `"DECLINED"`, `"TERMINATED"` 