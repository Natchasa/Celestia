import re

html_path = r"C:\Users\pla_y\.gemini\antigravity\scratch\Celestia\index.html"
css_path = r"C:\Users\pla_y\.gemini\antigravity\scratch\Celestia\styles.css"
js_path = r"C:\Users\pla_y\.gemini\antigravity\scratch\Celestia\app.js"

# 1. Update index.html
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the single search bar container with two separate inputs
old_search_view = """            <!-- Search Tab View -->
            <section class="tab-view" id="search-view">
                <div class="search-bar-container">
                    <input type="text" class="search-input" id="search-input" placeholder="พิมพ์คำแปล หรือสมการ เช่น ความสุข, โชคร้าย, M/Su...">
                    <button class="search-clear-btn" id="search-clear-btn" style="display: none;">✕</button>
                </div>
                
                <div class="search-meta" id="search-meta">"""

new_search_view = """            <!-- Search Tab View -->
            <section class="tab-view" id="search-view">
                <div class="search-inputs-grid">
                    <div class="search-field">
                        <label class="search-field-label" id="label-search-eq">ค้นหาจากสมการ:</label>
                        <div class="search-bar-container">
                            <input type="text" class="search-input" id="search-input-eq" placeholder="เช่น M/Su, Su/Ju/Sa...">
                            <button class="search-clear-btn" id="search-clear-eq" style="display: none;">✕</button>
                        </div>
                    </div>
                    <div class="search-field">
                        <label class="search-field-label" id="label-search-key">ค้นหาจากคีย์เวิร์ด:</label>
                        <div class="search-bar-container">
                            <input type="text" class="search-input" id="search-input-key" placeholder="เช่น ความสุข, โชคร้าย, death...">
                            <button class="search-clear-btn" id="search-clear-key" style="display: none;">✕</button>
                        </div>
                    </div>
                </div>
                
                <div class="search-meta" id="search-meta">"""

html = html.replace(old_search_view, new_search_view)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html updated with split search inputs!")


# 2. Update styles.css
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Append search inputs grid styles after .search-bar-container
old_search_bar = """.search-bar-container {
    position: relative;
    margin-bottom: 16px;
}"""

new_search_bar = """.search-bar-container {
    position: relative;
    margin-bottom: 16px;
}

.search-inputs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
}

@media (max-width: 520px) {
    .search-inputs-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }
}

.search-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.search-field-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    padding-left: 2px;
    font-family: var(--font-sans);
}"""

css = css.replace(old_search_bar, new_search_bar)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("styles.css updated with split search grid layout!")


# 3. Update app.js
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Update Translations dictionary with the new search labels and placeholders
js = js.replace("""        searchPlaceholder: "พิมพ์คำแปล หรือสมการ เช่น ความสุข, โชคร้าย, M/Su...",
        searchMetaAll: "แสดงรายการดาวและคำแปลทั้งหมด ({count} รายการ)",
        searchMetaQuery: "พบผลลัพธ์ {count} รายการ สำหรับ \\"{query}\\"",
        searchNoResults: "ไม่พบรายการที่ตรงกับคำค้นหาของคุณ",
        footerText: "PLANETARY © 2026 • ระบบแปลคัมภีร์สูตรพระเคราะห์สนธิ (Uranian Astrology)\",""",
               """        searchMetaAll: "แสดงรายการดาวและคำแปลทั้งหมด ({count} รายการ)",
        searchMetaQuery: "พบผลลัพธ์ {count} รายการ สำหรับตัวกรองที่เลือก",
        searchNoResults: "ไม่พบรายการที่ตรงกับคำค้นหาของคุณ",
        labelSearchEq: "ค้นหาจากสมการ (เช่น M/Su):",
        labelSearchKey: "ค้นหาจากคีย์เวิร์ดคำแปล/ความหมาย:",
        placeholderEq: "เช่น M/Su, Su/Ju/Sa...",
        placeholderKey: "เช่น ความสุข, โชคร้าย, ความรัก...",
        footerText: "PLANETARY © 2026 • ระบบแปลคัมภีร์สูตรพระเคราะห์สนธิ (Uranian Astrology)\",""")

js = js.replace("""        searchPlaceholder: "Search by translation or equation, e.g., happiness, M/Su...",
        searchMetaAll: "Showing all {count} equations",
        searchMetaQuery: "Found {count} results for \\"{query}\\"",
        searchNoResults: "No matching items found",
        footerText: "PLANETARY © 2026 • Uranian Astrology Formula Lookup System\",""",
               """        searchMetaAll: "Showing all {count} equations",
        searchMetaQuery: "Found {count} results for selected filters",
        searchNoResults: "No matching items found",
        labelSearchEq: "Search by Equation (e.g. M/Su):",
        labelSearchKey: "Search by Keyword/Translation:",
        placeholderEq: "e.g. M/Su, Su/Ju/Sa...",
        placeholderKey: "e.g. happiness, death, love...",
        footerText: "PLANETARY © 2026 • Uranian Astrology Formula Lookup System\",""")

# Update DOM cache in app.js
old_dom = """    searchInput: document.getElementById('search-input'),
    searchClearBtn: document.getElementById('search-clear-btn'),
    searchMeta: document.getElementById('search-meta'),
    searchResultsList: document.getElementById('search-results-list')"""

