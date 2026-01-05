from flask import Flask, render_template, request, redirect, url_for, jsonify
from datetime import datetime
import db
from collections import Counter
from dotenv import load_dotenv
import os

load_dotenv() 

app = Flask(__name__)

with app.app_context():
    db.setup(app)


@app.route("/")
def index():
    return render_template("home.html")


@app.route("/survey", methods=["GET", "POST"])
def survey():
    if request.method == "POST":
        try:
            name = request.form.get("name")
            genre = request.form.get("genre")
            favorite = request.form.get("favorite")
            watching = request.form.get("watching")
            recommend = request.form.get("recommend") == "on"
            feedback = request.form.get("feedback", "")
            timestamp = datetime.now()

            db.add_response(name, genre, favorite, feedback, timestamp, watching, recommend)

            return redirect(url_for("thanks"))

        except Exception as e:
            return f"Error: {e}", 500

    return render_template("survey.html")


@app.route("/decline")
def decline():
    return render_template("decline.html")


@app.route("/thankyou")
def thanks():
    return render_template("thankyou.html")


@app.route("/api/results")
def api_results():
    reverse = request.args.get('reverse', 'false').lower() == 'true'
    responses = db.get_responses()
    if reverse:
        responses = list(reversed(responses))
    return jsonify([dict(r) for r in responses])


@app.route("/admin/summary")
def admin_summary():
    responses = db.get_responses()

    genre_counts = Counter(r["genre"] for r in responses)
    fav_counts = Counter(r["favorite"] for r in responses)
    watching_counts = Counter(r["watching"] for r in responses)
    recommend_counts = Counter("Yes" if r["recommend"] else "No" for r in responses)
    ts_counts = Counter(r["timestamp"].strftime("%Y-%m-%d") for r in responses)

    return render_template(
        "admin_summary.html",
        responses=responses,
        genre_counts=genre_counts,
        fav_counts=fav_counts,
        watching_counts=watching_counts,
        recommend_counts=recommend_counts,
        ts_counts=ts_counts
    )
