from . import app, socketio, connected_user, code_used, room_numbers
from . import room_losing_condition, room_game_over
from flask import render_template, session, redirect, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
from flask_socketio import close_room
import json
import random


emotions = [
    'anger', 'contempt', 'disgust', 'fear',
    'happiness', 'sadness', 'surprise'
]


@app.route('/')
def index():
    return render_template('rooms.html', async_mode=socketio.async_mode)


@app.route('/chat')
def chat():
    return render_template('chat.html')


@app.route('/api/create_room', methods=['POST'])
def create_room():
    data = {'room_number': str(room_numbers[-1] + 1)}
    room_game_over[str(room_numbers[-1] + 1)] = False
    room_numbers.append(room_numbers[-1] + 1)
    return json.dumps(data)


@socketio.on('get_username', namespace='/api')
def get_username():
    print(session)
    print("Checking if this exists " + str(session['room']))
    print("Getting user name " + session['username'])
    socketio.sleep(0)
    emit('answer_username', {'username': session['username']})
    socketio.sleep(0)
    emit('hi', broadcast=True, room=session['room'], namespace='/api', skip_sid=None)


@app.route('/intermediate', methods=['POST'])
def intermediate():
    print("Triggered")
    return redirect(url_for('chat'))


@socketio.on('join', namespace='/api')
def on_join(data):
    print(rooms())

    username = data['username']
    room_code = str(data['room'])

    people_inside = connected_user.get(room_code, [])
    num_people = len(people_inside)

    if (int(room_code) not in room_numbers):
        emit('error', {"error_message": "Room does not exist yet."})

    if (num_people == 2):
        # two people are already inside, cannot join this room
        emit('error', {"error_message": "A game is already ongoing."})
        return

    if (username in people_inside):
        emit('error', {"error_message": "Username is already taken."})
        return

    session['username'] = username
    session['room'] = room_code
    print(session['username'])

    join_room(room_code)
    people_inside.append(username)
    connected_user[room_code] = people_inside
    num_people += 1

    print(list(socketio.server.manager.get_participants('/api', room_code)))

    print('room joined')
    emit('can_enter')
    emit('hi', room=room_code, skip_sid=None)

    # if (num_people == 2):
    #     # tells client that the room is ready
    #     # and sends them the generated emotions
    #     emotion_a = emotions[random.randint(0, 6)]
    #     emotion_b = emotions[random.randint(0, 6)]
    #
    #     json_data = json.dumps({
    #         people_inside[0]: emotion_a,
    #         people_inside[1]: emotion_b
    #     })
    #
    #     losing_condition = {
    #         people_inside[0]: emotion_b,
    #         people_inside[1]: emotion_a
    #     }
    #
    #     room_losing_condition[room_code] = losing_condition
    #
    #     print(json_data)
    #     emit('start_game', {'count': 0, 'data': json_data}, room=room_code)


@socketio.on('user_ready', namespace='/api')
def user_ready():

    username = session['username']
    room_code = str(session['room'])

    people_inside = connected_user.get(room_code, [])
    num_people = len(people_inside)

    if (num_people == 2):
        # tells client that the room is ready
        # and sends them the generated emotions
        emotion_a = emotions[random.randint(0, 6)]
        emotion_b = emotions[random.randint(0, 6)]

        json_data = json.dumps({
            people_inside[0]: emotion_a,
            people_inside[1]: emotion_b
        })

        losing_condition = {
            people_inside[0]: emotion_b,
            people_inside[1]: emotion_a
        }

        room_losing_condition[room_code] = losing_condition

        print(json_data)
        print(type(room_code))
        emit(
            'start_game',
            {'count': 0, 'data': {
                people_inside[0]: emotion_a,
                people_inside[1]: emotion_b
            }},
            room=room_code, broadcast=True, skip_sid=None)


@socketio.on('leave', namespace='/api')
def on_leave(data):
    print(data)
    username = session['username']
    room_code = session['room']
    people_inside = connected_user.get(room_code, [])
    num_people = len(people_inside)

    if (room_code not in room_numbers):
        emit('error', {'error_message': 'The room is of nonexistent.'})
        return

    if (num_people == 0):
        emit('error', {'error_message': 'The room is of empty.'})
        return

    if (username not in people_inside):
        emit('error', {'error_message': 'You are not in this room.'})
        return

    new_people = [i for i in people_inside if i != username]
    connected_user[room_code] = new_people
    print(new_people)

    leave_room(room_code)

    if (len(new_people) == 0):
        emit('my_response',
             {'count': 0, 'data': 'No one is in this room. Closing room.'})
        close_room(room_code)
        room_numbers.remove(room_code)
        connected_user[room_code] = []


@socketio.on('message_event', namespace='/api')
def on_message(data):
    message_data = data['body']
    room_code = session['room']
    people_inside = connected_user.get(room_code, [])

    print(room_code in socketio.server.manager.rooms['/api'])

    print(session['username'])

    if (len(people_inside) != 2):
        emit(
            'error',
            {'error_message': 'The other player has not joined yet!'})
        return

    print("message!")
    print(room_code)
    emit(
        'get_message', {
            'other_user': session['username'],
            'text': message_data
        },
        room=room_code,
        include_self=False,
        namespace="/api", skip_sid=None)
    print("emitted")


@socketio.on('emotion', namespace='/api')
def on_emotion(data):
    emotion_data = data['body']
    user = session['username']
    room_code = session['room']
    people_inside = connected_user.get(room_code, [])

    if (len(people_inside) != 2):
        emit(
            'error',
            {'error_message': 'The other player has not joined yet!'})
        return

    if (room_game_over[room_code]):
        emit(
            'error',
            {'error_message': 'Game is over.'}
        )
        return

    # Check if the emotion detected is the winning condition
    # for the other player

    if (emotion_data == room_losing_condition[room_code][user]):
        room_game_over[room_code] = True
        emit(
            'game_over',
            {'winner': [i for i in people_inside if i != user][0]},
            room=room_code, skip_sid=None)


"""
{
    '/': {
        None: {
            '3435d38049164527a892b3ce049ca830': True,
            '18b2380df922415a8a3f5044520b8edf': True
        },
        '3435d38049164527a892b3ce049ca830': {
            '3435d38049164527a892b3ce049ca830': True
        },
        '18b2380df922415a8a3f5044520b8edf': {
            '18b2380df922415a8a3f5044520b8edf': True
        }
    },
    '/api': {
        None: {
            '3435d38049164527a892b3ce049ca830': True,
            '18b2380df922415a8a3f5044520b8edf': True
        },
        '3435d38049164527a892b3ce049ca830': {
            '3435d38049164527a892b3ce049ca830': True
        },
        '18b2380df922415a8a3f5044520b8edf': {
            '18b2380df922415a8a3f5044520b8edf': True
        },
        '100001': {
            '18b2380df922415a8a3f5044520b8edf': True
        }
    }
}
"""
