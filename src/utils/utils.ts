export default class Utils {

  public static throttle(fun: (...args: any[]) => any, delay = 100) {
    let start = Date.now()
    let timer: NodeJS.Timeout
    return (...args: any[]) => {
      const now = Date.now()
      if (now - start > delay) {
        start = now
        fun.apply(this, args)
      } else {
        clearTimeout(timer)
        timer = setTimeout(() => {
          fun.apply(this, args)
        }, delay)
      }
    }
  }

}