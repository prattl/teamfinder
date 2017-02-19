# Dota Team Finder *alpha*
[![Build Status](https://travis-ci.org/prattl/teamfinder.svg?branch=master)](https://travis-ci.org/prattl/teamfinder)

This project contains the source code running the [Dota Team Finder website](http://dotateamfinder.com).

## Install (development)

### API
* `cd api`
* Install system dependencies (only needed if running `uwsgi` locally):
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

### Client
* `cd client`
* Make sure node and nvm are installed
  * From the `create-react-app` README:
    ```
    You’ll need to have Node >= 4 on your machine.
    
    We strongly recommend to use Node >= 6 and npm >= 3 for faster installation speed and better
    disk usage. You can use [nvm](https://github.com/creationix/nvm#usage) to easily
    switch Node versions between different projects.
    ```
* Install project requirements
  * `npm install`
* Run development server
  * `npm run start`
  * Development server runs on port 3000
* Build production bundle
  * `npm run build`
