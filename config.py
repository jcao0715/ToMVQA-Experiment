import os

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'mysecretkey')
    ADMIN_EMAIL = "jingcao@mit.edu"
    SQLALCHEMY_DATABASE_URI = None

