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

        .replace(/'/g, '&#39;')

        .replace(/\//g, '&#47;')

        .replace(/`/g, '&#96;');

}



function sanitizeSearchQuery(rawQuery) {

    if (!rawQuery) return '';

    return String(rawQuery).trim().substring(0, 100);

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

        nameTH: 'พฤหัส',

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

    activeTab: 'sign',              // 'sign', 'transit', 'uranian', 'house', 'asteroid'

    btnMode: 'symbol',              // 'symbol' or 'thai'

    searchType: 'equation',         // 'equation' or 'keyword'

    selectedFactors: [],            // Array of selected planet objects (max 3)

    currentMatches: [],             // Current database matches found

    builderCollapsed: false         // Auto-collapse keyboard when equation results are displayed

};



const TRANSIT_STATE = {

    subtab: 'house',                // 'house' or 'aspect'

    planet: 'อาทิตย์',

    house: 1

};



const ASPECT_STATE = {

    transitPlanet: 'อาทิตย์',

    aspect: null,                   // null = no default aspect selected; set on user click

    natalPlanet: 'อาทิตย์'

};



const HOUSE_STATE = {

    system: 'ลัคนา',                // 'เมอริเดียน', 'ลัคนา', 'อาทิตย์', 'จันทร์', 'โลก', 'ราหู'

    house: 1,                       // 1 to 12

    planet: 'Me'                    // Active planet ID in house tab

};



const SIGN_STATE = {

    selectedSign: 'Aries',  // Default to Aries

    selectedPlanet: '',     // No planet selected by default

    keyword: ''

};



const ASTEROID_STATE = {

    selectedAsteroid: 'The Aries Point', // Active asteroid name (EN)

    selectedSign: 'เมษ',                // Active sign (TH)

    signFilter: '',                     // '' = every sign; otherwise a Thai sign name from the top filter

    userPickedAsteroid: false,          // true once the user has explicitly clicked an asteroid from the list

    keyword: ''                         // free-text keyword filter (name / desc / meaning)

};



// DOM Elements cache

const DOM = {};



function initDOMCache() {

    DOM.tabSign = document.getElementById('tab-sign');

    DOM.tabUranian = document.getElementById('tab-uranian');

    DOM.tabTransit = document.getElementById('tab-transit');

    DOM.tabHouse = document.getElementById('tab-house');

    DOM.tabAsteroid = document.getElementById('tab-asteroid');



    DOM.signView = document.getElementById('sign-view');

    DOM.uranianView = document.getElementById('uranian-view');

    DOM.transitView = document.getElementById('transit-view');

    DOM.houseView = document.getElementById('house-view');

    DOM.asteroidView = document.getElementById('asteroid-view');



    // Sign DOMs

    DOM.btnSignClear = document.getElementById('btn-sign-clear');

    DOM.signPlanetsGrid = document.getElementById('sign-planets-grid');

    DOM.signPlanetZodiacGrid = document.getElementById('sign-planet-zodiac-grid');

    DOM.signGeneralCard = document.getElementById('sign-general-card');

    DOM.signInterpretationResults = document.getElementById('sign-interpretation-results');

    DOM.searchInputSign = document.getElementById('search-input-sign');

    DOM.searchClearSign = document.getElementById('search-clear-sign');

    DOM.signSearchResultsList = document.getElementById('sign-search-results-list');



    // Transit DOMs

    DOM.subtabTransitHouse = document.getElementById('subtab-transit-house');

    DOM.subtabTransitAspect = document.getElementById('subtab-transit-aspect');

    DOM.subviewTransitHouse = document.getElementById('subview-transit-house');

    DOM.subviewTransitAspect = document.getElementById('subview-transit-aspect');

    DOM.btnTransitClear = document.getElementById('btn-transit-clear');

    DOM.transitPlanetsGrid = document.getElementById('transit-planets-grid');

    DOM.searchInputTransit = document.getElementById('search-input-transit');

    DOM.searchClearTransit = document.getElementById('search-clear-transit');

    DOM.transitInterpretationResults = document.getElementById('transit-interpretation-results');

    DOM.transitSearchResultsList = document.getElementById('transit-search-results-list');



    // Aspect DOMs
    DOM.btnAspectClear = document.getElementById('btn-aspect-clear');
    DOM.aspectTransitPlanetsGrid = document.getElementById('aspect-transit-planets-grid');
    DOM.aspectTypesGrid = document.getElementById('aspect-types-grid');
    DOM.aspectNatalPlanetsGrid = document.getElementById('aspect-natal-planets-grid');
    DOM.searchInputAspect = document.getElementById('search-input-aspect');
    DOM.searchClearAspect = document.getElementById('search-clear-aspect');
    DOM.aspectInterpretationResults = document.getElementById('aspect-interpretation-results');
    DOM.aspectSearchResultsList = document.getElementById('aspect-search-results-list');

    // Lord DOMs
    DOM.subtabTransitLord = document.getElementById('subtab-transit-lord');
    DOM.subviewTransitLord = document.getElementById('subview-transit-lord');
    DOM.btnLordClear = document.getElementById('btn-lord-clear');
    DOM.lordHousesGrid = document.getElementById('lord-houses-grid');
    DOM.lordSelectPlanet = document.getElementById('lord-select-planet');
    DOM.lordSelectHx = document.getElementById('lord-select-hx');
    DOM.lordSelectSignM = document.getElementById('lord-select-sign-m');
    DOM.lordSelectHn = document.getElementById('lord-select-hn');
    DOM.lordSelectSignN = document.getElementById('lord-select-sign-n');
    DOM.searchInputLord = document.getElementById('search-input-lord');
    DOM.searchClearLord = document.getElementById('search-clear-lord');
    DOM.lordInterpretationResults = document.getElementById('lord-interpretation-results');
    DOM.lordSearchResultsList = document.getElementById('lord-search-results-list');



    // Uranian / Equations DOMs

    DOM.equationDisplayCard = document.getElementById('equation-display-card');

    DOM.equationTokens = document.getElementById('equation-tokens');

    DOM.btnDelete = document.getElementById('btn-delete');

    DOM.btnClear = document.getElementById('btn-clear');

    DOM.keyboardSection = document.getElementById('keyboard-section');

    DOM.keyboardGrid = document.getElementById('keyboard-grid');

    DOM.interpretationResults = document.getElementById('interpretation-results');

    DOM.searchTypeEquationBtn = document.getElementById('search-type-equation');

    DOM.searchTypeKeywordBtn = document.getElementById('search-type-keyword');

    DOM.searchBarKeyContainer = document.getElementById('search-bar-key-container');

    DOM.searchInputKey = document.getElementById('search-input-key');

    DOM.searchClearKey = document.getElementById('search-clear-key');

    DOM.searchMeta = document.getElementById('search-meta');

    DOM.searchResultsSection = document.getElementById('search-results-section');

    DOM.searchResultsList = document.getElementById('search-results-list');



    // House DOMs

    DOM.houseSystemSelect = document.getElementById('house-system-select');

    DOM.houseNumberSelect = document.getElementById('house-number-select');

    DOM.housePlanetsGrid = document.getElementById('house-planets-grid');

    DOM.houseGeneralCard = document.getElementById('house-general-card');

    DOM.houseInterpretationResults = document.getElementById('house-interpretation-results');

    DOM.btnHouseClear = document.getElementById('btn-house-clear');

    DOM.searchInputHouse = document.getElementById('search-input-house');

    DOM.searchClearHouse = document.getElementById('search-clear-house');

    DOM.houseSearchResultsList = document.getElementById('search-results-list');



    // Asteroid DOMs

    DOM.btnAsteroidClear = document.getElementById('btn-asteroid-clear');

    DOM.searchSelectAsteroidName = document.getElementById('search-select-asteroid-name');

    DOM.searchSelectAsteroidSign = document.getElementById('search-select-asteroid-sign');

    DOM.searchInputAsteroidKeyword = document.getElementById('search-input-asteroid-keyword');

    DOM.searchClearAsteroidKeyword = document.getElementById('search-clear-asteroid-keyword');

    DOM.asteroidSidebar = document.querySelector('.asteroid-sidebar');

    DOM.asteroidList = document.getElementById('asteroid-list');

    DOM.asteroidDetailPanel = document.getElementById('asteroid-detail-panel');

}



// 3. Initialization

document.addEventListener('DOMContentLoaded', () => {

    initTransitTab();

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

    if (DOM.tabSign) DOM.tabSign.addEventListener('click', () => switchTab('sign'));

    if (DOM.tabUranian) DOM.tabUranian.addEventListener('click', () => switchTab('uranian'));

    if (DOM.tabTransit) DOM.tabTransit.addEventListener('click', () => switchTab('transit'));

    if (DOM.tabHouse) DOM.tabHouse.addEventListener('click', () => switchTab('house'));

    if (DOM.tabAsteroid) DOM.tabAsteroid.addEventListener('click', () => switchTab('asteroid'));



    // Sign listeners

    if (DOM.btnSignClear) DOM.btnSignClear.addEventListener('click', clearSignSelection);

    if (DOM.searchInputSign) {

        DOM.searchInputSign.addEventListener('input', debounce(handleSignSearchInput, 200));

    }

    if (DOM.searchClearSign) {

        DOM.searchClearSign.addEventListener('click', () => {

            DOM.searchInputSign.value = '';

            DOM.searchClearSign.style.display = 'none';

            handleSignSearchInput();

            DOM.searchInputSign.focus();

        });

    }



    // Transit sub-tab listeners
    if (DOM.subtabTransitHouse) {
        DOM.subtabTransitHouse.addEventListener('click', () => switchTransitSubtab('house'));
    }
    if (DOM.subtabTransitAspect) {
        DOM.subtabTransitAspect.addEventListener('click', () => switchTransitSubtab('aspect'));
    }
    if (DOM.subtabTransitLord) {
        DOM.subtabTransitLord.addEventListener('click', () => switchTransitSubtab('lord'));
    }

    // Lord listeners
    if (DOM.btnLordClear) {
        DOM.btnLordClear.addEventListener('click', clearLordSelection);
    }

    const lordDropdownKeys = ['lordSelectPlanet', 'lordSelectHx', 'lordSelectSignM', 'lordSelectHn', 'lordSelectSignN'];
    lordDropdownKeys.forEach(domKey => {
        if (DOM[domKey]) {
            DOM[domKey].addEventListener('change', () => {
                if (DOM.lordSelectPlanet) LORD_STATE.planet = DOM.lordSelectPlanet.value;
                if (DOM.lordSelectHx) LORD_STATE.hx = parseInt(DOM.lordSelectHx.value, 10);
                if (DOM.lordSelectSignM) LORD_STATE.signM = DOM.lordSelectSignM.value;
                if (DOM.lordSelectHn) LORD_STATE.hn = parseInt(DOM.lordSelectHn.value, 10);
                if (DOM.lordSelectSignN) LORD_STATE.signN = DOM.lordSelectSignN.value;
                LORD_STATE.searchQuery = '';
                if (DOM.searchInputLord) DOM.searchInputLord.value = '';
                if (DOM.searchClearLord) DOM.searchClearLord.style.display = 'none';
                renderLordInterpretation();
            });
        }
    });

    if (DOM.searchInputLord) {
        DOM.searchInputLord.addEventListener('input', (e) => {
            LORD_STATE.searchQuery = e.target.value;
            if (DOM.searchClearLord) DOM.searchClearLord.style.display = e.target.value ? 'flex' : 'none';
            renderLordInterpretation();
        });
    }
    if (DOM.searchClearLord) {
        DOM.searchClearLord.addEventListener('click', () => {
            LORD_STATE.searchQuery = '';
            if (DOM.searchInputLord) DOM.searchInputLord.value = '';
            DOM.searchClearLord.style.display = 'none';
            renderLordInterpretation();
        });
    }



    // Transit listeners

    if (DOM.btnTransitClear) {

        DOM.btnTransitClear.addEventListener('click', clearTransitSelection);

    }

    if (DOM.searchInputTransit) {

        DOM.searchInputTransit.addEventListener('input', debounce(renderTransitTab, 200));

    }

    if (DOM.searchClearTransit) {

        DOM.searchClearTransit.addEventListener('click', () => {

            DOM.searchInputTransit.value = '';

            DOM.searchClearTransit.style.display = 'none';

            renderTransitTab();

            DOM.searchInputTransit.focus();

        });

    }



    // Aspect listeners

    if (DOM.btnAspectClear) {

        DOM.btnAspectClear.addEventListener('click', clearAspectSelection);

    }

    if (DOM.searchInputAspect) {

        DOM.searchInputAspect.addEventListener('input', debounce(renderAspectTab, 200));

    }

    if (DOM.searchClearAspect) {

        DOM.searchClearAspect.addEventListener('click', () => {

            DOM.searchInputAspect.value = '';

            DOM.searchClearAspect.style.display = 'none';

            renderAspectTab();

            DOM.searchInputAspect.focus();

        });

    }



    if (DOM.searchTypeEquationBtn) {

        DOM.searchTypeEquationBtn.addEventListener('click', () => setSearchType('equation'));

    }

    if (DOM.searchTypeKeywordBtn) {

        DOM.searchTypeKeywordBtn.addEventListener('click', () => setSearchType('keyword'));

    }



    if (DOM.btnDelete) DOM.btnDelete.addEventListener('click', deleteLastPlanet);

    if (DOM.btnClear) DOM.btnClear.addEventListener('click', clearBuilder);

    if (DOM.searchInputKey) DOM.searchInputKey.addEventListener('input', debounce(handleSearchInput, 200));

    if (DOM.searchClearKey) {

        DOM.searchClearKey.addEventListener('click', () => {

            DOM.searchInputKey.value = '';

            DOM.searchClearKey.style.display = 'none';

            handleSearchInput();

            DOM.searchInputKey.focus();

        });

    }



    // House tab listeners

    if (DOM.searchInputHouse) DOM.searchInputHouse.addEventListener('input', debounce(handleHouseSearchInput, 200));

    if (DOM.searchClearHouse) {

        DOM.searchClearHouse.addEventListener('click', () => {

            DOM.searchInputHouse.value = '';

            DOM.searchClearHouse.style.display = 'none';

            handleHouseSearchInput();

            DOM.searchInputHouse.focus();

        });

    }

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

    STATE.activeTab = tabId;

    clearBuilder();

    

    if (DOM.tabSign) DOM.tabSign.classList.toggle('active', tabId === 'sign');

    if (DOM.tabUranian) DOM.tabUranian.classList.toggle('active', tabId === 'uranian');

    if (DOM.tabTransit) DOM.tabTransit.classList.toggle('active', tabId === 'transit');

    if (DOM.tabHouse) DOM.tabHouse.classList.toggle('active', tabId === 'house');

    if (DOM.tabAsteroid) DOM.tabAsteroid.classList.toggle('active', tabId === 'asteroid');

    

    if (DOM.signView) DOM.signView.style.display = tabId === 'sign' ? 'block' : 'none';

    if (DOM.uranianView) DOM.uranianView.style.display = tabId === 'uranian' ? 'block' : 'none';

    if (DOM.transitView) DOM.transitView.style.display = tabId === 'transit' ? 'block' : 'none';

    if (DOM.houseView) DOM.houseView.style.display = tabId === 'house' ? 'block' : 'none';

    if (DOM.asteroidView) DOM.asteroidView.style.display = tabId === 'asteroid' ? 'block' : 'none';

    

    if (tabId === 'sign') {

        initSignTab();

    } else if (tabId === 'uranian') {

        if (DOM.searchInputKey) DOM.searchInputKey.focus();

        updateUranianResultsVisibility();

    } else if (tabId === 'transit') {

        switchTransitSubtab(TRANSIT_STATE.subtab || 'house');

    } else if (tabId === 'house') {

        renderHouseTab();

    } else if (tabId === 'asteroid') {

        renderAsteroidList();

        renderAsteroidDetails();

    }

}



function switchTransitSubtab(subtab) {
    TRANSIT_STATE.subtab = subtab;

    if (DOM.subtabTransitHouse) DOM.subtabTransitHouse.classList.toggle('active', subtab === 'house');
    if (DOM.subtabTransitAspect) DOM.subtabTransitAspect.classList.toggle('active', subtab === 'aspect');
    if (DOM.subtabTransitLord) DOM.subtabTransitLord.classList.toggle('active', subtab === 'lord');

    if (DOM.subviewTransitHouse) DOM.subviewTransitHouse.style.display = subtab === 'house' ? 'block' : 'none';
    if (DOM.subviewTransitAspect) DOM.subviewTransitAspect.style.display = subtab === 'aspect' ? 'block' : 'none';
    if (DOM.subviewTransitLord) DOM.subviewTransitLord.style.display = subtab === 'lord' ? 'block' : 'none';

    if (subtab === 'house') {
        renderTransitTab();
    } else if (subtab === 'aspect') {
        renderAspectTab();
    } else if (subtab === 'lord') {
        renderLordTab();
    }
}



// 7.1 Transit Tab Logic & Rendering

const TRANSIT_PLANETS = [

    { id: 'Su', abbr: 'Su', nameEN: 'Sun', nameTH: 'อาทิตย์', imagePath: 'img/Su.png', isPersonal: true },

    { id: 'Mo', abbr: 'Mo', nameEN: 'Moon', nameTH: 'จันทร์', imagePath: 'img/Mo.png', isPersonal: true },

    { id: 'Me', abbr: 'Me', nameEN: 'Mercury', nameTH: 'พุธ', imagePath: 'img/Me.png', isPersonal: true },

    { id: 'Ve', abbr: 'Ve', nameEN: 'Venus', nameTH: 'ศุกร์', imagePath: 'img/Ve.png', isPersonal: true },

    { id: 'Ma', abbr: 'Ma', nameEN: 'Mars', nameTH: 'อังคาร', imagePath: 'img/Ma.png', isPersonal: true },

    { id: 'Ju', abbr: 'Ju', nameEN: 'Jupiter', nameTH: 'พฤหัส', imagePath: 'img/Ju.png', isPersonal: false },

    { id: 'Sa', abbr: 'Sa', nameEN: 'Saturn', nameTH: 'เสาร์', imagePath: 'img/Sa.png', isPersonal: false },

    { id: 'Ur', abbr: 'Ur', nameEN: 'Uranus', nameTH: 'ยูเรนัส', imagePath: 'img/Ur.png', isPersonal: false },

    { id: 'Ne', abbr: 'Ne', nameEN: 'Neptune', nameTH: 'เนปจูน', imagePath: 'img/Ne.png', isPersonal: false },

    { id: 'Pl', abbr: 'Pl', nameEN: 'Pluto', nameTH: 'พลูโต', imagePath: 'img/Pl.png', isPersonal: false }

];



function initTransitTab() {

    renderTransitPlanetGrid();

    renderTransitTab();

}



function renderTransitPlanetGrid() {

    const grid = DOM.transitPlanetsGrid;

    if (!grid) return;

    grid.innerHTML = '';



    const row1Planets = TRANSIT_PLANETS.slice(0, 5);

    const row2Planets = TRANSIT_PLANETS.slice(5, 10);



    row1Planets.forEach(p => {

        grid.appendChild(createTransitPlanetBtn(p));

    });



    // Slot 6: House Dropdown Card

    const houseCard = document.createElement('div');

    houseCard.className = 'transit-house-select-card';

    houseCard.innerHTML = `

        <div class="transit-house-card-label">เรือนที่</div>

        <select id="transit-house-select" class="transit-house-dropdown-select">

            ${[1,2,3,4,5,6,7,8,9,10,11,12].map(h => `<option value="${h}" ${Number(TRANSIT_STATE.house) === h ? 'selected' : ''}>${h}</option>`).join('')}

        </select>

    `;

    grid.appendChild(houseCard);



    row2Planets.forEach(p => {

        grid.appendChild(createTransitPlanetBtn(p));

    });



    const selectElem = document.getElementById('transit-house-select');

    if (selectElem) {

        DOM.transitHouseSelect = selectElem;

        selectElem.addEventListener('change', () => {

            TRANSIT_STATE.house = Number(selectElem.value);

            renderTransitTab();

        });

    }

}



function createTransitPlanetBtn(p) {

    const btn = document.createElement('button');

    btn.className = `planet-btn ${p.isPersonal ? 'personal' : ''} ${TRANSIT_STATE.planet === p.nameTH ? 'selected' : ''}`;

    btn.id = `transit-pbtn-${p.id}`;

    const label = mapDisplayAbbr(p.abbr);

    btn.innerHTML = `

        <div class="planet-btn-icon"><img src="${p.imagePath}?v=110" class="planet-img-icon" alt="${p.nameEN}"></div>

        <div class="planet-btn-label">${label}</div>

    `;

    btn.addEventListener('click', () => {

        TRANSIT_STATE.planet = p.nameTH;

        renderTransitPlanetGrid();

        renderTransitTab();

    });

    return btn;

}



function renderTransitTab() {
    const container = DOM.transitInterpretationResults;
    const searchList = DOM.transitSearchResultsList;
    if (!container) return;

    const rawVal = (DOM.searchInputTransit && DOM.searchInputTransit.value) ? DOM.searchInputTransit.value.trim() : '';
    if (rawVal) {
        renderTransitSearchMatches(rawVal);
        return;
    }

    if (searchList) searchList.style.display = 'none';
    container.style.display = 'block';

    const item = typeof TRANSIT_DB !== 'undefined' ? TRANSIT_DB.find(t => t.planet_th === TRANSIT_STATE.planet && t.house === TRANSIT_STATE.house) : null;
    if (!item) {
        container.innerHTML = '<div class="card" style="padding: 20px; text-align: center; color: var(--text-muted);">ไม่พบข้อมูลความหมายดาวจรในเรือนชะตานี้</div>';
        return;
    }

    const posText = item.positive_th || item.positive || 'ไม่มีข้อมูล';
    const negText = item.negative_th || item.negative || 'ไม่มีข้อมูล';

    container.innerHTML = `
        <div class="card" style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 16px; border-bottom: 1px dashed rgba(253, 201, 77, 0.25); padding-bottom: 12px;">
                <h3 class="interp-eq-title" style="font-size: 1.1rem; margin: 0; color: var(--gold-primary);">
                    ${escapeHtml(item.planet_th)} ในเรือนที่ ${item.house}
                </h3>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; align-items: flex-start; gap: 10px;">
                    <div style="width: 22px; height: 22px; border-radius: 50%; background: #2E8B57; color: #FFFFFF; font-weight: 800; font-size: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; user-select: none;">+</div>
                    <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-color); flex: 1; text-align: justify;">
                        ${escapeHtml(posText)}
                    </div>
                </div>

                <div style="display: flex; align-items: flex-start; gap: 10px;">
                    <div style="width: 22px; height: 22px; border-radius: 50%; background: #D32F2F; color: #FFFFFF; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; user-select: none;">−</div>
                    <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-color); flex: 1; text-align: justify;">
                        ${escapeHtml(negText)}
                    </div>
                </div>
            </div>
        </div>
    `;
}



function renderTransitSearchMatches(query) {

    const searchList = DOM.transitSearchResultsList;

    searchList.innerHTML = '';



    const matches = (typeof TRANSIT_DB !== 'undefined' ? TRANSIT_DB : []).filter(r => {

        const pos = r.positive_th || r.positive || '';

        const neg = r.negative_th || r.negative || '';

        return pos.toLowerCase().includes(query) ||

               neg.toLowerCase().includes(query) ||

               (r.planet_th && r.planet_th.toLowerCase().includes(query)) ||

               (r.planet_en && r.planet_en.toLowerCase().includes(query));

    });



    if (matches.length === 0) {

        searchList.innerHTML = `

            <div class="card" style="text-align: center; padding: 30px; color: var(--text-muted);">

                ไม่พบคำแปลดาวจรที่ตรงกับคำสำคัญ "${escapeHtml(query)}"

            </div>

        `;

        return;

    }



    let html = `<div style="font-size: 0.85rem; color: var(--gold-primary); margin-bottom: 12px;">พบ ${matches.length} รายการที่ตรงกับคำว่า "${escapeHtml(query)}":</div>`;



    matches.forEach(item => {

        const posStr = item.positive_th || item.positive || '';

        const negStr = item.negative_th || item.negative || '';

        html += `

            <div class="card" style="margin-bottom: 14px; padding: 16px; cursor: pointer;" onclick="selectTransitMatch('${escapeHtml(item.planet_th)}', ${item.house})">

                <div style="margin-bottom: 10px; border-bottom: 1px dashed rgba(253, 201, 77, 0.2); padding-bottom: 8px;">

                    <h3 class="interp-eq-title" style="font-size: 1.1rem; margin: 0; color: var(--gold-primary);">

                        ${escapeHtml(item.planet_th)} ในเรือนที่ ${item.house}

                    </h3>

                </div>

                ${posStr ? `

                    <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px;">

                        <div style="width: 22px; height: 22px; border-radius: 50%; background: #2E8B57; color: #FFFFFF; font-weight: 800; font-size: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">+</div>

                        <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-color); flex: 1; text-align: justify;">${escapeHtml(posStr)}</div>

                    </div>

                ` : ''}

                ${negStr ? `

                    <div style="display: flex; align-items: flex-start; gap: 10px;">

                        <div style="width: 22px; height: 22px; border-radius: 50%; background: #D32F2F; color: #FFFFFF; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">−</div>

                        <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-color); flex: 1; text-align: justify;">${escapeHtml(negStr)}</div>

                    </div>

                ` : ''}

            </div>

        `;

    });

    searchList.innerHTML = html;




    matches.forEach(item => {

        html += `

            <div class="card" style="margin-bottom: 14px; padding: 16px; cursor: pointer;" onclick="selectTransitMatch('${escapeHtml(item.planet_th)}', ${item.house})">

                <div style="margin-bottom: 10px; border-bottom: 1px dashed rgba(253, 201, 77, 0.2); padding-bottom: 8px;">

                    <h3 class="interp-eq-title" style="font-size: 1.1rem; margin: 0; color: var(--gold-primary);">

                        ${escapeHtml(item.planet_th)}เรือนที่ ${item.house}

                    </h3>

                </div>

                <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px;">

                    <div style="width: 22px; height: 22px; border-radius: 50%; background: #2E8B57; color: #FFFFFF; font-weight: 800; font-size: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">+</div>

                    <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-color); flex: 1;">${escapeHtml(item.positive)}</div>

                </div>

                <div style="display: flex; align-items: flex-start; gap: 10px;">

                    <div style="width: 22px; height: 22px; border-radius: 50%; background: #D32F2F; color: #FFFFFF; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">−</div>

                    <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-color); flex: 1;">${escapeHtml(item.negative)}</div>

                </div>

            </div>

        `;

    });



    searchList.innerHTML = html;

}



function selectTransitMatch(planetTh, houseNum) {

    TRANSIT_STATE.planet = planetTh;

    TRANSIT_STATE.house = houseNum;

    if (DOM.transitHouseSelect) {

        DOM.transitHouseSelect.value = String(houseNum);

    }

    if (DOM.searchInputTransit) {

        DOM.searchInputTransit.value = '';

        if (DOM.searchClearTransit) DOM.searchClearTransit.style.display = 'none';

    }

    renderTransitPlanetGrid();

    renderTransitTab();

}



function clearTransitSelection() {

    TRANSIT_STATE.planet = 'อาทิตย์';

    TRANSIT_STATE.house = 1;

    if (DOM.transitHouseSelect) {

        DOM.transitHouseSelect.value = '1';

    }

    if (DOM.searchInputTransit) {

        DOM.searchInputTransit.value = '';

        if (DOM.searchClearTransit) DOM.searchClearTransit.style.display = 'none';

    }

    renderTransitPlanetGrid();

    renderTransitTab();

}



// 7.2 Aspect Tab Logic & Rendering

const ASPECT_TYPES = [

    { id: 'กุม', nameTH: 'กุม', nameEN: 'Conjunction', degrees: 0, symbol: '☌' },

    { id: 'โยค', nameTH: 'โยค', nameEN: 'Sextile', degrees: 60, symbol: '⚹' },

    { id: 'ฉาก', nameTH: 'ฉาก', nameEN: 'Square', degrees: 90, symbol: '□' },

    { id: 'ตรีโกณ', nameTH: 'ตรีโกณ', nameEN: 'Trine', degrees: 120, symbol: '△' },

    { id: 'เล็ง', nameTH: 'เล็ง', nameEN: 'Opposition', degrees: 180, symbol: '☍' }

];



const NATAL_FACTORS = [

    { id: 'Su', abbr: 'Su', nameEN: 'Sun', nameTH: 'อาทิตย์', imagePath: 'img/Su.png', isPersonal: true },

    { id: 'Mo', abbr: 'Mo', nameEN: 'Moon', nameTH: 'จันทร์', imagePath: 'img/Mo.png', isPersonal: true },

    { id: 'Me', abbr: 'Me', nameEN: 'Mercury', nameTH: 'พุธ', imagePath: 'img/Me.png', isPersonal: true },

    { id: 'Ve', abbr: 'Ve', nameEN: 'Venus', nameTH: 'ศุกร์', imagePath: 'img/Ve.png', isPersonal: true },

    { id: 'Ma', abbr: 'Ma', nameEN: 'Mars', nameTH: 'อังคาร', imagePath: 'img/Ma.png', isPersonal: true },

    { id: 'Ju', abbr: 'Ju', nameEN: 'Jupiter', nameTH: 'พฤหัส', imagePath: 'img/Ju.png', isPersonal: false },

    { id: 'Sa', abbr: 'Sa', nameEN: 'Saturn', nameTH: 'เสาร์', imagePath: 'img/Sa.png', isPersonal: false },

    { id: 'Ur', abbr: 'Ur', nameEN: 'Uranus', nameTH: 'ยูเรนัส', imagePath: 'img/Ur.png', isPersonal: false },

    { id: 'Ne', abbr: 'Ne', nameEN: 'Neptune', nameTH: 'เนปจูน', imagePath: 'img/Ne.png', isPersonal: false },

    { id: 'Pl', abbr: 'Pl', nameEN: 'Pluto', nameTH: 'พลูโต', imagePath: 'img/Pl.png', isPersonal: false },

    { id: 'Asc', abbr: 'Asc', nameEN: 'Ascendant', nameTH: 'ลัคนา', imagePath: 'img/As.png', isPersonal: true },

    { id: 'MC', abbr: 'MC', nameEN: 'Midheaven', nameTH: 'เมอริเดียน/มิดเฮฟเว่น', imagePath: 'img/M.png', isPersonal: true }

];



function initAspectTab() {

    renderAspectTransitPlanetGrid();

    renderAspectTypesGrid();

    renderAspectNatalPlanetGrid();

    renderAspectTab();

}



function renderAspectTransitPlanetGrid() {

    const grid = DOM.aspectTransitPlanetsGrid;

    if (!grid) return;

    grid.innerHTML = '';

    TRANSIT_PLANETS.forEach(p => {

        const btn = document.createElement('button');

        btn.className = `planet-btn ${p.isPersonal ? 'personal' : ''} ${ASPECT_STATE.transitPlanet === p.nameTH ? 'selected' : ''}`;

        btn.id = `aspect-tpbtn-${p.id}`;

        const label = mapDisplayAbbr(p.abbr);

        btn.innerHTML = `

            <div class="planet-btn-icon"><img src="${p.imagePath}?v=110" class="planet-img-icon" alt="${p.nameEN}"></div>

            <div class="planet-btn-label">${label}</div>

        `;

        btn.addEventListener('click', () => {

            ASPECT_STATE.transitPlanet = p.nameTH;

            renderAspectTransitPlanetGrid();

            renderAspectTab();

        });

        grid.appendChild(btn);

    });

}



function renderAspectTypesGrid() {

    const grid = DOM.aspectTypesGrid;

    if (!grid) return;

    grid.innerHTML = '';

    ASPECT_TYPES.forEach(a => {

        const btn = document.createElement('button');

        btn.className = `aspect-type-btn ${ASPECT_STATE.aspect === a.nameTH ? 'selected' : ''}`;

        btn.id = `aspect-btn-${a.id}`;

        btn.innerHTML = `

            <div class="aspect-symbol">${a.symbol}</div>

            <div class="aspect-label">${a.degrees}°</div>

        `;

        btn.addEventListener('click', () => {

            if (ASPECT_STATE.aspect === a.nameTH) {

                ASPECT_STATE.aspect = null;

            } else {

                ASPECT_STATE.aspect = a.nameTH;

            }

            renderAspectTypesGrid();

            renderAspectTab();

        });

        grid.appendChild(btn);

    });

}



function renderAspectNatalPlanetGrid() {

    const grid = DOM.aspectNatalPlanetsGrid;

    if (!grid) return;

    grid.innerHTML = '';

    NATAL_FACTORS.forEach(p => {

        const btn = document.createElement('button');

        btn.className = `planet-btn ${p.isPersonal ? 'personal' : ''} ${ASPECT_STATE.natalPlanet === p.nameTH ? 'selected' : ''}`;

        btn.id = `aspect-npbtn-${p.id}`;

        const label = mapDisplayAbbr(p.abbr);

        btn.innerHTML = `

            <div class="planet-btn-icon"><img src="${p.imagePath}?v=110" class="planet-img-icon" alt="${p.nameEN}"></div>

            <div class="planet-btn-label">${label}</div>

        `;

        btn.addEventListener('click', () => {

            ASPECT_STATE.natalPlanet = p.nameTH;

            renderAspectNatalPlanetGrid();

            renderAspectTab();

        });

        grid.appendChild(btn);

    });

}



function renderAspectTab() {

    renderAspectTransitPlanetGrid();

    renderAspectTypesGrid();

    renderAspectNatalPlanetGrid();



    const container = DOM.aspectInterpretationResults;

    const searchList = DOM.aspectSearchResultsList;

    if (!container) return;



    const rawVal = DOM.searchInputAspect ? DOM.searchInputAspect.value : '';

    const query = sanitizeSearchQuery(rawVal).toLowerCase();

    if (DOM.searchClearAspect) {

        DOM.searchClearAspect.style.display = query ? 'block' : 'none';

    }



    if (query) {

        container.style.display = 'none';

        if (searchList) searchList.style.display = 'block';

        renderAspectSearchMatches(query);

        return;

    }



    container.style.display = 'block';

    if (searchList) searchList.style.display = 'none';



    // 1. General Pair Cookbook Meaning (Sue Tompkins)

    const pA = ASPECT_STATE.transitPlanet;

    const pB = ASPECT_STATE.natalPlanet;



    const cookbookRow = (typeof ASPECT_COOKBOOK_DB !== 'undefined' ? ASPECT_COOKBOOK_DB : []).find(cb => {

        const matchDirect = (cb.a_th.toLowerCase().includes(pA.toLowerCase()) || cb.a_en.toLowerCase() === pA.toLowerCase()) &&

                            (cb.b_th.toLowerCase().includes(pB.toLowerCase()) || cb.b_en.toLowerCase() === pB.toLowerCase());

        const matchReverse = (cb.a_th.toLowerCase().includes(pB.toLowerCase()) || cb.a_en.toLowerCase() === pB.toLowerCase()) &&

                             (cb.b_th.toLowerCase().includes(pA.toLowerCase()) || cb.b_en.toLowerCase() === pA.toLowerCase());

        return matchDirect || matchReverse;

    });



    let cookbookHTML = '';

    if (cookbookRow) {

        cookbookHTML = `

            <div class="card" style="margin-bottom: 16px; border-left: 4px solid var(--gold-primary); background: rgba(30,10,50,0.5); padding: 18px;">

                <div style="margin-bottom: 10px;">

                    <h3 style="font-size: 1.05rem; color: var(--gold-primary); margin: 0; font-weight: 700;">

                        ${escapeHtml(cookbookRow.a_th)} – ${escapeHtml(cookbookRow.b_th)} (${escapeHtml(cookbookRow.code)})

                    </h3>

                </div>

                ${cookbookRow.keywords ? `

                    <div style="font-size: 0.82rem; color: #D4C2EA; margin-bottom: 10px; background: rgba(139,50,212,0.12); padding: 8px 12px; border-radius: 6px; text-align: justify; line-height: 1.5;">

                        🔑 ${escapeHtml(cookbookRow.keywords)}

                    </div>

                ` : ''}

                <div style="font-size: 0.92rem; line-height: 1.65; color: var(--text-color); text-align: justify;">

                    ${escapeHtml(cookbookRow.desc_th)}

                </div>

            </div>

        `;

    }



    // 2. Specific Aspect Interpretation

    let specificHTML = '';

    if (!ASPECT_STATE.aspect) {

        specificHTML = `

            <div class="card" style="text-align: center; padding: 18px; color: var(--text-muted); font-size: 0.86rem; border: 1px dashed rgba(253, 201, 77, 0.2);">

                💡 คลิกเลือกมุมดาว (กุม / โยค / ฉาก / ตรีโกณ / เล็ง) ในคอลัมน์กลาง หากต้องการอ่านคำทำนายเฉพาะของมุม

            </div>

        `;

    } else {

        const item = (typeof ASPECT_DB !== 'undefined' ? ASPECT_DB : []).find(r => {

            const matchTransit = r.transit_th === ASPECT_STATE.transitPlanet || r.transit_en.toLowerCase() === ASPECT_STATE.transitPlanet.toLowerCase();

            const matchAspect = r.aspect_th === ASPECT_STATE.aspect || r.aspect_en.toLowerCase() === ASPECT_STATE.aspect.toLowerCase();

            const matchNatal = r.natal_th === ASPECT_STATE.natalPlanet ||

                               r.natal_en.toLowerCase() === ASPECT_STATE.natalPlanet.toLowerCase() ||

                               (ASPECT_STATE.natalPlanet === 'ลัคนา' && r.natal_th.includes('ลัคนา')) ||

                               (ASPECT_STATE.natalPlanet.includes('เมอริเดียน') && r.natal_th.includes('เมอริเดียน'));

            return matchTransit && matchAspect && matchNatal;

        });



        if (!item) {

            specificHTML = `

                <div class="card" style="text-align: center; padding: 30px; color: var(--text-muted);">

                    ไม่พบข้อมูลคำแปลเฉพาะของมุมดาว ${escapeHtml(ASPECT_STATE.transitPlanet)}จร ${escapeHtml(ASPECT_STATE.aspect)} (${getAspectDegree(ASPECT_STATE.aspect)}°) ${escapeHtml(ASPECT_STATE.natalPlanet)}กำเนิด

                </div>

            `;

        } else {

            specificHTML = `

                <div class="card" style="padding: 20px; border-left: 4px solid #7A2CB8;">

                    <div style="text-align: center; margin-bottom: 16px; border-bottom: 1px dashed rgba(253, 201, 77, 0.25); padding-bottom: 12px;">

                        <h3 class="interp-eq-title" style="font-size: 1.1rem; margin: 0; color: var(--gold-primary);">

                            📐 ${escapeHtml(formatAspectTitle(item))}

                        </h3>

                    </div>



                    <div style="font-size: 0.95rem; line-height: 1.65; color: var(--text-color);">

                        ${escapeHtml(item.meaning || 'ไม่มีข้อมูล')}

                    </div>

                </div>

            `;

        }

    }



    container.innerHTML = cookbookHTML + specificHTML;

}



function getPlanetAbbr(nameTH, nameEN) {

    if (!nameTH && !nameEN) return '';

    const th = (nameTH || '').toLowerCase();

    const en = (nameEN || '').toLowerCase();

    if (th.includes('อาทิตย์') || en.includes('sun')) return 'Su';

    if (th.includes('จันทร์') || en.includes('moon')) return 'Mo';

    if (th.includes('พุธ') || en.includes('mercury')) return 'Me';

    if (th.includes('ศุกร์') || en.includes('venus')) return 'Ve';

    if (th.includes('อังคาร') || en.includes('mars')) return 'Ma';

    if (th.includes('พฤหัส') || en.includes('jupiter')) return 'Ju';

    if (th.includes('เสาร์') || en.includes('saturn')) return 'Sa';

    if (th.includes('ยูเรนัส') || th.includes('มฤตยู') || en.includes('uranus')) return 'Ur';

    if (th.includes('เนปจูน') || en.includes('neptune')) return 'Ne';

    if (th.includes('พลูโต') || en.includes('pluto')) return 'Pl';

    if (th.includes('ลัคนา') || en.includes('ascendant')) return 'Asc';

    if (th.includes('เมอริเดียน') || th.includes('มิดเฮฟเว่น') || en.includes('midheaven') || en.includes('mc')) return 'MC';

    return nameEN ? nameEN.substring(0, 3) : nameTH;

}



function getAspectSymbol(aspectTh, degrees) {

    if (degrees === 0 || (aspectTh && aspectTh.includes('กุม'))) return '☌';

    if (degrees === 60 || (aspectTh && aspectTh.includes('โยค'))) return '⚹';

    if (degrees === 90 || (aspectTh && aspectTh.includes('ฉาก'))) return '□';

    if (degrees === 120 || (aspectTh && aspectTh.includes('ตรีโกณ'))) return '△';

    if (degrees === 180 || (aspectTh && aspectTh.includes('เล็ง'))) return '☍';

    return '';

}



function formatAspectTitle(item) {

    const tAbbr = getPlanetAbbr(item.transit_th, item.transit_en);

    const nAbbr = getPlanetAbbr(item.natal_th, item.natal_en);

    const symbol = getAspectSymbol(item.aspect_th, item.degrees);

    

    let natalCleanTH = item.natal_th || '';

    if (natalCleanTH.includes('/')) {

        natalCleanTH = natalCleanTH.split('/')[0];

    }



    return `${item.transit_th}${item.aspect_th}${natalCleanTH} (${tAbbr} ${symbol} ${nAbbr})`;

}



function getAspectDegree(aspectTh) {

    const a = ASPECT_TYPES.find(x => x.nameTH === aspectTh);

    return a ? a.degrees : 0;

}



function renderAspectSearchMatches(query) {

    const searchList = DOM.aspectSearchResultsList;

    if (!searchList) return;

    searchList.innerHTML = '';



    const aspectMatches = (typeof ASPECT_DB !== 'undefined' ? ASPECT_DB : []).filter(r => 

        (r.meaning && r.meaning.toLowerCase().includes(query)) ||

        (r.transit_th && r.transit_th.toLowerCase().includes(query)) ||

        (r.transit_en && r.transit_en.toLowerCase().includes(query)) ||

        (r.aspect_th && r.aspect_th.toLowerCase().includes(query)) ||

        (r.aspect_en && r.aspect_en.toLowerCase().includes(query)) ||

        (r.natal_th && r.natal_th.toLowerCase().includes(query)) ||

        (r.natal_en && r.natal_en.toLowerCase().includes(query))

    );



    const cookbookMatches = (typeof ASPECT_COOKBOOK_DB !== 'undefined' ? ASPECT_COOKBOOK_DB : []).filter(cb =>

        (cb.code && cb.code.toLowerCase().includes(query)) ||

        (cb.a_th && cb.a_th.toLowerCase().includes(query)) ||

        (cb.b_th && cb.b_th.toLowerCase().includes(query)) ||

        (cb.keywords && cb.keywords.toLowerCase().includes(query)) ||

        (cb.desc_th && cb.desc_th.toLowerCase().includes(query))

    );



    if (aspectMatches.length === 0 && cookbookMatches.length === 0) {

        searchList.innerHTML = `

            <div class="card" style="text-align: center; padding: 30px; color: var(--text-muted);">

                ไม่พบคำแปลมุมดาวจรที่ตรงกับคำสำคัญ "${escapeHtml(query)}"

            </div>

        `;

        return;

    }



    let html = `<div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">พบผลการค้นหามุมดาว ${aspectMatches.length + cookbookMatches.length} รายการ</div>`;



    cookbookMatches.forEach(cb => {

        html += `

            <div class="card" style="margin-bottom: 12px; cursor: pointer; border-left: 3.5px solid var(--gold-primary);" onclick="selectAspectPlanetPair('${cb.a_th}', '${cb.b_th}')">

                <div style="font-weight: 700; color: var(--gold-primary); font-size: 0.98rem;">

                    ${escapeHtml(cb.a_th)} – ${escapeHtml(cb.b_th)} (${escapeHtml(cb.code)})

                </div>

                ${cb.keywords ? `<div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">🔑 ${escapeHtml(cb.keywords)}</div>` : ''}

                <p style="font-size: 0.88rem; color: var(--text-color); margin-top: 6px; line-height: 1.5;">${escapeHtml(cb.desc_th)}</p>

            </div>

        `;

    });



    aspectMatches.forEach(r => {

        html += `

            <div class="card" style="margin-bottom: 12px; cursor: pointer; border-left: 3.5px solid #7A2CB8;">

                <div style="font-weight: 700; color: var(--gold-primary); font-size: 0.98rem;">

                    📐 ${escapeHtml(formatAspectTitle(r))}

                </div>

                <p style="font-size: 0.88rem; color: var(--text-color); margin-top: 6px; line-height: 1.5;">${escapeHtml(r.meaning)}</p>

            </div>

        `;

    });



    searchList.innerHTML = html;

}



function selectAspectPlanetPair(pA, pB) {

    ASPECT_STATE.transitPlanet = pA;

    ASPECT_STATE.natalPlanet = pB;

    if (DOM.searchInputAspect) DOM.searchInputAspect.value = '';

    if (DOM.searchClearAspect) DOM.searchClearAspect.style.display = 'none';

    renderAspectTab();

}



function selectAspectMatch(transitTh, aspectTh, natalTh) {

    ASPECT_STATE.transitPlanet = transitTh;

    ASPECT_STATE.aspect = aspectTh;

    ASPECT_STATE.natalPlanet = natalTh;

    if (DOM.searchInputAspect) {

        DOM.searchInputAspect.value = '';

        if (DOM.searchClearAspect) DOM.searchClearAspect.style.display = 'none';

    }

    renderAspectTab();

}



function clearAspectSelection() {
    ASPECT_STATE.transitPlanet = 'อาทิตย์';
    ASPECT_STATE.aspect = null;
    ASPECT_STATE.natalPlanet = 'อาทิตย์';

    if (DOM.searchInputAspect) {
        DOM.searchInputAspect.value = '';
        if (DOM.searchClearAspect) DOM.searchClearAspect.style.display = 'none';
    }

    renderAspectTab();
}


// 7.3 Lord of House Transits & Rulership Logic
const LORD_STATE = {
    planet: 'พฤหัส',
    hx: 1,
    signM: 'ธนู',
    hn: 1,
    signN: 'ธนู',
    searchQuery: ''
};

const NATURAL_HOUSE_RULERS = {
    1: { sign: 'เมษ (Aries)', ruler: 'อังคาร' },
    2: { sign: 'พฤษภ (Taurus)', ruler: 'ศุกร์' },
    3: { sign: 'มิถุน (Gemini)', ruler: 'พุธ' },
    4: { sign: 'กรกฎ (Cancer)', ruler: 'จันทร์' },
    5: { sign: 'สิงห์ (Leo)', ruler: 'อาทิตย์' },
    6: { sign: 'กันย์ (Virgo)', ruler: 'พุธ' },
    7: { sign: 'ตุลย์ (Libra)', ruler: 'ศุกร์' },
    8: { sign: 'พิจิก (Scorpio)', ruler: 'อังคาร / พลูโต' },
    9: { sign: 'ธนู (Sagittarius)', ruler: 'พฤหัส' },
    10: { sign: 'มกร (Capricorn)', ruler: 'เสาร์' },
    11: { sign: 'กุมภ์ (Aquarius)', ruler: 'เสาร์ / ยูเรนัส' },
    12: { sign: 'มีน (Pisces)', ruler: 'พฤหัส / เนปจูน' }
};

const HOUSE_TITLES_SHORT = {
    1: 'ตัวตน/ร่างกาย',
    2: 'การเงิน/จิตใจ',
    3: 'การสื่อสาร/พี่น้อง',
    4: 'บ้าน/ครอบครัว',
    5: 'ความรัก/บุตร',
    6: 'งาน/สุขภาพ',
    7: 'คู่ครอง/หุ้นส่วน',
    8: 'การเปลี่ยนแปลง',
    9: 'การเรียน/เดินทาง',
    10: 'อาชีพ/สถานะ',
    11: 'เพื่อน/สังคม',
    12: 'จิตสัมผัส/สิ่งที่ซ่อน'
};

const SIGN_FLAVORS = {
    'เมษ': 'สไตล์รวดเร็ว กล้าหาญ และเป็นผู้ริเริ่ม (ธาตุไฟ)',
    'พฤษภ': 'สไตล์มั่นคง อดทน ประณีต และเป็นรูปธรรม (ธาตุดิน)',
    'มิถุน': 'ผ่านการสื่อสาร แลกเปลี่ยนความคิด และความยืดหยุ่น (ธาตุลม)',
    'กรกฎ': 'ด้วยความใส่ใจ ละเอียดอ่อน ผูกพัน และใช้อารมณ์สัญชาตญาณ (ธาตุน้ำ)',
    'สิงห์': 'อย่างโดดเด่น มีศักดิ์ศรี มั่นใจ และสร้างสรรค์ (ธาตุไฟ)',
    'กันย์': 'อย่างมีระบบ ละเอียด รอบคอบ และใส่ใจในรายละเอียด (ธาตุดิน)',
    'ตุลย์': 'ด้วยความละมุนละม่อม ประสานประโยชน์ และสร้างความสมดุล (ธาตุลม)',
    'พิจิก': 'ด้วยความลึกซึ้ง มุ่งมั่น ทุ่มเท และลุ่มลึก (ธาตุน้ำ)',
    'ธนู': 'ด้วยความกว้างไกล มองการณ์ไกล แสวงหาปัญญา และเปิดกว้าง (ธาตุไฟ)',
    'มกร': 'อย่างจริงจัง มีระเบียบแบบแผน และมุ่งหวังความสำเร็จระยะยาว (ธาตุดิน)',
    'กุมภ์': 'ด้วยความคิดแปลกใหม่ เป็นอิสระ และมองภาพรวมเพื่ออนาคต (ธาตุลม)',
    'มีน': 'ด้วยความละเอียดอ่อน เมตตา เห็นอกเห็นใจ และใช้จินตนาการ (ธาตุน้ำ)'
};

function populateLordHouseDropdowns() {
    if (!DOM.lordSelectHx) return;
    if (DOM.lordSelectHx.children.length > 0) return;

    let html = '';
    for (let h = 1; h <= 12; h++) {
        html += `<option value="${h}">${h}</option>`;
    }
    DOM.lordSelectHx.innerHTML = html;
    DOM.lordSelectHn.innerHTML = html;

    if (DOM.lordSelectPlanet) DOM.lordSelectPlanet.value = LORD_STATE.planet;
    if (DOM.lordSelectHx) DOM.lordSelectHx.value = LORD_STATE.hx;
    if (DOM.lordSelectSignM) DOM.lordSelectSignM.value = LORD_STATE.signM;
    if (DOM.lordSelectHn) DOM.lordSelectHn.value = LORD_STATE.hn;
    if (DOM.lordSelectSignN) DOM.lordSelectSignN.value = LORD_STATE.signN;
}

function renderLordTab() {
    populateLordHouseDropdowns();
    renderLordInterpretation();
}

function selectLordHouseCombo(hx, hn) {
    LORD_STATE.hx = hx;
    LORD_STATE.hn = hn;
    if (DOM.lordSelectHx) DOM.lordSelectHx.value = hx;
    if (DOM.lordSelectHn) DOM.lordSelectHn.value = hn;
    LORD_STATE.searchQuery = '';
    if (DOM.searchInputLord) DOM.searchInputLord.value = '';
    if (DOM.searchClearLord) DOM.searchClearLord.style.display = 'none';
    renderLordInterpretation();
}

function getRulershipBadges(planet, signM, signN, hx) {
    const badges = [];
    const db = typeof RULERSHIP_DB !== 'undefined' ? RULERSHIP_DB : [];
    const normPlanet = planet.replace('บดี', '');

    // Check Natal Sign M
    const signMItem = db.find(x => x.sign_th === signM);
    if (signMItem) {
        const tradMatch = signMItem.trad_th && signMItem.trad_th.includes(normPlanet);
        const modMatch = signMItem.mod_th && signMItem.mod_th.includes(normPlanet);
        if (tradMatch || modMatch) {
            badges.push({ text: `👑 เกษตรเดิม: ดาว${planet} ครองราศี${signM}`, type: 'highlight' });
        }
    }

    // Check Transit Sign N
    const signNItem = db.find(x => x.sign_th === signN);
    if (signNItem) {
        const tradMatch = signNItem.trad_th && signNItem.trad_th.includes(normPlanet);
        const modMatch = signNItem.mod_th && signNItem.mod_th.includes(normPlanet);
        if (tradMatch || modMatch) {
            badges.push({ text: `🪐 เกษตรจร: ดาว${planet} ครองราศี${signN}`, type: 'highlight' });
        }
    }

    // Natural House Ruler
    const natRuler = NATURAL_HOUSE_RULERS[hx];
    if (natRuler && natRuler.ruler.includes(normPlanet)) {
        badges.push({ text: `🏠 ดาวประจำเรือนธรรมชาติ H${hx}`, type: 'standard' });
    }

    return badges;
}

function renderLordInterpretation() {
    if (!DOM.lordInterpretationResults) return;

    const query = sanitizeSearchQuery(LORD_STATE.searchQuery);
    
    if (query) {
        // Render search results across combination DB & transit DB
        if (DOM.lordSearchResultsList) DOM.lordSearchResultsList.style.display = 'block';
        DOM.lordInterpretationResults.style.display = 'none';

        const combDb = typeof HOUSE_RULER_COMB_DB !== 'undefined' ? HOUSE_RULER_COMB_DB : [];
        const matches = combDb.filter(item => {
            const synth = item.synth_th || '';
            const ax = item.area_x || '';
            const an = item.area_n || '';
            return synth.includes(query) || ax.includes(query) || an.includes(query);
        });

        if (matches.length === 0) {
            DOM.lordSearchResultsList.innerHTML = `<div class="search-meta" style="padding: 15px; color: #FDC94D;">ไม่พบข้อมูลดาวเจ้าเรือนตรงกับคำว่า "${escapeHtml(query)}"</div>`;
        } else {
            let listHtml = `<div class="search-meta" style="padding: 10px 0; color: #FDC94D;">พบ ${matches.length} รายการสำหรับ "${escapeHtml(query)}"</div>`;
            matches.forEach(item => {
                let cleanItemSynth = item.synth_th || '';
                if (cleanItemSynth.includes(' — ')) {
                    cleanItemSynth = cleanItemSynth.split(' — ')[1].trim();
                }
                listHtml += `
                    <div class="search-result-item" style="cursor: pointer; margin-bottom: 10px; background: rgba(30, 8, 50, 0.7); border: 1px solid rgba(253, 201, 77, 0.3); padding: 12px; border-radius: var(--border-radius-md);" onclick="selectLordHouseCombo(${item.hx}, ${item.hn})">
                        <div style="font-weight: 700; color: #FDC94D; margin-bottom: 4px;">👑 เจ้าเรือนที่ ${item.hx} ➔ เรือนที่ ${item.hn}</div>
                        <div style="font-size: 0.9rem; color: #FDF4DC;">${escapeHtml(cleanItemSynth)}</div>
                    </div>
                `;
            });
            DOM.lordSearchResultsList.innerHTML = listHtml;
        }
        return;
    }

    // Normal mode: display sentence header + interpretation card
    if (DOM.lordSearchResultsList) DOM.lordSearchResultsList.style.display = 'none';
    DOM.lordInterpretationResults.style.display = 'block';

    const planet = LORD_STATE.planet;
    const hx = LORD_STATE.hx;
    const signM = LORD_STATE.signM;
    const hn = LORD_STATE.hn;
    const signN = LORD_STATE.signN;
    const normPlanet = planet.replace('บดี', '');

    // ตัวแปรของดาว (แก่นดาว — ใช้ในบรรทัดสรุปตัวแปรเท่านั้น)
    const pkpDb = typeof PLANET_KEY_PRINCIPLE_DB !== 'undefined' ? PLANET_KEY_PRINCIPLE_DB : [];
    const pkpItem = pkpDb.find(x => x.planet_th === planet || x.planet_th === normPlanet) || {};
    const planetNature = pkpItem.nature_th || 'ชีวิต พลังขับเคลื่อน และแก่นธรรมชาติ';

    // ตัวแปรของคู่เรือน X→N (เจ้าเรือนถูกจร) — synth_th คือบรรทัดสรุปเดียว, bullets คือมุมตีความย่อย
    const combDb = typeof HOUSE_RULER_COMB_DB !== 'undefined' ? HOUSE_RULER_COMB_DB : [];
    const combItem = combDb.find(x => x.hx === hx && x.hn === hn) || {
        hx: hx,
        hn: hn,
        area_x: HOUSE_TITLES_SHORT[hx] || '',
        area_n: HOUSE_TITLES_SHORT[hn] || '',
        synth_th: `เจ้าเรือนที่ ${hx} เคลื่อนเข้าเรือนที่ ${hn} — ส่งผลต่อบริบทของเรือนที่ ${hn} อย่างชัดเจน`,
        bullets: []
    };
    const areaX = combItem.area_x || HOUSE_TITLES_SHORT[hx] || '';
    const areaN = combItem.area_n || HOUSE_TITLES_SHORT[hn] || '';

    const signMFlavor = SIGN_FLAVORS[signM] || 'บรรยากาศตามราศีสถิตเดิม';
    const signNFlavor = SIGN_FLAVORS[signN] || 'บรรยากาศตามราศีจร';

    // สรุปตัวแปร: bullet กระชับทีละตัวแปร — ไม่ใส่ label นำหน้า (ดาว/เรือนเดิม/ฯลฯ)
    // เพราะซ้ำกับ lord-sentence-banner ด้านบนอยู่แล้ว อาศัยลำดับ (เรือนเดิม+ราศีเดิม มาก่อน เรือนจร+ราศีจร ตามหลัง) แทน
    // หมายเหตุ: SIGN_FLAVORS มีวงเล็บ (ธาตุ) ติดมาในตัวเองแล้ว — เป็นวงเล็บเดียวที่จำเป็น จึงไม่ครอบซ้อนวงเล็บอื่นเพิ่ม
    const variableBullets = [
        `${planet} — ${planetNature}`,
        `เรือนที่ ${hx} — ${areaX}`,
        `${signM} — ${signMFlavor}`,
        `เรือนที่ ${hn} — ${areaN}`,
        `${signN} — ${signNFlavor}`,
    ];
    const variableBulletsHtml = variableBullets.map(b => `<li style="line-height: 1.6; font-size: 0.92rem; margin-bottom: 6px;">${escapeHtml(b)}</li>`).join('');

    // ความหมายของการจร: มุมตีความย่อยทั้งหมดเป็น bullet ล้วน (จาก HOUSE_RULER_COMB_DB.bullets) ไม่มีย่อหน้าแทรก
    const extraBullets = Array.isArray(combItem.bullets) ? combItem.bullets : [];
    const bulletsHtml = extraBullets.map(b => `<li style="line-height: 1.75; font-size: 0.95rem; margin-bottom: 10px;">${escapeHtml(b)}</li>`).join('');

    DOM.lordInterpretationResults.innerHTML = `
        <div class="lord-sentence-banner">
            ดาว <span class="hl-planet">${escapeHtml(planet)}</span> เจ้าเรือนที่ <span class="hl-house">${hx}</span> ราศี <span class="hl-sign">${escapeHtml(signM)}</span> จร เรือนที่ <span class="hl-house">${hn}</span> ราศี <span class="hl-sign">${escapeHtml(signN)}</span>
        </div>

        <div class="lord-card" style="margin-top: 0;">
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
        </div>
    `;
}

function clearLordSelection() {
    LORD_STATE.planet = 'พฤหัส';
    LORD_STATE.hx = 1;
    LORD_STATE.signM = 'ธนู';
    LORD_STATE.hn = 1;
    LORD_STATE.signN = 'ธนู';
    LORD_STATE.searchQuery = '';

    if (DOM.lordSelectPlanet) DOM.lordSelectPlanet.value = 'พฤหัส';
    if (DOM.lordSelectHx) DOM.lordSelectHx.value = 1;
    if (DOM.lordSelectSignM) DOM.lordSelectSignM.value = 'ธนู';
    if (DOM.lordSelectHn) DOM.lordSelectHn.value = 1;
    if (DOM.lordSelectSignN) DOM.lordSelectSignN.value = 'ธนู';
    if (DOM.searchInputLord) DOM.searchInputLord.value = '';
    if (DOM.searchClearLord) DOM.searchClearLord.style.display = 'none';

    renderLordTab();
}





// Consolidated Results Visibility toggler

function updateUranianResultsVisibility() {

    const keyVal = (DOM.searchInputKey && DOM.searchInputKey.value) ? DOM.searchInputKey.value.trim() : '';

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

    const keyVal = (DOM.searchInputKey && DOM.searchInputKey.value) ? DOM.searchInputKey.value.trim().toLowerCase() : '';

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

                    เรือนที่ ${HOUSE_STATE.house} ของเรือนชะตา${houseSystemSafe}

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

                        ${pNameSafe} (${pAbbrSafe}) ในเรือนที่ ${HOUSE_STATE.house} ของเรือนชะตา${houseSystemSafe}

                    </h3>

                    <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-color);">${escapeHtml(rowForPlanet.meaning)}</p>

                    ${rowForPlanet.extra ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 10px; border-top: 1px dashed rgba(109,82,134,0.15); padding-top: 10px;">*ข้อพิจารณาเพิ่มเติม: ${escapeHtml(rowForPlanet.extra)}</p>` : ''}

                </div>

            `;

        } else {

            resultCard.innerHTML = `

                <div class="card" style="text-align: center; padding: 30px; color: var(--text-muted);">

                    ไม่มีข้อมูลคำทำนายเฉพาะของ ${pNameSafe} (${pAbbrSafe}) ในเรือนที่ ${HOUSE_STATE.house} ของเรือนชะตา${houseSystemSafe}

                </div>

            `;

        }

    }

}



function handleHouseSearchInput() {

    const query = (DOM.searchInputHouse && DOM.searchInputHouse.value) ? DOM.searchInputHouse.value.trim().toLowerCase() : '';

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

        const label = row.factor_th ? `${escapeHtml(row.factor_th)}` : 'ความหมายทั่วไป';



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



// ==========================================

// 8. Sign Tab Logic & Rendering (House-style Tone & Planet-Sign DB)

// ==========================================

const SIGN_PLANETS_LIST = [

    { id: 'Sun',        abbr: 'Su', nameEN: 'Sun',        nameTH: 'อาทิตย์',   imagePath: 'img/Su.png' },

    { id: 'Moon',       abbr: 'Mo', nameEN: 'Moon',       nameTH: 'จันทร์',    imagePath: 'img/Mo.png' },

    { id: 'Mercury',    abbr: 'Me', nameEN: 'Mercury',    nameTH: 'พุธ',       imagePath: 'img/Me.png' },

    { id: 'Venus',      abbr: 'Ve', nameEN: 'Venus',      nameTH: 'ศุกร์',     imagePath: 'img/Ve.png' },

    { id: 'Mars',       abbr: 'Ma', nameEN: 'Mars',       nameTH: 'อังคาร',   imagePath: 'img/Ma.png' },

    { id: 'Jupiter',    abbr: 'Ju', nameEN: 'Jupiter',    nameTH: 'พฤหัส',    imagePath: 'img/Ju.png' },

    { id: 'Saturn',     abbr: 'Sa', nameEN: 'Saturn',     nameTH: 'เสาร์',     imagePath: 'img/Sa.png' },

    { id: 'Uranus',     abbr: 'Ur', nameEN: 'Uranus',     nameTH: 'ยูเรนัส',  imagePath: 'img/Ur.png' },

    { id: 'Neptune',    abbr: 'Ne', nameEN: 'Neptune',    nameTH: 'เนปจูน',   imagePath: 'img/Ne.png' },

    { id: 'Pluto',      abbr: 'Pl', nameEN: 'Pluto',      nameTH: 'พลูโต',    imagePath: 'img/Pl.png' },

    { id: 'Meridian',   abbr: 'M',  nameEN: 'Meridian',   nameTH: 'เมอริเดียน', imagePath: 'img/M.png' },

    { id: 'North Node', abbr: 'No', nameEN: 'North Node', nameTH: 'ราหู',      imagePath: 'img/No.png' },

    { id: 'Ascendant',  abbr: 'As', nameEN: 'Ascendant',  nameTH: 'ลัคนา',    imagePath: 'img/As.png' }

];



const SIGN_ZODIAC_LIST = [

    { en: 'Aries',       th: 'เมษ',   num: 1 },

    { en: 'Taurus',      th: 'พฤษภ',  num: 2 },

    { en: 'Gemini',      th: 'มิถุน', num: 3 },

    { en: 'Cancer',      th: 'กรกฎ',  num: 4 },

    { en: 'Leo',         th: 'สิงห์', num: 5 },

    { en: 'Virgo',       th: 'กันย์', num: 6 },

    { en: 'Libra',       th: 'ตุลย์', num: 7 },

    { en: 'Scorpio',     th: 'พิจิก', num: 8 },

    { en: 'Sagittarius', th: 'ธนู',   num: 9 },

    { en: 'Capricorn',   th: 'มกร',   num: 10 },

    { en: 'Aquarius',    th: 'กุมภ์', num: 11 },

    { en: 'Pisces',      th: 'มีน',   num: 12 }

];



function initSignTab() {

    renderSignPlanetsGrid();

    renderSignTab();

}



function clearSignSelection() {

    SIGN_STATE.selectedPlanet = '';

    SIGN_STATE.selectedSign = 'Aries';

    SIGN_STATE.keyword = '';

    if (DOM.searchInputSign) DOM.searchInputSign.value = '';

    if (DOM.searchClearSign) DOM.searchClearSign.style.display = 'none';



    renderSignPlanetsGrid();

    renderSignTab();

}



function selectSignPlanet(planetId) {

    if (SIGN_STATE.selectedPlanet === planetId) {

        // Toggle off if already selected

        SIGN_STATE.selectedPlanet = '';

    } else {

        SIGN_STATE.selectedPlanet = planetId;

    }

    renderSignPlanetsGrid();

    renderSignTab();

}



function handleSignZodiacSelect(value) {

    SIGN_STATE.selectedSign = value;

    renderSignPlanetsGrid();

    renderSignTab();

}



function renderSignPlanetsGrid() {

    if (!DOM.signPlanetsGrid) return;

    DOM.signPlanetsGrid.innerHTML = '';



    const row1Planets = SIGN_PLANETS_LIST.slice(0, 5);

    const row2Planets = SIGN_PLANETS_LIST.slice(5, 10);

    const row3Planets = SIGN_PLANETS_LIST.slice(10);



    const createBtn = (p) => {

        const btn = document.createElement('button');

        const isSel = SIGN_STATE.selectedPlanet === p.id;

        btn.className = `planet-btn ${isSel ? 'selected' : ''}`;

        btn.innerHTML = `

            <div class="planet-btn-icon"><img src="${p.imagePath}?v=110" class="planet-img-icon" alt="${escapeHtml(p.nameEN)}"></div>

            <div class="planet-btn-label">${escapeHtml(p.abbr)}</div>

        `;

        btn.addEventListener('click', () => {

            selectSignPlanet(p.id);

        });

        return btn;

    };



    // Row 1: 5 Planets

    row1Planets.forEach(p => DOM.signPlanetsGrid.appendChild(createBtn(p)));



    // Slot 6: Dropdown

    const isSignActive = !!SIGN_STATE.selectedSign;

    const card = document.createElement('div');

    card.className = `transit-house-select-card ${isSignActive ? 'selected' : ''}`;

    card.innerHTML = `

        <label class="transit-house-card-label">ราศี</label>

        <select class="transit-house-dropdown-select" id="sign-zodiac-select">

            <option value="" ${!SIGN_STATE.selectedSign ? 'selected' : ''}>ทั้งหมด</option>

            ${SIGN_ZODIAC_LIST.map(s => `

                <option value="${s.en}" ${SIGN_STATE.selectedSign.toLowerCase() === s.en.toLowerCase() ? 'selected' : ''}>

                    ${escapeHtml(s.th)}

                </option>

            `).join('')}

        </select>

    `;

    DOM.signPlanetsGrid.appendChild(card);



    const selectElem = card.querySelector('#sign-zodiac-select');

    if (selectElem) {

        selectElem.addEventListener('change', (e) => {

            handleSignZodiacSelect(e.target.value);

        });

    }



    // Row 2: 5 Planets

    row2Planets.forEach(p => DOM.signPlanetsGrid.appendChild(createBtn(p)));



    // Row 2 Slot 6: Empty spacer

    const spacer = document.createElement('div');

    spacer.style.visibility = 'hidden';

    DOM.signPlanetsGrid.appendChild(spacer);



    // Row 3: Remaining Planets

    row3Planets.forEach(p => DOM.signPlanetsGrid.appendChild(createBtn(p)));

}



function renderSignTab() {

    if (SIGN_STATE.keyword) {

        renderSignSearchResults();

        return;

    }



    if (DOM.signSearchResultsList) DOM.signSearchResultsList.style.display = 'none';

    if (DOM.signInterpretationResults) DOM.signInterpretationResults.style.display = 'block';



    renderSignInterpretationResults();

}



function renderSignInterpretationResults() {

    if (!DOM.signInterpretationResults || typeof PLANET_SIGN_DB === 'undefined') return;



    // Filter: if planet selected → show all 12 signs for that planet

    //         if sign selected → show all 13 planets for that sign

    //         if both → show 1 result

    //         if neither → show all 156 results

    let rows = PLANET_SIGN_DB.filter(item => {

        if (item.planet_en && item.planet_en.toLowerCase() === 'south node') return false;

        if (item.planet_th === 'เกตุ') return false;

        const matchPlanet = !SIGN_STATE.selectedPlanet || item.planet_en.toLowerCase() === SIGN_STATE.selectedPlanet.toLowerCase();

        const matchSign = !SIGN_STATE.selectedSign || item.sign_en.toLowerCase() === SIGN_STATE.selectedSign.toLowerCase();

        return matchPlanet && matchSign;

    });



    if (rows.length === 0) {

        DOM.signInterpretationResults.innerHTML = `<div class="card" style="text-align: center; padding: 40px; color: var(--text-muted);">ไม่พบข้อมูลดาวสถิตราศีที่ตรงกับการเลือก</div>`;

        return;

    }



    // Header summary label

    let mainTitle = '';

    let subTitle = '';



    if (SIGN_STATE.selectedPlanet && SIGN_STATE.selectedSign) {

        const pObj = SIGN_PLANETS_LIST.find(p => p.id === SIGN_STATE.selectedPlanet);

        const sObj = SIGN_ZODIAC_LIST.find(s => s.en.toLowerCase() === SIGN_STATE.selectedSign.toLowerCase());

        mainTitle = `${pObj ? pObj.nameTH : SIGN_STATE.selectedPlanet}ใน${sObj ? sObj.th : SIGN_STATE.selectedSign}`;

    } else if (SIGN_STATE.selectedPlanet) {

        const pObj = SIGN_PLANETS_LIST.find(p => p.id === SIGN_STATE.selectedPlanet);

        mainTitle = `${pObj ? pObj.nameTH : SIGN_STATE.selectedPlanet}`;

        subTitle = ` — แสดงทั้ง 12 ราศี (${rows.length} รายการ)`;

    } else if (SIGN_STATE.selectedSign) {

        const sObj = SIGN_ZODIAC_LIST.find(s => s.en.toLowerCase() === SIGN_STATE.selectedSign.toLowerCase());

        mainTitle = `${sObj ? sObj.th : SIGN_STATE.selectedSign}`;

        subTitle = ` — ดาวทั้ง ${SIGN_PLANETS_LIST.length} ดวง (${rows.length} รายการ)`;

    } else {

        mainTitle = `คำทำนายดาวสถิตราศีทั้งหมด`;

        subTitle = ` (${rows.length} รายการ)`;

    }



    let html = `

        <div style="margin-bottom: 14px; font-size: 1.02rem;">

            <span style="font-weight: 700; color: var(--gold-primary);">${escapeHtml(mainTitle)}</span>

            ${subTitle ? `<span style="color: var(--text-muted); font-size: 0.85rem; font-weight: normal;">${escapeHtml(subTitle)}</span>` : ''}

        </div>

        <div style="display: grid; gap: 14px;">

    `;



    rows.forEach(r => {

        let rawMeaning = r.meaning_th || '';

        let escapedMeaning = escapeHtml(rawMeaning);

        // Format newlines and highlight Caution section

        let formattedMeaning = escapedMeaning

            .replace(/\n\n/g, '<br><br>')

            .replace(/(ข้อควรระวัง\s*:)/g, '<strong style="color: #FF7675;">$1</strong>');



        html += `

            <div class="card" style="border-left: 4px solid #FDC94D; padding: 16px;">

                <div style="margin-bottom: 10px;">

                    <h3 style="font-size: 1.05rem; color: var(--gold-primary); margin: 0;">

                        ${escapeHtml(r.planet_th)}ใน${escapeHtml(r.sign_th)}

                    </h3>

                </div>



                <div style="background: rgba(30,10,50,0.6); padding: 12px 14px; border-radius: 8px; border: 1px solid rgba(122,44,184,0.3);">

                    <p style="font-size: 0.9rem; line-height: 1.65; color: var(--text-color); margin: 0; text-align: justify;">${formattedMeaning}</p>

                </div>

            </div>

        `;

    });



    html += `</div>`;

    DOM.signInterpretationResults.innerHTML = html;



}





function handleSignSearchInput() {

    if (!DOM.searchInputSign) return;

    const query = (DOM.searchInputSign && DOM.searchInputSign.value) ? sanitizeSearchQuery(DOM.searchInputSign.value.trim().toLowerCase()) : '';

    SIGN_STATE.keyword = query;

    if (DOM.searchClearSign) DOM.searchClearSign.style.display = query ? 'block' : 'none';



    if (!query) {

        if (DOM.signSearchResultsList) DOM.signSearchResultsList.style.display = 'none';

        if (DOM.signInterpretationResults) DOM.signInterpretationResults.style.display = 'block';

        renderSignTab();

        return;

    }



    renderSignSearchResults();

}



function renderSignSearchResults() {

    const query = SIGN_STATE.keyword;

    if (!query || typeof PLANET_SIGN_DB === 'undefined') return;



    if (DOM.signInterpretationResults) DOM.signInterpretationResults.style.display = 'none';

    if (!DOM.signSearchResultsList) return;



    const matches = PLANET_SIGN_DB.filter(r => {

        if (r.planet_en && r.planet_en.toLowerCase() === 'south node') return false;

        if (r.planet_th === 'เกตุ') return false;

        return (

            r.planet_th.toLowerCase().includes(query) ||

            r.planet_en.toLowerCase().includes(query) ||

            r.sign_th.toLowerCase().includes(query) ||

            r.sign_en.toLowerCase().includes(query) ||

            r.meaning_th.toLowerCase().includes(query) ||

            r.hand_kw.toLowerCase().includes(query) ||

            r.forrest_kw.toLowerCase().includes(query) ||

            r.dignity.toLowerCase().includes(query)

        );

    });



    DOM.signSearchResultsList.style.display = 'block';

    if (matches.length === 0) {

        DOM.signSearchResultsList.innerHTML = `

            <div class="card" style="text-align: center; padding: 40px; color: var(--text-muted);">

                ไม่พบข้อมูลคำทำนายดาวสถิตราศีที่ตรงกับคำสำคัญ "${escapeHtml(query)}"

            </div>

        `;

        return;

    }



    let html = `<div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">พบผลการค้นหาตามคีย์เวิร์ด ${matches.length} รายการ</div>`;

    matches.forEach(r => {

        html += `

            <div class="card" style="margin-bottom: 12px; cursor: pointer; border-left: 3.5px solid #FDC94D;" onclick="selectSignPlanetZodiacPair('${r.planet_en}', '${r.sign_en}')">

                <div style="display: flex; justify-content: space-between; align-items: center;">

                    <div style="font-weight: 700; color: #FDC94D; font-size: 1rem;">

                        ${escapeHtml(r.planet_th)}ใน${escapeHtml(r.sign_th)} (${escapeHtml(r.planet_en)} in ${escapeHtml(r.sign_en)})

                    </div>

                    ${r.dignity ? `<span style="font-size: 0.72rem; color: #50DC96;">${escapeHtml(r.dignity)}</span>` : ''}

                </div>

                <p style="font-size: 0.88rem; color: var(--text-color); margin-top: 6px; line-height: 1.5;">${escapeHtml(r.meaning_th)}</p>

            </div>

        `;

    });

    DOM.signSearchResultsList.innerHTML = html;

}



