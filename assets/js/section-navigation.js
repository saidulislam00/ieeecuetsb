/*
 * Shared navigation behavior.
 *
 * - Same-page section links scroll without leaving a hash in the address bar.
 * - Navbar disclosures and the mobile menu expose one consistent accessible
 *   interaction model, including on pages that still ship older click handlers.
 */
(function () {
    'use strict';

    const NAV_BREAKPOINT = 1120;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compactNavigation = window.matchMedia(`(max-width: ${NAV_BREAKPOINT}px)`);
    const dropdownSelector = '.dropdown-link, [data-nav-dropdown-toggle]';
    const focusableSelector = 'a[href]:not([aria-disabled="true"]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let generatedId = 0;

    function normalizedPath(pathname) {
        const withoutIndex = pathname.replace(/\/index\.html$/, '/');
        return withoutIndex.length > 1 ? withoutIndex.replace(/\/$/, '') : withoutIndex;
    }

    function isSameDocument(url) {
        return url.origin === window.location.origin &&
            normalizedPath(url.pathname) === normalizedPath(window.location.pathname) &&
            url.search === window.location.search;
    }

    function findTarget(hash) {
        if (!hash || hash === '#') return null;

        try {
            const targetName = decodeURIComponent(hash.slice(1));
            return document.getElementById(targetName) || document.getElementsByName(targetName)[0] || null;
        } catch (error) {
            return null;
        }
    }

    function scrollToTarget(target) {
        target.scrollIntoView({
            behavior: reducedMotion.matches ? 'auto' : 'smooth',
            block: 'start'
        });
    }

    function secureExternalLink(link) {
        if (!link || !link.href) return;

        let url;
        try {
            url = new URL(link.href, window.location.href);
        } catch (error) {
            return;
        }

        if (!/^https?:$/.test(url.protocol)) return;

        const normalizedHostname = url.hostname.toLowerCase().replace(/^www\./, '');
        const isInternalWebsiteLink = url.origin === window.location.origin ||
            normalizedHostname === 'ieeecuetsb.org';

        if (isInternalWebsiteLink) {
            if (link.getAttribute('target') === '_blank') link.removeAttribute('target');
            return;
        }

        link.target = '_blank';
        const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
        rel.add('noopener');
        rel.add('noreferrer');
        link.setAttribute('rel', Array.from(rel).join(' '));
    }

    function secureExternalLinks(root) {
        if (!root) return;
        if (root.matches && root.matches('a[href]')) secureExternalLink(root);
        if (root.querySelectorAll) root.querySelectorAll('a[href]').forEach(secureExternalLink);
    }

    function observeExternalLinks() {
        secureExternalLinks(document);

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'attributes') {
                    secureExternalLink(mutation.target);
                    return;
                }

                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) secureExternalLinks(node);
                });
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href']
        });
    }

    function nextId(prefix) {
        generatedId += 1;
        return `${prefix}-${generatedId}`;
    }

    function getDropdownParts(trigger) {
        if (!trigger) return null;

        const dropdown = trigger.closest('.dropdown');
        if (!dropdown) return null;

        const menu = dropdown.querySelector(':scope > .dropdown-menu');
        if (!menu) return null;

        if (!menu.id) menu.id = nextId('nav-dropdown-menu');
        trigger.setAttribute('aria-controls', menu.id);
        trigger.setAttribute('aria-expanded', dropdown.classList.contains('open') ? 'true' : 'false');
        trigger.setAttribute('aria-haspopup', 'true');

        if (trigger.tagName === 'A') {
            trigger.setAttribute('role', 'button');
        }

        return { trigger, dropdown, menu };
    }

    function menuItems(menu) {
        return Array.from(menu.querySelectorAll(focusableSelector)).filter(function (element) {
            return !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true';
        });
    }

    function setDropdownState(parts, shouldOpen) {
        if (!parts) return;
        parts.dropdown.classList.toggle('open', shouldOpen);
        parts.trigger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }

    function closeDropdown(dropdown, returnFocus) {
        if (!dropdown) return;
        const trigger = dropdown.querySelector(`:scope > ${dropdownSelector}`);
        const parts = getDropdownParts(trigger);
        setDropdownState(parts, false);
        if (returnFocus && parts) parts.trigger.focus();
    }

    function closeDropdowns(exceptDropdown) {
        document.querySelectorAll('.dropdown.open').forEach(function (dropdown) {
            if (dropdown !== exceptDropdown) closeDropdown(dropdown, false);
        });
    }

    function openDropdown(parts, focusEdge) {
        if (!parts) return;
        closeDropdowns(parts.dropdown);
        setDropdownState(parts, true);

        if (focusEdge) {
            const items = menuItems(parts.menu);
            const target = focusEdge === 'last' ? items[items.length - 1] : items[0];
            if (target) target.focus();
        }
    }

    function setupMenuToggle(toggle) {
        if (!toggle) return null;

        const navbar = toggle.closest('.navbar') || toggle.parentElement;
        const links = navbar ? navbar.querySelector('.nav-links') : document.querySelector('.nav-links');
        if (!links) return null;

        if (!links.id) links.id = nextId('primary-navigation');
        toggle.setAttribute('aria-controls', links.id);
        toggle.setAttribute('aria-expanded', links.classList.contains('active') ? 'true' : 'false');

        return { toggle, navbar, links };
    }

    function setNavigationState(parts, shouldOpen) {
        if (!parts) return;
        parts.links.classList.toggle('active', shouldOpen);
        parts.toggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        if (!shouldOpen) closeDropdowns();
    }

    function closeCompactNavigation(returnFocus) {
        document.querySelectorAll('.menu-toggle').forEach(function (toggle) {
            const parts = setupMenuToggle(toggle);
            if (!parts || !parts.links.classList.contains('active')) return;
            setNavigationState(parts, false);
            if (returnFocus) parts.toggle.focus();
        });
    }

    function initializeNavigation(root) {
        const scope = root || document;
        scope.querySelectorAll(dropdownSelector).forEach(getDropdownParts);
        scope.querySelectorAll('.menu-toggle').forEach(setupMenuToggle);
    }

    function consumeLegacyEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }

    /*
     * Capture-phase handling intentionally runs before the older per-page
     * bubbling listeners. This prevents a disclosure from being toggled twice.
     */
    document.addEventListener('click', function (event) {
        const toggle = event.target.closest('.menu-toggle');
        if (toggle) {
            consumeLegacyEvent(event);
            const parts = setupMenuToggle(toggle);
            if (!parts) return;
            setNavigationState(parts, !parts.links.classList.contains('active'));
            return;
        }

        const trigger = event.target.closest(dropdownSelector);
        if (trigger) {
            consumeLegacyEvent(event);
            const parts = getDropdownParts(trigger);
            if (!parts) return;
            const shouldOpen = !parts.dropdown.classList.contains('open');
            if (shouldOpen) openDropdown(parts);
            else setDropdownState(parts, false);
            return;
        }

        const clickedNavbar = event.target.closest('.navbar');
        const clickedDropdown = event.target.closest('.dropdown');

        if (!clickedDropdown) closeDropdowns();
        if (compactNavigation.matches && !clickedNavbar) closeCompactNavigation(false);

        if (compactNavigation.matches) {
            const navLink = event.target.closest('.nav-links a[href]');
            if (navLink) closeCompactNavigation(false);
        }
    }, true);

    document.addEventListener('keydown', function (event) {
        const trigger = event.target.closest(dropdownSelector);

        if (trigger && ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
            consumeLegacyEvent(event);
            const parts = getDropdownParts(trigger);
            if (!parts) return;

            if (event.key === 'ArrowDown') {
                openDropdown(parts, 'first');
            } else if (event.key === 'ArrowUp') {
                openDropdown(parts, 'last');
            } else {
                const shouldOpen = !parts.dropdown.classList.contains('open');
                if (shouldOpen) openDropdown(parts);
                else setDropdownState(parts, false);
            }
            return;
        }

        const dropdown = event.target.closest('.dropdown');
        if (dropdown && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            const parts = getDropdownParts(dropdown.querySelector(`:scope > ${dropdownSelector}`));
            if (!parts || !parts.menu.contains(event.target)) return;

            const items = menuItems(parts.menu);
            const currentIndex = items.indexOf(event.target);
            if (currentIndex === -1 || items.length === 0) return;

            event.preventDefault();
            const direction = event.key === 'ArrowDown' ? 1 : -1;
            items[(currentIndex + direction + items.length) % items.length].focus();
            return;
        }

        if (event.key === 'Escape') {
            const openDropdown = event.target.closest('.dropdown.open');
            if (openDropdown) {
                event.preventDefault();
                closeDropdown(openDropdown, true);
                return;
            }

            if (document.querySelector('.nav-links.active')) {
                event.preventDefault();
                closeCompactNavigation(true);
            } else {
                closeDropdowns();
            }
        }
    }, true);

    document.addEventListener('focusin', function (event) {
        const focusedDropdown = event.target.closest('.dropdown');
        closeDropdowns(focusedDropdown || null);
    });

    function handleBreakpointChange() {
        closeDropdowns();
        if (!compactNavigation.matches) closeCompactNavigation(false);
        initializeNavigation(document);
    }

    if (typeof compactNavigation.addEventListener === 'function') {
        compactNavigation.addEventListener('change', handleBreakpointChange);
    } else if (typeof compactNavigation.addListener === 'function') {
        compactNavigation.addListener(handleBreakpointChange);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initializeNavigation(document);
            observeExternalLinks();
        }, { once: true });
    } else {
        initializeNavigation(document);
        observeExternalLinks();
    }

    /* Keep same-page section navigation out of the address bar. */
    document.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0 ||
            event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
            return;
        }

        const link = event.target.closest('a[href]');
        if (!link || link.matches(dropdownSelector) || link.hasAttribute('download') ||
            (link.target && link.target.toLowerCase() !== '_self')) {
            return;
        }

        const rawHref = link.getAttribute('href');
        if (!rawHref) return;

        const url = new URL(link.href, window.location.href);
        if (!isSameDocument(url)) return;

        if (url.hash) {
            event.preventDefault();
            const target = findTarget(url.hash);
            if (target) scrollToTarget(target);
        } else if (url.hash === '' && rawHref.trim() === '#') {
            event.preventDefault();
        }
    });

    /* Honor an incoming deep link once, then restore the clean page address. */
    if (window.location.hash) {
        const initialTarget = findTarget(window.location.hash);
        if (initialTarget) {
            window.history.replaceState(
                window.history.state,
                document.title,
                window.location.pathname + window.location.search
            );
            requestAnimationFrame(function () {
                scrollToTarget(initialTarget);
            });
        }
    }
})();
