import type { NoticeButton, NoticeConfig } from "../types/notice";

interface ExtendedNoticeButton extends NoticeButton {
  type: "primary" | "secondary" | "danger";
}

interface ExtendedNoticeConfig extends NoticeConfig {
  enabled: boolean;
  showFireworks: boolean;
  defaultShowAfter?: number | "refresh" | null;
  buttons: ExtendedNoticeButton[];
}

export const noticeConfig: ExtendedNoticeConfig = {
  id: "site_notice_v1",
  enabled: false,
  showFireworks: true,
  title: "网站公告",
  content: `
    <div class="text-center">
      <p class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        🎉 网站改版升级公告
      </p>
      <div class="text-gray-600 dark:text-gray-400 space-y-2">
        <p>网站已完成改版升级，新增以下功能：</p>
        <ul class="list-disc list-inside">
          <li>全新的深色模式支持</li>
          <li>性能优化与体验提升</li>
          <li>更多实用工具正在开发中</li>
        </ul>
      </div>
    </div>
  `,
  width: "500px",
  maskClosable: true,
  showClose: true,
  defaultShowAfter: null,
  buttons: [
    {
      text: "稍后查看",
      type: "secondary",
      action: "close",
      showAfter: "refresh",
    },
    {
      text: "立即体验",
      type: "primary",
      action: "navigate",
      to: "/projects",
      showAfter: 3 * 60 * 60 * 1000,
    },
  ],
};
