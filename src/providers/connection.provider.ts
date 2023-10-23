import { Logger, Provider } from '@nestjs/common'
import { AMQPClient } from '@cloudamqp/amqp-client'

import { getUrl } from '../utils'
import { BrokkerMessage, BrokkerModuleOptions } from '../types'
import { BROKKER_CONNECTION, BROKKER_OPTIONS } from '../contants'

const loggerCtx = 'BrokkerConnectionProvider'
export const BrokkerConnectionProvider: Provider = {
  provide: BROKKER_CONNECTION,
  useFactory: async (opts: BrokkerModuleOptions) => {
    try {
      const url = getUrl(opts)
      const client = new AMQPClient(url)
      const connection = await client.connect()
      const channel = await connection.channel()

      await channel.exchangeDeclare(opts.exchange, 'topic', { durable: true })
      const queue = await channel.queue(opts.queue)

      for (const key of opts.bindingKeys) {
        await queue.bind(opts.exchange, key)
      }

      await queue.subscribe({ noAck: true }, async (data) => {
        const msg: BrokkerMessage = {
          key: data.routingKey,
          body: data.bodyToString(),
        }
        return opts.handleMessage(msg)
      })

      Logger.warn('connected to the brokker server', loggerCtx)
      return channel
    } catch (error) {
      Logger.error(
        'Unable to connect to brokker. Please check your connection.',
        loggerCtx,
      )
    }
  },
  inject: [BROKKER_OPTIONS],
}
