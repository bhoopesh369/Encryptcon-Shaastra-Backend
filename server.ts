import { fastify, FastifyInstance } from "fastify";
import dotenv from "dotenv";
dotenv.config({
	path: ".env",
});
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import connectDatabase from "./utils/connectDB";
import config from "./config/config";
import healthRouter from "./routes/health";


const app: FastifyInstance = fastify({
	logger: true
});

app.register(cookie, {
	secret: process.env.COOKIE_SECRET,
	hook: "preHandler",
	parseOptions: {},
});

app.register(cors, {
	// origin: process.env.FRONTEND_URL,
	origin: "*",
	credentials: true,
});

connectDatabase(config.db);


// routes
healthRouter(app);
//testRouter(app);

app.listen(
	{ port: parseInt(process.env.PORT ?? "4000"), host: "localhost" },
	(): void => {
		console.log(`Server running at http://localhost:${process.env.PORT}`);
	}
);
function testRouter(app: FastifyInstance<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>) {
	throw new Error("Function not implemented.");
}

