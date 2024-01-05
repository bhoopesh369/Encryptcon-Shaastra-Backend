import run from "../../blockchain";

const healthCheck = {
	handler: async (req: any, res: any) => {
		await run();
		res.code(200).send({ health: "check" });
	},
};

export { healthCheck };
