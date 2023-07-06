import { expect } from 'chai'
import { TokenTypes } from '../src/compiler/lexer'
import parser from '../src/compiler/parser'

describe('Test parser', () => {
  it('should return AST', () => {
    const actualAST = parser('let x = 37\nlet y = 5')
    const expectedAST = {
      statements: [
        {
          indifire: {
            type: TokenTypes.indifire,
            value: 'x',
            position: {
              line: 1,
              column: 5
            }
          },
          expr: {
            integer: {
              type: TokenTypes.integer,
              value: '37',
              position: {
                line: 1,
                column: 9
              }
            }
          }
        },
        {
          indifire: {
            type: TokenTypes.indifire,
            value: 'y',
            position: {
              line: 2,
              column: 5
            }
          },
          expr: {
            integer: {
              type: TokenTypes.integer,
              value: '5',
              position: {
                line: 2,
                column: 9
              }
            }
          }
        }
      ]
    }

    expect(actualAST).to.deep.equal(expectedAST)
  })
})
