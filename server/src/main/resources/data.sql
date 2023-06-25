CREATE TYPE currency AS ENUM ('CZK', 'EUR', 'USD');
CREATE TYPE transaction_type AS ENUM ('Income', 'Expense');

CREATE TABLE Client (
                        client_id SERIAL PRIMARY KEY,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        username VARCHAR(255) UNIQUE NOT NULL

);

CREATE TABLE Wallet (
                        wallet_id SERIAL PRIMARY KEY,
                        amount NUMERIC(19, 2) NOT NULL,
                        client VARCHAR(255),
                        name VARCHAR(255) NOT NULL ,
                        budget_limit NUMERIC(19, 2),
                        currency VARCHAR(255) NOT NULL,
                        FOREIGN KEY (client) REFERENCES client (email)
);

CREATE TABLE Category (
                          category_id SERIAL PRIMARY KEY,
                          name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Transactions (
                              transactions_id SERIAL PRIMARY KEY,
                              description VARCHAR(255) NOT NULL,
                              money NUMERIC(19, 2) NOT NULL,
                              type VARCHAR(255) NOT NULL,
                              category VARCHAR(255) NOT NULL,
                              wallet INTEGER NOT NULL,
                              trans_date TIMESTAMP NOT NULL DEFAULT current_timestamp,
                              FOREIGN KEY (category) REFERENCES Category (name),
                              FOREIGN KEY (wallet) REFERENCES Wallet (wallet_id)
);

CREATE TABLE Goals (
                       goals_id SERIAL PRIMARY KEY ,
                       money_goal NUMERIC(19, 2) NOT NULL,
                       goal VARCHAR(255) NOT NULL,
                       wallet_id INTEGER NOT NULL ,
                       FOREIGN KEY (wallet_id) REFERENCES Wallet (wallet_id)
);

CREATE TABLE auth_tokens
(
    id              serial
        primary key,
    token           varchar(255) not null,
    user_id         bigint       not null,
    creation_date   timestamp    not null,
    expiration_date timestamp    not null
);

create table public.auth_tokens
(
    id              serial
        primary key,
    token           varchar(255) not null,
    user_id         bigint       not null,
    creation_date   timestamp    not null,
    expiration_date timestamp    not null
);

alter table auth_tokens
    owner to postgres;
