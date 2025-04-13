import { useBoolean, useHookTable } from "@sa/hooks";
import type { TablePaginationConfig, TableProps } from "antd";
import { Form } from "antd";

import { parseQuery } from "@/features/router/query";
import { getIsMobile } from "@/layouts/appStore";

type TableData = AntDesign.TableData;
type GetTableData<A extends AntDesign.TableApiFn> = AntDesign.GetTableData<A>;
type TableColumn<T> = AntDesign.TableColumn<T>;
// 表格Hook，用于处理表格相关的状态和操作
export function useTable<A extends AntDesign.TableApiFn>(
  // 表格配置参数
  config: AntDesign.AntDesignTableConfig<A>,
  // 分页配置参数
  paginationConfig?: Omit<
    TablePaginationConfig,
    "current" | "onChange" | "pageSize" | "total"
  >,
) {
  // 获取是否为移动设备
  const isMobile = useAppSelector(getIsMobile);

  // 解构配置参数
  const { apiFn, apiParams, immediate, rowKey = "id" } = config;

  // 创建表单实例
  const [form] = Form.useForm<AntDesign.AntDesignTableConfig<A>["apiParams"]>();

  // 获取URL搜索参数
  const { search } = useLocation();

  // 解析URL查询参数
  const query = parseQuery(search) as unknown as Parameters<A>[0];

  // 使用表格Hook获取表格数据和状态
  const {
    columnChecks, // 列选择状态
    columns, // 表格列配置
    data, // 表格数据
    empty, // 是否为空
    loading, // 加载状态
    pageNum, // 当前页码
    pageSize, // 每页条数
    resetSearchParams, // 重置搜索参数方法
    searchParams, // 搜索参数
    setColumnChecks, // 设置列选择状态方法
    total, // 总数据条数
    updateSearchParams, // 更新搜索参数方法
  } = useHookTable<
    A,
    GetTableData<A>,
    TableColumn<AntDesign.TableDataWithIndex<GetTableData<A>>>
  >({
    apiFn,
    apiParams: { ...apiParams, ...query },
    columns: config.columns,
    // 获取列选择配置
    getColumnChecks: (cols) => {
      const checks: AntDesign.TableColumnCheck[] = [];

      cols.forEach((column) => {
        if (column.key) {
          checks.push({
            checked: true,
            key: column.key as string,
            title: column.title as string,
          });
        }
      });

      return checks;
    },
    // 获取过滤后的列配置
    getColumns: (cols, checks) => {
      const columnMap = new Map<
        string,
        TableColumn<AntDesign.TableDataWithIndex<GetTableData<A>>>
      >();

      cols.forEach((column) => {
        if (column.key) {
          columnMap.set(column.key as string, column);
        }
      });

      const filteredColumns = checks
        .filter((item) => item.checked)
        .map((check) => columnMap.get(check.key));

      return filteredColumns as TableColumn<
        AntDesign.TableDataWithIndex<GetTableData<A>>
      >[];
    },
    immediate,
    // 数据转换器
    transformer: (res) => {
      const {
        page = 1,
        items = [],
        size = 10,
        total: totalNum = 0,
      } = res.data || {};

      // 为数据添加索引
      const itemsWithIndex = items.map((item, index) => {
        return {
          ...item,
          index: (page - 1) * size + index + 1,
        };
      });

      return {
        data: itemsWithIndex,
        pageNum: page,
        pageSize: size,
        total: totalNum,
      };
    },
  });

  // 分页配置
  const pagination: TablePaginationConfig = {
    current: pageNum,
    onChange: async (current: number, size: number) => {
      updateSearchParams({
        current,
        size,
      });
    },
    pageSize,
    pageSizeOptions: ["10", "15", "20", "25", "30"],
    showSizeChanger: true,
    simple: isMobile,
    total,
    ...paginationConfig,
  };

  // 重置表单和搜索参数
  function reset() {
    form.resetFields();
    resetSearchParams();
  }

  // 执行搜索
  async function run(isResetCurrent: boolean = true) {
    const res = await form.validateFields();

    if (res) {
      if (isResetCurrent) {
        const { page = 1, ...rest } = res;
        updateSearchParams({ page, ...rest });
      } else {
        updateSearchParams(res);
      }
    }
  }

  // 返回表格相关的状态和方法
  return {
    columnChecks,
    data,
    empty,
    run,
    searchParams,
    searchProps: {
      form,
      reset,
      search: run,
      searchParams: searchParams as NonNullable<Parameters<A>[0]>,
    },
    setColumnChecks,
    tableProps: {
      columns,
      dataSource: data,
      loading,
      pagination,
      rowKey,
    },
  };
}

