# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.9.0

FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

FROM base as deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --force


RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --force

FROM deps as build

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN npm run build


FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# Create logs directory and set permissions
USER root
RUN mkdir -p logs && chown node:node logs
RUN mkdir -p public && chown node:node public


# Copy necessary files
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist/src
COPY package.json .
COPY .env.prod /usr/src/app/.env

# Switch to non-root user for security
USER node

EXPOSE 4000

CMD npm run typeorm:prod:run-migrations && node dist/src/index.js
