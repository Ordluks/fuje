import { expect } from 'chai'
import lexer, { TokenTypes } from '../src/compiler/lexer'
import { FujeCompilerError } from '../src/compiler/base/error'

describe('Test lexer', () => {
  const testTokenType = (tokenType: TokenTypes, value: string) => {
    it(`expect token with type: ${tokenType}, value: ${value}`, () => {
      const [token] = lexer(value)
      expect(token).to.be.a('object')
      expect(token).to.include({ type: tokenType, value })
    })
  }

  it("should return tokens' list", () => {
    const tokens = lexer('471')
    expect(tokens).to.be.a('array')
  })

  it('expect error', () => {
    const badInput = '€'

    const errFn = () => {
      lexer('1000' + badInput)
    }

    expect(errFn).to.throw(FujeCompilerError, `unkown character "${badInput}" at line 1 column 5`)
  })

  testTokenType(TokenTypes.integer, '15')
  testTokenType(TokenTypes.float, '24.4178')
  testTokenType(TokenTypes.string, '"some text $#&"')
  testTokenType(TokenTypes.char, '\'a\'')
  testTokenType(TokenTypes.operator, '+=')
  testTokenType(TokenTypes.operator, '&+;')
  testTokenType(TokenTypes.equal, '=')
  testTokenType(TokenTypes.indifire, 'value')
  testTokenType(TokenTypes.indifire, '_some_value')
  testTokenType(TokenTypes.indifire, 'SomeValue')
  testTokenType(TokenTypes.letKw, 'let')
})
