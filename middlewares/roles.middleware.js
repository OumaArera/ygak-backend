const { mappings } = require('../utils/rolePermissions');

function authorizeRoles(allowedDesignations = [], allowedRoles = []) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: No user context' });
    }

    const { designation, role } = user;

    // Superuser bypass
    if (role === 'Superuser') {
      return next();
    }

    // Check designation
    if (allowedDesignations.length && !allowedDesignations.includes(designation)) {
      return res.status(403).json({ message: 'Forbidden: Designation not allowed' });
    }

    // Check role
    if (allowedRoles.length && !allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden: Role not allowed' });
    }

    next();
  };
}

function authorizeRolesFromMapping(mappingKey) {
  const permission = mappings[mappingKey];

  if (!permission) {
    throw new Error(`Permission mapping '${mappingKey}' not found`);
  }

  return authorizeRoles(permission.designations, permission.roles);
}

module.exports = { authorizeRoles, authorizeRolesFromMapping };
