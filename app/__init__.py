from flask import Flask
from flask_session import Session
from flask_socketio import SocketIO
import eventlet


eventlet.monkey_patch()
app = Flask(__name__)
app.config.from_object('config')
Session(app)
socketio = SocketIO(app,
                    manage_session=False, async_mode='eventlet',
                    logger=True, engineio_logger=True)

connected_user = {}
code_used = {}
room_numbers = [100000]
room_losing_condition = {}
room_game_over = {};

from app import views
