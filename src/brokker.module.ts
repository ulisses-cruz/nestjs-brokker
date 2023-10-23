import { DynamicModule, Module } from '@nestjs/common'

import { BROKKER_OPTIONS } from './contants'
import { BrokkerModuleOptions } from './types'
import { BrokkerClient } from './providers/brokker.client'
import { BrokkerConnectionProvider } from './providers/connection.provider'

@Module({})
export class BrokkerModule {
  static register(opts: BrokkerModuleOptions): DynamicModule {
    const providers = [
      { provide: BROKKER_OPTIONS, useValue: opts },
      BrokkerConnectionProvider,
      BrokkerClient,
    ]

    return {
      module: BrokkerModule,
      providers,
      exports: providers,
    }
  }
}
