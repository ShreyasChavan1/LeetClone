FROM openjdk:17

WORKDIR /app

CMD [ "bash","-c","javac script.java && java script" ]
