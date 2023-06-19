import socketio
print('start...')

sio = socketio.Client()
sio.connect('wss://rectle-2de8276d-f570-4f51-8d11-2096537832c3.loca.lt',headers={
    'X-Build': '99999',
    'X-Token': '95b2f07be4d27012b537a2892bd7c11b4ebacb4c2b8316a407b284826adc600e',
    'bypass-tunnel-reminder': 'rectle'
  },wait=True, wait_timeout= 10, namespaces=['/private']
)

print('phase 1 ...', sio)
@sio.on('connect')
def connect():
  print('socket is connected')
  sio.emit("build:start", namespace='/private')


@sio.on('disconnect')
def disconnect():
  print('server is down')


connect()