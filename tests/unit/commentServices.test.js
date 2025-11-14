const commentService = require('../../services/commentServices');
const { User, Comment, Feature, Sequelize } = require('../../models');

jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn(),
  },
  Comment: {
    create: jest.fn(),
    update: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  },
  Feature: {
    findByPk: jest.fn(),
  },
  Sequelize: {
    literal: jest.fn((v) => v),
  }
}));

describe('commentService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('insertComment', () => {
    it('should insert a comment and return result', async () => {
      const mockComment = { id: 1, body: 'Test comment' };
      Comment.create.mockResolvedValue(mockComment);

      const result = await commentService.insertComment(1, 2, null, 'Test comment');
      expect(Comment.create).toHaveBeenCalledWith({
        user_id: 1,
        feature_id: 2,
        comment_id: null,
        body: 'Test comment'
      });
      expect(result).toEqual(mockComment);
    });
  });

  describe('updateComment', () => {
    it('should call update with correct params', async () => {
      Comment.update.mockResolvedValue([1]);
      const result = await commentService.updateComment(1, 'Updated body');
      expect(Comment.update).toHaveBeenCalledWith(
        { body: 'Updated body' },
        { where: { id: 1 } }
      );
    });
  });

  describe('getComment', () => {
    it('should return comment by id', async () => {
      const mockComment = { id: 1, body: 'Comment body' };
      Comment.findByPk.mockResolvedValue(mockComment);

      const result = await commentService.getComment(1);
      expect(Comment.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockComment);
    });
  });

  describe('getFeatureComments', () => {
    it('should return comments from a feature', async () => {
      const mockComments = [{ id: 1, body: 'c1' }, { id: 2, body: 'c2' }];
      const mockFeature = { getComments: jest.fn().mockResolvedValue(mockComments) };
      Feature.findByPk.mockResolvedValue(mockFeature);

      const result = await commentService.getFeatureComments(10);
      expect(Feature.findByPk).toHaveBeenCalledWith(10);
      expect(mockFeature.getComments).toHaveBeenCalledWith({
        attributes: [
          'id',
          'comment_id',
          'body',
          [expect.any(String), 'likes_count']
        ]
      });
      expect(result).toEqual(mockComments);
    });
  });

  describe('destroyComment', () => {
    it('should destroy comment by id', async () => {
      Comment.destroy.mockResolvedValue(1);
      const result = await commentService.destroyComment(1);
      expect(Comment.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(1);
    });
  });

  describe('likeComment', () => {
    it('should like a comment if not liked', async () => {
      const mockUser = {
        hasLikedComment: jest.fn().mockResolvedValue(false),
        addLikedComment: jest.fn(),
        removeLikedComment: jest.fn()
      };
      const mockComment = { countLikers: jest.fn().mockResolvedValue(5) };
      User.findByPk.mockResolvedValue(mockUser);
      Comment.findByPk.mockResolvedValue(mockComment);

      const result = await commentService.likeComment(1, 2);

      expect(mockUser.hasLikedComment).toHaveBeenCalledWith(mockComment);
      expect(mockUser.addLikedComment).toHaveBeenCalledWith(mockComment);
      expect(result).toEqual({ status: 'liked', totalVotes: 5 });
    });

    it('should unlike a comment if already liked', async () => {
      const mockUser = {
        hasLikedComment: jest.fn().mockResolvedValue(true),
        addLikedComment: jest.fn(),
        removeLikedComment: jest.fn()
      };
      const mockComment = { countLikers: jest.fn().mockResolvedValue(3) };
      User.findByPk.mockResolvedValue(mockUser);
      Comment.findByPk.mockResolvedValue(mockComment);

      const result = await commentService.likeComment(1, 2);

      expect(mockUser.removeLikedComment).toHaveBeenCalledWith(mockComment);
      expect(result).toEqual({ status: 'unliked', totalVotes: 3 });
    });
  });

});
