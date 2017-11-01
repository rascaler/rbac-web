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
    GET_PRIVILEGES: 'privilege/getPrivileges',
    PAGE_PRIVILEGES: 'privilege/pagePrivileges',
    SAVE: 'privilege/save',
    UPDATE: 'privilege/update',
    DELETE: 'privilege/delete',
    GET_EDIT_DETAIL: 'privilege/getEditDetail'
  },
  MENU: {
    GET_APP_MENUS: 'menu/getAppMenus',
    GET_MENU_TREE: 'menu/getMenuTree',
    PAGE_MENUS: 'menu/pageMenus',
    SAVE: 'menu/save',
    UPDATE: 'menu/update',
    REMOVE: 'menu/remove',
    GET_EDIT_DETAIL: 'menu/getEditDetail'
  },
  APP: {
    GET_ALL: 'app/getAll'
  }
}
export default API_URL
