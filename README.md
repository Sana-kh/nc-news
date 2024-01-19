# Northcoders News API

For anyone who wishes to clone this project and run it locally, please create .env.test and .env.development files in order to successfully connect to the two databases locally.
 Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). 


# Northcoders News
A link to the hosted version.

*Project Summary


*Getting Started
Follow these instructions to set up and run the project on your local machine.

*Prerequisites
Make sure you have the following installed:

Node.js (version )
PostgreSQL (version )

*Installation
1. Clone the repository:

git clone https://github.com/your-username/your-repo.git
Navigate to the project directory:


2. Install dependencies:

npm install

3. Database Setup
Create a .env.production file in the project root with the following content:
DATABASE_URL = postgres://sythmfmo:0QFZ-CcsEWASUqT0QusYaAqBN3amRQ1H@rogue.db.elephantsql.com/sythmfmo

Create a .env.test file for testing with the following content:

DB_URL=your_test_database_url
Seed Local Database
Run the following command to seed your local database:

npm run seed
Run Tests
Execute tests to ensure everything is working as expected:

bash
Copy code
npm test
Start the Application
Run the following command to start the application:

bash
Copy code
npm start
The application will be accessible at