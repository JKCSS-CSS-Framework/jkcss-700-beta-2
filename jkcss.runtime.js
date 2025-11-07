(function () {
    const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

    function applyDynamicClasses() {
        const allElements = document.querySelectorAll("*");

        allElements.forEach(el => {
            el.classList.forEach(cls => {
                let prefix = null;
                let className = cls;

                const matchPrefix = cls.match(/^([a-z]+):(.+)$/);
                if (matchPrefix) { prefix = matchPrefix[1]; className = matchPrefix[2]; }

                const bgMatch = className.match(/^bg-\[#([0-9A-Fa-f]{3,6})\]$/);
                if (bgMatch) {
                    const color = `#${bgMatch[1]}`;
                    if (!prefix) el.style.backgroundColor = color;
                    else applyResponsive(el, prefix, "backgroundColor", color);
                }

                const textMatch = className.match(/^text-\[#([0-9A-Fa-f]{3,6})\]$/);
                if (textMatch) {
                    const color = `#${textMatch[1]}`;
                    if (!prefix) el.style.color = color;
                    else applyResponsive(el, prefix, "color", color);
                }
            });
        });
    }

    function applyResponsive(el, prefix, prop, value) {
        const width = breakpoints[prefix];
        if (!width) return;

        const mql = window.matchMedia(`(min-width: ${width}px)`);
        const applyStyle = e => { if (e.matches) el.style[prop] = value; else el.style[prop] = ""; };

        mql.addEventListener("change", applyStyle);
        applyStyle(mql);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyDynamicClasses);
    } else { applyDynamicClasses(); }
})();
