import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456'
    }

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: 'teste@teste.com',
      password: '123456'
    })

    expect(result).toHaveProperty('token')
  })

  it('should not be able to authenticate an nonexistent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'teste@teste.com',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it ('should not be able to authenticate with incorrect password', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Teste',
        email: 'teste@teste.com',
        password: '123456'
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: 'teste@teste.com',
        password: '654321'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
