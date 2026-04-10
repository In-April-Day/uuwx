interface FooterLink {
  text: string;
  to?: string; // 内部路由
  href?: string; // 外部链接
  target?: string;
}

interface FooterConfig {
  links: FooterLink[];
}

export const footerConfig: FooterConfig = {
  links: [
    {
      text: "联系",
      to: "/contact",
    },
    {
      text: "GitHub",
      href: "https://github.com/In-April-Day",
      target: "_blank",
    },
  ],
};
