import { Suspense, lazy } from "react";
import dayjs from "dayjs";
import {
  TableHeaderOperation,
  useTable,
  useTableOperate,
  useTableScroll,
} from "@/features/table";
import {
  createUserGroup,
  deleteUserGroup,
  fetchUserGroupList,
  updateUserGroup,
} from "@/service/api/anke-user";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMobile } from "@/hooks/common/mobile";
import {
  Button as AButton,
  Card as ACard,
  Collapse as ACollapse,
  Popconfirm as APopconfirm,
  Table as ATable,
  Tag as ATag,
  Avatar,
} from "antd";

import UserGroupSearch from "./modules/UserGroupSearch";

const UserGroupOperateDrawer = lazy(
  () => import("./modules/UserGroupOperateDrawer"),
);

const AnkeUserGroupManage = () => {
  const { t } = useTranslation();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const nav = useNavigate();
  const isMobile = useMobile();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } =
    useTable(
      {
        apiFn: fetchUserGroupList,
        apiParams: {
          page: 1,
          size: 10,
          name: undefined,
          description: undefined,
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
            minWidth: 50,
            title: t("ankeai.userGroups.name"),
          },
          {
            align: "center",
            dataIndex: "logo_url",
            key: "logo_url",
            minWidth: 80,
            title: t("ankeai.userGroups.logo"),
            render: (value: string) => {
              if (!value) return "-";
              return (
                <Avatar
                  src={value}
                  size={32}
                  shape="square"
                  alt="Group Logo"
                />
              );
            },
          },
          {
            align: "center",
            dataIndex: "id",
            key: "id",
            width: 50,
            title: "ID",
          },
          {
            align: "center",
            dataIndex: "description",
            key: "description",
            minWidth: 200,
            title: t("ankeai.userGroups.description"),
            render: (value) => value || "-",
          },
          {
            align: "center",
            dataIndex: "agents",
            key: "agents",
            title: t("ankeai.userGroups.agents"),
            width: 200,
            render: (value) =>
              Array.isArray(value) && value.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {value.map((agent) => (
                    <ATag key={agent.id} color="blue">
                      {agent.name}
                    </ATag>
                  ))}
                </div>
              ) : (
                "-"
              ),
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
            dataIndex: "updated_at",
            key: "updated_at",
            title: t("ankeai.updatedAt"),
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
                  onClick={() => edit(record.id)}
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
            width: 160,
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
  } = useTableOperate(
    data,
    run,
    async (res, type) => {
      if (type === "add") {
        await createUserGroup(res);
      } else {
        await updateUserGroup(res.id, res);
      }
    },
    {
      processFormData: (data) => data,
      processSubmitData: (data) => data,
    },
  );

  async function handleDelete(id: number) {
    await deleteUserGroup(id);
    onDeleted();
  }

  async function handleBatchDelete() {
    await Promise.all(checkedRowKeys.map((id) => deleteUserGroup(Number(id))));
    onBatchDeleted();
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
            children: <UserGroupSearch {...searchProps} />,
            key: "1",
            label: t("common.search"),
          },
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t("ankeai.userGroups.title")}
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
          <UserGroupOperateDrawer {...generalPopupOperation} />
        </Suspense>
      </ACard>
    </div>
  );
};

export default AnkeUserGroupManage;
