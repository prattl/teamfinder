#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo 'Missing commit arg'
    exit 0
fi

COMMIT=$1
BASE_DIR=/home/ubuntu/teamfinder
API_DIR=${BASE_DIR}/api
VENV_DIR=${API_DIR}/env
CLIENT_DIR=${BASE_DIR}/client

cd ${API_DIR}
git fetch
git checkout --force ${COMMIT}
${VENV_DIR}/bin/python manage.py migrate --noinput
${VENV_DIR}/bin/python manage.py collectstatic --noinput
cd ${CLIENT_DIR}
npm run build
