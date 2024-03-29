"use strict";
const sdk = require("indy-sdk");
const indy = require("../../index.js");
const config = require("../../../config");
const mkdirp = require("mkdirp");
const fs = require("fs");
const os = require("os");
let pool;

exports.get = async function () {
	if (!pool) {
		await exports.setup();
	}
	return pool;
};

exports.setup = async function () {
	// see PlenumProtocolVersion or indy-plenum.common.constans.CURRENT_PROTOCOL_VERSION
	await sdk.setProtocolVersion(2);

	let poolGenesisTxnPath = await exports.getPoolGenesisTxnPath(
		config.poolName
	);
	let poolConfig = {
		genesis_txn: poolGenesisTxnPath,
	};
	try {
		await sdk.createPoolLedgerConfig(config.poolName, poolConfig);
	} catch (e) {
		if (e.message !== "PoolLedgerConfigAlreadyExistsError") {
			throw e;
		}
	} finally {
		pool = await sdk.openPoolLedger(config.poolName);
	}
};

exports.getPoolGenesisTxnPath = async function (poolName) {
	let path = `${os.tmpdir()}/indy/${poolName}.txn`;
	await savePoolGenesisTxnFile(path);
	return path;
};

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

async function poolGenesisTxnData() {
	let poolIp = config.testPoolIp;
	let poolFile = "/home/indy/ledger/sandbox/pool_transactions_genesis";

	while (!fs.existsSync(poolFile)) {
		await sleep(200);
	}

	return fs.readFileSync(poolFile, { encoding: "utf-8" });
	//    return `{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node1","blskey":"4N8aUNHSgjQVgkpm8nhNEfDf6txHznoYREg9kirmJrkivgL4oSEimFF6nsQ6M41QvhM2Z33nves5vfSn9n1UwNFJBYtWVnHYMATn76vLuL3zU88KyeAYcHfsih3He6UHcXDxcaecHVz6jhCYz1P2UZn2bDVruL5wXpehgBfBaLKm3Ba","client_ip":"${poolIp}","client_port":9702,"node_ip":"${poolIp}","node_port":9701,"services":["VALIDATOR"]},"dest":"Gw6pDLhcBcoQesN72qfotTgFa7cbuqZpkX3Xo6pLhPhv"},"metadata":{"from":"Th7MpTaRZVRYnPiabds81Y"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"fea82e10e894419fe2bea7d96296a6d46f50f93f9eeda954ec461b2ed2950b62"},"ver":"1"}
	// {"reqSignature":{},"txn":{"data":{"data":{"alias":"Node2","blskey":"37rAPpXVoxzKhz7d9gkUe52XuXryuLXoM6P6LbWDB7LSbG62Lsb33sfG7zqS8TK1MXwuCHj1FKNzVpsnafmqLG1vXN88rt38mNFs9TENzm4QHdBzsvCuoBnPH7rpYYDo9DZNJePaDvRvqJKByCabubJz3XXKbEeshzpz4Ma5QYpJqjk","client_ip":"${poolIp}","client_port":9704,"node_ip":"${poolIp}","node_port":9703,"services":["VALIDATOR"]},"dest":"8ECVSk179mjsjKRLWiQtssMLgp6EPhWXtaYyStWPSGAb"},"metadata":{"from":"EbP4aYNeTHL6q385GuVpRV"},"type":"0"},"txnMetadata":{"seqNo":2,"txnId":"1ac8aece2a18ced660fef8694b61aac3af08ba875ce3026a160acbc3a3af35fc"},"ver":"1"}
	// {"reqSignature":{},"txn":{"data":{"data":{"alias":"Node3","blskey":"3WFpdbg7C5cnLYZwFZevJqhubkFALBfCBBok15GdrKMUhUjGsk3jV6QKj6MZgEubF7oqCafxNdkm7eswgA4sdKTRc82tLGzZBd6vNqU8dupzup6uYUf32KTHTPQbuUM8Yk4QFXjEf2Usu2TJcNkdgpyeUSX42u5LqdDDpNSWUK5deC5","client_ip":"${poolIp}","client_port":9706,"node_ip":"${poolIp}","node_port":9705,"services":["VALIDATOR"]},"dest":"DKVxG2fXXTU8yT5N7hGEbXB3dfdAnYv1JczDUHpmDxya"},"metadata":{"from":"4cU41vWW82ArfxJxHkzXPG"},"type":"0"},"txnMetadata":{"seqNo":3,"txnId":"7e9f355dffa78ed24668f0e0e369fd8c224076571c51e2ea8be5f26479edebe4"},"ver":"1"}
	// {"reqSignature":{},"txn":{"data":{"data":{"alias":"Node4","blskey":"2zN3bHM1m4rLz54MJHYSwvqzPchYp8jkHswveCLAEJVcX6Mm1wHQD1SkPYMzUDTZvWvhuE6VNAkK3KxVeEmsanSmvjVkReDeBEMxeDaayjcZjFGPydyey1qxBHmTvAnBKoPydvuTAqx5f7YNNRAdeLmUi99gERUU7TD8KfAa6MpQ9bw","client_ip":"${poolIp}","client_port":9708,"node_ip":"${poolIp}","node_port":9707,"services":["VALIDATOR"]},"dest":"4PS3EDQ3dW1tci1Bp6543CfuuebjFrg36kLAUcskGfaA"},"metadata":{"from":"TWwCRQRZ2ZHMJFn9TzLp7W"},"type":"0"},"txnMetadata":{"seqNo":4,"txnId":"aa5e817d7cc626170eca175822029339a444eb0ee8f0bd20d3b0b76e566fb008"},"ver":"1"}`;
}

