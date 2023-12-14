FROM node:18
WORKDIR /app
COPY package.json .

# Prevents the 'nodemon' package from being installed in prod yml!!
# In the yaml files the `NODE_ENV` must be specified under build:
# EXAMPLE:
#    build:
#      context: .
#      args:
#        - NODE_ENV=production
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ] ; \
	then npm install; \
	else npm install --only=production; \
	fi

# We stopped at 2:10:00

COPY . ./
ENV PORT 3000
EXPOSE $PORT
#CMD ["npm", "run", "dev"]
CMD ["node", "index.js"]