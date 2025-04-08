# hapiJs_todo_list_API

### Requirements
1. hapijs
2. sequelize
3. hapi-swagger
4. joi
5. PostgreSQL

### Database initialization
1. Create a database with any name
2. Update the database name, username, and password in the config/config.json file

### Project setup
1. Run the command "npm i"
2. Run the command "npm install -g nodemon" 

### Project run
1. Add the port number to the PORT in .env file
2. Run the command "npx sequelize-cli db:migrate" to execute the database migrations
3. To run the project, run the following command "node index.js" or "nodemon index.js" (if you have nodemon installed)
