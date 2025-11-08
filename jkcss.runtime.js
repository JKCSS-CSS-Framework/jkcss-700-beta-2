(function () {
    const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

    function applyDynamicClasses() {
        const allElements = document.querySelectorAll("*");

        allElements.forEach(el => {
            Array.from(el.classList).forEach(cls => {
                let prefix = null;
                let className = cls;


                const matchPrefix = cls.match(/^([a-z0-9]+):(.+)$/i);
                if (matchPrefix) {
                    prefix = matchPrefix[1];
                    className = matchPrefix[2];
                }


                const bgMatch = className.match(/^bg-\[#([0-9A-Fa-f]{3,6})\]$/);
                if (bgMatch) {
                    applyStyle(el, prefix, "backgroundColor", `#${bgMatch[1]}`);
                    return;
                }


                const textMatch = className.match(/^text-\[#([0-9A-Fa-f]{3,6})\]$/);
                if (textMatch) {
                    applyStyle(el, prefix, "color", `#${textMatch[1]}`);
                    return;
                }

    
                const paddingMatch = className.match(/^p([trblxy]?)-\[(.+)\]$/);
                if (paddingMatch) {
                    const dir = paddingMatch[1];
                    const value = paddingMatch[2];
                    const props = getSpacingProperties("padding", dir);
                    props.forEach(prop => applyStyle(el, prefix, prop, value));
                    return;
                }

                const marginMatch = className.match(/^m([trblxy]?)-\[(.+)\]$/);
                if (marginMatch) {
                    const dir = marginMatch[1];
                    const value = marginMatch[2];
                    const props = getSpacingProperties("margin", dir);
                    props.forEach(prop => applyStyle(el, prefix, prop, value));
                    return;
                }

                if (prefix) {
                    const width = breakpoints[prefix];
                    if (!width) return;

                    const mql = window.matchMedia(`(min-width: ${width}px)`);
                    const update = e => {
                        if (e.matches) {
                            if (!el.classList.contains(className)) el.classList.add(className);
                        } else {
                            if (el.classList.contains(className)) el.classList.remove(className);
                        }
                    };
                    update(mql);
                    if (mql.addEventListener) mql.addEventListener("change", update);
                    else if (mql.addListener) mql.addListener(update);
                    return;
                }

            });
        });
    }

    function getSpacingProperties(type, dir) {
        switch (dir) {
            case "t": return [`${type}Top`];
            case "b": return [`${type}Bottom`];
            case "l": return [`${type}Left`];
            case "r": return [`${type}Right`];
            case "x": return [`${type}Left`, `${type}Right`];
            case "y": return [`${type}Top`, `${type}Bottom`];
            case "": return [type];
            default: return [type];
        }
    }

    function applyStyle(el, prefix, prop, value) {
        if (!prefix) {
            el.style[prop] = value;
        } else {
            const width = breakpoints[prefix];
            if (!width) return;

            const mql = window.matchMedia(`(min-width: ${width}px)`);
            const update = e => {
                if (e.matches) el.style[prop] = value;
                else el.style[prop] = "";
            };
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
