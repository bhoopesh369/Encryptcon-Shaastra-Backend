# Encrptcon Shaastra Hackathon

## Self Sovereign Identity Demonstrator
<ul>
 <li>This repository serves as a demonstrator for self sovereign identity implementation on the HyperLedger Indy blockchain. Setting up this repo will give you 4 agents (of equal capablities and features) on localhost ports 3000-3003, 4 Hyperledger Indy Nodes and a Node Monitor on localhost port 9000. Any of these agents can act as an issuer, holder or verifier. For convenience, the nodes are marked User1, User2, a bank (Bankmenos) and a scammer (Sir Scams a Lot). However every node is identical to the other in terms of capablity and can perform the same functions.</li>
 <li>To use this, establish a connection from one agent to another by using the DID of one agent (shown in the agent footer) in the 'Send New Connection Request' of another agent. After that the requests in both the agents' messages box will have to be accepted to establish a connection.</li>
 <li>After a connection is established, agents can create credentials and share them with each other and also send credential access requests. Each request will have to be accepted in the agent's messages section.</li>
 <li><b>If you receive a blank page on clicking any button, its the indication of a successfull request, just go back one page and refresh the page to see the updated results from the Indy blockchain.</b></li>
 <li>All the operations happen on the Indy blockchain's ledger.</li>
</ul>

### Can be Set up in any machine

Dependencies:
 - [Docker](https://docs.docker.com/engine/install/ubuntu/)

Clone the repo:
```bash
git clone <repo-url>
```

Go into the infra dir:
```bash
cd infra
```

Build and Run:
```bash
docker compose up --build
```

There will be currently 4 agents running on ports 3000, 3001, 3002, 3003 (all in localhost)

To run the indy agent on a different port, change the port in the docker-compose.yml file.

To create more agents, add more services in the docker-compose.yml file with the docker image as <b>indy-agent</b> and the necessary environment variables.


### Team Name: Give PPO Please

- [Vignesh Duraisamy](https://github.com/vigneshd332/)
- [Bhoopesh S](https://github.com/bhoopesh369/)
- [Srisowrirajan KS](https://github.com/srimanks)
- [Manikandan S](https://github.com/mani1911/)

