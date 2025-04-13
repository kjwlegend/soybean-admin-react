/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** page page number */
      page: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      items: T[];
    }

    type CommonSearchParams = Pick<
      Common.PaginatingCommonParams,
      "page" | "size"
    >;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = "1" | "2";

    /** common record */
    type CommonRecord<T = any> = {
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record id */
      id: number;
      /** record status */
      status: EnableStatus | null;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
    } & T;
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      refresh_token: string;
      access_token: string;
    }

    interface UserInfo {
      buttons: string[];
      roles: string[];
      role: object;
      role_id: number;
      id: string;
      username: string;
      email: string;
      is_superuser: boolean;
    }

    type Info = {
      token: LoginToken["access_token"];
      userInfo: UserInfo;
    };
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute =
      import("@soybean-react/vite-plugin-react-router").ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      home: import("@soybean-react/vite-plugin-react-router").LastLevelRouteKey;
      routes: string[];
    }
  }

  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    type CommonSearchParams = Pick<
      Common.PaginatingCommonParams,
      "page" | "size"
    >;

    /** role */
    type Role = Common.CommonRecord<{
      /** role code */
      id: number;
      /** role description */
      description: string;
      /** role name */
      name: string;
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, "id" | "description" | "name"> &
        CommonSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role */
    type AllRole = Pick<Role, "id" | "description" | "name">;

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = "1" | "2";

    /** user */
    type User = Common.CommonRecord<{
      /** user nick name */
      nickName: string;
      /** user email */
      email: string;
      /** user gender */
      is_active: boolean;
      /** user name */
      userName: string;
      /** user phone */
      mobile: string;
      /** user role code collection */
      userRoles: string[];
      password: string;
      id: number;
    }>;

    type UserCreateParams = {
      nickName: string;
      userName: string;
      password: string;
      email: string;
      is_active: boolean;
      mobile: string;
    };

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<
        Api.SystemManage.User,
        "nickName" | "status" | "email" | "is_active" | "userName" | "mobile"
      > &
        CommonSearchParams
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /**
     * menu type
     *
     * - "1": directory
     * - "2": menu
     */
    type MenuType = "1" | "2";

    type MenuButton = {
      /**
       * button code
       *
       * it can be used to control the button permission
       */
      code: string;
      /** button description */
      desc: string;
    };

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = "1" | "2";

    type MenuPropsOfRoute = Pick<
      import("@soybean-react/vite-plugin-react-router").RouteMeta,
      | "activeMenu"
      | "constant"
      | "fixedIndexInTab"
      | "hideInMenu"
      | "href"
      | "i18nKey"
      | "keepAlive"
      | "multiTab"
      | "order"
      | "query"
    >;

    type Menu = Common.CommonRecord<{
      /** buttons */
      buttons?: MenuButton[] | null;
      /** children menu */
      children?: Menu[] | null;
      /** component */
      component?: string;
      /** iconify icon name or local icon name */
      icon: string;
      /** icon type */
      iconType: IconType;
      /** menu name */
      menuName: string;
      /** menu type */
      menuType: MenuType;
      /** parent menu id */
      parentId: number;
      /** route name */
      routeName: string;
      /** route path */
      routePath: string;
    }> &
      MenuPropsOfRoute;

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    type MenuTree = {
      children?: MenuTree[];
      id: number;
      label: string;
      pId: number;
    };

    /** 系统配置项 */
    type ConfigItem = Common.CommonRecord<{
      id: number;
      key: string;
      value: string;
      description: string;
    }>;
    /** 系统配置搜索参数 */
    type ConfigSearchParams = CommonType.RecordNullable<
      Pick<ConfigItem, "key" | "value" | "status"> & CommonSearchParams
    >;

    /** 系统配置列表 */
    type ConfigList = Common.PaginatingQueryRecord<ConfigItem>;
  }
}
