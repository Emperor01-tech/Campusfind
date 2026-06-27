from extensions import db

class Location(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(100), nullable=False)
    type        = db.Column(db.String(50),  nullable=False)
    category    = db.Column(db.String(50),  nullable=False)
    description = db.Column(db.String(200))
    building    = db.Column(db.String(100))
    room        = db.Column(db.String(50))
    lat         = db.Column(db.Float, nullable=False)
    lng         = db.Column(db.Float, nullable=False)
    icon        = db.Column(db.String(10))
    color       = db.Column(db.String(10))

    def to_dict(self):
        return {
            'id':          self.id,
            'name':        self.name,
            'type':        self.type,
            'category':    self.category,
            'description': self.description,
            'building':    self.building,
            'room':        self.room,
            'lat':         self.lat,
            'lng':         self.lng,
            'icon':        self.icon,
            'color':       self.color,
        }

from datetime import datetime, timedelta

class MeetSession(db.Model):
    code       = db.Column(db.String(20), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'code':       self.code,
            'created_at': self.created_at.isoformat(),
            'expires_at': self.expires_at.isoformat(),
        }