# embederator
Generate embedded video HTML from a URL

A node.js app which generates youTube embedded video HTML in a variety of formats
Built on express.js

# Instructions

- Build 'sudo npm install' and Run 'node app.js'
- Hit the required service with a POST request, and required paramters (Details below)

# Services:

- pathToApp:PORT/info : All video info printed to console as processed, the responds results as HTML
- pathToApp:PORT/embedded : All videos as embedded iFrames in a HTML list
- pathToApp:PORT/embedded : All videos as embedded iFrames in a HTML list

Inspired by https://github.com/qawemlilo/nodetube 