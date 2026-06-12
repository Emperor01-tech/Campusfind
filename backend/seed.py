from app import app
from extensions import db
from models import Location
from data import SAMPLE_LOCATIONS

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()
        db.create_all()
        for loc in SAMPLE_LOCATIONS:
            db.session.add(Location(**loc))
        db.session.commit()
        print(f"✅ Seeded {len(SAMPLE_LOCATIONS)} locations")