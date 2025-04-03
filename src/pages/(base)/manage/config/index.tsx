import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Collapse, Popconfirm, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";

import { enableStatusRecord } from "@/constants/business";
import { ATG_MAP } from "@/constants/common";
import {
  TableHeaderOperation,
  useTable,
  useTableOperate,
  useTableScroll,
} from "@/features/table";
import { fetchGetConfigList } from "@/service/api";

import ConfigSearch from "./modules/ConfigSearch";

const ConfigOperateDrawer = lazy(() => import("./modules/ConfigOperateDrawer"));

// 为了简化代码，将 Ant Design 组件别名化
const AButton = Button;
const ACard = Card;
const ACollapse = Collapse;
const APopconfirm = Popconfirm;
const ATable = Table;
const ATag = Tag;

const ConfigManage = () => {
  const { t } = useTranslation();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } =
    useTable(
      {
        apiFn: fetchGetConfigList,
        apiParams: {
          current: 1,
          size: 10,
          key: null,
          value: null,
          status: null,
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
            dataIndex: "description",
            key: "description",
            minWidth: 200,
            title: t("page.manage.config.description"),
          },
          {
            align: "center",
            dataIndex: "key", // 修改这里，使用与后端返回数据一致的属性名
            key: "key", // key 应该与 dataIndex 一致
            title: t("page.manage.config.key"),
            minWidth: 100,
          },
          {
            align: "center",
            dataIndex: "value",
            key: "value",
            minWidth: 200,
            title: t("page.manage.config.value"),
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
  } = useTableOperate(data, run, async (res, type) => {
    if (type === "add") {
      // add request 调用新增的接口
      console.log(res);
    } else {
      // edit request 调用编辑的接口
      console.log(res);
    }
  });

  async function handleBatchDelete() {
    // request
    console.log(checkedRowKeys);
    onBatchDeleted();
  }

  function handleDelete(id: number) {
    // request
    console.log(id);

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
        defaultActiveKey={1}
        items={[
          {
            children: <ConfigSearch {...searchProps} />,
            key: "1",
            label: t("common.search"),
          },
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t("page.manage.config.title")}
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
          <ConfigOperateDrawer {...generalPopupOperation} />
        </Suspense>
      </ACard>
    </div>
  );
};

export default ConfigManage;
