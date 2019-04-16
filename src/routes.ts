import * as pages from 'src/pages'
import { Route } from 'server-renderer'

const routes: Route[] = [
  {
    name: 'home',
    path: '/',
    component: pages.Home,
  }
]

export default routes