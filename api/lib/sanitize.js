// HTML sanitization utility for user-submitted content
// Prevents XSS when embedding user input in HTML (e.g., LibreDesk ticket content)

export function escapeHtml(str) {
    if (typeof str !== 'string') {
        return '';
    }

    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
