FROM python:3.11.5-alpine3.18

WORKDIR /

COPY requirements.txt requirements.txt

RUN apk add --no-cache python3 postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc python3-dev musl-dev postgresql-dev && \
    python3 -m pip install -r requirements.txt --no-cache-dir && \
    apk --purge del .build-deps

COPY database_model.py database_model.py
COPY /shared_definitions /shared_definitions
RUN pip install /shared_definitions