async function savePoolGenesisTxnFile(filePath) {
	let data = await poolGenesisTxnData();
	await mkdir(filePath);
	return fs.writeFileSync(filePath, data, "utf8");
}

async function mkdir(filePath) {
	return new Promise((resolve, reject) => {
		let folderPath = filePath
			.split("/")
			.slice(0, filePath.split("/").length - 1)
			.join("/");
		mkdirp(folderPath, function (err, res) {
			if (err) reject(err);
			else resolve(res);
		});
	});
}

exports.setEndpointForDid = async function (did, endpoint) {
	let attributeRequest = await sdk.buildAttribRequest(
		await indy.did.getEndpointDid(),
		did,
		null,
		{ endpoint: { ha: endpoint } },
		null
	);
	await sdk.signAndSubmitRequest(
		await indy.pool.get(),
		await indy.wallet.get(),
		await indy.did.getEndpointDid(),
		attributeRequest
	);
};

exports.getEndpointForDid = async function (did) {
	let getAttrRequest = await sdk.buildGetAttribRequest(
		await indy.did.getEndpointDid(),
		did,
		"endpoint",
		null,
		null
	);
	let res = await waitUntilApplied(
		pool,
		getAttrRequest,
		(data) => data["result"]["data"] != null
	);
	if (!res.result.data) throw Error(`DID ${did} not found`);
	return JSON.parse(res.result.data).endpoint.ha;
};

exports.proverGetEntitiesFromLedger = async function (identifiers) {
	let schemas = {};
	let credDefs = {};
	let revStates = {};

	if (!identifiers) return [schemas, credDefs, revStates];

	for (let referent of Object.keys(identifiers)) {
		let item = identifiers[referent];
		let receivedSchema = await indy.issuer.getSchema(item["schema_id"]);
		schemas[receivedSchema.id] = receivedSchema;

		let [receivedCredDefId, receivedCredDef] = await indy.issuer.getCredDef(
			await indy.pool.get(),
			await indy.did.getEndpointDid(),
			item["cred_def_id"]
		);
		credDefs[receivedCredDefId] = receivedCredDef;

		if (item.rev_reg_seq_no) {
			// TODO Create Revocation States
		}
	}

	return [schemas, credDefs, revStates];
};

exports.verifierGetEntitiesFromLedger = async function (identifiers) {
	let schemas = {};
	let credDefs = {};
	let revRegDefs = {};
	let revRegs = {};

	for (let referent of Object.keys(identifiers)) {
		let item = identifiers[referent];
		let receivedSchema = await indy.issuer.getSchema(item["schema_id"]);
		schemas[receivedSchema.id] = receivedSchema;

		let [receivedCredDefId, receivedCredDef] = await indy.issuer.getCredDef(
			await indy.pool.get(),
			await indy.did.getEndpointDid(),
			item["cred_def_id"]
		);
		credDefs[receivedCredDefId] = receivedCredDef;

		if (item.rev_reg_seq_no) {
			// TODO Get Revocation Definitions and Revocation Registries
		}
	}
	return [schemas, credDefs, revRegDefs, revRegs];
};

exports.sendNym = async function (
	poolHandle,
	walletHandle,
	Did,
	newDid,
	newKey,
	role
) {
	let nymRequest = await sdk.buildNymRequest(Did, newDid, newKey, null, role);
	await sdk.signAndSubmitRequest(poolHandle, walletHandle, Did, nymRequest);
};

async function waitUntilApplied(ph, req, cond) {
	for (let i = 0; i < 3; i++) {
		let res = await sdk.submitRequest(ph, req);

		if (cond(res)) {
			return res;
		}

		await indy.utils.sleep(5 * 1000);
	}
}
