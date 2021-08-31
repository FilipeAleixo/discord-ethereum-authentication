import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import apiResponses from 'src/requests/apiResponses'

import { authenticate, getAuthenticationChallenge } from '../lib/auth'

/**
 * GET /sessions
 *
 * Returns a nonce given a public address
 * @method nonce
 * @param {String} event.queryStringParameter['PublicAddress']
 * @throws Returns 401 if the user is not found
 * @returns {Object} nonce for the user to sign
 */
export async function nonce(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  const parameters = event.queryStringParameters

  // todo input validation

  const publicAddress = parameters['PublicAddress']
  try {
    const nonce = await getAuthenticationChallenge(publicAddress)
    return apiResponses._200({ nonce })
  } catch (e) {
    return apiResponses._400({ error: e.message })
  }
}

/**
 * POST /sessions
 *
 * Returns a JWT, given a username and password.
 * @method login
 * @param {String} event.body.username
 * @param {String} event.body.signature
 * @throws Returns 401 if the user is not found or signature is invalid.
 * @returns {Object} jwt that expires in 5 mins
 */
export async function login(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  const AWS = require("aws-sdk");

  const callRoleAssignLambda = async () => {

    const lambda = new AWS.Lambda({region: "us-east-2"});

    return await new Promise((resolve, reject) => {
      const params = {
        FunctionName: "discord-role-assignment",
        Payload: JSON.stringify({userId: "INSER_USER_ID"})
      }
      lambda.invoke(params, (err, results) => {
        if(err) reject(err);
        else resolve(results.Payload);
      })
    })
  
  }


  try {
    const { publicAddress, signature } = JSON.parse(event.body)
    
    
    callRoleAssignLambda()


    const token = await authenticate(publicAddress, signature)

    return apiResponses._200({ token })
  } catch (e) {
    return apiResponses._400({ error: e.message })
  }
}

/**
 * OPTION /{proxy+}
 *
 * Returns proper CORS config
 */
export function defaultCORS(event: APIGatewayEvent): APIGatewayProxyResult {
  const response = {
    // Success response
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({}),
  }
  return response
}

/**
 * GET /helloAuth
 *
 * Returns a message given a valid auth header
 * @method helloAuth
 */
export async function helloAuth(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  console.log({ event })

  const user = event.requestContext.authorizer.lambda.user
  return apiResponses._200({ message: `Hello ${user} you are authenticated` })
}
