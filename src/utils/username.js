import User from '../models/User.js';

export const generateUniqueUsername = async (baseName) => {
  let username = baseName.replace(/\s+/g, '').toLowerCase();
  let suffix = 0;

  while (await User.existsByUsername(username + (suffix ? suffix: ''))) {
    suffix = Math.floor(Math.random() * 10000);
  }

  return username + (suffix ? suffix: '');
};
