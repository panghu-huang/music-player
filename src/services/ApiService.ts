import { stringify as queryStringify } from 'querystring'
import 'isomorphic-fetch'

enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

type ErrorFormatter = (error: any) => any

type OptionsGetter = (path?: string, method?: string) => object

interface Options {
  path?: string
  data?: object
  headers?: Record<string, string>
  mode?: 'same-origin' | 'cors' | 'navigate' | 'no-cors'
}

interface FetchOptions extends Options {
  method: Method
}

interface ConfigOptions {
  baseUrl?: string
  formatError?: ErrorFormatter
  getOptions?: OptionsGetter
}

class ApiService<T = any> {

  public static baseUrl: string
  public static formatError: ErrorFormatter
  public static getOptions: OptionsGetter

  public static config(options: ConfigOptions) {
    Object.keys(options).forEach(optionName => {
      ApiService[optionName] = options[optionName]
    })
  }

  private readonly apiUrl: string

  constructor(routeName: string, baseUrl?: string) {
    this.apiUrl = `${baseUrl || ApiService.baseUrl}/${routeName}`
  }

  public get(opts?: Options) {
    return this.fetch({ ...opts, method: Method.GET })
  }

  public post(opts?: Options) {
    return this.fetch({ ...opts, method: Method.POST })
  }

  public put(opts?: Options) {
    return this.fetch({ ...opts, method: Method.PUT })
  }

  public patch(opts?: Options) {
    return this.fetch({ ...opts, method: Method.PATCH })
  }

  public delete(opts?: Options) {
    return this.fetch({ ...opts, method: Method.DELETE })
  }

  public async fetch(opts: FetchOptions, isList?: boolean): Promise<T> {
    const { formatError } = ApiService
    try {
      const url = this.getUrl(opts)
      const options = this.getOptions(opts, url)
      const response = await fetch(url, options)
      const responseText = await response.text()
      if (!response.ok) {
        throw new Error(responseText)
      }
      return JSON.parse(responseText)
    } catch (error) {
      const formattedError = formatError
        ? formatError(error)
        : { status: null, message: error.message, }
      throw new Error(formattedError)
    }
  }

  private getUrl(opts: FetchOptions): string {
    const url = opts.path 
      ? `${this.apiUrl}/${opts.path}` 
      : this.apiUrl
    if (opts.method !== Method.GET || !opts.data) {
      return url
    }
    return url + `?${queryStringify(opts.data as any)}`
  }

  private getOptions(originalOpts: FetchOptions, url: string): RequestInit {
    const { getOptions } = ApiService
    const options: RequestInit = {
      ...(getOptions ? getOptions(url, originalOpts.method) : {}),
      ...originalOpts,
      body: this.getRequestBody(originalOpts),
    }
    return options
  }

  private getRequestBody(opts: FetchOptions) {
    if (opts.method === Method.GET || !opts.data) {
      return null
    }
    return JSON.stringify(opts.data)
  }

}

export default ApiService