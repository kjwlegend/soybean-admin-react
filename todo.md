# Admin Web Implementation Todo

## Phase 1: Core API Integration & Type Definitions (High Priority)

### 1. API Type Definitions
- [ ] **Update API Types** (`src/service/request/types.ts`)
  - [ ] Add Project interface (id, title, description, created_by, last_updated, member_count)
  - [ ] Add ProjectMembership interface (user, role, joined_at, is_active)
  - [ ] Add AgentGroup interface (id, name, icon, sort_order, description, agent_count)
  - [ ] Add FileStorage interface (id, filename, original_name, file_size, upload_date, access_level)
  - [ ] Update Agent interface to include agent_group_id, markdown_content
  - [ ] Update Conversation interface to include pinned, project_id
  - [ ] Add SystemTaskConfig interface for new config fields

### 2. API Service Layer
- [ ] **Project API Services** (`src/service/api/anke-project.ts`)
  - [ ] fetchProjectList() - Get all projects with pagination and search
  - [ ] createProject(data) - Create new project (admin only)
  - [ ] updateProject(id, data) - Update project details (admin only)
  - [ ] deleteProject(id) - Delete project (admin only)
  - [ ] fetchProjectMembers(id) - Get project members
  - [ ] addProjectMember(id, userId, role) - Add user to project (admin only)
  - [ ] removeProjectMember(id, userId) - Remove user from project (admin only)
  - [ ] fetchUserProjects() - Get current user's projects

- [ ] **Agent Group API Services** (`src/service/api/anke-agent-group.ts`)
  - [ ] fetchAgentGroupList() - Get all agent groups with sorting
  - [ ] createAgentGroup(data) - Create new agent group (admin only)
  - [ ] updateAgentGroup(id, data) - Update agent group (admin only)
  - [ ] deleteAgentGroup(id) - Delete agent group (admin only)
  - [ ] reorderAgentGroups(orderData) - Update sort order (admin only)

- [ ] **File Storage API Services** (`src/service/api/anke-file-storage.ts`)
  - [ ] fetchFileList(filters) - Get files with filtering
  - [ ] uploadFile(file, projectId) - Upload file with project binding
  - [ ] downloadFile(id) - Download file with permission check
  - [ ] deleteFile(id) - Delete file (owner only)

- [ ] **Update Existing Services**
  - [ ] Update `src/service/api/anke-agent.ts` to include group filtering and markdown content
  - [ ] Update `src/service/api/anke-conversation.ts` to include pinning and project filtering
  - [ ] Update `src/service/api/anke-system-config.ts` for task configuration fields

## Phase 2: Project Management Interface (High Priority)

### 1. Project Management Page
- [ ] **Main Project Page** (`src/pages/(base)/anke-projects/index.tsx`)
  - [ ] Create project list table with columns: title, description, member_count, last_updated, actions
  - [ ] Implement search and filter functionality
  - [ ] Add pagination with useTable hook
  - [ ] Include create/edit/delete operations (admin only)
  - [ ] Add member management button for each project

- [ ] **Project Operation Drawer** (`src/pages/(base)/anke-projects/modules/ProjectOperateDrawer.tsx`)
  - [ ] Create form with fields: title (required), description (TextArea)
  - [ ] Form validation with proper error messages
  - [ ] Support both create and edit modes
  - [ ] Integration with project API services

- [ ] **Project Search Component** (`src/pages/(base)/anke-projects/modules/ProjectSearch.tsx`)
  - [ ] Search by title and description
  - [ ] Filter by creation date range
  - [ ] Filter by member count
  - [ ] Reset functionality

- [ ] **User Assignment Modal** (`src/pages/(base)/anke-projects/modules/UserAssignmentModal.tsx`)
  - [ ] Display current project members in table
  - [ ] Add user selection dropdown (available AnkeAI users)
  - [ ] Role selection (admin, member)
  - [ ] Remove user functionality
  - [ ] Bulk operations for user management

## Phase 3: Agent Group Management (High Priority)

### 1. Agent Group Management Page
- [ ] **Main Agent Group Page** (`src/pages/(base)/anke-agent-groups/index.tsx`)
  - [ ] Create agent group list with drag-and-drop sorting
  - [ ] Table columns: sort_order, name, icon (rendered), description, agent_count, actions
  - [ ] Implement create/edit/delete operations (admin only)
  - [ ] Add reorder functionality with visual feedback

