#!/bin/bash

docker-compose down
docker-compose up -d --build
docker stop $(docker ps -a -q --filter="name=jordi_app")
npm run dev
