use schemars::JsonSchema;
use serde::Deserialize;
use std::env;
use std::path::{Path, PathBuf};
use zed::settings::ContextServerSettings;
use zed_extension_api::{
    self as zed, serde_json, Command, ContextServerConfiguration, ContextServerId, Project, Result,
};

const PACKAGE_NAME: &str = "spongebin-mcp";
const NPM_SERVER_PATH: &str = "node_modules/spongebin-mcp/dist/index.js";
const LOCAL_SERVER_PATH: &str = "../mcp/dist/index.js";
const CONTEXT_SERVER_ID: &str = "spongebin";

const DEFAULT_BASE_URL: &str = "https://spongebin.dev";
const DEFAULT_LANGUAGE: &str = "text";
const DEFAULT_THEME: &str = "catppuccin-mocha";

#[derive(Debug, Deserialize, JsonSchema)]
struct SpongebinContextServerSettings {
    #[serde(default = "default_base_url")]
    base_url: String,
    #[serde(default = "default_language")]
    default_language: String,
    #[serde(default = "default_theme")]
    theme: String,
}

fn default_base_url() -> String {
    DEFAULT_BASE_URL.to_string()
}

fn default_language() -> String {
    DEFAULT_LANGUAGE.to_string()
}

fn default_theme() -> String {
    DEFAULT_THEME.to_string()
}

impl Default for SpongebinContextServerSettings {
    fn default() -> Self {
        Self {
            base_url: default_base_url(),
            default_language: default_language(),
            theme: default_theme(),
        }
    }
}

fn path_if_file(path: PathBuf) -> Option<PathBuf> {
    path.is_file().then_some(path)
}

fn resolve_server_path() -> Result<String> {
    let cwd = env::current_dir().map_err(|err| err.to_string())?;

    if let Some(local) = path_if_file(cwd.join(LOCAL_SERVER_PATH)) {
        return Ok(local.to_string_lossy().to_string());
    }

    let latest_version = zed::npm_package_latest_version(PACKAGE_NAME)?;
    let installed_version = zed::npm_package_installed_version(PACKAGE_NAME)?;
    if installed_version.as_deref() != Some(latest_version.as_ref()) {
        zed::npm_install_package(PACKAGE_NAME, &latest_version)?;
    }

    let npm_path = cwd.join(NPM_SERVER_PATH);
    if !Path::new(&npm_path).is_file() {
        return Err(format!(
            "spongebin-mcp entrypoint missing at {}. Build extension/mcp (bun run --cwd extension/mcp build) for local dev, or publish spongebin-mcp to npm.",
            npm_path.display()
        ));
    }

    Ok(npm_path.to_string_lossy().to_string())
}

struct SpongebinExtension;

impl zed::Extension for SpongebinExtension {
    fn new() -> Self {
        Self
    }

    fn context_server_command(
        &mut self,
        _context_server_id: &ContextServerId,
        project: &Project,
    ) -> Result<Command> {
        let settings = ContextServerSettings::for_project(CONTEXT_SERVER_ID, project)?;
        let settings: SpongebinContextServerSettings = match settings.settings {
            Some(value) => serde_json::from_value(value).map_err(|e| e.to_string())?,
            None => SpongebinContextServerSettings::default(),
        };

        Ok(Command {
            command: zed::node_binary_path()?,
            args: vec![resolve_server_path()?],
            env: vec![
                (
                    "SPONGEBIN_BASE_URL".into(),
                    settings.base_url.trim_end_matches('/').to_string(),
                ),
                (
                    "SPONGEBIN_DEFAULT_LANGUAGE".into(),
                    settings.default_language,
                ),
                ("SPONGEBIN_THEME".into(), settings.theme),
            ],
        })
    }

    fn context_server_configuration(
        &mut self,
        _context_server_id: &ContextServerId,
        _project: &Project,
    ) -> Result<Option<ContextServerConfiguration>> {
        let installation_instructions =
            include_str!("../configuration/installation_instructions.md").to_string();
        let default_settings = include_str!("../configuration/default_settings.jsonc").to_string();
        let settings_schema =
            serde_json::to_string(&schemars::schema_for!(SpongebinContextServerSettings))
                .map_err(|e| e.to_string())?;

        Ok(Some(ContextServerConfiguration {
            installation_instructions,
            default_settings,
            settings_schema,
        }))
    }
}

zed::register_extension!(SpongebinExtension);
