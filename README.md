# WeShare Beta

#### A chrome extension that makes sharing easier.

<img src="./src/logo.png" height="100px" />

## Usage

```bash
git clone https://github.com/andy94077/WeShare.git
```

### Setup backend

* install sqlite3
```bash
sudo apt install sqlite3
sqlite3 WeShare.db < setup.sql
```

* install requirements
```bash
pip3 install -r requirements.txt
```

* run backend
```bash
python3 backend.py
```

### Setup frontend

* install npm: https://www.npmjs.com, then
```bash
npm install
npm start
```
server will run at http://localhost:48763
