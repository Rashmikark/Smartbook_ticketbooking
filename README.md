# 🎟️ SmartBook — Book Events Across India

> A modern ticket booking platform for Movies, Comedy Shows, Concerts, Sports & Theatre events across 28 Indian states.

![SmartBook](https://img.shields.io/badge/SmartBook-Ticket%20Booking-purple?style=for-the-badge)
![Django](https://img.shields.io/badge/Django-Backend-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge)
![Seat Locking](https://img.shields.io/badge/⭐_Seat_Locking-5_Min_Timer-orange?style=for-the-badge)

---

## 📌 About

**SmartBook** is a full-stack ticket booking web application that allows users to discover and book tickets for events happening across every state and city in India. From blockbuster movies to live concerts, comedy nights to theatre performances — SmartBook brings it all to one place.

The platform is built for the **general public** — anyone who wants to book tickets for any event, anytime, from anywhere in India.

> 💡 **What makes SmartBook special?** A real-time **Seat Locking System** that ensures no two users can ever book the same seat — making the booking experience fair, fast and reliable.

---

## ⭐ Seat Locking System — The Core Feature

> This is the heart of SmartBook. Every booking is protected by a real-time seat locking mechanism.

### 🔒 How It Works

```
User selects seats
       ↓
Seats are LOCKED instantly for 5 minutes
       ↓
A countdown timer starts for the user
       ↓
User completes payment within 5 minutes
       ↓
✅ Booking Confirmed + QR Code Generated
       ↓
❌ If payment not done → Seats AUTO RELEASED
```

### 🛡️ Why It Matters

| Problem | SmartBook Solution |
|---------|-------------------|
| Two users booking same seat | ❌ Impossible — seat is locked the moment it's selected |
| Seats held forever without payment | ❌ Never — auto released after exactly 5 minutes |
| Unfair booking experience | ✅ First come, first served — always fair |
| Duplicate tickets | ✅ QR Code verification prevents duplication |

### ⚙️ Technical Details
- Seats are locked via `/api/booking/lock-seats/` the moment a user selects them
- Lock expires automatically after **5 minutes**
- No other user can select or book a locked seat
- If the session expires, seats return to available pool instantly
- Admin can monitor all active seat locks from the admin panel

---

## ✨ All Features

### 🔐 Authentication
- User **Sign Up / Sign In / Sign Out**
- **OTP Verification** for secure account access

### 🗺️ Location-Based Events
- Browse events across **28 Indian states**
- Filter by **city** within each state
- Events categorized as **Movies, Comedy, Concerts, Sports, Theatre**

### 🎫 Booking & Ticketing
- **Seat selection** with Premium / Gold / Silver tiers
- Complete **ticket summary** after booking with all event details
- **QR Code** generated for every booking to avoid duplication
- QR Code scanned at venue for **instant verification**

### 🛠️ Admin Management
- Add, update or remove **events, venues and shows** through the backend
- Manage **cities and states** dynamically — no code changes needed
- Full control over **bookings, seat locks and users**
- Monitor active seat locks from admin panel

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django, Django REST Framework |
| Frontend | React.js |
| Database | SQLite |
| Authentication | Token-based + OTP Verification |
| Admin Panel | Django Admin (Jazzmin theme) |
| QR Code | Python QR Code Generation |
| **Seat Locking** | **Real-time lock with 5 min auto-expiry** |

---

## ⚙️ Setup & Running

> ⚠️ You need **two terminals open at the same time** — one for backend, one for frontend.

### 1. Clone the repository
```bash
git clone https://github.com/Rashmikark/Smartbook_ticketbooking.git
cd Smartbook_ticketbooking
```

### 2. Terminal 1 — Backend
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create admin superuser
python manage.py createsuperuser

# Seed all events for 28 states
python manage.py seed_events

# Start backend server
python manage.py runserver
```
Backend runs at → `http://127.0.0.1:8000/`

### 3. Terminal 2 — Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```
Frontend runs at → `http://localhost:3000/`

---

## 🌱 Seed Data

To bulk insert all events, venues and shows for all 28 states at once:
```bash
python manage.py seed_events
```

This creates:
- 🎬 **279+ Events** across all categories
- 🏛️ **430+ Venues** across all cities
- 🎟️ **3300+ Shows** with dates, times and pricing

---

## 🔑 Admin Panel

Access the admin panel at:
```
http://127.0.0.1:8000/admin/
```
From the admin panel you can:
- ➕ Add / ✏️ Edit / ❌ Remove events, venues, shows
- 👥 Manage users and bookings
- 🔒 Monitor active seat locks
- 🗺️ Update cities and states anytime

---

## 🌐 API Endpoints

Base URL: `http://127.0.0.1:8000/api/`

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login user |
| POST | `/api/auth/logout/` | Logout user |
| POST | `/api/auth/send-otp/` | Send OTP to user |
| POST | `/api/auth/verify-otp/` | Verify OTP |

### 🎬 Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events/` | List all events |
| GET | `/api/events/<id>/` | Get single event |
| GET | `/api/events/category/<category>/` | Filter events by category |

### 🏛️ Venues & Shows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/venues/` | List all venues |
| GET | `/api/venues/city/<city>/` | Get venues by city |
| GET | `/api/shows/` | List all shows |
| GET | `/api/shows/event/<event_id>/` | Get shows for an event |
| GET | `/api/shows/city/<city>/` | Get shows by city |

### 🎫 Bookings & ⭐ Seat Locking
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/` | List all bookings |
| POST | `/api/booking/create/` | Create a new booking |
| GET | `/api/booking/my/` | Get current user's bookings |
| GET | `/api/booking/verify/<booking_id>/` | Verify QR code |
| POST | `/api/booking/lock-seats/` | ⭐ Lock seats for 5 minutes |

---

## 📁 Project Structure

```
Smartbook_ticketbooking/
├── backend/
│   ├── events/
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── seed_events.py
│   │   ├── models.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── venues/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── bookings/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── users/
│   │   ├── views.py
│   │   └── urls.py
│   └── manage.py
└── frontend/
    └── src/
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── Login.js
        │   ├── Home.js
        │   ├── MovieList.js
        │   ├── SeatSelection.js
        │   ├── Payment.js
        │   ├── Ticket.js
        │   └── Profile.js
        └── services/
            └── api.js
```

---

## 🎯 How It Works

1. **Sign up / Login** with OTP verification
2. **Select your state and city**
3. **Browse events** by category
4. **Choose a show** and select your seats
5. ⭐ Seats are **locked for 5 minutes** — exclusive to you while you pay
6. After payment, receive your **ticket summary + QR Code**
7. **Scan QR Code** at the venue for entry

---

## 👩‍💻 Author

**Rashmika** — [@Rashmikark](https://github.com/Rashmikark)

---

## 📄 License

This project is for educational purposes.