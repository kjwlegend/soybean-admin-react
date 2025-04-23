import { useEffect, useState } from "react"; // Remove Suspense, lazy
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";
import { Button, Card, Form, Input, Tabs, Upload, message } from "antd"; // Add message import
import { InboxOutlined } from "@ant-design/icons";

// Removed unused imports: Popconfirm, Table, Tag
// Removed unused imports: enableStatusRecord, ATG_MAP
// Removed unused import: TableHeaderOperation
import { fetchGetConfigList, updateConfig, uploadFile } from "@/service/api"; // Import updateConfig

type ConfigItem = {
  id: number;
  key: string;
  value: string;
  description: string;
  category: string;
  field_type: "text" | "textarea" | "image";
  created_at: string; // Add created_at
  updated_at: string; // Add updated_at
  is_system: boolean; // Add is_system
};

// Removed ConfigOperateDrawer import

// Removed component aliases (AButton, ACard, etc.)

export async function loader(): Promise<ConfigItem[]> {
  // fetchGetConfigList uses createFlatRequest which returns { data, error }
  const { data, error } = await fetchGetConfigList({ page: 1, size: 100 }); // Fetch more items if needed

  if (error) {
    console.error("Failed to load config list:", error);
    message.error("Failed to load config list"); // Handle failure case
    return []; // Return empty array on error
  }

  // Assuming data structure is { items: ConfigItem[] }
  // Adjust if the actual structure is different
  return data?.items || []; // Return the items array on success, or empty array if data is null/undefined
}

const ConfigManage = () => {
  const { t } = useTranslation();
  const initialData = useLoaderData() as ConfigItem[]; // Update type assertion
  const [activeTab, setActiveTab] = useState<string>("");
  const [form] = Form.useForm(); // Add form instance
  const [originalValues, setOriginalValues] = useState<Record<string, string>>(
    {},
  );

  console.log("initialData", initialData);
  // Removed unused state: editingId, isDrawerOpen, operateType

  // Removed unused functions: handleAdd

  const groupedData = useMemo(() => {
    return (initialData || []).reduce(
      (acc: Record<string, ConfigItem[]>, curr) => {
        if (!acc[curr.category]) acc[curr.category] = [];
        acc[curr.category].push(curr);
        return acc;
      },
      {},
    );
  }, [initialData]); // 只有当initialData变化时重新计算
  // Set initial active tab based on fetched data
  useEffect(() => {
    const firstCategory = Object.keys(groupedData)[0];
    if (firstCategory && !activeTab) {
      setActiveTab(firstCategory);
    }
  }, [groupedData, activeTab]);

  // Store original values when tab changes
  useEffect(() => {
    if (activeTab && groupedData[activeTab]) {
      const values = groupedData[activeTab].reduce(
        (acc, curr) => ({
          ...acc,
          [curr.key]: curr.value,
        }),
        {},
      );
      setOriginalValues(values);
      form.setFieldsValue(values);
    }
  }, [activeTab, form, groupedData]);

  // Handle form submission
  const handleFinish = async (
    category: string,
    values: Record<string, any>,
  ) => {
    console.log("Save changes:", category, values);

    // Find changed values by comparing with original values
    const changedKeys = Object.keys(values).filter((key) => {
      const newVal = values[key];
      const oldVal = originalValues[key];
      // Special handling for image URLs which might have trailing slashes or query params
      if (
        typeof newVal === "string" &&
        typeof oldVal === "string" &&
        (newVal.includes("http") || oldVal.includes("http"))
      ) {
        return newVal.trim() !== oldVal.trim();
      }
      return String(newVal) !== String(oldVal);
    });

    if (changedKeys.length === 0) {
      message.info(t("common.noChanges"));
      return;
    }

    // Only update changed values
    const updatePromises = changedKeys.map((key) => {
      const configItem = initialData.find((item) => item.key === key);
      if (configItem) {
        console.log("Updating config item:", configItem);
        return updateConfig(configItem.id, { value: String(values[key]) }); // Use updateConfig
      }
      return Promise.resolve(null);
    });

    try {
      const results = await Promise.all(updatePromises);
      // Check results for errors if needed
      console.log("Update results:", results);
      message.success(t("common.saveSuccess"));

      // Update original values after successful save
      setOriginalValues({
        ...originalValues,
        ...changedKeys.reduce(
          (acc, key) => ({
            ...acc,
            [key]: String(values[key]),
          }),
          {},
        ),
      });
    } catch (error) {
      console.error("Failed to save changes:", error);
      message.error(t("common.saveFailed"));
    }
  };

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <Card
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        // Removed unused ref: tableWrapperRef
        title={t("page.manage.config.title")}
        variant="borderless"
        // Removed extra prop as add/edit functionality is tied to the removed drawer
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabPosition="left"
          items={Object.entries(groupedData).map(([category, items]) => ({
            key: category,
            label: category,
            children: (
              <Form
                form={form} // Pass form instance
                layout="vertical"
                initialValues={items.reduce(
                  (acc, curr) => ({
                    ...acc,
                    [curr.key]: curr.value,
                  }),
                  {},
                )}
                onFinish={(values) => handleFinish(category, values)} // Use handleFinish
              >
                {items.map((item) => (
                  <Form.Item
                    key={item.key}
                    label={`${item.description} (${item.key})`}
                    name={item.key}
                    rules={[{ required: true }]} // Keep rules if needed
                  >
                    {item.field_type === "text" && <Input />}
                    {item.field_type === "textarea" && (
                      <Input.TextArea rows={4} />
                    )}
                    {item.field_type === "image" && (
                      <Upload
                        listType="picture-card"
                        maxCount={1}
                        beforeUpload={(file) => {
                          const formData = new FormData();
                          formData.append("file", file);
                          return uploadFile(formData)
                            .then((res) => {
                              const newUrl = res.data?.url || "";
                              if (typeof newUrl !== "string") {
                                throw new Error("Invalid URL format");
                              }
                              console.log("Upload response:", newUrl);
                              form.setFieldsValue({
                                [item.key]: newUrl,
                              });
                              setOriginalValues((prev) => ({
                                ...prev,
                                [item.key]: newUrl,
                              }));
                              console.log("form value", newUrl);

                              message.success(t("common.uploadSuccess"));
                              return false;
                            })
                            .catch(() => {
                              message.error(t("common.uploadFailed"));
                              return false;
                            });
                        }}
                        onChange={({ file }) => {
                          if (file.status === "done") {
                            const newValue = file.response?.data?.url || "";
                            if (typeof newValue !== "string") {
                              message.error(t("common.invalidUrlFormat"));
                              return;
                            }
                            form.setFieldsValue({
                              [item.key]: newValue,
                            });
                            setOriginalValues((prev) => ({
                              ...prev,
                              [item.key]: newValue,
                            }));
                            console.log("form value", newValue);
                          }
                        }}
                      >
                        <Button icon={<InboxOutlined />}>上传</Button>
                      </Upload>
                    )}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                </Form.Item>
              </Form>
            ),
          }))}
        />
        {/* Removed Suspense and ConfigOperateDrawer */}
      </Card>
    </div>
  );
};

export default ConfigManage;
