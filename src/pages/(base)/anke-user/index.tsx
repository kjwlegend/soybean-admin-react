import { Suspense, lazy } from "react";
import dayjs from "dayjs";
import { enableStatusRecord } from "@/constants/business";
import { ATG_MAP } from "@/constants/common";
import {
  TableHeaderOperation,
  useTable,
  useTableOperate,
  useTableScroll,
} from "@/features/table";
import {
  createUser,
  deleteUser,
  fetchUserList,
  updateUser,
} from "@/service/api/anke-user";

import UserSearch from "./modules/UserSearch";

const UserOperateDrawer = lazy(() => import("./modules/UserOperateDrawer"));

const AnkeUserManage = () => {
  const { t } = useTranslation();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const nav = useNavigate();
  const isMobile = useMobile();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } =
    useTable(
      {
        apiFn: fetchUserList,
        apiParams: {
          page: 1,
          size: 10,
          username: null,
          email: null,
          is_active: null,
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
            dataIndex: "username",
            key: "username",
            minWidth: 100,
            title: t("ankeai.users.username"),
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
            dataIndex: "mobile",
            key: "mobile",
            title: t("ankeai.users.mobile"),
            width: 120,
          },
          {
            align: "center",
            dataIndex: "email",
            key: "email",
            minWidth: 200,
            title: t("ankeai.users.email"),
          },
          {
            align: "center",
            dataIndex: "membership_level",
            key: "membership_level",
            title: t("ankeai.users.membershipLevel"),
            width: 100,
            render: (value) => value || "free",
          },
          {
            align: "center",
            dataIndex: "expire_date",
            key: "expire_date",
            title: t("ankeai.users.expireDate"),
            width: 160,
            render: (value) =>
              value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "-",
          },
          {
            align: "center",
            dataIndex: "token_usage",
            key: "token_usage",
            title: t("ankeai.users.tokenUsage"),
            width: 120,
          },
          {
            align: "center",
            dataIndex: "quota_limit",
            key: "quota_limit",
            title: t("ankeai.users.quotaLimit"),
            width: 120,
          },
          {
            align: "center",
            dataIndex: "user_group_name",
            key: "user_group_name",
            minWidth: 100,
            title: t("ankeai.users.userGroup"),
            render: (value) => value || "-",
          },
          {
            align: "center",
            dataIndex: "is_active",
            key: "is_active",
            render: (value) => {
              const statusValue = value ? 1 : 2;
              const label = t(enableStatusRecord[statusValue]);
              return <ATag color={ATG_MAP[statusValue]}>{label}</ATag>;
            },
            title: t("ankeai.users.status"),
            width: 100,
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
        await createUser(res);
      } else {
        await updateUser(res.id, res);
      }
    },
    {
      // 处理编辑时的表单数据
      processFormData: (data) => ({
        ...data,
        expire_date: data.expire_date ? dayjs(data.expire_date) : null,
      }),
      // 处理提交时的数据
      processSubmitData: (data) => ({
        ...data,
        expire_date: data.expire_date ? data.expire_date : null,
      }),
    },
  );

  async function handleDelete(id: number) {
    await deleteUser(id);
    onDeleted();
  }

  async function handleBatchDelete() {
    await Promise.all(checkedRowKeys.map((id) => deleteUser(Number(id))));
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
            children: <UserSearch {...searchProps} />,
            key: "1",
            label: t("common.search"),
          },
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t("ankeai.users.title")}
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
          <UserOperateDrawer {...generalPopupOperation} />
        </Suspense>
      </ACard>
    </div>
  );
};

export default AnkeUserManage;
