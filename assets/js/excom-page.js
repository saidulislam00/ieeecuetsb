(function () {
    'use strict';

    const entities = {
        sb: {
            slug: 'ieeecuetsb',
            name: 'IEEE CUET Student Branch',
            source: '/ieeecuetsb/',
            accent: '#3cf2ff',
            rgb: '60, 242, 255'
        },
        wie: {
            slug: 'wie',
            name: 'IEEE Women in Engineering CUET Student Branch Affinity Group',
            source: '/wie/',
            accent: '#ff9aff',
            rgb: '255, 154, 255'
        },
        ras: {
            slug: 'ras',
            name: 'IEEE Robotics and Automation Society CUET Student Branch Chapter',
            source: '/ras/',
            accent: '#ff7a45',
            rgb: '255, 122, 69'
        },
        pes: {
            slug: 'pes',
            name: 'IEEE Power & Energy Society CUET Student Branch Chapter',
            source: '/pes/',
            accent: '#31d982',
            rgb: '49, 217, 130'
        },
        embs: {
            slug: 'embs',
            name: 'IEEE Engineering in Medicine and Biology Society CUET Student Branch Chapter',
            source: '/embs/',
            accent: '#ff735f',
            rgb: '255, 115, 95'
        },
        photonics: {
            slug: 'photonics',
            name: 'IEEE Photonics Society CUET Student Branch Chapter',
            source: '/photonics/',
            accent: '#d767ff',
            rgb: '215, 103, 255'
        },
        sps: {
            slug: 'sps',
            name: 'IEEE Signal Processing Society CUET Student Branch Chapter',
            source: '/sps/',
            accent: '#00e5ff',
            rgb: '0, 229, 255'
        },
        aps: {
            slug: 'aps',
            name: 'IEEE Antennas and Propagation Society CUET Student Branch Chapter',
            source: '/aps/',
            accent: '#b58cff',
            rgb: '181, 140, 255'
        }
    };

    const body = document.body;
    const entityKey = body.dataset.excomEntity || 'sb';
    const year = body.dataset.excomYear || '2025-26';
    const entity = entities[entityKey] || entities.sb;
    const navHost = document.getElementById('excom-site-nav');
    const content = document.getElementById('excom-content');

    /* Years with an official roster committed under /assets/data. Each is the
       transcript of that session's signed ExCom PDF, so the pages no longer
       scrape the society landing pages -- those carry the *current* committee
       and had been showing 2026-27 officers under the 2025-26 heading. */
    const PUBLISHED_YEARS = ['2025-26', '2026-27'];

    function publishedRosterPath() {
        return `/assets/data/excom-${year}.json`;
    }

    body.style.setProperty('--excom-accent', entity.accent);
    body.style.setProperty('--excom-accent-rgb', entity.rgb);

    function yearLabel(value) {
        return value.replace('-', '–');
    }

    function excomLinks() {
        return ['2026-27', '2025-26', '2024-25'].map(function (item) {
            const current = item === year ? ' aria-current="page"' : '';
            return `<li><a href="/${entity.slug}/excom/${item}/"${current}>${item.slice(2)}</a></li>`;
        }).join('');
    }

    function renderNavigation() {
        if (!navHost) return;

        navHost.innerHTML = `
            <nav class="navbar" aria-label="Primary navigation">
                <div class="nav-container">
                    <div class="logo-area">
                        <a href="/" aria-label="IEEE CUET Student Branch home">
                            <img src="/assets/images/Logos/IEEE%20CUET%20SB.png" class="logo-img" alt="IEEE CUET Student Branch">
                        </a>
                    </div>
                    <button class="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false">&#9776;</button>
                    <ul class="nav-links">
                        <li><a href="/">Home</a></li>
                        <li class="dropdown">
                                <button type="button" class="dropdown-link nav-dropdown-toggle" data-nav-dropdown-toggle aria-expanded="false">About <span class="nav-caret" aria-hidden="true">&#9662;</span></button>
                            <ul class="dropdown-menu">
                                <li><a href="/ieee/">IEEE</a></li>
                                <li><a href="/ieeebd/">IEEE Bangladesh Section</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <button type="button" class="dropdown-link nav-dropdown-toggle" data-nav-dropdown-toggle aria-expanded="false">Societies &amp; Chapters <span class="nav-caret" aria-hidden="true">&#9662;</span></button>
                            <ul class="dropdown-menu">
                                <li><a href="/wie/">Women in Engineering Affinity Group</a></li>
                                <li><a href="/ras/">Robotics and Automation Society</a></li>
                                <li><a href="/pes/">Power and Energy Society</a></li>
                                <li><a href="/embs/">Engineering in Medicine and Biology Society</a></li>
                                <li><a href="/photonics/">Photonics Society</a></li>
                                <li><a href="/sps/">Signal Processing Society</a></li>
                                <li><a href="/aps/">Antennas and Propagation Society</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <button type="button" class="dropdown-link nav-dropdown-toggle" data-nav-dropdown-toggle aria-expanded="false">Ex-Com <span class="nav-caret" aria-hidden="true">&#9662;</span></button>
                            <ul class="dropdown-menu">${excomLinks()}</ul>
                        </li>
                        <li><a href="/#events">Events</a></li>
                        <li><a href="/#achievements">Achievements</a></li>
                        <li><a href="/#contact">Contact</a></li>
                    </ul>
                    <a href="https://forms.gle/Kp3cq83bWSMQXaCu8" target="_blank" rel="noopener noreferrer" class="portal-btn desktop-only">Join IEEE</a>
                </div>
            </nav>`;
    }

    function cleanText(value) {
        return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
    }

    function safePublicUrl(value) {
        const candidate = cleanText(value);
        if (!candidate) return '';

        try {
            const url = new URL(candidate, window.location.origin);
            if (url.protocol !== 'https:' && url.origin !== window.location.origin) return '';
            return candidate;
        } catch (error) {
            return '';
        }
    }

    function validatePublishedRoster(documentData) {
        if (!documentData || documentData.year !== year || !documentData.entities) {
            throw new Error('Published roster metadata does not match this page');
        }

        const roster = documentData.entities[entityKey];
        if (!roster || !Array.isArray(roster.members) || !roster.members.length) {
            throw new Error('Published roster data was not found for this entity');
        }

        const names = new Set();
        const members = roster.members.map(function (member, index) {
            const name = cleanText(member && member.name);
            const role = cleanText(member && member.role);
            const identity = name.toLowerCase();

            if (!name || !role) {
                throw new Error('Roster entry ' + (index + 1) + ' is missing a name or role');
            }
            if (names.has(identity)) {
                throw new Error('Duplicate roster entry: ' + name);
            }
            names.add(identity);

            return {
                name: name,
                role: role,
                details: Array.isArray(member.details)
                    ? member.details.map(cleanText).filter(Boolean)
                    : [],
                image: safePublicUrl(member.image),
                email: cleanText(member.email),
                linkedin: safePublicUrl(member.linkedin)
            };
        });

        return { members: members };
    }

    function createTextElement(tagName, className, value) {
        const element = document.createElement(tagName);
        element.className = className;
        element.textContent = value;
        return element;
    }

    function buildPublishedRoster(roster) {
        const section = document.createElement('section');
        section.className = 'excom-source-roster';
        section.setAttribute('aria-labelledby', 'roster-title');

        const container = document.createElement('div');
        container.className = 'container';

        const grid = document.createElement('div');
        grid.className = 'committee-grid';

        roster.members.forEach(function (member) {
            const card = document.createElement('article');
            card.className = 'committee-card';

            if (member.email) card.dataset.email = member.email;
            if (member.linkedin) card.dataset.linkedin = member.linkedin;

            if (member.image) {
                const image = document.createElement('img');
                image.className = 'committee-img';
                image.src = member.image;
                image.alt = member.name;
                image.loading = 'lazy';
                image.decoding = 'async';
                card.appendChild(image);
            }

            card.appendChild(createTextElement('h3', 'committee-name', member.name));
            card.appendChild(createTextElement('p', 'committee-role', member.role));
            member.details.forEach(function (detail) {
                card.appendChild(createTextElement('p', 'committee-dept', detail));
            });

            grid.appendChild(card);
        });

        container.appendChild(grid);
        section.appendChild(container);
        return section;
    }

    async function loadPublishedRoster() {
        // 'no-cache' revalidates with the server on every load (a cheap 304 when
        // nothing changed). Without it a browser can keep serving a roster from
        // before the photos were added, showing initials on every card.
        const response = await fetch(publishedRosterPath(), {
            credentials: 'same-origin',
            cache: 'no-cache'
        });
        if (!response.ok) {
            throw new Error('Roster data request failed: ' + response.status);
        }

        const documentData = await response.json();
        const roster = validatePublishedRoster(documentData);
        const section = buildPublishedRoster(roster);
        content.replaceChildren(section);

        document.dispatchEvent(new CustomEvent('committee:updated', {
            detail: { root: content }
        }));
    }

    function renderPlaceholder() {
        if (!content) return;
        const displayYear = yearLabel(year);
        content.innerHTML = `
            <article class="excom-placeholder" aria-labelledby="availability-title">
                <span class="excom-placeholder-icon" aria-hidden="true"><i class="far fa-calendar"></i></span>
                <h2 id="availability-title">Roster not published yet</h2>
                <p>The ${displayYear} Executive Committee details for ${entity.name} have not been provided yet. This page is ready and will be updated when the official roster is available.</p>
                <a href="/${entity.slug}/excom/2025-26/">View the 2025–26 committee</a>
            </article>`;
    }

    function renderLoadError() {
        if (!content) return;
        content.innerHTML = `
            <article class="excom-placeholder" role="status">
                <span class="excom-placeholder-icon" aria-hidden="true"><i class="fas fa-users"></i></span>
                <h2>Committee details could not be loaded</h2>
                <p>The official roster is temporarily unavailable. Please refresh or return to the community page.</p>
                <a class="excom-error-link" href="${entity.source}">Return to the community page</a>
            </article>`;
    }

    async function loadRoster() {
        if (!content) return;

        if (!PUBLISHED_YEARS.includes(year)) {
            renderPlaceholder();
            if (entityKey === 'sb') appendWebTeam(content);
            return;
        }

        try {
            await loadPublishedRoster();
            if (entityKey === 'sb') appendWebTeam(content);
        } catch (error) {
            renderLoadError();
        }
    }

    const WEB_TEAM_TIERS = [
        {
            title: 'WEB LEADS',
            role: 'Web Lead',
            cardClass: 'lead',
            members: ['Saidul Islam', 'Samin Yeasar', 'Shuvro Das', 'Debarati Chakraborty']
        },
        {
            title: 'SENIOR DEVELOPERS',
            role: 'Senior Developer',
            cardClass: 'senior',
            members: ['Pulak Bhowmik', 'Sorder Rakib Hassan', 'Sababa Tamanna', 'Chyan Datta', 'Tanim Rayhan', 'Ishmam Mahir']
        },
        {
            title: 'JUNIOR DEVELOPERS',
            role: 'Junior Developer',
            cardClass: 'junior',
            members: ['Al Khalid']
        }
    ];

    function buildWebTeamCard(name, tier) {
        const card = document.createElement('div');
        card.className = 'committee-card ' + tier.cardClass;

        const image = document.createElement('img');
        image.className = 'committee-img';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.alt = name;
        image.src = 'https://api.dicebear.com/9.x/identicon/svg?seed=' + encodeURIComponent(name) + '&backgroundColor=001a36';
        card.appendChild(image);

        card.appendChild(createTextElement('h3', 'committee-role', tier.role));
        card.appendChild(createTextElement('p', 'committee-name', name));

        return card;
    }

    function appendWebTeam(destination) {
        const wrapper = document.createElement('section');
        wrapper.className = 'excom-webteam committee-roster-standardized';
        wrapper.setAttribute('aria-labelledby', 'webteam-heading');

        const heading = document.createElement('h2');
        heading.id = 'webteam-heading';
        heading.className = 'excom-webteam-title';
        heading.textContent = 'Web Management Team';
        wrapper.appendChild(heading);

        WEB_TEAM_TIERS.forEach(function (tier) {
            const tierSection = document.createElement('section');
            tierSection.className = 'webteam-committee';
            tierSection.appendChild(createTextElement('h2', 'committee-title', tier.title));

            const grid = document.createElement('div');
            grid.className = 'committee-grid';
            tier.members.forEach(function (name) {
                grid.appendChild(buildWebTeamCard(name, tier));
            });
            tierSection.appendChild(grid);

            wrapper.appendChild(tierSection);
        });

        destination.appendChild(wrapper);
    }

    renderNavigation();
    loadRoster();
})();
