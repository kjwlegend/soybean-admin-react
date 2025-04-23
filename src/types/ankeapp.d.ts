declare namespace AnkeAI {
  namespace I18n {
    type RouteKey = import("@soybean-react/vite-plugin-react-router").RouteKey;

    type LangType = "en-US" | "zh-CN";

    type LangOption = {
      key: LangType;
      label: string;
    };

    type I18nRouteKey = Exclude<RouteKey, "not-found" | "root">;

    type FormMsg = {
      invalid: string;
      required: string;
    };
    type TranslationValue = string | { [key: string]: TranslationValue };

    type Schema = {
      /** 语言 */
      lang: string;
      /** 语言名称 */
      translation: {
        [key: string]: TranslationValue;
      };
    };
  }
}
