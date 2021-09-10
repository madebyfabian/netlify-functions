// Import packages
const axios = require('axios').default


// Build response function
const buildRes = ( statusCode = 200, body = 'Success.', headers = {} ) => ({ 
  statusCode, 
  body: JSON.stringify({ error: statusCode >= 400, data: body  }), 
  headers: { ...headers, 'Access-Control-Allow-Origin': '*' } 
})


// Config env variables
const {
  TRELLO_AUTH_KEY,
  TRELLO_AUTH_TOKEN,
  TRELLO_ID_OF_LIST
} = process.env


exports.handler = async ( event, context ) => {
  if (event.httpMethod !== 'POST') 
    return buildRes(405, 'Method Not Allowed', { 'Allow': 'POST' })

  let data
  try {
    data = JSON.parse(event.body)
  } catch (error) {
    return buildRes(400, 'Please provide body')
  }
  
  try {
    const config = {
      method: 'POST',
      url: 'https://api.trello.com/1/cards',
      params: {
        name: 'New Feedback',
        desc: 
          `**Name**: ${data.name || 'Unknown'}\n` +
          `**Email**: ${data.email || 'Unknown'}\n` +
          `**Feedback**: \n${data.message || '–'}\n`,
        key: TRELLO_AUTH_KEY,
        token: TRELLO_AUTH_TOKEN,
        idList: TRELLO_ID_OF_LIST,
        pos: 'top'
      },
    }

    await axios(config)

    return buildRes(200)
  } catch (err) {
    return buildRes(500, err.toString())
  }
}
