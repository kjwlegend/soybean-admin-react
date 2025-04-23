import { Suspense, lazy } from "react";
import dayjs from "dayjs";
import {
  TableHeaderOperation,
  useTable,
  useTableOperate,
  useTableScroll,
} from "@/features/table";
import { fetchConversationList } from "@/service/api/anke-conversation";

import ConversationSearch from "./modules/ConversationSearch";

const WorkflowLogDetailDrawer = lazy(() => import("./modules/WorkflowDetail"));

const AnkeConversationLogManage = () => {
  const { t } = useTranslation();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const nav = useNavigate();
  const isMobile = useMobile();
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState<any>(null);

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } =
    useTable(
      {
        apiFn: fetchConversationList,
        apiParams: {
          page: 1,
          size: 10,
          conversation_type: undefined,
          is_archived: undefined,
        },
        columns: () => [
          {
            align: "center",
            dataIndex: "index",
            key: "index",
            title: t("common.index"),
            width: 64,
          },
          {
            align: "center",
            dataIndex: "id",
            key: "id",
            width: 80,
            title: "ID",
          },
          {
            align: "center",
            dataIndex: "title",
            key: "title",
            minWidth: 150,
            title: t("ankeai.conversations.list"),
          },
          {
            align: "center",
            dataIndex: "conversation_type",
            key: "conversation_type",
            width: 120,
            title: t("ankeai.conversations.type"),
          },

          {
            align: "center",
            dataIndex: "user_username",
            key: "user_username",
            width: 120,
            title: t("ankeai.conversations.user"),
          },
          {
            align: "center",
            dataIndex: "agent_name",
            key: "agent_name",
            width: 120,
            title: t("ankeai.conversations.agent"),
            render: (value) => `${value || 0}s`,
          },

          {
            align: "center",
            dataIndex: "created_at",
            key: "created_at",
            title: t("ankeai.createdAt"),
            width: 160,
            render: (value) =>
              value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "-",
          },
          {
            align: "center",
            key: "operate",
            render: (_, record) => (
              <div className="flex-center gap-8px">
                <AButton
                  ghost
                  size="small"
                  type="primary"
                  onClick={() => handleViewDetail(record)}
                >
                  {t("ankeai.view")}
                </AButton>
              </div>
            ),
            title: t("common.operate"),
            width: 100,
          },
        ],
      },
      { showQuickJumper: true },
    );

  const handleViewDetail = (record: any) => {
    setCurrentLog(record);
    setDetailVisible(true);
  };

  const handleCloseDetail = () => {
    setDetailVisible(false);
    setCurrentLog(null);
  };

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <ACollapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : "1"}
        items={[
          {
            children: <ConversationSearch {...searchProps} />,
            key: "1",
            label: t("common.search"),
          },
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t("ankeai.conversations.title")}
        variant="borderless"
        extra={
          <TableHeaderOperation
            columns={columnChecks}
            loading={tableProps.loading}
            disabledDelete={true}
            add={() => {}}
            onDelete={() => {}}
            refresh={run}
            setColumnChecks={setColumnChecks}
          />
        }
      >
        <ATable scroll={scrollConfig} size="small" {...tableProps} />
        <Suspense>
          {detailVisible && (
            <WorkflowLogDetailDrawer
              visible={detailVisible}
              data={currentLog}
              onClose={handleCloseDetail}
            />
          )}
        </Suspense>
      </ACard>
    </div>
  );
};

export default AnkeConversationLogManage;
