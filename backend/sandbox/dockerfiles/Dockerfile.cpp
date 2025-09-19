FROM debian:bullseye-slim
RUN apt-get update && apt-get install -y g++ 
# Big problem solved here using g++:latest puts up lots of load this is lighter version so works best
WORKDIR /app





