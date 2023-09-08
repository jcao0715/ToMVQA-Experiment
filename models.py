from flask_sqlalchemy import SQLAlchemy
import string
import random

db = SQLAlchemy()

class ExperimentData(db.Model):
    __tablename__ = "experiment_data"
    Index = db.Column(db.Integer, primary_key=True, autoincrement=True)
    SubjectID = db.Column(db.String(64), unique=True, nullable=False)
    SubjectPrivateCode = db.Column(db.String(16))
    SubjectSource = db.Column(db.String(16), default="web")
    SubjectReturnCode = db.Column(db.String(16))
    RefererExtraInfo = db.Column(db.JSON, default={})
    Experiment = db.Column(db.String(64), nullable=False)
    Version = db.Column(db.String(8), default="1.0")
    Status = db.Column(db.String(64), default="initializing")
    Condition = db.Column(db.Integer, default=0)
    Counterbalance = db.Column(db.Integer, default=0)
    Data = db.Column(db.JSON, default={})
    Events = db.Column(db.JSON, default={})
    
    def make_random_private_code(self):
        chars = string.ascii_letters + string.digits
        self.SubjectPrivateCode = ''.join(random.choices(chars, k=9))