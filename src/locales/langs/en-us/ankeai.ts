import { Descriptions } from "antd";
import { create } from "domain";

const ankeAI: AnkeAI.I18n.Schema = {
  lang: "en-US", // 修改这里
  translation: {
    userName: "User Name",
    userPhone: "Phone Number",
    userRole: "User Role",
    userStatus: "User Status",
    userPassword: "Password",
    createdAt: "Created At",
    updatedAt: "Updated At",

    users: {
      username: "User Name",
      phone: "Phone Number",
      role: "User Role",
      status: "User Status",
      mobile: "Phone Number",
      email: "Email",
      quotaLimit: "Quota Limit",
      membershiplevel: "Membership Level",
      tokenUsage: "Used Quota",
      quotaRemain: "Remaining Quota",
      userGroup: "User Group",
      expireDate: "Expiration Date",
      createTime: "Create Time",
      updateTime: "Update Time",
      operation: "Operation",
    },

    userGroups: {
      title: "User Groups",
      name: "Name",
      description: "Description",
      status: "Status",
      users: "Users",
      createdAt: "Created At",
      updatedAt: "Updated At",
      operation: "Operation",
    },

    agents: {
      name: "Agent Name",
      Description: "Description",
      apiKey: "API Key",
      externalId: "External ID",
      status: "Status",
      metadata: "Metadata",
      chat: "Chat",
    },
  },
};
export default ankeAI;
