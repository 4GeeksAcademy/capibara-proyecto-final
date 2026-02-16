import string
from typing import List, Optional
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False
    )
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True)
    is_admin: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )

    profile: Mapped[Optional["Profile"]] = relationship(
        back_populates="user", uselist=False
    )
    cart: Mapped[Optional["Cart"]] = relationship(
        back_populates="user", uselist=False
    )

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active,
            "is_admin": self.is_admin
        }


class Shoe(db.Model):
    __tablename__ = "shoe"
    id: Mapped[int] = mapped_column(primary_key=True)
    brand: Mapped[str] = mapped_column(String(80), nullable=False)
    model_name: Mapped[str] = mapped_column(String(120), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    img_url: Mapped[Optional[str]] = mapped_column(String(500))

    # ✅ MATCHING relationship for CartItem
    cart_items: Mapped[List["CartItem"]] = relationship(
        "CartItem", back_populates="shoe"
    )

    def serialize(self):
        return {
            "id": self.id,
            "brand": self.brand,
            "model_name": self.model_name,
            "price": self.price,
            "img_url": self.img_url
        }


class Profile(db.Model):
    __tablename__ = "profile"
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[Optional[str]] = mapped_column(String(120))
    last_name: Mapped[Optional[str]] = mapped_column(String(120))
    phone_number: Mapped[Optional[str]] = mapped_column(String(20))
    address: Mapped[Optional[str]] = mapped_column(String(500))

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False
    )
    user: Mapped["User"] = relationship(back_populates="profile")

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone_number": self.phone_number,
            "address": self.address
        }


class Cart(db.Model):
    __tablename__ = "cart"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="cart")
    items: Mapped[List["CartItem"]] = relationship(
        back_populates="cart", cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "items": [item.serialize() for item in self.items]
        }


class CartItem(db.Model):
    __tablename__ = "cart_item"
    id: Mapped[int] = mapped_column(primary_key=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)

    cart_id: Mapped[int] = mapped_column(
        ForeignKey("cart.id"), nullable=False
    )
    shoe_id: Mapped[int] = mapped_column(
        ForeignKey("shoe.id"), nullable=False
    )

    cart: Mapped["Cart"] = relationship(back_populates="items")
    shoe: Mapped["Shoe"] = relationship(back_populates="cart_items")

    def serialize(self):
        return {
            "id": self.id,
            "quantity": self.quantity,
            "shoe": self.shoe.serialize()
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
