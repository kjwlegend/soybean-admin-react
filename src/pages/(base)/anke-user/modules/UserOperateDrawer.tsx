import { useRequest } from "@sa/hooks";
import {
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
} from "antd";
import type { FC } from "react";
import dayjs from "dayjs"; // 添加这行

import { enableStatusOptions } from "@/constants/business";
import { useFormRules } from "@/features/form";
import { fetchUserGroupList } from "@/service/api";

interface OptionsProps {
  label: string;
  value: number;
}

type Model = {
  id?: number;
  username: string;
  password?: string;
  nickname?: string;
  email?: string;
  expire_date?: string | null;
  quota_limit?: number;
  mobile?: string;
  is_active: boolean;
  user_group_id?: number;
};

type RuleKey = Extract<keyof Model, "username" | "password" | "is_active">;

const UserOperateDrawer: FC<Page.OperateDrawerProps> = ({
  form,
  handleSubmit,
  onClose,
  open,
  operateType,
}) => {
  const { t } = useTranslation();

  const { data: userGroups } = useRequest(
    () => fetchUserGroupList({ page: 1, size: 100 }),
    {
      manual: false,
    },
  );

  const { defaultRequiredRule, patternRules } = useFormRules();

  const userGroupOptions: OptionsProps[] = userGroups
    ? userGroups.items.map((group) => ({
        label: group.name,
        value: group.id,
      }))
    : [];

  const rules: Record<RuleKey, App.Global.FormRule[]> = {
    username: [defaultRequiredRule],
    password: [defaultRequiredRule, patternRules.pwd],
    is_active: [defaultRequiredRule],
  };

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
        <Form.Item name="id" label="id" hidden={operateType === "add"}>
          <Input disabled />
        </Form.Item>

        <Form.Item
          label={t("ankeai.users.username")}
          name="username"
          rules={rules.username}
        >
          <Input
            placeholder={t("page.manage.user.form.userName")}
            disabled={operateType === "edit"}
          />
        </Form.Item>

        <Form.Item
          label={t("page.manage.user.userPassword")}
          name="password"
          rules={operateType === "add" ? rules.password : []}
        >
          <Input.Password
            placeholder={t("page.manage.user.form.passwordPlaceholder")}
          />
        </Form.Item>

        <Form.Item label={t("ankeai.users.mobile")} name="mobile">
          <Input placeholder={t("page.manage.user.form.userPhone")} />
        </Form.Item>

        <Form.Item label={t("ankeai.users.email")} name="email">
          <Input
            placeholder={t("page.manage.user.form.userEmail")}
            disabled={operateType === "edit"}
          />
        </Form.Item>

        <Form.Item label={t("ankeai.users.expireDate")} name="expire_date">
          <DatePicker
            style={{ width: "100%" }}
            showTime
            format="YYYY-MM-DD HH:mm"
            placeholder={t("ankeai.users.expireDatePlaceholder")}
            // 修改日期处理逻辑
            onChange={(date) => {
              if (date) {
                form.setFieldValue("expire_date", date);
              } else {
                form.setFieldValue("expire_date", null);
              }
            }}
          />
        </Form.Item>

        <Form.Item label={t("ankeai.users.quotaLimit")} name="quota_limit">
          <Input placeholder={t("ankeai.users.quotaLimit")} />
        </Form.Item>

        <Form.Item
          label={t("ankeai.users.status")}
          name="is_active"
          rules={rules.is_active}
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

        <Form.Item label={t("ankeai.users.userGroup")} name="user_group_id">
          <Select
            allowClear
            options={userGroupOptions}
            placeholder={t("ankeai.users.userGroup")}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default UserOperateDrawer;
