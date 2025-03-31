# Product Management App (React Frontend)

A responsive web application for managing products with authentication, built with React, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**
  - Login/Register flows
  - JWT token handling
  - Protected routes

- **Product Management**
  - View all products with images
  - Create new products with image upload
  - Update/Delete products
  - Search and filter functionality

- **UI/UX**
  - Responsive design (mobile, tablet, desktop)
  - Loading states and error handling
  - Clean, modern interface with Tailwind CSS

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Backend API (see [backend README](#))


## Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Running the Application

- Development server:
  ```bash
  npm run dev
  ```
  Runs on `http://localhost:5173`

- Production build:
  ```bash
  npm run build
  ```

- Preview production build:
  ```bash
  npm run preview
  ```

## Connecting to Backend

The frontend expects a backend with these endpoints:

- Authentication:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/logout`

- Products:
  - `GET /products`
  - `GET /products/:id`
  - `GET /products/:id/image`
  - `POST /products` (with image upload)
  - `PUT /products/:id`
  - `DELETE /products/:id`