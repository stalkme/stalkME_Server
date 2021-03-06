# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

import http.server
import mysql.connector
import cgi
import json

try:
    connection = mysql.connector.connect(host='localhost',
                                         database='stalkmemain',
                                         user='root',
                                         password='123')
    if connection.is_connected():
        cursor = connection.cursor()
        cursor.execute("select database();")
        record = cursor.fetchone()
        print("Your connected to database: ", record[0])
except mysql.connector.Error as e:
    print("Error while connecting to MySQL", e)


class my_own_HTTPHandler(http.server.BaseHTTPRequestHandler):
  
    def set_Headers(self):
        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/html')
        self.end_headers()
        message = "StalkME I see you!!!"
        self.wfile.write(bytes(message, "utf8"))
    
    def do_POST(self):
        contentType, parseDict = cgi.parse_header(self.headers.get('content-type'))  
        if contentType != 'application/json':
            self.send_response(400)
            self.end_headers()
            return
        
        length = int(self.headers.get('content-length'))
        message = json.loads(self.rfile.read(length))
        if 'id' not in message or message['id'] == None: 
            sql_request = 'INSERT INTO userinfo  (UserID) VALUES (%s)'
            cursor = connection.cursor()
            cursor.execute("""SELECT MAX(A.UserID) 
            FROM userinfo AS A """)
            new_id = cursor.fetchone()[0] + 1
            print(new_id)
            cursor.execute(sql_request,(new_id,))
            connection.commit()
            response_dict = {'id':new_id}
            self.set_Headers()
            self.wfile.write(bytes(json.dumps(response_dict),'utf-8'))
            new_id = 0;
            return
        if (message['nickname'] == None or message['latitude'] == None or message['longitude'] == None):
            self.send_response(400)
            self.end_headers()
            return
        insert_request = ("""UPDATE userinfo
                            SET nickname = %s, message = %s, Xcoordinate = %s, Ycoordinate = %s
                            WHERE UserID is not NULL 
                            AND UserID = %s""")
        values = (message['nickname'],message['message'],message['longitude'],message['latitude'],message['id'])
        cursor = connection.cursor()
        cursor.execute(insert_request, values) 
        connection.commit()
        get_nearby_users_query = ("""SELECT A.userid,A.nickname, A.message, A.Xcoordinate, A.Ycoordinate 
                                  FROM userinfo as A
                                  WHERE A.nickname is not NULL
                                  AND A.Xcoordinate is not NULL""")
        cursor.execute(get_nearby_users_query)
        message = cursor.fetchall()
        response = []
        for x in message:
            responseDict = {}
            responseDict['id'] = x[0]
            responseDict['nickname'] = x[1]
            responseDict['message'] = x[2]
            responseDict['longitude'] = x[3]
            responseDict['latitude'] = x[4]
            response.append(responseDict)
        print (response)
        self.set_Headers()
        self.send_response(200)
        self.wfile.write(bytes(json.dumps(response),'utf-8'))
#%%
def run():
    print('Server is working...')
    
    server_address = ('',49153)
    httpd = http.server.HTTPServer(server_address, my_own_HTTPHandler)
    print('Running...')
    httpd.serve_forever()

run()
print("chuj")
if (connection.is_connected()):
    cursor.close()
    connection.close()
    print("MySQL connection is closed")


 