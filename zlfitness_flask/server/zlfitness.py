from flask import Flask, request
import sqlite3
import json
import requests
import time

app = Flask(__name__)

@app.route('/root', methods=['GET'])
def base1():
    return "test  world!"


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
    return openid


@app.route('/fitness/upload', methods=['POST'])
def upload():
    conn = sqlite3.connect('zlfitness.db')
    cursor = conn.cursor()
    conn.text_factory = str
    try:
        openid = request.values.get("Openid")
        project = request.values.get("Project")
        group1 = request.values.get("Group1")
        group2 = request.values.get("Group2")
        group3 = request.values.get("Group3")
        group4 = request.values.get("Group4")
        summary = request.values.get("Summary")
        date = time.strftime('%Y-%m-%d', time.localtime())
        note1 = time.strftime("%y%m%d%H%M%S", time.localtime(time.time()))
        cursor.execute(
            "INSERT INTO fitness_flow (id, project, group1,group2,group3,group4,summary,time,note1) VALUES (?, ?, ?,?,?,?,?,?,?)",
            (openid, project, group1, group2, group3, group4, summary, date, note1))
        conn.commit()
    except Exception as e:
        conn.rollback()
    conn.close()
    return "1111"


@app.route('/fitness/history', methods=['GET'])
def history():
    period = request.args.get("period")
    openid = request.args.get("openid")
    conn = sqlite3.connect('zlfitness.db')
    try:
        cursor = conn.cursor()
        if period == "all":
            cursor.execute('SELECT * FROM fitness_flow WHERE id=? order by time desc', (openid,))
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
                note1 = i[8]
                row = {"date": date, "project": project, "group": group, "summary": summary, "note1": note1}
                rowlist.append(row)
            rowjson = json.dumps(rowlist)
            conn.close()
        return rowjson
    except Exception as e:
        print(e)
        conn.close()

@app.route('/fitness/genfile', methods=['GET'])
def genfile():
    import pandas as pd
    import xlwt
    import openpyxl
    period = request.args.get("period")
    openid = request.args.get("openid")
    conn = sqlite3.connect('zlfitness.db')
    try:
        cursor = conn.cursor()
        if period == "all":
            cursor.execute('SELECT * FROM fitness_flow WHERE id=?', (openid,))
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
                #note1 = i[8]
                row = [date, project, group, summary]
                rowlist.append(row)
            conn.close()
            df = pd.DataFrame(data=rowlist, columns=['日期','锻炼项目','锻炼次数','小结'])
            df.to_excel('/var/www/html/test_all.xls', na_rep=True)
        return "gen succ"
    except Exception as e:
        print (e)
        conn.close()


@app.route('/fitness/del', methods=['GET'])
def delete():
    note1 = request.args.get("note1")
    openid = request.args.get("openid")
    conn = sqlite3.connect('zlfitness.db')
    try:
        cursor = conn.cursor()
        cursor.execute('delete from fitness_flow where id=? and note1=?', (openid, note1))
        conn.commit()
        conn.close()
        return "del secc"
    except Exception as e:
        print(e)
        conn.close()


if __name__ == '__main__':
    app.run('0.0.0.0', ssl_context=("/root/certificate.pem", "/root/privatekey.pem"), port=1443)
