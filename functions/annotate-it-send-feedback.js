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
  ANNOTATE_IT_MJ_APIKEY_PRIVATE, 
  ANNOTATE_IT_MJ_APIKEY_PUBLIC, 
  ANNOTATE_IT_MJ_EMAIL_SENDER, 
  ANNOTATE_IT_MJ_EMAIL_RECIEVER 
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
      url: 'https://api.mailjet.com/v3.1/send',
      auth: {
        username: ANNOTATE_IT_MJ_APIKEY_PUBLIC,
        password: ANNOTATE_IT_MJ_APIKEY_PRIVATE
      },
      data: {
        SandboxMode: false,
        Messages: [{
          From: { Email: ANNOTATE_IT_MJ_EMAIL_SENDER, Name: 'Annotate it! Feedback' },
          To: [{ Email: ANNOTATE_IT_MJ_EMAIL_RECIEVER, Name: 'Annotate it! Feedback' }],
          Bcc: [{ Email: ANNOTATE_IT_MJ_EMAIL_SENDER, Name: 'Annotate it! Feedback' }],
          Subject: 'New Feedback for Annotate it! Figma Plugin',
          HTMLPart: `
            <table>
              <tr><td style="width: 90px;"><b>Name</b></td><td>${data.name || 'Unknown'}</td></tr>
              <tr><td style=""><b>E-Mail</b></td><td>${data.email || 'Unknown'}</td></tr>
              <tr><td style="vertical-align: top"><b>Feedback</b></td><td>${data.message.replace(/(?:\r\n|\r|\n)/g, '<br>')}</td></tr>
            </table>
          `
        }]
      }
    }
          
    await axios(config)

    return buildRes(200)
  } catch (err) {
    return buildRes(500, err.toString())
  }
}