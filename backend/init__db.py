from app import app
from extensions import db
from models import Location

with app.app_context():
    db.create_all()
    
    # Only seed if empty
    if Location.query.count() == 0:
        from seed import sample_locations
        for loc in sample_locations:
            db.session.add(Location(**loc))
        db.session.commit()
        print(f"✅ Database seeded")
    else:
        print("✅ Database already has data")