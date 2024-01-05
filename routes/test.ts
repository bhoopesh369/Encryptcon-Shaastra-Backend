import { testCheck } from "../controllers/test/test.js";
import router from "../utils/router.js";

const routes = [
	{
		method: "GET",
		url: "",
		handler: testCheck.handler,
	},
];

const healthRouter = (app) => {
	router(app, routes, "/test");
};

export default healthRouter;
