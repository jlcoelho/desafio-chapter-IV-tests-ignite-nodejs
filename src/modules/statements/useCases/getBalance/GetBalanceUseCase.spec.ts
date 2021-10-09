import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"


let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let getBalanceUseCase: GetBalanceUseCase

describe('Balance', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to list the balance', async () => {
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

    const balance = await getBalanceUseCase.execute({ user_id: userCreated.id as string })

    expect(balance).toHaveProperty('statement')
    expect(balance).toHaveProperty('balance')
    expect(balance.statement).toBeInstanceOf(Array)
  })

  it('should not be able to list balance without user', () => {
    expect (async () => {
      await getBalanceUseCase.execute({ user_id: '123456' })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
