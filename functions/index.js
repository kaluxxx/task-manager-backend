const config = require('../config');
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const options = require("../swaggerOptions");
const http = require('http');
const accountRoutes = require('../src/routes/accountRoutes');
const taskRoutes = require('../src/routes/taskRoutes');
const authenticationRoutes = require('../src/routes/authenticationRoutes');

const taskService = require('../src/services/taskService');

const {errorHandler} = require("../src/middleware/errorMiddleware");
const configureWebSocket = require("../websocket");
const {connectDB} = require("../src/db/db");

connectDB();

const specs = swaggerJsdoc(options);

taskService.restartTasks();

const app = express();
const router = express.Router();
const server = http.createServer(app);
const wss = configureWebSocket(server); // Configurez WebSocket

app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors("*"));

app.use('/api/accounts', accountRoutes)
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authenticationRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);

app.use("/.netlify/functions/app", router);

module.exports.handler = serverless(app);
