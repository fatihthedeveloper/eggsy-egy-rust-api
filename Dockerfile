# Step 1: Build stage
FROM public.ecr.aws/lambda/nodejs:20 as builder
WORKDIR /usr/app

# Install dependencies first (better caching)
COPY package*.json tsconfig.json ./
RUN npm install

# Copy source and build
COPY src ./src
RUN npx tsc

# Step 2: Runtime stage
FROM public.ecr.aws/lambda/nodejs:20
WORKDIR ${LAMBDA_TASK_ROOT}

# CRITICAL: Copy package.json so Node knows it is an ES Module ("type": "module")
COPY package*.json ./

# Copy compiled JS files only (avoiding mapping/declaration clutter if possible)
# Note: Using /dist/ instead of /dist/* keeps the folder structure if needed
COPY --from=builder /usr/app/dist/ ./

# Install only production dependencies
RUN npm install --omit=dev

# Set the CMD to your handler (filename.method)
# Since your src/index.ts was compiled to index.js in the root of dist, this is correct
CMD [ "index.handler" ]