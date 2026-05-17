# My Fuels — Fuel Order Management Mini System

**Internship Technical Assessment (Round 2)**  
**Addressed To:** Vishal (Intern Coordination)  
**Company:** My Fuels — Building the future of energy commerce  

---

## Project Overview

My Fuels is a full-stack, simplified Fuel Order Management Mini System inspired by real-world operational workflows in energy commerce. Built to demonstrate end-to-end frontend capability, robust backend API design, structured database architecture, and a strong operational mindset, this application bridges the gap between customers placing on-demand fuel orders and administrators managing operational logistics.

This repository serves as the complete technical submission for Round 2 of the My Fuels Internship Technical Assessment, showcasing clean code organization, scalability thinking, and startup execution speed.

---

## Evaluation & Admin Access Credentials

To facilitate quick evaluation of the Admin Panel features (Order Management, Fuel Pricing, User Roles), please use the following dedicated administrator credentials:

* **Admin Email:** admin@admin.com
* **Admin Password:** admin

*Note on Authentication & Role Management:*  
The application utilizes JSON Web Tokens (JWT) for secure session handling paired with custom Role-Based Access Control (RBAC) middleware. New accounts registered via the signup form default to the standard user role. For local testing or database inspection, administrator roles can be assigned by updating the roles field to admin within the MongoDB users collection.

---

## Core Modules & Features

### User Interface & Experience
* **Authentication & Security:** Secure login and signup workflows utilizing bcrypt password hashing and JWT persistence.
* **Customer Dashboard:** Personalized overview displaying total orders, pending requests, delivered fulfillments, and recent order activity.
* **Fuel Ordering Workflow:** Intuitive order placement form capturing Fuel Type selection, required Quantity (in Litres), precise Delivery Location, Preferred Delivery Time, and optional delivery notes. Dynamic real-time calculation of total pricing based on active fuel rates.
* **Order Tracking & History:** Comprehensive order history logs displaying unique order tracking numbers (e.g., MF-123456789) and real-time status progression.

### Administration Panel
* **Operational Dashboard:** High-level analytics summarizing total system orders, pending deliveries, dispatched orders, and completed fulfillments.
* **Order Management & Fulfillment:** Centralized table to view all customer orders, inspect delivery metadata, and dynamically update order statuses through the operational pipeline (Pending -> Accepted -> Out for Delivery -> Delivered).
* **Search & Filtering:** Advanced filtering capabilities to isolate orders by specific operational statuses or search directly via unique Order Numbers.
* **Fuel Catalog Management:** Full CRUD capabilities allowing administrators to introduce new fuel variants, modify active market pricing per litre, and remove outdated offerings.
* **User & Role Administration:** System management interface to view registered accounts, modify permission tiers (User vs. Admin), or revoke access.

---

## Technical Stack & Architecture

The application is engineered using the MERN stack, emphasizing clear separation of concerns, RESTful communication, and modular design.

### Frontend Architecture
* **Framework:** React.js powered by Vite for rapid modular bundling and optimized asset delivery.
* **Styling & UI:** Vanilla CSS paired with Tailwind CSS utility frameworks to ensure highly responsive, modern, and accessible interface layouts across desktop and mobile viewports.
* **State & Routing:** React Router DOM for seamless client-side page transitions and a centralized Context API (AuthContext) for application-wide session and user state synchronization.
* **Network Communication:** Axios instance configured with interceptors and credential inclusion for secure, cross-origin API requests.

### Backend & API Architecture
* **Runtime & Environment:** Node.js paired with Express.js, structured around modular routing controllers and robust middleware pipelines.
* **Database & ORM:** MongoDB Atlas managed via Mongoose ODM, utilizing strict schemas, data validation, and document relationship population.
* **Security & Middleware:** Comprehensive CORS configuration supporting specific frontend origins and credential passing. Custom Express middleware handles payload validation, JWT verification, Role-Based Access Control, and global centralized error handling to ensure consistent JSON API responses.

---

## Database Schemas & Models

The MongoDB database architecture is normalized into three foundational collections:

### 1. User Model (users)
* name (String, Required): Display name of the account holder.
* email (String, Required, Unique): Contact and login identifier.
* password (String, Required): Bcrypt-hashed authentication string.
* roles (String, Enum: [user, admin], Default: user): RBAC authorization level.

### 2. Fuel Model (fuels)
* fuelName (String, Required): Commercial name of the energy product (e.g., Diesel, Petrol).
* pricePerLitre (Number, Required): Current unit cost utilized for dynamic order calculations.

### 3. Order Model (orders)
* orderNumber (String, Required, Unique): Automatically generated identification string (MF-timestamp).
* user (ObjectId, Ref: User, Required): Reference to the ordering customer.
* fuel (ObjectId, Ref: Fuel, Required): Reference to the selected fuel product.
* quantity (Number, Required): Requested volume in litres.
* totalPrice (Number, Required): Calculated financial total at the time of order placement.
* preferredDeliveryTime (String, Required): Customer-specified fulfillment window.
* status (String, Enum: [Pending, Accepted, Out for Delivery, Delivered], Default: Pending): Current operational lifecycle state.
* address (String, Required): Destination geographical location.
* notes (String): Optional delivery instructions.
* timestamps (Boolean: true): Automated creation and modification tracking.

