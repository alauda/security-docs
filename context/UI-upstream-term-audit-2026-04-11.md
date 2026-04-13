# UI 上游字眼审计报告

日期：2026-04-11  
范围：审计当前产品 UI 中可见文本里的上游品牌/产品字眼，重点关注 `OpenShift`、`OCP`、`RHACS`，并检查同类残留 `Red Hat`  
口径说明：`Integrations` 页面中用于对接外部产品的上游集成名称视为可接受展示，本报告不再将其作为问题项统计

## 审计范围

本次审计覆盖了 27 个当前可访问的主页面和已知子页面：

- `/main/dashboard`
- `/main/network-graph`
- `/main/network-graph?EDGE_STATE=active&TIME_WINDOW=Past%20hour&s[Cluster]=business-1`
- `/main/violations?violationState=ACTIVE&filteredWorkflowView=Applications%20view`
- `/main/vulnerabilities/user-workloads`
- `/main/vulnerabilities/exception-management/pending-requests`
- `/main/vulnerabilities/reports/configuration`
- `/main/vulnerabilities/reports/configuration?action=create`
- `/main/configmanagement`
- `/main/risk`
- `/main/clusters`
- `/main/clusters/delegated-image-scanning`
- `/main/clusters/discovered-clusters`
- `/main/clusters/init-bundles`
- `/main/clusters/cluster-registration-secrets`
- `/main/policy-management/policies`
- `/main/policy-management/policies/?action=create`
- `/main/collections`
- `/main/collections?action=create`
- `/main/integrations`
- `/main/integrations/notifiers/email/create`
- `/main/integrations/imageIntegrations/docker`
- `/main/integrations/imageIntegrations/docker/create`
- `/main/integrations/signatureIntegrations/signature/create`
- `/main/integrations/authProviders/apitoken`
- `/main/integrations/authProviders/apitoken/create`
- `/main/systemconfig`

## 结论摘要

- `OCP`：在已审计页面的正文可见文本中未发现
- `OpenShift`：在 1 个路由实例的正文中发现
- `RHACS`：在 2 个路由实例的正文中发现
- `Red Hat`：在 2 个路由实例的正文中发现

## 关键发现

### 正文可见文本命中页

下列路由在页面正文可见文本中命中了目标字眼：


| 路由                                                          | 命中字眼                  | 说明                                                                  |
| ----------------------------------------------------------- | --------------------- | ------------------------------------------------------------------- |
| `/main/clusters/cluster-registration-secrets`               | `RHACS`               | 提示文案写有 `please consult the RHACS documentation for details`         |
| `/main/policy-management/policies`                          | `Red Hat`             | 默认策略列表中可见 `Red Hat images must be signed by a Red Hat release key`  |
| `/main/integrations/signatureIntegrations/signature/create` | `RHACS`               | 帮助文案写有 `For more information, see RHACS documentation`              |
| `/main/systemconfig`                                        | `OpenShift`、`Red Hat` | 可见 `Openshift and Kubernetes namespaces`、`Red Hat layered products` |


## 命中项分级清单

下面按“可改 / 不建议改 / 需要产品侧确认”三类整理命中项，并补充入口页面、功能说明、分类依据和建议动作。


