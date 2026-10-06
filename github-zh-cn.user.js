// ==UserScript==
// @name         GitHub 中文汉化
// @namespace    https://github.com/
// @version      1.1.0
// @description  将 GitHub 界面翻译为简体中文。只翻译界面文字，不改动代码、README、评论、仓库名等用户内容。
// @author       geekerrui
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * 设置（开关存储在油猴的存储里，没有油猴 API 时默认开启）
   * ------------------------------------------------------------------ */
  const hasGM = typeof GM_getValue === 'function' && typeof GM_setValue === 'function';
  const getSetting = (key, def) => (hasGM ? GM_getValue(key, def) : def);
  const setSetting = (key, val) => hasGM && GM_setValue(key, val);

  const enabled = getSetting('enabled', true);

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand(enabled ? '❌ 关闭汉化（刷新生效）' : '✅ 开启汉化（刷新生效）', () => {
      setSetting('enabled', !enabled);
      location.reload();
    });
  }
  if (!enabled) return;

  /* ------------------------------------------------------------------ *
   * 词典：精确匹配（匹配前会去掉首尾空白并把连续空白合并成一个空格）
   * ------------------------------------------------------------------ */
  const DICT = {
    // ---------- 顶部导航 / 全局菜单 ----------
    'Dashboard': '仪表板',
    'Home': '主页',
    'Explore': '探索',
    'Marketplace': '市场',
    'Notifications': '通知',
    'Search or jump to...': '搜索或跳转到…',
    'Search or jump to…': '搜索或跳转到…',
    'Type / to search': '输入 / 进行搜索',
    'Command palette': '命令面板',
    'Sign in': '登录',
    'Sign up': '注册',
    'Sign out': '退出登录',
    'Sign in to GitHub': '登录 GitHub',
    'Create new...': '新建…',
    'Create new…': '新建…',
    'New repository': '新建仓库',
    'Import repository': '导入仓库',
    'New codespace': '新建代码空间',
    'New gist': '新建 Gist',
    'New organization': '新建组织',
    'New project': '新建项目',
    'Set status': '设置状态',
    'Edit status': '编辑状态',
    'Your profile': '你的个人资料',
    'Profile': '个人资料',
    'Your repositories': '你的仓库',
    'Your projects': '你的项目',
    'Your stars': '你的星标',
    'Your gists': '你的 Gist',
    'Your organizations': '你的组织',
    'Your enterprises': '你的企业',
    'Your sponsors': '你的赞助者',
    'Your Copilot': '你的 Copilot',
    'Feature preview': '功能预览',
    'Try Enterprise': '试用企业版',
    'Upgrade': '升级',
    'Free': '免费',
    'GitHub Docs': 'GitHub 文档',
    'GitHub Community': 'GitHub 社区',
    'GitHub Support': 'GitHub 支持',
    'Add account': '添加账户',
    'Switch account': '切换账户',
    'Open global navigation menu': '打开全局导航菜单',
    'Open user navigation menu': '打开用户导航菜单',
    'Open user account menu': '打开用户账户菜单',
    'You have no unread notifications': '你没有未读通知',
    'You have unread notifications': '你有未读通知',
    'Homepage': '主页',
    'Skip to content': '跳到正文',
    'Chat with Copilot': '与 Copilot 聊天',
    'Open Copilot…': '打开 Copilot…',

    // ---------- 通用按钮 / 词汇 ----------
    'Loading': '加载中',
    'Loading...': '加载中…',
    'Loading…': '加载中…',
    'Learn more': '了解更多',
    'Learn more.': '了解更多。',
    'Dismiss': '忽略',
    'Retry': '重试',
    'Copy': '复制',
    'Copied!': '已复制！',
    'Copy to clipboard': '复制到剪贴板',
    'Back': '返回',
    'Next': '下一页',
    'Previous': '上一页',
    'Newer': '较新',
    'Older': '较旧',
    'Apply': '应用',
    'Reset': '重置',
    'Submit': '提交',
    'Continue': '继续',
    'Confirm': '确认',
    'Cancel': '取消',
    'Close': '关闭',
    'Save': '保存',
    'Save changes': '保存更改',
    'Edit': '编辑',
    'Delete': '删除',
    'Remove': '移除',
    'Add': '添加',
    'Create': '创建',
    'Update': '更新',
    'Updated': '更新于',
    'Search': '搜索',
    'Filter': '筛选',
    'Filters': '筛选器',
    'Sort': '排序',
    'Sort by': '排序方式',
    'Clear': '清除',
    'Clear filter': '清除筛选',
    'Clear filters': '清除筛选',
    'More': '更多',
    'Less': '更少',
    'View all': '查看全部',
    'See all': '查看全部',
    'Show more': '显示更多',
    'Show less': '收起',
    'Show all': '显示全部',
    'Expand': '展开',
    'Collapse': '折叠',
    'Expand all': '全部展开',
    'Collapse all': '全部折叠',
    'Options': '选项',
    'Download': '下载',
    'Upload': '上传',
    'Share': '分享',
    'Report': '举报',
    'Help': '帮助',
    'Feedback': '反馈',
    'Give feedback': '提供反馈',
    'Beta': '测试版',
    'New': '新建',
    'Preview': '预览',
    'Today': '今天',
    'Yesterday': '昨天',
    'Yes': '是',
    'No': '否',
    'OK': '确定',
    'or': '或',
    'and': '和',
    'Name': '名称',
    'Description': '描述',
    'Type': '类型',
    'Language': '语言',
    'Languages': '语言',
    'Status': '状态',
    'Owner': '所有者',
    'Author': '作者',
    'Date': '日期',
    'All': '全部',
    'None': '无',
    'Public': '公开',
    'Private': '私有',
    'Internal': '内部',
    'Public archive': '公开归档',
    'Private archive': '私有归档',
    'Template': '模板',
    'Public template': '公开模板',
    'Archived': '已归档',
    'Pinned': '已置顶',
    'Pin': '置顶',
    'Unpin': '取消置顶',
    'Sponsor': '赞助',
    'Follow': '关注',
    'Unfollow': '取消关注',
    'Uh oh!': '糟糕！',
    'There was an error while loading. Please reload this page.': '加载时出错，请刷新页面。',
    'Something went wrong.': '出了点问题。',
    'Unread': '未读',
    'Select all': '全选',

    // ---------- 仓库导航标签 ----------
    'Code': '代码',
    'Issues': '议题',
    'Pull requests': '拉取请求',
    'Pull request': '拉取请求',
    'Discussions': '讨论',
    'Actions': '操作',
    'Projects': '项目',
    'Wiki': 'Wiki',
    'Security': '安全',
    'Insights': '洞察',
    'Settings': '设置',
    'Additional navigation options': '更多导航选项',

    // ---------- 仓库首页 ----------
    'Watch': '关注',
    'Unwatch': '取消关注',
    'Fork': '复刻',
    'Forks': '复刻',
    'Star': '星标',
    'Stars': '星标',
    'Starred': '已星标',
    'Unstar': '取消星标',
    'stars': '星标',
    'star': '星标',
    'forks': '复刻',
    'fork': '复刻',
    'watching': '人关注',
    'Go to file': '转到文件',
    'Add file': '添加文件',
    'Create new file': '新建文件',
    'Upload files': '上传文件',
    'Clone': '克隆',
    'Local': '本地',
    'Codespaces': '代码空间',
    'Download ZIP': '下载 ZIP',
    'Open with GitHub Desktop': '使用 GitHub Desktop 打开',
    'Open with Visual Studio': '使用 Visual Studio 打开',
    'Copy url to clipboard': '复制链接到剪贴板',
    'Clone using the web URL.': '使用 Web URL 克隆。',
    'Use a password-protected SSH key.': '使用受密码保护的 SSH 密钥。',
    'Work fast with our official CLI.': '使用官方 CLI 快速工作。',
    'About': '关于',
    'Readme': '自述文件',
    'README': '自述文件',
    'License': '许可证',
    'Code of conduct': '行为准则',
    'Contributing': '贡献指南',
    'Security policy': '安全策略',
    'Activity': '活动',
    'Custom properties': '自定义属性',
    'Report repository': '举报仓库',
    'Releases': '发行版',
    'Latest': '最新',
    'Pre-release': '预发行版',
    'Draft': '草稿',
    'Packages': '软件包',
    'No packages published': '尚未发布软件包',
    'Publish your first package': '发布你的第一个软件包',
    'No releases published': '尚未发布发行版',
    'Create a new release': '创建新发行版',
    'Draft a new release': '起草新发行版',
    'Contributors': '贡献者',
    'Deployments': '部署',
    'Environments': '环境',
    'Used by': '被使用',
    'Branches': '分支',
    'Branch': '分支',
    'Tags': '标签',
    'Tag': '标签',
    'Last commit message': '最近提交信息',
    'Last commit date': '最近提交日期',
    'History': '历史',
    'Commits': '提交',
    'commits': '次提交',
    'Switch branches/tags': '切换分支/标签',
    'Find or create a branch…': '查找或创建分支…',
    'Find a branch...': '查找分支…',
    'Find a tag': '查找标签',
    'View all branches': '查看所有分支',
    'View all tags': '查看所有标签',
    'default': '默认',
    'Default': '默认',
    'Copy path': '复制路径',
    'Copy permalink': '复制永久链接',
    'Raw': '原始',
    'Blame': '追溯',
    'Download raw file': '下载原始文件',
    'Edit file': '编辑文件',
    'Delete file': '删除文件',
    'View file': '查看文件',
    'Symbols': '符号',
    'Find symbol': '查找符号',
    'Top': '顶部',
    'Files': '文件',
    'Go to file…': '转到文件…',
    'Search this repository': '搜索此仓库',
    'Commit changes': '提交更改',
    'Commit changes...': '提交更改…',
    'Commit message': '提交信息',
    'Extended description': '扩展描述',
    'Edit repository details': '编辑仓库详情',
    'No description, website, or topics provided.': '未提供描述、网站或主题。',
    'This branch is up to date with': '此分支已与以下分支同步：',
    'Sync fork': '同步复刻',
    'Contribute': '贡献',
    'Compare & pull request': '比较并发起拉取请求',
    'Open pull request': '发起拉取请求',
    'Recent commits': '最近的提交',
    'Browse files': '浏览文件',
    'Browse the repository at this point in the history': '浏览此历史时刻的仓库',
    'Verified': '已验证',
    'Unverified': '未验证',
    'Partially verified': '部分验证',
    'Outline': '大纲',
    'Lines': '行',
    'Jump to': '跳转到',

    // ---------- 议题 / 拉取请求 ----------
    'New issue': '新建议题',
    'New pull request': '新建拉取请求',
    'Labels': '标签',
    'Label': '标签',
    'Milestones': '里程碑',
    'Milestone': '里程碑',
    'Open': '打开',
    'Closed': '已关闭',
    'Merged': '已合并',
    'Assignee': '受理人',
    'Assignees': '受理人',
    'Reviewers': '审查者',
    'Reviews': '审查',
    'Newest': '最新',
    'Oldest': '最早',
    'Most commented': '评论最多',
    'Least commented': '评论最少',
    'Recently updated': '最近更新',
    'Least recently updated': '最早更新',
    'Best match': '最佳匹配',
    'Development': '开发',
    'Participants': '参与者',
    'Subscribe': '订阅',
    'Unsubscribe': '取消订阅',
    'Lock conversation': '锁定对话',
    'Unlock conversation': '解锁对话',
    'Pin issue': '置顶议题',
    'Unpin issue': '取消置顶议题',
    'Transfer issue': '转移议题',
    'Delete issue': '删除议题',
    'Close issue': '关闭议题',
    'Reopen issue': '重新打开议题',
    'Close with comment': '评论并关闭',
    'Close as completed': '以已完成关闭',
    'Close as not planned': '以不计划关闭',
    'Close pull request': '关闭拉取请求',
    'Reopen pull request': '重新打开拉取请求',
    'Comment': '评论',
    'Add a comment': '添加评论',
    'Leave a comment': '发表评论',
    'Write': '编写',
    'Add your comment here...': '在此添加评论…',
    'Use Markdown to format your comment': '使用 Markdown 格式化你的评论',
    'Markdown is supported': '支持 Markdown',
    'Paste, drop, or click to add files': '粘贴、拖放或点击以添加文件',
    'Nothing to preview': '没有可预览的内容',
    'Title': '标题',
    'Submit new issue': '提交新议题',
    'Create issue': '创建议题',
    'Create pull request': '创建拉取请求',
    'Create draft pull request': '创建草稿拉取请求',
    'Conversation': '对话',
    'Checks': '检查',
    'Files changed': '文件变更',
    'Merge pull request': '合并拉取请求',
    'Squash and merge': '压缩并合并',
    'Rebase and merge': '变基并合并',
    'Create a merge commit': '创建合并提交',
    'Confirm merge': '确认合并',
    'Confirm squash and merge': '确认压缩并合并',
    'Confirm rebase and merge': '确认变基并合并',
    'Delete branch': '删除分支',
    'Restore branch': '恢复分支',
    'Ready for review': '准备审查',
    'Convert to draft': '转换为草稿',
    'Approve': '批准',
    'Request changes': '请求更改',
    'Review changes': '审查更改',
    'Submit review': '提交审查',
    'Add review': '添加审查',
    'Start a review': '开始审查',
    'Add single comment': '添加单条评论',
    'Resolve conversation': '解决对话',
    'Unresolve conversation': '取消解决对话',
    'Outdated': '已过时',
    'Viewed': '已查看',
    'Load diff': '加载差异',
    'Show comments': '显示评论',
    'Hide comments': '隐藏评论',
    'Unified': '统一视图',
    'Split': '分栏视图',
    'Hide whitespace': '隐藏空白',
    'Apply and reload': '应用并刷新',
    'None yet': '暂无',
    'No one assigned': '无人受理',
    'No one—': '无人 — ',
    'assign yourself': '分配给自己',
    'No milestone': '无里程碑',
    'No branches or pull requests': '没有分支或拉取请求',
    'No reviews': '暂无审查',
    'No labels': '无标签',
    'Contributor': '贡献者',
    'Member': '成员',
    'Collaborator': '协作者',
    'opened': '打开了',
    'closed': '关闭了',
    'merged': '合并了',
    'commented': '评论了',
    'reopened': '重新打开了',
    'opened this issue': '打开了此议题',
    'closed this': '关闭了此项',
    'added the': '添加了',
    'removed the': '移除了',
    'label': '标签',
    'labels': '标签',
    'mentioned this': '提及了此项',
    'self-assigned this': '将此分配给自己',
    'linked a pull request that will close this issue': '关联了一个将关闭此议题的拉取请求',
    'Linked pull requests': '关联的拉取请求',
    'Successfully merging this pull request may close these issues.': '成功合并此拉取请求可能会关闭这些议题。',
    'This branch has no conflicts with the base branch': '此分支与基础分支没有冲突',
    'Merging can be performed automatically.': '可以自动合并。',
    'All checks have passed': '所有检查均已通过',
    'Some checks were not successful': '部分检查未成功',
    'Some checks haven’t completed yet': '部分检查尚未完成',
    'This branch has conflicts that must be resolved': '此分支存在必须解决的冲突',
    'Resolve conflicts': '解决冲突',
    'Update branch': '更新分支',
    'Review required': '需要审查',
    'Changes approved': '更改已批准',
    'Changes requested': '已请求更改',
    'Edit title': '编辑标题',
    'Quote reply': '引用回复',
    'Copy link': '复制链接',
    'Reference in new issue': '在新议题中引用',
    'Report content': '举报内容',
    'Hide': '隐藏',
    'Edited': '已编辑',
    'edited': '已编辑',
    'Pick your reaction': '选择表情回应',
    'Add or remove reactions': '添加或移除表情回应',
    'Issue type': '议题类型',
    'Relationships': '关系',
    'Sub-issues': '子议题',
    'Create sub-issue': '创建子议题',
    'Add sub-issue': '添加子议题',
    'Parent issue': '父议题',
    'Fields': '字段',
    'Assign to Copilot': '分配给 Copilot',

    // ---------- Actions ----------
    'All workflows': '所有工作流',
    'Workflows': '工作流',
    'New workflow': '新建工作流',
    'Management': '管理',
    'Caches': '缓存',
    'Attestations': '证明',
    'Runners': '运行器',
    'Usage metrics': '使用指标',
    'Performance metrics': '性能指标',
    'Filter workflow runs': '筛选工作流运行',
    'Event': '事件',
    'Actor': '执行者',
    'Re-run all jobs': '重新运行所有作业',
    'Re-run failed jobs': '重新运行失败的作业',
    'Re-run jobs': '重新运行作业',
    'Cancel workflow': '取消工作流',
    'Run workflow': '运行工作流',
    'Summary': '摘要',
    'Jobs': '作业',
    'Run details': '运行详情',
    'Usage': '使用情况',
    'Workflow file': '工作流文件',
    'Artifacts': '制品',
    'Annotations': '注释',
    'Success': '成功',
    'Failure': '失败',
    'Queued': '排队中',
    'In progress': '进行中',
    'Completed': '已完成',
    'Cancelled': '已取消',
    'Skipped': '已跳过',
    'Total duration': '总耗时',
    'Triggered via push': '通过推送触发',
    'Triggered via pull request': '通过拉取请求触发',
    'Triggered via schedule': '通过计划任务触发',
    'Manually triggered': '手动触发',
    'Disable workflow': '禁用工作流',
    'Enable workflow': '启用工作流',
    'View workflow file': '查看工作流文件',
    'Search logs': '搜索日志',
    'Set up job': '设置作业',
    'Complete job': '完成作业',

    // ---------- 洞察 ----------
    'Pulse': '统计',
    'Community': '社区',
    'Community standards': '社区标准',
    'Traffic': '流量',
    'Code frequency': '代码频率',
    'Dependency graph': '依赖关系图',
    'Network': '网络',
    'Dependencies': '依赖项',
    'Dependents': '依赖者',
    'Overview': '概览',

    // ---------- 安全 ----------
    'Security overview': '安全概览',
    'Security advisories': '安全公告',
    'Dependabot alerts': 'Dependabot 警报',
    'Code scanning': '代码扫描',
    'Secret scanning': '密钥扫描',
    'Private vulnerability reporting': '私密漏洞报告',
    'Reporting': '报告',
    'Policy': '策略',
    'Advisories': '公告',
    'Vulnerability alerts': '漏洞警报',
    'Enable': '启用',
    'Disable': '禁用',
    'Enabled': '已启用',
    'Disabled': '已禁用',

    // ---------- 仓库设置 ----------
    'General': '常规',
    'Access': '访问',
    'Collaborators': '协作者',
    'Collaborators and teams': '协作者和团队',
    'Moderation options': '审核选项',
    'Code and automation': '代码与自动化',
    'Rules': '规则',
    'Rulesets': '规则集',
    'Webhooks': 'Web 钩子',
    'Pages': 'Pages',
    'Secrets and variables': '密钥和变量',
    'Deploy keys': '部署密钥',
    'Integrations': '集成',
    'GitHub Apps': 'GitHub 应用',
    'Email notifications': '邮件通知',
    'Danger Zone': '危险区域',
    'Change visibility': '更改可见性',
    'Change repository visibility': '更改仓库可见性',
    'Transfer': '转移',
    'Transfer ownership': '转移所有权',
    'Archive this repository': '归档此仓库',
    'Unarchive this repository': '取消归档此仓库',
    'Delete this repository': '删除此仓库',
    'Repository name': '仓库名称',
    'Rename': '重命名',
    'Features': '功能',
    'Default branch': '默认分支',
    'Social preview': '社交预览',
    'Branch protection rules': '分支保护规则',
    'Add rule': '添加规则',
    'Add branch ruleset': '添加分支规则集',
    'Add webhook': '添加 Web 钩子',
    'Add deploy key': '添加部署密钥',
    'New repository secret': '新建仓库密钥',
    'New repository variable': '新建仓库变量',
    'Secrets': '密钥',
    'Variables': '变量',
    'Add people': '添加成员',
    'Manage access': '管理访问',

    // ---------- 个人资料 ----------
    'Repositories': '仓库',
    'Repository': '仓库',
    'Followers': '关注者',
    'Following': '关注中',
    'followers': '关注者',
    'follower': '关注者',
    'following': '关注中',
    'Edit profile': '编辑个人资料',
    'Block or Report': '屏蔽或举报',
    'Block or report': '屏蔽或举报',
    'Achievements': '成就',
    'Highlights': '亮点',
    'Organizations': '组织',
    'Popular repositories': '热门仓库',
    'Customize your pins': '自定义置顶',
    'Contribution activity': '贡献活动',
    'Contribution settings': '贡献设置',
    'Learn how we count contributions': '了解我们如何统计贡献',
    'Show more activity': '显示更多活动',
    'Find a repository…': '查找仓库…',
    'Find a repository...': '查找仓库…',
    'Find a star…': '查找星标…',
    'Sources': '源仓库',
    'Mirrors': '镜像',
    'Templates': '模板',
    'Last updated': '最近更新',
    'Sponsoring': '赞助中',
    'Lists': '列表',
    'Create list': '创建列表',
    'Starred repositories': '已星标的仓库',
    'Private contributions': '私有贡献',
    'Activity overview': '活动概览',
    'Contributed to': '贡献于',
    'Code review': '代码审查',
    'Created': '已创建',
    'Created a pull request in': '创建了拉取请求，位于',
    'Opened an issue in': '打开了议题，位于',
    'Mon': '周一',
    'Wed': '周三',
    'Fri': '周五',
    'Jan': '1月',
    'Feb': '2月',
    'Mar': '3月',
    'Apr': '4月',
    'May': '5月',
    'Jun': '6月',
    'Jul': '7月',
    'Aug': '8月',
    'Sep': '9月',
    'Oct': '10月',
    'Nov': '11月',
    'Dec': '12月',

    // ---------- 仪表板 ----------
    'Top repositories': '常用仓库',
    'Top Repositories': '常用仓库',
    'Recent activity': '最近活动',
    'Latest changes': '最新变更',
    'View changelog →': '查看更新日志 →',
    'Explore repositories': '探索仓库',
    'Explore more →': '探索更多 →',
    'For you': '为你推荐',
    'Trending repositories': '热门仓库',
    'Ask Copilot': '询问 Copilot',
    'Start a new repository': '新建一个仓库',
    'Create repository': '创建仓库',
    'Create a new repository': '创建新仓库',
    'Description (optional)': '描述（可选）',
    'Add a README file': '添加 README 文件',
    'Add README': '添加 README',
    'Add .gitignore': '添加 .gitignore',
    'Choose a license': '选择许可证',
    'Add license': '添加许可证',
    'Visibility': '可见性',
    'Configuration': '配置',
    'General settings': '常规设置',
    'Recent': '最近',
    'Updates to your homepage feed': '主页动态更新',

    // ---------- 通知 ----------
    'Inbox': '收件箱',
    'Saved': '已保存',
    'Done': '已完成',
    'Assigned': '已分配',
    'Participating': '参与的',
    'Mentioned': '被提及',
    'Team mentioned': '团队被提及',
    'Review requested': '请求审查',
    'Manage notifications': '管理通知',
    'Notification settings': '通知设置',
    'Watched repositories': '关注的仓库',
    'Subscriptions': '订阅',
    'Mark as read': '标记为已读',
    'Mark as unread': '标记为未读',
    'Mark as done': '标记为已完成',
    'Group by: Date': '分组方式：日期',
    'Group by: Repository': '分组方式：仓库',
    'All caught up!': '全部处理完毕！',
    'Take a break, write some code, do what you do best.': '休息一下，写点代码，做你最擅长的事。',
    'Custom': '自定义',
    'Participating and @mentions': '参与和 @提及',
    'All Activity': '所有活动',
    'Ignore': '忽略',

    // ---------- 搜索 ----------
    'Filter by': '筛选条件',
    'Users': '用户',
    'Wikis': 'Wiki',
    'Topics': '主题',
    'Advanced': '高级',
    'Advanced search': '高级搜索',
    'More languages...': '更多语言…',
    'Sort by: Best match': '排序：最佳匹配',
    'Most stars': '星标最多',
    'Fewest stars': '星标最少',
    'Most forks': '复刻最多',
    'Fewest forks': '复刻最少',
    'Save search': '保存搜索',
    'Saved searches': '已保存的搜索',
    'Search syntax tips': '搜索语法技巧',
    'Your search did not match any': '你的搜索没有匹配到任何',

    // ---------- 探索 / 趋势 ----------
    'Trending': '热门',
    'Collections': '集合',
    'Events': '活动',
    'GitHub Sponsors': 'GitHub 赞助',
    'Get email updates': '获取邮件更新',
    'Spoken Language:': '语言：',
    'Language:': '编程语言：',
    'Date range:': '时间范围：',
    'This week': '本周',
    'This month': '本月',
    'Built by': '构建者',
    'Developers': '开发者',
    'Popular repo': '热门仓库',

    // ---------- 讨论 ----------
    'New discussion': '新建讨论',
    'Categories': '分类',
    'Announcements': '公告',
    'Ideas': '想法',
    'Polls': '投票',
    'Q&A': '问答',
    'Show and tell': '展示与分享',
    'Answered': '已回答',
    'Unanswered': '未回答',
    'Mark as answer': '标记为答案',
    'Unmark as answer': '取消标记为答案',
    'Most helpful': '最有帮助',
    'Top: Past day': '热门：过去一天',
    'Top: Past week': '热门：过去一周',
    'Top: Past month': '热门：过去一个月',
    'Top: Past year': '热门：过去一年',
    'Top: All': '热门：全部',
    'Latest activity': '最新活动',
    'Date created': '创建日期',
    'Upvote': '赞同',

    // ---------- 个人设置 ----------
    'Public profile': '公开资料',
    'Account': '账户',
    'Appearance': '外观',
    'Accessibility': '无障碍',
    'Billing and licensing': '账单与许可',
    'Billing and plans': '账单与计划',
    'Emails': '电子邮件',
    'Password and authentication': '密码与身份验证',
    'Sessions': '会话',
    'SSH and GPG keys': 'SSH 与 GPG 密钥',
    'Moderation': '审核',
    'Blocked users': '已屏蔽的用户',
    'Interaction limits': '互动限制',
    'Code review limits': '代码审查限制',
    'Saved replies': '快捷回复',
    'Code security': '代码安全',
    'Code security and analysis': '代码安全与分析',
    'Applications': '应用',
    'Scheduled reminders': '定时提醒',
    'Archives': '归档',
    'Security log': '安全日志',
    'Sponsorship log': '赞助日志',
    'Developer settings': '开发者设置',
    'Update profile': '更新个人资料',
    'Profile picture': '头像',
    'Public email': '公开邮箱',
    'Bio': '个人简介',
    'Pronouns': '代词',
    'URL': '网址',
    'Company': '公司',
    'Location': '位置',
    'Social accounts': '社交账户',
    'Personal access tokens': '个人访问令牌',
    'Fine-grained tokens': '细粒度令牌',
    'Tokens (classic)': '令牌（经典）',
    'OAuth Apps': 'OAuth 应用',
    'Generate new token': '生成新令牌',
    'Theme mode': '主题模式',
    'Single theme': '单一主题',
    'Sync with system': '与系统同步',
    'Day theme': '日间主题',
    'Night theme': '夜间主题',
    'Light default': '浅色默认',
    'Dark default': '深色默认',
    'Emoji skin tone preference': '表情肤色偏好',
    'Tab size preference': '制表符宽度偏好',
    'Markdown editor font preference': 'Markdown 编辑器字体偏好',
    'Change username': '更改用户名',
    'Delete account': '删除账户',
    'Export account data': '导出账户数据',
    'Two-factor authentication': '双重身份验证',
    'Passkeys': '通行密钥',
    'Change password': '更改密码',
    'New SSH key': '新建 SSH 密钥',
    'New GPG key': '新建 GPG 密钥',
    'Add email address': '添加邮箱地址',
    'Primary email address': '主邮箱地址',
    'Keyboard shortcuts': '键盘快捷键',

    // ---------- Gist ----------
    'All gists': '所有 Gist',
    'Your Gists': '你的 Gist',
    'Starred gists': '已星标的 Gist',
    'Create secret gist': '创建私密 Gist',
    'Create public gist': '创建公开 Gist',
    'Embed': '嵌入',
    'Revisions': '修订',
    'Secret': '私密',

    // ---------- 页脚 ----------
    'Terms': '条款',
    'Privacy': '隐私',
    'Docs': '文档',
    'Contact': '联系我们',
    'Contact GitHub': '联系 GitHub',
    'Manage cookies': '管理 Cookie',
    'Do not share my personal information': '不要分享我的个人信息',
    'Pricing': '价格',
    'Blog': '博客',
    'Training': '培训',
    'API': 'API',
  };

  /* ------------------------------------------------------------------ *
   * 正则规则：处理带数字/变量的文本
   * ------------------------------------------------------------------ */
  const N = '([\\d,.]+[kKmM]?)';
  const REGEX_RULES = [
    [new RegExp(`^${N} stars?$`), '$1 星标'],
    [new RegExp(`^${N} forks?$`), '$1 复刻'],
    [new RegExp(`^${N} watching$`), '$1 人关注'],
    [new RegExp(`^${N} commits?$`), '$1 次提交'],
    [new RegExp(`^${N} Commits?$`), '$1 次提交'],
    [new RegExp(`^${N} branch(?:es)?$`), '$1 个分支'],
    [new RegExp(`^${N} Branch(?:es)?$`), '$1 个分支'],
    [new RegExp(`^${N} tags?$`), '$1 个标签'],
    [new RegExp(`^${N} Tags?$`), '$1 个标签'],
    [new RegExp(`^${N} releases?$`), '$1 个发行版'],
    [new RegExp(`^${N} contributors?$`), '$1 位贡献者'],
    [new RegExp(`^${N} followers?$`), '$1 位关注者'],
    [new RegExp(`^${N} following$`), '关注 $1 人'],
    [new RegExp(`^${N} repositor(?:y|ies)$`), '$1 个仓库'],
    [new RegExp(`^${N} results?$`), '$1 个结果'],
    [new RegExp(`^${N} comments?$`), '$1 条评论'],
    [new RegExp(`^${N} participants?$`), '$1 位参与者'],
    [new RegExp(`^${N} files?$`), '$1 个文件'],
    [new RegExp(`^${N} Open$`), '$1 个打开'],
    [new RegExp(`^${N} Closed$`), '$1 个已关闭'],
    [new RegExp(`^${N} open$`), '$1 个打开'],
    [new RegExp(`^${N} closed$`), '$1 个已关闭'],
    [new RegExp(`^${N} workflow runs?$`), '$1 个工作流运行'],
    [new RegExp(`^${N} stars? today$`), '今日 $1 星标'],
    [new RegExp(`^${N} stars? this week$`), '本周 $1 星标'],
    [new RegExp(`^${N} stars? this month$`), '本月 $1 星标'],
    [new RegExp(`^${N} contributions? in the last year$`), '过去一年共 $1 次贡献'],
    [new RegExp(`^${N} contributions? in (\\d{4})$`), '$2 年共 $1 次贡献'],
    [new RegExp(`^${N} of ${N} tasks?$`), '$1/$2 项任务'],
    [new RegExp(`^${N} tasks? done$`), '已完成 $1 项任务'],
    [new RegExp(`^${N} (?:new )?notifications?$`), '$1 条通知'],
    [new RegExp(`^${N} changed files?$`), '$1 个文件变更'],
    [new RegExp(`^${N} additions?$`), '$1 处新增'],
    [new RegExp(`^${N} deletions?$`), '$1 处删除'],
    [new RegExp(`^${N} lines? \\(${N} loc\\)$`), '$1 行（$2 行代码）'],
    [new RegExp(`^${N} lines?$`), '$1 行'],
    [new RegExp(`^Showing ${N} changed files? with ${N} additions? and ${N} deletions?\\.?$`),
      '显示 $1 个变更文件，新增 $2 处，删除 $3 处'],
    [new RegExp(`^${N} participants?$`), '$1 位参与者'],
    [new RegExp(`^Used by ${N}$`), '被 $1 个仓库使用'],
    [/^Contributors ([\d,]+)$/, '贡献者 $1'],
    [/^Search (.+)$/, (m, s) => (/^[\w.-]+(\/[\w.-]+)?$/.test(s) ? `搜索 ${s}` : m)],
    [/^Starred by (.+)$/, '星标者：$1'],
  ];

  /* ------------------------------------------------------------------ *
   * 不翻译的区域：代码、Markdown 正文、评论、标题、用户名、文件名等
   * ------------------------------------------------------------------ */
  const SKIP_SELECTOR = [
    'script', 'style', 'noscript', 'textarea', 'pre', 'code', 'kbd', 'samp', 'svg',
    '[contenteditable="true"]', '[translate="no"]', '.notranslate',
    '.markdown-body', '.comment-body', '.js-comment-body', '.markdown-title',
    '.blob-code', '.blob-wrapper', '.blob-num', '.react-code-lines', '.react-code-text',
    '.react-blob-print-hide', '.react-file-line', '.highlight',
    '.cm-editor', '.CodeMirror', '.monaco-editor', '.diff-table', '.js-file-content',
    '.js-issue-title', '[data-testid="issue-title"]', '.commit-title', '.commit-desc',
    '.react-directory-filename-column', '.react-directory-commit-message',
    '.user-profile-bio', '.p-name', '.p-nickname', '.vcard-names',
    '.AppHeader-context-item-label', '.css-truncate-target', '.ref-selector-item-text',
    '.IssueLabel', '.topic-tag', '.file-info',
    '[data-hovercard-type="user"]', '[data-hovercard-type="organization"]',
    '[data-hovercard-type="repository"]', '[data-hovercard-type="issue"]',
    '[data-hovercard-type="pull_request"]', '[data-hovercard-type="commit"]',
  ].join(',');

  const ATTRS = ['placeholder', 'aria-label', 'title', 'data-placeholder'];

  /* ------------------------------------------------------------------ *
   * 翻译核心
   * ------------------------------------------------------------------ */
  const exactMap = new Map(Object.entries(DICT).map(([k, v]) => [k.trim(), v]));
  const lowerMap = new Map();
  for (const [k, v] of exactMap) {
    const lk = k.toLowerCase();
    if (!lowerMap.has(lk)) lowerMap.set(lk, v);
  }
  const HAS_LATIN = /[a-zA-Z]/;

  function translateText(raw) {
    if (!raw || !HAS_LATIN.test(raw)) return null;
    const text = raw.replace(/\s+/g, ' ').trim();
    if (!text || text.length > 300) return null;

    let hit = exactMap.get(text);
    if (hit === undefined) hit = lowerMap.get(text.toLowerCase());
    if (hit !== undefined) return hit;

    for (const [re, rep] of REGEX_RULES) {
      if (re.test(text)) {
        const out = text.replace(re, rep);
        if (out !== text) return out;
      }
    }
    return null;
  }

  // 保留原文首尾空白，只替换中间内容
  function translateKeepSpace(raw) {
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(raw);
    const t = translateText(m[2]);
    return t === null ? null : m[1] + t + m[3];
  }

  function isSkipped(el) {
    return !el || el.closest(SKIP_SELECTOR) !== null;
  }

  function translateTextNode(node) {
    const out = translateKeepSpace(node.data);
    if (out !== null && out !== node.data) node.data = out;
  }

  function translateAttrs(el) {
    for (const attr of ATTRS) {
      const v = el.getAttribute(attr);
      if (v) {
        const t = translateText(v);
        if (t !== null && t !== v) el.setAttribute(attr, t);
      }
    }
    if (el.tagName === 'INPUT' && /^(submit|button|reset)$/i.test(el.type) && el.value) {
      const t = translateText(el.value);
      if (t !== null) el.value = t;
    }
  }

  // 让 GitHub 的 <relative-time> 组件直接用中文渲染（“3 天前”、“2024年1月5日”）
  function localizeTimeElement(el) {
    if (el.getAttribute('lang') !== 'zh-CN') el.setAttribute('lang', 'zh-CN');
    if (!el.hasAttribute('prefix')) el.setAttribute('prefix', '');
  }

  const TIME_TAGS = new Set(['RELATIVE-TIME', 'TIME-AGO', 'TIME-UNTIL', 'LOCAL-TIME']);

  function walk(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      if (!isSkipped(root.parentElement)) translateTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE) {
      if (TIME_TAGS.has(root.tagName)) localizeTimeElement(root);
      if (isSkipped(root)) return;
      translateAttrs(root);
    }

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (TIME_TAGS.has(node.tagName)) localizeTimeElement(node);
            return node.matches(SKIP_SELECTOR) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      else translateAttrs(node);
    }
  }

  // 页面标题，例如 "Pull requests · owner/repo"
  function translateTitle() {
    const parts = document.title.split(' · ');
    let changed = false;
    const out = parts.map((p) => {
      const t = translateText(p);
      if (t !== null && t !== p) { changed = true; return t; }
      return p;
    });
    if (changed) document.title = out.join(' · ');
  }

  /* ------------------------------------------------------------------ *
   * 监听 DOM 变化（GitHub 是 Turbo + React 单页应用，内容会动态加载）
   * ------------------------------------------------------------------ */
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        for (const n of m.addedNodes) {
          if (n.nodeType === Node.ELEMENT_NODE) {
            if (n.parentElement && isSkipped(n.parentElement)) continue;
            walk(n);
          } else if (n.nodeType === Node.TEXT_NODE) {
            walk(n);
          }
        }
        if (m.target.nodeName === 'TITLE') translateTitle();
      } else if (m.type === 'characterData') {
        const n = m.target;
        if (n.parentElement && n.parentElement.nodeName === 'TITLE') translateTitle();
        else walk(n);
      } else if (m.type === 'attributes') {
        const el = m.target;
        if (!isSkipped(el)) translateAttrs(el);
      }
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRS,
  });

  function fullPass() {
    walk(document.body);
    translateTitle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fullPass, { once: true });
  } else {
    fullPass();
  }
  document.addEventListener('turbo:load', fullPass);
  document.addEventListener('turbo:render', fullPass);
  window.addEventListener('load', translateTitle);
})();
