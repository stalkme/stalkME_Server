# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

from http.server import BaseHTTPRequestHandler, HTTPServer



class my_own_HTTPHandler(BaseHTTPRequestHandler):
    
    def do_GET(self):
        self.send_response(200)
        
        self.send_header('Content-type','text/html')
        self.end_headers()
        
        message = "StalkME I see you!!!"
        
        self.wfile.write(bytes(message, "utf8"))
        return

def run():
    print('Server is working...')
    
    server_address = ('',49153)
    httpd = HTTPServer(server_address, my_own_HTTPHandler)
    print('Running...')
    httpd.serve_forever()

run()
    


 