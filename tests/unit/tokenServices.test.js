const { insert, destroyByToken, findTokenByToken } = require('../../services/tokenServices');
const { RefreshToken } = require('../../models');

jest.mock('../../models', () => ({
  RefreshToken: {
    create: jest.fn(),
    destroy: jest.fn(),
    findOne: jest.fn()
  }
}));

describe('tokenServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('insert', () => {
    it('should call RefreshToken.create with correct parameters and return inserted token', async () => {
      const mockToken = { id: 1, user_id: 5, token: 'abc123' };
      RefreshToken.create.mockResolvedValue(mockToken);

      const result = await insert(5, 'abc123');

      expect(RefreshToken.create).toHaveBeenCalledWith({ user_id: 5, token: 'abc123' });
      expect(result).toEqual(mockToken);
    });
  });

  describe('destroyByToken', () => {
    it('should call RefreshToken.destroy with correct where clause', async () => {
      RefreshToken.destroy.mockResolvedValue(1);

      const result = await destroyByToken('abc123');

      expect(RefreshToken.destroy).toHaveBeenCalledWith({ where: { token: 'abc123' } });
      expect(result).toBe(1);
    });
  });

  describe('findTokenByToken', () => {
    it('should call RefreshToken.findOne with correct where clause and return token', async () => {
      const mockToken = { id: 1, user_id: 5, token: 'abc123' };
      RefreshToken.findOne.mockResolvedValue(mockToken);

      const result = await findTokenByToken('abc123');

      expect(RefreshToken.findOne).toHaveBeenCalledWith({ where: { token: 'abc123' } });
      expect(result).toEqual(mockToken);
    });
  });
});
