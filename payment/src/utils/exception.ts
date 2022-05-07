export class NotFoundException extends Error {
  constructor(message: string) {
    super(`NotFoundException: ${message}`)
    this.name = 'NotFoundException'
  }
}

export class ValidateException extends Error {
  constructor(message: string) {
    super(`ValidateException: ${message}`)
    this.name = 'ValidateException'
  }
}
