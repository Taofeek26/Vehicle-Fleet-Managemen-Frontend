# Driver Monitoring & Fleet Management System

This is a full-stack application designed to help supervisors manage a fleet of vehicles and drivers. It allows for tracking trips, managing vehicle maintenance, and monitoring driver activity. The system has two main user roles: Supervisors and Drivers, each with a dedicated dashboard and functionalities.

## Features

- **User Authentication:** Separate registration and login for Supervisors and Drivers.
- **Supervisor Dashboard:**
  - Manage drivers (add, view, edit, delete).
  - Manage vehicles (add, view, edit, delete).
  - View a list of all trips.
  - Track vehicle locations on a map.
- **Driver Dashboard:**
  - View assigned vehicle details.
  - Start and end trips.
  - View trip history.
- **Real-time Location Tracking:** View vehicle locations on a map.

## Technologies Used

### Backend

- **Python**
- **Django**
- **Django REST Framework**
- **Simple JWT** for authentication

### Frontend

- **React.js**
- **React Router** for navigation
- **Axios** for API requests
- **Tailwind CSS** for styling
- **Leaflet** for map integration

## Setup and Installation

### Prerequisites

- Node.js and npm
- Python and pip

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-folder>/driver_monitoring_system
    ```

2.  **Create a virtual environment and activate it:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run database migrations:**
    ```bash
    python manage.py migrate
    ```

5.  **Start the development server:**
    ```bash
    python manage.py runserver
    ```
    The backend will be running at `http://127.0.0.1:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../driver-monitoring-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```
    The frontend will be running at `http://localhost:3000`.

## Project Structure

- `driver_monitoring_system/`: Contains the Django backend.
  - `core/`: The main Django app with models, views, and serializers.
- `driver-monitoring-frontend/`: Contains the React frontend.
  - `src/`:
    - `components/`: Reusable React components.
    - `pages/`: Individual pages of the application.
    - `api.js`: Functions for making API calls to the backend.
