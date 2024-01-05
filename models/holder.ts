import { Schema, model, Document } from "mongoose";
interface Holder extends Document {
	data: string;
    requests: string;
}

const HolderSchema = new Schema<Holder>({
	data: {
		type: String,
		default: ""
	},
    requests: {
		type: String,
        default: ""
    }
});

const HolderModel = model("Holder", HolderSchema);
export default HolderModel;