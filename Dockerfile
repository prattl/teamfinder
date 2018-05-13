FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code /var/log/uwsgi
RUN touch /var/log/uwsgi/teamfinder.log
WORKDIR /code
ADD requirements.txt /code/
RUN apt-get update
RUN apt-get -y install build-essential python-dev
RUN pip install -r requirements.txt
RUN pip install uwsgi
ADD . /code/
