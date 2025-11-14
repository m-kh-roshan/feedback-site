const {
  insert,
  getFeature,
  getFeatures,
  update,
  destroy,
  voteFeature,
  getVoters
} = require('../../services/featureServices');

const { User, Feature, Op, sequelize, Sequelize } = require('../../models');

jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn()
  },
  Feature: {
    create: jest.fn(),
    update: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn()
  },
  Op: {
    or: Symbol('or'),
    like: Symbol('like')
  },
  sequelize: {
    fn: jest.fn(),
    col: jest.fn(),
    literal: jest.fn()
  },
  Sequelize: {
    literal: jest.fn()
  }
}));

describe('featureService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('insert', () => {
    it('should insert feature and add to user voted features', async () => {
      const mockFeature = { id: 1 };
      const mockUser = { addVotedFeature: jest.fn() };
      Feature.create.mockResolvedValue(mockFeature);
      User.findByPk.mockResolvedValue(mockUser);

      const result = await insert('Title', 'Doc', 1, 'Category', 'Body');

      expect(Feature.create).toHaveBeenCalledWith({
        title: 'Title',
        document: 'Doc',
        user_id: 1,
        category: 'Category',
        body: 'Body'
      });
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.addVotedFeature).toHaveBeenCalledWith(mockFeature);
      expect(result).toEqual(mockFeature);
    });
  });

  describe('update', () => {
    it('should call Feature.update with correct parameters', async () => {
      Feature.update.mockResolvedValue([1]);
      const result = await update(1, 'New Title', 'active', 'Doc', 'Cat', 'Body');

      expect(Feature.update).toHaveBeenCalledWith(
        { title: 'New Title', status: 'active', document: 'Doc', category: 'Cat', body: 'Body' },
        { where: { id: 1 } }
      );
      expect(result).toEqual([1]);
    });
  });

  describe('getFeature', () => {
    it('should call Feature.findByPk with correct attributes', async () => {
      const mockFeature = { id: 1 };
      Feature.findByPk.mockResolvedValue(mockFeature);

      const result = await getFeature(1);

      expect(Feature.findByPk).toHaveBeenCalled();
      expect(result).toEqual(mockFeature);
    });
  });

  describe('getFeatures', () => {
    it('should call Feature.findAll and return features', async () => {
      const mockFeatures = [{ id: 1 }];
      Feature.findAll.mockResolvedValue(mockFeatures);

      const result = await getFeatures('search', 'active', 'top', 'Category', 1);

      expect(Feature.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockFeatures);
    });
  });

  describe('destroy', () => {
    it('should call Feature.destroy with correct id', async () => {
      Feature.destroy.mockResolvedValue(1);
      const result = await destroy(1);
      expect(Feature.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(1);
    });
  });

  describe('voteFeature', () => {
    it('should vote and unvote feature correctly', async () => {
      const mockUser = {
        hasVotedFeature: jest.fn().mockResolvedValue(false),
        addVotedFeature: jest.fn(),
        removeVotedFeature: jest.fn()
      };
      const mockFeature = {
        countVoters: jest.fn().mockResolvedValue(5)
      };

      User.findByPk.mockResolvedValue(mockUser);
      Feature.findByPk.mockResolvedValue(mockFeature);

      const result = await voteFeature(1, 2);

      expect(mockUser.hasVotedFeature).toHaveBeenCalledWith(mockFeature);
      expect(mockUser.addVotedFeature).toHaveBeenCalledWith(mockFeature);
      expect(result).toEqual({ status: 'voted', totalVotes: 5 });
    });
  });

  describe('getVoters', () => {
    it('should return voters of a feature', async () => {
      const mockFeature = {
        getVoters: jest.fn().mockResolvedValue([{ id: 1, username: 'user1' }])
      };
      Feature.findByPk.mockResolvedValue(mockFeature);

      const result = await getVoters(1);

      expect(mockFeature.getVoters).toHaveBeenCalledWith({
        attributes: ['id', 'username'],
        through: { attributes: [] }
      });
      expect(result).toEqual([{ id: 1, username: 'user1' }]);
    });
  });
});
