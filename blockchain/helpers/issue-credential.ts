import {
	Agent,
	CredentialEventTypes,
	CredentialState,
	CredentialStateChangedEvent,
	KeyType,
	TypedArrayEncoder,
	utils,
} from "@aries-framework/core";
import { labDid, labSeed, staticCredAttrs } from "../constants";
import {
	IndyVdrRegisterCredentialDefinitionOptions,
	IndyVdrRegisterSchemaOptions,
} from "@aries-framework/indy-vdr";

async function importLabDid(agent: Agent) {
	await agent.dids
		.import({
			did: labDid,
			overwrite: true,
			privateKeys: [
				{
					keyType: KeyType.Ed25519,
					privateKey: TypedArrayEncoder.fromString(labSeed),
				},
			],
		})
		.catch(() => {
			throw new Error("Error at importing labDid");
		});
}

export const registerSchema = async (permissionedAgent: Agent) => {
	const schemaTemplate = {
		name: "ABC Crop Verification" + utils.uuid(),
		version: "1.0.0",
		attrNames: ["crop-name", "crop-sequence", "crop-function"],
		issuerId: labDid,
	};

	const { schemaState } =
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore-next-line
		await permissionedAgent.modules.anoncreds.registerSchema<IndyVdrRegisterSchemaOptions>(
			{
				schema: schemaTemplate,
				options: {
					endorserMode: "internal",
					endorserDid: labDid,
				},
			}
		);

	if (schemaState.state === "failed") throw new Error(schemaState.reason);

	return schemaState;
};

export const registerCredentialDefinition = async (
	permissionedAgent: Agent,
	schemaId: string
) => {
	const { credentialDefinitionState } =
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore-next-line
		await permissionedAgent.modules.anoncreds.registerCredentialDefinition<IndyVdrRegisterCredentialDefinitionOptions>(
			{
				credentialDefinition: {
					schemaId,
					issuerId: labDid,
					tag: "latest",
				},
				options: {
					endorserMode: "internal",
					endorserDid: labDid,
				},
			}
		);

	if (credentialDefinitionState.state === "failed")
		throw new Error(credentialDefinitionState.reason);

	return credentialDefinitionState;
};

export const issueCredential = async (
	permissionedAgent: Agent,
	connectionId: string
) => {
	// this is a prerequisite
	await importLabDid(permissionedAgent);

	// here for testing we're creating new schema & cred def every time,
	// but we would never do this everytime in real projects
	// once is enough! then we will persist the id of schema & cred def and use when needed
	console.log("Registering schema...");
	const schema = await registerSchema(permissionedAgent);
	// console.log(schema.schemaId);

	console.log("Registering credential definition...");
	const credDef = await registerCredentialDefinition(
		permissionedAgent,
		schema.schemaId!
	);
	// console.log(credDef.credentialDefinitionId);

	console.log("Offering credential...");
	const credExchangeRecord = await permissionedAgent.credentials
		.offerCredential({
			connectionId: connectionId,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore-next-line
			protocolVersion: "v2",
			credentialFormats: {
				anoncreds: {
					attributes: [
						{
							name: "crop-name",
							value: staticCredAttrs.cropName,
						},
						{
							name: "crop-sequence",
							value: staticCredAttrs.cropSequence,
						},
						{
							name: "crop-function",
							value: staticCredAttrs.cropFunction,
						},
					],
					credentialDefinitionId: credDef.credentialDefinitionId!,
				},
			},
		})
		.catch(() => {
			throw new Error("Credential offer failed");
		});

	console.log(
		"Credential offered by lab agent, now farmer agent should accept it"
	);
	return credExchangeRecord;
};

const acceptCredOffer = async (agent: Agent, credentialRecordId: string) => {
	// prerequisite
	const linkSecretIds = await agent.modules.anoncreds.getLinkSecretIds();
	if (linkSecretIds.length === 0) {
		await agent.modules.anoncreds.createLinkSecret();
	}

	await agent.credentials.acceptOffer({
		credentialRecordId: credentialRecordId,
	});
};

export const handleIncomingCredOffer = (
	agent: Agent,
	cb: (holderAgent: Agent, credDefId: string) => Promise<void>
) => {
	agent.events.on(
		CredentialEventTypes.CredentialStateChanged,
		async ({ payload }: CredentialStateChangedEvent) => {
			if (
				payload.credentialRecord.state === CredentialState.OfferReceived
			) {
				console.log(
					"Accepting verification credentials received from lab agent as farmer agent..."
				);
				await acceptCredOffer(agent, payload.credentialRecord.id);
			} else if (
				payload.credentialRecord.state === CredentialState.Done
			) {
				cb(
					agent,
					payload.credentialRecord.metadata.data[
						"_anoncreds/credential"
					].credentialDefinitionId
				);
			}
		}
	);
};
