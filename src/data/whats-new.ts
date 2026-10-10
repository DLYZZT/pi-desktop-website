export const whatsNew = [
  {
    id: "auto-routing",
    icon: "ph:git-branch",
    title: "Auto model routing",
    description: "Choose a fast model and a capable model. Auto routes each new request by thinking level or task complexity, and shows which model actually answered.",
    screenshot: "app-models",
    steps: [
      "Open Settings → Models → Auto routing. Enable Auto, choose both models and their thinking levels, then save and select Auto below the composer.",
      "Route by thinking level, or add a decision model to judge task complexity. Decision requests add latency and usage; if a decision fails, Auto uses the capable model.",
      "Tool continuations keep the selected model. You can enable trying the other configured model on an automatic retry and inspect usage by actual model.",
      "Routing changes apply to new or reloaded sessions, or after selecting Auto again.",
    ],
  },
  {
    id: "mcp",
    icon: "ph:plugs-connected",
    title: "MCP services",
    description: "Connect local and remote tools with stdio or Streamable HTTP. Import configurations, sign in with OAuth, test connections, and preview resources in Settings.",
    screenshot: "app-mcp",
    steps: [
      "Open Settings → MCP. Choose Global or Current project, then add a server or import its JSON configuration.",
      "Configure the stdio command or Streamable HTTP URL. Use OAuth or a provider credential reference when required, then test the connection.",
      "Browse tools, resources, and resource templates; preview resource content or reconnect a service from its details.",
      "Project entries override global entries with the same name. Extension sources and pending changes are displayed separately.",
      "Saving an MCP configuration does not authorize its tools. Grant access in the current session's tools menu; nested calls follow the same permissions.",
    ],
  },
  {
    id: "image-decision",
    icon: "ph:image",
    title: "Image generation and decisions",
    description: "Use Codemode to generate images, classify content, answer yes/no questions, or score results. Generated images stay available when you reopen the conversation.",
    steps: [
      "Configure an available image or decision model in Settings → Models, then enable Codemode in the session tools menu. Full access includes Codemode and tool search.",
      "Ask the Agent to generate an image or classify content. Image-capable decision models can also judge screenshots. These are auxiliary models, separate from the chat model picker.",
      "OpenAI decisions require an API key; ChatGPT subscription sign-in does not provide this capability. Add TypeSafe / Jev with its API key to use jev-latest.",
      "Provider details offer image and decision model tests, which may incur charges. Calls support cancellation and keep their inputs, results, state, and usage in session history.",
    ],
  },
  {
    id: "tool-history",
    icon: "ph:tree-structure",
    title: "Tools and execution history",
    description: "Follow direct and nested tool calls in a branch-aware execution tree. Inspect status, duration, inputs, and full results, even after reopening or compacting a session.",
    steps: [
      "The session tools menu controls model-visible entry points, tools available for nested discovery, and execution grants separately. Authorization changes sync to the runtime.",
      "Large results and temporary output are saved for paginated reading. The Agent can retrieve original content with tool_history_get after reopening or compaction.",
      "After an interruption, completed child calls are retained and unconfirmed results are marked interrupted or unknown. Recovery does not automatically replay operations.",
    ],
  },
] as const;

export const advancedSettings = [
  "Open Settings → Models → Advanced model settings to adjust automatic context compaction, reply token reserves, retained recent content, and per-model overrides.",
  "Configure Agent and provider retries, wait times, request timeouts, and automatic, SSE, WebSocket, or cached WebSocket transport.",
  "Model editing adds sampling parameters by thinking level, image and request input limits, and model ID overrides. Max reasoning is available on supported models.",
  "Advanced settings are shared with Pi CLI. Reload existing sessions to apply them; trusted project settings may override global values. Saving detects external edits to reduce conflicts.",
];

export const releaseImprovements = [
  "Pi Coding Agent is upgraded from 0.87.1 to 1.1.0, with guided API key, subscription, and OAuth setup, safer credential replacement, and migration of older Azure configuration.",
  "Stopped turns retain their status after reopening and no longer trigger completion sounds or notifications. Session switching, drafts, scrolling, and streaming are more reliable.",
  "Windows fixes cover MCP subprocess startup, environment handling, and paths with spaces or Chinese characters, alongside Herdr shutdown and runtime cleanup improvements.",
];

export const historyBackup = "Desktop tool permissions and execution records live in the application data directory. For a complete backup, keep its tool-executions logs and content files alongside ~/.pi/agent/.";
