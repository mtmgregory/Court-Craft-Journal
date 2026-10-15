// Slider questions: stacked, full width, quick to answer.
// The real value lives in a hidden input (same id as before), so saving, drafts,
// editing and CSV all work unchanged. A slider nobody touched stays blank.
import { RECOVERY_SLIDERS, GOAL_SLIDERS } from './fields.js';

const ALL = [...RECOVERY_SLIDERS, ...GOAL_SLIDERS];

function fieldHTML(c) {
    return `
        <div class="slider-field unset" data-for="${c.id}">
            <div class="slider-head">
                <label for="${c.id}Range">${c.label}</label>
                <span class="slider-value">Not set</span>
                <button type="button" class="slider-clear" title="Clear" aria-label="Clear ${c.label}">✕</button>
            </div>
            <input type="range" id="${c.id}Range" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.start}">
            <div class="slider-ends"><span>${c.low}</span><span>${c.high}</span></div>
            <input type="hidden" id="${c.id}">
        </div>`;
}

export function buildSliders(containerId, configs) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = configs.map(fieldHTML).join('');
}

function text(c, v) {
    return c.of ? `${v} / ${c.of}` : `${v}${c.unit || ''}`;
}

function paint(field, value) {
    const c = ALL.find(x => x.id === field.dataset.for);
    const range = field.querySelector('input[type="range"]');
    const label = field.querySelector('.slider-value');
    const isSet = value !== '' && value !== null && value !== undefined && !isNaN(parseFloat(value));
    field.classList.toggle('unset', !isSet);
    if (isSet) {
        range.value = value;
        label.textContent = text(c, value);
        range.setAttribute('aria-valuetext', text(c, value));
    } else {
        range.value = c.start;
        label.textContent = 'Not set';
        range.setAttribute('aria-valuetext', 'Not set');
    }
}

// Re-read every hidden value (after clear, edit or draft load)
export function syncSliders() {
    document.querySelectorAll('.slider-field').forEach(field => {
        paint(field, document.getElementById(field.dataset.for)?.value);
    });
}

function setValue(field, value) {
    const hidden = document.getElementById(field.dataset.for);
    if (hidden) hidden.value = value;
    paint(field, value);
}

export function setupSliders() {
    buildSliders('recoverySliders', RECOVERY_SLIDERS);
    buildSliders('goalSliders', GOAL_SLIDERS);

    // touching the thumb without moving it still counts as an answer
    document.addEventListener('pointerdown', e => {
        const range = e.target.closest?.('.slider-field input[type="range"]');
        if (!range) return;
        const field = range.closest('.slider-field');
        if (field.classList.contains('unset')) setValue(field, range.value);
    });

    document.addEventListener('input', e => {
        const range = e.target.closest?.('.slider-field input[type="range"]');
        if (range) setValue(range.closest('.slider-field'), range.value);
    });

    document.addEventListener('click', e => {
        const btn = e.target.closest?.('.slider-clear');
        if (!btn) return;
        setValue(btn.closest('.slider-field'), '');
        // let autosave know the form changed
        document.getElementById('journal')?.dispatchEvent(new Event('change', { bubbles: true }));
    });
}
