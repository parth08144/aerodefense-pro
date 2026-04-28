# ✈️ AeroDefense Pro

> **Full-stack Fighter Jet & Missile Defense Marketplace**

A premium defense marketplace built with Node.js, Express, and SQLite. Browse, compare, and procure next-generation fighter jets, missiles, and defense systems — all through a sleek, military-grade interface.

![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue)

---

## 🚀 Features

- **Product Catalog** — 25+ items across Fighter Jets, Missiles, and Defense Systems
- **Detailed Specs** — Full technical specifications for every product
- **User Authentication** — JWT-based signup/login with secure password hashing
- **Shopping Cart** — Add, update, and manage items
- **Wishlist** — Save favorites for later
- **Order System** — Full checkout flow with order history
- **Reviews & Ratings** — Product review system with star ratings
- **Responsive Design** — Military-grade UI that works on all devices
- **Search & Filter** — Browse by category, manufacturer, and more

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js 24.x |
| **Framework** | Express 5 |
| **Database** | SQLite (better-sqlite3) |
| **Templating** | EJS |
| **Auth** | JWT + bcryptjs |
| **Styling** | Custom CSS (dark theme) |

## 📦 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/parth08144/aerodefense-pro.git
cd aerodefense-pro

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Seed the database
npm run seed

# Start the server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Account
- **Username:** `admin`
- **Password:** `admin123`

## 🌐 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `JWT_SECRET` | — | Secret key for JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Token expiration |
| `NODE_ENV` | `development` | Environment mode |

## 📁 Project Structure

```
aerodefense-pro/
├── database/
│   ├── db.js            # Database connection & schema
│   └── seed.js          # Sample data seeder
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── public/
│   ├── css/             # Stylesheets
│   ├── images/          # Product images
│   └── js/              # Client-side scripts
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── cart.js          # Shopping cart API
│   ├── orders.js        # Order management
│   ├── pages.js         # Page rendering routes
│   ├── products.js      # Product API
│   ├── reviews.js       # Review system
│   └── wishlist.js      # Wishlist API
├── views/
│   ├── partials/        # Header, footer templates
│   └── *.ejs            # Page templates
├── server.js            # Application entry point
├── package.json
└── .env
```

## 🚀 Deployment

This app is deployed on [Render](https://render.com). To deploy your own instance:

1. Fork this repository
2. Create a new **Web Service** on Render
3. Connect your GitHub repo
4. Set build command: `npm install && npm run seed`
5. Set start command: `npm start`
6. Add environment variables in Render dashboard

## 📄 License

ISC © [Parth Tripathi](https://github.com/parth08144)
