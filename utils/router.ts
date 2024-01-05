const router = (app: any, routes: any, path: any) => {
	routes.forEach((route: any) => {
		route.url = path + route.url;
		app.route(route);
	});
};

export default router;
