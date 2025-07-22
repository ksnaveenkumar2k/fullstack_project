from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from bson.objectid import ObjectId
from pymongo import MongoClient
import base64, jwt, datetime, re
import os
import google.generativeai as genai

from dotenv import load_dotenv
load_dotenv()  # Ensure environment variables are loaded

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# ✅ MongoDB Atlas connection
client = MongoClient("mongodb+srv://ihub:ihub@harlee.6sokd.mongodb.net/")
db = client["event_management"]
admin_collection = db["admin"]
users_collection = db["users"]
events_collection = db["events"]

SECRET_KEY = "your_secret_key_here"  # Replace with environment secret for production

def generate_jwt(user):
    payload = {
        "id": str(user["_id"]),
        "email": user["email"],
        "role": user.get("role", "user"),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
        "iat": datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

@api_view(["POST"])
def admin_register(request):
    data = request.data
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not name.isalpha():
        return Response({"detail": "Name must contain only alphabetic characters."}, status=400)
    if not email:
        return Response({"detail": "Email is required."}, status=400)
    if not password:
        return Response({"detail": "Password is required."}, status=400)
    if len(password) < 6:
        return Response({"detail": "Password must be at least 6 characters."}, status=400)
    if admin_collection.find_one({"email": email}):
        return Response({"detail": "Email already exists."}, status=400)

    hashed_password = make_password(password)

    user = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": "admin",
    }
    inserted_id = admin_collection.insert_one(user).inserted_id
    user = admin_collection.find_one({"_id": inserted_id})
    token = generate_jwt(user)

    return Response({"message": "Admin registered successfully.", "token": token}, status=201)

@api_view(["POST"])
def login(request):
    data = request.data
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return Response({"detail": "Email and password are required."}, status=400)

    user = admin_collection.find_one({"email": email})
    if user and check_password(password, user["password"]):
        token = generate_jwt(user)
        return Response({"token": token, "role": user.get("role", "user")}, status=200)

    return Response({"detail": "Invalid credentials"}, status=401)

@api_view(["POST"])
def create_event(request):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return Response({"detail": "Token expired."}, status=401)
    except jwt.InvalidTokenError:
        return Response({"detail": "Invalid token."}, status=401)

    user = admin_collection.find_one({"_id": ObjectId(payload["id"])})
    if not user or user.get("role") != "admin":
        return Response({"detail": "Unauthorized, admin only."}, status=403)

    data = request.data
    required_fields = ["title", "venue", "start_date", "end_date", "start_time", "end_time", "cost_type"]
    for field in required_fields:
        if not data.get(field):
            return Response({"detail": f"{field} is required."}, status=400)

    title = data["title"]
    if len(title) > 50:
        return Response({"detail": "Title exceeds 50 characters."}, status=400)

    venue = data["venue"]
    if len(venue) > 150:
        return Response({"detail": "Venue exceeds 150 characters."}, status=400)

    image_base64 = data.get("image")
    if image_base64:
        if image_base64.startswith("data:image"):
            image_base64 = image_base64.split(",")[1]
        try:
            base64.b64decode(image_base64)
        except Exception:
            return Response({"detail": "Invalid image format."}, status=400)

    event = {
        "title": title,
        "venue": venue,
        "start_date": data["start_date"],
        "end_date": data["end_date"],
        "start_time": data["start_time"],
        "end_time": data["end_time"],
        "cost_type": data["cost_type"],
        "description": data.get("description", ""),
        "image": image_base64,
        "organizer_id": str(user["_id"]),
        "organizer_name": user["name"],
    }

    inserted_id = events_collection.insert_one(event).inserted_id
    event["_id"] = str(inserted_id)

    return Response({"message": "Event created successfully.", "event": event}, status=201)

@api_view(["GET"])
def admin_dashboard(request):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return Response({"detail": "Token expired."}, status=401)
    except jwt.InvalidTokenError:
        return Response({"detail": "Invalid token."}, status=401)

    user = admin_collection.find_one({"_id": ObjectId(payload["id"])})
    if not user or user.get("role") != "admin":
        return Response({"detail": "Unauthorized, admin only."}, status=403)

    events = list(events_collection.find({"organizer_id": str(user["_id"])}))
    for e in events:
        e["_id"] = str(e["_id"])
    return Response({"events": events}, status=200)

@api_view(["GET"])
def browse_events(request):
    filters = {}
    if request.query_params.get("type"):
        filters["cost_type"] = request.query_params.get("type")
    if request.query_params.get("location"):
        filters["venue"] = {"$regex": request.query_params.get("location"), "$options": "i"}
    if request.query_params.get("date"):
        filters["start_date"] = request.query_params.get("date")

    events = list(events_collection.find(filters))
    for e in events:
        e["_id"] = str(e["_id"])
    return Response({"events": events}, status=200)
# =======================================================#######=======================================================##

@api_view(["POST"])
def user_register(request):
    data = request.data
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    # Basic validations
    if not name.isalpha():
        return Response({"detail": "Name must contain only alphabetic characters."}, status=400)
    if not email:
        return Response({"detail": "Email is required."}, status=400)
    if not password:
        return Response({"detail": "Password is required."}, status=400)

    # Strong password policy
    if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$', password):
        return Response({"detail": "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."}, status=400)

    users_collection = db["users"]

    if users_collection.find_one({"email": email}):
        return Response({"detail": "Email already exists."}, status=400)

    hashed_password = make_password(password)

    user = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": "user",
    }
    inserted_id = users_collection.insert_one(user).inserted_id
    user = users_collection.find_one({"_id": inserted_id})
    token = generate_jwt(user)

    return Response({"message": "User registered successfully.", "token": token}, status=201)

@api_view(["POST"])
def user_login(request):
    data = request.data
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return Response({"detail": "Email and password are required."}, status=400)

    users_collection = db["users"]
    user = users_collection.find_one({"email": email})

    if user and check_password(password, user["password"]):
        token = generate_jwt(user)
        return Response({"token": token, "role": user.get("role", "user")}, status=200)

    return Response({"detail": "Invalid credentials"}, status=401)


@api_view(["POST"])
def generate_event_description(request):
    data = request.data
    title = data.get("title", "")
    venue = data.get("venue", "")
    start_date = data.get("start_date", "")
    end_date = data.get("end_date", "")
    cost_type = data.get("cost_type", "")

    if not GOOGLE_API_KEY:
        return Response({"detail": "Google API Key not configured."}, status=500)

    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = (
            f"Generate an engaging event description for the following details:\n\n"
            f"Title: {title}\nVenue: {venue}\nStart Date: {start_date}\nEnd Date: {end_date}\nCost: {cost_type}\n\n"
            f"Make it attractive, clear, and suitable for display on an event management platform."
        )
        response = model.generate_content(prompt)
        description = response.text.strip()
        return Response({"description": description}, status=200)
    except Exception as e:
        return Response({"detail": str(e)}, status=500)