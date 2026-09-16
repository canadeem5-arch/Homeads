/**
 * HomeAds - Security Script
 * Prevents casual scraping, context menu, developer tools, and text selection.
 */

(function() {
  // Disable Right-Click (Context Menu)
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  // Disable DevTools shortcuts & View Source
  document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
    }
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
    }
    // Ctrl+S (Save)
    if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
    }
  });

  // Disable Text Selection globally via JS as a fallback
  document.addEventListener('selectstart', function(e) {
    // Allow selection in input fields and textareas
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  });

  // Disable Dragging of Images
  document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });
})();
