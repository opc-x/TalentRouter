import { JobProfile } from './types.js';

/**
 * Dynamically generates 3-4 beautiful portrait tags for a job profile
 * to make the dashboard look extremely premium, appealing, and easy to understand.
 */
export function getJobTags(job: JobProfile): string[] {
  const tags: string[] = [];

  // 1. Technical hierarchy / Experience-based capability dimension
  if (job.experienceYearsRequired >= 8) {
    tags.push("特邀技术专家 👑");
    tags.push("系统级架构治理");
  } else if (job.experienceYearsRequired >= 5) {
    tags.push("资深工程骨干 💻");
    tags.push("复杂链路攻坚");
  } else if (job.experienceYearsRequired >= 3) {
    tags.push("全栈业务攻坚 ⚡");
    tags.push("敏捷交付核心");
  } else {
    tags.push("高潜工程主力 ✨");
    tags.push("前沿栈探索者");
  }

  // 2. High-value industry technical scope instead of vulgar salary packages
  const titleLower = job.title.toLowerCase();
  if (titleLower.includes("架构") || titleLower.includes("architect")) {
    tags.push("万级并发底座");
    tags.push("高可用性保障");
  } else if (titleLower.includes("高级") || titleLower.includes("senior") || titleLower.includes("资深")) {
    tags.push("核心模块重构");
    tags.push("技术债务治理");
  } else if (titleLower.includes("研究员") || titleLower.includes("researcher") || titleLower.includes("算法")) {
    tags.push("算力极限对齐");
    tags.push("异构数据加速");
  } else {
    tags.push("规范工程范式");
    tags.push("单元测试护航");
  }

  // 3. Technical architecture description tags based on key skill keywords
  const skillsLower = job.skills.toLowerCase();
  
  if (skillsLower.includes("go") || skillsLower.includes("rust") || skillsLower.includes("k8s") || skillsLower.includes("kubernetes")) {
    tags.push("高并发分布式集群");
  } else if (skillsLower.includes("aws") || skillsLower.includes("cloud") || skillsLower.includes("terraform")) {
    tags.push("云原生多云部署");
  } else if (skillsLower.includes("python") || skillsLower.includes("pytorch") || skillsLower.includes("llm") || skillsLower.includes("tuning")) {
    tags.push("大模型底盘深度应用");
  } else if (skillsLower.includes("react") || skillsLower.includes("next") || skillsLower.includes("typescript")) {
    tags.push("端到端全栈渲染");
  } else {
    tags.push("现代主流前沿技术栈");
  }

  // 4. Cultural / engineering quality weight tag
  if (job.cultureWeight >= 85) {
    tags.push("倡导极佳代码素养 🍀");
  } else if (job.techWeight >= 90) {
    tags.push("极客钻研氛围浓厚 💡");
  } else {
    tags.push("高协作低内耗工程组 🌍");
  }

  // Deduplicate and limit to 4 tags to keep UI extremely clean and un-cluttered
  return Array.from(new Set(tags)).slice(0, 4);
}
