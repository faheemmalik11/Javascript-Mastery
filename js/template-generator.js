/**
 * Template Generator - Gère la génération du template Shopify
 */

document.addEventListener('DOMContentLoaded', function() {
    // Template generation button event handling
    const generateTemplateBtn = document.getElementById('generateTemplateBtn');
    const templateModal = document.getElementById('templateModal');
    const closeBtn = document.querySelector('.close');
    const templateContent = document.getElementById('templateContent');
    
    if (generateTemplateBtn) {
        generateTemplateBtn.addEventListener('click', function() {
            // Récupérer le contenu généré
            const productName = document.getElementById('productName').value;
            
            // Récupérer les avantages produits (version1 uniquement)
            let productBenefits = [];
            if (window.generatedContent && window.generatedContent.productBenefits) {
                const benefitsText = window.generatedContent.productBenefits.version1;
                
                // Extraire les avantages du texte formaté
                const benefitsRegex = /<strong>(.*?)<\/strong>/g;
                const matches = [...benefitsText.matchAll(benefitsRegex)];
                
                // Récupérer jusqu'à 4 avantages
                for (let i = 0; i < Math.min(4, matches.length); i++) {
                    if (matches[i] && matches[i][1]) {
                        productBenefits.push(matches[i][1]);
                    }
                }
                
                // Si aucun avantage n'est trouvé, utiliser une valeur par défaut
                if (productBenefits.length === 0) {
                    console.error("Aucun avantage trouvé dans productBenefits.version1");
                    productBenefits = ["Bénéfice non spécifié", "Bénéfice non spécifié", "Bénéfice non spécifié", "Bénéfice non spécifié"];
                }
                
                // S'assurer qu'il y a exactement 4 avantages
                while (productBenefits.length < 4) {
                    productBenefits.push("Bénéfice non spécifié");
                }
            } else {
                console.error("Contenu généré non disponible");
                productBenefits = ["Bénéfice non spécifié", "Bénéfice non spécifié", "Bénéfice non spécifié", "Bénéfice non spécifié"];
            }
            
            // Générer le template Shopify
            const template = generateShopifyTemplate(productName, productBenefits);
            
            // Afficher le template dans la modal
            templateContent.textContent = template;
            
            // Afficher la modal
            templateModal.style.display = 'block';
        });
    }
    
    // Fermer la modal quand on clique sur le X
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            templateModal.style.display = 'none';
        });
    }
    
    // Fermer la modal quand on clique en dehors
    window.addEventListener('click', function(event) {
        if (event.target === templateModal) {
            templateModal.style.display = 'none';
        }
    });
});

// Fonction pour générer le template Shopify
function generateShopifyTemplate(productName, benefits) {
    return `<!-- Template Shopify pour ${productName} -->
<div class="product-container">
  <div class="product-header">
    <h1 class="product-title">${productName}</h1>
  </div>
  
  <div class="product-benefits">
    <h2 class="benefits-title">Principaux avantages</h2>
    <div class="benefits-grid">
      <div class="benefit-item">
        <div class="benefit-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h3 class="benefit-title">${benefits[0]}</h3>
      </div>
      
      <div class="benefit-item">
        <div class="benefit-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 class="benefit-title">${benefits[1]}</h3>
      </div>
      
      <div class="benefit-item">
        <div class="benefit-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
            <line x1="16" y1="8" x2="2" y2="22"></line>
            <line x1="17.5" y1="15" x2="9" y2="15"></line>
          </svg>
        </div>
        <h3 class="benefit-title">${benefits[2]}</h3>
      </div>
      
      <div class="benefit-item">
        <div class="benefit-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <h3 class="benefit-title">${benefits[3]}</h3>
      </div>
    </div>
  </div>
  
  <div class="product-cta">
    <button class="add-to-cart-button">Ajouter au panier</button>
    <button class="buy-now-button">Acheter maintenant</button>
  </div>
  
  <style>
    .product-container {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .product-title {
      font-size: 32px;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .benefits-title {
      font-size: 24px;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .benefit-item {
      display: flex;
      align-items: center;
      padding: 15px;
      border-radius: 8px;
      background-color: #f9f9f9;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .benefit-icon {
      margin-right: 15px;
      color: #4a90e2;
    }
    
    .benefit-title {
      font-size: 16px;
      margin: 0;
    }
    
    .product-cta {
      display: flex;
      justify-content: center;
      gap: 20px;
    }
    
    .add-to-cart-button, .buy-now-button {
      padding: 12px 24px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .add-to-cart-button {
      background-color: #ffffff;
      color: #4a90e2;
      border: 2px solid #4a90e2;
    }
    
    .buy-now-button {
      background-color: #4a90e2;
      color: white;
      border: 2px solid #4a90e2;
    }
    
    .add-to-cart-button:hover {
      background-color: #f0f8ff;
    }
    
    .buy-now-button:hover {
      background-color: #357abD;
    }
    
    @media (max-width: 768px) {
      .benefits-grid {
        grid-template-columns: 1fr;
      }
      
      .product-cta {
        flex-direction: column;
      }
    }
  </style>
</div>`;
}
