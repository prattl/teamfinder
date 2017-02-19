#!/bin/bash
curl -d "DEPLOY_SECRET_KEY=${DEPLOY_SECRET_KEY}&COMMIT=${TRAVIS_COMMIT}&BRANCH=${TRAVIS_BRANCH}" dotateamfinder.com:8000/deploy/
