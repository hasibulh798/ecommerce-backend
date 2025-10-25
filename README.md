# 🛒 E-commerce Backend API

A complete backend REST API for an E-commerce application built with **Node.js, Express.js, and MongoDB**.  
This project handles user authentication, product management, cart, and order functionalities with admin access control.

---

## 🚀 Features

- User authentication (Register/Login with JWT)
- Role-based access control (Admin & User)
- Product management (CRUD operations)
- Category management
- Cart management (Add/Remove items)
- Order management (Create, update, track orders)
- Payment integration (Stripe/SSLCommerz sandbox)
- Image upload with Cloudinary
- API documentation with Postman

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT, bcrypt
- **File Upload:** Cloudinary
- **Payment Gateway:** SSLCommerz (sandbox)
- **Other Tools:** Postman, dotenv, nodemon


## ⚙️ Installation & Setup

1. Clone the repository
   ```bash
   git clone https://github.com/username/ecommerce-backend.git
   cd ecommerce-backend
   Install dependencies
   ```

bash
Copy code
npm install
Create .env file and add the following:

ini
Copy code
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

Run the server

bash
Copy code
npm run dev

