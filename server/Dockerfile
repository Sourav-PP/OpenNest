# Step 1: Use Node.js LTS version
FROM node:20-alpine

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json first (for dependency caching)
COPY package*.json ./

# Step 4: Install all dependencies (including dev deps for TypeScript build)
RUN npm install

# Step 5: Copy the rest of your code
COPY . .

# Step 6: Build the project (creates dist folder)
RUN npm run build

# Step 7: Remove dev dependencies to reduce image size
RUN npm prune --production

# Step 8: Expose your backend port
EXPOSE 5006

# Step 9: Start the app (run compiled JS from dist)
CMD ["node", "-r", "tsconfig-paths/register", "dist/main.js"]
