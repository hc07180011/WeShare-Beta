import os, json, argparse
import html
import socket

from hashlib import sha256
from datetime import datetime

from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS

from sql import SQLHelper

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024 * 1024
app.config['SECRET_KEY'] = 'a' * 24

sqlhelper = SQLHelper()

# Set permanent session
#@app.before_request
#def make_session_permanent():
#    print(session)

# Only for demo, probabily useless
@app.route('/weshare/eventCode', methods=['POST'])
def eventCode():
    code = request.form['eventCode']
    result = sqlhelper.CheckIfEventCodeExists(code)
    return jsonify({'valid': str(result)})

@app.route('/weshare/create', methods=['POST'])
def create():
    title = request.form['eventTitle']
    code, token = sqlhelper.CreateEvent(title)
    os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], code))
    os.mkdir(os.path.join(app.config['UPLOAD_FOLDER'], code, 'file'))
    os.mkdir(os.path.join(app.config['UPLOAD_FOLDER'], code, 'image'))

    #session.permanent = True
    #session['event_code'] = code
    #session['event_token'] = token

    #print(session, code, token)

    return jsonify({
        'event_code' : code,
        'event_token' : token
    })

# Login as administrator
@app.route('/weshare/admin', methods=['POST'])
def admin():
    token = request.form['eventToken']
    result = sqlhelper.LoginAsAdmin(token)
    if result is None:
        return jsonify({
            'valid' : 'False',
            'error_msg': 'Wrong token'
        })
    else:
        code, title = result
        #session['event_code'] = code
        #session['event_token'] = token
        return jsonify({
            'valid' : 'True',
            'event_code' : code,
            'event_title' : title
        })

# Join as audience
@app.route('/weshare/join', methods=['POST'])
def join():
    code = request.form['eventCode']
    if sqlhelper.CheckIfEventCodeExists(code):
        #session['event_code'] = code
        title = sqlhelper.GetEventTitle(code)
        return jsonify({
            'valid': 'True',
            'event_title': title
        })
    else:
        return jsonify({
            'valid': 'False',
            'error_msg': 'Event code does not exists'
        })

@app.route('/weshare/insert', methods=['POST'])
def insert():
    try:
        token = request.form['eventToken']
        code, title = sqlhelper.LoginAsAdmin(token)
    except:
        return jsonify({
            'valid': 'False',
            'error_msg': 'Wrong event token'
        })
    
    postType = request.form['postType']
    timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
    if postType in ['text', 'link', 'image', 'file']:
        if postType in ['text', 'link']:
            content = request.form['postContent']
            content = html.escape(content)
        else:
            file = request.files['postFile']
            filename = file.filename.strip().split('/')[-1]
            hashValue = sha256(filename.encode()).hexdigest()
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], code, postType, f'{hashValue}-{timestamp}-{filename}')
            content = json.dumps({
                'filename': filename,
                'filepath': filepath
            }, ensure_ascii=False).replace('"', '\'')
            file.save(filepath)

        sqlhelper.InsertPost(code, postType, content)
        return jsonify({
            'valid' : 'True'
        })
    else:
        return jsonify({
            'valid': 'False',
            'error_msg': 'Wrong post type'
        })

@app.route('/weshare/show', methods=['POST'])
def show():
    def parse(p):
        t = p[1]
        if t in ['text', 'link']:
            return {
                'timestamp': str(p[0]),
                'type': t,
                'content': p[2]
            }
        else:
            content = json.loads(p[2].replace('\'', '"').encode('utf-8'))
            filename = content['filename']
            filepath = content['filepath']
            return {
                'timestamp': str(p[0]),
                'type': t,
                'filename': filename,
                'filepath': filepath
            }

    code = request.form['eventCode']
    posts = list(map(parse, sqlhelper.GetPosts(code)))

    return jsonify({
        'posts' : posts
    })

@app.route('/weshare/destroy', methods=['POST'])
def destroy():
    password = request.form['nuclearBombPassword']  # "cnlab2020"
    if password == "cnlab2020":
        codes = sqlhelper.GetAllEventCodes()
        for code in codes:
            sqlhelper.RemoveEvent(code)

    return jsonify({
        "valid": "True",
        "msg": "What a wonderful world!"
    })

@app.route('/uploads/<path:filepath>', methods=['GET'])
def download(filepath):
    uploads = os.path.join(app.config['UPLOAD_FOLDER'])
    filename = filepath.split('/')[-1][81:]
    return send_from_directory(directory = uploads, filename = filepath, as_attachment = True, attachment_filename = filename)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--port', type=int, default=48780, help='Port number. Default: %(default)s.')
    args = parser.parse_args()

    hostname = socket.gethostname()
    ip_addr = socket.gethostbyname(hostname)  
    app.run(ip_addr, port=args.port, debug=False)
