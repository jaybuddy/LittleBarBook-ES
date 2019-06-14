FROM node:8

# Sets where CMD (below) is executed
WORKDIR /usr/src

# Copy over the package.json & package-lock.json
COPY package*.json ./

# Install dependancies directly form package-lock.json. Only
# uses package.json to validate that there are no mismatches.
RUN npm ci

# Copy the application source
COPY . .

# Run npm start to fire it up.
CMD ["npm", "start"]