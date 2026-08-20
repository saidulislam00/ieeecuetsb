/* Single source of truth for the site footer.
   Every page carries an empty <footer id="contact"></footer> and loads this file;
   keeping the markup here stops the copies from drifting apart over time. */
(function () {
    'use strict';

    const FOOTER_HTML = `
        <div class="footer-container">
            <!-- Footer Top Section -->
            <div class="footer-top">
                <!-- About Section -->
                <div class="footer-section">
                    <div class="footer-logo">
                        <img src="/assets/images/Logos/IEEE%20CUET%20SB.png" alt="IEEE CUET SB Logo" style="height: 80px; margin-bottom: 15px;">
                    </div>
                    <h3 class="footer-title">IEEE CUET Student Branch</h3>
                    <p class="footer-desc">
                        Advancing Technology for Humanity through innovation, collaboration, and technical excellence at Chittagong University of Engineering &amp; Technology.
                    </p>
                </div>

                <!-- Quick Links -->
                <div class="footer-section">
                    <h4 class="footer-heading">Quick Links</h4>
                    <ul class="footer-list">
                        <li><a href="/"><i class="fas fa-chevron-right"></i> Home</a></li>
                        <li><a href="/ieee/"><i class="fas fa-chevron-right"></i> About IEEE</a></li>
                        <li><a href="/ieeebd/"><i class="fas fa-chevron-right"></i> IEEE Bangladesh Section</a></li>
                        <li><a href="/ieeecuetsb/"><i class="fas fa-chevron-right"></i> IEEE CUET SB</a></li>
                        <li><a href="https://www.ieeer10.org/" target="_blank"><i class="fas fa-chevron-right"></i> IEEE R10</a></li>
                    </ul>
                </div>

                <!-- Societies -->
                <div class="footer-section">
                    <h4 class="footer-heading">Affinity Group &amp; Chapters</h4>
                    <ul class="footer-list">
                        <li><a href="/wie/"><i class="fas fa-chevron-right"></i> WIE</a></li>
                        <li><a href="/ras/"><i class="fas fa-chevron-right"></i> RAS</a></li>
                        <li><a href="/sps/"><i class="fas fa-chevron-right"></i> SPS</a></li>
                        <li><a href="/pes/"><i class="fas fa-chevron-right"></i> PES</a></li>
                        <li><a href="/embs/"><i class="fas fa-chevron-right"></i> EMBS</a></li>
                        <li><a href="/photonics/"><i class="fas fa-chevron-right"></i> Photonics</a></li>
                        <li><a href="/aps/"><i class="fas fa-chevron-right"></i> APS</a></li>
                    </ul>
                </div>

                <!-- Contact Info -->
                <div class="footer-section">
                    <h4 class="footer-heading">Get In Touch</h4>
                    <ul class="footer-contact">
                        <li>
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Chittagong University of Engineering &amp; Technology<br>Chattogram 4349, Bangladesh</span>
                        </li>
                        <li>
                            <i class="fas fa-envelope"></i>
                            <a href="mailto:ieeecuetsbofficial@cuet.ac.bd">ieeecuetsbofficial@cuet.ac.bd</a>
                        </li>
                        <li>
                            <i class="fas fa-globe"></i>
                            <a href="https://www.ieee.org" target="_blank">www.ieee.org</a>
                        </li>
                    </ul>
                    <!-- Social Media -->
                    <div class="footer-social">
                        <a href="https://www.facebook.com/ieeecuetsb" target="_blank" aria-label="Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://www.instagram.com/ieeesbcuet/" target="_blank" aria-label="Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://www.linkedin.com/company/ieee-cuet-student-branch/" target="_blank" aria-label="LinkedIn">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="https://www.youtube.com/@ieeecuetsb" target="_blank" aria-label="YouTube">
                            <i class="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <p>&copy; 2025 IEEE CUET Student Branch. All Rights Reserved.</p>
                <p class="footer-credit">Designed &amp; Developed by IEEE CUET SB Web Management Team</p>
            </div>
        </div>`;

    function render() {
        const host = document.getElementById('contact') ||
            document.querySelector('footer.site-footer');
        if (!host || host.dataset.siteFooterReady === 'true') return;

        host.dataset.siteFooterReady = 'true';
        host.innerHTML = FOOTER_HTML;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render, { once: true });
    } else {
        render();
    }
})();
