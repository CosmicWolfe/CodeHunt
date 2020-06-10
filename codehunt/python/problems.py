from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify

app = Flask(__name__)
api = Api(app)

CORS(app)

@app.route("/po/")
def helldo():
    return jsonify({'text':'Heldlo World!'})

@app.route("/")
def hello():
    return jsonify({'text':'Hello World!'})



class Employees(Resource):
    def get(self):
        return {'employees': [{'id':1, 'name':'Balram'},{'id':2, 'name':'Tom'}]} 

class Employees_Name(Resource):
    def get(self, employee_id):
        print('Employee id:' + employee_id)
        result = {'data': {'id':1, 'name':'Balram'}}
        return jsonify(result)       


api.add_resource(Employees, '/employees') # Route_1
api.add_resource(Employees_Name, '/employees/<employee_id>') # Route_3


if __name__ == '__main__':
   app.run(port=5002)

# for problem in problemList[:50]:
# 	print(problem.index)

# for problemStat in lists["result"]["problem"]:
# 	index = problem["index"]
# 	name = problem["name"]
# 	rating = problem["rating"]
# 	solvedCount = 0

# 	problems[index] = Problem(index, name, raring, solvedCount)

# {'contestId': 2, 'index': 'A', 'name': 'Winner', 'type': 'PROGRAMMING', 'rating': 1500, 
# 'tags': ['hashing', 'implementation']}, 

# # Make soup
# soup = BeautifulSoup(html.text, "html.parser")

# # Get all links
# links = soup.findAll("a")

# # Get all problem references
# problems = {}
# while (True):
# 	for link in links:
# 		# Get the reference
# 		ref = link["href"]
# 		if (re.match("/problemset/problem/*", ref)):
# 			problems[ref] = 1

# 	# Get to next page
# 	arrows = soup.findAll("a", "arrow")
# 	nextPageLink = ""
# 	for arrow in arrows:
# 		if (arrow.text == "→"):
# 			nextPageLink = arrow["href"]

# 	if (nextPageLink == ""): break
	
# 	url = urljoin(url, nextPageLink)
# 	html = requests.get(url)
# 	soup = BeautifulSoup(html.text, "html.parser")
# 	links = soup.findAll("a")

# for p in problems:
#  	print(p)
