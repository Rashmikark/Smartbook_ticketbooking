"""
Django Management Command - Seed MISSING cities only
Save this file to: backend/events/management/commands/seed_missing_cities.py

HOW TO RUN:
    python manage.py seed_missing_cities
"""

from django.core.management.base import BaseCommand
from events.models import Event
from venues.models import Venue, Show
from datetime import date, time, timedelta
import random

# ──────────────────────────────────────────────
# EXACT cities from your frontend STATES list
# Only NEW/MISSING cities are listed here
# ──────────────────────────────────────────────
STATES_DATA = [
    {
        "state": "Tamil Nadu",
        "cities": ["Chennai", "Coimbatore", "Madurai", "Trichy"],
        "movies": ["Leo", "Jailer", "Vikram", "96", "Don"],
        "comedy": ["Chennai Laughter Fest", "Madurai Stand-up Night", "Coimbatore Comedy Club"],
        "concerts": ["Anirudh Live Chennai", "Yuvan Musical Night"],
        "sports": ["TNPL Match", "CSK Fan Match"],
        "theatre": ["Crazy Mohan Drama"],
        "language": "Tamil",
    },
    {
        "state": "Karnataka",
        "cities": ["Bengaluru", "Mysuru", "Mangaluru"],  # Mangaluru is new
        "movies": ["Kantara", "KGF Chapter 1", "KGF Chapter 2", "Charlie 777", "Vikrant Rona"],
        "comedy": ["Bengaluru Stand-up Night", "Kenny Sebastian Live", "Comedy Adda BLR"],
        "concerts": ["Sunburn Bengaluru", "Indie Music Fest"],
        "sports": ["Karnataka Premier League", "RCB Fan Match"],
        "theatre": ["Ranga Shankara Play"],
        "language": "Kannada",
    },
    {
        "state": "Maharashtra",
        "cities": ["Mumbai", "Pune", "Aurangabad"],  # Aurangabad is new
        "movies": ["Jawan", "Pathaan", "3 Idiots", "Dangal", "Zindagi Na Milegi Dobara"],
        "comedy": ["Zakir Khan Live", "Biswa Show", "Mumbai Comedy Nights"],
        "concerts": ["Arijit Singh Live", "Lollapalooza India"],
        "sports": ["IPL Mumbai Indians", "Wankhede Match"],
        "theatre": ["Marathi Natak"],
        "language": "Hindi/Marathi",
    },
    {
        "state": "Telangana",
        "cities": ["Hyderabad", "Warangal", "Nizamabad"],  # Nizamabad is new
        "movies": ["RRR", "Pushpa The Rise", "Salaar", "Arjun Reddy", "Baahubali The Beginning"],
        "comedy": ["Hyderabad Comedy Night", "Telugu Standup", "Comedy Adda"],
        "concerts": ["DSP Live", "Tollywood Music Night"],
        "sports": ["IPL SRH Match", "Hyderabad League"],
        "theatre": ["Telugu Drama"],
        "language": "Telugu",
    },
    {
        "state": "Delhi (NCT)",  # was "Delhi" before — FIXED to match frontend
        "cities": ["New Delhi", "Noida", "Gurgaon"],  # Noida, Gurgaon are new
        "movies": ["Dangal", "3 Idiots", "PK", "War", "Gully Boy"],
        "comedy": ["Vir Das Live", "Delhi Laugh Riot", "Canvas Comedy Club"],
        "concerts": ["AP Dhillon Live", "EDM Night"],
        "sports": ["IPL Delhi Capitals", "Kotla Match"],
        "theatre": ["NSD Play"],
        "language": "Hindi",
    },
    {
        "state": "Kerala",
        "cities": ["Thiruvananthapuram", "Kochi", "Thrissur"],  # Thrissur is new
        "movies": ["Premam", "Drishyam", "2018", "Bangalore Days", "Kumbalangi Nights"],
        "comedy": ["Kochi Comedy Club", "Trivandrum Stand-up", "Mallu Comedy Night"],
        "concerts": ["Kochi Music Fest", "Malayalam Hits Live"],
        "sports": ["Kerala Blasters Match", "ISL Game"],
        "theatre": ["Kathakali"],
        "language": "Malayalam",
    },
    {
        "state": "Gujarat",
        "cities": ["Gandhinagar", "Ahmedabad"],  # Gandhinagar is new
        "movies": ["Hellaro", "Chhello Show", "Wrong Side Raju", "Love Ni Bhavai", "Bey Yaar"],
        "comedy": ["Gujarati Stand-up", "Ahmedabad Comedy Night", "Surat Laugh Show"],
        "concerts": ["Garba Night", "Dandiya Fest"],
        "sports": ["IPL Gujarat Titans", "Motera Match"],
        "theatre": ["Gujarati Natak"],
        "language": "Gujarati",
    },
    {
        "state": "Rajasthan",
        "cities": ["Jaipur", "Jodhpur", "Udaipur", "Ajmer"],  # Ajmer is new
        "movies": ["Padmaavat", "Jodhaa Akbar", "Lamhe", "Dor", "Paheli"],
        "comedy": ["Jaipur Comedy Fest", "Desert Laugh Night", "Stand-up Jaipur"],
        "concerts": ["Desert Music Fest", "Folk Night"],
        "sports": ["IPL Royals Match", "Jaipur Cricket"],
        "theatre": ["Folk Drama"],
        "language": "Hindi/Rajasthani",
    },
    {
        "state": "West Bengal",
        "cities": ["Kolkata", "Howrah", "Durgapur"],  # Howrah is new
        "movies": ["Pather Panchali", "Bela Seshe", "Autograph", "Chokher Bali", "Praktan"],
        "comedy": ["Kolkata Laugh Club", "Stand-up Kolkata", "Comedy Adda"],
        "concerts": ["Rabindra Sangeet Night", "Kolkata Music Fest"],
        "sports": ["Mohun Bagan Match", "East Bengal Match"],
        "theatre": ["Bengali Theatre"],
        "language": "Bengali",
    },
    {
        "state": "Uttar Pradesh",
        "cities": ["Lucknow", "Varanasi"],  # Kanpur/Agra removed to match frontend
        "movies": ["Gadar 2", "Bareilly Ki Barfi", "Article 15", "Stree", "Toilet Ek Prem Katha"],
        "comedy": ["Lucknow Stand-up", "Kanpur Comedy", "Varanasi Laugh Show"],
        "concerts": ["Classical Night", "Ghazal Evening"],
        "sports": ["UP T20 League", "Cricket Match"],
        "theatre": ["Ram Leela"],
        "language": "Hindi",
    },
    {
        "state": "Punjab",
        "cities": ["Chandigarh", "Amritsar", "Jalandhar"],  # Jalandhar is new
        "movies": ["Carry On Jatta", "Chal Mera Putt", "Ardaas", "Qismat", "Sufna"],
        "comedy": ["Punjabi Comedy Night", "Ludhiana Stand-up", "Amritsar Laugh Show"],
        "concerts": ["Diljit Live", "Punjabi Beats Night"],
        "sports": ["IPL Punjab Kings", "Mohali Match"],
        "theatre": ["Bhangra Folk"],
        "language": "Punjabi",
    },
    {
        "state": "Andhra Pradesh",
        "cities": ["Amaravati", "Visakhapatnam", "Guntur"],  # Amaravati, Guntur are new
        "movies": ["Pushpa The Rise", "Ala Vaikunthapurramuloo", "Srimanthudu", "Eega", "Magadheera"],
        "comedy": ["Vizag Comedy Show", "Vijayawada Stand-up", "AP Laugh Night"],
        "concerts": ["Tollywood Music Night", "DSP Hits Live"],
        "sports": ["Andhra League", "Cricket Match"],
        "theatre": ["Telugu Drama"],
        "language": "Telugu",
    },
    {
        "state": "Madhya Pradesh",
        "cities": ["Bhopal", "Indore", "Gwalior"],
        "movies": ["Stree", "Peepli Live", "Lagaan", "Swades", "Newton"],
        "comedy": ["Indore Comedy", "Bhopal Stand-up", "MP Laugh Show"],
        "concerts": ["MP Music Fest", "Live Band Night"],
        "sports": ["Ranji Match", "State Cricket"],
        "theatre": ["Hindi Natak"],
        "language": "Hindi",
    },
    {
        "state": "Bihar",
        "cities": ["Patna", "Gaya", "Bhagalpur"],  # Bhagalpur is new
        "movies": ["Super 30", "Gangs of Wasseypur", "Shool", "Apaharan", "Deswa"],
        "comedy": ["Patna Comedy", "Bihar Stand-up", "Bhojpuri Laugh Show"],
        "concerts": ["Bhojpuri Night", "Folk Music"],
        "sports": ["Bihar League", "Cricket Match"],
        "theatre": ["Folk Drama"],
        "language": "Hindi/Bhojpuri",
    },
    {
        "state": "Odisha",
        "cities": ["Bhubaneswar", "Rourkela", "Puri"],  # Puri is new
        "movies": ["Daman", "Hello Arsi", "Kalira Atita", "Sala Budhar Badla", "Pratikshya"],
        "comedy": ["Bhubaneswar Comedy", "Cuttack Stand-up", "Odisha Laugh Show"],
        "concerts": ["Odissi Music Fest", "Live Folk Night"],
        "sports": ["Odisha League", "Cricket Match"],
        "theatre": ["Odissi Drama"],
        "language": "Odia",
    },
    {
        "state": "Assam",
        "cities": ["Guwahati", "Dibrugarh", "Jorhat"],  # Jorhat is new
        "movies": ["Village Rockstars", "Kothanodi", "Mission China", "Ratnakar", "Aamis"],
        "comedy": ["Guwahati Comedy", "Assam Stand-up", "Laugh Night"],
        "concerts": ["Bihu Fest", "Music Night"],
        "sports": ["Assam League", "Cricket Match"],
        "theatre": ["Assamese Drama"],
        "language": "Assamese",
    },
    {
        "state": "Jharkhand",
        "cities": ["Ranchi", "Jamshedpur", "Dhanbad"],
        "movies": ["MS Dhoni The Untold Story", "Gangs of Wasseypur", "Newton", "Chhichhore", "PK"],
        "comedy": ["Ranchi Comedy", "Stand-up Night", "Laugh Club"],
        "concerts": ["Tribal Fest", "Music Night"],
        "sports": ["Jharkhand League", "Cricket"],
        "theatre": ["Folk Drama"],
        "language": "Hindi",
    },
    {
        "state": "Uttarakhand",
        "cities": ["Dehradun", "Haridwar", "Rishikesh"],  # Rishikesh is new
        "movies": ["Kedarnath", "Batti Gul Meter Chalu", "Paan Singh Tomar", "Tumbbad", "October"],
        "comedy": ["Dehradun Comedy", "Stand-up Night", "Hill Laugh Show"],
        "concerts": ["Mountain Fest", "Live Music"],
        "sports": ["Cricket League", "Local Match"],
        "theatre": ["Cultural Drama"],
        "language": "Hindi",
    },
    {
        "state": "Himachal Pradesh",
        "cities": ["Shimla", "Manali", "Dharamshala"],
        "movies": ["Highway", "Yeh Jawaani Hai Deewani", "Rockstar", "Jab We Met", "Raazi"],
        "comedy": ["Shimla Comedy", "Manali Stand-up", "Hill Laugh Show"],
        "concerts": ["Himachal Fest", "Music Night"],
        "sports": ["Cricket Match", "League"],
        "theatre": ["Folk Theatre"],
        "language": "Hindi/Pahari",
    },
    {
        "state": "Goa",
        "cities": ["Panaji", "Margao", "Mapusa"],  # Mapusa is new
        "movies": ["Dil Chahta Hai", "Go Goa Gone", "Dear Zindagi", "Finding Fanny", "Cocktail"],
        "comedy": ["Goa Comedy Fest", "Stand-up Night", "Beach Laugh Show"],
        "concerts": ["Sunburn Festival", "EDM Beach Party"],
        "sports": ["FC Goa Match", "Football League"],
        "theatre": ["Beach Theatre"],
        "language": "Konkani/Hindi",
    },
    {
        "state": "Chhattisgarh",
        "cities": ["Raipur", "Bhilai", "Bilaspur"],  # Bhilai is new
        "movies": ["Newton", "Masaan", "Raazi", "Peepli Live", "Article 15"],
        "comedy": ["Raipur Comedy", "Stand-up", "Laugh Night"],
        "concerts": ["Folk Fest", "Music Night"],
        "sports": ["Cricket Match", "League"],
        "theatre": ["Tribal Drama"],
        "language": "Hindi/Chhattisgarhi",
    },
    {
        "state": "Haryana",
        "cities": ["Gurugram", "Faridabad", "Panipat"],  # Panipat is new
        "movies": ["Sultan", "Dangal", "Chak De India", "Bhaag Milkha Bhaag", "Kesari"],
        "comedy": ["Gurgaon Comedy", "Stand-up", "Laugh Night"],
        "concerts": ["Haryanvi Night", "Music Fest"],
        "sports": ["Wrestling Event", "Cricket Match"],
        "theatre": ["Folk Drama"],
        "language": "Hindi/Haryanvi",
    },
    {
        "state": "Jammu & Kashmir",
        "cities": ["Srinagar", "Jammu", "Baramulla"],  # Baramulla is new
        "movies": ["Haider", "Mission Kashmir", "Fitoor", "Rockstar", "Raazi"],
        "comedy": ["Srinagar Comedy", "Stand-up", "Laugh Night"],
        "concerts": ["Sufi Night", "Music Fest"],
        "sports": ["Cricket Match", "League"],
        "theatre": ["Kashmiri Play"],
        "language": "Kashmiri/Hindi",
    },
    {
        "state": "Tripura",
        "cities": ["Agartala", "Udaipur", "Dharmanagar"],
        "movies": ["Aamis", "Village Rockstars", "Bulbul Can Sing", "Kothanodi", "Axone"],
        "comedy": ["Agartala Comedy", "Stand-up", "Laugh Night"],
        "concerts": ["Local Music Fest", "Cultural Night"],
        "sports": ["Cricket Match", "League"],
        "theatre": ["Folk Drama"],
        "language": "Bengali/Kokborok",
    },
    {
        "state": "Meghalaya",
        "cities": ["Shillong", "Tura", "Nongpoh"],  # Nongpoh is new
        "movies": ["Rock On", "Axone", "Barfi", "Mary Kom", "Dil Se"],
        "comedy": ["Shillong Comedy", "Stand-up", "Laugh Night"],
        "concerts": ["Shillong Fest", "Music Night"],
        "sports": ["Football Match", "League"],
        "theatre": ["Local Theatre"],
        "language": "Khasi/English",
    },
    {
        "state": "Manipur",
        "cities": ["Imphal", "Thoubal", "Bishnupur"],
        "movies": ["Mary Kom", "Axone", "Eeb Allay Ooo", "Bulbul Can Sing", "Aamis"],
        "comedy": ["Imphal Comedy", "Stand-up", "Laugh Night"],
        "concerts": ["Cultural Music Fest", "Live Night"],
        "sports": ["Football Match", "League"],
        "theatre": ["Manipuri Drama"],
        "language": "Meitei/Hindi",
    },
    {
        "state": "Nagaland",
        "cities": ["Kohima", "Dimapur", "Mokokchung"],
        "movies": ["Axone", "Aamis", "Village Rockstars", "Kothanodi", "Bulbul Can Sing"],
        "comedy": ["Kohima Comedy", "Stand-up", "Laugh Night"],
        "concerts": ["Hornbill Festival", "Music Night"],
        "sports": ["Football Match", "League"],
        "theatre": ["Tribal Theatre"],
        "language": "Nagamese/English",
    },
    {
        "state": "Sikkim",
        "cities": ["Gangtok", "Namchi", "Gyalshing"],
        "movies": ["Barfi", "Rock On", "Dil Se", "Mary Kom", "Axone"],
        "comedy": ["Gangtok Comedy", "Stand-up", "Laugh Night"],
        "concerts": ["Sikkim Music Fest", "Live Night"],
        "sports": ["Football Match", "League"],
        "theatre": ["Cultural Drama"],
        "language": "Nepali/Sikkimese",
    },
]

