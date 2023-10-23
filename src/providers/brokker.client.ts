import { AMQPClient } from '@cloudamqp/amqp-client'
import { Inject, Injectable, Logger } from '@nestjs/common'

import { getUrl } from '../utils'
import { BROKKER_OPTIONS } from '../contants'
import { BrokkerModuleOptions } from '../types'

@Injectable()
export class BrokkerClient {
  private loggerCtx = BrokkerClient.name

  constructor(@Inject(BROKKER_OPTIONS) private opts: BrokkerModuleOptions) {}

  async emit(key: string, msg: string) {
    try {
      const url = getUrl(this.opts)
      const client = new AMQPClient(url)
      const connection = await client.connect()
      const channel = await connection.channel()

      await channel.exchangeDeclare(this.opts.exchange, 'topic', {
        durable: true,
      })
      await channel.basicPublish(this.opts.exchange, key, msg)
      connection.onerror = () => undefined
      await connection.close()
    } catch (error) {
      Logger.error('Failed to send data to rabbitmq', this.loggerCtx)
    }
  }
}
