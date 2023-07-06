import r from 'ramda'
import { Token } from './data'
import { FujeCompilerError } from './error'

export type Syntax<E extends object> = (tokens: Token[]) => {
  expressionNode: E
  length: number
}

export type ExpressionType<S extends Syntax<object>> = ReturnType<S>['expressionNode']

const checkToken = (
  tokens: Token[],
  index: number,
  tokenType: string
): Token => {
  const token = tokens[index]
  if (token.type != tokenType) {
    const { value, position } = token
    throw new FujeCompilerError(`unexpected "${value}"`, position)
  }

  return { ...token }
}

export const createSyntax =
  <E extends object>(
    fn: (
      pick: (index: number, tokenType: string) => Token,
      tokens: Token[]
    ) => ReturnType<Syntax<E>> | [E, number]
  ): Syntax<E> =>
  (tokens) => {
    const result = fn(r.partial(checkToken, [tokens]), tokens)

    return Array.isArray(result)
      ? { expressionNode: result[0], length: result[1] }
      : result
  }

export const casedSyntax = <E extends object>(...syntaxes: Syntax<E>[]): Syntax<E> => (tokens) => {
  const _cases = (syntaxes: Syntax<E>[]): ReturnType<Syntax<E>> => {
    try {
      return syntaxes[0](tokens)
    } catch (error) {
      if (r.is(FujeCompilerError, error)) return _cases(r.tail(syntaxes))
      else throw error
    }
  }

  return _cases(syntaxes)
}

export const multipleSyntax = <E extends object, EC extends object>(syntax: Syntax<E>, after: (expressions: E[]) => EC): Syntax<EC> => (tokens) => {
  const _multi = (acc: E[], index: number): [E[], number] => {
    if (index >= tokens.length) return [acc, index - 1]
    const { expressionNode, length } = syntax(tokens.slice(index))
    return _multi([...acc, expressionNode], index + length)
  }

  const [expressions, length] = _multi([], 0)

  return {
    expressionNode: after(expressions),
    length
  }
}