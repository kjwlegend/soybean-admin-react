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
      logo_url?: string;
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
      order: number;
      /** external id */
      external_id?: string;
      /** metadata */
      metadata?: Record<string, any>;
      /** markdown content */
      markdown_content?: string;
      /** agent group id */
      agent_group_id?: number;
      /** agent group info */
      agent_group?: {
        id: number;
        name: string;
        icon?: string;
        sort_order: number;
      };
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
      /** markdown content */
      markdown_content?: string;
      /** agent group id */
      agent_group_id?: number;
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
      metadata?: Record<string, any>;
      /** markdown content */
      markdown_content?: string;
      /** agent group id */
      agent_group_id?: number;
      /** user group ids */
      user_group_ids?: number[];
    }

    /** Agent Search Params */
    interface AgentSearchParams extends Common.CommonSearchParams {
      /** agent name */
      name?: string;
      /** agent status */
      status?: string;
      /** agent group id */
      agent_group_id?: number;
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
      /** is pinned */
      pinned?: boolean;
      /** project id */
      project_id?: number;
      /** project info */
      project?: {
        id: number;
        title: string;
      };
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
      /** project id filter */
      project_id?: number;
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

    /** Project Management */
    type Project = Common.CommonRecord<{
      /** project id */
      id: number;
      /** project title */
      title: string;
      /** project description */
      description?: string;
      /** last updated time */
      last_updated: string;
      /** created by admin */
      created_by: {
        id: number;
        username: string;
        nickname?: string;
      };
      /** member count */
      member_count: number;
      /** project created time */
      created_at: string;
      /** project updated time */
      updated_at: string;
    }>;

    /** Project Create Params */
    interface ProjectCreateParams {
      /** project title */
      title: string;
      /** project description */
      description?: string;
    }

    /** Project Update Params */
    interface ProjectUpdateParams {
      /** project title */
      title?: string;
      /** project description */
      description?: string;
    }

    /** Project Search Params */
    interface ProjectSearchParams extends Common.CommonSearchParams {
      /** project title */
      title?: string;
    }

    /** Project List Response */
    type ProjectList = Common.PaginatingQueryRecord<Project>;

    /** Project Membership */
    type ProjectMembership = Common.CommonRecord<{
      /** membership id */
      id: number;
      /** project id */
      project_id: number;
      /** user id */
      user_id: number;
      /** member role */
      role: "admin" | "member";
      /** is active */
      is_active: boolean;
      /** joined time */
      joined_at: string;
      /** user info */
      user: {
        id: number;
        username: string;
        email?: string;
        avatar?: string;
        membership_level: string;
      };
      /** added by admin */
      added_by: {
        id: number;
        username: string;
        nickname?: string;
      };
    }>;

    /** Project Membership Create Params */
    interface ProjectMembershipCreateParams {
      /** user id */
      user_id: number;
      /** member role */
      role?: "admin" | "member";
    }

    /** Project Membership Update Params */
    interface ProjectMembershipUpdateParams {
      /** member role */
      role?: "admin" | "member";
      /** is active */
      is_active?: boolean;
    }

    /** Project Membership List Response */
    type ProjectMembershipList = Common.PaginatingQueryRecord<ProjectMembership>;

    /** Agent Group Management */
    type AgentGroup = Common.CommonRecord<{
      /** agent group id */
      id: number;
      /** group name */
      name: string;
      /** group description */
      description?: string;
      /** FontAwesome icon name */
      icon?: string;
      /** sort order */
      sort_order: number;
      /** is active */
      is_active: boolean;
      /** agent count */
      agent_count: number;
      /** created by admin */
      created_by?: {
        id: number;
        username: string;
        nickname?: string;
      };
      /** associated projects */
      projects?: Project[];
      /** project count */
      project_count?: number;
      /** group created time */
      created_at: string;
      /** group updated time */
      updated_at: string;
    }>;

    /** Agent Group Create Params */
    interface AgentGroupCreateParams {
      /** group name */
      name: string;
      /** group description */
      description?: string;
      /** FontAwesome icon name */
      icon?: string;
      /** sort order */
      sort_order?: number;
    }

    /** Agent Group Update Params */
    interface AgentGroupUpdateParams {
      /** group name */
      name?: string;
      /** group description */
      description?: string;
      /** FontAwesome icon name */
      icon?: string;
      /** sort order */
      sort_order?: number;
      /** is active */
      is_active?: boolean;
    }

    /** Agent Group Reorder Request */
    interface AgentGroupReorderParams {
      /** group orders */
      group_orders: Array<{
        id: number;
        sort_order: number;
      }>;
    }

    /** Agent Group List Response */
    type AgentGroupList = Common.PaginatingQueryRecord<AgentGroup>;

    /** File Storage Management */
    type FileAccessLevel = "private" | "project" | "public";

    type FileType = "image" | "document" | "spreadsheet" | "presentation" | "video" | "audio" | "archive" | "text" | "other";

    type FileStorage = Common.CommonRecord<{
      /** file id */
      id: number;
      /** stored filename */
      filename: string;
      /** original filename */
      original_name: string;
      /** file path */
      file_path: string;
      /** file size in bytes */
      file_size: number;
      /** file size in MB */
      file_size_mb: number;
      /** MIME type */
      mime_type?: string;
      /** file type category */
      file_type?: FileType;
      /** file hash */
      file_hash?: string;
      /** access level */
      access_level: FileAccessLevel;
      /** is active */
      is_active: boolean;
      /** download count */
      download_count: number;
      /** upload date */
      upload_date: string;
      /** updated time */
      updated_at: string;
      /** public URL for access */
      public_url?: string;
      /** uploaded by user */
      user: {
        id: number;
        username: string;
        email?: string;
      };
      /** belongs to project */
      project?: {
        id: number;
        title: string;
      };
    }>;

    /** File Upload Params */
    interface FileUploadParams {
      /** original filename */
      original_name: string;
      /** access level */
      access_level?: FileAccessLevel;
      /** project id */
      project_id?: number;
    }

    /** File Update Params */
    interface FileUpdateParams {
      /** access level */
      access_level?: FileAccessLevel;
      /** project id */
      project_id?: number;
    }

    /** File Search Params */
    interface FileSearchParams extends Common.CommonSearchParams {
      /** project id filter */
      project_id?: number;
      /** access level filter */
      access_level?: FileAccessLevel;
    }

    /** File Upload Response */
    interface FileUploadResponse {
      /** file id */
      id: number;
      /** stored filename */
      filename: string;
      /** original filename */
      original_name: string;
      /** file size */
      file_size: number;
      /** file size in MB */
      file_size_mb: number;
      /** access level */
      access_level: FileAccessLevel;
      /** upload date */
      upload_date: string;
      /** download URL */
      download_url: string;
    }

    /** File List Response */
    type FileStorageList = Common.PaginatingQueryRecord<FileStorage>;
  }
}
