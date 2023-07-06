import { TokenPosition } from './data'

export class FujeCompilerError extends Error {
  constructor(message: string, pos: TokenPosition) {
    super()
    const { line, column } = pos

    this.name = 'FujeCompilerError'
    this.message = `${message} at line ${line} column ${column}`
  }
}
