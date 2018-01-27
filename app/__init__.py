from flask import Flask
from flask_socketio import SocketIO


app = Flask(__name__)
app.config.from_object('config')
socketio = SocketIO(app)

connected_user = {}
code_used = {}
room_numbers = [100000]
room_losing_condition = {}

from app import views