function selectSignPlanetZodiacPair(planetEn, signEn) {

    SIGN_STATE.selectedPlanet = planetEn;

    SIGN_STATE.planetSignZodiac = signEn;

    SIGN_STATE.keyword = '';

    if (DOM.searchInputSign) DOM.searchInputSign.value = '';

    if (DOM.searchClearSign) DOM.searchClearSign.style.display = 'none';



    const s = ZODIAC_SIGN_DB.find(item => item.nameEN.toLowerCase() === signEn.toLowerCase());

    if (s) SIGN_STATE.selectedSign = s.id;



    renderSignPlanetsGrid();

    renderSignPlanetZodiacGrid();

    renderSignTab();

}



// ==========================================

// 9. Combination Tab Logic & Rendering

// ==========================================

function initCombinationTab() {

    populateCombDropdowns();

    renderCombinationTab();

}



function switchCombSubtab(subtab) {

    COMBINATION_STATE.subtab = subtab;

    if (DOM.subtabCombPair) DOM.subtabCombPair.classList.toggle('active', subtab === 'pair');

    if (DOM.subtabCombEq) DOM.subtabCombEq.classList.toggle('active', subtab === 'eq');



    if (DOM.subviewCombPair) DOM.subviewCombPair.style.display = subtab === 'pair' ? 'block' : 'none';

    if (DOM.subviewCombEq) DOM.subviewCombEq.style.display = subtab === 'eq' ? 'block' : 'none';



    if (subtab === 'pair') {

        renderCombinationTab();

    } else if (subtab === 'eq') {

        if (DOM.searchInputKey) DOM.searchInputKey.focus();

        updateUranianResultsVisibility();

    }

}



