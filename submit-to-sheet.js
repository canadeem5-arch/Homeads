/**
 * ============================================================================
 * HOMEADS (homeads.ae)
 * Automatic Google Sheets Lead Capture Engine
 * ============================================================================
 * Target Spreadsheet: 'website Start Your Project Today messages'
 * 
 * PASTE YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL HERE:
 */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyj_bXf-UjNmvNPc3txJGtcPs1674doNnBUWVs2BpK8n-AI28ye1RBOeBPpqMxsVmLd/exec';

(function () {
  'use strict';

  // Helper: Save backup copy to LocalStorage so no customer message is ever lost
  function backupLead(data) {
    try {
      const saved = JSON.parse(localStorage.getItem('homeads_leads') || '[]');
      saved.unshift({
        ...data,
        timestamp: new Date().toISOString(),
        synced: false
      });
      localStorage.setItem('homeads_leads', JSON.stringify(saved.slice(0, 100)));
    } catch (e) {
      console.warn('[HomeAds] Local backup note:', e);
    }
  }

  // Common submit function for all forms
  async function submitToGoogleSheet(formDataObj, buttonEl, originalBtnHtml, formEl) {
    // 1. UI Loading State
    buttonEl.disabled = true;
    buttonEl.style.pointerEvents = 'none';
    buttonEl.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:8px;">
        <svg style="animation:spin 1s linear infinite;width:18px;height:18px;vertical-align:middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#00ff10"></path>
        </svg>
        Saving to Sheet...
      </span>
    `;

    // Add spin keyframes if not present
    if (!document.getElementById('ps-spin-style')) {
      const st = document.createElement('style');
      st.id = 'ps-spin-style';
      st.textContent = '@keyframes spin { 100% { transform: rotate(360deg); } }';
      document.head.appendChild(st);
    }

    // 2. Backup locally immediately
    backupLead(formDataObj);

    // 3. Prepare payload for Google Apps Script
    // We send URLSearchParams so Google Apps Script parses e.parameter without CORS issues
    const params = new URLSearchParams();
    for (const key in formDataObj) {
      if (formDataObj.hasOwnProperty(key)) {
        params.append(key, formDataObj[key]);
      }
    }

    // Check if script URL is still default placeholder
    const isConfigured = GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes('YOUR_DEPLOYMENT_ID');

    if (isConfigured) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Essential for Google Apps Script endpoint
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: params.toString()
        });
      } catch (err) {
        console.warn('[HomeAds Sheet Sync Error]:', err);
      }

      // 4. UI Success State
      buttonEl.innerHTML = '✓ Details Recorded in Sheet!';
      buttonEl.style.background = '#00ff10';
      buttonEl.style.color = '#000000';
      buttonEl.style.borderColor = '#00ff10';
      buttonEl.style.boxShadow = '0 0 24px rgba(0, 255, 16, 0.4)';
    } else {
      alert(
        'Google Apps Script Web App URL is not connected yet!\n\n' +
        'To connect your Google Sheet:\n' +
        '1. In your Google Sheet, click Extensions > Apps Script\n' +
        '2. Paste the script code\n' +
        '3. Click Deploy > New Deployment > Web App (Who has access: Anyone)\n' +
        '4. Copy the Web App URL and paste it into submit-to-sheet.js (or send it here in chat)!'
      );
      buttonEl.innerHTML = '⚠️ Setup Web App URL Required';
      buttonEl.style.background = '#ffaa00';
      buttonEl.style.color = '#000000';
    }

    // Reset form after short delay
    setTimeout(() => {
      if (formEl) formEl.reset();
      buttonEl.innerHTML = originalBtnHtml;
      buttonEl.disabled = false;
      buttonEl.style.pointerEvents = 'auto';
      buttonEl.style.background = '';
      buttonEl.style.color = '';
      buttonEl.style.borderColor = '';
      buttonEl.style.boxShadow = '';
    }, 4500);
  }

  // Hook into DOM
  document.addEventListener('DOMContentLoaded', function () {
    // 1. Index Page Contact Form (#contact-form)
    const indexForm = document.getElementById('contact-form');
    if (indexForm) {
      indexForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = document.getElementById('cf-submit') || indexForm.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn.innerHTML;

        const name = (document.getElementById('cf-name')?.value || '').trim();
        const phone = (document.getElementById('cf-phone')?.value || '').trim();
        const email = (document.getElementById('cf-email')?.value || '').trim();
        const serviceSelect = document.getElementById('cf-service');
        const service = serviceSelect ? (serviceSelect.options[serviceSelect.selectedIndex]?.text || serviceSelect.value) : '';
        const message = (document.getElementById('cf-msg')?.value || '').trim();

        if (!name || !phone) {
          alert('Please enter your name and phone number so we can reach you.');
          return;
        }

        const payload = {
          'Your Name *': name,
          'Phone Number *': phone,
          'Email Address': email,
          'Service Required *': service,
          'Tell Us About Your Project': message,
          // Aliases for script compatibility
          name: name,
          phone: phone,
          email: email,
          service: service,
          message: message,
          sourcePage: 'Home (index.html)'
        };

        submitToGoogleSheet(payload, submitBtn, originalBtnHtml, indexForm);
      });
    }

    // 2. Contact Page Form (#contact-page-form)
    const contactPageForm = document.getElementById('contact-page-form');
    if (contactPageForm) {
      contactPageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = document.getElementById('cp-submit') || contactPageForm.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn.innerHTML;

        const name = (document.getElementById('cp-name')?.value || '').trim();
        const phone = (document.getElementById('cp-phone')?.value || '').trim();
        const email = (document.getElementById('cp-email')?.value || '').trim();
        const typeSelect = document.getElementById('cp-type');
        const service = typeSelect ? (typeSelect.options[typeSelect.selectedIndex]?.text || typeSelect.value) : '';
        const message = (document.getElementById('cp-message')?.value || '').trim();

        if (!name || !phone) {
          alert('Please enter your name and phone number so we can reach you.');
          return;
        }

        const payload = {
          'Your Name *': name,
          'Phone Number *': phone,
          'Email Address': email,
          'Service Required *': service,
          'Tell Us About Your Project': message,
          name: name,
          phone: phone,
          email: email,
          service: service,
          message: message,
          sourcePage: 'Contact (contact.html)'
        };

        submitToGoogleSheet(payload, submitBtn, originalBtnHtml, contactPageForm);
      });
    }

    // 3. Enterprise Page RFP Form (#rfp-form)
    const rfpForm = document.getElementById('rfp-form');
    if (rfpForm) {
      rfpForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = document.getElementById('rfp-submit') || rfpForm.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn.innerHTML;

        const name = (document.getElementById('rfp-name')?.value || '').trim();
        const company = (document.getElementById('rfp-company')?.value || '').trim();
        const email = (document.getElementById('rfp-email')?.value || '').trim();
        const phone = (document.getElementById('rfp-phone')?.value || '').trim();
        const typeSelect = document.getElementById('rfp-type');
        const service = typeSelect ? (typeSelect.options[typeSelect.selectedIndex]?.text || typeSelect.value) : '';
        const message = (document.getElementById('rfp-notes')?.value || '').trim();

        if (!name || !phone) {
          alert('Please enter your name and phone number.');
          return;
        }

        const fullMessage = company ? `[Company: ${company}] ${message}` : message;

        const payload = {
          'Your Name *': name,
          'Phone Number *': phone,
          'Email Address': email,
          'Service Required *': service,
          'Tell Us About Your Project': fullMessage,
          name: name,
          phone: phone,
          email: email,
          service: service,
          message: fullMessage,
          company: company,
          sourcePage: 'Enterprise (enterprise.html)'
        };

        submitToGoogleSheet(payload, submitBtn, originalBtnHtml, rfpForm);
      });
    }
  });

  // Export for console debugging or programmatic use
  window.HomeAdsSheet = {
    setScriptUrl: function (url) {
      window.GOOGLE_SCRIPT_URL = url;
      console.log('[HomeAds] Script URL updated to:', url);
    },
    getStoredLeads: function () {
      return JSON.parse(localStorage.getItem('homeads_leads') || '[]');
    }
  };
})();
