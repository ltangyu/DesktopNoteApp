use std::collections::BTreeMap;
use std::fs;
use std::path::PathBuf;

pub type Notes = BTreeMap<String, BTreeMap<String, String>>;

fn data_path() -> Result<PathBuf, String> {
    let base = dirs::data_dir().ok_or_else(|| "找不到 %APPDATA% 路徑".to_string())?;
    let dir = base.join("desktop-note-app");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join("data.json"))
}

#[tauri::command]
pub fn load_notes() -> Result<Notes, String> {
    let p = data_path()?;
    if !p.exists() {
        return Ok(BTreeMap::new());
    }
    let raw = fs::read_to_string(&p).map_err(|e| e.to_string())?;
    if raw.trim().is_empty() {
        return Ok(BTreeMap::new());
    }
    serde_json::from_str(&raw).map_err(|e| format!("parse error: {e}"))
}

#[tauri::command]
pub fn save_notes(notes: Notes) -> Result<(), String> {
    let p = data_path()?;
    let tmp = p.with_extension("json.tmp");
    let json = serde_json::to_string_pretty(&notes).map_err(|e| e.to_string())?;
    fs::write(&tmp, json).map_err(|e| e.to_string())?;
    fs::rename(&tmp, &p).map_err(|e| e.to_string())
}
