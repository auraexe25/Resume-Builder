
{/* PACKAGE DETAILS:
    
This is the package.json file for the server-side of the Resume Builder application. It defines the basic metadata and scripts for running the server. The "start" script allows you to start the server using the command "npm start".

1. express - using this , we create our server and define routes to handle incoming requests from the client-side. It simplifies the process of building web applications and APIs.

2. cors- this allows backend to connect with any other url or port. In our case, it allows the server to accept requests from the client-side which is running on a different port (3000).

3. dotenv - this package allows us to load environment variables from a .env file into process.env. This is useful for managing configuration settings, such as database connection strings or API keys, without hardcoding them into the source code.

4. bcrypt - this is a library for encrypting/ hashing passwords. It provides a secure way to store user passwords by hashing them before saving to the database. When a user logs in, the server can compare the hashed password with the stored hash to authenticate the user without exposing the actual password.

5. jsonwebtoken-used to generate tokens for authentication. When a user logs in successfully, the server can create a JSON Web Token (JWT) that contains user information and send it back to the client. The client can then include this token in subsequent requests to access protected routes or resources on the server, allowing for stateless authentication.

6. mongoose - this is an Object Data Modeling (ODM) library for MongoDB and Node.js.

7.multer- middleware to handle file uploads. It allows you to easily handle multipart/form-data, which is commonly used for uploading files through forms.
    
8. nodemon - this is a development dependency that automatically restarts the server whenever changes are made to the source code. It helps improve development workflow by eliminating the need to manually stop and restart the server after every change.
*/}

import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';


const app= express();
const PORT = process.env.PORT || 3000;

//Database connection
await connectDB();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Welcome to the Resume Builder API'))
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter) // Importing AI routes

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})