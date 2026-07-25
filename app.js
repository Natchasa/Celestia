// Celestia Web App - Logic & State Manager (Thai Version Only)

// Security: escape any text before it is interpolated into an innerHTML template.
// Even though PLANETARY_DB / HOUSE_DB / ASTEROID_DB are local, developer-controlled
// data files, they are generated from an editable spreadsheet (Planetary.xlsx via
// extract_db.py). Escaping defends against stored XSS if that source data is ever
// corrupted or tampered with, without changing anything visible to the user.
function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// 1. Definition of the 22 Uranian Factors
const PLANETS = [
    // Personal Points
    {
        id: 'M',
        abbr: 'M',
        nameEN: 'Meridian',
        nameTH: 'เมอริเดียน',
        isPersonal: true,
        unicode: 'Mᶜ',
        imagePath: 'img/M.png'
    },
    {
        id: 'Ar',
        abbr: 'Ar',
        nameEN: 'Aries Point',
        nameTH: 'จุดเมษ',
        isPersonal: true,
        unicode: '♈',
        imagePath: 'img/Ar.png'
    },
    {
        id: 'As',
        abbr: 'As',
        nameEN: 'Ascendant',
        nameTH: 'ลัคนา',
        isPersonal: true,
        unicode: 'Aˢᶜ',
        imagePath: 'img/As.png'
    },
    {
        id: 'Su',
        abbr: 'Su',
        nameEN: 'Sun',
        nameTH: 'อาทิตย์',
        isPersonal: true,
        unicode: '☉',
        imagePath: 'img/Su.png'
    },
    {
        id: 'Mo',
        abbr: 'Mo',
        nameEN: 'Moon',
        nameTH: 'จันทร์',
        isPersonal: true,
        unicode: '☾',
        imagePath: 'img/Mo.png'
    },
    {
        id: 'No',
        abbr: 'No',
        nameEN: 'Node',
        nameTH: 'ราหู',
        isPersonal: true,
        unicode: '☊',
        imagePath: 'img/No.png'
    },
    
    // Regular Planets
    {
        id: 'Me',
        abbr: 'Me',
        nameEN: 'Mercury',
        nameTH: 'พุธ',
        isPersonal: false,
        unicode: '☿',
        imagePath: 'img/Me.png'
    },
    {
        id: 'Ve',
        abbr: 'Ve',
        nameEN: 'Venus',
        nameTH: 'ศุกร์',
        isPersonal: false,
        unicode: '♀',
        imagePath: 'img/Ve.png'
    },
    {
        id: 'Ma',
        abbr: 'Ma',
        nameEN: 'Mars',
        nameTH: 'อังคาร',
        isPersonal: false,
        unicode: '♂',
        imagePath: 'img/Ma.png'
    },
    {
        id: 'Ju',
        abbr: 'Ju',
        nameEN: 'Jupiter',
        nameTH: 'พฤหัสบดี',
        isPersonal: false,
        unicode: '♃',
        imagePath: 'img/Ju.png'
    },
    {
        id: 'Sa',
        abbr: 'Sa',
        nameEN: 'Saturn',
        nameTH: 'เสาร์',
        isPersonal: false,
        unicode: '♄',
        imagePath: 'img/Sa.png'
    },
    {
        id: 'Ur',
        abbr: 'Ur',
        nameEN: 'Uranus',
        nameTH: 'ยูเรนัส',
        isPersonal: false,
        unicode: '⛢',
        imagePath: 'img/Ur.png'
    },
    {
        id: 'Ne',
        abbr: 'Ne',
        nameEN: 'Neptune',
        nameTH: 'เนปจูน',
        isPersonal: false,
        unicode: '♆',
        imagePath: 'img/Ne.png'
    },
    {
        id: 'Pl',
        abbr: 'Pl',
        nameEN: 'Pluto',
        nameTH: 'พลูโต',
        isPersonal: false,
        unicode: '⯓',
        imagePath: 'img/Pl.png'
    },
    
    // Uranian Transneptunians
    {
        id: 'Cu',
        abbr: 'Cu',
        nameEN: 'Cupido',
        nameTH: 'คิวปิโด',
        isPersonal: false,
        unicode: '⯠',
        imagePath: 'img/Cu.png'
    },
    {
        id: 'Ha',
        abbr: 'Ha',
        nameEN: 'Hades',
        nameTH: 'ฮาเดส',
        isPersonal: false,
        unicode: '⯡',
        imagePath: 'img/Ha.png'
    },
    {
        id: 'Ze',
        abbr: 'Ze',
        nameEN: 'Zeus',
        nameTH: 'ซุส',
        isPersonal: false,
        unicode: '⯢',
        imagePath: 'img/Ze.png'
    },
    {
        id: 'Kr',
        abbr: 'Kr',
        nameEN: 'Kronos',
        nameTH: 'โครโนส',
        isPersonal: false,
        unicode: '⯣',
        imagePath: 'img/Kr.png'
    },
    {
        id: 'Ap',
        abbr: 'Ap',
        nameEN: 'Apollon',
        nameTH: 'อะพอลลอน',
        isPersonal: false,
        unicode: '⯤',
        imagePath: 'img/Ap.png'
    },
    {
        id: 'Ad',
        abbr: 'Ad',
        nameEN: 'Admetos',
        nameTH: 'แอดเมตอส',
        isPersonal: false,
        unicode: '⯥',
        imagePath: 'img/Ad.png'
    },
    {
        id: 'Vu',
        abbr: 'Vu',
        nameEN: 'Vulcanus',
        nameTH: 'วัลคานุส',
        isPersonal: false,
        unicode: '⯦',
        imagePath: 'img/Vu.png'
    },
    {
        id: 'Po',
        abbr: 'Po',
        nameEN: 'Poseidon',
        nameTH: 'โพไซดอน',
        isPersonal: false,
        unicode: '⯧',
        imagePath: 'img/Po.png'
    }
];

// Helper to look up a planet definition by code or name
function getPlanet(query) {
    if (!query) return null;
    const lower = query.toLowerCase();
    return PLANETS.find(p => 
        p.id.toLowerCase() === lower || 
        p.nameEN.toLowerCase() === lower || 
        p.nameTH === query
    ) || null;
}

// 2. Application State
// NOTE: There is no more "A/B vs A+B-C" mode toggle. The user can select up to
// 3 stars; as soon as 2 are picked we already show every possible match
// (pure A/B midpoint entries + every A+B-? equation regardless of the 3rd
// factor). Picking a 3rd star narrows the results down to the exact equation.
const MAX_EQUATION_FACTORS = 3;

const STATE = {
    activeTab: 'uranian',           // 'uranian', 'house', 'asteroid'
    btnMode: 'symbol',              // 'symbol' or 'thai'
    searchType: 'equation',         // 'equation' or 'keyword'
    selectedFactors: [],            // Array of selected planet objects (max 3)
    currentMatches: [],             // Current database matches found
    builderCollapsed: false         // Auto-collapse keyboard when equation results are displayed
};

const HOUSE_STATE = {
    system: 'ลัคนา',                // 'เมอริเดียน', 'ลัคนา', 'อาทิตย์', 'จันทร์', 'โลก', 'ราหู'
    house: 1,                       // 1 to 12
    planet: 'Me'                    // Active planet ID in house tab
};

