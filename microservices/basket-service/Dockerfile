ARG NODE_VERSION=20.9.0

FROM node:${NODE_VERSION}-alpine as base
# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3115

# Command to run your application
CMD ["npm", "start"]