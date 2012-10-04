from nongen import getPoem
from flask import Flask, request
app = Flask(__name__)

@app.route("/", methods=['GET'])
def withParams():
  url = request.args.get('url', 'http://eliotswasteland.tripod.com/twl.html')
  lines = request.args.get('lines', '5')
  words = request.args.get('words', '7')
  return getPoem(url, int(lines), int(words), True)

@app.route("/short")
def shortPoem():
  return getPoem("http://eliotswasteland.tripod.com/twl.html", 1, 7, True)

@app.route("/default")
def defaultPoem():
  return getPoem("http://eliotswasteland.tripod.com/twl.html", 5, 7, True)

if __name__ == "__main__":
  app.run()