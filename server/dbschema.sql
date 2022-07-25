create database identity_database ;
create table users(
    id int PRIMARY KEY AUTO_INCREMENT,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    username varchar(255) NOT NULL UNIQUE,
    password varchar(255)  NOT NULL,
    phone_number VARCHAR(10) NOT NULL UNIQUE ,
    email varchar(255)  NOT NULL UNIQUE ,
    is_active BOOLEAN NOT NULL,
    is_admin BOOLEAN NOT NULL ,
    created_at timestamptz ,
    updated_at timestamptz ,
    updated_by timestamptz 
);