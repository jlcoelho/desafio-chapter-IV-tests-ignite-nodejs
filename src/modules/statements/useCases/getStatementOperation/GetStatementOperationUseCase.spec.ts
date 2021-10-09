import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase'


let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Statement Operation', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should be able to find statement by id', async () => {
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

    const resultFindStatement = await getStatementOperationUseCase.execute({
      user_id: userCreated.id as string,
      statement_id: createStatementResult.id as string
    })

    expect(resultFindStatement).toHaveProperty('id')
  })

  it('should not be able to find statement without user', () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: '123456',
        statement_id: '123456'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('should not be able to find statement', () => {
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

      await getStatementOperationUseCase.execute({
        user_id: userCreated.id as string,
        statement_id: '123456'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
