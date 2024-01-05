import { Agent, ConnectionEventTypes, ConnectionStateChangedEvent, DidExchangeState, OutOfBandRecord } from "@aries-framework/core";

export const createNewInvitation = async (agent: Agent) => {
	const outOfBandRecord = await agent.oob.createInvitation();

	return {
		invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({ domain: "https://example.org" }),
		outOfBandRecord,
	};
};

export const setupConnectionListener = (agent: Agent, outOfBandRecord: OutOfBandRecord, cb: (...args: any) => void) => {
	agent.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {
		// checking if we are connecting with the expected agent
		if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return;
		if (payload.connectionRecord.state === DidExchangeState.Completed) {
			// the connection is now ready for usage in other protocols!
			console.log("Connection success. Now you can use this connection to exchange messages");
			// console.log(`out-of-band id ${outOfBandRecord.id}, connectionRecord id ${payload.connectionRecord.id}`);
			cb(payload.connectionRecord.id);
		}
		// in production, we must setup timeout to cancel the listening to avoid memory overload
	});
};

export const receiveInvitation = async (agent: Agent, invitationUrl: string) => {
	const { outOfBandRecord } = await agent.oob.receiveInvitationFromUrl(invitationUrl);

	return outOfBandRecord;
};
