from flask import Blueprint, request, jsonify
from extensions import db
from models import Location
import uuid, string, random

routes_bp = Blueprint('routes', __name__)

meet_sessions = {}

def generate_code(length=6):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=length))

# ── GET all locations or search ───────────────────────────────────────────────
@routes_bp.route('/api/locations', methods=['GET'])
def get_locations():
    query = request.args.get('q', '').strip()
    if query:
        results = Location.query.filter(
            Location.name.ilike(f'%{query}%')        |
            Location.description.ilike(f'%{query}%') |
            Location.building.ilike(f'%{query}%')    |
            Location.room.ilike(f'%{query}%')        |
            Location.category.ilike(f'%{query}%')
        ).all()
    else:
        results = Location.query.all()
    return jsonify([loc.to_dict() for loc in results])

# ── GET single location ───────────────────────────────────────────────────────
@routes_bp.route('/api/locations/<int:id>', methods=['GET'])
def get_location(id):
    loc = Location.query.get_or_404(id)
    return jsonify(loc.to_dict())

# ── POST add location ─────────────────────────────────────────────────────────
@routes_bp.route('/api/locations', methods=['POST'])
def add_location():
    data     = request.get_json()
    required = ['name', 'type', 'category', 'lat', 'lng']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
    new_loc = Location(
        name        = data['name'],
        type        = data['type'],
        category    = data['category'],
        description = data.get('description', ''),
        building    = data.get('building', ''),
        room        = data.get('room', ''),
        lat         = data['lat'],
        lng         = data['lng'],
        icon        = data.get('icon', '📍'),
        color       = data.get('color', '#6B7280'),
    )
    db.session.add(new_loc)
    db.session.commit()
    return jsonify(new_loc.to_dict()), 201

# ── PUT update location ───────────────────────────────────────────────────────
@routes_bp.route('/api/locations/<int:id>', methods=['PUT'])
def update_location(id):
    loc  = Location.query.get_or_404(id)
    data = request.get_json()
    loc.name        = data.get('name',        loc.name)
    loc.type        = data.get('type',        loc.type)
    loc.category    = data.get('category',    loc.category)
    loc.description = data.get('description', loc.description)
    loc.building    = data.get('building',    loc.building)
    loc.room        = data.get('room',        loc.room)
    loc.lat         = data.get('lat',         loc.lat)
    loc.lng         = data.get('lng',         loc.lng)
    loc.icon        = data.get('icon',        loc.icon)
    loc.color       = data.get('color',       loc.color)
    db.session.commit()
    return jsonify(loc.to_dict())

# ── DELETE location ───────────────────────────────────────────────────────────
@routes_bp.route('/api/locations/<int:id>', methods=['DELETE'])
def delete_location(id):
    loc = Location.query.get_or_404(id)
    db.session.delete(loc)
    db.session.commit()
    return jsonify({'message': f'"{loc.name}" deleted'})

# ── POST create meet session ──────────────────────────────────────────────────
@routes_bp.route('/api/meet/create', methods=['POST'])
def create_meet_session():
    code = generate_code()
    meet_sessions[code] = {'users': {}, 'created_at': str(uuid.uuid4())}
    return jsonify({'code': code, 'link': f'/meet/{code}'})

# ── GET check meet session ────────────────────────────────────────────────────
@routes_bp.route('/api/meet/<code>', methods=['GET'])
def check_meet_session(code):
    if code in meet_sessions:
        return jsonify({'valid': True,  'code': code})
    return jsonify({'valid': False, 'code': code}), 404


from flask import session

ADMIN_PASSWORD = '123456'

@routes_bp.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    if data.get('password') == ADMIN_PASSWORD:
        return jsonify({'success': True, 'token': 'oou_admin_token_9x7k'})
    return jsonify({'success': False, 'error': 'Wrong password'}), 401

@routes_bp.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    return jsonify({'success': True})

@routes_bp.route('/api/admin/check', methods=['GET'])
def admin_check():
    token = request.headers.get('X-Admin-Token', '')
    return jsonify({'authenticated': token == 'oou_admin_token_9x7k'})


@routes_bp.route('/api/admin/seed', methods=['GET'])
def manual_seed():
    try:
        from data import SAMPLE_LOCATIONS
        from models import Location
        count = Location.query.count()
        if count == 0:
            for loc in SAMPLE_LOCATIONS:
                db.session.add(Location(**loc))
            db.session.commit()
            return jsonify({'message': f'Seeded {Location.query.count()} locations'})
        return jsonify({'message': f'Already has {count} locations'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


import os

@routes_bp.route('/api/admin/dbcheck', methods=['GET'])
def db_check():
    db_url = os.environ.get('DATABASE_URL', 'NOT SET')
    # Hide password but show structure
    if db_url != 'NOT SET':
        parts = db_url.split('@')
        safe  = parts[0].split(':')[0] + ':***@' + parts[1] if len(parts) > 1 else 'MALFORMED'
    else:
        safe = 'NOT SET'
    return jsonify({
        'database_url_set': db_url != 'NOT SET',
        'database_url_preview': safe,
        'using_sqlite': 'sqlite' in str(db_url).lower(),
    })