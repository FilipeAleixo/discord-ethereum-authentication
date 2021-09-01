import { Button, Divider } from "antd";
import React, { useState, useEffect } from "react";
import { login } from "../util/auth";
import { apiRequest } from "../util/util";
const url = require('url');

export default function DiscordAuth({
  purpose,
  setPurposeEvents,
  address,
  userSigner,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {

	const [jwt, setJwt] = useState();
	const [userIdToken, setUserIdToken] = useState()

    useEffect(() => {
        const href = window.location.href;
        console.log(href)
        const parsedUrl = url.parse(href, true);
        const query = parsedUrl.query;
		// TODO error handling
		if (query.id) {
        	setUserIdToken(query.id);
		}
    }, []);

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, height: 300, margin: "auto", marginTop: 64 }}>
        <h2>Discord Authentication:</h2>
        <Divider />
        <div style={{ margin: 8 }}>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = await login({ 
				  signer: userSigner,
				  userIdToken: userIdToken // This is a JWT which will be decoded in the lambda
				});
              console.log(result);
              setJwt(result);
            }}
          >
            Authenticate!
          </Button>
          {jwt && <div>Success! Go check your new awesome role!</div>}
          {/*<div style={{ padding: 16, paddingBottom: 150 }}>JWT: {jwt}</div>
          <div style={{ padding: 16, paddingBottom: 150 }}>{authResponse}</div>*/}
        </div>
      </div>
    </div>
  );
}
