const API_URL = {
  EXAMPLE: 'static/user.json',
  USER: {
    PAGE_USERS: 'user/pageUsers',
    SAVE_OR_UPDATE: 'user/saveOrUpdate',
    DETAIL: 'user/detail'
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
    GET_USER_ROLES: 'role/getUserRoles'
  }
}
export default API_URL
