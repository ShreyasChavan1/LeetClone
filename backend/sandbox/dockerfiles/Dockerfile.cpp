FROM gcc:latest

WORKDIR /app

CMD [ "bash","-c","g++ script.cpp -o script && ./script" ]