- [ ] **Agent Group Operation Drawer** (`src/pages/(base)/anke-agent-groups/modules/AgentGroupOperateDrawer.tsx`)
  - [ ] Form fields: name (required), description (TextArea), icon selection
  - [ ] Icon picker integration with FontAwesome icons
  - [ ] Form validation and error handling
  - [ ] Preview of selected icon

- [ ] **Icon Picker Modal** (`src/pages/(base)/anke-agent-groups/modules/IconPickerModal.tsx`)
  - [ ] Display grid of FontAwesome icons
  - [ ] Search functionality for icons
  - [ ] Category filtering (solid, regular, brands, etc.)
  - [ ] Preview selected icon
  - [ ] Save icon selection to form

- [ ] **Group Sort Modal** (`src/pages/(base)/anke-agent-groups/modules/GroupSortModal.tsx`)
  - [ ] Drag-and-drop interface for reordering
  - [ ] Visual feedback during drag operations
  - [ ] Save new order to backend
  - [ ] Reset to original order option

## Phase 4: Enhanced Existing Components (Medium Priority)

### 1. Enhanced Agent Management
- [ ] **Update Agent Operation Drawer** (`src/pages/(base)/anke-agents/modules/AgentOperateDrawer.tsx`)
  - [ ] Add agent group selection dropdown
  - [ ] Add markdown content editor with preview
  - [ ] Integrate WYSIWYG editor (rich text editor)
  - [ ] Add markdown/HTML toggle view
  - [ ] Form validation for new fields

- [ ] **Update Agent List Page** (`src/pages/(base)/anke-agents/index.tsx`)
  - [ ] Add agent group filter
  - [ ] Display agent group in table
  - [ ] Group agents by group in display

### 2. Enhanced Conversation Management
- [ ] **Update Conversation List** (`src/pages/(base)/anke-conversation/index.tsx`)
  - [ ] Add pinned status column with pin icon
  - [ ] Sort pinned conversations to top
  - [ ] Add project filter dropdown
  - [ ] Add bulk pinning operations

- [ ] **Add Conversation Controls** (`src/pages/(base)/anke-conversation/modules/`)
  - [ ] Pin/unpin toggle button
  - [ ] Project selection for conversation
  - [ ] Owner-only edit controls

### 3. File Storage Management
- [ ] **File Storage Page** (`src/pages/(base)/anke-file-storage/index.tsx`)
  - [ ] File list table with columns: filename, size, upload_date, access_level, actions
  - [ ] File upload area with drag-and-drop
  - [ ] File type and size restrictions
  - [ ] Download and delete functionality
  - [ ] Project-based file filtering

## Phase 5: Reusable UI Components (Medium Priority)

### 1. Core Components
- [ ] **Markdown Editor** (`src/components/MarkdownEditor.tsx`)
  - [ ] Rich text editor with markdown support
  - [ ] Preview mode toggle
  - [ ] Toolbar with formatting options
  - [ ] Image upload integration
  - [ ] HTML/Markdown view switching

- [ ] **Icon Picker Component** (`src/components/IconPicker.tsx`)
  - [ ] Reusable icon selection component
  - [ ] FontAwesome integration
  - [ ] Search and filtering
  - [ ] Category organization

- [ ] **File Upload Component** (`src/components/FileUpload.tsx`)
  - [ ] Drag-and-drop file upload
  - [ ] Progress indicators
  - [ ] File type validation
  - [ ] Multiple file support
  - [ ] Upload preview

- [ ] **User Selector Component** (`src/components/UserSelector.tsx`)
  - [ ] Multi-select user dropdown
  - [ ] Search functionality
  - [ ] User avatar display
  - [ ] Selected users list

- [ ] **Drag Sort Component** (`src/components/DragSort.tsx`)
  - [ ] Generic drag-and-drop sorting
  - [ ] Visual feedback during dragging
  - [ ] Configurable item rendering
  - [ ] Save order callback

### 2. Enhanced Form Components
- [ ] **Project Form Fields** (`src/components/forms/ProjectFormFields.tsx`)
  - [ ] Reusable project form fields
  - [ ] Validation rules
  - [ ] Member assignment integration

## Phase 6: Routing & Navigation (Low Priority)

### 1. Route Configuration
- [ ] **Add New Routes** (Auto-generated by elegant-router)
  - Routes will be auto-discovered based on file structure
  - No manual route configuration needed

### 2. Menu Updates
- [ ] **Update Menu Locales** (`src/locales/langs/*/route.ts`)
  - [ ] Add "Project Management" menu item
  - [ ] Add "Agent Groups" menu item  
  - [ ] Add "File Storage" menu item
  - [ ] Update existing AnkeAI menu structure

