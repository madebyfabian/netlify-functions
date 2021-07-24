const metaFetcher = require('meta-fetcher')

const headers = {
  /* Required for CORS support to work */
  'Access-Control-Allow-Origin': '*',
  /* Required for cookies, authorization headers with HTTPS */
  'Access-Control-Allow-Credentials': true
},

const handler = async function ( event, context ) {
  try {
    const qs = event.queryStringParameters
    if (!qs.url)
      throw new Error('Please specify ?url=https://... query param')

    const response = await metaFetcher(qs.url)
    if (!response) 
      return { statusCode: response.status, headers, body: response.statusText }
    
    return { statusCode: 200, headers, body: JSON.stringify(response) }
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return { statusCode: 500, headers, body: JSON.stringify({ msg: error.message }) }
  }
}

module.exports = { handler }
