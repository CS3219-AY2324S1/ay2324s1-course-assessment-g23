# Use the official NGINX image as a base
FROM nginx:latest

# Install apache2-utils for htpasswd
RUN apt-get update && apt-get install -y apache2-utils && rm -rf /var/lib/apt/lists/*

ARG NGINX_DEV_USERNAME
ARG NGINX_DEV_PASSWORD

# Create a .htpasswd file
RUN htpasswd -cb /etc/nginx/.htpasswd $NGINX_DEV_USERNAME $NGINX_DEV_PASSWORD

# Start NGINX with the 'daemon off' directive to keep the process in the foreground
CMD ["nginx", "-g", "daemon off;"]
