#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    // WebView2 預設背景白色，在 transparent 視窗內側會形成 1px 白邊。
    // 設 AARRGGBB = 00FFFFFF（AA=00 完全透明），讓 WebView2 本身透明。
    // 必須在 Tauri Builder 之前設定。
    std::env::set_var("WEBVIEW2_DEFAULT_BACKGROUND_COLOR", "00FFFFFF");

    // 不套用 mica / acrylic：Win 10 不支援 mica，acrylic 拖曳卡頓且無系統圓角。
    // 視窗保持 transparent + decorations:false 當畫布，圓角與陰影由前端 CSS 自繪。
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::load_notes,
            commands::save_notes
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
