import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'eu-west-1' });

async function sendMail(event, context) {
  const params = {
    Source: 'YOUR_EMAIL',
    Destination: {
      ToAddresses: ['YOUR_EMAIL'],
    },
    Message: {
      Body: {
        Text: {
          Data: 'Hello From Eric!'
        },
      },
      Subject: {
        Data: 'Test Mail'
      }
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
  } catch (error) {
    console.error(error);
  }

}

export const handler = sendMail;


