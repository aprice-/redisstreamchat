
# redisstreamchat

An example demonstrating new Redis Streams to build an end to end example of real-time chat rooms (think Hipchat, Slack or IRC).

[Read the full write up](https://get-reddie.com/blog/building-real-time-chat-with-redis-streams/).

## Requirements

Docker and Docker Compose installed.

## Usage

**Launch the example using Docker**

    docker-compose up -d

After the containers have been built, the example can be accessed on port `3000`.

**Remove containers**

    docker-compose rm -f

**Start Angular debugging**

    cd ./app/client
    npm install
    npm run start

**Start API server**

    cd ./app/api
    npm install
    REDIS=[ip] node src/index.js