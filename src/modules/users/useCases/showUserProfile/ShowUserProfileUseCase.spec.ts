import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


let inMemoryUsersRepoitory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe('Show Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepoitory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepoitory)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepoitory)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepoitory)
  })

  it('should be possible to show the authenticated user', async () => {
    const user:ICreateUserDTO = {
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456'
    }

    const userCreated = await createUserUseCase.execute(user)

    await authenticateUserUseCase.execute({
      email: 'teste@teste.com',
      password: '123456'
    })

    const userProfile = await showUserProfileUseCase.execute(userCreated.id as string)

    expect(userProfile).toHaveProperty('id')
  })

  it('should not be able to show user profile', () => {
    expect(async () => {
      await showUserProfileUseCase.execute('123456')
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
