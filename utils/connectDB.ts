import mongoose from "mongoose";

const connectDatabase = async (database: string) => {
	try {
		await mongoose.connect(process.env.MONGODB_URI + database);
		console.log("Connection with database successful");
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

export default connectDatabase;
