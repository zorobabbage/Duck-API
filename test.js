const axios = require('axios')

async function request (body) {
  const response = await axios({
    method: 'post',
    url: 'http://localhost:4000/ducks/',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  console.log(response)
  return response
}

const data = {
    from: 1,
    to: 20
}

const body = JSON.stringify(data)
const config = {
    headers: {
      'Content-Type': 'application/JSON'
    }
  };
const res =  axios.post('http://localhost:4000/test/', data, config);
console.log(res)