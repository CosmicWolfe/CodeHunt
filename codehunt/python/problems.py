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
    def __init__(self, index, problemId, contestId, name, rating, solvedByUser = False, attemptedByUser = False, solvedCount = 0, tags = []):
        self.index = index
        self.problemId = problemId
        self.contestId = contestId
        self.name = name
        self.rating = rating
        self.solvedByUser = solvedByUser
        self.attemptedByUser = attemptedByUser
        self.solvedCount = solvedCount
        self.tags = tags

problems = {}
converted = {}

def ConvertProblems():
    for index, problem in problems.items():
        converted[index] = problem.__dict__

        converted[index]["tags"] = problem.tags.copy()


def RefreshProblems():
   url = "https://codeforces.com/api/problemset.problems"
   html = requests.get(url)
   lists = json.loads(html.text)

   for problem in lists["result"]["problems"]:
       problemId = problem["index"]
       contestId = str(problem["contestId"]) if "contestId" in problem else "X"
       index = contestId + problemId
       name = problem["name"]
       rating = problem["rating"] if "rating" in problem else 0

       problems[index] = Problem(index, problemId, contestId, name, rating)
       problems[index].tags = problem["tags"].copy()

   for problemStats in lists["result"]["problemStatistics"]:
       contestId = str(problemStats["contestId"]) if "contestId" in problemStats else "X"
       index = contestId + problemStats["index"]
       solvedCount = problemStats["solvedCount"]

       if (problems[index].name.startswith("Labyrinth")):
           problems.pop(index)
       else:
           problems[index].solvedCount = solvedCount

   ConvertProblems()

@app.route("/problems/<username>")
def getProblems(username):
     for index, problem in converted.items():
         problem["solvedByUser"] = False
         problem["attemptedByUser"] = False

     url = "https://codeforces.com/api/user.status?handle=" + username

     html = requests.get(url)
     submissions = json.loads(html.text)
     for submission in submissions["result"]:
         problem = submission["problem"]
         contestId = str(problem["contestId"]) if "contestId" in problem else "X"
         index = contestId + problem["index"]
         if (index in converted):
             converted[index]["attemptedByUser"] = True
             if (submission["verdict"] == "OK"):
                 converted[index]["solvedByUser"] = True
     return json.dumps(converted)

@app.route("/submissions/<username>")
def getSubmissions(username):
    url = "https://codeforces.com/api/user.status?handle=" + username
    html = requests.get(url)
    return html
  
if __name__ == '__main__':
   RefreshProblems()
   app.run(port=5002)
