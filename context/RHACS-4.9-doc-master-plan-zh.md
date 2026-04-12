# RHACS 4.9 文档升级最终上下文

状态：已完成  
日期：2026-04-12  
适用仓库：`security-docs`

## 1. 最终结论

本轮文档工作已经从“RHACS / StackRox 4.8 派生内容”升级到“以 RHACS 4.9 为基线、按 Alauda Security Service 当前范围裁剪”的状态。

当前不再跟踪额外 UI 补数项，也不再维护“待版本页面 / 待用户确认”的规划清单。后续如果出现新的产品版本页、新截图、新发布说明或新增需求，应作为新的独立任务处理。

## 2. 已确认约束

这些约束后续默认继续生效，除非用户明确改变：

- 产品名称使用 `Alauda Security Service`
- `docs/en/compliance/**` 已完全移除，不再对外文档化 compliance 能力
- 安装文档继续保留 StackRox 风格叙事，不改成 Alauda 原生安装文档
- 当前文档里没有的能力本轮不新增独立页面：
  - machine-to-machine access
  - external JWT issuer token exchange
  - declarative configuration
  - CA rotation
  - delegated scanning
- `install.stackrox.io`、`definitions.stackrox.io` 等上游地址可以保留
- `StackRox` 作为实现/插件来源痕迹可以保留
- 现有 `OpenShift: ...` 策略名暂时保留，除非用户后续单独要求修改

## 3. 已完成的文档范围

本轮已经完成：

- 删除 compliance 模块和导航入口
- 清理跨页 compliance 能力描述
- 将 `Alauda Container Security` 统一替换为 `Alauda Security Service`
- 更新 Overview、Dashboard、Policy、Vulnerability、Risk、Violation、Network、Configuration、Install 等章节的 4.9 相关描述
- 补齐多个 index / introduction 页面，避免章节入口只有 `<Overview />`
- 按 RHACS 4.9 能力边界更新镜像签名验证文档
- 基于真实 UI 校准多个页面的 tab、按钮、列名、字段和入口
- 建立仓库级上下文文件 `AGENTS.md`
- 将可复用 UI 校验流程沉淀为 `skills/security-doc-ui-calibration`

## 4. 已完成的 UI 校准范围

下列页面或功能已基于真实 UI 做过校准，并已按可验证结果更新文档：

- Dashboard
- Vulnerability Results
- Vulnerability Reporting
- Risk
- Violations
- Collections
- Network Graph
- Network policy generator
- Signature Integrations
- Email Integration
- Registry Integration
- API Token / Authentication Tokens

其中 `Signature Integrations` 已确认并同步：

- `Cosign public keys`
- `Public key name`
- `Public key value`
- `Cosign certificates`
- `Certificate OIDC issuer`
- `Certificate identity`
- `Certificate chain (PEM encoded)`
- `Intermediate certificate (PEM encoded)`
- `Enable certificate transparency log validation`
- `Certificate transparency log public key`
- `Transparency log`
- `Enable transparency log validation`
- `Rekor URL`
- `Validate in offline mode`
- `Rekor public key`

## 5. 已关闭不再跟进的 UI 补数项

用户已明确不再需要继续补 UI 数据或继续校准：

- Exception Management
- View-based reports
- 其它当前未继续深挖的页面

这些项目后续不应再作为本轮文档阻塞项提出。

## 6. 产品实现项

下面事项已由用户安排开发处理，不再由文档规划继续跟踪：

- 隐藏 `Cluster registration secrets` 相关入口/按钮
- 将 System Configuration 中 `OpenShift` / `Red Hat layered products` 类描述改成 `Platform`
- 去除预置 Red Hat 签名文件
- 删除 `New integration` 中链接到上游 RHACS 文档的说明
- 删除默认策略 `Red Hat images must be signed by a Red Hat release key`
- 删除 Red Hat telemetry 相关图表

文档侧后续只在产品行为落地且用户要求时同步描述。

## 7. 上游字眼审计

UI 上游字眼审计结论保存在：

- `context/UI-upstream-term-audit-2026-04-11.md`

审计口径：

- `StackRox` 残留当前可忽略，因为产品说明中允许体现基于 StackRox 插件
- `Integrations` 中用于对接外部产品的 Red Hat / OpenShift 集成名称可忽略
- 面向用户的帮助文案、系统配置说明、默认策略和 telemetry 图表按用户确认的产品实现结论处理

## 8. 后续工作入口

未来如果继续做文档工作，建议优先读取：

- `AGENTS.md`
- `context/RHACS-4.9-doc-master-plan-zh.md`
- `context/UI-upstream-term-audit-2026-04-11.md`

如果需要重新访问 UI 做字段级校验，使用：

- `skills/security-doc-ui-calibration/SKILL.md`

如果需要对比 RHACS 上游版本，默认以 RHACS 4.9 为基线，但必须继续遵守本文件中的 Alauda 裁剪约束。