// 表格操作Hook，用于处理表格的增删改查操作
export function useTableOperate<T extends TableData = TableData>(
  data: T[],
  getData: (isResetCurrent?: boolean) => Promise<void>,
  executeResActions: (res: T, operateType: AntDesign.TableOperateType) => void,
  // 添加可选的数据处理配置
  options?: {
    processFormData?: (data: T) => T; // 处理表单数据
    processSubmitData?: (data: T) => T; // 处理提交数据
  },
) {
  // 抽屉显示状态控制
  const {
    bool: drawerVisible,
    setFalse: closeDrawer,
    setTrue: openDrawer,
  } = useBoolean();

  // 国际化
  const { t } = useTranslation();

  // 操作类型状态
  const [operateType, setOperateType] =
    useState<AntDesign.TableOperateType>("add");

  // 创建表单实例
  const [form] = Form.useForm<T>();

  // 处理添加操作
  function handleAdd() {
    setOperateType("add");
    openDrawer();
  }

  // 编辑数据状态
  const [editingData, setEditingData] = useState<T>();

  // 处理编辑操作
  function handleEdit(idOrData: T["id"] | T) {
    let editData: T | undefined;

    if (typeof idOrData === "object") {
      editData = idOrData;
    } else {
      editData = data.find((item) => item.id === idOrData);
    }

    if (editData) {
      // 处理表单数据
      const processedData = options?.processFormData
        ? options.processFormData(editData)
        : editData;
      form.setFieldsValue(processedData);
      setEditingData(processedData);
    }

    setOperateType("edit");
    openDrawer();
  }

  async function handleSubmit() {
    const res = await form.validateFields();
    // 处理提交数据
    const processedData = options?.processSubmitData
      ? options.processSubmitData(res)
      : res;
    await executeResActions(processedData, operateType);
    window.$message?.success(t("common.updateSuccess"));
    onClose();
    getData();
  }

  // 选中行的key数组
  const [checkedRowKeys, setCheckedRowKeys] = useState<React.Key[]>([]);

  // 处理选择变化
  function onSelectChange(keys: React.Key[]) {
    setCheckedRowKeys(keys);
  }

  // 行选择配置
  const rowSelection: TableProps<T>["rowSelection"] = {
    columnWidth: 48,
    fixed: true,
    onChange: onSelectChange,
    selectedRowKeys: checkedRowKeys,
    type: "checkbox",
  };

  // 关闭抽屉
  function onClose() {
    closeDrawer();
    form.resetFields();
  }

  // 批量删除后的处理
  async function onBatchDeleted() {
    window.$message?.success(t("common.deleteSuccess"));
    setCheckedRowKeys([]);
    await getData(false);
  }

  // 删除后的处理
  async function onDeleted() {
    window.$message?.success(t("common.deleteSuccess"));
    await getData(false);
  }

  // 提交表单
  // async function handleSubmit() {
  //   const res = await form.validateFields();
  //   await executeResActions(res, operateType);
  //   window.$message?.success(t("common.updateSuccess"));
  //   onClose();
  //   getData();
  // }

  // 返回表格操作相关的状态和方法
  return {
    checkedRowKeys,
    closeDrawer,
    drawerVisible,
    editingData,
    generalPopupOperation: {
      form,
      handleSubmit,
      onClose,
      open: drawerVisible,
      operateType,
    },
    handleAdd,
    handleEdit,
    onBatchDeleted,
    onDeleted,
    onSelectChange,
    openDrawer,
    operateType,
    rowSelection,
  };
}

// 表格滚动Hook，用于处理表格的滚动配置
export function useTableScroll(scrollX: number = 702) {
  // 表格容器引用
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  // 获取容器尺寸
  const size = useSize(tableWrapperRef);

  // 计算表格Y轴滚动高度
  function getTableScrollY() {
    const height = size?.height;
    if (!height) return undefined;
    return height - 160;
  }

  // 滚动配置
  const scrollConfig = {
    x: scrollX,
    y: getTableScrollY(),
  };

  // 返回滚动相关的配置和引用
  return {
    scrollConfig,
    tableWrapperRef,
  };
}
