import { Suspense, lazy } from "react";
import dayjs from "dayjs";

import { ATG_MAP } from "@/constants/common";
import { enableStatusRecord } from "@/constants/business";
import {
  TableHeaderOperation,
  useTable,
  useTableOperate,
  useTableScroll,
} from "@/features/table";
import {
  createAgent,
  deleteAgent,
  fetchAgentList,
  syncAgent,
  updateAgent,
} from "@/service/api";

import { message } from "antd";

import AgentSearch from "./modules/AgentSearch";

const AgentOperateDrawer = lazy(() => import("./modules/AgentOperateDrawer"));

const AnkeAgentManage = () => {
  const { t } = useTranslation();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const isMobile = useMobile();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } =
    useTable(
      {
        apiFn: fetchAgentList,
        apiParams: {
          page: 1,
          size: 10,
          status: undefined,
          name: undefined,
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
            dataIndex: "name",
            key: "name",
            minWidth: 100,
            title: t("ankeai.agents.name"),
          },
          {
            align: "center",
            dataIndex: "id",
            key: "id",
            minWidth: 50,
            title: "ID",
          },
          {
            align: "center",
            dataIndex: "description",
            key: "description",
            minWidth: 200,
            title: t("ankeai.agents.description"),
          },
          {
            align: "center",
            dataIndex: "type",
            minWidth: 100,
            key: "type",
            title: t("ankeai.agents.type"),
          },
          {
            align: "center",
            dataIndex: "status",
            key: "status",
            render: (value: string) => {
              const colorMap = {
                active: "success",
                inactive: "warning",
                error: "error",
              };

              const valueMap = {
                active: "1",
                inactive: "2",
              } as const;

              // 将字符串值映射为 EnableStatus 类型
              const status = valueMap[value as keyof typeof valueMap];
              const label = t(enableStatusRecord[status]);

              return (
                <ATag color={colorMap[value as keyof typeof colorMap]}>
                  {label}
                </ATag>
              );
            },
            title: t("ankeai.agents.status"),
            width: 100,
          },
          {
            align: "center",
            dataIndex: "user_groups",
            key: "user_groups",
            minWidth: 200,
            title: t("ankeai.agents.userGroups"),
            render: (value) =>
              value?.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {value.map((group: { id: number; name: string }) => (
                    <ATag key={group.id} color="blue">
                      {group.name}
                    </ATag>
                  ))}
                </div>
              ) : (
                "-"
              ),
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
                  onClick={() => edit(record.id)}
                >
                  {t("common.edit")}
                </AButton>
                <AButton
                  size="small"
                  type="primary"
                  onClick={() => handleSync(record.id)}
                >
                  {t("ankeai.agents.sync")}
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
            width: 240,
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
      await createAgent(res);
    } else {
      await updateAgent(res.id, res);
    }
  });

  async function handleDelete(id: number) {
    await deleteAgent(id);
    onDeleted();
  }

  async function handleBatchDelete() {
    await Promise.all(checkedRowKeys.map((id) => deleteAgent(Number(id))));
    onBatchDeleted();
  }

  async function handleSync(id: number) {
    const syncresult = await syncAgent(id);
    run();
    console.log("result", syncresult);

    // antd message component
    message.success(t("ankeai.agents.syncSuccess"));
  }

  const edit = handleEdit;

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <ACollapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : "1"}
        items={[
          {
            children: <AgentSearch {...searchProps} />,
            key: "1",
            label: t("common.search"),
          },
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t("ankeai.agents.title")}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={handleAdd}
            columns={columnChecks}
            disabledDelete={checkedRowKeys.length === 0}
            loading={tableProps.loading}
            refresh={run}
            setColumnChecks={setColumnChecks}
            onDelete={handleBatchDelete}
          />
        }
      >
        <ATable
          rowSelection={rowSelection}
          scroll={scrollConfig}
          size="small"
          {...tableProps}
        />
        <Suspense>
          <AgentOperateDrawer {...generalPopupOperation} />
        </Suspense>
      </ACard>
    </div>
  );
};

export default AnkeAgentManage;
