from nongen import getPoem
from flask import Flask, request, jsonify
from functools import wraps
app = Flask(__name__)

template = """
<html>
  <body><center>
    <i><font face="helvetica,georgia,courier,arial" color="#666666">*****</font></i>
  </center></body>
</html>
"""

# allow jsonP
# mostly via https://gist.github.com/1094140
def jsonp(f):
  global app
  @wraps(f)
  def decorated_function(*args, **kwargs):
    callback = request.args.get('callback', False)
    if callback:
      content = str(callback) + '(' + str(f(*args,**kwargs).data) + ')'
      return app.response_class(content, mimetype='application/javascript')
    else:
      return f(*args, **kwargs)
  return decorated_function

@app.route("/", methods=['GET'])
def withParams():
  url = request.args.get('url', 'http://eliotswasteland.tripod.com/twl.html')
  lines = request.args.get('lines', '5')
  words = request.args.get('words', '7')
  return getPoem(url, int(lines), int(words), True)

@app.route("/short")
def shortPoem():
  return template.replace("*****", getPoem("http://eliotswasteland.tripod.com/twl.html", 1, 7, True))

@app.route("/default")
def defaultPoem():
  return getPoem("http://eliotswasteland.tripod.com/twl.html", 5, 7, True)

@app.route("/json")
@jsonp
def getJSON():
  url = request.args.get('url', 'http://eliotswasteland.tripod.com/twl.html')
  lines = request.args.get('lines', '5')
  words = request.args.get('words', '7')
  return jsonify({'poem': getPoem(url, int(lines), int(words), True)})

if __name__ == "__main__":
  app.run(host='0.0.0.0')
