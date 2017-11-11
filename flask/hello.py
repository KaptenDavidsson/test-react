from flask import Flask
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, ForeignKey, Integer, String
from cors import crossdomain


app = Flask(__name__, static_folder='../my-app/build', static_url_path='')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

from models import Todo

@app.route("/hello")
@crossdomain(origin='*')
def hello():
    return jsonify([x.as_dict() for x in Todo.query.all()])


if __name__ == "__main__":
    app.run()