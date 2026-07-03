export function getLocalizedField(hotspot, field, lang) {
    if (!hotspot) return '';

    if (lang && lang !== 'nl') {
        const localizedKey = `${field}_${lang}`;
        if (hotspot[localizedKey]) {
            return hotspot[localizedKey];
        }
    }

    return hotspot[field] || '';
}