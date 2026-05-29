const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (secret) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }

  return 'local_dev_jwt_secret';
};

module.exports = { getJwtSecret };

