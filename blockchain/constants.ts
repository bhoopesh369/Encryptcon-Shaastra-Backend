import { InitConfig } from "@aries-framework/core";

export const farmerSeed = "farmer00000000000000000000000000";

export const labSeed = "lab00000000000000000000000000000";

export const consumerSeed = "consumer000000000000000000000000";

const unqualifiedIndyDidLabAgent = `AGvnH1cqGbzF4vLBebJgRt`; // will be returned after registering seed on bcovrin

export const labDid = `did:indy:bcovrin:test:${unqualifiedIndyDidLabAgent}`;

export const farmerEndpoint = "http://localhost:5000";

export const labEndpoint = "http://localhost:5001";

export const consumerEndpoint = "http://localhost:5002";

// Simple agent configuration. This sets some basic fields like the wallet
// configuration and the label. It also sets the mediator invitation url,
// because this is most likely required in a mobile environment.
export const farmerAgentConfig: InitConfig = {
	label: "agent-farmer",
	walletConfig: {
		id: "farmerMainWallet",
		key: farmerSeed,
	},
	// in mobile agent we should implement relay server instead of this
	endpoints: [farmerEndpoint],
};

export const labAgentConfig: InitConfig = {
	label: "agent-lab",
	walletConfig: {
		id: "labMainWallet",
		key: labSeed,
	},
	endpoints: [labEndpoint],
};

export const consumerAgentConfig: InitConfig = {
	label: "agent-consumer",
	walletConfig: {
		id: "consumerMainWallet",
		key: consumerSeed,
	},
	endpoints: [consumerEndpoint],
};

export const bcovrinGenesisTransactions = async () =>
	await fetch("http://localhost:9000/genesis", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	}).then((res) => res.text());

export const staticCredAttrs = {
	cropName: "Basmati",
	cropSequence: "CGTAGCTAGCTAGCTAGCTAGCTAGC",
	cropFunction: "Disease Resistance",
};
