import math

sessions = {}

def haversine(lat1, lng1, lat2, lng2):
    R  = 6371e3
    f1 = math.radians(lat1)
    f2 = math.radians(lat2)
    df = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a  = math.sin(df/2)**2 + math.cos(f1)*math.cos(f2)*math.sin(dl/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

def register_sockets(socketio):

    @socketio.on('join_session')
    def on_join(data):
        from flask_socketio import join_room, emit
        code    = data.get('code')
        user_id = data.get('userId')
        name    = data.get('name', 'Anonymous')
        if not code or not user_id: return
        join_room(code)
        if code not in sessions:
            sessions[code] = {}
        sessions[code][user_id] = {
            'userId': user_id,
            'name':   name,
            'lat':    None,
            'lng':    None,
        }
        emit('user_joined', {
            'userId': user_id,
            'name':   name,
            'count':  len(sessions[code]),
        }, room=code)

    @socketio.on('location_update')
    def on_location(data):
        from flask_socketio import emit
        code    = data.get('code')
        user_id = data.get('userId')
        lat     = data.get('lat')
        lng     = data.get('lng')
        if not all([code, user_id, lat, lng]): return
        if code in sessions and user_id in sessions[code]:
            sessions[code][user_id]['lat'] = lat
            sessions[code][user_id]['lng'] = lng
        users    = [u for u in sessions.get(code, {}).values() if u['lat'] is not None]
        distance = None
        if len(users) == 2:
            u1, u2   = users[0], users[1]
            distance = round(haversine(u1['lat'], u1['lng'], u2['lat'], u2['lng']))
        emit('locations_updated', {
            'users':    users,
            'distance': distance,
        }, room=code)

    @socketio.on('leave_session')
    def on_leave(data):
        from flask_socketio import leave_room, emit
        code    = data.get('code')
        user_id = data.get('userId')
        if code in sessions and user_id in sessions[code]:
            name = sessions[code][user_id].get('name', 'Someone')
            del sessions[code][user_id]
            leave_room(code)
            emit('user_left', {'userId': user_id, 'name': name}, room=code)

    @socketio.on('disconnect')
    def on_disconnect():
        print('🔌 A user disconnected')