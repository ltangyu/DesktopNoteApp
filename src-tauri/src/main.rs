#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    // WebView2 預設背景白色，會在 transparent 視窗內形成 1px 白邊；設為透明。
    std::env::set_var("WEBVIEW2_DEFAULT_BACKGROUND_COLOR", "00FFFFFF");

    // 不套用 OS apply_blur：使用者要 ring 完全透明（看到原桌面），
    // OS 層 blur 會讓 ring 也呈現模糊+tint 白色，達不到「純透明 + 陰影」要求。
    // 代價：.app-shell 中央失去真實桌面模糊，僅以 CSS 35% 半透明白覆蓋原桌面。
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::load_notes,
            commands::save_notes
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