const ASTEROID_STATE = {
    selectedAsteroid: 'The Aries Point', // Active asteroid name (EN)
    selectedSign: 'เมษ',                // Active sign (TH)
    signFilter: '',                     // '' = every sign; otherwise a Thai sign name from the top filter
    userPickedAsteroid: false,          // true once the user has explicitly clicked an asteroid from the list
    keyword: ''                         // free-text keyword filter (name / desc / meaning)
};

// DOM Elements cache
const DOM = {
    tabUranian: document.getElementById('tab-uranian'),
    tabHouse: document.getElementById('tab-house'),
    tabAsteroid: document.getElementById('tab-asteroid'),
    uranianView: document.getElementById('uranian-view'),
    houseView: document.getElementById('house-view'),
    asteroidView: document.getElementById('asteroid-view'),
    equationDisplayCard: document.getElementById('equation-display-card'),
    builderInstruction: document.getElementById('builder-instruction'),
    equationTokens: document.getElementById('equation-tokens'),
    btnDelete: document.getElementById('btn-delete'),
    btnClear: document.getElementById('btn-clear'),

    keyboardSection: document.getElementById('keyboard-section'),
    keyboardGrid: document.getElementById('keyboard-grid'),

    interpretationResults: document.getElementById('interpretation-results'),

    searchTypeEquationBtn: document.getElementById('search-type-equation'),
    searchTypeKeywordBtn: document.getElementById('search-type-keyword'),
    searchBarKeyContainer: document.getElementById('search-bar-key-container'),
    searchInputKey: document.getElementById('search-input-key'),
    searchClearKey: document.getElementById('search-clear-key'),
    searchMeta: document.getElementById('search-meta'),
    searchResultsSection: document.getElementById('search-results-section'),
    searchResultsList: document.getElementById('search-results-list'),

    // House tab DOMs
    houseSystemSelect: document.getElementById('house-system-select'),
    houseNumberSelect: document.getElementById('house-number-select'),
    housePlanetsGrid: document.getElementById('house-planets-grid'),
    houseGeneralCard: document.getElementById('house-general-card'),
    houseInterpretationResults: document.getElementById('house-interpretation-results'),
    btnHouseClear: document.getElementById('btn-house-clear'),
    searchInputHouse: document.getElementById('search-input-house'),
    searchClearHouse: document.getElementById('search-clear-house'),
    houseSearchResultsList: document.getElementById('house-search-results-list'),

    // Asteroid tab DOMs
    btnAsteroidClear: document.getElementById('btn-asteroid-clear'),
    searchSelectAsteroidName: document.getElementById('search-select-asteroid-name'),
    searchSelectAsteroidSign: document.getElementById('search-select-asteroid-sign'),
    searchInputAsteroidKeyword: document.getElementById('search-input-asteroid-keyword'),
    searchClearAsteroidKeyword: document.getElementById('search-clear-asteroid-keyword'),
    asteroidSidebar: document.querySelector('.asteroid-sidebar'),
    asteroidList: document.getElementById('asteroid-list'),
    asteroidDetailPanel: document.getElementById('asteroid-detail-panel')
};

// 3. Initialization
document.addEventListener('DOMContentLoaded', () => {
    initKeyboard();
    setupEventListeners();
    initHouseTab();
    initAsteroidTab();
    updateBuilderUI();
    queryDatabase();
    updateSearchModeVisibility(STATE.searchType);
    updateUranianResultsVisibility();
});

// Show the planet-selection keyboard & equation builder only in equation search mode;
// keyword/meaning search doesn't build an equation, so those controls are just noise.
// Conversely, the free-text search box is only useful for keyword search — equation
// search is done entirely by tapping stars, so the box is hidden in that mode.
// Show the planet-selection keyboard & equation builder in equation search mode.
// Free-text search box is shown in keyword mode.
function updateSearchModeVisibility(type) {
    if (type) STATE.searchType = type;
    const isEquation = STATE.searchType === 'equation';

    if (DOM.equationDisplayCard) DOM.equationDisplayCard.style.display = isEquation ? '' : 'none';
    if (DOM.keyboardSection) DOM.keyboardSection.style.display = isEquation ? '' : 'none';
    if (DOM.searchBarKeyContainer) DOM.searchBarKeyContainer.style.display = isEquation ? 'none' : '';
}

// 4. Keyboard rendering
function initKeyboard() {
    DOM.keyboardGrid.innerHTML = '';
    updateKeyboardModeClass();

    // Render 22 planets (no more A/B vs A+B-C mode-switch buttons)
    PLANETS.forEach(p => {
        DOM.keyboardGrid.appendChild(createPlanetButton(p));
    });
}

function updateKeyboardModeClass() {
    const parent = DOM.uranianView;
    if (STATE.btnMode === 'symbol') {
        parent.classList.remove('mode-text-active');
    } else {
        parent.classList.add('mode-text-active');
    }
}

function createPlanetButton(planet) {
    const btn = document.createElement('button');
    btn.className = `planet-btn ${planet.isPersonal ? 'personal' : ''}`;
    btn.id = `btn-planet-${planet.id}`;
    btn.dataset.id = planet.id;
    
    updatePlanetButtonContent(btn, planet);
    
    btn.addEventListener('click', () => {
        selectPlanet(planet);
    });
    
    return btn;
}

function updatePlanetButtonContent(btn, planet) {
    let label = STATE.btnMode === 'symbol' ? mapDisplayAbbr(planet.abbr) : planet.nameTH;
    let iconContent = `<img src="${planet.imagePath}?v=110" class="planet-img-icon" alt="${planet.nameEN}">`;
        
    btn.innerHTML = `
        <div class="planet-btn-icon">${iconContent}</div>
        <div class="planet-btn-label">${label}</div>
    `;
}

function refreshAllButtons() {
    updateKeyboardModeClass();
    PLANETS.forEach(p => {
        const btn = document.getElementById(`btn-planet-${p.id}`);
        if (btn) {
            updatePlanetButtonContent(btn, p);
        }
    });

    updateButtonStates();
}

// 5. Select & Build Logic (Free Selection: No constraints)
function selectPlanet(planet) {
    if (STATE.selectedFactors.length < MAX_EQUATION_FACTORS) {
        STATE.selectedFactors.push(planet);
        updateBuilderUI();
        queryDatabase();
        updateSearchModeVisibility();
        updateUranianResultsVisibility();
    }
}

function deleteLastPlanet() {
    if (STATE.selectedFactors.length > 0) {
        STATE.selectedFactors.pop();
        updateBuilderUI();
        queryDatabase();
        updateSearchModeVisibility();
        updateUranianResultsVisibility();
    }
}

function clearBuilder() {
    STATE.selectedFactors = [];
    STATE.currentMatches = [];
    updateBuilderUI();
    queryDatabase();
    updateSearchModeVisibility();
    updateUranianResultsVisibility();
}

function updateButtonStates() {
    const len = STATE.selectedFactors.length;

    PLANETS.forEach(p => {
        const btn = document.getElementById(`btn-planet-${p.id}`);
        if (!btn) return;

        const isSelected = STATE.selectedFactors.some(sf => sf.id === p.id);
        if (isSelected) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }

        // Disabled only if equation is full and this button is not selected
        let disabled = (len >= MAX_EQUATION_FACTORS && !isSelected);

        if (disabled) {
            btn.classList.add('disabled');
            btn.disabled = true;
        } else {
            btn.classList.remove('disabled');
            btn.disabled = false;
        }
    });
}

