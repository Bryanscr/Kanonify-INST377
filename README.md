# Kanonify

Kanonify is a media discovery and review platform that allows users to explore, track, and review books, anime, movies, and TV shows in one unified interface. The application connects multiple public APIs and a backend database to support browsing, reviews, and personalized lists.

This project was developed as a final project for INST 377.

## Target Browsers

Kanonify is designed as a desktop-first web application and has been tested on the following browsers:

- Google Chrome (latest)
- Safari (macOS)

--

## Developer Manual

> **Audience**: 
> This section is intended for future developers who will take over development of Kanonify.  

##  System Overview

Kanonify is a full-stack web application with:
- **Frontend:** HTML, CSS, and JavaScript
- **Backend:** Node.js with Express
- **Database:** Supabase 
- **Hosting:** Vercel 

The backend provides API endpoints for creating and retrieving reviews, while the frontend consumes both the backend API and multiple public media APIs.

##  Installation and Dependencies

### Prerequisites
- Node.js 
- npm (comes with Node.js)
- A Supabase account

### Installation Steps
1. Clone the project repository:
   ```bash
   git clone <repository-url>
   cd Kanonify

2. Install project dependencies:
> npm install

3. Create a .env file in the project root directory:
>SUPABASE_URL=your_supabase_project_url
>SUPABASE_KEY=your_supabase_anon_key

### Starting the Application
> node index.js

The server will run at: 
> http://localhost:3000

### Running the Application

Kanonify is deployed using Vercel as a serverless application.

- Express runs as a serverless function
- Static files are served from the /public directory
- Environment variables are configured in the Vercel dashboard
- No manual server startup is required after deployment

### Testing

Testing was conducted manually by:

- Submitting reviews through the Details page
- Verifying reviews appear on the Home page
- Checking API responses for correctness
- Confirming database writes and reads from Supabase
- Validating application behavior after Vercel deployment

### Backend API Documentation

**GET /reviews**
Retrieves the most recent reviews from the database.

Behavior:
- Returns up to 5 reviews
- Sorted by newest first

Response Example:
[
  {
    "title": "Example Title",
    "media_type": "movie",
    "rating": 5,
    "review_text": "Great movie!",
    "poster_url": "https://image.tmdb.org/t/p/w300/example.jpg",
    "created_at": "2025-04-20T18:30:00"
  }
]

**POST /reviews**
Creates a new review entry in the database.

Behavior:
- Inserts a new record into the Supabase reviews table
- Returns the inserted record
- Used by the review submission form on the Details page

Request Body:
{
  "title": "Example Title",
  "media_type": "movie",
  "rating": 4,
  "review_text": "Really enjoyed it",
  "poster_url": "https://image.tmdb.org/t/p/w300/example.jpg"
}

## Known Bugs and Limitations

- Reviews are anonymous (no user authentication)
- Users cannot edit or delete reviews
- Mobile responsiveness is limited
- API rate limits may affect trending content

## Roadmap for Future Development

- Implement user authentication and profiles
- Add edit and delete functionality for reviews
- mprove mobile responsiveness
- Add filtering and sorting options for reviews
- Expand original source linking to specific books, volumes, or chapters
- Display dynamic average ratings on the details page


