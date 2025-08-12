
// Role groups
const roleGroups = {
  BoardMemberGroup: ['Chairman', 'Secretary', 'Treasurer', 'Member'],
  SecretariatGroup: ['CEO', 'Manager', 'Junior', 'Intern'],
  ChapterGroup: ['Chapter Coordinator'],
  ITGroup: ['Superuser']
};

// Permission mappings
const mappings = {
  // ALL USERS
  AllUsers: {
    designations: ['Board Member', 'Secretariat', 'Chapter', 'IT'],
    roles: [
      ...roleGroups.BoardMemberGroup,
      ...roleGroups.SecretariatGroup,
      ...roleGroups.ChapterGroup,
      ...roleGroups.ITGroup
    ]
  },

  // ALL BOARD MEMBERS
  AllBoardMembers: {
    designations: ['Board Member'],
    roles: roleGroups.BoardMemberGroup
  },

  // ALL SECRETARIAT
  AllSecretariat: {
    designations: ['Secretariat'],
    roles: roleGroups.SecretariatGroup
  },

  // CHAPTER
  ChapterCoordinatorAccess: {
    designations: ['Chapter'],
    roles: roleGroups.ChapterGroup
  },

  // BOARD (specific)
  BoardChairmanAccess: {
    designations: ['Board Member'],
    roles: ['Chairman']
  },
  BoardSecretaryAccess: {
    designations: ['Board Member'],
    roles: ['Secretary']
  },
  BoardTreasurerAccess: {
    designations: ['Board Member'],
    roles: ['Treasurer']
  },
  BoardMemberAccess: {
    designations: ['Board Member'],
    roles: roleGroups.BoardMemberGroup
  },

  // SECRETARIAT (specific)
  SecretariatCEOAccess: {
    designations: ['Secretariat'],
    roles: ['CEO']
  },
  SecretariatManagerAccess: {
    designations: ['Secretariat'],
    roles: ['Manager']
  },
  SecretariatJuniorAccess: {
    designations: ['Secretariat'],
    roles: ['Junior']
  },
  SecretariatInternAccess: {
    designations: ['Secretariat'],
    roles: ['Intern']
  },

  // IT
  ITSuperuserAccess: {
    designations: ['IT'],
    roles: ['Superuser']
  }
};

module.exports = { roleGroups, mappings };
