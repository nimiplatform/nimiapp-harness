# Nimi Harness

Nimi Harness is a Nimi-native desktop and remote workspace for working on multi-step tasks, code, documents, and files with transparent model selection and step-by-step tool approval.

## Getting Started

1. Sign in to **Nimi Home** and make sure at least one cloud connector or machine-local text model is ready in **Nimi Home → AI models**.
2. Launch **Nimi Harness** from Nimi Home. Click **New** in the sidebar to start a session in its own working folder or choose an existing folder.
3. Choose a model in the composer (or keep the app default), attach any files up to 32 MiB, and press **Send**.

## Working in a Session

- **Cloud, Local & Saved Model Picker**: Open the model selector in the composer to filter **All**, **Cloud**, **Local**, and **Saved** routes or search across providers. Selecting any ready Cloud or Local model reuses a matching saved configuration or creates one named configuration for Nimi Harness and binds only that session to it.
- **Configuration Drift Recovery**: If a session's configuration changes externally while you are working (`AI_CONFIG_REVISION_CONFLICT`), Harness shows an inline confirmation banner inside the conversation so you can adopt the updated configuration in one click before sending again.
- **Reasoning Effort & Session Guidance**: Adjust reasoning effort directly in the composer when supported by the active model. Use **Session settings** to rename a session, set per-session instructions, or save and reuse instructions across sessions.
- **Reviewing Tool Proposals**: New sessions ask before file edits, commands, transcription, and integration calls. Choose **Allow once**, **Allow for session**, **Request changes**, or **Decline**. **Allow for session** permits future calls to that tool until the session is closed. **Auto-Edit** also permits writes and edits within the working folder. **Plan Only** blocks file-changing tools, commands, and write integration operations.
- **Files & Attachments**: Drop files onto the composer or click **Attach files** (up to 32 MiB each; PNG, JPEG, and WebP images can be inspected and sent to vision-capable models). Open **Session files** to preview text, Markdown, or images, attach workspace files to your draft, or reveal files in your file manager.
- **Queue & Stop**: While a turn runs, queue follow-up prompts or press **Stop** to cancel the active run and withdraw waiting follow-ups.

## Models, Audio, Integrations & Home Sync

- **Settings**: Open **Settings** from the sidebar footer to inspect your Nimi Home account, switch language or theme, manage named AI configurations (including optional **Audio transcription (`audio.transcribe`)**), review granted integrations, and view the remote Web/mobile provider status.
- **Continue a Nimi Home Chat**: Export a conversation from Nimi Home (`nimi.home-chat.v1`) and import it from the sidebar to preserve earlier messages and unsent drafts without creating duplicates on re-import.
- **Automatic Home Activity**: Harness automatically publishes session attention (pending approvals), completion, and failure updates to **Nimi Home Activity** so clicking an entry in Home returns straight to that session.
- **External Integrations**: Service operations granted to Nimi Harness in Nimi Home appear under **Settings → Integrations**. Integration calls follow the session's tool approval settings and require a current Home grant for the requested operation.

## Remote Web & Mobile Companion

When your desktop Nimi Harness is running and granted remote access in Nimi Home (`ai.nimi.harness.sessions.v1`), you can connect from the Nimi Harness Web client (or authorized remote clients) to list and create PC sessions, submit idempotent tasks, watch live streaming progress, review and approve/decline tool proposals with feedback, and upload or download workspace files up to 32 MiB. Actions too large to display safely in full must be reviewed on the desktop.

## Data & Privacy

- Session transcripts and default working folders are stored locally under `~/.nimi-harness`. File reads and approved commands run with your desktop user's filesystem permissions. A session's working folder sets the default location for relative paths.
- Drafts, reusable instruction presets, and remote idempotency receipts are stored in Nimi Harness's account-scoped Nimi storage.
- Prompts, tool outputs, and optional audio recordings are sent through Nimi Runtime to the local or cloud model selected for the session. Cloud models receive context through the connectors configured in Nimi Home.

## Limitations & Help

- Desktop updates and account authentication are managed by Nimi Home.
- Local model execution requires selecting a machine-local text model in **Nimi Home → AI models**.
- Web and Android companions require an admitted source and PC access granted in Nimi Home. Android device acceptance is in progress.
