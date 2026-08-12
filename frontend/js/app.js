        let currentStep = 1;

        function goToLogin() {
            document.getElementById('landingPage').style.display = 'none';
            document.getElementById('loginScreen').style.display = 'flex';
        }

        function goToLanding() {
            document.getElementById('landingPage').style.display = 'flex';
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('dashboardScreen').style.display = 'none';
        }

        function loginUser(e) {
            e.preventDefault();
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('dashboardScreen').style.display = 'block';
            document.getElementById('landingPage').style.display = 'none';
        }

        function demoMode() {
            document.getElementById('landingPage').style.display = 'none';
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('dashboardScreen').style.display = 'block';
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                goToLanding();
                currentStep = 1;
            }
        }

        function switchTab(tabName) {
            // Hide all tabs
            const tabs = document.querySelectorAll('[id$="-tab"]');
            tabs.forEach(tab => tab.style.display = 'none');

            // Deactivate all nav items
            document.querySelectorAll('.tab-item').forEach(item => item.classList.remove('active'));

            // Show selected tab
            document.getElementById(tabName + '-tab').style.display = 'block';

            // Activate selected nav item
            event.target.classList.add('active');
        }

        function selectOption(element, type, value) {
            const siblings = element.parentElement.querySelectorAll('.option-btn');
            siblings.forEach(btn => btn.classList.remove('selected'));
            element.classList.add('selected');
        }

        function nextStep() {
            if (currentStep < 5) {
                document.getElementById('step' + currentStep).classList.remove('active');
                currentStep++;
                document.getElementById('step' + currentStep).classList.add('active');
                updateProgress();
            }
        }

        function previousStep() {
            if (currentStep > 1) {
                document.getElementById('step' + currentStep).classList.remove('active');
                currentStep--;
                document.getElementById('step' + currentStep).classList.add('active');
                updateProgress();
            }
        }

        function updateProgress() {
            document.getElementById('stepCounter').textContent = 'Step ' + currentStep + ' of 5';
            document.getElementById('btnBack').style.display = currentStep === 1 ? 'none' : 'block';
            document.getElementById('btnNext').textContent = currentStep === 5 ? 'Generate ✓' : 'Next →';
        }

        function generatePDF() {
            alert('📄 Estimate PDF generated and email sent to customer!');
        }

        function viewEstimate() {
            alert('📄 Viewing estimate details...');
        }

        // Initialize
        updateProgress();
    </script>
