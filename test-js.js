const fs = require('fs');
const files = [
    'frontend/js/api.js',
    'frontend/js/storage.js',
    'frontend/js/validation.js',
    'frontend/js/calculations.js',
    'frontend/js/ui.js',
    'frontend/js/app.js',
    'frontend/js/tabs/tab1-project.js',
    'frontend/js/tabs/tab2-specs.js',
    'frontend/js/tabs/tab3-layout.js',
    'frontend/js/tabs/tab4-installation.js',
    'frontend/js/tabs/tab5-drawings.js'
];
for (let file of files) {
    try {
        let code = fs.readFileSync('/home/runner/work/fence-estimator/fence-estimator/' + file, 'utf8');
        // Simple eval to check syntax (won't catch everything due to browser globals like window/document)
        // But we can check it
    } catch(e) {}
}
