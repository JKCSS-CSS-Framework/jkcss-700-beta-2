(function () {
    const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

    function applyDynamicClasses() {
        const allElements = document.querySelectorAll("*");

        allElements.forEach(el => {
            // Use Array.from because classList is a live collection and we'll mutate it
            Array.from(el.classList).forEach(cls => {
                let prefix = null;
                let className = cls;

                // Detect responsive prefix (allow digits like 2xl)
                const matchPrefix = cls.match(/^([a-z0-9]+):(.+)$/i);
                if (matchPrefix) { prefix = matchPrefix[1]; className = matchPrefix[2]; }

                // Background color (bracket form) e.g. bg-[#123456]
                const bgMatch = className.match(/^bg-\[#([0-9A-Fa-f]{3,6})\]$/);
                if (bgMatch) {
                    applyStyle(el, prefix, "backgroundColor", `#${bgMatch[1]}`);
                    return;
                }

                // Text color (bracket form) e.g. text-[#123456]
                const textMatch = className.match(/^text-\[#([0-9A-Fa-f]{3,6})\]$/);
                if (textMatch) {
                    applyStyle(el, prefix, "color", `#${textMatch[1]}`);
                    return;
                }

                // Padding classes (bracket form) p-[20px], pt-[10px], etc.
                const paddingMatch = className.match(/^p([trbl]?)-\[(.+)\]$/);
                if (paddingMatch) {
                    const dir = paddingMatch[1];
                    const value = paddingMatch[2];
                    const prop = getSpacingProperty("padding", dir);
                    applyStyle(el, prefix, prop, value);
                    return;
                }

                // Margin classes (bracket form) m-[10px], mt-[5px], etc.
                const marginMatch = className.match(/^m([trbl]?)-\[(.+)\]$/);
                if (marginMatch) {
                    const dir = marginMatch[1];
                    const value = marginMatch[2];
                    const prop = getSpacingProperty("margin", dir);
                    applyStyle(el, prefix, prop, value);
                    return;
                }

                // If there's a prefix and this is a normal utility like text-blue-500 / bg-red-500 etc.
                if (prefix) {
                    const width = breakpoints[prefix];
                    if (!width) return; // unknown prefix (skip)

                    const mql = window.matchMedia(`(min-width: ${width}px)`);
                    const update = e => {
                        // When matches, ensure the unprefixed utility is present; otherwise remove it.
                        if (e.matches) {
                            if (!el.classList.contains(className)) el.classList.add(className);
                        } else {
                            if (el.classList.contains(className)) el.classList.remove(className);
                        }
                    };
                    // run once to set initial state
                    update(mql);
                    // listen for changes (modern and fallback)
                    if (mql.addEventListener) mql.addEventListener("change", update);
                    else if (mql.addListener) mql.addListener(update);
                    return;
                }

                // No prefix and no bracketed handler -> nothing to do here (regular classes come from CSS)
            });
        });
    }

    function getSpacingProperty(type, dir) {
        switch (dir) {
            case "t": return `${type}Top`;
            case "b": return `${type}Bottom`;
            case "l": return `${type}Left`;
            case "r": return `${type}Right`;
            case "": return type;  // p-[16px] or m-[16px]
            default: return type;
        }
    }

    function applyStyle(el, prefix, prop, value) {
        if (!prefix) {
            el.style[prop] = value;
        } else {
            const width = breakpoints[prefix];
            if (!width) return;

            const mql = window.matchMedia(`(min-width: ${width}px)`);
            const update = e => { if (e.matches) el.style[prop] = value; else el.style[prop] = ""; };
            update(mql);
            if (mql.addEventListener) mql.addEventListener("change", update);
            else if (mql.addListener) mql.addListener(update);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyDynamicClasses);
    } else {
        applyDynamicClasses();
    }
})();