new_dom = """    searchInputEq: document.getElementById('search-input-eq'),
    searchClearEq: document.getElementById('search-clear-eq'),
    searchInputKey: document.getElementById('search-input-key'),
    searchClearKey: document.getElementById('search-clear-key'),
    searchMeta: document.getElementById('search-meta'),
    searchResultsList: document.getElementById('search-results-list')"""

js = js.replace(old_dom, new_dom)

# Update DOM selectors inside updateLanguageUI
old_lang_ui_search = """    // Dynamic placeholder inputs
    DOM.btnDelete.title = t('btnDeleteTip');
    DOM.btnClear.title = t('btnClearTip');
    DOM.searchInput.placeholder = t('searchPlaceholder');
    
    // Re-render variable text parts
    updateBuilderUI();
    queryDatabase();
    renderSearchList(DOM.searchInput.value.trim());"""

new_lang_ui_search = """    // Dynamic labels and placeholders
    const lblSearchEq = document.getElementById('label-search-eq');
    if (lblSearchEq) lblSearchEq.innerText = t('labelSearchEq');
    
    const lblSearchKey = document.getElementById('label-search-key');
    if (lblSearchKey) lblSearchKey.innerText = t('labelSearchKey');
    
    DOM.searchInputEq.placeholder = t('placeholderEq');
    DOM.searchInputKey.placeholder = t('placeholderKey');
    
    DOM.btnDelete.title = t('btnDeleteTip');
    DOM.btnClear.title = t('btnClearTip');
    
    // Re-render variable text parts
    updateBuilderUI();
    queryDatabase();
    
    const eqVal = DOM.searchInputEq.value.trim().toLowerCase();
    const keyVal = DOM.searchInputKey.value.trim().toLowerCase();
    renderSearchList(eqVal, keyVal);"""

js = js.replace(old_lang_ui_search, new_lang_ui_search)

# Update setupEventListeners search listeners
old_listeners = """    // Text search inputs
    DOM.searchInput.addEventListener('input', debounce(handleSearchInput, 200));
    DOM.searchClearBtn.addEventListener('click', clearSearch);"""

new_listeners = """    // Text search inputs
    DOM.searchInputEq.addEventListener('input', debounce(handleSearchInput, 200));
    DOM.searchInputKey.addEventListener('input', debounce(handleSearchInput, 200));
    
    DOM.searchClearEq.addEventListener('click', () => {
        DOM.searchInputEq.value = '';
        DOM.searchClearEq.style.display = 'none';
        handleSearchInput();
        DOM.searchInputEq.focus();
    });
    DOM.searchClearKey.addEventListener('click', () => {
        DOM.searchInputKey.value = '';
        DOM.searchClearKey.style.display = 'none';
        handleSearchInput();
        DOM.searchInputKey.focus();
    });"""

js = js.replace(old_listeners, new_listeners)

# Update switchTab search focus
js = js.replace("DOM.searchInput.focus();", "DOM.searchInputEq.focus();")

# Update handleSearchInput and clearSearch methods
old_handlers = """// 8. General Search Browser Tab
function handleSearchInput() {
    const val = DOM.searchInput.value.trim();
    DOM.searchClearBtn.style.display = val ? 'block' : 'none';
    renderSearchList(val);
}

function clearSearch() {
    DOM.searchInput.value = '';
    DOM.searchClearBtn.style.display = 'none';
    renderSearchList();
    DOM.searchInput.focus();
}

function renderSearchList(query = '') {
    DOM.searchResultsList.innerHTML = '';
    
    let filtered = PLANETARY_DB;
    if (query) {
        const lower = query.toLowerCase();
        filtered = PLANETARY_DB.filter(row => {
            return (
                row.eq.toLowerCase().includes(lower) ||
                row.a_th.includes(lower) ||
                row.b_th.includes(lower) ||
                row.c_th.includes(lower) ||
                row.desc_th.toLowerCase().includes(lower) ||
                row.desc_en.toLowerCase().includes(lower)
            );
        });
    }"""

new_handlers = """// 8. General Search Browser Tab
function handleSearchInput() {
    const eqVal = DOM.searchInputEq.value.trim().toLowerCase();
    const keyVal = DOM.searchInputKey.value.trim().toLowerCase();
    
    DOM.searchClearEq.style.display = eqVal ? 'block' : 'none';
    DOM.searchClearKey.style.display = keyVal ? 'block' : 'none';
    
    renderSearchList(eqVal, keyVal);
}

function renderSearchList(eqQuery = '', keyQuery = '') {
    DOM.searchResultsList.innerHTML = '';
    
    let filtered = PLANETARY_DB;
    
    // 1. Filter by Equation
    if (eqQuery) {
        filtered = filtered.filter(row => row.eq.toLowerCase().includes(eqQuery));
    }
    
    // 2. Filter by Keyword
    if (keyQuery) {
        filtered = filtered.filter(row => {
            return (
                row.desc_th.toLowerCase().includes(keyQuery) ||
                row.desc_en.toLowerCase().includes(keyQuery) ||
                row.a_th.toLowerCase().includes(keyQuery) ||
                row.b_th.toLowerCase().includes(keyQuery) ||
                row.c_th.toLowerCase().includes(keyQuery)
            );
        });
    }"""

js = js.replace(old_handlers, new_handlers)

# Also fix the initial call inside renderSearchList (which is now parameterized by two args)
js = js.replace("renderSearchList();", "renderSearchList('', '');")

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

print("app.js updated successfully with split search logics!")
