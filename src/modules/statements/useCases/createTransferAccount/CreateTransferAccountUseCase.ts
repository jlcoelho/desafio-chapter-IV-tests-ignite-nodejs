import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { CreateTransferAccountError } from "./CreateTransferAccountError";
import { ICreateTransferAccountDTO } from "./ICreateTransferAccountDTO";


@injectable()
export class CreateTransferAccountUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, type, amount, description, sender_id }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new CreateTransferAccountError.UserNotFound()
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id as string });

    if (balance < amount) {
      throw new CreateTransferAccountError.InsufficientFunds()
    }


    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
      sender_id
    });

    return statementOperation;
  }
}
