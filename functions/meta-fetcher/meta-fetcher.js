const metaFetcher = require('meta-fetcher')

const handler = async function ( event, context ) {
  try {
    const qs = event.queryStringParameters
    if (!qs.url)
      throw new Error('Please specify ?url=https://... query param')

    const response = await metaFetcher(qs.url)
    if (!response) 
      return { statusCode: response.status, body: response.statusText }
    
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    }
  }
}

module.exports = { handler }