function updateBuilderUI() {
    const len = STATE.selectedFactors.length;

    // Update instruction text in Thai. From 2 stars onward, results already
    // show below — the 3rd star is just an optional narrowing step.
    let instr = '';
    if (len === 0) {
        instr = "เลือกดาวดวงที่ 1";
    } else if (len === 1) {
        instr = "เลือกดาวดวงที่ 2";
    } else if (len === 2) {
        instr = "ดูคำตอบที่เป็นไปได้ด้านล่าง หรือเลือกดาวดวงที่ 3 เพื่อจำกัดคำตอบ";
    } else {
        instr = "สมการเสร็จสมบูรณ์";
    }
    if (DOM.builderInstruction) DOM.builderInstruction.innerText = instr;

    DOM.btnDelete.disabled = len === 0;
    DOM.btnClear.disabled = len === 0;

    DOM.equationTokens.innerHTML = '';

    if (len === 0) {
        DOM.equationTokens.innerHTML = `<span class="eq-placeholder">โปรดเลือกดาวด้านล่าง</span>`;
    } else {
        STATE.selectedFactors.forEach((f, idx) => {
            if (idx > 0) {
                const op = document.createElement('span');
                op.className = 'eq-operator';
                op.innerText = idx === 1 ? '+' : '-';
                DOM.equationTokens.appendChild(op);
            }

            const token = document.createElement('span');
            token.className = `token ${f.isPersonal ? 'personal' : ''}`;

            const tokenSymbol = `<div class="planet-btn-icon token-coin"><img src="${f.imagePath}?v=110" class="planet-img-icon token-img" alt="${f.nameEN}"></div>`;
            token.innerHTML = `
                <span class="token-symbol">${tokenSymbol}</span>
                <span class="token-text">${STATE.btnMode === 'thai' ? f.nameTH : mapDisplayAbbr(f.abbr)}</span>
            `;
            DOM.equationTokens.appendChild(token);
        });
    }

    updateButtonStates();
}

// 6. Database Queries & Astrology Mapping
// Does the eq string ("Ve/Ma" or "Ve/Ma/Su") start with these two abbreviations
// in either order? Used as a fallback match for rows only identifiable via eq.
function eqStartsWithPair(eq, abbrA, abbrB) {
    if (!eq) return false;
    const parts = eq.split('/');
    if (parts.length < 2) return false;
    const p0 = parts[0].trim().toUpperCase();
    const p1 = parts[1].trim().toUpperCase();
    const A = (abbrA || '').toUpperCase();
    const B = (abbrB || '').toUpperCase();
    return (p0 === A && p1 === B) || (p0 === B && p1 === A);
}

