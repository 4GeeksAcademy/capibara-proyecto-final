import os
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, Shoe, Profile, Cart, CartItem
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)
CORS(api)

# --- AUTH ---
@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    if not body.get("email") or not body.get("password"):
        return jsonify({"msg": "Missing email or password"}), 400
    if User.query.filter_by(email=body["email"]).first():
        return jsonify({"msg": "Email already exists"}), 409

    user = User(email=body["email"], password=generate_password_hash(body["password"]))
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "Welcome to the Shoe Store!"}), 201

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    user = User.query.filter_by(email=body.get("email")).first()
    if not user or not check_password_hash(user.password, body.get("password")):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "user": user.serialize()}), 200

# --- SHOES ---
@api.route('/shoes', methods=['GET'])
def get_shoes():
    shoes = Shoe.query.all()
    return jsonify([s.serialize() for s in shoes]), 200

@api.route('/shoe', methods=['POST'])
def add_shoe():
    body = request.get_json()
    new_shoe = Shoe(brand=body["brand"], model_name=body["name"], price=body["price"], img_url=body.get("img_url"))
    db.session.add(new_shoe)
    db.session.commit()
    return jsonify({"msg": "Shoe added!", "shoe_id": new_shoe.id}), 201

@api.route('/shoes', methods=['DELETE'])
def delete_shoe():
    body = request.get_json()
    shoe_id = body.get("shoe_id")
    shoe = Shoe.query.get(shoe_id)
    if not shoe:
        return jsonify({"msg": "Shoe not found"}), 404
    db.session.delete(shoe)
    db.session.commit()
    return jsonify({"msg": "Shoe deleted successfully!"}), 200

@api.route('/shoes', methods=['PUT'])
def update_shoe():
    body = request.get_json()
    shoe_id = body.get("shoe_id")
    shoe = Shoe.query.get(shoe_id)
    if not shoe:
        return jsonify({"msg": "Shoe not found"}), 404

    shoe.brand = body.get("brand", shoe.brand)
    shoe.model_name = body.get("name", shoe.model_name)
    shoe.price = body.get("price", shoe.price)
    shoe.img_url = body.get("img_url", shoe.img_url)
    db.session.commit()
    return jsonify({"msg": "Shoe updated successfully!", "shoe": shoe.serialize()}), 200

# --- CART ---
@api.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():  
    user_id = get_jwt_identity()
    body = request.get_json()
    
    # Get or Create Cart for User
    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.flush()

    # Check if item already in cart
    item = CartItem.query.filter_by(cart_id=cart.id, shoe_id=body["shoe_id"]).first()
    if item:
        item.quantity += body.get("quantity", 1)
    else:
        item = CartItem(cart_id=cart.id, shoe_id=body["shoe_id"], quantity=body.get("quantity", 1))
        db.session.add(item)

    db.session.commit()
    return jsonify({"msg": "Added to cart"}), 200

@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        return jsonify({"items": []}), 200
    return jsonify(cart.serialize()), 200

@api.route('/cart', methods=['PUT'])
@jwt_required()
def update_cart():
    user_id = get_jwt_identity()
    body = request.get_json()
    
    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        return jsonify({"msg": "Cart not found"}), 404

    cart_item = CartItem.query.filter_by(id=body["cart_item_id"], cart_id=cart.id).first()
    if not cart_item:
        return jsonify({"msg": "Cart item not found"}), 404

    cart_item.quantity = body.get("quantity", cart_item.quantity)
    db.session.commit()
    return jsonify({"msg": "Cart updated!", "cart_item": cart_item.serialize()}), 200

@api.route('/cart', methods=['DELETE'])
@jwt_required()
def remove_from_cart():
    user_id = get_jwt_identity()
    body = request.get_json()
    
    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        return jsonify({"msg": "Cart not found"}), 404

    cart_item = CartItem.query.filter_by(id=body["cart_item_id"], cart_id=cart.id).first()
    if not cart_item:
        return jsonify({"msg": "Cart item not found"}), 404

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"msg": "Item removed from cart!"}), 200

# --- PROFILE ---
@api.route('/profile', methods=['POST'])
@jwt_required()
def add_profile():
    body = request.get_json()
    user_id = get_jwt_identity()

    new_profile = Profile(
        first_name=body["first_name"],
        last_name=body["last_name"],
        phone_number=body.get("phone_number"),
        address=body.get("address"),
        user_id=user_id
        
    )
    db.session.add(new_profile)
    db.session.commit()
    return jsonify({"msg": "Profile created successfully!", "profile_id": new_profile.id}), 201

@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"msg": "Profile not found"}), 404
    return jsonify(profile.serialize()), 200

@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    body = request.get_json()
    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"msg": "Profile not found"}), 404

    profile.first_name = body.get("first_name", profile.first_name)
    profile.last_name = body.get("last_name", profile.last_name)
    profile.phone_number = body.get("phone_number", profile.phone_number)
    profile.address = body.get("address", profile.address)
    db.session.commit()
    return jsonify({"msg": "Profile updated successfully!", "profile": profile.serialize()}), 200