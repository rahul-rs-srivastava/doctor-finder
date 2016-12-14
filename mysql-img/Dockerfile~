FROM mysql:5.7.15

MAINTAINER me

ENV MYSQL_DATABASE=doctordb \
    MYSQL_ROOT_PASSWORD=abcd

ADD doctor.sql /docker-entrypoint-initdb.d

EXPOSE 3306
