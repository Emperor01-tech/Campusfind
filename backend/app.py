import os
from flask import Flask
from flask_cors import CORS
from extensions import db, socketio
from datetime import timedelta

def create_app():
    app = Flask(__name__)

    # Allow requests from your Vercel frontend
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Config
    app.config['SQLALCHEMY_DATABASE_URI']        = 'sqlite:///campusfind.db'
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
        async_mode           = 'eventlet',
    )

    from routes  import routes_bp
    from sockets import register_sockets

    app.register_blueprint(routes_bp)
    register_sockets(socketio)

    return app

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("✅ Database ready")
    socketio.run(app, debug=True, port=5000)