// AI Content Generator for Pre-lander Templates
// This function generates AI content using existing form data and opens the template

async function generateAndOpenTemplate() {
    console.log('=== generateAndOpenTemplate STARTED ===');
    
    // Get existing form data
    const productName = document.getElementById('productName')?.value?.trim();
    const deepResearch = document.getElementById('deepResearch')?.value?.trim();

    console.log('Form data retrieved:', { productName, deepResearch });

    // Validation
    if (!productName) {
        alert('Please enter a product name in the form above');
        return;
    }

    if (!deepResearch) {
        alert('Please enter deep research data in the form above');
        return;
    }

    // Find the Try button to show loading state
    const tryButton = document.querySelector('.btn-info');
    const originalHTML = tryButton.innerHTML;

    try {
        // Show loading state
        tryButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        tryButton.disabled = true;
        
        console.log('Starting AI generation with:', { productName, deepResearch });
        
        // Use the full psychology prompt to generate all content
        const fullPrompt = constructPsychologyPrompt(productName, deepResearch);

        console.log('Calling AI API with prompt length:', fullPrompt.length);
        const generatedContent = await callAIAPI(fullPrompt);
        console.log('AI API response received, length:', generatedContent.length);
        
        // Parse and store the generated content
        const contentSections = parseGeneratedContent(generatedContent);
        console.log('Content sections parsed:', Object.keys(contentSections).length, 'sections');
        console.log('Section keys:', Object.keys(contentSections));
        
        if (Object.keys(contentSections).length === 0) {
            throw new Error('No content sections were parsed from AI response');
        }
        
        localStorage.setItem('aiGeneratedContent', JSON.stringify(contentSections));
        console.log('Content stored in localStorage');
        
        // Open template with generated content
        window.open('template-nova.html', '_blank');
        
    } catch (error) {
        console.error('Error generating AI content:', error);
        alert('Failed to generate AI content: ' + error.message);
    } finally {
        // Restore button state
        tryButton.innerHTML = originalHTML;
        tryButton.disabled = false;
    }
}

function constructPsychologyPrompt(productName, deepResearch) {
    return `You are an expert copywriter specializing in high-converting pre-lander content with deep psychology and persuasion expertise. 

PRODUCT: ${productName}
DEEP RESEARCH: ${deepResearch}

Create a complete pre-lander content that triggers targeted emotional responses and optimizes conversion. Use advanced psychological triggers including:
- Social proof and authority
- Scarcity and urgency
- Pain point amplification
- Desire amplification
- Fear of missing out (FOMO)
- Reciprocity and commitment
- Cognitive biases exploitation

Generate content for these specific sections (use EXACT section names as headers):

[TITLE]
Create a compelling, emotion-driven headline that immediately captures attention and creates desire. Use power words and psychological triggers.

[SUBTITLE]
A supporting subtitle that amplifies the main promise and creates urgency.

[BENEFIT_1_HEADING]
First major benefit heading - focus on the primary transformation

[BENEFIT_1_TEXT]
Detailed description of the first benefit with emotional language and specific outcomes

[BENEFIT_2_HEADING]
Second major benefit heading - focus on social/lifestyle improvement

[BENEFIT_2_TEXT]
Detailed description of the second benefit with social proof elements

[BENEFIT_2_TEXT_NEXT]
Additional compelling text that extends the second benefit with more specific details and emotional triggers

[INGREDIENTS_LIST]
Comprehensive list of key ingredients with their specific benefits and properties. Format as detailed descriptions of each ingredient and what it does.

[BENEFIT_3_HEADING]
Third major benefit heading - focus on long-term value

[PRODUCT_VARIANTS]
Available product variants, colors, sizes, or options. Present in an appealing way that shows variety and choice.

[BENEFIT_3_TEXT]
Detailed description of the third benefit with authority and credibility

[BENEFIT_4_HEADING]
Fourth major benefit heading - focus on convenience/ease

[BENEFIT_4_TEXT]
Detailed description of the fourth benefit with simplicity emphasis

[BENEFIT_5_HEADING]
Fifth major benefit heading - focus on additional value/advantage

[BENEFIT_5_TEXT]
Detailed description of the fifth benefit with unique selling proposition

[SOCIAL_PROOF_HEADING]
Social proof section heading to introduce credibility

[FAQ_Q1]
First FAQ question - addressing main objection

[FAQ_Q2]
Second FAQ question - about usage/application

[FAQ_Q3]
Third FAQ question - about results/timeline

[FAQ_Q4]
Fourth FAQ question - about guarantee/risk

[FAQ_Q5]
Fifth FAQ question - about ingredients/components

[CTA_PRIMARY]
Main call-to-action button text - action-oriented and urgent

[CTA_SECONDARY]
Secondary call-to-action text - softer approach

[GUARANTEE_HEADING]
Risk-reversal guarantee heading

[GUARANTEE_DESCRIPTION]
Detailed guarantee description that removes purchase anxiety

[SOCIAL_PROOF_TEXT]
Social proof statement with numbers and credibility

[TESTIMONIAL_HEADING]
Main testimonials section heading

[TESTIMONIAL_INTRO]
Introduction text for the testimonials section

[TESTIMONIAL_IMAGES_PLACEHOLDER]
Heading for customer testimonial photos/images section

[TESTIMONIAL_1_NAME]
First testimonial author name

[TESTIMONIAL_1_TEXT]
First testimonial text - specific results and emotional transformation

[TESTIMONIAL_2_NAME]
Second testimonial author name

[TESTIMONIAL_2_TEXT]
Second testimonial text - different angle, social proof

[TESTIMONIAL_3_NAME]
Third testimonial author name

[TESTIMONIAL_3_TEXT]
Third testimonial text - authority and credibility focus

[FAQ_A1]
First FAQ answer - comprehensive objection handling

[FAQ_A2]
Second FAQ answer - detailed usage explanation

[FAQ_A3]
Third FAQ answer - realistic expectations with urgency

[FAQ_A4]
Fourth FAQ answer - risk reversal reinforcement

[FAQ_A5]
Fifth FAQ answer - quality and safety emphasis

[FAQ_Q6]
Sixth FAQ question - about shipping/delivery

[FAQ_A6]
Sixth FAQ answer - convenience and speed

[FAQ_Q7]
Seventh FAQ question - about pricing/value

[FAQ_A7]
Seventh FAQ answer - value justification and scarcity

[URGENCY_TEXT]
Scarcity/urgency text to create immediate action

[SCARCITY_WARNING]
Warning text about limited availability or time constraints

[AUTHENTICITY_MESSAGE]
Message about product authenticity and quality assurance

[SOCIAL_PROOF_STATS]
Statistical social proof with numbers and credibility metrics

[PRODUCT_BENEFITS_VERSION1]
List of 4 major product benefits in format: "Benefit 1 | Benefit 2 | Benefit 3 | Benefit 4"

[PROBLEMS_SOLVED]
List of 3 key problems this product solves in format: "Problem 1 | Problem 2 | Problem 3"

[FEATURES]
List of 5 main product features in format: "Feature 1 | Feature 2 | Feature 3 | Feature 4 | Feature 5"

[FAQ_QUESTION_1]
Most common customer question

[FAQ_ANSWER_1]
Detailed answer addressing concerns and building trust

[FAQ_QUESTION_2]
Second most important question

[FAQ_ANSWER_2]
Answer that overcomes objections

[FAQ_QUESTION_3]
Third key question

[FAQ_ANSWER_3]
Answer that reinforces value

[GUARANTEE_TITLE]
Risk-reversal guarantee headline

[GUARANTEE_TEXT]
Detailed guarantee that removes purchase anxiety

IMPORTANT: 
- Use the EXACT section names in brackets as shown above
- Make each section psychologically compelling and conversion-focused
- Incorporate the deep research insights naturally
- Use emotional triggers and power words throughout
- Ensure consistency in tone and messaging across all sections
- Focus on benefits, not features
- Create a sense of urgency and scarcity
- Address objections proactively
- Pay special attention to the BENEFIT_2_TEXT_NEXT section as an extension of BENEFIT_2_TEXT
- Make INGREDIENTS_LIST detailed and compelling with specific benefits for each ingredient
- Ensure PRODUCT_VARIANTS shows appealing choices and options

Generate compelling, conversion-optimized content for each section now:`;
}

