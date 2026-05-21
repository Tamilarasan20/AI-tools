#!/usr/bin/env bash

docker kill loraloop || true 
docker rm loraloop || true 
docker create --name loraloop -p 3000:3000 -p 4200:4200 localhost/loraloop
