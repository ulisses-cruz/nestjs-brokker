import { DynamicModule, Module } from '@nestjs/common'

import { BROKKER_OPTIONS } from './contants'
import { BrokkerModuleOptions } from './types'
import { BrokkerService } from './providers/brokker.service'
import { BrokkerConnectionProvider } from './providers/connection.provider'

@Module({})
export class BrokkerModule {
  static register(opts: BrokkerModuleOptions): DynamicModule {
    const providers = [
      { provide: BROKKER_OPTIONS, useValue: opts },
      BrokkerConnectionProvider,
      BrokkerService,
    ]

    return {
      module: BrokkerModule,
      providers,
      exports: providers,
    }
  }
}
