from flask import Flask, request
import sqlite3
import json
import requests
import redis
import time

app = Flask(__name__)


@app.route('/fitness/login', methods=['GET'])
def login():
    code = request.args.get('code')
    qs = {
        'appid': 'wx204299628099ac7f',
        'secret': '6987c9763d3769312109f212e7be39ac',
        'js_code': code,
        'grant_type': 'authorization_code'
    }
    res = requests.get('https://api.weixin.qq.com/sns/jscode2session', params=qs)
    openid = res.json().get('openid')
    sessionid = openid + time.strftime("%S", time.localtime(time.time()))
    r = redis.Redis(host='localhost', port=6379, decode_responses=True)
    r.set(sessionid, openid)
    return sessionid

@app.route('/fitness/upload', methods=['POST'])
def upload():
    r = redis.Redis(host='localhost', port=6379, decode_responses=True)
    conn = sqlite3.connect('zlfitness.db')
    cursor = conn.cursor()
    conn.text_factory = str
    try:
        sessionid = request.values.get("Sessionid")
        openid = r.get(sessionid)
        project = request.values.get("Project")
        group1 = request.values.get("Group1")
        group2 = request.values.get("Group2")
        group3 = request.values.get("Group3")
        group4 = request.values.get("Group4")
        summary = request.values.get("Summary")
        date =time.strftime('%Y-%m-%d', time.localtime())
        cursor.execute("INSERT INTO fitness_flow (id, project, group1,group2,group3,group4,summary,time) VALUES (?, ?, ?,?,?,?,?,?)", (openid, project, group1, group2, group3, group4, summary, date))
        conn.commit()
        conn.close()
        return ("succ!")
    except Exception as e:
        conn.rollback()
        conn.close()
        return ("unsc")

@app.route('/fitness/history', methods=['GET'])
def history():
    period = request.args.get("period")
    sessionid = request.args.get("sessionid")
    r = redis.Redis(host='localhost', port=6379, decode_responses=True)
    openid = r.get(sessionid)
    conn = sqlite3.connect('zlfitness.db')
    try:
        cursor = conn.cursor()
        if period == "all":
            cursor.execute('select * from fitness_flow where id=?', (openid,))
            rowlist = []
            recv = cursor.fetchall()
            for i in recv:
                date = str(i[1]).split(" ")[0]
                project = i[2]
                group = ''
                for j in [3, 4, 5, 6]:
                    if i[j].strip() != "":
                        group = group + 'group' + str(j - 2) + ':' + i[j] + ' '
                    else:
                        break
                summary = i[7]
                row = {"date": date, "project": project, "group": group, "summary": summary}
                rowlist.append(row)
            rowjson = json.dumps(rowlist)
            conn.close()
        return rowjson
    except Exception as e:
        print (e)
        conn.close()

if __name__ == '__main__':
    app.run('0.0.0.0', ssl_context=("/root/certificate.pem", "/root/privatekey.pem"), port=443)