const COMB_FACTORS = [

    { id: 'Su', abbr: 'Su', nameTH: 'อาทิตย์', nameEN: 'Sun' },

    { id: 'Mo', abbr: 'Mo', nameTH: 'จันทร์', nameEN: 'Moon' },

    { id: 'Me', abbr: 'Me', nameTH: 'พุธ', nameEN: 'Mercury' },

    { id: 'Ve', abbr: 'Ve', nameTH: 'ศุกร์', nameEN: 'Venus' },

    { id: 'Ma', abbr: 'Ma', nameTH: 'อังคาร', nameEN: 'Mars' },

    { id: 'Ju', abbr: 'Ju', nameTH: 'พฤหัส', nameEN: 'Jupiter' },

    { id: 'Sa', abbr: 'Sa', nameTH: 'เสาร์', nameEN: 'Saturn' },

    { id: 'Ur', abbr: 'Ur', nameTH: 'มฤตยู', nameEN: 'Uranus' },

    { id: 'Ne', abbr: 'Ne', nameTH: 'เนปจูน', nameEN: 'Neptune' },

    { id: 'Pl', abbr: 'Pl', nameTH: 'พลูโต', nameEN: 'Pluto' },

    { id: 'NO', abbr: 'NO', nameTH: 'โหนดจันทร์ (ราหู)', nameEN: 'Node' },

    { id: 'AS', abbr: 'AS', nameTH: 'ลัคนา', nameEN: 'Ascendant' },

    { id: 'MC', abbr: 'MC', nameTH: 'เมอริเดียน (MC)', nameEN: 'Midheaven' }

];



