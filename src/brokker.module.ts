import { DynamicModule, Logger, Module } from '@nestjs/common'

import { BROKKER_HANDLER, BROKKER_OPTIONS } from './contants'
import { BrokkerMessage, BrokkerModuleOptions } from './types'
import { BrokkerClient } from './providers/brokker.client'
import { BrokkerConnectionProvider } from './providers/connection.provider'

@Module({})
export class BrokkerModule {
  static register(opts: BrokkerModuleOptions): DynamicModule {
    const providers = [
      { provide: BROKKER_OPTIONS, useValue: opts },
      BrokkerConnectionProvider,
      BrokkerClient,
      {
        provide: BROKKER_HANDLER,
        useFactory: () => {
          return (msg: BrokkerMessage) => Logger.log(msg)
        },
      },
    ]

    return {
      module: BrokkerModule,
      providers,
      exports: providers,
    }
  }
}
