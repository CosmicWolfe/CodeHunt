from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify
import requests
import re
from urllib.parse import urljoin
import json

app = Flask(__name__)
api = Api(app)

CORS(app)

class Problem(object):
    def __init__(self, index, name, rating, solvedByUser, solvedCount = 0, tags = []):
        self.index = index
        self.name = name
        self.rating = rating
        self.solvedByUser = solvedByUser
        self.solvedCount = solvedCount
        self.tags = tags

problems = {}

def RefreshProblems():
   url = "https://codeforces.com/api/problemset.problems"
   html = requests.get(url)
   lists = json.loads(html.text)

   for problem in lists["result"]["problems"]:
       contestId = str(problem["contestId"]) if "contestId" in problem else "X"
       index = contestId + problem["index"]
       name = problem["name"]
       rating = problem["rating"] if "rating" in problem else 0
       solvedByUser = False
       solvedCount = 0
       tags = problem["tags"]

       problems[index] = Problem(index, name, rating, solvedCount, tags)

   for problemStats in lists["result"]["problemStatistics"]:
       contestId = str(problemStats["contestId"]) if "contestId" in problemStats else "X"
       index = contestId + problemStats["index"]
       solvedCount = problemStats["solvedCount"]
       problems[index].solvedCount = solvedCount

def ConvertProblems():
    for index, problem in problems.items():
        problems[index] = problem.__dict__

@app.route("/problems/<username>")
def getProblems(username):
     RefreshProblems()

     url = "https://codeforces.com/api/user.status?handle=" + username

     html = requests.get(url)
     submissions = json.loads(html.text)
     for submission in submissions["result"]:
         problem = submission["problem"]
         contestId = str(problem["contestId"]) if "contestId" in problem else "X"
         index = contestId + problem["index"]
         if (submission["verdict"] == "OK" and index in problems):
	           problems[index].solvedByUser = True

     ConvertProblems()

     return json.dumps(problems)

@app.route("/submissions/<username>")
def getSubmissions(username):
    return jsonify({'text':'Hello World!'})
  
if __name__ == '__main__':
   app.run(port=5002)