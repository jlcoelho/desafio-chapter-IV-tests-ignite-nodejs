import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { ICreateStatementDTO } from "./ICreateStatementDTO"


let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statements', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to create a new statement deposit', async () => {
    const user: ICreateUserDTO = {
      name: 'teste',
      email: 'teste@teste.com',
      password: '123456'
    }

    const userCreated = await createUserUseCase.execute(user)

    await authenticateUserUseCase.execute({
      email: 'teste@teste.com',
      password: '123456'
    })

    const statement: ICreateStatementDTO = {
      user_id: userCreated.id as string,
      description: 'test',
      amount: 10,
      type: OperationType.DEPOSIT
    }

    const createStatementResult = await createStatementUseCase.execute(statement)

    expect(createStatementResult).toHaveProperty('id')
  })

  it('should not be able to create a new statement without user', () => {
    expect(async () => {
      const statement: ICreateStatementDTO = {
        user_id: '123456',
        description: 'test',
        amount: 10,
        type: OperationType.DEPOSIT
      }

      await createStatementUseCase.execute(statement)
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it('should be able to create a new withdraw', async () => {
    const user: ICreateUserDTO = {
      name: 'teste',
      email: 'teste@teste.com',
      password: '123456'
    }

    const userCreated = await createUserUseCase.execute(user)

    await authenticateUserUseCase.execute({
      email: 'teste@teste.com',
      password: '123456'
    })

    await createStatementUseCase.execute({
      user_id: userCreated.id as string,
      description: 'Money',
      amount: 80,
      type: OperationType.DEPOSIT
    } as ICreateStatementDTO)

    const createWithDraw = await createStatementUseCase.execute({
      user_id: userCreated.id as string,
      description: 'Bloodborne',
      amount: 70,
      type: OperationType.WITHDRAW
    } as ICreateStatementDTO)

    expect(createWithDraw).toHaveProperty('id')
  })

  it('should not be able to create new withdraw with balance less than requested', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'teste',
        email: 'teste@teste.com',
        password: '123456'
      }

      const userCreated = await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: 'teste@teste.com',
        password: '123456'
      })

      await createStatementUseCase.execute({
        user_id: userCreated.id as string,
        description: 'Bloodborne',
        amount: 70,
        type: OperationType.WITHDRAW
      } as ICreateStatementDTO)
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
