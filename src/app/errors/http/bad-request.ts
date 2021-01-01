export class BadRequest implements Error {
  name: string;
  message: string;
  stack?: string | undefined;

}
