# NC News Project

Project Summary:

ExpressJS API that handles requests for a news app.

A link to the hosted version: https://nc-news-project-50ht.onrender.com/api

### Step 1: Installation 
Clone the repository: 
```
git clone git@github.com:Keplin1/nc-news-project.git
```

### Step 2: Install dependencies 
```
npm install
```

### Step 3: Environment setup

- Create a `.env.development` file and connect it to the database: `PGDATABASE = nc_news`
- Create an `.env.test` file and add the following environment variable to it: `PGDATABASE = nc_news_test`

### Step 4: Seeding 
- `npm run setup-dbs`
- `npm run seed-dev`

### Step 5: Running the API locally
Start server: 
```
npm start
``` 

The API will will be available at: http://localhost:3030

## Testing
Run the test suite:
```
npm test
```

For specific test files: 

- `npm run test-seed` (test database seeding)
- `npm run test-app`  (test app)
- `npm run utils-test` (test utility functions)

Node.js minimum recommended version: `14.18.0`

PostgreSQL recommended version: `16.8`

## Available Endpoints
- `GET /api`: Lists all available endpoints
- `GET /api/topics`: Get all topics
- `GET /api/articles`: Get all articles (can be filtered by topic)
- `GET /api/articles/:article_id`: Get an article by ID
- `GET /api/articles/:article_id/comments`: Get comments for an article
- `POST /api/articles/:article_id/comments`: Add a comment to an article
- `PATCH /api/articles/:article_id`: Update article vote count
- `DELETE /api/comments/:comment_id`: Delete comment by ID
- `GET /api/users`: Get all users