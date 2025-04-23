declare namespace Api {
  /**
   * namespace AnkeAI
   *
   * backend api module: "anke"
   */
  namespace AnkeAI {
    /** User Management */
    type User = Common.CommonRecord<{
      /** user id */
      id: number;
      /** user name */
      username: string;
      password: string; // not return in list dat
      /** user mobile */
      mobile?: string;
      /** user email */
      email?: string;
      /** user avatar */
      avatar?: string;
      /** user status */
      is_active: boolean;
      /** membership level */
      membership_level: string;
      /** expire date */
      expire_date?: string | any;
      /** token usage */
      token_usage: number;
      /** quota limit */
      quota_limit: number;
      /** user group id */
      user_group_id?: number;
      /** user group name */
      user_group_name?: string;
      /** user created time */
      created_at: string;
      /** user updated time */
      updated_at: string;
    }>;

    /** User Create Params */
    interface UserCreateParams {
      /** user name */
      username: string;
      /** password */
      password: string;
      /** mobile */
      mobile?: string;
      /** email */
      email?: string;
      /** membership level */
      membership_level?: string;

      expire_date?: string | null;

      /** quota limit */
      quota_limit?: number;
      /** user group id */
      user_group_id?: number;
    }

    /** User Update Params */
    interface UserUpdateParams {
      /** user name */
      username?: string;
      /** mobile */
      mobile?: string;
      /** email */
      email?: string;
      /** avatar */
      avatar?: string;
      /** user status */
      is_active?: boolean;
      /** membership level */
      membership_level?: string;
      /** expire date */
      expire_date?: string | null;
      /** quota limit */
      quota_limit?: number;
      /** user group id */
      user_group_id?: number;
    }

    /** User Search Params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<AnkeAI.User, "username" | "email" | "is_active"> & {
        role?: string;
      } & Common.CommonSearchParams
    >;

    /** User List Response */
    type UserList = Common.PaginatingQueryRecord<User>;

    type UserGroup = Common.CommonRecord<{
      id: number;
      name: string;
      description?: string;
      agent_ids: number[];
      agents?: Array<{
        id: number;
        name: string;
      }>;
      created_at: string;
      updated_at: string;
    }>;

    type UserGroupCreateParams = {
      name: string;
      description?: string;
      agent_ids?: number[];
    };

    type UserGroupUpdateParams = {
      name?: string;
      description?: string;
      agent_ids?: number[];
    };

    type UserGroupSearchParams = {
      name?: string;
      description?: string;
    } & Common.CommonSearchParams;

    type UserGroupList = Common.PaginatingQueryRecord<UserGroup>;

    type status = "active" | "inactive";
    /** Agent Management */
    type Agent = Common.CommonRecord<{
      /** agent id */
      id: number;
      /** agent name */
      name: string;
      /** agent description */
      description?: string;

      type: string;
      /** agent api key */
      api_key: string;
      /** external id */
      external_id?: string;
      /** metadata */
      metadata?: Record<string, any>;
      /** last synced time */
      last_synced?: string;
      /** user groups */
      user_groups?: Array<Record<string, any>>;
      /** agent created time */
      created_at: string;
      /** agent updated time */
      updated_at: string;
    }>;

    /** Agent Create Params */
    interface AgentCreateParams {
      /** agent name */
      name: string;
      /** agent description */
      description?: string;
      /** agent status */
      status?: string | null;

      type: string;
      /** agent api key */
      api_key: string;
      /** external id */
      external_id?: string;
      /** metadata */
      metadata?: Record<string, any>;
      /** user group ids */
      user_group_ids?: number[];
    }

    /** Agent Update Params */
    interface AgentUpdateParams {
      /** agent name */
      name?: string;
      /** agent description */
      description?: string;
      /** agent status */
      status?: string | null;
      api_key?: string;
      /** external id */
      external_id?: string;
      /** metadata */
      /** metadata */
      metadata?: Record<string, any>;
      /** user group ids */
      user_group_ids?: number[];
    }

    /** Agent Search Params */
    interface AgentSearchParams extends Common.CommonSearchParams {
      /** agent name */
      name?: string;
      /** agent status */
      status?: string;
    }

    /** Agent List Response */
    type AgentList = Common.PaginatingQueryRecord<Agent>;

    /** Conversation Management */
    type ConversationType = "chat" | "workflow";

    /** Conversation Model */
    type Conversation = Common.CommonRecord<{
      /** conversation id */
      id: number;
      /** user id */
      user_id: number;
      /** agent id */
      agent_id: number;
      /** agent name */
      agent_name?: string;
      /** conversation type */
      conversation_type: ConversationType;
      /** external conversation id */
      external_conversation_id?: string;
      user_username: string;

      title: string;
      /** is archived */
      is_archived: boolean;
      /** metadata */
      metadata?: Record<string, any>;
      /** last message */
      last_message?: string;
      /** message count */
      message_count?: number;
      /** conversation created time */
      created_at: string;
      /** conversation updated time */
      updated_at: string;
    }>;

    /** Message Model */
    type Message = Common.CommonRecord<{
      /** message id */
      id: number;
      /** conversation id */
      conversation_id: number;
      /** content */
      content: string;
      /** role: user or assistant */
      role: "user" | "assistant";
      /** token count */
      token_count?: number;
      /** external message id */
      external_message_id?: string;
      /** metadata */
      metadata?: Record<string, any>;
      /** message created time */
      created_at: string;
    }>;

    /** Conversation Search Params */
    interface ConversationSearchParams extends Common.CommonSearchParams {
      /** conversation type filter */
      conversation_type?: ConversationType;
      /** is archived filter */
      is_archived?: boolean;
    }

    /** Conversation List Response */
    type ConversationList = Common.PaginatingQueryRecord<Conversation>;

    /** Conversation Detail Response */
    type ConversationDetail = Conversation;

    /** Message List Response */
    type MessageList = Common.PaginatingQueryRecord<Message>;

    /** Chat Input */
    interface ChatInput {
      /** query text */
      query: string;
      /** conversation id */
      conversation_id?: string;
      /** inputs */
      inputs?: Record<string, any>;
      /** files */
      files?: any[];
    }

    /** Workflow Input */
    interface WorkflowInput {
      /** inputs */
      inputs: Record<string, any>;
      /** files */
      files?: any[];
    }
  }
}
