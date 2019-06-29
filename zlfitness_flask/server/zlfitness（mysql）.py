from flask import Flask, request
import pymysql
import json

app = Flask(__name__)

@app.route('/')
def main():
    return "HELLO WORLD"

@app.route('/fitness/history', methods=['GET'])
def history():
    para = request.args.values()
    period = para[0]
    conn = pymysql.connect(host='127.0.0.1', user='root', password='gfszl', database='test', charset='utf8')
    try:
        cursor = conn.cursor()
        if period =="all":
            cursor.execute("select * from fitness_flow")
            rowlist = []
            recv = cursor.fetchall()
            for i in recv:
                date = str(i[0]).split(" ")[0]
                project = i[1]
                group = ''
                for j in [2, 3, 4, 5]:
                    if i[j].strip() != "":
                        group = group + 'group'+str(j-1)+':'+i[j] + ' '
                    else:
                        break
                summary = i[6]
                row = {"date":date,"project":project,"group":group,"summary":summary}
                rowlist.append(row)
            rowjson = json.dumps(rowlist)
        return rowjson
    except Exception as e:
        print (e)
	conn.close()
    

@app.route('/fitness/upload', methods=['POST'])
def upload():
    conn = pymysql.connect(host='127.0.0.1', user='root', password='gfszl', database='test', charset='utf8')
    cursor = conn.cursor()
    try:
        para = request.values.items()
        project = para[0][1];group1 = para[2][1];group2 = para[4][1];group3 = para[3][1];group4 = para[1][1];summary = para[5][1]
        cursor.execute(
            "insert into fitness_flow (project, group1,group2,group3,group4,summary,inputdate) VALUES (%s,%s,%s,%s,%s,%s,now())",
            (project, group1, group2, group3, group4, summary))
        conn.commit()
    except Exception as e:
        conn.rollback()
    conn.close()
    return "1111"

if __name__ == '__main__':
    app.run('0.0.0.0', ssl_context=("./xcx.cegc.com.cn/certificate.pem","./xcx.cegc.com.cn/privatekey.pem"),port=443)