---

## API Endpoints Documentation

All backend requests return standardized JSON structures. Protected routes require a valid JWT provided within the Authorization header.

### Authentication Endpoints (/auth)
* POST /auth/signup: Registers a new user account. Expects name, email, and password. Returns created user metadata and session token.
* POST /auth/login: Authenticates existing users. Expects email and password. Returns user profile, access role, and session token.

### User & Ordering Endpoints (/user)
* GET /user/fuels: Retrieves the active catalog of available fuels and current market pricing. (Protected)
* GET /user/dashboard: Fetches customer-specific order metrics and recent activity logs. (Protected)
* GET /user/history: Retrieves the complete chronological order history for the authenticated user. (Protected)
* POST /user/orders: Submits a new fuel delivery request. Expects fuel ID, quantity, preferredDeliveryTime, address, and notes. (Protected)

### Profile Endpoints (/profile)
* GET /profile/:name: Retrieves public profile details for a specified account name. (Protected)

### Administration Endpoints (/admin) - Requires Admin RBAC
* GET /admin/dashboard: Aggregates system-wide operational metrics and recent global orders.
* GET /admin/vieworders: Retrieves all customer orders across the platform with populated user and fuel metadata.
* GET /admin/search: Queries orders based on orderNumber or filters by specific operational status.
* PATCH /admin/orders/:id/status: Updates the operational lifecycle status of a specific order ID. Expects { status }.
* GET /admin/fuels: Retrieves the complete fuel catalog.
* POST /admin/fuels: Creates a new fuel catalog entry. Expects { fuelName, pricePerLitre }.
* PUT /admin/fuels/:id: Updates pricing or naming for an existing fuel entry.
* DELETE /admin/fuels/:id: Removes a fuel offering from the active catalog.
* GET /admin/users: Lists all registered system accounts (excluding password hashes).
* PUT /admin/users/:id/role: Updates the authorization tier (roles) for a specific user ID.
* DELETE /admin/users/:id: Deletes a user account from the system.

---

## Local Development & Setup Instructions

Follow these systematic instructions to initialize, configure, and run the My Fuels application in a local development environment.

### Prerequisites
* Node.js (v18.0.0 or higher recommended)
* Git command-line tool
* MongoDB instance (Local MongoDB server or MongoDB Atlas cluster URI)

### 1. Repository Cloning
Open your terminal and clone the repository to your local machine:
```bash
git clone https://github.com/Aizen200/My-Fuels.git
cd My-Fuels
```

### 2. Backend Configuration & Startup
Navigate to the backend directory, install the required dependencies, and configure the environment:
```bash
cd backend
npm install
```

Create a .env file in the root of the backend directory with the following configuration variables:
```env
Mongo_url=your_mongodb_connection_string_here
Port=3000
JWT=your_secure_jwt_secret_key_here
```

Start the backend development server:
```bash
npm start
```
The server will initialize, connect to MongoDB, and listen on port 3000 (or your configured port).

### 3. Frontend Configuration & Startup
Open a separate terminal window, navigate to the frontend directory, install dependencies, and configure the environment:
```bash
cd frontend
npm install
```

Create a .env file in the root of the frontend directory to establish the backend API connection URL:
```env
VITE_API_BASE_URL=http://localhost:3000
```

Start the Vite frontend development server:
```bash
npm run dev
```
The frontend application will compile and become accessible in your browser (typically at http://localhost:5173).

---

## Deployment & Cloud Guidelines

The My Fuels platform is architected for seamless cloud deployment across modern platform-as-a-service providers.

### Backend Deployment (Render / Heroku)
1. Connect your GitHub repository to your cloud platform dashboard.
2. Specify the Root Directory as backend.
3. Set the Build Command to npm install and the Start Command to node index.js.
4. Crucially, navigate to the environment variables configuration panel on your cloud host and manually input Mongo_url, Port, and JWT. (Ensure casing matches or utilizes the global fallbacks configured in the server).
5. Ensure your MongoDB Atlas cluster has whitelisted the appropriate IP ranges (or 0.0.0.0/0 for dynamic cloud container IPs) to permit cloud database connections.

### Frontend Deployment (Vercel / Netlify)
1. Connect your GitHub repository to Vercel or Netlify.
2. Specify the Root Directory as frontend.
3. The platform will automatically detect Vite. Set the Build Command to npm run build and the Output Directory to dist.
4. Add the VITE_API_BASE_URL environment variable pointing to your active, live backend deployment URL (e.g., https://my-fuels.onrender.com).
5. Deploy the application to receive your live production URL.

---

## Startup Execution Mindset & Ownership

This system was engineered under a strict 48-hour timeline, adhering to the core tenets of startup engineering:
* **Pragmatic Decision Making:** Prioritizing high-impact operational features (clean RBAC, dynamic pricing, intuitive status pipelines) over over-engineered abstractions.
* **Resilient Architecture:** Implementing global error handling, environment variable fallbacks, and strict CORS boundaries to ensure high availability and prevent silent failures in production.
* **Clear Communication:** Providing structured documentation, transparent evaluation credentials, and clean code organization to facilitate rapid onboarding and seamless collaboration.

My Fuels — Building the future of energy commerce.
