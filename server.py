# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

import http.server
import mysql.connector
import cgi

try:
    connection = mysql.connector.connect(host='localhost',
                                         database='stalkMEMain',
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
        self.set_Headers()
        message = "StalkME I see you!!!"
        
        self.wfile.write(bytes(message, "utf8"))
        return
    
    def do_POST(self):
        contentType, parseDict = cgi.parse_header(self.headers.getheader('content-type'))
        
        
        if contentType != 'application/json':
            self.send_response(400)
            self.end_headers()
            return
        
        length = int(self.headers.getheader('content-length'))
        message = json.loads(self.rfile.read(length))
        
        self.set_Headers()
        message['length'] = length
        self.set_Headers
        self.wfile.write(json.dumps(message))

#%%
def run():
    print('Server is working...')
    
    server_address = ('',49153)
    httpd = http.server.HTTPServer(server_address, my_own_HTTPHandler)
    print('Running...')
    httpd.serve_forever()

run()
if (connection.is_connected()):
    cursor.close()
    connection.close()
    print("MySQL connection is closed")


 