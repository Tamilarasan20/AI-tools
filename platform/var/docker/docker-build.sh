#!/bin/bash

set -o xtrace

docker rmi localhost/loraloop || true
docker build --target dist -t localhost/loraloop -f Dockerfile.dev .
docker build --target devcontainer -t localhost/loraloop-devcontainer -f Dockerfile.dev .
