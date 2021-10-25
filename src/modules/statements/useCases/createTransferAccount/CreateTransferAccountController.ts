import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransferAccountUseCase } from './CreateTransferAccountUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateTransferAccountController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { user_id } = request.params
    const { amount, description } = request.body;

    const createTransferAccountUseCase = container.resolve(CreateTransferAccountUseCase);
    const type = OperationType.TRANSFER as OperationType

    const statement = await createTransferAccountUseCase.execute({
      user_id,
      type,
      amount,
      description,
      sender_id
    });

    return response.status(201).json(statement);
  }
}
