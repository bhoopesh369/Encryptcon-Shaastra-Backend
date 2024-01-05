import { Schema, model, Document } from "mongoose";
interface UserInterface extends Document {
	username: string;
    password: string;
}

const UserSchema = new Schema<UserInterface>({
	username: {
		type: String,
		default: ""
	},
    password: {
		type: String,
        default: ""
    }
});

const UserModel = model("User", UserSchema);
export default UserModel;