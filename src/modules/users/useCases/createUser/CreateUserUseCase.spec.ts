import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to create a user', async () => {
    const user = {
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456'
    }

    const createUser = await createUserUseCase.execute(user)

    expect(createUser).toHaveProperty('id')
  })

  it('should not be able to create a user with name exists', () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'Teste',
        email: 'teste@teste.com',
        password: '123456'
      })

      await createUserUseCase.execute({
        name: 'Teste',
        email: 'teste@teste.com',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
