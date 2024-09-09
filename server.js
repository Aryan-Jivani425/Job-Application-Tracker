
// API DOcumenATion
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";

//module imports
import express from  "express";
import dotenv from "dotenv";
import morgan  from "morgan";
import cors  from "cors";
import cookieParser from 'cookie-parser';
import "express-async-errors"; // no need for try catch block

//security pakages
import helmet from "helmet";// to secure header 
import xss from "xss-clean";//sanitize user input coming from POST body, GET queries, and url params
import mongoSanitize from "express-mongo-sanitize";//sanitizes user-supplied data to prevent MongoDB Operator Injection

//files imports
import connectDB from "./config/db.js";

//routes imports
import testRoutes from "./routes/testRoute.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from './routes/userRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';
import errorMiddlewear from "./middlewear/errorMiddlewear.js";



// dotenv.config({path:'./config'}); //if path
dotenv.config();
connectDB();


// Swagger api config
// swagger api options
const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Job Application Tracker",
        description: "Node Expressjs Job Application Tracker",
      },
      servers: [
        {
                //url: "http://localhost:3000",
                //url: "https://job-application-tracker-backend-fid3.onrender.com" //onrender
                url: "https://job-application-tracker-phi.vercel.app" // vercel

        },
      ],
    },
    apis: ["./routes/*.js"],
  };
  
  const spec = swaggerDoc(options);
  
  //rest object
const app = express();
const port = process.env.PORT || 3000;


//middlewears
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());//CORS or Cross-Origin Resource Sharing in Node. js is a mechanism by which a front-end client can make requests for resources to an external back-end server. The single-origin policy does not allow cross-origin requests and CORS headers are required to bypass this feature.
app.use(morgan("dev")); //Morgan simplifies the process of logging HTTP requests in Node. js applications
app.use(cookieParser());// Use cookie-parser middleware

  
//routes
app.use("/api/v1/test",testRoutes);
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/job',jobsRoutes);

//homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

//validations middlewear only write after routes
app.use(errorMiddlewear); 

//rest object
// app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}! and runnging in ${process.env.DEV_MODE}`));
