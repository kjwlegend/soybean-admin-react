import { Suspense, lazy } from "react";

import { enableStatusRecord, userGenderRecord } from "@/constants/business";
import { ATG_MAP } from "@/constants/common";
import {
  TableHeaderOperation,
  useTable,
  useTableOperate,
  useTableScroll,
} from "@/features/table";
import {
  createAdminUser,
  deleteAdminUser,
  fetchGetUserList,
  updateAdminUser,
} from "@/service/api";

import UserSearch from "./modules/UserSearch";

const UserOperateDrawer = lazy(() => import("./modules/UserOperateDrawer"));

const tagUserGenderMap: Record<Api.SystemManage.UserGender, string> = {
  1: "processing",
  2: "error",
};

const UserManage = () => {
  const { t } = useTranslation();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const nav = useNavigate();

  const isMobile = useMobile();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } =
    useTable(
      {
        apiFn: fetchGetUserList,
        apiParams: {
          current: 1,
          nickName: null,
          size: 10,
          // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
          // the value can not be undefined, otherwise the property in Form will not be reactive
          is_active: null,
          userEmail: null,
          userName: null,
          userPhone: null,
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
            key: "userName",
            minWidth: 100,
            title: t("page.manage.user.userName"),
          },
          {
            align: "center",
            dataIndex: "id",
            key: "id",
            minWidth: 50,
            title: "id",
          },
          {
            align: "center",
            dataIndex: "role_id",
            key: "userRoles",
            minWidth: 100,
            title: t("page.manage.user.userRole"),
            render: (value, record) => {
              const roleDescriptionMap = {
                1: "SuperAdmin",
                2: "Admin",
                3: "User",
              };
              return (
                <div className="flex-center gap-8px">
                  <ATag color={"blue"}>
                    {
                      roleDescriptionMap[
                        value as keyof typeof roleDescriptionMap
                      ]
                    }
                  </ATag>
                </div>
              );
            },
          },

          {
            align: "center",
            dataIndex: "nickname",
            key: "nickName",
            minWidth: 100,
            title: t("page.manage.user.nickName"),
          },
          {
            align: "center",
            dataIndex: "mobile",
            key: "userPhone",
            title: t("page.manage.user.userPhone"),
            width: 120,
          },
          {
            align: "center",
            dataIndex: "email",
            key: "userEmail",
            minWidth: 200,
            title: t("page.manage.user.userEmail"),
          },
          {
            align: "center",
            dataIndex: "is_active",
            key: "status",
            render: (_, record) => {
              // 将boolean值映射为1或2
              const statusValue = record.is_active ? 1 : 2;
              const label = t(enableStatusRecord[statusValue]);
              return <ATag color={ATG_MAP[statusValue]}>{label}</ATag>;
            },
            title: t("page.manage.user.userStatus"),
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
                <AButton
                  size="small"
                  onClick={() => nav(`/manage/user/${record.id}`)}
                >
                  详情
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
            width: 195,
          },
        ],
      },
      { showQuickJumper: true },
    );

  console.log(data);
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
      // add request 调用新增的接口
      console.log("add type");
      const result = await createAdminUser(res);
      console.log(result);
      console.log(res);
    } else {
      // edit request 调用编辑的接口
      console.log("edit type");
      const result = await updateAdminUser(res.id, res);
      console.log("edit result", result);
      console.log(res);
    }
  });

  async function handleBatchDelete() {
    // request
    console.log(checkedRowKeys);
    onBatchDeleted();
  }

  async function handleDelete(id: number) {
    // request
    console.log(id);

    // 调用删除接口
    const result = await deleteAdminUser(id);
    console.log(result);

    onDeleted();
  }

  function edit(id: number) {
    handleEdit(id);
  }
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
        title={t("page.manage.user.title")}
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

export default UserManage;
