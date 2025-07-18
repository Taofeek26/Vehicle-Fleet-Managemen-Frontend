# Deployment Instructions

This document provides instructions for deploying the frontend and backend of the Driver Monitoring & Fleet Management System.

## Frontend Deployment (Vercel)

The frontend of this application is a React application, which can be easily deployed using Vercel.

### Prerequisites

- A GitHub account with the project repository.
- A Vercel account.

### Steps

1.  **Push your code to a GitHub repository.**

2.  **Sign up or log in to your Vercel account.**

3.  **Import your project:**
    - From your Vercel dashboard, click on "Add New..." and select "Project".
    - Connect your GitHub account and select the repository for the frontend.

4.  **Configure the project:**
    - **Framework Preset:** Vercel should automatically detect that you are using a React (`Create React App`).
    - **Build and Output Settings:** The default settings should work fine.
      - **Build Command:** `npm run build` or `react-scripts build`
      - **Output Directory:** `build`
    - **Environment Variables:**
      - You need to set the backend API URL as an environment variable.
      - Create a new environment variable with the key `REACT_APP_API_URL` and set the value to the URL of your deployed backend (e.g., `https://your-backend-url.onrender.com`).

5.  **Deploy:**
    - Click the "Deploy" button. Vercel will start the build process and deploy your application.
    - Once the deployment is complete, you will be provided with a URL to access your live frontend.

## Backend Deployment (Render)

The backend is a Django application, which can be deployed on Render.

### Prerequisites

- A Render account.
- Your project pushed to a GitHub repository.

### Steps

1.  **Prepare your Django application for production:**
    - In your `settings.py`, set `DEBUG = False`.
    - Add your Render app's URL to `ALLOWED_HOSTS`. You can use `['.onrender.com']` to allow all Render subdomains.
    - **Static Files:** Configure `whitenoise` to serve static files.
      - Install whitenoise: `pip install whitenoise`
      - Add it to your `requirements.txt`: `pip freeze > requirements.txt`
      - In `settings.py`, add `whitenoise.middleware.WhiteNoiseMiddleware` to your `MIDDLEWARE` list, right after the `SecurityMiddleware`.
      - In `settings.py`, set `STATIC_ROOT = BASE_DIR / 'staticfiles'`.

2.  **Create a new Web Service on Render:**
    - From your Render dashboard, click on "New +" and select "Web Service".
    - Connect your GitHub account and select the repository for the backend.

3.  **Configure the Web Service:**
    - **Name:** Give your service a name (e.g., `driver-monitoring-backend`).
    - **Region:** Choose a region close to your users.
    - **Branch:** Choose the branch you want to deploy (e.g., `main`).
    - **Root Directory:** `driver_monitoring_system` (if your `manage.py` is in this subdirectory).
    - **Runtime:** `Python 3`.
    - **Build Command:** `pip install -r requirements.txt`.
    - **Start Command:** `gunicorn driver_monitoring_system.wsgi`. You might need to add `gunicorn` to your `requirements.txt`.
    - **Environment Variables:**
      - `SECRET_KEY`: A new, strong secret key for your production environment.
      - `DATABASE_URL`: If you are using Render's PostgreSQL database, create one and Render will provide you with the `DATABASE_URL`. You will need to install `dj-database-url` and `psycopg2-binary` and configure your `settings.py` to use it.

4.  **Deploy:**
    - Click "Create Web Service". Render will build and deploy your Django application.
    - After deployment, your backend API will be available at the URL provided by Render.

### Database Configuration (Render PostgreSQL)

If you choose to use Render's PostgreSQL database:

1.  Create a new PostgreSQL instance on Render.
2.  Render will provide a `DATABASE_URL`.
3.  Install the necessary packages: `pip install dj-database-url psycopg2-binary`.
4.  In your `settings.py`, import `dj_database_url` and configure the database:
    ```python
    import dj_database_url
    import os

    DATABASES = {
        'default': dj_database_url.config(default=os.environ.get('DATABASE_URL'))
    }
    ```
5.  Add the new packages to your `requirements.txt`.
6.  Run migrations on your deployed application by connecting to it via the shell in the Render dashboard and running `python manage.py migrate`.
