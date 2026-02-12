import os
import smtplib
from email.message import EmailMessage
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# ==============================
# Load Environment Variables
# ==============================
load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

app = Flask(__name__)

if not EMAIL_USER or not EMAIL_PASS:
    print("❌ Email credentials not found in environment variables")
else:
    print("✅ Email credentials loaded successfully")

# ==============================
# Routes
# ==============================

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/menu.html")
def menu():
    return render_template("menu.html")

@app.route("/about.html")
def about():
    return render_template("about.html")

@app.route("/place_order", methods=["POST"])
def place_order():
    try:
        data = request.json

        customer_name = data.get("name")
        customer_address = data.get("address")
        cart_items = data.get("cart")
        total_amount = data.get("total")

        if not customer_name or not customer_address or not cart_items:
            return jsonify({"error": "Missing required fields"}), 400

        # Convert cart array to readable string
        items_string = ""
        for item in cart_items:
            items_string += f"{item['title']} - {item['price']}\n"

        # ==============================
        # Create Email
        # ==============================

        msg = EmailMessage()
        msg["Subject"] = "🛒 New Order Received"
        msg["From"] = EMAIL_USER
        msg["To"] = EMAIL_USER

        order_details = f"""
New Order Details:

Name: {customer_name}
Address: {customer_address}

Items Ordered:
{items_string}

Total: {total_amount}
"""

        msg.set_content(order_details)

        # ==============================
        # Send Email
        # ==============================

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)

        return jsonify({"message": "Order placed successfully!"}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Something went wrong"}), 500



# ==============================
# Run App
# ==============================

if __name__ == "__main__":
       app.run(debug=True)