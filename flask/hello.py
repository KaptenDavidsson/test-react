from flask import Flask
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, ForeignKey, Integer, String
from cors import crossdomain
from models import Todo, session

app = Flask(__name__, static_folder='../my-app/build', static_url_path='')


@app.route("/hello")
@crossdomain(origin='*')
def hello():
    return jsonify([x.as_dict() for x in session.query(Todo)])


if __name__ == "__main__":
    app.run()