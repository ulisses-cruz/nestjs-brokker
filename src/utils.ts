import { BrokkerModuleOptions } from './types'

export const getUrl = (opts: BrokkerModuleOptions): string => {
  let url = opts.connection.secure ? 'amqps://' : 'amqp://'
  url += `${opts.connection.user}:`
  url += `${opts.connection.password}@`
  url += `${opts.connection.host}:`
  url += `${opts.connection.port}/`
  url += `${opts.connection.vhost ?? ''}`
  return url
}
