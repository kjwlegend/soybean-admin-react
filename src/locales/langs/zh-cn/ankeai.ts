const ankeAI: AnkeAI.I18n.Schema = {
  lang: "zh-CN",
  translation: {
    userName: "用户名",
    userPhone: "手机号",
    userRole: "用户角色",
    userStatus: "用户状态",
    userPassword: "密码",
    createdAt: "创建时间",
    updatedAt: "更新时间",

    users: {
      username: "用户名",
      phone: "手机号",
      role: "用户角色",
      status: "用户状态",
      mobile: "手机号",
      email: "邮箱",
      quotaLimit: "配额限制",
      tokenUsage: "已使用配额",
      quotaRemain: "剩余配额",
      membershipLevel: "会员等级",
      userGroup: "用户组",
      expireDate: "过期时间",
      createTime: "创建时间",
      updateTime: "更新时间",
      operation: "操作",
    },

    agents: {
      name: "名称",
      description: "描述",
      apiKey: "API密钥",
      externalId: "外部ID",
      status: "状态",
      metadata: "元数据",
      lastSynced: "最后同步时间",
      userGroups: "用户组",
      createTime: "创建时间",
      updateTime: "更新时间",
      operation: "操作",
      forceUpdate: "强制更新",
      sync: "同步",
      syncSuccess: "同步成功",
      addAgent: "添加代理",
      editAgent: "编辑代理",
    },

    userGroups: {
      title: "用户组",
      name: "名称",
      description: "描述",
      status: "状态",
      users: "用户",
      createdAt: "创建时间",
      updatedAt: "更新时间",
      operation: "操作",
      agents: "可用智能体",
    },
    form: {
      name: "请输入名称",
      description: "请输入描述",
      apiKey: "请输入API密钥",
      status: "请选择状态",
      userGroups: "请选择用户组",
    },
  },
};

export default ankeAI;
