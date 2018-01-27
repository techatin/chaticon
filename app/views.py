from . import app, socketio, connected_user, code_used, room_numbers
from . import room_losing_condition
from flask import render_template
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
    return render_template('index.html', async_mode=socketio.async_mode)


@app.route('/api/create_room', methods=['POST'])
def create_room():
    data = {'room_number': room_numbers[-1] + 1}
    room_numbers.append(room_numbers[-1] + 1)
    return json.dumps(data)


@socketio.on('join', namespace='/api')
def on_join(data):
    print(rooms())

    username = data['username']
    room_code = int(data['room'])

    people_inside = connected_user.get(room_code, [])
    num_people = len(people_inside)

    if (room_code not in room_numbers):
        emit('error', {"error_message": "Room does not exist yet."})

    if (num_people == 2):
        # two people are already inside, cannot join this room
        emit('error', {"error_message": "A game is already ongoing."})
        return

    if (username in people_inside):
        emit('error', {"error_message": "Username is already taken."})
        return

    join_room(room_code)
    people_inside.append(username)
    connected_user[room_code] = people_inside
    num_people += 1

    print('room joined')

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
        emit('my_response', {'count': 0, 'data': json_data}, room=room_code)


@socketio.on('leave', namespace='/api')
def on_leave(data):
    print(data)
    username = data['username']
    room_code = int(data['room'])
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


@socketio.on('message', namespace='/api')
def on_message(data):
    message_data = data['body']
    room_code = int(data['room'])
    people_inside = connected_user.get(room_code, [])

    if (len(people_inside) != 2):
        emit('error', {'error_message': 'The other player has not joined yet!'})
        return

    print("message!")
    print(room_code)
    emit('message', {'text': message_data}, room=room_code)
    print("emitted")


@socketio.on('emotion', namespace='/api')
def on_emotion(data):
    emotion_data = data['body']
    user = data['username']
    room_code = int(data['room'])
    people_inside = connected_user.get(room_code, [])

    if (len(people_inside) != 2):
        emit('error', {'error_message': 'The other player has not joined yet!'})
        return

    # Check if the emotion detected is the winning condition
    # for the other player

    if (emotion_data == room_losing_condition[room_code][user]):
        print("Game Over")
