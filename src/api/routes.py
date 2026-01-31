from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, Shoe, Profile
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)

# 1. AUTHENTICATION: Register a new customer
@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    if not body.get("email") or not body.get("password"):
        return jsonify({"msg": "Missing email or password"}), 400
    
    user = User(email=body["email"], password=body["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "Welcome to the Shoe Store!"}), 201
@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    if not body.get("email") or not body.get("password"):
        return jsonify({"msg": "Missing email or password"}), 400
    
    user = User.query.filter_by(email=body["email"], password=body["password"]).first()
    if not user:
        return jsonify({"msg": "Invalid credentials"}), 401
    
    return jsonify({"msg": "Login successful!", "user": user.serialize()}), 200

# 2. PRODUCT: Get all shoes (for the homepage)
@api.route('/shoes', methods=['GET'])
def get_shoes():
    shoes = Shoe.query.all()
    return jsonify([s.serialize() for s in shoes]), 200

# 3. ADMIN: Add a new shoe to the store
@api.route('/shoe', methods=['POST'])
def add_shoe():
    body = request.get_json()
    new_shoe = Shoe(
        brand=body["brand"], 
        name=body["name"], 
        price=body["price"],
        img_url=body.get("img_url")
    )
    db.session.add(new_shoe)
    db.session.flush() # Gets the ID without committing yet
    db.session.commit()
    return jsonify({"msg": "Shoe added successfully!", "shoe_id": new_shoe.id}), 201

@api.route('/profile', methods=['POST'])
def add_profile():
    body = request.get_json()
    new_profile = Profile(
        first_name=body["first_name"],
        last_name=body["last_name"],
        phone_number=body.get("phone_number"),
        address=body.get("address"),
        user_id=body["user_id"]
    )
    db.session.add(new_profile)
    db.session.commit()
    return jsonify({"msg": "Profile created successfully!", "profile_id": new_profile.id}), 201
# 4. ORDER: Create a purchase
# @api.route('/checkout', methods=['POST'])
# def checkout():
#     body = request.get_json()
#     # In a real app, you'd get user_id from a session/token
#     new_order = Order(user_id=body["user_id"], total=body["total"])
#     db.session.add(new_order)
#     db.session.commit()
#     return jsonify({"msg": "Purchase successful!", "order_id": new_order.id}), 200