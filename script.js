// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Test Cases Data
    const testCasesData = [
        {
            id: "TC_01",
            description: "Valid login",
            steps: "1. Open login page 2. Enter valid username 3. Enter valid password 4. Click login",
            expected: "User successfully logged in and redirected to dashboard",
            status: "Not Executed"
        },
        {
            id: "TC_02",
            description: "Invalid login",
            steps: "1. Open login page 2. Enter invalid username/password 3. Click login",
            expected: "Error message displayed: 'Invalid credentials'",
            status: "Not Executed"
        },
        {
            id: "TC_03",
            description: "Empty fields",
            steps: "1. Open login page 2. Leave username and password empty 3. Click login",
            expected: "Validation message displayed: 'Fields cannot be empty'",
            status: "Not Executed"
        },
        {
            id: "TC_04",
            description: "SQL Injection (basic)",
            steps: "1. Open login page 2. Enter 'OR' 1' = '1' in username field 3. Enter any password 4. Click login",
            expected: "Login should fail; system must prevent SQL injection and show error",
            status: "Not Executed"
        }
    ];

    // DOM Elements
    const testCasesBody = document.getElementById("testCasesBody");
    const simUsername = document.getElementById("simUsername");
    const simPassword = document.getElementById("simPassword");
    const simLoginBtn = document.getElementById("simLoginBtn");
    const simMessageArea = document.getElementById("simMessageArea");
    const resetAllBtn = document.getElementById("resetAllBtn");

    // Helper Functions
    function setSimulatorMessage(msg, type = "info") {
        const colors = {
            success: "#1f7840",
            error: "#bc5a3c",
            warning: "#c97e2a",
            info: "#2c6b8f"
        };
        simMessageArea.innerHTML = `<div style="color: ${colors[type]}; font-weight: 500;">${msg}</div>`;
    }

    function updateStats() {
        const executedCount = testCasesData.filter(tc => tc.status === "Executed").length;
        const total = testCasesData.length;
        const statsBadge = document.getElementById("statsBadge");
        if (statsBadge) {
            statsBadge.textContent = `${executedCount}/${total} executed`;
        }
    }

    // Core Login Validation
    function validateLogin() {
        const username = simUsername.value.trim();
        const password = simPassword.value;
        const validUsername = "admin@testflow.com";
        const validPassword = "SecurePass123";
        
        // Check for empty fields
        if (username === "" || password === "") {
            return { success: false, message: "Fields cannot be empty", type: "warning" };
        }
        
        // Check for SQL injection patterns
        const sqlPatterns = [/'/, /OR\s+'\d+'\s*=\s*'\d/, /--/, /;/];
        const isSqlAttack = sqlPatterns.some(pattern => pattern.test(username));
        
        if (isSqlAttack) {
            return { success: false, message: "Invalid credentials", type: "error", securityBlock: true };
        }
        
        // Check valid credentials
        if (username === validUsername && password === validPassword) {
            return { success: true, message: "Login successful! Redirecting to dashboard...", type: "success" };
        } else {
            return { success: false, message: "Invalid credentials", type: "error" };
        }
    }

    // Manual login handler
    function onManualLogin() {
        console.log('Login button clicked');
        const result = validateLogin();
        setSimulatorMessage(result.message, result.type);
        if (result.success) {
            // Simulate redirect
            setTimeout(() => {
                setSimulatorMessage("✅ Welcome to Dashboard!", "success");
            }, 1000);
        }
    }

    // Execute a specific test case
    async function executeTestCase(testCase, index) {
        setSimulatorMessage(`🔧 Running ${testCase.id}: ${testCase.description}...`, "info");
        
        // Clear previous values
        simUsername.value = "";
        simPassword.value = "";
        
        // Small delay for UI update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        switch(testCase.id) {
            case "TC_01": // Valid login
                simUsername.value = "admin@testflow.com";
                simPassword.value = "SecurePass123";
                await new Promise(resolve => setTimeout(resolve, 200));
                const result1 = validateLogin();
                setSimulatorMessage(`[${testCase.id}] ${result1.message}`, result1.type);
                if (result1.success) {
                    testCasesData[index].status = "Executed";
                    setSimulatorMessage(`[${testCase.id}] ✅ PASSED: Valid login successful`, "success");
                } else {
                    testCasesData[index].status = "Not Executed";
                    setSimulatorMessage(`[${testCase.id}] ❌ FAILED: Expected valid login but got error`, "error");
                }
                break;
                
            case "TC_02": // Invalid login
                simUsername.value = "wronguser@fake.com";
                simPassword.value = "wrongPass!";
                await new Promise(resolve => setTimeout(resolve, 200));
                const result2 = validateLogin();
                setSimulatorMessage(`[${testCase.id}] ${result2.message}`, result2.type);
                if (!result2.success && result2.message === "Invalid credentials") {
                    testCasesData[index].status = "Executed";
                    setSimulatorMessage(`[${testCase.id}] ✅ PASSED: Invalid credentials correctly rejected`, "success");
                } else {
                    testCasesData[index].status = "Not Executed";
                    setSimulatorMessage(`[${testCase.id}] ❌ FAILED: Expected 'Invalid credentials' message`, "error");
                }
                break;
                
            case "TC_03": // Empty fields
                simUsername.value = "";
                simPassword.value = "";
                await new Promise(resolve => setTimeout(resolve, 200));
                const result3 = validateLogin();
                setSimulatorMessage(`[${testCase.id}] ${result3.message}`, result3.type);
                if (!result3.success && result3.message === "Fields cannot be empty") {
                    testCasesData[index].status = "Executed";
                    setSimulatorMessage(`[${testCase.id}] ✅ PASSED: Empty fields validation works`, "success");
                } else {
                    testCasesData[index].status = "Not Executed";
                    setSimulatorMessage(`[${testCase.id}] ❌ FAILED: Expected empty fields validation`, "error");
                }
                break;
                
            case "TC_04": // SQL Injection
                simUsername.value = "' OR '1' = '1";
                simPassword.value = "anything";
                await new Promise(resolve => setTimeout(resolve, 200));
                const result4 = validateLogin();
                setSimulatorMessage(`[${testCase.id}] ${result4.message}`, result4.type);
                if (!result4.success && result4.message === "Invalid credentials") {
                    testCasesData[index].status = "Executed";
                    setSimulatorMessage(`[${testCase.id}] ✅ PASSED: SQL injection blocked, login failed`, "success");
                } else {
                    testCasesData[index].status = "Not Executed";
                    setSimulatorMessage(`[${testCase.id}] ❌ FAILED: SQL injection not properly blocked`, "error");
                }
                break;
        }
        
        // Re-render table to update status
        renderTable();
    }

    // Render the test cases table
    function renderTable() {
        if (!testCasesBody) {
            console.error('testCasesBody element not found');
            return;
        }
        
        testCasesBody.innerHTML = "";
        
        testCasesData.forEach((tc, index) => {
            const row = document.createElement("tr");
            
            // ID
            const tdId = document.createElement("td");
            tdId.textContent = tc.id;
            tdId.style.fontWeight = "600";
            row.appendChild(tdId);
            
            // Description
            const tdDesc = document.createElement("td");
            tdDesc.textContent = tc.description;
            row.appendChild(tdDesc);
            
            // Steps
            const tdSteps = document.createElement("td");
            tdSteps.textContent = tc.steps.substring(0, 70) + (tc.steps.length > 70 ? "..." : "");
            tdSteps.title = tc.steps;
            row.appendChild(tdSteps);
            
            // Expected Result
            const tdExpected = document.createElement("td");
            tdExpected.textContent = tc.expected;
            row.appendChild(tdExpected);
            
            // Status
            const tdStatus = document.createElement("td");
            const statusSpan = document.createElement("span");
            statusSpan.className = `status-badge ${tc.status === "Executed" ? "status-executed" : "status-not-executed"}`;
            statusSpan.textContent = tc.status;
            tdStatus.appendChild(statusSpan);
            row.appendChild(tdStatus);
            
            // Action Button
            const tdAction = document.createElement("td");
            const runBtn = document.createElement("button");
            runBtn.textContent = "▶ Run Test";
            runBtn.className = "run-test-btn";
            runBtn.onclick = async function() {
                runBtn.disabled = true;
                runBtn.textContent = "⏳ Running...";
                await executeTestCase(tc, index);
                runBtn.disabled = false;
                runBtn.textContent = "▶ Run Test";
            };
            tdAction.appendChild(runBtn);
            row.appendChild(tdAction);
            
            testCasesBody.appendChild(row);
        });
        
        updateStats();
    }

    // Reset all tests
    function resetAllTests() {
        testCasesData.forEach(tc => {
            tc.status = "Not Executed";
        });
        simUsername.value = "";
        simPassword.value = "";
        setSimulatorMessage("🔄 All tests reset to 'Not Executed'", "info");
        renderTable();
    }

    // Event Listeners
    if (simLoginBtn) {
        simLoginBtn.addEventListener("click", onManualLogin);
        console.log('Login button listener attached');
    } else {
        console.error('Login button not found');
    }
    
    if (resetAllBtn) {
        resetAllBtn.addEventListener("click", resetAllTests);
    }

    // Initialize
    renderTable();
    setSimulatorMessage("Ready. Click 'Run Test' on any test case or try manual login.", "info");
});