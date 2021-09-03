import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import apiResponses from 'src/requests/apiResponses'
import { authenticate, getAuthenticationChallenge } from '../lib/auth'
import * as jwt from 'jsonwebtoken';

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

  console.log(parameters)

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

  const callRoleAssignLambda = async (userId, publicAddress) => {

    const lambda = new AWS.Lambda({region: "us-east-2"});

    return new Promise((resolve, reject) => {
      const params = {
        FunctionName: "discord-role-assign",
        Payload: JSON.stringify({ userId, publicAddress })
      }
      lambda.invoke(params, (err, results) => {
        if(err) reject(err);
        else resolve(results.Payload);
      })
    })
  
  }

  try {
    const { publicAddress, signature, userIdToken } = JSON.parse(event.body)

    const token = await authenticate(publicAddress, signature)
    // If no error was thrown, let's decode the JWT the user gave us (the one they received from discord)
    // and get the respective discord user ID
    const decoded = jwt.verify(userIdToken, process.env.JWT_SECRET);
    const userId = decoded.userId;
    console.log(`Validation successful for userId: ${userId}, with publicAddress: ${publicAddress}`)

    // Call the lambda function to assign the role to that user
    const results = await callRoleAssignLambda(userId, publicAddress);
    return apiResponses._200({ token })
  } catch (e) {
    console.log(`Error: ${e.message}`)
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
