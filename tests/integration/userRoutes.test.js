const request = require('supertest')
const app = require('../../app')
const { User, sequelize } = require('../../models')
const { generateTokens } = require('../../utilities/tokenUtiles')
const bcrypt = require('bcrypt')

const newUser = {
    email: "testUser@examole.com",
    password: "test1user2password3",
    wrongPass: "testwrongPass"
}
const userExists = {
    email: 'userExist@example.com',
    password: 'usexpass123',
    wrongPass: "usExWrongPass"
}
const userNotExists = {
    email: 'userNotExist@example.com',
    password: 'usNoExPass123'
}
let userToken 

beforeAll(async () => {
    const CheckUserExists = await User.findOne({ where : { email : userExists.email } })
    if (!CheckUserExists) {
        const hashed_password = await bcrypt.hash(userExists.password, 10)
        const InsertUserExists = await User.create({email: userExists.email, password: hashed_password })
        userToken = await generateTokens(InsertUserExists)
    } else userToken =  await generateTokens(CheckUserExists)

    const checkUserNotExists = await User.findOne({ where: { email: userNotExists.email } })
    if (checkUserNotExists) {
        const destroyUserNotExists = await User.destroy({ where: { email: userNotExists.email } })
    }

})
afterAll(async () => {
    const userExist = await User.destroy({ where: { email: newUser.email } })
    app.close && app.close()
});

describe('User API integration test', () => {
    describe('POST /api/v1/users', () => {
        it('should register a new user', async() => {
            const res = await request(app).post('/api/v1/users').send({
            email: newUser.email,
            password: newUser.password,
            confirm_password: newUser.password
            })

            expect(res.statusCode).toBe(201)
            expect(res.body.code).toBe('USER_CREATED')
            expect(res.body.message).toMatch(/successfully/)
    
            const userInDb = await User.findOne({where: {email: newUser.email}})
            expect(userInDb).not.toBeNull()
        })

        it('should return error if email is exists', async() => {
            const res = await request(app).post('/api/v1/users').send({
            email: userExists.email,
            password: userExists.password,
            confirm_password: userExists.password
            })

            expect(res.statusCode).toBe(400)
            expect(res.body.code).toBe('EMAIL_EXISTS')
        })

        it('should return error if passwords do not match', async() => {
            const res = await request(app).post('/api/v1/users').send({
            email: newUser.email,
            password: newUser.password,
            confirm_password: newUser.wrongPass
            })

            expect(res.statusCode).toBe(400)
            expect(res.body.code).toBe('PASSWORD_MISMATCH')

        })
    })

    describe('POST /api/v1/users/login', () => {
        it('should login user', async() => {
            const res = await request(app).post('/api/v1/users/login').send({
            email: userExists.email,
            password: userExists.password
            })

            expect(res.statusCode).toBe(200)
            expect(res.body.code).toBe('LOGIN_SUCCESS')
            expect(res.body.data).toHaveProperty('access_token')
            expect(res.body.data).toHaveProperty('refresh_token')
            expect(res.body.message).toMatch(/successfully/)
        })

        it('should return error if user is not exists', async() => {
            const res = await request(app).post('/api/v1/users/login').send({
            email: userNotExists.email,
            password: userNotExists.password
            })

            expect(res.statusCode).toBe(400)
            expect(res.body.code).toBe('NOT_FOUND');
        })

        it('should return error if password can not compare by hashed password', async() => {
            const res = await request(app).post('/api/v1/users/login').send({
            email: userExists.email,
            password: userExists.wrongPass,
            })

            expect(res.statusCode).toBe(401)
            expect(res.body.code).toBe('INVALID_CREDENTIALS');

        })
    })

    describe('POST /api/v1/users/token', () => {
        it('should login user', async() => {
            const res = await request(app).post('/api/v1/users/token').send({
            refreshToken: userToken.refresh_token
            })

            expect(res.statusCode).toBe(200)
            expect(res.body.code).toBe('TOKENS_ISSUED')
            expect(res.body.data).toHaveProperty('access_token')
            expect(res.body.data).toHaveProperty('refresh_token')
            expect(res.body.message).toMatch(/successfully/)
        })

        it('should return error if refreshToken is not exists', async() => {
            const res = await request(app).post('/api/v1/users/token').send({
            refreshToken: null
            })

            expect(res.statusCode).toBe(401)
            expect(res.body.code).toBe('NO_TOKEN');
        })

        it('should return error if pinvalid refresh token', async() => {
            const res = await request(app).post('/api/v1/users/token').send({
            refreshToken: 'invalidRefreshToken'
            })

            expect(res.statusCode).toBe(403)
            expect(res.body.code).toBe('INVALID_REFRESH_TOKEN');
        })
    })
})



