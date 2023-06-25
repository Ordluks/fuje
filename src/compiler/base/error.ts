import { TokenPosition } from './data'

export function FujeCompilerError(message: string, pos: TokenPosition) {
  const { line, column } = pos

  this.name = 'FujeCompilerError'
  this.message = `${message} at line ${line} column ${column}`
  this.stack = (new Error()).stack
}
FujeCompilerError.prototype = Object.create(Error.prototype)
FujeCompilerError.prototype.constructor = FujeCompilerError