function populateCombDropdowns() {

    if (!DOM.selectCombPlanetA || !DOM.selectCombPlanetB) return;



    let optsA = '';

    let optsB = '';

    COMB_FACTORS.forEach(f => {

        optsA += `<option value="${f.id}" ${COMBINATION_STATE.planetA === f.id ? 'selected' : ''}>${f.nameTH} (${f.abbr})</option>`;

        optsB += `<option value="${f.id}" ${COMBINATION_STATE.planetB === f.id ? 'selected' : ''}>${f.nameTH} (${f.abbr})</option>`;

    });



    DOM.selectCombPlanetA.innerHTML = optsA;

    DOM.selectCombPlanetB.innerHTML = optsB;

}



function handleCombPlanetChange() {

    if (!DOM.selectCombPlanetA || !DOM.selectCombPlanetB) return;

    COMBINATION_STATE.planetA = DOM.selectCombPlanetA.value;

    COMBINATION_STATE.planetB = DOM.selectCombPlanetB.value;

    renderCombinationTab();

}



function clearCombSelection() {

    COMBINATION_STATE.planetA = 'Su';

    COMBINATION_STATE.planetB = 'Mo';

    COMBINATION_STATE.keyword = '';

    if (DOM.searchInputComb) DOM.searchInputComb.value = '';

    if (DOM.searchClearComb) DOM.searchClearComb.style.display = 'none';

    populateCombDropdowns();

    renderCombinationTab();

}



