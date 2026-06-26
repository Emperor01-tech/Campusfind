@routes_bp.route('/api/admin/dbcheck', methods=['GET'])
def db_check():
    from extensions import db
    actual_engine_url = str(db.engine.url)
    return jsonify({
        'actual_engine_connected_to': actual_engine_url,
    })