import ApiService from './ApiService'

ApiService.config({
  baseUrl: process.env.APP_API_URL,
  getOptions: () => {
    return {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    }
  },
})

export { ApiService }