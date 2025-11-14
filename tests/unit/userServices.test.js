const { insertUser, findbyEmail, findbyId } = require('../../services/userServices');
const { User } = require('../../models');


jest.mock('../../models', () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn()
  },
  RefreshToken: {}
}));

describe('userServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('insertUser', () => {
    it('should call User.create with correct parameters and return user', async () => {
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
      User.create.mockResolvedValue(mockUser);

      const result = await insertUser('test@example.com', 'hashedPassword');

      expect(User.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedPassword'
      });

      expect(result).toEqual(mockUser);
    });
  });

  describe('findbyEmail', () => {
    it('should call User.findOne with correct where clause and return user', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      User.findOne.mockResolvedValue(mockUser);

      const result = await findbyEmail('test@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual(mockUser);
    });
  });
});