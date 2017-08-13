const API_URL = {
  EXAMPLE: 'static/user.json',
  USER: {
    PAGE_USERS: 'user/pageUsers',
    SAVE: 'user/save',
    UPDATE: 'user/update',
    DETAIL: 'user/detail',
    LEAVE: 'user/leave',
    UPDATE_STATE: 'user/updateState'
  },
  ORGANIZATION: {
    GET_ORG_TREE: 'organization/getOrgTree',
    SAVE_OR_UPDATE: 'organization/saveOrUpdate',
    REMOVE: 'organization/remove',
    DETAIL: 'organization/detail'
  },
  ROLE: {
    GET_ALL: 'role/getAll',
    GET_ORGANIZATION_ROLES: 'role/getOrganizationRoles',
    GET_USER_ROLES: 'role/getUserRoles',
    PAGE_ROLE: 'role/pageRoles',
    GET_ROLES: 'role/getRoles',
    UPDATE_STATE: 'role/updateState',
    EDIT_DETAIL: 'role/editDetail',
    SAVE: 'role/save',
    UPDATE: 'role/update',
    DELETE: 'role/delete'
  },
  PRIVILEGE: {
    GET_PRIVILEGES: 'privilege/getPrivileges'
  }
}
export default API_URL
