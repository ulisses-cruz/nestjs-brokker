export interface BrokkerModuleOptions {
  connection: {
    host: string
    port: number
    user: string
    password: string
    vhost?: string
    secure: boolean
  }
  exchange: string
  queue: string
  bindingKeys: Array<string>
  handleMessage: (msg: BrokkerMessage) => void
}

export interface BrokkerMessage {
  key: string
  body: string | null
}
