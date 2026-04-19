export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  status: "completed" | "developing" | "planning";
}

export const projects: Project[] = [
  {
    id: 3,
    title: "自然灾害应急管理系统",
    description: "为应对突发自然灾害而设计的应急管理系统，实现资源调度、人员疏散和数据分析。",
    tags: ["Vue 3", "TypeScript", "管理系统"],
    images: [
      "/projects/disaster/1.png",
      "/projects/disaster/2.png",
      "/projects/disaster/3.png",
      "/projects/disaster/4.png",
    ],
    status: "completed",
  },
  {
    id: 1,
    title: "植物大战僵尸",
    description: "基于Unity开发的经典塔防游戏，玩家需要在草坪上布置各种植物来抵御僵尸的入侵。",
    tags: ["Unity", "C#", "游戏开发"],
    images: [
      "/projects/plant/1.png",
      "/projects/plant/2.png",
    ],
    status: "completed",
  },
  {
    id: 2,
    title: "皇室战争脚本",
    description: "基于Python开发的皇室战争游戏辅助脚本，实现自动化的卡牌管理和对战策略。",
    tags: ["Python", "游戏辅助", "自动化"],
    images: [
      "/projects/cr/1.png",
      "/projects/cr/2.png",
    ],
    status: "completed",
  },
];
