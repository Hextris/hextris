
export default {
  bodyParser: (event) => JSON.parse(event.body),
  sendResponse: async ({
    body,
    statusCode,
    cookies,
    headers,
    isBase64Encoded
  }) => ({
    body: JSON.stringify(body),
    cookies,
    headers,
    isBase64Encoded,
    statusCode,
  }),
}
