/**
 * Tab Controller - Gère la navigation par onglets
 */

document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-pane');
    
    // Tab functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            const tabPane = document.getElementById(tabId);
            if (tabPane) {
                tabPane.classList.add('active');
                
                // Refresh content display when switching to specific tabs
                refreshTabContent(tabId);
            }
        });
    });
    
    // Function to refresh content display for specific tabs
    function refreshTabContent(tabId) {
        console.log('[TAB-CONTROLLER] Refreshing content for tab:', tabId);
        
        // Get stored content from localStorage
        const storedContent = localStorage.getItem('generatedContent');
        if (!storedContent) {
            console.log('[TAB-CONTROLLER] No stored content found');
            return;
        }
        
        let content;
        try {
            content = JSON.parse(storedContent);
        } catch (e) {
            console.error('[TAB-CONTROLLER] Error parsing stored content:', e);
            return;
        }
        
        // Refresh content based on tab
        switch (tabId) {
            case 'tab3': // Title tab
                if (content.productTitle && content.productTitle.version1) {
                    console.log('[TAB-CONTROLLER] Refreshing productTitle content');
                    const titleElement = document.getElementById('productTitle');
                    if (titleElement && window.formatProductTitleWithSelectors) {
                        const displayContent = { version1: content.productTitle.version1 };
                        titleElement.innerHTML = window.formatProductTitleWithSelectors('productTitle', displayContent);
                        console.log('[TAB-CONTROLLER] ProductTitle content refreshed');
                    }
                }
                break;
            // Add more cases for other tabs if needed
        }
    }
});
