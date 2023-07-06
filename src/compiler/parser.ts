import r from 'ramda'
import {
  ExpressionType,
  casedSyntax,
  createSyntax,
  multipleSyntax
} from './base/parser'
import lexer, { TokenTypes } from './lexer'
import { Token } from './base/data'

type IntegerExpression = ExpressionType<typeof integerExpression>
export const integerExpression = createSyntax((pick) => [
  {
    integer: pick(0, TokenTypes.integer)
  },
  1
])

type FloatExpression = ExpressionType<typeof floatExpression>
export const floatExpression = createSyntax((pick) => [
  {
    float: pick(0, TokenTypes.float)
  },
  1
])

export const expression = casedSyntax<IntegerExpression | FloatExpression>(
  integerExpression,
  floatExpression
)

export const letStatement = createSyntax((pick, tokens) => {
  pick(0, TokenTypes.letKw)
  const indifire = pick(1, TokenTypes.indifire)
  pick(2, TokenTypes.equal)
  const count = 3
  const { expressionNode, length } = expression(r.drop(count, tokens))

  return [
    {
      indifire,
      expr: expressionNode
    },
    3 + length
  ]
})

export const rootStatement = multipleSyntax(letStatement, (statements) => ({
  statements
}))

const parser = r.compose(
  (tokensList: Token[]) =>
    rootStatement(
      r.filter(({ type }) => type != TokenTypes.tabulation, tokensList)
    ).expressionNode,
  lexer
)
export default parser
