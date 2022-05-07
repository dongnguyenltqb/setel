interface IAPIResponse<T> {
  status?: boolean
  message?: string
  data?: T | unknown
}

export { IAPIResponse }