function handleCombSearchInput() {

    if (!DOM.searchInputComb) return;

    const query = (DOM.searchInputComb && DOM.searchInputComb.value) ? sanitizeSearchQuery(DOM.searchInputComb.value.trim().toLowerCase()) : '';

    COMBINATION_STATE.keyword = query;

    if (DOM.searchClearComb) DOM.searchClearComb.style.display = query ? 'block' : 'none';



    if (!query) {

        if (DOM.combSearchResultsList) DOM.combSearchResultsList.style.display = 'none';

        if (DOM.combInterpretationResults) DOM.combInterpretationResults.style.display = 'block';

        renderCombinationTab();

        return;

    }



    renderCombSearchResults();

}



function renderCombinationTab() {

    if (!DOM.combInterpretationResults || typeof COMBINATION_DB === 'undefined') return;



    if (COMBINATION_STATE.keyword) {

        renderCombSearchResults();

        return;

    }



    if (DOM.combSearchResultsList) DOM.combSearchResultsList.style.display = 'none';

    DOM.combInterpretationResults.style.display = 'block';



    const pA = COMBINATION_STATE.planetA;

    const pB = COMBINATION_STATE.planetB;



    if (pA === pB) {

        DOM.combInterpretationResults.innerHTML = `

            <div class="card" style="text-align: center; padding: 30px; color: var(--text-muted);">

                โปรดเลือกดาวกุมคู่ 2 ดวงที่แตกต่างกันเพื่ออ่านความหมายดาวคู่ผสม

            </div>

        `;

        return;

    }



    const row = COMBINATION_DB.find(r =>

        (r.a_en.toLowerCase() === pA.toLowerCase() && r.b_en.toLowerCase() === pB.toLowerCase()) ||

        (r.a_en.toLowerCase() === pB.toLowerCase() && r.b_en.toLowerCase() === pA.toLowerCase()) ||

        (r.code.toLowerCase().includes(pA.toLowerCase()) && r.code.toLowerCase().includes(pB.toLowerCase()))

    );



    if (!row || !row.text) {

        DOM.combInterpretationResults.innerHTML = `

            <div class="card" style="text-align: center; padding: 30px; color: var(--text-muted);">

                ไม่มีข้อมูลดาวคู่ผสมของ ${pA} + ${pB}

            </div>

        `;

        return;

    }



    const fA = COMB_FACTORS.find(f => f.id === pA) || { nameTH: pA };

    const fB = COMB_FACTORS.find(f => f.id === pB) || { nameTH: pB };



    const formattedText = row.text.split('\n').map(line => `<p style="margin-bottom: 6px; line-height: 1.6;">${escapeHtml(line)}</p>`).join('');



    DOM.combInterpretationResults.innerHTML = `

        <div class="card" style="border-left: 4px solid #FDC94D;">

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">

                <h2 style="font-size: 1.2rem; color: var(--gold-primary); margin: 0;">

                    🔗 ดาวคู่ผสม: ${escapeHtml(fA.nameTH)} - ${escapeHtml(fB.nameTH)} (${escapeHtml(row.code)})

                </h2>

                <span style="font-size: 0.72rem; background: rgba(253,201,77,0.15); color: #FDC94D; padding: 2px 8px; border-radius: 99px; border: 1px solid rgba(253,201,77,0.3);">

                    Reinhold Ebertin (COSI)

                </span>

            </div>



            <div style="font-size: 0.92rem; color: var(--text-color); background: rgba(30,10,50,0.4); padding: 14px; border-radius: 8px; border: 1px solid rgba(122,44,184,0.2);">

                ${formattedText}

            </div>

        </div>

    `;

}



