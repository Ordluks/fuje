import r from 'ramda'
import { Token } from './data'
import { FujeCompilerError } from './error'

export interface LexicRule {
  pattern: string
  tokenType: string
}

export const createLexer = (rules: LexicRule[]) => (source: string) => {
  const match = (
    text: string,
    rules: LexicRule[],
    lastMatch: [string, LexicRule] | null = null
  ): [string, LexicRule] | null => {
    if (rules.length <= 0) return lastMatch
    const rule = rules[0]
    const regex = new RegExp('^' + rule.pattern)
    const result = text.match(regex)
    const newMatch: [string, LexicRule] | null =
      result && result[0] ? [result[0], rule] : r.clone(lastMatch)

    return match(text, r.drop(1, rules), newMatch)
  }

  const lexing = (tokensList: Token[], text: string): Token[] => {
    if (text.length <= 0) return tokensList

    const result = match(text, rules)
    if (!result) {
      const [char] = text
      const [lastToken] = tokensList
      const position = lastToken
        ? {
            ...lastToken.position,
            column: lastToken.position.column + lastToken.value.length
          }
        : { line: 1, column: 1 }
      throw new FujeCompilerError(`unkown character "${char}"`, position)
    }

    const [value, { tokenType }] = result

    const beforeText = source.slice(0, source.length - text.length)
    const lines = beforeText.split('\n')
    const line = lines.length
    const column = r.nth(-1, lines).length + 1

    const token: Token = {
      type: tokenType,
      value,
      position: {
        line,
        column
      }
    }

    return lexing([...tokensList, token], text.slice(value.length))
  }

  return lexing([], source)
}
