# Bring down the services and remove all images, before building/starting.
docker-compose down --rmi all \
    && docker-compose --env-file .env up --build "$@"