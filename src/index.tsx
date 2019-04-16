import { render } from 'server-renderer'
import App from './App'
import routes from './routes'
import './global.scss'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_NAME: string
      APP_API_URL: string
    }
  }
}

render({
  container: '.app-container',
  App,
  routes,
})