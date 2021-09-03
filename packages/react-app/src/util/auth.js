import { apiRequest } from "./util";

export const login = async ({ signer, userIdToken }) => {
  console.log({ signer });
  const address = await signer.getAddress();
  console.log({ address });

  const nonceResult = await apiRequest({ path: `v1/sessions?PublicAddress=${address}`, method: "GET" });

  const nonce = nonceResult.nonce;
  console.log({ nonce });

  // sign nonce
  const msg = `LET ME IN!!! ${nonce}`;
  const signature = await signer.signMessage(msg);

  const loginResult = await apiRequest({
    path: `v1/sessions`,
    method: "POST",
    data: {
      publicAddress: address,
      signature,
      userIdToken
    },
  });

  return loginResult;
};

export const logout = async ({setJwtAuthToken}) => setJwtAuthToken(null)
