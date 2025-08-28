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
- API documentation with Postman/Swagger

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT, bcrypt
- **File Upload:** Multer, Cloudinary
- **Payment Gateway:** Stripe/SSLCommerz (sandbox)
- **Other Tools:** Postman, dotenv, nodemon

---

## 📂 Project Structure

├── config/ # DB and cloudinary config
├── controllers/ # API logic (products, users, orders)
├── middlewares/ # Auth & error handling
├── models/ # Mongoose schemas
├── routes/ # API endpoints
├── utils/ # Helper functions
├── server.js # Entry point

yaml
Copy code

---

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
STRIPE_SECRET=your_stripe_secret_key
Run the server

bash
Copy code
npm run dev
📡 API Endpoints
🔑 Auth
POST /api/auth/register → Register new user

POST /api/auth/login → Login & get JWT

👤 User
GET /api/users/profile → Get user profile (auth required)

PUT /api/users/profile → Update profile

📦 Products
GET /api/products → Get all products

GET /api/products/:id → Get single product

POST /api/products → Create product (admin only)

PUT /api/products/:id → Update product (admin only)

DELETE /api/products/:id → Delete product (admin only)

🛒 Cart
POST /api/cart → Add item to cart

GET /api/cart → View cart

DELETE /api/cart/:id → Remove item from cart

📦 Orders
POST /api/orders → Create new order

GET /api/orders → Get user’s orders

GET /api/orders/all → Get all orders (admin only)

PUT /api/orders/:id → Update order status (admin only)

📷 Screenshots (Optional)
Postman API request examples

ER diagram (User, Product, Order relationship)

📑 Documentation
Full API collection: Postman Link

Swagger docs: /api/docs (if implemented)

🚀 Deployment
This project can be deployed on:

Render

Railway

Vercel (serverless)

AWS / DigitalOcean

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss your ideas.

📜 License
This project is licensed under the MIT License.
