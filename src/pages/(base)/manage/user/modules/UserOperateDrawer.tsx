import { useRequest } from "@sa/hooks";
import { Button, Drawer, Flex, Form, Input, Radio, Select } from "antd";
import type { FC } from "react";

import { enableStatusOptions, userGenderOptions } from "@/constants/business";
import { useFormRules } from "@/features/form";
import { fetchGetAllRoles } from "@/service/api";

interface OptionsProps {
  label: string;
  value: number;
}

type Model = Pick<
  Api.SystemManage.User,
  | "id"
  | "nickName"
  | "is_active"
  | "userEmail"
  | "userName"
  | "userPhone"
  | "password"
  | "status"
  | "createBy"
  | "createTime"
  | "updateBy"
  | "updateTime"
  | "userRoles"
>;

type RuleKey = Extract<keyof Model, "status" | "userName" | "password">;

function getOptions(item: Api.SystemManage.AllRole) {
  return {
    label: item.description,
    value: item.id,
  };
}

const UserOperateDrawer: FC<Page.OperateDrawerProps> = ({
  form, // antd Form 实例
  handleSubmit, // 提交处理函数
  onClose, // 关闭抽屉函数
  open, // 抽屉是否打开
  operateType, // 操作类型（add/edit）
}) => {
  const { t } = useTranslation();

  const { data, run } = useRequest(fetchGetAllRoles, {
    manual: true,
  });

  const { defaultRequiredRule, patternRules, formRules } = useFormRules();

  const roleOptions: OptionsProps[] = data ? data.items.map(getOptions) : [];

  const rules: Record<RuleKey, App.Global.FormRule[]> = {
    status: [defaultRequiredRule],
    userName: [defaultRequiredRule],
    password: [defaultRequiredRule, patternRules.pwd],
  };

  useUpdateEffect(() => {
    if (open) {
      run(); // 抽屉打开时获取角色列表
    }
  }, [open]);

  return (
    <Drawer
      open={open}
      title={
        operateType === "add"
          ? t("page.manage.user.addUser")
          : t("page.manage.user.editUser")
      }
      footer={
        <Flex justify="space-between">
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <Button type="primary" onClick={handleSubmit}>
            {t("common.confirm")}
          </Button>
        </Flex>
      }
      onClose={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="id" label="id">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label={t("page.manage.user.userName")}
          name="username"
          rules={rules.userName}
        >
          <Input
            placeholder={t("page.manage.user.form.userName")}
            disabled={operateType === "edit"}
          />
        </Form.Item>

        {/* password */}
        <Form.Item
          label={t("page.manage.user.userPassword")}
          name="password"
          rules={operateType === "add" ? rules.password : []}
        >
          <Input placeholder={t("page.manage.user.form.passwordPlaceholder")} />
        </Form.Item>

        <Form.Item label={t("page.manage.user.nickName")} name="nickname">
          <Input placeholder={t("page.manage.user.form.nickName")} />
        </Form.Item>

        <Form.Item label={t("page.manage.user.userPhone")} name="mobile">
          <Input placeholder={t("page.manage.user.form.userPhone")} />
        </Form.Item>

        <Form.Item label={t("page.manage.user.userEmail")} name="email">
          <Input
            placeholder={t("page.manage.user.form.userEmail")}
            disabled={operateType === "edit"}
          />
        </Form.Item>

        <Form.Item
          label={t("page.manage.user.userStatus")}
          name="is_active"
          rules={rules.status}
          initialValue={true}
        >
          <Radio.Group>
            {enableStatusOptions.map((item) => (
              <Radio key={item.value} value={item.value === "1"}>
                {t(item.label)}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item label={t("page.manage.user.userRole")} name="role_id">
          <Select
            options={roleOptions}
            placeholder={t("page.manage.user.form.userRole")}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default UserOperateDrawer;
