# Stage 0: Install node +  dependencies
FROM node:16.13.0@sha256:580a0850049c59a48f06090edd48c9f966c5e6572bbbabc369ba3ecbc4855dba AS dependencies

LABEL maintainer="Vishisht Gupta <vagupta1@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080
# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn
# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false
ENV NODE_ENV=production
WORKDIR /app
# copy dep files and install the production deps
COPY package*.json  ./
# Install node dependencies defined in package-lock.json
RUN npm ci --only=production

#######################################################################

# Stage 1: use dependencies to run the app
FROM node:16.13.0@sha256:580a0850049c59a48f06090edd48c9f966c5e6572bbbabc369ba3ecbc4855dba AS builder
WORKDIR /app
# Copy cached dependencies from previous stage so we don't have to download
COPY --from=dependencies /app /app
# Copy src to /app/src/
COPY ./src ./src
# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd
#Changing the ownership to node user
COPY --chown=node:node . /app
# We run our service on port 8080
EXPOSE 8080
#Change root to node user
USER node
# Start the container by running our server
CMD npm start
#Built-in health check. Use docker ps to see if the app is healthy.
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:8080 || exit 1
