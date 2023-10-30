FROM peerprep_base_api:latest

WORKDIR /

COPY ./app /app

WORKDIR /app

# MUST run with 1 worker only, else there'll be
# duplicate rooms
CMD uvicorn main:app --host 0.0.0.0 --port 8000 --workers 1