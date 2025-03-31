# Product Management API (NestJS Backend)

A robust backend API for product management with JWT authentication and image handling using MongoDB GridFS.

## Features

- **User Authentication**
  - JWT-based registration/login
  - Protected routes
  - Token expiration (6 hours)

- **Product Management**
  - Full CRUD operations
  - Image upload/download
  - Search and filtering
  - Soft delete functionality

- **Database**
  - MongoDB with GridFS for file storage
  - Mongoose schemas with validation

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB (with GridFS)
- **Authentication**: JWT
- **File Storage**: MongoDB GridFS
- **Validation**: class-validator, class-transformer

## Prerequisites

- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

## Install dependencies

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   JWT_SECRET=your_strong_secret_key_here
   PORT=3000
   ```

## Running the Application

- Development mode (with watch):
  ```bash
  npm run start:dev
  ```

## API Documentation

After starting the server, access Swagger UI at:
`http://localhost:3000/`

## Endpoints

### Authentication
| Method | Endpoint    | Description          |
|--------|-------------|----------------------|
| POST   | /auth/register | Register new user    |
| POST   | /auth/login    | Login and get JWT    |
| POST   | /auth/logout   | Logout (client-side) |

### Products
| Method | Endpoint       | Description                     |
|--------|----------------|---------------------------------|
| GET    | /products      | Get all products (with filters) |
| GET    | /products/:id  | Get single product              |
| GET    | /products/:id/image | Get product image           |
| POST   | /products      | Create new product (with image) |
| PUT    | /products/:id  | Update product                  |
| DELETE | /products/:id  | Delete product (soft delete)    |

## Database Structure

Collections:
- `users`: User accounts
- `products`: Product information
- `productImages.chunks`: GridFS chunks
- `productImages.files`: GridFS metadata

### Environment Variables
All configuration is done through environment variables:

| Variable     | Required | Description                     |
|--------------|----------|---------------------------------|
| MONGO_URI    | Yes      | MongoDB connection string       |
| JWT_SECRET   | Yes      | Secret for JWT signing          |
| PORT         | No       | Port to listen on (default:3000)|