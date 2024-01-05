import run from "../../blockchain";

const testCheck = {
    handler: (req: any, res: any) => {
        // res.code(200).send({ health: "check" });
        run();
        res.code(200);
    },
};

export { testCheck };
