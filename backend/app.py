import os
from flask import Flask
from flask_cors import CORS
from datetime import timedelta
from src.database import db
from src.users import users
from src.students import students
from src.courses import courses
from src.jwt import jwt


def create_app():
    app = Flask(__name__)

    username = os.environ.get('username')
    password = os.environ.get('password')
    hostname = os.environ.get('hostname')
    databasename = os.environ.get('databasename')
    DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
        username=username,
        password=password,
        hostname=hostname,
        databasename=databasename,
    )

    app.config.from_mapping(
        SECRET_KEY = os.environ.get('SECRET_KEY'),

        SQLALCHEMY_POOL_RECYCLE = 299,
        SQLALCHEMY_DATABASE_URI = DATABASE_URI,
        SQLALCHEMY_TRACK_MODIFICATIONS = False,

        JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY'),
        JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24),
        JWT_TOKEN_LOCATION = 'cookies',
        JWT_COOKIE_SAMESITE = "None",
        JWT_COOKIE_SECURE = True,
        JWT_COOKIE_CSRF_PROTECT = True,
        JWT_SESSION_COOKIE = False,
        JWT_CSRF_IN_COOKIES = False,

        MAX_CONTENT_LENGTH = 2 * 1000 * 1000  # 2 megabytes
    )

    db.app = app
    db.init_app(app)
    jwt.init_app(app)

    CORS(app, supports_credentials=True)

    app.register_blueprint(users)
    app.register_blueprint(courses)
    app.register_blueprint(students)

    return app


app = create_app()