function queryDatabase() {
    if (STATE.selectedFactors.length < 2) {
        STATE.currentMatches = [];
        DOM.interpretationResults.innerHTML = '';
        return;
    }

    const A = STATE.selectedFactors[0];
    const B = STATE.selectedFactors[1];
    const C = STATE.selectedFactors[2]; // undefined if only 2 stars chosen

    const results = [];

    PLANETARY_DB.forEach(row => {
        const namesMatchAB = (row.a_en === A.nameEN && row.b_en === B.nameEN) ||
                              (row.a_en === B.nameEN && row.b_en === A.nameEN);
        const eqMatchesAB = eqStartsWithPair(row.eq, A.abbr, B.abbr);

        if (!namesMatchAB && !eqMatchesAB) return;

        if (C) {
            // 3 stars chosen: narrow down to the exact A+B-C (or B+A-C) equation.
            const exactNameMatch = namesMatchAB && row.c_en === C.nameEN;
            const exactEqMatch = row.eq === `${A.abbr}/${B.abbr}/${C.abbr}` || row.eq === `${B.abbr}/${A.abbr}/${C.abbr}`;
            if (exactNameMatch || exactEqMatch) {
                results.push(row);
            }
        } else {
            // Only 2 stars chosen: show every possible answer — the pure A/B
            // midpoint entry (if any) AND every A+B-? equation regardless of
            // what the 3rd factor is.
            results.push(row);
        }
    });

    const uniqueResults = [];
    const seen = new Set();
    results.forEach(r => {
        const key = `${r.eq}-${r.desc_th}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueResults.push(r);
        }
    });

    STATE.currentMatches = uniqueResults;
    renderInterpretation();
}

function renderInterpretation() {
    const container = DOM.interpretationResults;
    container.innerHTML = '';

    if (STATE.selectedFactors.length < 2) {
        return;
    }

    if (STATE.currentMatches.length === 0) {
        const formulaStr = formatActiveFormula();
        container.innerHTML = `
            <div class="no-match-card">
                <div class="no-match-title" style="margin-bottom: 10px;">🪐 ไม่พบคำแปลสมการโดยตรง</div>
                <p class="no-match-desc">ไม่พบการตีความสูตรดั้งเดิมของ <strong>${escapeHtml(formulaStr)}</strong> ในตำราของ Alfred Witte</p>
                <div class="no-match-tips">
                    <div class="no-match-tips-title">คำแนะนำทางโหราศาสตร์ยูเรเนียน:</div>
                    <ul>
                        <li>สูตรดาวพระเคราะห์สนธิมักใช้อธิบายจุดสะท้อนหรือโครงสร้างสมการคู่ขนาน</li>
                        <li>ลองสลับดาวดวงที่ 3 เป็นดวงอื่น หรือลบดาวดวงที่ 3 ออกเพื่อดูคำตอบที่เป็นไปได้ทั้งหมดของ 2 ดาวนี้</li>
                    </ul>
                </div>
            </div>
        `;
        return;
    }

    const formulaTitle = formatActiveFormula();
    const matchCount = STATE.currentMatches.length;
    // Only 2 stars chosen and more than 1 possible completion: make it explicit
    // that these are every possible answer, not one fixed interpretation.
    const countNote = (STATE.selectedFactors.length === 2 && matchCount > 1)
        ? `<span class="interp-match-count">พบ ${matchCount} คำตอบที่เป็นไปได้</span>`
        : '';

    const matchCardsHTML = STATE.currentMatches.map(row => {
        const eqLabel = escapeHtml(formatEquationDisplay(row.eq)) || escapeHtml(formulaTitle);
        const factorsText = getFactorsBreakdownText(row);
        const descTh = escapeHtml(row.desc_th) || 'ไม่มีคำแปลภาษาไทย';
        const descEn = row.desc_en ? escapeHtml(row.desc_en) : '';
        return `
            <div class="card interp-match-card">
                <h3 class="interp-eq-title" style="font-size: 1.05rem; margin-bottom: 6px;">${eqLabel}</h3>
                <div class="interp-factors-names">${factorsText}</div>
                <p class="interp-thai-desc" style="margin-top: 10px; font-size: 0.92rem; line-height: 1.6; color: var(--text-color);">${descTh}</p>
                ${descEn ? `<p class="interp-en-desc" style="font-size: 0.82rem; line-height: 1.5; color: var(--text-muted); font-style: italic; border-top: 1px dashed rgba(109,82,134,0.15); padding-top: 8px; margin-top: 8px;">${descEn}</p>` : ''}
            </div>
        `;
    }).join('');

    const cardHTML = `
        <div class="interpretation-container">
            <div class="interp-header" style="margin-bottom: 14px;">
                <span>✨</span> ${escapeHtml(formulaTitle)} ${countNote}
            </div>
            ${matchCardsHTML}
        </div>
    `;

    container.innerHTML = cardHTML;
}

const ABBREV_MAP = {
    'M': 'Mc', 'MC': 'Mc',
    'AS': 'Asc', 'ASC': 'Asc', 'As': 'Asc',
    'AR': 'Ar', 'SU': 'Su', 'MO': 'Mo', 'NO': 'No',
    'ME': 'Me', 'VE': 'Ve', 'MA': 'Ma', 'JU': 'Ju',
    'SA': 'Sa', 'UR': 'Ur', 'NE': 'Ne', 'PL': 'Pl',
    'CU': 'Cu', 'HA': 'Ha', 'ZE': 'Ze', 'KR': 'Kr',
    'AP': 'Ap', 'AD': 'Ad', 'VU': 'Vu', 'PO': 'Po'
};

function mapDisplayAbbr(abbr) {
    if (!abbr) return '';
    const clean = abbr.trim();
    return ABBREV_MAP[clean.toUpperCase()] || (clean.length <= 3 ? clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase() : clean);
}

function formatActiveFormula() {
    const parts = STATE.selectedFactors.map(f => mapDisplayAbbr(f.abbr));
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]} + ${parts[1]}`;
    return `${parts[0]} + ${parts[1]} - ${parts[2]}`;
}

// Format equation row
function formatRowAsEquation(row) {
    const pA = getPlanet(row.a_en);
    const pB = getPlanet(row.b_en);
    const pC = getPlanet(row.c_en);
    
    const abbrA = pA ? mapDisplayAbbr(pA.abbr) : '?';
    const abbrB = pB ? mapDisplayAbbr(pB.abbr) : '?';
    const abbrC = pC ? mapDisplayAbbr(pC.abbr) : '?';
    
    return `${abbrA} + ${abbrB} - ${abbrC}`;
}

function formatEquationDisplay(eq) {
    if (!eq) return '';
    const tokens = eq.split(/([\+\-\/])/);
    return tokens.map(tok => {
        const t = tok.strip ? tok.strip() : tok;
        if (t === '+' || t === '-' || t === '/') return ` ${t} `;
        if (!t) return '';
        return mapDisplayAbbr(t);
    }).join('').trim();
}

function getFactorsBreakdownText(row) {
    const pA = getPlanet(row.a_en);
    const pB = getPlanet(row.b_en);
    const pC = getPlanet(row.c_en);
    
    const textA = pA ? `${pA.nameTH} (${pA.nameEN})` : '?';
    const textB = pB ? `${pB.nameTH} (${pB.nameEN})` : '?';
    const textC = pC ? `${pC.nameTH} (${pC.nameEN})` : '?';
    
    if (pC) {
        return `${textA} + ${textB} - ${textC}`;
    }
    
    const parts = [];
    if (textA) parts.push(textA);
    if (pB && pB.nameEN !== pA.nameEN) parts.push(textB);
    return parts.join(' / ');
}


// 7. Event Listeners & Navigation Tabs
function setupEventListeners() {
    DOM.tabUranian.addEventListener('click', () => switchTab('uranian'));
    DOM.tabHouse.addEventListener('click', () => switchTab('house'));
    DOM.tabAsteroid.addEventListener('click', () => switchTab('asteroid'));

    if (DOM.searchTypeEquationBtn) {
        DOM.searchTypeEquationBtn.addEventListener('click', () => setSearchType('equation'));
    }
    if (DOM.searchTypeKeywordBtn) {
        DOM.searchTypeKeywordBtn.addEventListener('click', () => setSearchType('keyword'));
    }

    DOM.btnDelete.addEventListener('click', deleteLastPlanet);
    DOM.btnClear.addEventListener('click', clearBuilder);
    DOM.searchInputKey.addEventListener('input', debounce(handleSearchInput, 200));
    DOM.searchClearKey.addEventListener('click', () => {
        DOM.searchInputKey.value = '';
        DOM.searchClearKey.style.display = 'none';
        handleSearchInput();
        DOM.searchInputKey.focus();
    });

    // House tab listeners
    DOM.searchInputHouse.addEventListener('input', debounce(handleHouseSearchInput, 200));
    DOM.searchClearHouse.addEventListener('click', () => {
        DOM.searchInputHouse.value = '';
        DOM.searchClearHouse.style.display = 'none';
        handleHouseSearchInput();
        DOM.searchInputHouse.focus();
    });
    if (DOM.btnHouseClear) {
        DOM.btnHouseClear.addEventListener('click', clearHouseSelection);
    }

    // Asteroid tab listeners
    if (DOM.searchSelectAsteroidName) {
        DOM.searchSelectAsteroidName.addEventListener('change', handleAsteroidNameFilterChange);
    }
    if (DOM.searchSelectAsteroidSign) {
        DOM.searchSelectAsteroidSign.addEventListener('change', handleAsteroidSignFilterChange);
    }
    if (DOM.searchInputAsteroidKeyword) {
        DOM.searchInputAsteroidKeyword.addEventListener('input', handleAsteroidKeywordChange);
    }
    if (DOM.searchClearAsteroidKeyword) {
        DOM.searchClearAsteroidKeyword.addEventListener('click', clearAsteroidKeyword);
    }
    if (DOM.btnAsteroidClear) {
        DOM.btnAsteroidClear.addEventListener('click', clearAsteroidSelection);
    }
}

function switchTab(tabId) {
    if (STATE.activeTab === tabId) return;
    
    STATE.activeTab = tabId;
    clearBuilder();
    
    DOM.tabUranian.classList.toggle('active', tabId === 'uranian');
    DOM.tabHouse.classList.toggle('active', tabId === 'house');
    DOM.tabAsteroid.classList.toggle('active', tabId === 'asteroid');
    
    DOM.uranianView.classList.toggle('active', tabId === 'uranian');
    DOM.houseView.classList.toggle('active', tabId === 'house');
    DOM.asteroidView.classList.toggle('active', tabId === 'asteroid');
    
    if (tabId === 'uranian') {
        DOM.searchInputKey.focus();
        updateUranianResultsVisibility();
    } else if (tabId === 'house') {
        renderHouseTab();
    } else if (tabId === 'asteroid') {
        renderAsteroidList();
        renderAsteroidDetails();
    }
}


// Consolidated Results Visibility toggler
function updateUranianResultsVisibility() {
    const keyVal = DOM.searchInputKey.value.trim();
    const hasSearch = !!keyVal;
    
    const hasFactors = STATE.selectedFactors.length > 0;
    
    if (hasSearch) {
        // Show search list and hide interpretation card
        DOM.interpretationResults.style.display = 'none';
        DOM.searchResultsSection.style.display = 'block';
    } else {
        if (hasFactors) {
            // Show interpretation card and hide search list
            DOM.interpretationResults.style.display = 'block';
            DOM.searchResultsSection.style.display = 'none';
        } else {
            // Show default full search list (database index)
            DOM.interpretationResults.style.display = 'none';
            DOM.searchResultsSection.style.display = 'block';
            renderSearchList(''); // Render all items
        }
    }
}

function setSearchType(type) {
    STATE.searchType = type;
    const btnEq = DOM.searchTypeEquationBtn;
    const btnKw = DOM.searchTypeKeywordBtn;
    const inputKey = DOM.searchInputKey;

    if (btnEq) btnEq.classList.toggle('active', type === 'equation');
    if (btnKw) btnKw.classList.toggle('active', type === 'keyword');

    // Equation mode has no search box (stars are picked directly), so clear
    // any leftover keyword text — otherwise it would keep silently filtering
    // once hidden.
    if (type === 'equation' && inputKey) {
        inputKey.value = '';
        if (DOM.searchClearKey) DOM.searchClearKey.style.display = 'none';
    }

    updateSearchModeVisibility(type);
    handleSearchInput();
}

// 8. General Search Tab Browser
function handleSearchInput() {
    const keyVal = DOM.searchInputKey.value.trim().toLowerCase();
    DOM.searchClearKey.style.display = keyVal ? 'block' : 'none';
    
    renderSearchList(keyVal);
    updateUranianResultsVisibility();
}

function renderSearchList(keyQuery = '') {
    DOM.searchResultsList.innerHTML = '';
    let filtered = PLANETARY_DB;
    const searchType = STATE.searchType || 'equation';
    
    if (keyQuery) {
        filtered = filtered.filter(row => {
            if (searchType === 'keyword') {
                return (
                    row.desc_th.toLowerCase().includes(keyQuery) ||
                    row.desc_en.toLowerCase().includes(keyQuery)
                );
            } else {
                // Equation search mode
                return (
                    row.eq.toLowerCase().includes(keyQuery) ||
                    row.a_en.toLowerCase().includes(keyQuery) ||
                    row.b_en.toLowerCase().includes(keyQuery) ||
                    row.c_en.toLowerCase().includes(keyQuery) ||
                    row.a_th.toLowerCase().includes(keyQuery) ||
                    row.b_th.toLowerCase().includes(keyQuery) ||
                    row.c_th.toLowerCase().includes(keyQuery)
                );
            }
        });
    }
    
    const limit = Math.min(filtered.length, 30);
    DOM.searchMeta.innerText = keyQuery
        ? `พบผลลัพธ์ ${filtered.length.toLocaleString()} รายการ (แสดง ${limit} รายการแรก)`
        : `แสดงรายการสมการและคำแปล (แสดง ${limit} รายการแรกจาก ${filtered.length.toLocaleString()} รายการ)`;
        
    if (filtered.length === 0) {
        DOM.searchResultsList.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
                <p>ไม่พบรายการที่ตรงกับคำค้นหาของคุณ</p>
            </div>
        `;
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < limit; i++) {
        const row = filtered[i];
        const item = document.createElement('div');
        item.className = 'search-item';
        
        const factorsText = getFactorsBreakdownText(row);
        const itemMainDesc = escapeHtml(row.desc_th) || 'ไม่มีคำแปลภาษาไทย';
        const itemSubDesc = escapeHtml(row.desc_en);

        item.innerHTML = `
            <div class="search-item-eq">
                <span>${escapeHtml(formatEquationDisplay(row.eq))}</span>
            </div>
            <div class="search-item-factors">${factorsText}</div>
            <div class="search-item-desc">${itemMainDesc}</div>
            ${itemSubDesc ? `<div class="search-item-en-desc">${itemSubDesc}</div>` : ''}
        `;
        
        item.addEventListener('click', () => {
            loadFormulaFromSearch(row);
        });
        
        fragment.appendChild(item);
    }
    
    DOM.searchResultsList.appendChild(fragment);
}

function loadFormulaFromSearch(row) {
    // Clear search values to toggle back to the interpretation card view
    DOM.searchInputKey.value = '';
    DOM.searchClearKey.style.display = 'none';

    if (STATE.activeTab !== 'uranian') {
        switchTab('uranian');
    }

    // Load the row's own a/b/c factors directly (2 or 3, whatever the row has) —
    // no need to reverse-engineer it from the eq string anymore.
    const a = getPlanet(row.a_en);
    const b = getPlanet(row.b_en);
    const c = getPlanet(row.c_en);

    const factors = [];
    if (a) factors.push(a);
    if (b) factors.push(b);
    if (c) factors.push(c);

    STATE.selectedFactors = factors.slice(0, MAX_EQUATION_FACTORS);

    updateBuilderUI();
    queryDatabase();
    updateUranianResultsVisibility();
    DOM.uranianView.scrollIntoView({ behavior: 'smooth' });
}


// 9. House Tab Logic
// Reset the house-number and star selection to "nothing chosen" (null) so
// every square/button visibly returns to its unselected color, and the user
// picks a fresh house + star from a clean slate for the next lookup.
function clearHouseSelection() {
    HOUSE_STATE.system = 'ลัคนา';
    HOUSE_STATE.house = null;
    HOUSE_STATE.planet = null;
    if (DOM.houseSystemSelect) DOM.houseSystemSelect.value = 'ลัคนา';
    renderHouseTab();
}

const HOUSE_SYSTEMS = [
    { id: 'เมอริเดียน', name: 'เมอริเดียน (MC)', short: 'MC' },
    { id: 'ลัคนา', name: 'ลัคนา (ASC)', short: 'ASC' },
    { id: 'อาทิตย์', name: 'อาทิตย์ (Sun)', short: 'SUN' },
    { id: 'จันทร์', name: 'จันทร์ (Moon)', short: 'MOON' },
    { id: 'โลก', name: 'โลก (Earth)', short: 'EARTH' },
    { id: 'ราหู', name: 'ราหู (Node)', short: 'NODE' }
];

function initHouseTab() {
    // 1. Populate House System dropdown
    DOM.houseSystemSelect.innerHTML = HOUSE_SYSTEMS.map(sys =>
        `<option value="${escapeHtml(sys.id)}">${escapeHtml(sys.name)}</option>`
    ).join('');
    DOM.houseSystemSelect.value = HOUSE_STATE.system;
    DOM.houseSystemSelect.addEventListener('change', () => {
        HOUSE_STATE.system = DOM.houseSystemSelect.value;
        renderHouseTab();
    });

    // 2. Populate House Number dropdown (blank option = "nothing chosen" / cleared state)
    const houseOptions = ['<option value="">— เลือกเรือน —</option>'];
    for (let h = 1; h <= 12; h++) {
        houseOptions.push(`<option value="${h}">เรือนที่ ${h}</option>`);
    }
    DOM.houseNumberSelect.innerHTML = houseOptions.join('');
    DOM.houseNumberSelect.value = HOUSE_STATE.house === null ? '' : String(HOUSE_STATE.house);
    DOM.houseNumberSelect.addEventListener('change', () => {
        const val = DOM.houseNumberSelect.value;
        HOUSE_STATE.house = val === '' ? null : Number(val);
        renderHouseTab();
    });

    // 3. Build Planet/Factor Selector — same full-size buttons as the Planetary tab keyboard
    DOM.housePlanetsGrid.innerHTML = '';
    PLANETS.forEach(p => {
        DOM.housePlanetsGrid.appendChild(createHousePlanetButton(p));
    });
}

function createHousePlanetButton(planet) {
    const btn = document.createElement('button');
    btn.className = `planet-btn ${planet.isPersonal ? 'personal' : ''} ${HOUSE_STATE.planet === planet.id ? 'selected' : ''}`;
    btn.id = `house-planet-btn-${planet.id}`;

    const iconContent = `<img src="${planet.imagePath}?v=110" class="planet-img-icon" alt="${planet.nameEN}">`;
    const label = mapDisplayAbbr(planet.abbr);
    btn.innerHTML = `
        <div class="planet-btn-icon">${iconContent}</div>
        <div class="planet-btn-label">${label}</div>
    `;

    btn.addEventListener('click', () => {
        HOUSE_STATE.planet = planet.id;
        renderHouseTab();
    });

    return btn;
}

function renderHouseTab() {
    const generalCard = DOM.houseGeneralCard;
    const resultCard = DOM.houseInterpretationResults;

    // Keep the two dropdowns in sync with state (they can also change via the
    // house-search-results list or the clear button, not just direct selects).
    if (DOM.houseSystemSelect) DOM.houseSystemSelect.value = HOUSE_STATE.system;
    if (DOM.houseNumberSelect) DOM.houseNumberSelect.value = HOUSE_STATE.house === null ? '' : String(HOUSE_STATE.house);

    // Toggle selected states on Planet Buttons
    PLANETS.forEach(p => {
        const btn = document.getElementById(`house-planet-btn-${p.id}`);
        if (btn) {
            btn.classList.toggle('selected', HOUSE_STATE.planet === p.id);
        }
    });
    
    const houseSystemSafe = escapeHtml(HOUSE_STATE.system);

    if (HOUSE_STATE.house === null) {
        generalCard.innerHTML = `
            <div class="card" style="text-align: center; padding: 30px; color: var(--text-muted);">
                โปรดเลือกเรือนชะตาที่ต้องการดูความหมาย
            </div>
        `;
    } else {
        const rowForGeneral = HOUSE_DB.find(r => r.sys_th === HOUSE_STATE.system && r.house === Number(HOUSE_STATE.house) && r.general);
        const rowForDesc = HOUSE_DB.find(r => r.sys_th === HOUSE_STATE.system && r.house === Number(HOUSE_STATE.house) && r.desc);

        const generalMeaning = escapeHtml(rowForGeneral ? rowForGeneral.general : "ไม่มีข้อมูลความหมายทั่วไปของเรือนนี้");
        const houseDesc = escapeHtml(rowForDesc ? rowForDesc.desc : "");

        generalCard.innerHTML = `
            <div class="card">
                <h3 class="interp-eq-title" style="font-size: 1.1rem; color: var(--gold-dark); margin-bottom: 8px;">
                    ความหมายทั่วไป: เรือนที่ ${HOUSE_STATE.house} ของเรือนชะตา${houseSystemSafe}
                </h3>
                ${houseDesc ? `<p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px; font-style: italic;">${houseDesc}</p>` : ''}
                <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-color);">${generalMeaning}</p>
            </div>
        `;
    }

    PLANETS.forEach(p => {
        const btn = document.getElementById(`house-planet-btn-${p.id}`);
        if (btn) {
            btn.classList.toggle('selected', HOUSE_STATE.planet === p.id);
        }
    });

    if (HOUSE_STATE.planet === null) {
        resultCard.innerHTML = `
            <div class="card" style="text-align: center; padding: 30px; color: var(--text-muted);">
                โปรดเลือกดาว/ปัจจัยที่ต้องการดูความหมาย
            </div>
        `;
    } else if (HOUSE_STATE.house === null) {
        resultCard.innerHTML = `
            <div class="card" style="text-align: center; padding: 30px; color: var(--text-muted);">
                โปรดเลือกเรือนชะตาที่ต้องการดูความหมาย
            </div>
        `;
    } else {
        const planetObj = getPlanet(HOUSE_STATE.planet);
        const pAbbr = planetObj ? planetObj.abbr : HOUSE_STATE.planet;
        const pName = planetObj ? planetObj.nameTH : HOUSE_STATE.planet;
        const pNameSafe = escapeHtml(pName);
        const pAbbrSafe = escapeHtml(mapDisplayAbbr(pAbbr));

        const rowForPlanet = HOUSE_DB.find(r =>
            r.sys_th === HOUSE_STATE.system &&
            r.house === Number(HOUSE_STATE.house) &&
            (r.factor_en === pAbbr || r.factor_th === pName || r.factor_en === HOUSE_STATE.planet)
        );

        if (rowForPlanet && rowForPlanet.meaning) {
            resultCard.innerHTML = `
                <div class="card" style="border-left: 4px solid var(--coral-primary);">
                    <h3 class="interp-eq-title" style="font-size: 1.1rem; margin-bottom: 10px;">
                        ดาว${pNameSafe} (${pAbbrSafe}) ในเรือนที่ ${HOUSE_STATE.house} ของเรือนชะตา${houseSystemSafe}
                    </h3>
                    <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-color);">${escapeHtml(rowForPlanet.meaning)}</p>
                    ${rowForPlanet.extra ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 10px; border-top: 1px dashed rgba(109,82,134,0.15); padding-top: 10px;">*ข้อพิจารณาเพิ่มเติม: ${escapeHtml(rowForPlanet.extra)}</p>` : ''}
                </div>
            `;
        } else {
            resultCard.innerHTML = `
                <div class="card" style="text-align: center; padding: 30px; color: var(--text-muted);">
                    ไม่มีข้อมูลคำทำนายเฉพาะของดาว ${pNameSafe} (${pAbbrSafe}) ในเรือนที่ ${HOUSE_STATE.house} ของเรือนชะตา${houseSystemSafe}
                </div>
            `;
        }
    }
}

function handleHouseSearchInput() {
    const query = DOM.searchInputHouse.value.trim().toLowerCase();
    DOM.searchClearHouse.style.display = query ? 'block' : 'none';
    
    const resultsList = DOM.houseSearchResultsList;
    const layoutGrid = document.querySelector('.house-layout-grid');
    const controls = document.querySelector('.house-selection-panel');
    
    if (!query) {
        resultsList.style.display = 'none';
        layoutGrid.style.display = 'grid';
        controls.style.display = 'grid';
        return;
    }
    
    resultsList.style.display = 'block';
    layoutGrid.style.display = 'none';
    controls.style.display = 'none';
    
    resultsList.innerHTML = '';
    
    const filtered = HOUSE_DB.filter(row => 
        (row.meaning && row.meaning.toLowerCase().includes(query)) ||
        (row.general && row.general.toLowerCase().includes(query)) ||
        (row.sys_th && row.sys_th.toLowerCase().includes(query)) ||
        (row.factor_th && row.factor_th.toLowerCase().includes(query))
    );
    
    if (filtered.length === 0) {
        resultsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                ไม่พบข้อมูลคำทำนายในเรือนชะตาที่ตรงกับคีย์เวิร์ดของคุณ
            </div>
        `;
        return;
    }
    
    const limit = Math.min(filtered.length, 100);
    const title = document.createElement('h3');
    title.style.margin = '10px 0';
    title.style.fontSize = '0.9rem';
    title.style.color = 'var(--text-muted)';
    title.innerText = `พบผลการค้นหา ${filtered.length} รายการ (แสดง 100 รายการแรก)`;
    resultsList.appendChild(title);

    for (let i = 0; i < limit; i++) {
        const row = filtered[i];
        const div = document.createElement('div');
        div.className = 'search-item';
        const label = row.factor_th ? `ดาว${escapeHtml(row.factor_th)}` : 'ความหมายทั่วไป';

        div.innerHTML = `
            <div class="search-item-eq">
                <span>ระบบเรือนชะตา${escapeHtml(row.sys_th)} • เรือนที่ ${row.house} • ${label}</span>
            </div>
            <div class="search-item-desc">${escapeHtml(row.meaning || row.general)}</div>
        `;
        
        div.addEventListener('click', () => {
            HOUSE_STATE.system = row.sys_th;
            HOUSE_STATE.house = Number(row.house);
            if (row.factor_en) {
                HOUSE_STATE.planet = row.factor_en;
            }
            
            DOM.searchInputHouse.value = '';
            DOM.searchClearHouse.style.display = 'none';
            resultsList.style.display = 'none';
            layoutGrid.style.display = 'grid';
            controls.style.display = 'grid';
            renderHouseTab();
        });
        resultsList.appendChild(div);
    }
}


// 10. Asteroid Tab Logic
function initAsteroidTab() {
    // Populate the name dropdown, sorted alphabetically for easy scanning.
    if (DOM.searchSelectAsteroidName) {
        const sortedNames = ASTEROID_DB.map(a => a.name).slice().sort((a, b) => a.localeCompare(b));
        DOM.searchSelectAsteroidName.innerHTML =
            `<option value="">ทุกดาว</option>` +
            sortedNames.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('');
    }
    renderAsteroidList();
    renderAsteroidDetails();
}

function handleAsteroidNameFilterChange() {
    const val = DOM.searchSelectAsteroidName.value;
    if (val) {
        ASTEROID_STATE.selectedAsteroid = val;
        ASTEROID_STATE.userPickedAsteroid = true;
        // A sign filter is already active — that's the sign the user wants to see.
        if (ASTEROID_STATE.signFilter) {
            ASTEROID_STATE.selectedSign = ASTEROID_STATE.signFilter;
        }
    } else {
        ASTEROID_STATE.userPickedAsteroid = false;
    }
    renderAsteroidList();
    refreshAsteroidFocusView();
}

function handleAsteroidSignFilterChange() {
    ASTEROID_STATE.signFilter = DOM.searchSelectAsteroidSign.value;
    // Keep the detail panel's shown sign in sync regardless of which dropdown
    // (name or sign) the user touched first.
    if (ASTEROID_STATE.signFilter) {
        ASTEROID_STATE.selectedSign = ASTEROID_STATE.signFilter;
    }
    renderAsteroidList();
    refreshAsteroidFocusView();
}

// Does this asteroid have a defined meaning for the given Thai sign name?
// signTh === '' means "every sign" (no filtering).
function asteroidHasSignMeaning(astName, signTh) {
    if (!signTh) return true;
    return ASTEROID_SIGN_DB.some(row =>
        row.name.toLowerCase() === astName.toLowerCase() &&
        (row.sign_th === signTh)
    );
}

// Does this asteroid's name, short description, or (sign-scoped) meaning text
// contain the keyword? Empty keyword always matches. When a sign filter is
// active, only that sign's meaning text is searched; otherwise every sign's
// meaning text for this asteroid is searched.
function asteroidMatchesKeyword(ast, keyword) {
    const kw = (keyword || '').trim().toLowerCase();
    if (!kw) return true;
    if (ast.name.toLowerCase().includes(kw)) return true;
    if (ast.desc_th && ast.desc_th.toLowerCase().includes(kw)) return true;
    const rows = ASTEROID_SIGN_DB.filter(row =>
        row.name.toLowerCase() === ast.name.toLowerCase() &&
        (!ASTEROID_STATE.signFilter || row.sign_th === ASTEROID_STATE.signFilter)
    );
    return rows.some(row => (row.meaning || '').toLowerCase().includes(kw));
}

function handleAsteroidKeywordChange() {
    ASTEROID_STATE.keyword = DOM.searchInputAsteroidKeyword.value;
    if (DOM.searchClearAsteroidKeyword) {
        DOM.searchClearAsteroidKeyword.style.display = ASTEROID_STATE.keyword ? '' : 'none';
    }
    renderAsteroidList();
    refreshAsteroidFocusView();
}

function clearAsteroidKeyword() {
    ASTEROID_STATE.keyword = '';
    if (DOM.searchInputAsteroidKeyword) DOM.searchInputAsteroidKeyword.value = '';
    if (DOM.searchClearAsteroidKeyword) DOM.searchClearAsteroidKeyword.style.display = 'none';
    renderAsteroidList();
    refreshAsteroidFocusView();
}

function clearAsteroidSelection() {
    ASTEROID_STATE.selectedAsteroid = 'The Aries Point';
    ASTEROID_STATE.selectedSign = 'เมษ';
    ASTEROID_STATE.signFilter = '';
    ASTEROID_STATE.userPickedAsteroid = false;
    ASTEROID_STATE.keyword = '';

    if (DOM.searchSelectAsteroidName) DOM.searchSelectAsteroidName.value = '';
    if (DOM.searchSelectAsteroidSign) DOM.searchSelectAsteroidSign.value = '';
    if (DOM.searchInputAsteroidKeyword) DOM.searchInputAsteroidKeyword.value = '';
    if (DOM.searchClearAsteroidKeyword) DOM.searchClearAsteroidKeyword.style.display = 'none';

    renderAsteroidList();
    refreshAsteroidFocusView();
}

function renderAsteroidList() {
    DOM.asteroidList.innerHTML = '';

    const filtered = ASTEROID_DB.filter(ast =>
        asteroidHasSignMeaning(ast.name, ASTEROID_STATE.signFilter) &&
        asteroidMatchesKeyword(ast, ASTEROID_STATE.keyword)
    );

    if (filtered.length === 0) {
        DOM.asteroidList.innerHTML = `<div style="padding: 20px; color: var(--text-muted); text-align: center;">ไม่พบข้อมูล</div>`;
        return;
    }

    filtered.forEach(ast => {
        const item = document.createElement('div');
        item.className = `asteroid-list-item ${ASTEROID_STATE.selectedAsteroid === ast.name ? 'active' : ''}`;
        item.innerHTML = `
            <div style="font-weight: 600; font-size: 0.9rem;">${escapeHtml(ast.name)}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted); text-overflow: ellipsis; white-space: nowrap; overflow: hidden; margin-top: 2px;">
                ${escapeHtml(ast.desc_th)}
            </div>
        `;
        item.addEventListener('click', () => {
            ASTEROID_STATE.selectedAsteroid = ast.name;
            ASTEROID_STATE.userPickedAsteroid = true;
            // A sign filter is already active — that's the sign the user wants to see.
            if (ASTEROID_STATE.signFilter) {
                ASTEROID_STATE.selectedSign = ASTEROID_STATE.signFilter;
            }
            Array.from(DOM.asteroidList.children).forEach(child => child.classList.remove('active'));
            item.classList.add('active');
            refreshAsteroidFocusView();
        });
        DOM.asteroidList.appendChild(item);
    });
}

// Once both a specific asteroid AND a specific sign are chosen, collapse down
// to a single focused answer — hide the list of other asteroids so the result
// isn't lost among unrelated options.
function isAsteroidViewFocused() {
    return !!ASTEROID_STATE.signFilter && ASTEROID_STATE.userPickedAsteroid;
}

function refreshAsteroidFocusView() {
    // Keep the name dropdown in sync with state (it can also change via the
    // sidebar list click, not just the dropdown itself).
    if (DOM.searchSelectAsteroidName) {
        DOM.searchSelectAsteroidName.value = ASTEROID_STATE.userPickedAsteroid ? ASTEROID_STATE.selectedAsteroid : '';
    }
    if (DOM.asteroidSidebar) {
        DOM.asteroidSidebar.style.display = isAsteroidViewFocused() ? 'none' : '';
    }
    renderAsteroidDetails();
}

const ZODIAC_SIGNS = [
    { th: 'เมษ', en: 'Aries', element: 'fire' },
    { th: 'พฤษภ', en: 'Taurus', element: 'earth' },
    { th: 'มิถุน', en: 'Gemini', element: 'air' },
    { th: 'กรกฎ', en: 'Cancer', element: 'water' },
    { th: 'สิงห์', en: 'Leo', element: 'fire' },
    { th: 'กันย์', en: 'Virgo', element: 'earth' },
    { th: 'ตุลย์', en: 'Libra', element: 'air' },
    { th: 'พิจิก', en: 'Scorpio', element: 'water' },
    { th: 'ธนู', en: 'Sagittarius', element: 'fire' },
    { th: 'มกร', en: 'Capricorn', element: 'earth' },
    { th: 'กุมภ์', en: 'Aquarius', element: 'air' },
    { th: 'มีน', en: 'Pisces', element: 'water' }
];

function renderAsteroidDetails() {
    const panel = DOM.asteroidDetailPanel;
    panel.innerHTML = '';

    const signFilter = ASTEROID_STATE.signFilter;
    const keyword = ASTEROID_STATE.keyword.trim();
    const userPicked = ASTEROID_STATE.userPickedAsteroid;

    // If user explicitly picked a single asteroid from dropdown or list
    if (userPicked) {
        const ast = ASTEROID_DB.find(a => a.name === ASTEROID_STATE.selectedAsteroid);
        if (!ast) {
            panel.innerHTML = `<div style="padding: 40px; text-align: center; color: var(--text-muted);">โปรดเลือกดาวเคราะห์น้อยจากรายการ</div>`;
            return;
        }
        renderSingleAsteroidDetail(ast, panel);
        return;
    }

    // Otherwise, display ALL matching possibilities for the active sign / keyword filter
    const matches = ASTEROID_DB.filter(ast =>
        asteroidHasSignMeaning(ast.name, signFilter) &&
        asteroidMatchesKeyword(ast, keyword)
    );

    if (matches.length === 0) {
        panel.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px; color: var(--text-muted);">
                <div style="font-size: 2rem; margin-bottom: 8px;">☄️</div>
                <div style="font-weight: 600; font-size: 1rem; margin-bottom: 6px;">ไม่พบข้อมูลดาวเคราะห์น้อย</div>
                <p style="font-size: 0.82rem;">ลองเปลี่ยนราศีหรือคำค้นหาคีย์เวิร์ดใหม่อีกครั้ง</p>
            </div>
        `;
        return;
    }

    const titleText = (signFilter || keyword)
        ? `พบผลการค้นหา ${matches.length} รายการ (แสดงผลทุกความเป็นไปได้)`
        : `รายการดาวเคราะห์น้อยทั้งหมด (${matches.length} รายการ)`;

    let html = `
        <div class="asteroid-results-header" style="font-size: 0.88rem; font-weight: 600; color: var(--gold-dark); margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span>✨ ${escapeHtml(titleText)}</span>
        </div>
    `;

    matches.forEach(ast => {
        const signRow = signFilter ? ASTEROID_SIGN_DB.find(r => r.name.toLowerCase() === ast.name.toLowerCase() && r.sign_th === signFilter) : null;
        
        let signTextHTML = '';
        if (signRow && signRow.meaning) {
            signTextHTML = `
                <div style="margin-top: 10px; padding: 10px 12px; background: rgba(122,44,184,0.06); border-left: 3px solid #7A2CB8; border-radius: 4px;">
                    <div style="font-size: 0.8rem; font-weight: 700; color: #FDC94D; margin-bottom: 4px;">ดาว ${escapeHtml(ast.name)} ในราศี${escapeHtml(signFilter)}:</div>
                    <div style="font-size: 0.88rem; line-height: 1.5; color: var(--text-color);">${escapeHtml(signRow.meaning)}</div>
                </div>
            `;
        }

        html += `
            <div class="card asteroid-match-card" style="margin-bottom: 14px; padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
                    <div>
                        <h3 class="interp-eq-title" style="font-size: 1.1rem; margin: 0; display: inline-block;">${escapeHtml(ast.name)}</h3>
                        <span style="font-size: 0.65rem; background: rgba(122, 44, 184, 0.15); color: #7A2CB8; padding: 2px 8px; border-radius: 99px; font-weight: 600; display: inline-block; margin-left: 8px;">
                            ${ast.type === 'TNP' ? 'ดาวเคราะห์ทรานส์เนปจูน' : (ast.type === 'Asteroid' ? 'ดาวเคราะห์น้อย' : 'จุดสำคัญ')}
                        </span>
                    </div>
                </div>
                <p style="font-size: 0.9rem; line-height: 1.5; color: var(--text-color); margin-bottom: 4px;">${escapeHtml(ast.desc_th)}</p>
                ${signTextHTML}
            </div>
        `;
    });

    panel.innerHTML = html;
}

function renderSingleAsteroidDetail(ast, panel) {
    const signFilter = ASTEROID_STATE.signFilter;
    const signRow = signFilter ? ASTEROID_SIGN_DB.find(r => r.name.toLowerCase() === ast.name.toLowerCase() && r.sign_th === signFilter) : null;
        
    let signTextHTML = '';
    if (signRow && signRow.meaning) {
        signTextHTML = `
            <div style="margin-top: 10px; padding: 10px 12px; background: rgba(122,44,184,0.06); border-left: 3px solid #7A2CB8; border-radius: 4px;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #FDC94D; margin-bottom: 4px;">ดาว ${escapeHtml(ast.name)} ในราศี${escapeHtml(signFilter)}:</div>
                <div style="font-size: 0.88rem; line-height: 1.5; color: var(--text-color);">${escapeHtml(signRow.meaning)}</div>
            </div>
        `;
    }

    panel.innerHTML = `
        <div class="card">
            <div style="margin-bottom: 12px;">
                <h2 class="interp-eq-title" style="font-size: 1.3rem; margin: 0; display: inline-block;">${escapeHtml(ast.name)}</h2>
                <span style="font-size: 0.68rem; background: rgba(122, 44, 184, 0.15); color: #7A2CB8; padding: 2px 8px; border-radius: 99px; font-weight: 600; display: inline-block; margin-left: 8px;">
                    ประเภท: ${ast.type === 'TNP' ? 'ดาวเคราะห์ทรานส์เนปจูน' : (ast.type === 'Asteroid' ? 'ดาวเคราะห์น้อย' : 'จุดสำคัญ')}
                </span>
            </div>

            <div class="asteroid-desc-block" style="background: rgba(109,82,134,0.03); padding: 15px; border-radius: 8px; border: 1px solid rgba(109,82,134,0.08);">
                <p style="font-size: 0.92rem; line-height: 1.6; color: var(--text-color);">${escapeHtml(ast.desc_th)}</p>

                ${ast.desc_en ? `
                    <p style="font-size: 0.82rem; line-height: 1.5; color: var(--text-muted); font-style: italic; border-top: 1px dashed rgba(109,82,134,0.15); padding-top: 8px; margin-top: 8px;">${escapeHtml(ast.desc_en)}</p>
                ` : ''}
            </div>

            ${signTextHTML}
        </div>
    `;
}

function selectAsteroidSign(sign) {
    ASTEROID_STATE.selectedSign = sign;
    renderAsteroidDetails();
}


// Utilities
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
