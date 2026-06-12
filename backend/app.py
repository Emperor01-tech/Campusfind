import os
from flask import Flask
from flask_cors import CORS
from extensions import db, socketio
from datetime import timedelta

def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "*"}})

    app.config['SQLALCHEMY_DATABASE_URI']        = 'sqlite:///campusfind.db?check_same_thread=False'
    app.config['SQLALCHEMY_ENGINE_OPTIONS']      = {
        'connect_args': {'check_same_thread': False},
        'pool_pre_ping': True,
    }
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY']                     = os.environ.get(
                                                     'SECRET_KEY',
                                                     'campusfind_oou_secret'
                                                   )
    app.config['SESSION_COOKIE_SAMESITE']        = 'None'
    app.config['SESSION_COOKIE_SECURE']          = True
    app.config['SESSION_COOKIE_HTTPONLY']        = True
    app.config['PERMANENT_SESSION_LIFETIME']     = timedelta(hours=8)

    db.init_app(app)
    socketio.init_app(
        app,
        cors_allowed_origins = "*",
        async_mode           = 'threading',
    )

    from routes  import routes_bp
    from sockets import register_sockets

    app.register_blueprint(routes_bp)
    register_sockets(socketio)

    with app.app_context():
        db.create_all()
        try:
            from models import Location
            if Location.query.count() == 0:
                from seed import sample_locations
                for loc in sample_locations:
                    db.session.add(Location(**loc))
                db.session.commit()
                print("✅ Database seeded successfully")
            else:
                print("✅ Database already has data")
        except Exception as e:
            print(f"⚠️ Seed error: {e}")

    return app

app = create_app()

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)