CATEGORY_MAP = {
    "movies": "Movies",
    "comedy": "Comedy",
    "concerts": "Concerts",
    "sports": "Sports",
    "theatre": "Theatre",
}

SHOW_TIMES = [time(10, 0), time(13, 30), time(17, 0), time(20, 30)]

VENUE_TEMPLATES = {
    "Movies": "{city} Cineplex",
    "Comedy": "{city} Comedy Club",
    "Concerts": "{city} Arena",
    "Sports": "{city} Stadium",
    "Theatre": "{city} Theatre Hall",
}

def get_show_dates():
    today = date.today()
    return [today + timedelta(days=i) for i in range(1, 31)]


class Command(BaseCommand):
    help = "Seed missing cities - synced exactly with frontend STATES list"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("🚀 Seeding missing cities..."))

        total_events = 0
        total_venues = 0
        total_shows = 0
        show_dates = get_show_dates()

        for state_data in STATES_DATA:
            state = state_data["state"]
            cities = state_data["cities"]
            language = state_data["language"]

            self.stdout.write(f"\n📍 {state}")

            all_events = []
            for title in state_data["movies"]:
                all_events.append((title, "movies"))
            for title in state_data["comedy"]:
                all_events.append((title, "comedy"))
            for title in state_data["concerts"]:
                all_events.append((title, "concerts"))
            for title in state_data["sports"]:
                all_events.append((title, "sports"))
            for title in state_data["theatre"]:
                all_events.append((title, "theatre"))

            for city in cities:
                for title, cat_key in all_events:
                    category = CATEGORY_MAP[cat_key]

                    event, e_created = Event.objects.get_or_create(
                        title=title,
                        category=category,
                        defaults={
                            "description": f"{title} - {category} event.",
                            "language": language if cat_key == "movies" else "",
                            "duration": "2h 30m" if cat_key == "movies" else "3h",
                            "certificate": random.choice(["U", "UA", "A"]) if cat_key == "movies" else "",
                            "rating": round(random.uniform(6.5, 9.5), 1),
                            "is_active": True,
                        }
                    )
                    if e_created:
                        total_events += 1

                    venue_name = VENUE_TEMPLATES[category].format(city=city)
                    venue, v_created = Venue.objects.get_or_create(
                        name=venue_name,
                        city=city,
                        state=state,
                        defaults={
                            "address": f"{venue_name}, {city}, {state}",
                            "total_seats": 300,
                            "amenities": "Parking, AC, Food Court",
                            "is_active": True,
                        }
                    )
                    if v_created:
                        total_venues += 1

                    for i in range(3):
                        show_date = random.choice(show_dates)
                        show_time = SHOW_TIMES[i % len(SHOW_TIMES)]
                        show, s_created = Show.objects.get_or_create(
                            event=event,
                            venue=venue,
                            show_date=show_date,
                            show_time=show_time,
                            defaults={
                                "screen": f"Screen {i+1}",
                                "total_seats": 300,
                                "available_seats": 300,
                                "price_premium": random.choice([350, 400, 450]),
                                "price_gold": random.choice([250, 280, 300]),
                                "price_silver": random.choice([150, 180, 200]),
                                "is_active": True,
                            }
                        )
                        if s_created:
                            total_shows += 1

        self.stdout.write(self.style.SUCCESS(
            f"\n✅ Done!\n"
            f"   🎬 New Events : {total_events}\n"
            f"   🏛️  New Venues : {total_venues}\n"
            f"   🎟️  New Shows  : {total_shows}\n"
        ))