window.callAIAPI = async function(prompt) {
    console.log('[DEBUG] Appel au backend:', 'http://localhost:3000/api/generate');
    
    try {
        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        console.log('[DEBUG] Réponse reçue - Status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.content || data.response || data.choices?.[0]?.message?.content || data;
        
    } catch (error) {
        console.error('[DEBUG] Erreur lors de l\'appel API:', error);
        throw error;
    }
};

function parseGeneratedContent(content) {
    console.log('Raw AI response length:', content.length);
    console.log('Raw AI response preview:', content.substring(0, 500) + '...');
    
    const sections = {};
    const sectionRegex = /\[([^\]]+)\]\s*\n([^[]*?)(?=\n\[|$)/gs;
    let match;
    let sectionCount = 0;

    while ((match = sectionRegex.exec(content)) !== null) {
        const sectionName = match[1].trim();
        const sectionContent = match[2].trim();
        sections[sectionName] = sectionContent;
        sectionCount++;
        console.log(`Parsed section ${sectionCount}: [${sectionName}] - ${sectionContent.length} chars`);
    }
    
    console.log(`Total sections parsed: ${sectionCount}`);
    console.log('Expected sections: TITLE, PRODUCT_BENEFITS_VERSION1, PROBLEMS_SOLVED, etc.');
    
    // Check for critical missing sections
    const criticalSections = ['TITLE', 'PRODUCT_BENEFITS_VERSION1', 'PROBLEMS_SOLVED', 'FEATURES'];
    const missingSections = criticalSections.filter(section => !sections[section]);
    if (missingSections.length > 0) {
        console.warn('Missing critical sections:', missingSections);
    }

    return sections;
}

// Test function to check API connectivity
async function testAPIConnection() {
    try {
        console.log('Testing API connection...');
        const response = await fetch('/api/status');
        console.log('Status response:', response.status, response.ok);
        
        if (response.ok) {
            const data = await response.json();
            console.log('API Status:', data);
            alert('API connection successful: ' + data.message);
        } else {
            console.error('API status check failed:', response.status);
            alert('API connection failed with status: ' + response.status);
        }
    } catch (error) {
        console.error('API connection test error:', error);
        alert('API connection error: ' + error.message);
    }
}

// Make test function available globally for debugging
window.testAPIConnection = testAPIConnection;
