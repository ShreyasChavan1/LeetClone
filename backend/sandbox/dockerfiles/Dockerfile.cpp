FROM gcc:latest

WORKDIR /app

COPY . /app

CMD [ "sh", "-c", "g++ solution.cpp -o solution 2> error.txt && ./solution < input.txt > output.txt 2> error.txt" ]

