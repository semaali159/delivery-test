## Delivery Operations Backend (NestJS + MongoDB)

Backend service for managing captains and orders, with real-time captain location updates via Socket.IO, plus a small partner-facing API and an admin reporting API.

### Tech stack
- Node.js + TypeScript + NestJS
- MongoDB + Mongoose
- REST APIs
- Socket.IO (WebSockets)
- Swagger at `/api`

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally or via Docker

## Environment variables

See `.env.example` in this directory. Required for full behaviour:

## Run
Use the same commands as the parent Nest application, for example:


```bash
npm run start:dev
``` 
Service runs on:
REST: http://localhost:<PORT>
Swagger: http://localhost:<PORT>/api
Socket.IO namespace: http://localhost:<PORT>/locations


### Install
```bash
npm install


