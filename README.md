# Northcoders News API

https://webtech-otc2.onrender.com

*Project Summary
We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

Our database will be PSQL, and we will interact with it using node-postgres.

*Getting Started
Follow these instructions to set up and run the project on your local machine.

*Prerequisites
Make sure you have the following installed:

Node.js (version v21.2.0)
PostgreSQL (version 14.10 )

*Installation
1. Clone the repository:

git clone https://github.com/your-username/your-repo.git
Navigate to the project directory:


2. Install dependencies:

npm install

3. Database Setup
**Create a .env.development file in the project root with the following content:
PGDATABASE=nc_news

**Create a .env.test file for testing with the following content:
PGDATABASE=nc_news_test

**Seed Local Database
Run the following command to seed your local database:
npm run seed

**Run Tests
Execute tests to ensure everything is working as expected:
npm test

**Start the Application
Run the following command to start the application:
npm start


The application will be accessible at https://webtech-otc2.onrender.com