# Use the official Node.js image as the base image
FROM node:18

WORKDIR /src

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Build the application (compile TypeScript files)
RUN npm run build

# Expose the port the app will run on
EXPOSE 8080

# Set the default command to run the application in production
# For development, you can use `start:dev` or `start:prod`
CMD ["npm", "run", "start:dev"]
