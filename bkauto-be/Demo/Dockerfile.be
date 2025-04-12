FROM maven:3.9.8-eclipse-temurin-17

WORKDIR /backend

COPY . .

RUN mvn clean && mvn package -DskipTests

CMD ["mvn", "spring-boot:run", "-Dspring.config.location=/config/application.yml"]