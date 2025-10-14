const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Blog = sequelize.define(
  'Blog',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    excerpt: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Short summary or preview of the blog content',
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Category or topic (e.g., Technology, Health, Finance)',
    },

    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL or file path to the blog cover image',
    },

    paragraphs: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'An array of objects: [{ type, content, order }]',
    },

    sources: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Array of sources or references used in the blog',
    },

    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'blogs',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Blog;
