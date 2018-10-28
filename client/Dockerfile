FROM node:10

RUN mkdir /code
WORKDIR /code
ADD . /code

# create-react-app development server
EXPOSE 3000

# create-react-app hot reloading
EXPOSE 35729

RUN yarn install
