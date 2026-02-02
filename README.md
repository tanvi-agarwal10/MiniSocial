# Mini Social - A Full-Stack Social Media Application

A modern, lightweight social media platform built with the MERN stack. Share your thoughts, like posts, and comment in real-time. Perfect for learning full-stack development or as a foundation for your own social app.

## 🎯 Features

- **User Authentication** - Secure signup and login with JWT tokens
- **Create & Share Posts** - Post text, images, or both
- **Like System** - Like and unlike posts with real-time updates
- **Comments** - Add comments to any post and see conversations
- **Pagination** - Feed displays 10 posts per page for better performance
- **Image Upload** - Upload images with Multer (supports JPG, PNG, GIF, WebP)
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Protected Routes** - Secure endpoints that require authentication

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Multer + Cloudinary for cloud image uploads
- express-validator for input validation
- CORS for cross-origin requests

**Frontend:**
- React 18
- React Router for navigation
- Axios for API calls
- React Bootstrap for UI components
- Context API for state management
- CSS3 for styling

## 📁 Project Structure

```
MiniSocial/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Post.js              # Post schema
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── postController.js    # Post operations
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   └── posts.js             # Post endpoints
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── upload.js            # File upload config
│   ├── uploads/                 # Uploaded images folder
│   ├── server.js                # Main server file
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Signup.js
    │   │   ├── Login.js
    │   │   └── Feed.js
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── PostCard.js
    │   │   └── CreatePostModal.js
    │   ├── context/
    │   │   └── AuthContext.js    # Global auth state
    │   ├── services/
    │   │   └── api.js            # API calls & interceptor
    │   ├── styles/               # CSS files
    │   ├── App.js
    │   └── index.js
    ├── package.json
    ├── .env
    └── public/
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
```bash
cd MiniSocial
```

2. **Setup Backend:**
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3. **Setup Frontend:**
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend folder:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### Running the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5001`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on `http://localhost:3000`

Open your browser and go to `http://localhost:3000` 🎉

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login and get JWT token

### Posts
- `GET /api/posts` - Get all posts (paginated, 10 per page)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (requires auth)
- `POST /api/posts/:id/like` - Like/unlike a post (requires auth)
- `POST /api/posts/:id/comment` - Add comment to post (requires auth)

## 💾 Database Schema

### User Collection
```javascript
{
  username: String (unique, 3+ chars),
  email: String (unique),
  password: String (hashed with bcryptjs),
  createdAt: Date,
  updatedAt: Date
}
```

### Post Collection
```javascript
{
  authorId: ObjectId (reference to User),
  username: String,
  text: String (optional),
  imageUrl: String (optional),
  likes: Array (user IDs who liked),
  comments: [
    {
      userId: ObjectId,
      username: String,
      text: String,
      createdAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

1. User signs up with username, email, and password
2. Password is hashed with bcryptjs (10 salt rounds)
3. JWT token is generated and sent to client
4. Token is stored in localStorage on frontend
5. Token is sent with every API request in Authorization header
6. Backend verifies token before allowing protected operations

## 📸 Image Upload

- **Cloud Storage:** Images uploaded via Cloudinary (supports JPG, PNG, GIF, WebP)
- **Max file size:** 5MB
- **Automatic persistence:** Images persist across application restarts
- **Real-time display:** Images show immediately after upload
- **Automatic fallback:** Broken images are hidden gracefully

## 🌐 Deployment

### Prerequisites for Cloud Deployment
- **Cloudinary Account:** Get free account at [cloudinary.com](https://cloudinary.com)
  - Note: After deploying backend, add these env vars to your hosting platform:
    - `CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`

### Deploy Backend to Render
1. Push code to GitHub
2. Connect Render to your GitHub repo
3. Set environment variables in Render dashboard (including Cloudinary credentials)
4. Deploy!

### Deploy Frontend to Netlify
1. Import your GitHub repo to Netlify
2. Set `REACT_APP_API_URL` to your Render backend URL (e.g., `https://minisocial-backend-xxxxx.onrender.com/api`)
3. Build command: `npm run build`
4. Publish directory: `build`
5. Deploy with one click!

### MongoDB Atlas
- Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Create a cluster
- Get connection string and add to backend `.env`

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📝 License

MIT License - feel free to use this project however you like.

---

**Built with ❤️ for learning and sharing.**

Have questions? Check out the documentation files in the project or open an issue!