| 序号  | 词           | 入口页面                                                                                              | 功能说明                                                    | 命中内容                                                                                                                           | 分类  | 分类依据                                        | 建议动作                                                                             | 结论                        |
| --- | ----------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --- | ------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------- |
| 1   | `OpenShift` | `Platform Configuration > System Configuration`                                                   | 系统配置页，用于定义平台组件范围、保留策略、Prometheus 指标和公共配置。               | `Core system Components found in core Openshift and Kubernetes namespaces are included in the platform definition by default.` | 可改  | 这是说明性文案，不直接绑定具体集成名或策略名。                     | 将 `OpenShift` 平台说明统一改为 `Platform` 表述。                                            | 改为 `Platform`             |
| 2   | `RHACS`     | `Platform Configuration > Clusters > Cluster registration secrets`                                | 集群注册密钥页面，用于创建和管理新集群接入 Central 所需的初始信任凭据。                | `please consult the RHACS documentation for details`                                                                           | 可改  | 这是帮助文案里的外部文档引用，不应直接指向上游产品名。                 | 保留该入口，但移除与 `Red Hat` / `RHACS` 相关的告警或帮助文案；如果后续需要补帮助链接，应改为 Alauda Security Service 文档入口。 | 保留入口，移除上游告警文案              |
| 3   | `RHACS`     | `Platform Configuration > Integrations > Signature Integrations > Signature > Create integration` | 镜像签名集成创建页，用于配置 Cosign、公钥、证书链和 transparency log 等签名校验能力。 | `For more information, see RHACS documentation`                                                                                | 可改  | 这是帮助文案引用，不属于后端对象名或策略名。                      | 去除预置的 Red Hat 签名文件；新建集成页面中链接到文档的说明直接去除。                                          | 去除预置 Red Hat 签名文件，并移除文档说明 |
| 4   | `Red Hat`   | `Platform Configuration > Policy Management`                                                      | 策略管理页，用于查看默认策略、创建自定义策略、导入策略和重新评估现有部署。                   | `Red Hat images must be signed by a Red Hat release key`                                                                       | 可改  | 你已明确给出处理方向，不再作为待确认项保留。                      | 直接删除该项预置策略。                                                                      | 直接删除该项预置策略                |
| 5   | `Red Hat`   | `Platform Configuration > System Configuration`                                                   | 系统配置页，用于维护平台组件识别规则和平台/用户工作负载的边界。                        | `Red Hat layered products`                                                                                                     | 可改  | 你已明确要求这类平台分类说明统一按 `Platform` 收口。            | 将 `Red Hat layered products` 统一改为 `Platform layered products` 或等价 `Platform` 表述。 | 改为 `Platform`             |
| 6   | `Red Hat`   | `Platform Configuration > System Configuration`                                                   | 系统配置页中的公共配置区域，包含登录页、页眉页脚和遥测相关设置。                        | `Online telemetry data collection allows Red Hat to use anonymized information ...`                                            | 可改  | 这是面向用户的主体描述，如果产品不是以 Red Hat 身份提供遥测服务，应替换主体。 | 相关图表直接删除。                                                                        | 相关图表直接删除                  |


## 按词分类结果

### `OpenShift`

命中路由：

- `/main/systemconfig`

代表性片段：

- `Core system Components found in core Openshift and Kubernetes namespaces are included in the platform definition by default.`

### `OCP`

在本次已审计页面的正文可见文本中未发现。

### `RHACS`

命中路由：

- `/main/clusters/cluster-registration-secrets`
- `/main/integrations/signatureIntegrations/signature/create`

代表性片段：

- `please consult the RHACS documentation for details`
- `For more information, see RHACS documentation`

### `Red Hat`

命中路由：

- `/main/policy-management/policies`
- `/main/systemconfig`

代表性片段：

- `Red Hat images must be signed by a Red Hat release key`
- `Red Hat layered products`
- `Online telemetry data collection allows Red Hat to use anonymized information ...`

## 结果解读

当前 UI 中的上游残留大致可以分成三类：

1. 上游集成名或策略名
  比如 `Red Hat images must be signed by a Red Hat release key`
2. 上游文档引用
  比如 `RHACS documentation`
3. 上游平台分类说明
  比如 `Red Hat layered products`、`Openshift and Kubernetes namespaces`

## 建议的后续处理顺序

如果后续要继续清理，建议按下面顺序推进：

1. 帮助文案中的 `RHACS documentation`
2. 集成和策略列表里的 `OpenShift` / `Red Hat`
3. 系统配置里的平台分类说明
