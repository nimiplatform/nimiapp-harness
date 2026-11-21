# Nimi Harness

Nimi Harness is a Nimi-native desktop and Web companion workspace for multi-step tasks across code, documents, and local files, with transparent model selection and step-by-step tool approval.

## Getting Started

1. Install **Nimi Harness** from the Nimi Catalog on a supported desktop host (**Windows x64** or **macOS arm64**), sign in to **Nimi Home**, and make sure at least one Cloud connector or machine-local text model is ready in **Nimi Home → AI models**.
2. Launch **Nimi Harness** from Nimi Home. Click **New session** in the sidebar to start in an isolated session folder, or choose **New session in local folder…** to bind an existing project folder.
3. Choose a Cloud, Local, or Saved model in the composer (or keep the App default), attach files up to 32 MiB if needed, and press **Send**.

## Working in a Session

- **Cloud, Local & Saved Model Picker**: Open the model selector in the composer to filter **All**, **Cloud**, **Local**, and **Saved** routes or search across providers. Selecting a ready Cloud or Local model reuses a matching saved configuration or creates a named configuration for Nimi Harness and binds only that session to it.
- **Configuration Drift Recovery**: If a session's configuration changes externally while you are working (`AI_CONFIG_REVISION_CONFLICT`), Harness shows an inline confirmation banner inside the conversation so you can adopt the updated configuration in one click without losing history.
- **Reasoning Effort & Session Instructions**: Adjust reasoning effort directly in the composer when supported by the active model. Open **Inspector → Session** to review token usage, edit per-session instructions, or save and apply reusable instruction presets.
- **Step-by-Step Tool Approval**: In **Strict** mode, Harness auto-approves read and search tools and asks before file writes, edits, shell commands, web fetches, transcription, and integration calls. Inspect the unified diff or command preview and choose **Allow once**, **Allow for session**, **Request changes**, or **Decline**. **Auto-Edit** auto-approves writes and edits inside the session workspace while still asking for commands, external paths, and integrations. **Plan Only** blocks file mutations, commands, and write integration operations.
- **Files & Attachments**: Drop files onto the composer or click **Attach files** (up to 32 MiB each; PNG, JPEG, and WebP images can be sent to vision-capable models). Open **Inspector → Files** to browse the workspace, preview text, Markdown, or images, attach workspace files to a draft, or reveal files in your OS file manager.
- **Queue & Stop**: While a turn runs, queue follow-up prompts or press **Stop** to cancel the active run and withdraw waiting follow-ups.

## Models, Audio, Integrations & Home Sync

- **Models & Access**: Open **Models & access** from the sidebar footer to inspect your Nimi Home account and Runtime connection, switch language or theme, manage named AI configurations (including optional **Audio transcription (`audio.transcribe`)**), and open Nimi Home App settings.
- **Continue a Nimi Home Chat**: Export a conversation from Nimi Home (`nimi.home-chat.v1`) and choose **Import Home Chat…** from the sidebar to carry over previous messages and unsent drafts without creating duplicates on re-import.
- **Automatic Home Activity**: Harness publishes pending tool approvals, completion, and failure updates to **Nimi Home Activity** so clicking an activity item opens that exact session.
- **External Integrations**: Service operations granted to Nimi Harness in Nimi Home appear under **Inspector → Integrations** and follow the session's tool approval rules.

## Remote Web Companion

When your desktop **Nimi Harness** is running on your primary PC and granted remote session access in Nimi Home (`ai.nimi.harness.sessions.v1`), open the Web companion from the [Nimi App Storefront](https://nimi.ai/apps/harness) or [harness.nimi.xyz](https://harness.nimi.xyz/):

- Sign in with the same Nimi account, confirm the Web source once in **Nimi Home** on your primary PC, and grant only the session operations you want this browser source to use.
- List or create PC sessions, submit idempotent tasks, watch live streaming progress, review unified diffs and approve or decline tool proposals with feedback, and upload or download workspace files up to 32 MiB.
- Tool arguments larger than 32 KiB must be reviewed on the desktop. All model execution, files, and tools stay on your PC; reconnecting reloads the same durable PC session and saved files.

## Data & Privacy

- **Local PC Storage**: Session transcripts (SQLite) and default session folders are stored locally under `~/.nimi-harness`, partitioned by account namespace. File reads, edits, and approved commands execute on your PC with your desktop user's OS permissions. Deleting a session removes only its sandboxed session folder and never deletes a bound local project folder.
- **Nimi Account Storage**: Composer drafts, reusable instruction presets, session index metadata, and remote idempotency receipts are stored in Nimi Harness's account-scoped Nimi storage.
- **Model Routing**: Prompts, tool results, and optional audio recordings are routed through Nimi Runtime to the local or cloud model selected for the session. Local models stay on-device; cloud models receive turn context through the connectors configured in Nimi Home.

## Limitations & Help

- **Supported Desktop Hosts**: Native desktop packages target **Windows x64** and **macOS arm64**. Desktop installation, updates, and sign-in are managed by Nimi Home.
- **Web Companion Prerequisites**: The Web client does not run models or file tools in the browser; it requires your desktop Nimi Harness and Nimi Home/Runtime to be online on your primary PC with `ai.nimi.harness.sessions.v1` granted.
- **Audio Transcription**: Optional `audio.transcribe` tool calls currently use the App's default `audio.transcribe` AI configuration in Nimi Home.
- **Mobile Status**: Android companion acceptance is still in progress and is not part of this release.
- **Support**: Report issues or feedback at [github.com/nimiplatform/nimiapp-harness/issues](https://github.com/nimiplatform/nimiapp-harness/issues). Include your Harness version, OS, and error message with credentials and private files removed.
