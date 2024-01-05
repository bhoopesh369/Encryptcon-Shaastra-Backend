import { Agent } from "@aries-framework/core";
import {
	initializeConsumerAgent,
	initializeFarmerAgent,
	initializeLabAgent,
} from "./utils";
import {
	handleAcceptedProofRequest,
	handleIncomingProofRequest,
	requestProof,
} from "./helpers/verify-credential";
import {
	createNewInvitation,
	receiveInvitation,
	setupConnectionListener,
} from "./helpers/connection";
import {
	handleIncomingCredOffer,
	issueCredential,
} from "./helpers/issue-credential";

const runVerificationFlow = async (holderAgent: Agent, credDefId: string) => {
	console.log("Initialize verifier agent");
	const consumerAgent = await initializeConsumerAgent();

	handleIncomingProofRequest(holderAgent);
	handleAcceptedProofRequest(consumerAgent);

	// new invitation has to be created for every new connection (i.e: new/multiple farmer agents)
	console.log("Creating the invitation as consumer...");
	const { outOfBandRecord, invitationUrl } = await createNewInvitation(
		consumerAgent
	);

	// individual invitation has to be listened inorder to connect with the particular agent
	console.log("Listening for connection changes in consumer...");
	setupConnectionListener(
		consumerAgent,
		outOfBandRecord,
		async (connectionId: string) => {
			console.log(
				"We now have an active connection between consumer agent and a farmer agent"
			);

			console.log("Requesting proof from consumer to farmer");
			await requestProof(consumerAgent, connectionId, credDefId);
		}
	);

	console.log("Accepting the invitation as a farmer...");
	await receiveInvitation(holderAgent, invitationUrl); // in real projects, we will use the invitation url from qrcode
};

export const run = async () => {
	console.log("Initialize farmer agent...");
	const farmerAgent = await initializeFarmerAgent();

	console.log("Initialize lab agent...");
	const labAgent = await initializeLabAgent();

	// new invitation has to be created for every new connection (i.e: new/multiple farmer agents)
	console.log("Creating the invitation as lab...");
	const { outOfBandRecord, invitationUrl } = await createNewInvitation(
		labAgent
	);

	// individual invitation has to be listened inorder to connect with the particular agent
	console.log("Listening for connection changes in lab...");
	setupConnectionListener(
		labAgent,
		outOfBandRecord,
		async (connectionId: string) => {
			console.log(
				"We now have an active connection between lab agent and a farmer agent"
			);

			// Listening for incoming cred offers
			handleIncomingCredOffer(farmerAgent, runVerificationFlow);

			// Lab agent issuing verification credential to farmer agent connected on "connectionId"
			issueCredential(labAgent, connectionId);
		}
	);

	console.log("Accepting the invitation as a farmer...");
	await receiveInvitation(farmerAgent, invitationUrl); // in real projects, we will use the invitation url from qrcode
};

export default run;
