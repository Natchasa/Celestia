with open(r'C:\Users\pla_y\.gemini\antigravity\scratch\Celestia\app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

target = '''        <div class="lord-card" style="margin-top: 0;">
            <div class="lord-area-box" style="margin-bottom: 14px; border-left-color: #FDC94D; font-size: 0.92rem;">
                <ul style="margin: 0; padding-left: 20px; color: var(--text-color);">
                    ${variableBulletsHtml}
                </ul>
            </div>

            <div style="font-weight: 700; color: #FDC94D; font-size: 0.9rem; margin-bottom: 8px;">
                ความหมายของการจรเรือนที่ ${hx} ไปเรือนที่ ${hn}
            </div>

            <ul style="margin: 0; padding-left: 20px; color: var(--text-color);">
                ${bulletsHtml}
            </ul>
        </div>'''

replacement = '''        <div class="lord-card" style="margin-top: 0;">
            <div class="lord-area-box" style="margin-bottom: 14px; border-left-color: #FDC94D; font-size: 0.92rem;">
                <ul style="margin: 0; padding-left: 20px; padding-right: 10px; color: var(--text-color);">
                    ${variableBulletsHtml}
                </ul>
            </div>

            <div style="font-weight: 700; color: #FDC94D; font-size: 0.95rem; margin-bottom: 10px; padding-left: 2px;">
                ความหมายของการจรเรือนที่ ${hx} ไปเรือนที่ ${hn}
            </div>

            <div class="lord-bullets-box">
                <ul class="lord-bullets-list">
                    ${bulletsHtml}
                </ul>
            </div>
        </div>'''

if target in app_js:
    app_js = app_js.replace(target, replacement)
    with open(r'C:\Users\pla_y\.gemini\antigravity\scratch\Celestia\app.js', 'w', encoding='utf-8') as f:
        f.write(app_js)
    print('Updated app.js successfully!')
else:
    print('Target string not found, searching for partial match...')
    idx = app_js.find('lord-area-box')
    if idx != -1:
        print(app_js[idx-100:idx+400])
