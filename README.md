# Event Management Backend API

This is a Django REST API for an event management platform. It supports:

- Admin registration and login
- User registration and login
- Event creation and listing
- Secure JWT authentication
- AI-powered event description generation using Gemini (Google Generative AI)
- MongoDB integration via MongoDB Atlas

---

## 🚀 Tech Stack

- **Backend**: Django REST Framework
- **Database**: MongoDB (using PyMongo)
- **Auth**: JWT (via `PyJWT`)
- **AI Integration**: Google Generative AI (Gemini)

---

## 📦 Setup Instructions

### 1. Clone the repository
```bash
git clone <https://github.com/ksnaveenkumar2k/fullstack_project.git>
cd your-repo-folder
```

### 2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables
Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_gemini_api_key
SECRET_KEY=your_django_secret_key
MONGO_URI=mongodb+srv://ihub:ihub@harlee.6sokd.mongodb.net/
```

---

## 🧪 API Endpoints

### 🔐 Auth
- `POST /admin/register` — Admin registration
- `POST /admin/login` — Admin login
- `POST /user/register` — User registration
- `POST /user/login` — User login

### 📅 Events
- `POST /event/create` — Admin creates event (JWT required)
- `GET /admin/dashboard` — Admin fetches own events
- `GET /events` — Browse events (filters: type, location, date)

### 🤖 AI Integration
- `POST /event/generate-description` — Uses Gemini to generate event description

---

## ✅ Requirements
- Python 3.8+
- MongoDB Atlas connection
- Google Gemini API Key

---

## 📄 License
This project is for educational/demo purposes. Customize and secure before deploying in production.

---

## 🙌 Credits
Developed by Naveenkumar KS. Integrated with Google Generative AI and MongoDB.
