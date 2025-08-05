# Copyright Tecnalia Research & Innovation (https://www.tecnalia.com)
# Copyright Tecnalia Blockchain LAB
#
# SPDX-License-Identifier: Apache-2.0

FROM node:14-alpine AS BUILD_IMAGE

# default values of environment variables
# that are used inside container

ENV DEFAULT_WORKDIR /opt
ENV EXPLORER_APP_PATH $DEFAULT_WORKDIR/explorer

# set default working dir inside container
WORKDIR $EXPLORER_APP_PATH

COPY . .

# install required dependencies by NPM packages:
# current dependencies are: python, make, g++, git
RUN apk add --no-cache --virtual npm-deps python3 make g++ curl bash git && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    rm -r /root/.cache

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

# install NPM dependencies with legacy peer deps to avoid conflicts
RUN npm install --legacy-peer-deps

# build explorer app (TypeScript compilation)
RUN npm run build

# build client app
RUN cd client && npm install --legacy-peer-deps && npm run build

# remove installed packages to free space
RUN apk del npm-deps
RUN /usr/local/bin/node-prune

# Clean up unnecessary files to reduce image size
RUN rm -rf node_modules/rxjs/src/
RUN rm -rf node_modules/rxjs/bundles/
RUN rm -rf node_modules/rxjs/_esm5/
RUN rm -rf node_modules/rxjs/_esm2015/
RUN rm -rf node_modules/grpc/deps/grpc/third_party/

FROM node:14-alpine

# database configuration
ENV DATABASE_HOST 127.0.0.1
ENV DATABASE_PORT 5432
ENV DATABASE_NAME fabricexplorer
ENV DATABASE_USERNAME hppoc
ENV DATABASE_PASSWD password
ENV EXPLORER_APP_ROOT app

ENV DEFAULT_WORKDIR /opt
ENV EXPLORER_APP_PATH $DEFAULT_WORKDIR/explorer

WORKDIR $EXPLORER_APP_PATH

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig.json ./

# Copy source code
COPY app/ ./app/
COPY client/ ./client/
COPY scripts/ ./scripts/
COPY start.sh ./
COPY stop.sh ./

# Copy built files from build stage
COPY --from=BUILD_IMAGE $EXPLORER_APP_PATH/dist ./app/
COPY --from=BUILD_IMAGE $EXPLORER_APP_PATH/client/build ./client/build/
COPY --from=BUILD_IMAGE $EXPLORER_APP_PATH/node_modules ./node_modules/

# Make scripts executable
RUN chmod +x start.sh stop.sh

# Create logs directory
RUN mkdir -p logs/app logs/db logs/console

# Expose the default port
EXPOSE 8080

# run blockchain explorer main app
CMD ["npm", "run", "app-start"]
