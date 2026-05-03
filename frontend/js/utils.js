const Utils = {
    lerp: function(start, end, t) {
        return start + (end - start) * t;
    },

    random: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    clamp: function(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    map: function(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },

    distance: function(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },

    radians: function(degrees) {
        return degrees * Math.PI / 180;
    },

    degrees: function(radians) {
        return radians * 180 / Math.PI;
    },

    easeInOutQuad: function(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },

    easeOutCubic: function(t) {
        return (--t) * t * t + 1;
    },

    easeInCubic: function(t) {
        return t * t * t;
    },

    formatDate: function(date) {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    showError: function(message) {
        const toast = document.getElementById('error-toast');
        const messageEl = document.getElementById('error-message');
        if (toast && messageEl) {
            messageEl.textContent = message;
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }
    },

    showLoading: function() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    },

    hideLoading: function() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
