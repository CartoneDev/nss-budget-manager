# Language
We used Java 17.
# Technologies

## Framework
Spring Boot, React.js

## Cache

Hazelcast used for Transactions and Category. 

## Docker
All settings for application is defined in `docker-compose.yml` file.
2 servers and 2 databases(**PostgreSQL and MongoDB**) and **Dispatcher** are presented as containers and images. They locate in one network in Docker.

## Messaging
If the user exceeds the budget limit, he will receive an email about exceeding the limit. It works with a **Mailgun**. **Apache Kafka**, a message broker, is used here.



## ElasticSearch
For looking for transactions by description.


## Axios
Axios is a popular JavaScript library used for making HTTP requests from web browsers and Node.js. We used it when connect Frontend and Backend.



## React.js
Our frontend was developed on React.js.

# Database
## Relational database
We used PostgreSQL for Transactions, User, Category, Wallet
## NotRelational database
We used MongoDB for Notifications.

# Authorization
We use Basic Authorization.

# Interceptors
We get information about requests in console.

# Rest
Application uses REST api endpoints in Controllers for comunication between user and dispatcher and servers.

# Design patterns

- **DTO**(Responses)
- **Builder**(Transaction)
- **MVC**
- **DAO**
- **Proxy**(Dispatcher)
# Init postup
## Backend
**Neprve**:
- docker-compose up postgres mongo
**Pak**:
- docker-compose up dispatcher server server-2 zookeeper kafka
## Frontend
Terminal:
**Neprve**:
- cde fe
**Pak**:
- npm start
