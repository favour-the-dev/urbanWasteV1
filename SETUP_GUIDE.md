# 🗑️ UrbanWaste - Smart Waste Management System

A modern, full-stack waste management system built with **Next.js 15**, **TypeScript**, **MongoDB**, and **Dijkstra's Algorithm** for route optimization.

## ✨ Features

### 🎯 Core Functionality

-   **Route Optimization**: Dijkstra's algorithm for calculating shortest waste collection routes
-   **Role-Based Access**: Admin, Operator, and Citizen portals with specific permissions
-   **Real-Time Weather**: Weather API integration for route planning
-   **Citizen Reporting**: Community members can report waste management issues
-   **Mobile Responsive**: Full mobile support with hamburger menus and touch-friendly UI

### 👥 User Roles

#### 🛡️ Admin

-   Upload and manage network nodes and connections
-   Compute optimal routes using Dijkstra's algorithm
-   Assign routes to operators
-   Review and manage citizen reports
-   View analytics and system statistics
-   Monitor weather conditions

#### 🚛 Operator

-   View assigned routes with map visualization
-   Update route status (pending → active → completed)
-   Track collection points and distances
-   View completed route history

#### 👤 Citizen

-   Submit waste management reports (Full Bin, Flooding, Road Block, etc.)
-   Add GPS coordinates and descriptions
-   Track report status
-   View report history

## 🚀 Tech Stack

### Frontend

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS 4
-   **Animations**: Framer Motion
-   **Forms**: React Hook Form + Zod validation
-   **Icons**: Lucide React
-   **Maps**: Leaflet + React-Leaflet
-   **Notifications**: React Hot Toast

### Backend

-   **Runtime**: Node.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: NextAuth.js v4
-   **API**: Next.js API Routes
-   **Password Hashing**: bcryptjs
-   **JWT**: jsonwebtoken

### Algorithms & Features

-   **Route Optimization**: Dijkstra's algorithm (dijkstrajs)
-   **Weather API**: OpenWeatherMap integration
-   **Geolocation**: Browser Geolocation API

## 📦 Installation

### Prerequisites

-   Node.js 18+ and npm/yarn
-   MongoDB (local or Atlas)
-   OpenWeatherMap API Key (optional)

### Setup Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd urbanWasteV1
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

