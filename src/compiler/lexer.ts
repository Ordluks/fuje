import { createLexer } from './base/lexer'

export enum TokenTypes {
  integer = 'integer',
  float = 'float',
  string = 'string',
  char = 'char',
  operator = 'operator',
  equal = 'equal',
  indifire = 'indifire',
  letKw = 'letKw'
}

const lexer = createLexer([
  { pattern: '[0-9]+', tokenType: TokenTypes.integer },
  { pattern: '[0-9]+\\.[0-9]+', tokenType: TokenTypes.float },
  { pattern: '".+"', tokenType: TokenTypes.string },
  { pattern: '\'.+\'', tokenType: TokenTypes.char },
  { pattern: '[@#$_\\&\\-\\+\\/\\\*:;!?<>~|^=]+', tokenType: TokenTypes.operator },
  { pattern: '=', tokenType: TokenTypes.equal },
  { pattern: '[_a-zA-Z][_a-zA-Z0-9]*', tokenType: TokenTypes.indifire },
  { pattern: 'let', tokenType: TokenTypes.letKw }
])

export default lexer
