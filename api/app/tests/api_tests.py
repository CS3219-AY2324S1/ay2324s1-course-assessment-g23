from fastapi import FastAPI
from fastapi.testclient import TestClient
import re
import sys
import os
from pathlib import Path

path = Path(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(r'C:\Users\lavan\OneDrive - National University of Singapore\CS3219\ay2324s1-course-assessment-g23\api\app')

import main
client = TestClient(main.app)

def test_create_user():
    response = client.post("/users", json={
        "username": "testuser111012",
        "email": "test1010112@example.com",
        "password": "testpassword"
    })
    print(response)
    assert response.status_code == 200
    pattern =  r'User(\w+\) successfully created'
    assert re.search(pattern, response.json()['message'])

test_create_user()