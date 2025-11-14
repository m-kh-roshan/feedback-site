const request = require('supertest')
const app = require('../../app')
const { User, sequelize } = require('../../models')

const userInfo = {
    email: "testUser@examole.com",
    password: "test1user2password3",
    wrongPass: "testwrongPass"
}

beforeAll(async () => {
    const userExists = {
        email: 'userExist',
        password: 'usexpass123'
    }
    const CheckUser = await User.findOne({ where : { email : userExists.email } })
    if (!CheckUser) {
        const InsertUser = await User.create({email: userExists.email, password: userExists.password })
    }
})
afterAll(async () => {
    const userExist = await User.destroy({ where: { email: userInfo.email } })
    app.close && app.close()
});

describe('User API integration test', () => {
    describe('POST /api/v1/users', () => {
        it('should register a new user', async() => {
            const res = await request(app).post('/api/v1/users').send({
            email: userInfo.email,
            password: userInfo.password,
            confirm_password: userInfo.password
            })

            expect(res.statusCode).toBe(201)
            expect(res.body.code).toBe('USER_CREATED')
            expect(res.body.message).toMatch(/successfully/)
    
            const userInDb = await User.findOne({where: {email: userInfo.email}})
            expect(userInDb).not.toBeNull()
        })

        it('should return error if email is exists', async() => {
            const res = await request(app).post('/api/v1/users').send({
            email: userInfo.email,
            password: 'password123',
            confirm_password: 'password123'
            })

            expect(res.statusCode).toBe(400)
            expect(res.body.code).toBe('EMAIL_EXISTS')
        })

        it('should return error if passwords do not match', async() => {
            const res = await request(app).post('/api/v1/users').send({
            email: 'reza@example.com',
            password: 'password123',
            confirm_password: 'password12'
            })

            expect(res.statusCode).toBe(400)
            expect(res.body.code).toBe('PASSWORD_MISMATCH')

        })
    })

    describe('POST /api/v1/users/login', () => {
        it('should login user', async() => {
            const res = await request(app).post('/api/v1/users/login').send({
            email: 'testuser8@example.com',
            password: 'password123'
            })

            expect(res.statusCode).toBe(200)
            expect(res.body.code).toBe('LOGIN_SUCCESS')
            expect(res.body.data).toHaveProperty('access_token')
            expect(res.body.data).toHaveProperty('refresh_token')
            expect(res.body.message).toMatch(/successfully/)
        })

        it('should return error if user is not exists', async() => {
            const res = await request(app).post('/api/v1/users/login').send({
            email: 'gsddv@dfdsff.com',
            password: 'password123'
            })

            expect(res.statusCode).toBe(400)
            expect(res.body.code).toBe('NOT_FOUND');
        })

        it('should return error if password can not compare by hashed password', async() => {
            const res = await request(app).post('/api/v1/users/login').send({
            email: 'reza@example.com',
            password: 'dfdfdfbdfbfb',
            })

            expect(res.statusCode).toBe(401)
            expect(res.body.code).toBe('INVALID_CREDENTIALS');

        })
    })

    describe('POST /api/v1/users/token', () => {
        it('should login user', async() => {
            const res = await request(app).post('/api/v1/users/token').send({
            refreshToken: 'TOKENS_ISSUED'
            })

            expect(res.statusCode).toBe(200)
            expect(res.body.code).toBe('TOKENS_ISSUED')
            expect(res.body.data).toHaveProperty('access_token')
            expect(res.body.data).toHaveProperty('refresh_token')
            expect(res.body.message).toMatch(/successfully/)
        })

        it('should return error if user is not exists', async() => {
            const res = await request(app).post('/api/v1/users/login').send({
            email: 'gsddv@dfdsff.com',
            password: 'password123'
            })

            expect(res.statusCode).toBe(400)
            expect(res.body.code).toBe('NOT_FOUND');
        })

        it('should return error if password can not compare by hashed password', async() => {
            const res = await request(app).post('/api/v1/users/login').send({
            email: 'reza@example.com',
            password: 'dfdfdfbdfbfb',
            })

            expect(res.statusCode).toBe(401)
            expect(res.body.code).toBe('INVALID_CREDENTIALS');

        })
    })
})



