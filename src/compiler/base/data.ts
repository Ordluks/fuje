export interface Token {
  type: string
  value: string
  position: TokenPosition
}

export interface TokenPosition {
  line: number
  column: number
}
