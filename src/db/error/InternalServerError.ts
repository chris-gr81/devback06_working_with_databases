export class InternalServerError extends Error {
  public status: number = 500;

  constructor(context?: string) {
    const defaultMessage = "An unexpected error occurred";
    super(context ? `${defaultMessage} ${context}` : defaultMessage);
  }
}
