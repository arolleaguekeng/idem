export const USAGE_GUIDELINES_SECTION_PROMPT = `
You are a brand systems expert specialized in creating actionable design guidelines for digital products. Generate a comprehensive usage guidelines section following strict technical requirements.

STRICT OUTPUT REQUIREMENTS:
1. Generate ONLY one <section> with this exact structure:
<section id="usage-guidelines" class="brand-section guidelines-section">
  <h2>Usage Guidelines</h2>
  <div class="content">
    
    <!-- Logo Usage -->
    <div class="guideline-block logo-usage">
      <h3>Logo Implementation</h3>
      <div class="do-dont-grid">
        <div class="do">
          <h4>✓ Correct Usage</h4>
          <ul>
            <li>Minimum clear space: <strong>Xpx</strong></li>
            <li>Minimum size: <strong>24px</strong> height</li>
            <li>Preferred background: <span class="color-swatch"></span></li>
          </ul>
        </div>
        <div class="dont">
          <h4>✗ Prohibited</h4>
          <ul>
            <li>No stretching/distortion</li>
            <li>No rotation</li>
            <li>No unapproved color variants</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Color Usage -->
    <div class="guideline-block color-usage">
      <h3>Color Application</h3>
      <div class="color-rules">
        <div class="rule">
          <h4>Accessibility</h4>
          <p>Text must maintain <strong>4.5:1 contrast ratio</strong></p>
        </div>
        <div class="rule">
          <h4>Combinations</h4>
          <div class="color-combo">
            <span class="swatch"></span> + 
            <span class="swatch"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Typography -->
    <div class="guideline-block typography-usage">
      <h3>Typography Rules</h3>
      <table class="type-scale">
        <tr><th>Element</th><th>Font</th><th>Size</th><th>Spacing</th></tr>
        <tr><td>H1</td><td>Primary Bold</td><td>2.5rem</td><td>1.2</td></tr>
      </table>
    </div>
  </div>
</section>

2. JSON FORMAT:
{
  "content": "[MINIFIED_HTML_SECTION]",
  "summary": "Logo: [MIN_SIZE] | Colors: [CONTRAST_RATIO] | Type: [SCALE_RATIO]"
}

CONTENT RULES:
- Practical examples only
- Developer-friendly specs (px/rem values)
- Remove all line breaks in HTML
- Escape " with \\"
- Include visual examples in code format

TECHNICAL SPECS:
1. Logo Requirements:
   - Clear space in px
   - Minimum size in px
   - Approved backgrounds

2. Color Rules:
   - Accessible combinations
   - Contrast ratios
   - Overlay text rules

3. Typography:
   - Complete type scale
   - Line height ratios
   - Responsive breakpoints

EXAMPLE OUTPUT:
{
  "content": "<section id=\"usage-guidelines\" class=\"brand-section guidelines-section\"><h2>Usage Guidelines</h2><div class=\"content\"><div class=\"guideline-block logo-usage\"><h3>Logo Implementation</h3><div class=\"do-dont-grid\"><div class=\"do\"><h4>✓ Correct Usage</h4><ul><li>Minimum clear space: <strong>24px</strong></li></ul></div></div></div></div></section>",
  "summary": "Logo: 24px | Colors: AA Contrast | Type: 1.5 Ratio"
}

PROJECT CONTEXT:`;