# teamfinder-api
[![Build Status](https://travis-ci.org/prattl/teamfinder.svg?branch=master)](https://travis-ci.org/prattl/teamfinder)

## Install (development)
* Clone the repository
* Install system dependencies:
  * `sudo apt-get install build-essential python3-dev`
* Create a virtual environment with python3
  * `virtualenv -p python3 env`
* Activate the virtual environment
  * `source env/bin/activate`
* Install project requirements
  * `pip install -r requirements.txt`
* Run database migrations
  * `python manage.py migrate`
* For a fresh database, create a superuser
  * `python manage.py createsuperuser`
* Run development server
  * `python manage.py runserver_plus`
  * Development server runs on port 8000
  * Django admin: [127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)
    * User superuser credentials to log in
  * Api root: [127.0.0.1:8000/api](http://127.0.0.1:8000/api)
  * Authentication Api root: [127.0.0.1:8000/api/auth](http://127.0.0.1:8000/api/auth)
* Run tests
  * `python manage.py test`
* Run tests with coverage report
  * `coverage run manage.py test`
  * `coverage report`
