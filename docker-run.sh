#!/bin/bash

cd be
git pull
cd ..
docker-compose down
cp ./*.pem ./be
docker-compose up -d --build