## Phase 7: Localization & UI Polish (Low Priority)

### 1. Internationalization
- [ ] **English Translations** (`src/locales/langs/en-us/ankeai.ts`)
  - [ ] Add all project-related translations
  - [ ] Add agent group translations
  - [ ] Add file storage translations
  - [ ] Add form labels and validation messages

- [ ] **Chinese Translations** (`src/locales/langs/zh-cn/ankeai.ts`)
  - [ ] Translate all new UI text to Chinese
  - [ ] Maintain consistency with existing translations

### 2. UI/UX Enhancements
- [ ] **Responsive Design**
  - [ ] Ensure all new components work on mobile
  - [ ] Optimize table layouts for smaller screens
  - [ ] Test drag-and-drop on touch devices

- [ ] **Loading States**
  - [ ] Add skeleton loading for all tables
  - [ ] Upload progress indicators
  - [ ] Form submission loading states

- [ ] **Error Handling**
  - [ ] Comprehensive error messages
  - [ ] Retry mechanisms for failed operations
  - [ ] User-friendly error displays

## Dependencies to Add

### 1. Package Installations
```bash
pnpm add @uiw/react-md-editor          # Markdown editor with preview
pnpm add react-beautiful-dnd           # Drag and drop functionality  
pnpm add @ant-design/icons             # Additional icons
pnpm add react-dropzone                # File upload handling
pnpm add @fortawesome/react-fontawesome # FontAwesome icons
pnpm add @fortawesome/free-solid-svg-icons
pnpm add @fortawesome/free-regular-svg-icons
```

### 2. Type Definitions
```bash
pnpm add -D @types/react-beautiful-dnd # TypeScript support for DnD
```

## Specific Files to Create

### New Page Files:
- `src/pages/(base)/anke-projects/index.tsx`
- `src/pages/(base)/anke-projects/modules/ProjectOperateDrawer.tsx`
- `src/pages/(base)/anke-projects/modules/ProjectSearch.tsx`
- `src/pages/(base)/anke-projects/modules/UserAssignmentModal.tsx`
- `src/pages/(base)/anke-agent-groups/index.tsx`
- `src/pages/(base)/anke-agent-groups/modules/AgentGroupOperateDrawer.tsx`
- `src/pages/(base)/anke-agent-groups/modules/IconPickerModal.tsx`
- `src/pages/(base)/anke-agent-groups/modules/GroupSortModal.tsx`
- `src/pages/(base)/anke-file-storage/index.tsx`

### New Component Files:
- `src/components/MarkdownEditor.tsx`
- `src/components/IconPicker.tsx`
- `src/components/FileUpload.tsx`
- `src/components/UserSelector.tsx`
- `src/components/DragSort.tsx`

### New Service Files:
- `src/service/api/anke-project.ts`
- `src/service/api/anke-agent-group.ts`
- `src/service/api/anke-file-storage.ts`

### Files to Update:
- `src/service/api/anke-agent.ts`
- `src/service/api/anke-conversation.ts`
- `src/service/api/anke-system-config.ts`
- `src/service/request/types.ts`
- `src/pages/(base)/anke-agents/modules/AgentOperateDrawer.tsx`
- `src/pages/(base)/anke-conversation/index.tsx`
- `src/locales/langs/en-us/ankeai.ts`
- `src/locales/langs/zh-cn/ankeai.ts`
- `src/locales/langs/en-us/route.ts`
- `src/locales/langs/zh-cn/route.ts`

## Implementation Priority Order:

### Week 1-2: Foundation
1. API type definitions and service layer
2. Project management CRUD interface
3. Basic reusable components (UserSelector, FileUpload)

### Week 3-4: Core Features  
4. Agent Group management with drag-and-drop
5. Enhanced Agent management with markdown editor
6. File storage management interface

### Week 5-6: Enhancements
7. Conversation pinning and project integration
8. Advanced UI components (IconPicker, DragSort)
9. Localization and UI polish

## Testing Checklist:
- [ ] Test all CRUD operations for each feature
- [ ] Verify permission-based UI controls (admin-only features)
- [ ] Test drag-and-drop functionality across browsers
- [ ] Validate file upload with different file types and sizes
- [ ] Test responsive design on mobile devices
- [ ] Verify localization works correctly
- [ ] Test error handling scenarios

## Notes:
- Follow existing Soybean Admin patterns for consistency
- Use Ant Design components throughout
- Maintain TypeScript strict mode compliance
- Ensure all new features integrate with existing authentication
- Test performance with large datasets
- Follow accessibility guidelines for all new UI components