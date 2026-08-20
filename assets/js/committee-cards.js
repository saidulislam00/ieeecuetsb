(function () {
    'use strict';

    const rosterSelector = [
        '#cuetsb-excom',
        '#wie-committee',
        '#ras-committee',
        '#pes-committee',
        '#embs-committee',
        '#pho-committee',
        '#sps-committee',
        '#aps-committee',
        '.excom-source-roster',
        '.excom-webteam'
    ].join(',');

    const roleSelector = '.committee-role, .role';
    const nameSelector = '.committee-name, .name';
    const avatarFallbackPath = '/assets/images/anonymous.webp';

    /* Which roster a section belongs to. Landing pages carry the id; the ExCom
       pages render an id-less section and declare the entity on <body>. */
    const sectionEntity = {
        'cuetsb-excom': 'sb',
        'wie-committee': 'wie',
        'ras-committee': 'ras',
        'pes-committee': 'pes',
        'embs-committee': 'embs',
        'pho-committee': 'photonics',
        'sps-committee': 'sps',
        'aps-committee': 'aps'
    };

    /* Chapters with no meaningful rank below the faculty panel. They render as
       two groups only -- the advisor/moderator row, then every other member in
       the order the official roster lists them. */
    const flatEntities = ['sps', 'aps', 'pes', 'embs', 'photonics'];

    /* As above, but the Chair is lifted onto a row of their own between the
       faculty row and the rest of the committee. */
    const chairLedEntities = ['ras'];

    /* Cards per row when a tier has to be split. Four keeps a seven-person
       advisory panel as 4 + 3 instead of wrapping to 3 + 3 + 1. */
    const maxCardsPerRow = 4;

    let statusTimer = 0;

    function normalized(value) {
        return (value || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    function contactDirectory() {
        const directory = window.IEEE_COMMITTEE_CONTACTS || {};
        const normalizedDirectory = new Map();

        Object.keys(directory).forEach(function (name) {
            normalizedDirectory.set(normalized(name), directory[name] || {});
        });

        return normalizedDirectory;
    }

    function firstDirectMatch(card, selector) {
        return Array.from(card.children).find(function (child) {
            return child.matches(selector);
        }) || card.querySelector(selector);
    }

    function cardIdentity(card) {
        const roleElement = firstDirectMatch(card, roleSelector);
        const explicitName = firstDirectMatch(card, '.committee-name');
        const nameElements = Array.from(card.querySelectorAll('.name'));
        const nameElement = explicitName || nameElements[0] || card.querySelector(nameSelector);

        return {
            roleElement: roleElement,
            nameElement: nameElement,
            name: nameElement ? nameElement.textContent.replace(/\s+/g, ' ').trim() : 'Committee member',
            role: roleElement ? roleElement.textContent.replace(/\s+/g, ' ').trim() : ''
        };
    }

    function roleRank(role) {
        const value = normalized(role)
            .replace(/[–—]/g, '-')
            .replace(/\s*\([^)]*\)\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (/\bcounsell?or\b/.test(value)) return 0;
        if (/\badvisory panel\b|\badvisor\b|\badviser\b/.test(value)) return 10;
        if (/\bmoderator\b/.test(value)) return 20;
        if (/^(branch )?chair$/.test(value)) return 30;
        if (/^general secretary$/.test(value)) return 40;
        if (/^organizing secretary$/.test(value)) return 50;
        if (/^vice[- ]chair\b/.test(value)) return 60;
        if (/^joint general secretary\b/.test(value)) return 70;
        if (/^joint organizing secretary\b|^joint os\b/.test(value)) return 80;
        return 100;
    }

    function normalizedRole(role) {
        return normalized(role)
            .replace(/[–—]/g, '-')
            .replace(/\s*\([^)]*\)\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function isCounselorRole(role) {
        return /^(?:student branch )?counsell?or$/.test(normalizedRole(role));
    }

    function isModeratorRole(role) {
        return /^moderator$/.test(normalizedRole(role));
    }

    function isAdvisoryPanelRole(role) {
        return normalizedRole(role) === 'advisory panel';
    }

    function rosterEntity(section) {
        if (section.id && sectionEntity[section.id]) return sectionEntity[section.id];
        const body = section.ownerDocument && section.ownerDocument.body;
        return (body && body.dataset.excomEntity) || '';
    }

    function isFacultyRole(role) {
        return isAdvisoryPanelRole(role) || isAdvisorRole(role) ||
            isModeratorRole(role) || isCounselorRole(role);
    }

    /* Split one tier across rows without ever stranding a single card on the
       last line: seven becomes 4 + 3, six becomes 3 + 3, five becomes 3 + 2. */
    function balancedRows(cards, perRow) {
        if (!perRow || cards.length <= perRow) return [cards];

        const rowCount = Math.ceil(cards.length / perRow);
        const base = Math.floor(cards.length / rowCount);
        let extra = cards.length % rowCount;
        const rows = [];
        let index = 0;

        for (let i = 0; i < rowCount; i += 1) {
            const size = base + (extra > 0 ? 1 : 0);
            if (extra > 0) extra -= 1;
            rows.push(cards.slice(index, index + size));
            index += size;
        }

        return rows;
    }

    function isAdvisorRole(role) {
        return /^(?:(?:faculty|chapter|student branch)\s+)?advis(?:or|er)$/.test(normalizedRole(role));
    }

    function facultyLabel(cards) {
        let panelCount = 0;
        let advisorCount = 0;
        let moderatorCount = 0;

        cards.forEach(function (card) {
            const role = cardIdentity(card).role;
            if (isAdvisoryPanelRole(role)) panelCount += 1;
            else if (isAdvisorRole(role)) advisorCount += 1;
            else if (isModeratorRole(role)) moderatorCount += 1;
        });

        const labels = [];
        if (panelCount) labels.push('Advisory Panel');
        if (advisorCount) labels.push(advisorCount === 1 ? 'Advisor' : 'Advisors');
        if (moderatorCount) labels.push(moderatorCount === 1 ? 'Moderator' : 'Moderators');
        return labels.join(' and ') || 'Faculty leadership';
    }

    /* The student branch has a Counselor above its Advisory Panel; chapters and the
       affinity group have an Advisor above their Moderators. Both collapse onto the
       same two faculty rows so every roster shares one structure. */
    function hierarchyTier(role, hasCounselor) {
        const value = normalizedRole(role);

        if (isCounselorRole(value)) return 'counselor';
        if (!hasCounselor && isAdvisorRole(value)) return 'counselor';

        if (isAdvisoryPanelRole(value) || isAdvisorRole(value) || isModeratorRole(value)) {
            return 'advisors';
        }

        if (/^(?:branch )?chair$/.test(value)) return 'chair';

        if (value === 'general secretary' || /^organi[sz]ing secretary$/.test(value)) {
            return 'secretariat';
        }

        if (/^vice[- ]chair\b/.test(value)) return 'vice-chairs';

        return 'members';
    }

    function initials(name) {
        return name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(function (part) { return part.charAt(0).toUpperCase(); })
            .join('') || 'IEEE';
    }

    function markImageUnavailable(card, image) {
        card.classList.add('has-image-error');
        image.setAttribute('aria-hidden', 'true');
    }

    function useAvatarFallback(card, image, identity) {
        if (image.dataset.avatarFallbackApplied === 'true') {
            markImageUnavailable(card, image);
            return;
        }

        image.dataset.avatarFallbackApplied = 'true';
        image.removeAttribute('srcset');
        image.removeAttribute('sizes');
        image.removeAttribute('referrerpolicy');
        image.src = avatarFallbackPath;
        image.alt = `Placeholder portrait for ${identity.name}`;
        card.classList.remove('has-image-error');
        card.classList.add('uses-avatar-fallback');
    }

    function prepareImage(card, identity) {
        const image = card.querySelector('.committee-img, img');
        if (!image) {
            const fallback = document.createElement('span');
            fallback.className = 'committee-avatar-fallback';
            fallback.setAttribute('aria-hidden', 'true');
            fallback.textContent = initials(identity.name);
            card.insertAdjacentElement('afterbegin', fallback);
            card.classList.add('has-image-error');
            return;
        }

        image.loading = 'lazy';
        image.decoding = 'async';
        if (!image.alt || !image.alt.trim()) image.alt = identity.name;
        if (/^https?:\/\//i.test(image.src)) image.referrerPolicy = 'no-referrer';

        let fallback = card.querySelector('.committee-avatar-fallback');
        if (!fallback) {
            fallback = document.createElement('span');
            fallback.className = 'committee-avatar-fallback';
            fallback.setAttribute('aria-hidden', 'true');
            fallback.textContent = initials(identity.name);
            image.insertAdjacentElement('afterend', fallback);
        }

        image.addEventListener('load', function () {
            card.classList.remove('has-image-error');
            image.removeAttribute('aria-hidden');
        });

        image.addEventListener('error', function () {
            useAvatarFallback(card, image, identity);
        });

        if (image.complete && image.naturalWidth === 0) {
            useAvatarFallback(card, image, identity);
        }
    }

    function contactFor(identity, card) {
        const stored = contactDirectory().get(normalized(identity.name)) || {};
        return {
            email: (card.dataset.email || stored.email || '').trim(),
            linkedin: (card.dataset.linkedin || stored.linkedin || '').trim()
        };
    }

    function icon(className) {
        const element = document.createElement('i');
        element.className = className;
        element.setAttribute('aria-hidden', 'true');
        return element;
    }

    function unavailableControl(type, identity) {
        const element = document.createElement('span');
        const label = type === 'email' ? 'Email address' : 'LinkedIn profile';
        element.className = `committee-contact-button committee-contact-${type} is-unavailable`;
        element.setAttribute('role', 'img');
        element.setAttribute('aria-label', `${label} for ${identity.name} will be added soon`);
        element.title = `${label} will be added soon`;
        element.appendChild(icon(type === 'email' ? 'fas fa-envelope' : 'fab fa-linkedin-in'));
        return element;
    }

    function emailControl(email, identity) {
        if (!email) return unavailableControl('email', identity);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'committee-contact-button committee-contact-email';
        button.dataset.committeeEmail = email;
        button.setAttribute('aria-label', `Copy email address for ${identity.name}`);
        button.title = `Copy ${identity.name}'s email address`;
        button.appendChild(icon('fas fa-envelope'));
        return button;
    }

    function linkedinControl(url, identity) {
        if (!url) return unavailableControl('linkedin', identity);

        const link = document.createElement('a');
        link.className = 'committee-contact-button committee-contact-linkedin';
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `Open ${identity.name}'s LinkedIn profile in a new tab`);
        link.title = `Open ${identity.name}'s LinkedIn profile`;
        link.appendChild(icon('fab fa-linkedin-in'));
        return link;
    }

    function prepareContactActions(card, identity) {
        if (card.querySelector('.committee-contact-actions')) return;

        const contact = contactFor(identity, card);
        const actions = document.createElement('div');
        actions.className = 'committee-contact-actions';
        actions.setAttribute('role', 'group');
        actions.setAttribute('aria-label', `Contact ${identity.name}`);
        actions.appendChild(emailControl(contact.email, identity));
        actions.appendChild(linkedinControl(contact.linkedin, identity));
        card.appendChild(actions);
    }

    function prepareCard(card) {
        if (card.dataset.committeeCardReady === 'true') return;

        const identity = cardIdentity(card);
        card.dataset.committeeCardReady = 'true';
        card.dataset.committeeRoleRank = String(roleRank(identity.role));

        if (identity.nameElement) identity.nameElement.classList.add('committee-person-name');
        if (identity.roleElement) identity.roleElement.classList.add('committee-person-role');

        Array.from(card.querySelectorAll('.name')).forEach(function (element) {
            if (element !== identity.nameElement) element.classList.add('committee-person-detail');
        });

        prepareImage(card, identity);
        prepareContactActions(card, identity);
    }

    function sortDirectCards(container) {
        const cards = Array.from(container.children).filter(function (child) {
            return child.classList && child.classList.contains('committee-card');
        });

        cards
            .map(function (card, index) {
                return {
                    card: card,
                    index: index,
                    rank: Number(card.dataset.committeeRoleRank || 100)
                };
            })
            .sort(function (left, right) {
                return left.rank - right.rank || left.index - right.index;
            })
            .forEach(function (entry) {
                container.appendChild(entry.card);
            });
    }

    function mergeLeadershipCards(section) {
        const primaryGrid = section.querySelector(':scope > .committee-grid') ||
            section.querySelector('.container > .committee-grid') ||
            section.querySelector('.committee-grid');
        if (!primaryGrid) return;

        const groups = Array.from(section.querySelectorAll('.teachers, .top-counselors, .top-advisors'));
        const leadershipCards = [];
        const redundantHeadings = groups.map(function (group) {
            return group.previousElementSibling;
        }).filter(function (element) {
            return element && /^H[1-6]$/.test(element.tagName) &&
                /advisory panel.*counsell?or board/i.test(element.textContent);
        });

        groups.forEach(function (group) {
            Array.from(group.children).forEach(function (child) {
                if (child.classList && child.classList.contains('committee-card')) {
                    leadershipCards.push(child);
                } else if (child.matches && child.matches('.top-advisors')) {
                    Array.from(child.children).forEach(function (nestedCard) {
                        if (nestedCard.classList && nestedCard.classList.contains('committee-card')) {
                            leadershipCards.push(nestedCard);
                        }
                    });
                }
            });
        });

        leadershipCards.forEach(function (card) {
            primaryGrid.appendChild(card);
        });

        groups.slice().reverse().forEach(function (group) {
            if (!group.querySelector('.committee-card')) group.remove();
        });

        redundantHeadings.forEach(function (heading) {
            heading.hidden = true;
        });
    }

    function hideImportedRosterHeadings(section) {
        if (!section.matches('.excom-source-roster')) return;

        const structuralRoot = section.querySelector(':scope > .container') || section;
        Array.from(structuralRoot.children).forEach(function (child) {
            if (!/^H[1-3]$/.test(child.tagName)) return;

            const label = normalized(child.textContent).replace(/[–—]/g, '-');
            if (label === 'executive committee' ||
                /^executive committee 2025\s*-\s*26$/.test(label) ||
                label === 'advisory panel and counselor board' ||
                label === 'advisory panel and counsellor board') {
                child.hidden = true;
            }
        });
    }

    function buildHierarchyRows(section, records) {
        const primaryGrid = section.querySelector(':scope > .committee-grid') ||
            section.querySelector('.container > .committee-grid') ||
            section.querySelector('.committee-grid');
        if (!primaryGrid) return;

        const entity = rosterEntity(section);
        const chairLed = chairLedEntities.indexOf(entity) > -1;
        const flat = chairLed || flatEntities.indexOf(entity) > -1;
        const hasCounselor = records.some(function (record) {
            return isCounselorRole(record.identity.role);
        });
        const buckets = {
            counselor: [],
            advisors: [],
            chair: [],
            secretariat: [],
            'vice-chairs': [],
            members: []
        };

        records
            .slice()
            .sort(function (left, right) {
                // A flat roster keeps the official document's own order.
                if (flat) return left.sourceIndex - right.sourceIndex;
                return roleRank(left.identity.role) - roleRank(right.identity.role) ||
                    left.sourceIndex - right.sourceIndex;
            })
            .forEach(function (record) {
                let tier;
                if (flat) {
                    const role = record.identity.role;
                    if (isFacultyRole(role)) tier = 'advisors';
                    else if (chairLed && /^(?:branch )?chair$/.test(normalizedRole(role))) tier = 'chair';
                    else tier = 'members';
                } else {
                    tier = hierarchyTier(record.identity.role, hasCounselor);
                }
                record.card.dataset.committeeTier = tier;
                buckets[tier].push(record.card);
            });

        const tierDefinitions = flat ? [
            { key: 'advisors', label: facultyLabel(buckets.advisors) },
            { key: 'chair', label: 'Chair' },
            { key: 'members', label: 'Executive Committee members', perRow: maxCardsPerRow }
        ] : [
            { key: 'counselor', label: hasCounselor ? 'Counselor' : 'Advisor' },
            { key: 'advisors', label: facultyLabel(buckets.advisors), perRow: maxCardsPerRow },
            { key: 'chair', label: 'Chair' },
            { key: 'secretariat', label: 'General and Organizing Secretaries' },
            { key: 'vice-chairs', label: 'Vice Chairs' },
            { key: 'members', label: 'Other Executive Committee members' }
        ];

        primaryGrid.querySelectorAll(':scope > .committee-tier-row').forEach(function (row) {
            row.remove();
        });
        primaryGrid.classList.add('committee-tier-layout');

        tierDefinitions.forEach(function (definition) {
            const cards = buckets[definition.key];
            if (!cards.length) return;

            const groups = balancedRows(cards, definition.perRow);
            const widest = groups.reduce(function (most, group) {
                return Math.max(most, group.length);
            }, 0);

            groups.forEach(function (group) {
                const row = document.createElement('div');
                row.className = 'committee-tier-row';
                row.dataset.committeeTier = definition.key;
                row.dataset.cardCount = String(group.length);
                // Rows split out of a single tier must size their cards off the
                // widest row, so the 4-up line and the 3-up line beneath it match.
                // Only meaningful for capped tiers; an uncapped tier just wraps.
                if (definition.perRow && widest >= 4) row.dataset.rowBasis = String(widest);
                row.setAttribute('role', 'list');
                row.setAttribute('aria-label', definition.label);

                group.forEach(function (card) {
                    card.setAttribute('role', 'listitem');
                    row.appendChild(card);
                });

                primaryGrid.appendChild(row);
            });
        });
    }

    function enhanceRoster(section) {
        if (!section || section.dataset.committeeRosterReady === 'true') return;
        section.dataset.committeeRosterReady = 'true';
        section.classList.add('committee-roster-standardized');

        const records = Array.from(section.querySelectorAll('.committee-card')).map(function (card, sourceIndex) {
            const identity = cardIdentity(card);
            prepareCard(card);
            return { card: card, identity: identity, sourceIndex: sourceIndex };
        });

        if (section.matches('.excom-webteam')) {
            section.querySelectorAll('.committee-grid').forEach(sortDirectCards);
            return;
        }

        mergeLeadershipCards(section);
        hideImportedRosterHeadings(section);
        buildHierarchyRows(section, records);
    }

    function findRosters(root) {
        const rosters = [];
        if (root && root.matches && root.matches(rosterSelector)) rosters.push(root);
        if (root && root.querySelectorAll) rosters.push.apply(rosters, root.querySelectorAll(rosterSelector));
        return Array.from(new Set(rosters));
    }

    function enhance(root) {
        findRosters(root || document).forEach(enhanceRoster);
    }

    function ensureStatusRegion() {
        let status = document.getElementById('committee-contact-status');
        if (!status) {
            status = document.createElement('div');
            status.id = 'committee-contact-status';
            status.className = 'committee-contact-status';
            status.setAttribute('role', 'status');
            status.setAttribute('aria-live', 'polite');
            status.setAttribute('aria-atomic', 'true');
            document.body.appendChild(status);
        }
        return status;
    }

    function announce(message) {
        const status = ensureStatusRegion();
        window.clearTimeout(statusTimer);
        status.textContent = message;
        status.classList.add('is-visible');
        statusTimer = window.setTimeout(function () {
            status.classList.remove('is-visible');
        }, 2600);
    }

    function legacyCopy(value) {
        const input = document.createElement('textarea');
        input.value = value;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand('copy');
        input.remove();
        if (!copied) throw new Error('Copy command failed');
    }

    async function copyEmail(button) {
        const email = button.dataset.committeeEmail;
        if (!email) return;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(email);
            } else {
                legacyCopy(email);
            }

            button.classList.add('is-copied');
            announce(`Email copied: ${email}`);
            window.setTimeout(function () { button.classList.remove('is-copied'); }, 1500);
        } catch (error) {
            announce(`Could not copy automatically. Email: ${email}`);
        }
    }

    document.addEventListener('click', function (event) {
        const emailButton = event.target.closest('[data-committee-email]');
        if (emailButton) copyEmail(emailButton);
    });

    document.addEventListener('committee:updated', function (event) {
        enhance(event.detail && event.detail.root ? event.detail.root : document);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { enhance(document); }, { once: true });
    } else {
        enhance(document);
    }
})();
