import {
	AnonCredsCredentialFormatService,
	AnonCredsModule,
	AnonCredsProofFormatService,
	LegacyIndyCredentialFormatService,
	LegacyIndyProofFormatService,
	V1CredentialProtocol,
	V1ProofProtocol,
} from "@aries-framework/anoncreds";
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs";
import {
	Agent,
	AutoAcceptCredential,
	AutoAcceptProof,
	ConnectionsModule,
	CredentialsModule,
	DidsModule,
	KeyType,
	ProofsModule,
	TypedArrayEncoder,
	V2CredentialProtocol,
	V2ProofProtocol,
	HttpOutboundTransport,
	WsOutboundTransport,
} from "@aries-framework/core";
import {
	IndyVdrAnonCredsRegistry,
	IndyVdrIndyDidRegistrar,
	IndyVdrIndyDidResolver,
	IndyVdrModule,
} from "@aries-framework/indy-vdr";
import { anoncreds } from "@hyperledger/anoncreds-nodejs";
import { indyVdr } from "@hyperledger/indy-vdr-nodejs";
import {
	bcovrinGenesisTransactions,
	consumerAgentConfig,
	consumerEndpoint,
	farmerAgentConfig,
	farmerEndpoint,
	labAgentConfig,
	labDid,
	labEndpoint,
	labSeed,
} from "./constants";
import { AskarModule } from "@aries-framework/askar";
import { ariesAskar } from "@hyperledger/aries-askar-nodejs";
import { HttpInboundTransport, agentDependencies } from "@aries-framework/node";

export const getAgentModules = async () => {
	const transactions = await bcovrinGenesisTransactions();
	return (module.exports = {
		connections: new ConnectionsModule({
			autoAcceptConnections: true,
		}),
		credentials: new CredentialsModule({
			autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
			credentialProtocols: [
				new V1CredentialProtocol({
					indyCredentialFormat:
						new LegacyIndyCredentialFormatService(),
				}),
				new V2CredentialProtocol({
					credentialFormats: [
						new LegacyIndyCredentialFormatService(),
						new AnonCredsCredentialFormatService(),
					],
				}),
			],
		}),
		proofs: new ProofsModule({
			autoAcceptProofs: AutoAcceptProof.ContentApproved,
			proofProtocols: [
				new V1ProofProtocol({
					indyProofFormat: new LegacyIndyProofFormatService(),
				}),
				new V2ProofProtocol({
					proofFormats: [
						new LegacyIndyProofFormatService(),
						new AnonCredsProofFormatService(),
					],
				}),
			],
		}),
		anoncreds: new AnonCredsModule({
			registries: [new IndyVdrAnonCredsRegistry()],
		}),
		anoncredsRs: new AnonCredsRsModule({
			anoncreds,
		}),
		indyVdr: new IndyVdrModule({
			indyVdr,
			networks: [
				{
					isProduction: false,
					indyNamespace: "bcovrin:test",
					genesisTransactions: transactions as unknown as string,
					connectOnStartup: true,
				},
			],
		}),
		dids: new DidsModule({
			resolvers: [new IndyVdrIndyDidResolver()],
			registrars: [new IndyVdrIndyDidRegistrar()],
		}),
		askar: new AskarModule({
			ariesAskar,
		}),
	});
};

export const initializeFarmerAgent = async () => {
	// A new instance of an agent is created here
	// Askar can also be replaced by the indy-sdk if required
	const agent = new Agent({
		config: farmerAgentConfig,
		modules: await getAgentModules(),
		dependencies: agentDependencies,
	});

	agent.registerOutboundTransport(new WsOutboundTransport());

	agent.registerOutboundTransport(new HttpOutboundTransport());

	// in mobile agent we should implement relay server instead of this
	agent.registerInboundTransport(
		new HttpInboundTransport({
			port: Number(farmerEndpoint.split(":").at(-1)),
		})
	);

	// Initialize the agent
	await agent.initialize();

	return agent;
};

export const initializeLabAgent = async () => {
	// A new instance of an agent is created here
	// Askar can also be replaced by the indy-sdk if required
	const agent = new Agent({
		config: labAgentConfig,
		modules: await getAgentModules(),
		dependencies: agentDependencies,
	});

	agent.registerOutboundTransport(new WsOutboundTransport());

	agent.registerOutboundTransport(new HttpOutboundTransport());

	agent.registerInboundTransport(
		new HttpInboundTransport({
			port: Number(labEndpoint.split(":").at(-1)),
		})
	);

	// Initialize the agent
	await agent.initialize();

	return agent;
};

export const initializeConsumerAgent = async () => {
	// A new instance of an agent is created here
	// Askar can also be replaced by the indy-sdk if required
	const agent = new Agent({
		config: consumerAgentConfig,
		modules: await getAgentModules(),
		dependencies: agentDependencies,
	});

	agent.registerOutboundTransport(new WsOutboundTransport());

	agent.registerOutboundTransport(new HttpOutboundTransport());

	// in mobile agent we should implement relay server instead of this
	agent.registerInboundTransport(
		new HttpInboundTransport({
			port: Number(consumerEndpoint.split(":").at(-1)),
		})
	);

	// Initialize the agent
	await agent.initialize();

	return agent;
};