function renderCombSearchResults() {

    const query = COMBINATION_STATE.keyword;

    if (!query || typeof COMBINATION_DB === 'undefined') return;



    if (DOM.combInterpretationResults) DOM.combInterpretationResults.style.display = 'none';

    if (!DOM.combSearchResultsList) return;



    const matches = COMBINATION_DB.filter(r =>

        r.code.toLowerCase().includes(query) ||

        r.a_th.toLowerCase().includes(query) ||

        r.b_th.toLowerCase().includes(query) ||

        (r.text && r.text.toLowerCase().includes(query))

    );



    DOM.combSearchResultsList.style.display = 'block';

    if (matches.length === 0) {

        DOM.combSearchResultsList.innerHTML = `

            <div style="text-align: center; padding: 40px; color: var(--text-muted);">

                ไม่พบข้อมูลดาวคู่ผสมที่ตรงกับคำสำคัญ "${escapeHtml(query)}"

            </div>

        `;

        return;

    }



    let html = `<div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">พบผลการค้นหาดาวคู่ผสม ${matches.length} รายการ</div>`;

    matches.forEach(r => {

        const preview = r.text.substring(0, 140) + '...';

        html += `

            <div class="card" style="margin-bottom: 12px; cursor: pointer;" onclick="selectCombPair('${r.a_en}', '${r.b_en}')">

                <div style="font-weight: 700; color: #FDC94D; font-size: 1rem;">🔗 คู่ดาว: ${escapeHtml(r.a_th)} - ${escapeHtml(r.b_th)} (${escapeHtml(r.code)})</div>

                <p style="font-size: 0.86rem; color: var(--text-color); margin-top: 6px; line-height: 1.5;">${escapeHtml(preview)}</p>

            </div>

        `;

    });

    DOM.combSearchResultsList.innerHTML = html;

}



function selectCombPair(pA, pB) {

    COMBINATION_STATE.planetA = pA;

    COMBINATION_STATE.planetB = pB;

    COMBINATION_STATE.keyword = '';

    if (DOM.searchInputComb) DOM.searchInputComb.value = '';

    if (DOM.searchClearComb) DOM.searchClearComb.style.display = 'none';

    populateCombDropdowns();

    renderCombinationTab();

}





// Utilities

function debounce(func, wait) {

    let timeout;

    return function(...args) {

        clearTimeout(timeout);

        timeout = setTimeout(() => func.apply(this, args), wait);

    };

}



function initApp() {

    initDOMCache();

    setupEventListeners();



    initSignTab();

    if (DOM.houseSystemSelect) initHouseTab();

    if (DOM.searchSelectAsteroidName) initAsteroidTab();

    if (DOM.transitPlanetsGrid) initTransitTab();

    if (DOM.aspectTransitPlanetsGrid) initAspectTab();



    setSearchType('equation');

    initKeyboard();

    updateBuilderUI();

    queryDatabase();

}



document.addEventListener('DOMContentLoaded', () => {

    if (document.querySelector('.app-container')) {

        initApp();

    }

});



document.addEventListener('celestia:unlocked', () => {

    initApp();

});

