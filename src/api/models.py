from typing import List, Optional
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

# --- USER MODEL ---
class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True)

    # A user can have many orders
    # orders: Mapped[List["Order"]] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "orders": [order.id for order in self.orders],

        }

# --- SHOE (PRODUCT) MODEL ---
class Shoe(db.Model):
    __tablename__ = "shoe"
    id: Mapped[int] = mapped_column(primary_key=True)
    brand: Mapped[str] = mapped_column(String(80), nullable=False)
    model_name: Mapped[str] = mapped_column(String(120), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    img_url: Mapped[Optional[str]] = mapped_column(String(500))

    # Link to inventory (sizes)
    # inventory: Mapped[List["Stock"]] = relationship(back_populates="shoe", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "brand": self.brand,
            "model_name": self.model_name,
            "price": self.price,
            "img_url": self.img_url,
            "available_stock": [item.serialize() for item in self.inventory]
        }

class Profile(db.Model):
    __tablename__ = "profile"
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20))
    address: Mapped[Optional[str]] = mapped_column(String(500))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship()
    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone_number": self.phone_number,
            "address": self.address,
            "user_id": self.user_id
        }
class login(db.Model):
    __tablename__ = "login"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email
        }   
      

# # --- STOCK MODEL (SIZES) ---
# class Stock(db.Model):
#     __tablename__ = "stock"
#     id: Mapped[int] = mapped_column(primary_key=True)
#     size: Mapped[float] = mapped_column(Float, nullable=False)
#     quantity: Mapped[int] = mapped_column(Integer, default=0)
    
#     shoe_id: Mapped[int] = mapped_column(ForeignKey("shoe.id"))
#     shoe: Mapped["Shoe"] = relationship(back_populates="inventory")

#     def serialize(self):
#         return {"size": self.size, "quantity": self.quantity}

# # --- ORDER MODEL (PURCHASES) ---
# class Order(db.Model):
#     __tablename__ = "order"
#     id: Mapped[int] = mapped_column(primary_key=True)
#     total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    
#     user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
#     user: Mapped["User"] = relationship(back_populates="orders")

#     def serialize(self):
#         return {
#             "order_id": self.id,
#             "user_id": self.user_id,
#             "total": self.total_amount
#         }