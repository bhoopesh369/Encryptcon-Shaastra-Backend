import { Schema, model, Document } from "mongoose";
interface Issuer extends Document {
	holderDID: string;
    Data: string;
}

const IssuerSchema = new Schema<Issuer>({
	holderDID: {
		type: String,
		default: ""
	},
    Data: {
		type: String,
        default: ""
    }
});

const IssuerModel = model("Issuer", IssuerSchema);
export default IssuerModel;