Edit `.env.local` with your configuration:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/urbanwaste
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here
OPENWEATHERMAP_API_KEY=your-api-key-here (optional)
\`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Seed Initial Data (Optional)

You can create test users using the signup page or insert directly into MongoDB:

\`\`\`javascript
// Admin User
{
name: "Admin User",
email: "admin@urbanwaste.com",
password: "$2a$10$...", // bcrypt hashed
role: "admin",
status: "active"
}

// Operator User
{
name: "John Operator",
email: "operator@urbanwaste.com",
password: "$2a$10$...",
role: "operator",
status: "active"
}

// Citizen User
{
name: "Jane Citizen",
email: "citizen@urbanwaste.com",
password: "$2a$10$...",
role: "citizen",
status: "active"
}
\`\`\`

### Sample Network Data

Upload nodes and edges through Admin → Upload Data:

\`\`\`json
{
"nodes": [
{ "name": "Market Square", "coordinates": [4.8156, 7.0498] },
{ "name": "City Hall", "coordinates": [4.8200, 7.0600] },
{ "name": "Central Park", "coordinates": [4.8100, 7.0550] }
],
"edges": [
{ "from": "Market Square", "to": "City Hall", "weight": 5.2 },
{ "from": "City Hall", "to": "Central Park", "weight": 3.8 }
]
}
\`\`\`

## 📱 Application Structure

\`\`\`
urbanWasteV1/
├── app/
│ ├── (auth)/
│ │ ├── signin/ # Login page
│ │ └── signup/ # Registration with role selection
│ ├── admin/
│ │ ├── dashboard/ # Admin overview with weather
│ │ ├── upload/ # Network data upload
│ │ ├── routes/ # Route computation & assignment
│ │ ├── reports/ # Citizen reports management
│ │ └── analytics/ # System statistics
│ ├── operator/
│ │ ├── dashboard/ # Route details & map
│ │ ├── completed/ # Completed routes history
│ │ └── reports/ # Reports related to routes
│ ├── citizen/
│ │ ├── dashboard/ # Personal stats & recent reports
│ │ ├── report/ # Submit new report
│ │ └── reports/ # Report history
│ └── api/
│ ├── auth/ # NextAuth endpoints
│ ├── admin/ # Admin API routes
│ ├── operator/ # Operator API routes
│ ├── reports/ # Reports CRUD
│ ├── routes/ # Route computation
│ └── weather/ # Weather data
├── components/
│ ├── forms/ # Form components
│ ├── maps/ # Map components
│ ├── ui/ # Reusable UI components
│ └── widgets/ # Weather widget, etc.
├── lib/
│ ├── auth.ts # JWT utilities
│ ├── db.ts # MongoDB connection
│ ├── dijkstra.ts # Route algorithm
│ └── utils.ts # Helper functions
├── models/
│ ├── User.ts # User schema
│ ├── Node.ts # Collection point schema
│ ├── Edge.ts # Connection schema
│ ├── Route.ts # Route schema
│ └── Report.ts # Citizen report schema
└── middleware.ts # Auth & route protection
\`\`\`

## 🔐 Authentication & Authorization

### Role-Based Routes

-   `/admin/*` - Admin only
-   `/operator/*` - Operator only
-   `/citizen/*` - Citizen only

### Protected by Middleware

The `middleware.ts` file automatically:

-   Redirects unauthenticated users to `/signin`
-   Prevents unauthorized role access
-   Redirects authenticated users from auth pages to their dashboard

## 🌐 API Endpoints

### Authentication

-   `POST /api/auth/signup` - Register new user
-   `POST /api/auth/signin` - Login (handled by NextAuth)

### Admin

-   `GET /api/admin/graph` - Fetch nodes and edges
-   `POST /api/admin/upload` - Upload network data
-   `GET /api/admin/operators` - Get operator list
-   `POST /api/admin/operators` - Assign route to operator
-   `GET /api/admin/routes` - Get all routes

### Operator

-   `GET /api/operator/route` - Get assigned route
-   `PATCH /api/operator/status` - Update route status

### Citizen Reports

-   `GET /api/reports` - Fetch reports (with filters)
-   `POST /api/reports` - Submit new report
-   `PATCH /api/reports` - Update report status (admin)

### Utilities

-   `GET /api/weather` - Get weather data
-   `POST /api/routes/compute` - Compute optimal route

## 🎨 Design System

### Color Palette

-   **Admin**: Emerald/Teal gradient
-   **Operator**: Blue/Emerald gradient
-   **Citizen**: Purple/Pink gradient

### Typography

-   **Body**: Noto Sans
-   **Headings**: Space Grotesk

### Components

All components use consistent:

-   Border radius (rounded-xl)
-   Shadows (shadow-sm, shadow-lg)
-   Transitions (transition-all duration-200)
-   Hover states

## 🧪 Testing Guide

### Admin Workflow

1. Sign up as Admin
2. Upload nodes and connections
3. Compute route between two nodes
4. Assign route to operator
5. Check analytics and reports

### Operator Workflow

1. Sign up as Operator
2. View assigned route
3. Start route (pending → active)
4. Complete route (active → completed)
5. View completed history

### Citizen Workflow

1. Sign up as Citizen
2. Submit a report with location
3. Track report status
4. View report history

## 🚧 Known Limitations

-   Weather API requires key (falls back to mock data)
-   Map requires internet connection for tiles
-   Geolocation needs HTTPS in production

## 📈 Future Enhancements

-   [ ] Real-time notifications with WebSockets
-   [ ] Mobile apps (React Native)
-   [ ] Advanced analytics with Recharts
-   [ ] Image upload for reports
-   [ ] Route history visualization
-   [ ] Dark mode toggle
-   [ ] Export data to CSV/PDF
-   [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit changes (\`git commit -m 'Add AmazingFeature'\`)
4. Push to branch (\`git push origin feature/AmazingFeature\`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for efficient urban waste management.

---

**Note**: This is a portfolio/educational project demonstrating modern web development practices with Next.js, TypeScript, and MongoDB.
