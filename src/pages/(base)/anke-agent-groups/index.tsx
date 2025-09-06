import { Suspense, lazy } from "react";
import dayjs from "dayjs";

import { enableStatusRecord } from "@/constants/business";
import {
  TableHeaderOperation,
  useTable,
  useTableOperate,
  useTableScroll,
} from "@/features/table";
import {
  createAgentGroup,
  deleteAgentGroup,
  fetchAgentGroupList,
  updateAgentGroup,
  reorderAgentGroups,
} from "@/service/api";

import { message, Button } from "antd";
import { useState } from "react";
import { SortAscendingOutlined } from "@ant-design/icons";

// Add missing imports from working anke-agents
import { useTranslation } from "react-i18next";
import { useMobile } from "@/hooks/common/mobile";
import {
  Button as AButton,
  Card as ACard,
  Collapse as ACollapse,
  Popconfirm as APopconfirm,
  Table as ATable,
  Tag as ATag,
} from "antd";

import AgentGroupSearch from "./modules/AgentGroupSearch";

const AgentGroupOperateDrawer = lazy(() => import("./modules/AgentGroupOperateDrawer"));
const GroupSortModal = lazy(() => import("./modules/GroupSortModal"));

const AnkeAgentGroupManage = () => {
  const { t } = useTranslation();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const isMobile = useMobile();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } =
    useTable(
      {
        apiFn: fetchAgentGroupList,
        apiParams: {
          page: 1,
          size: 10,
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
            dataIndex: "sort_order",
            key: "sort_order",
            minWidth: 100,
            title: t("ankeai.agentGroups.sortOrder"),
            render: (value: number) => (
              <ATag color="purple">#{value}</ATag>
            ),
          },
          {
            align: "center",
            dataIndex: "name",
            key: "name",
            minWidth: 120,
            title: t("ankeai.agentGroups.name"),
          },
          {
            align: "center",
            dataIndex: "icon",
            key: "icon",
            minWidth: 80,
            title: t("ankeai.agentGroups.icon"),
            render: (value: string) => {
              if (!value) return "-";
              return (
                <div className="flex justify-center">
                  <i className={value} style={{ fontSize: '18px' }} />
                </div>
              );
            },
          },
          {
            align: "center",
            dataIndex: "description",
            key: "description",
            minWidth: 200,
            title: t("ankeai.agentGroups.description"),
            render: (value: string) => value || "-",
          },
          {
            align: "center",
            dataIndex: "agent_count",
            key: "agent_count",
            minWidth: 100,
            title: t("ankeai.agentGroups.agentCount"),
            render: (value: number) => (
              <ATag color="blue">{value} {t("ankeai.agentGroups.agents")}</ATag>
            ),
          },
          {
            align: "center",
            dataIndex: "is_active",
            key: "is_active",
            minWidth: 100,
            title: t("common.status"),
            render: (value: boolean) => (
              <ATag color={value ? "success" : "warning"}>
                {value ? t("common.active") : t("common.inactive")}
              </ATag>
            ),
          },
          {
            align: "center",
            dataIndex: "created_at",
            key: "created_at",
            minWidth: 160,
            title: t("common.createdAt"),
            render: (value: string) =>
              dayjs(value).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            align: "center",
            key: "operate",
            render: (_, record: Api.AnkeAI.AgentGroup) => (
              <div className="flex-center gap-8px">
                <AButton
                  ghost
                  size="small"
                  type="primary"
                  onClick={() => handleEdit(record as any)}
                >
                  {t("common.edit")}
                </AButton>
                <APopconfirm
                  title={t("common.confirmDelete")}
                  onConfirm={() => handleDelete(record.id)}
                >
                  <AButton danger size="small">
                    {t("common.delete")}
                  </AButton>
                </APopconfirm>
              </div>
            ),
            title: t("common.operate"),
            width: 200,
          },
        ],
      },
      { showQuickJumper: true },
    );

  const {
    checkedRowKeys,
    generalPopupOperation,
    handleAdd,
    handleEdit,
    onBatchDeleted,
    onDeleted,
    rowSelection,
  } = useTableOperate(data, run, async (res, type) => {
    if (type === "add") {
      await createAgentGroup(res);
    } else {
      await updateAgentGroup(res.id, res);
    }
  });

  async function handleDelete(id: number) {
    await deleteAgentGroup(id);
    onDeleted();
  }

  async function handleBatchDelete() {
    await Promise.all(checkedRowKeys.map((id) => deleteAgentGroup(Number(id))));
    onBatchDeleted();
  }

  const [sortModalVisible, setSortModalVisible] = useState(false);

  const handleOpenSortModal = () => {
    setSortModalVisible(true);
  };

  const handleSortSuccess = () => {
    setSortModalVisible(false);
    run();
    message.success(t("ankeai.agentGroups.reorderSuccess"));
  };

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <ACollapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : "1"}
        items={[
          {
            children: <AgentGroupSearch {...searchProps} />,
            key: "1",
            label: t("common.search"),
          },
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        title={t("ankeai.agentGroups.title")}
        variant="borderless"
        extra={
          <div className="flex gap-2">
            <Button 
              type="default"
              icon={<SortAscendingOutlined />}
              onClick={handleOpenSortModal}
            >
              {t("ankeai.agentGroups.reorderGroups")}
            </Button>
            <TableHeaderOperation
              add={handleAdd}
              columns={columnChecks}
              disabledDelete={checkedRowKeys.length === 0}
              loading={tableProps.loading}
              refresh={run}
              setColumnChecks={setColumnChecks}
              onDelete={handleBatchDelete}
            />
          </div>
        }
      >
        <div className="overflow-hidden" ref={tableWrapperRef}>
          <ATable
            rowSelection={rowSelection}
            scroll={scrollConfig}
            size="small"
            {...tableProps}
          />
        </div>
      </ACard>

      <Suspense>
        <AgentGroupOperateDrawer {...generalPopupOperation} />
      </Suspense>
      <Suspense>
        <GroupSortModal
          visible={sortModalVisible}
          onCancel={() => setSortModalVisible(false)}
          onSuccess={handleSortSuccess}
          groups={data || []}
        />
      </Suspense>
    </div>
  );
};

export default AnkeAgentGroupManage;