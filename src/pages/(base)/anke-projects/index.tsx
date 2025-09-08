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
  createProject,
  deleteProject,
  fetchProjectList,
  updateProject,
} from "@/service/api";
import { useTranslation } from "react-i18next";
import { useMobile } from "@/hooks/common/mobile";

import { Button, Card, Collapse, Popconfirm, Table, Tag, message } from "antd";
import { useState } from "react";

import ProjectSearch from "./modules/ProjectSearch";

const ProjectOperateDrawer = lazy(
  () => import("./modules/ProjectOperateDrawer"),
);
const UserAssignmentModal = lazy(() => import("./modules/UserAssignmentModal"));

const AnkeProjectManage = () => {
  const { t } = useTranslation();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const isMobile = useMobile();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } =
    useTable(
      {
        apiFn: fetchProjectList,
        apiParams: {
          page: 1,
          size: 10,
          title: undefined,
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
            dataIndex: "title",
            key: "title",
            minWidth: 120,
            title: t("ankeai.projects.title"),
          },
          {
            align: "center",
            dataIndex: "description",
            key: "description",
            minWidth: 200,
            title: t("ankeai.projects.description"),
            render: (value: string) => value || "-",
          },
          {
            align: "center",
            dataIndex: "member_count",
            key: "member_count",
            minWidth: 100,
            title: t("ankeai.projects.memberCount"),
            render: (value: number) => (
              <Tag color="blue">
                {value} {t("ankeai.projects.members")}
              </Tag>
            ),
          },
          {
            align: "center",
            dataIndex: "created_by",
            key: "created_by",
            minWidth: 120,
            title: t("ankeai.projects.createdBy"),
            render: (value: Api.AnkeAI.Project["created_by"]) =>
              value?.username || "-",
          },
          {
            align: "center",
            dataIndex: "last_updated",
            key: "last_updated",
            minWidth: 160,
            title: t("ankeai.projects.lastUpdated"),
            render: (value: string) =>
              dayjs(value).format("YYYY-MM-DD HH:mm:ss"),
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
            render: (_, record: Api.AnkeAI.Project) => (
              <div className="flex-center gap-8px">
                <Button
                  ghost
                  size="small"
                  type="primary"
                  onClick={() => handleEdit(record as any)}
                >
                  {t("common.edit")}
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => handleUserAssignment(record)}
                >
                  {t("ankeai.projects.manageMembers")}
                </Button>
                <Popconfirm
                  title={t("common.confirmDelete")}
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button danger size="small">
                    {t("common.delete")}
                  </Button>
                </Popconfirm>
              </div>
            ),
            title: t("common.operate"),
            width: 280,
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
      await createProject(res);
    } else {
      await updateProject(res.id, res);
    }
  });

  async function handleDelete(id: number) {
    await deleteProject(id);
    onDeleted();
  }

  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [memberOperatedRecord, setMemberOperatedRecord] =
    useState<Api.AnkeAI.Project | null>(null);

  const handleUserAssignment = (projectRecord: Api.AnkeAI.Project) => {
    setMemberOperatedRecord(projectRecord);
    setMemberModalVisible(true);
  };

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <Collapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : "1"}
        items={[
          {
            children: <ProjectSearch {...searchProps} />,
            key: "1",
            label: t("common.search"),
          },
        ]}
      />

      <Card
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        title={t("ankeai.projects.title")}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={handleAdd}
            columns={columnChecks}
            disabledDelete={checkedRowKeys.length === 0}
            loading={tableProps.loading}
            refresh={run}
            setColumnChecks={setColumnChecks}
            onDelete={async () => {
              await Promise.all(
                checkedRowKeys.map((id) => deleteProject(Number(id))),
              );
              onBatchDeleted();
            }}
          />
        }
      >
        <div className="overflow-hidden h-full" ref={tableWrapperRef}>
          <Table
            rowSelection={rowSelection}
            scroll={scrollConfig}
            size="small"
            {...tableProps}
          />
        </div>
      </Card>

      <Suspense>
        <ProjectOperateDrawer {...generalPopupOperation} />
      </Suspense>
      <Suspense>
        <UserAssignmentModal
          visible={memberModalVisible}
          projectId={memberOperatedRecord?.id}
          onCancel={() => setMemberModalVisible(false)}
          onSuccess={() => {
            setMemberModalVisible(false);
            run();
          }}
        />
      </Suspense>
    </div>
  );
};

export default AnkeProjectManage;
