# PeakPair Website

Welcome to the **PeakPair Dynamic Version** repository! This project is a prototype website that connects users with personal trainers based on their fitness goals and preferences. The platform aims to create a personalized fitness experience by recommending trainers and workouts tailored to each user's needs.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Running the Website](#running-the-website)
---

## Overview

**PeakPair** is designed to help users find the best personal trainers through a clean and intuitive interface. Users can explore various trainer profiles, view workout recommendations, participate in monthly challenges, and track their progress. 

This repository contains the front-end code for the PeakPair website. **Note:** This version of the website is a static prototype, and some features, especially those involving AI-based recommendations, are currently placeholders.

## Features

- **User Profiles**: Users can set up profiles detailing their fitness interests, goals, and workout history.
- **Trainer Profiles**: Trainers have profiles showcasing their specialties, certifications, and experience.
- **Workout Recommendations**: Users receive personalized recommendations for trainers and workouts based on their interests, goals, and other profile information.
- **Monthly Challenges**: Users can participate in monthly challenges to stay motivated and earn bonuses.
- **Rating & Review System**: Users can rate and review workouts and trainers to provide feedback and improve the platform.
- **Dynamic Recommendation Engine**: The backend processes user input to dynamically recommend trainers and workouts (prototype feature).

## Installation

To set up the project locally, follow these steps:

### Prerequisites

- **Python** (3.7 or later)
- **Node.js** and **npm**
- **Git**

### Clone the Repository

Clone the repository to your local machine:

```
git clone https://github.com/jaken1735/PeakPair-Website.git
cd PeakPair-Website
```

### Install Backend Dependencies

Make sure you’re in the root directory of the project, then install the Python dependencies:

```
pip install -r requirements.txt
```

### Install Frontend Dependencies

Install the required npm packages:

```
npm install
```

## Running the Website

To run the dynamic version of the PeakPair website on your local machine:

### 1. Run the Backend

Open a terminal in the root directory and start the backend server with the following command:

```
python recommender.py
```

### 2. Run the Frontend

In a new terminal, navigate to the frontend directory and start the frontend server:

```
npm start
```
