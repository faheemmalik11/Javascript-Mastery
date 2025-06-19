/**
 * UI Controller - Gère les interactions utilisateur de l'interface
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des éléments du formulaire
    const productForm = document.getElementById('productForm');
    const resultsSection = document.getElementById('resultsSection');
    
    // Notre backend gère la clé API, pas besoin de l'interface de saisie
    console.log('Application initialisée avec le backend sécurisé');
    
    // Loading bar functionality
    const loadingContainer = document.getElementById('loadingContainer');
    const progressFill = document.getElementById('progressFill');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const steps = [
        document.getElementById('step1'),
        document.getElementById('step2'),
        document.getElementById('step3'),
        document.getElementById('step4')
    ];
    
    // Function to update loading progress
    function updateLoadingProgress(percent, currentStep) {
        progressFill.style.width = percent + '%';
        loadingPercentage.textContent = percent + '%';
        
        // Update steps
        steps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    // Handle form submission
    productForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = productForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        loadingContainer.style.display = 'block';
        
        // Get form data
        const formData = new FormData(productForm);
        const productData = {
            productName: formData.get('productName'),
            deepResearch: formData.get('deepResearch'),
            competitorUrl: formData.get('competitorUrl'),
            // Ces champs seront extraits automatiquement de la deep research
            productDescription: formData.get('productDescription') || '',
            targetAudience: formData.get('targetAudience') || '',
            productFeatures: formData.get('productFeatures') || '',
            problemsSolved: formData.get('problemsSolved') || ''
        };
        
        try {
            // Step 1: Initializing and data extraction (0-20%)
            updateLoadingProgress(5, 0);
            
            // Simulate step progress
            const animateProgress = (start, end, duration, step) => {
                const startTime = Date.now();
                const animate = () => {
                    const now = Date.now();
                    const timeElapsed = now - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const currentProgress = start + (end - start) * progress;
                    
                    updateLoadingProgress(Math.floor(currentProgress), step);
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                
                animate();
                return new Promise(resolve => setTimeout(resolve, duration));
            };
            
            // Step 1: Analyzing data
            await animateProgress(5, 20, 2000, 0);
            
            // Step 2: Creating psychographic profile (20-50%)
            await animateProgress(20, 50, 5000, 1);
            
            // Generate content with two versions for each element
            // This is where the actual API calls are made
            updateLoadingProgress(50, 2); // Move to step 3
            const content = await generateAllContent(productData);
            
            // Step 3: Generating marketing content (50-80%)
            await animateProgress(50, 80, 3000, 2);
            
            // Step 4: Finalizing results (80-100%)
            await animateProgress(80, 100, 1000, 3);
            
            // Store the content in global variable for version selection
            window.generatedContent = content;
            
            // Short delay to show 100% completion
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Afficher l'analyse psychographique
            document.getElementById('psychographicProfile').innerHTML = content.psychographicProfile.version1;
            document.getElementById('productTitle').innerHTML = content.productTitle.version1;
            document.getElementById('productBenefits').innerHTML = content.productBenefits.version1;
            document.getElementById('howItWorks').innerHTML = content.howItWorks.version1;
            document.getElementById('emotionalBenefits').innerHTML = content.emotionalBenefits.version1;
            document.getElementById('useCases').innerHTML = content.useCases.version1;
            document.getElementById('characteristics').innerHTML = content.characteristics.version1;
            document.getElementById('competitiveAdvantages').innerHTML = content.competitiveAdvantages.version1;
            document.getElementById('customerReviews').innerHTML = content.customerReviews.version1;
            document.getElementById('faq').innerHTML = content.faq.version1;
            
            // Show results section
            resultsSection.style.display = 'block';
            
            // Re-enable submit button
            submitBtn.disabled = false;
            
        } catch (error) {
            console.error('Error generating content:', error);
            alert(`Une erreur est survenue lors de la génération du contenu: ${error.message || error}. Vérifiez la console pour plus de détails.`);
        } finally {
            // Hide loading container
            loadingContainer.style.display = 'none';
            
            // Reset button state
            submitBtn.disabled = false;
        }
    });
});
