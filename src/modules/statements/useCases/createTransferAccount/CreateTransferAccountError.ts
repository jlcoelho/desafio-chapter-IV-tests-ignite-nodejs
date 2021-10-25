import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferAccountError {
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }

  export class TransferSameUSer extends AppError {
    constructor() {
      super('Cannot transfer the amount to the same user', 400);
    }
  }
}
