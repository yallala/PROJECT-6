
# Project Setup and Instructions

This README file provides all the necessary steps and instructions to set up the project environment, install dependencies, and run both the front-end and back-end servers.

## 1. Install `node_modules` for Backend

To restore the `node_modules` for the **backend**, follow these steps:

1. **Navigate to the back folder**:
   - Open your terminal or command prompt.
   - Run the following command to navigate to the back-end folder:
     
     cd back
     

2. **Install npm packages**:
   - Once inside the `back` folder, run the following command to install all required dependencies (this will restore the `node_modules` folder):
     
     npm install
     

---

## 2. Install `node_modules` for Frontend

To restore the `node_modules` for the **frontend**, follow these steps:

1. **Navigate to the front folder**:
   - From your terminal, run the following command to go to the front-end folder:
       
     cd front
     

2. **Install npm packages**:
   - Once inside the `front` folder, run the following command to install all dependencies:
       
     npm install
     

---

## 3. Starting the Backend and Frontend Servers

After installing the dependencies, you need to start both the front-end and back-end servers.

### **Start Backend**:

1. **Navigate to the backend folder**:
   - If you’re not already in the `back` folder, run:
       
     cd back
     

2. **Start the backend server**:
   - Run the following command to start the back-end server:
       
     npm start
     
   - The backend server will start and listen on the designated port (usually `localhost:3000`).

### **Start Frontend**:

1. **Navigate to the frontend folder**:
   - If you’re not already in the `front` folder, run:
       
     cd front
     

2. **Start the frontend server**:
   - Use this command to start the front-end server:
       
     npm start
     
   - The front-end application will now be accessible (usually `localhost:4200`).

---

## 4. Instructions for Creating `images` Folder in Backend

Since the project requires an `images` folder in the backend, and this folder is not included in the project, follow these steps to create it:

1. **Navigate to the backend folder**:
     
   cd back
   

2. **Create the `images` folder**:
   - Run this command to create the `images` directory where uploaded images will be stored:
       
     mkdir images
     

---

## 5. Using Environment Variables

The project relies on environment variables to connect to the database and handle authentication (JWT tokens). You need to create a `.env` file in the **backend folder** with the following information:

### Steps to Create the `.env` File:

1. **Navigate to the backend folder**:
     
   cd back
   

2. **Create the `.env` file**:
   - In the `back` folder, create a new file named `.env`.
   - Add the following environment variables to the file:

     
   DB_URL=mongodb+srv://openclass:FQZy1GfnFndALjlZ@cluster0.q7lgd.mongodb.net
   JWT_TOKEN=ASKLDFJL4J5JASJKFL398
   
