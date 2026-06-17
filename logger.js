// ========================================================
// THE LOGGING SYSTEM MODULE
// ========================================================
const Logger = {
    STORAGE_KEY: "app_system_logs",

    // Main internal logging function
    log(level, message) {
        const timestamp = new Date().toISOString();
        const logEntry = { timestamp, level, message };

        // 1. Save log entry to LocalStorage for persistence
        this.saveToStorage(logEntry);

        // 2. Print securely to browser developer tools
        this.printToDevTools(logEntry);

        // 3. Render directly onto our HTML page terminal stream
        this.renderToUI(logEntry);
    },

    // Shortcuts for explicit log levels
    info(msg) { this.log("INFO", msg); },
    warn(msg) { this.log("WARN", msg); },
    error(msg) { this.log("ERROR", msg); },

    saveToStorage(entry) {
        let currentLogs = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
        currentLogs.push(entry);
        
        // Keep logs clean by only keeping the last 50 entries
        if (currentLogs.length > 50) currentLogs.shift();
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentLogs));
    },

    printToDevTools(entry) {
        const formattedMsg = `[${entry.timestamp}] [${entry.level}]: ${entry.message}`;
        if (entry.level === "ERROR") console.error(formattedMsg);
        else if (entry.level === "WARN") console.warn(formattedMsg);
        else console.log(formattedMsg);
    },

    renderToUI(entry) {
        const terminal = document.getElementById('terminal');
        const logLine = document.createElement('div');
        
        // Apply matching CSS styles depending on severity
        if (entry.level === "INFO") logLine.className = "log-info";
        else if (entry.level === "WARN") logLine.className = "log-warn";
        else if (entry.level === "ERROR") logLine.className = "log-error";
        else logLine.className = "log-system";

        logLine.textContent = `[${entry.timestamp.split('T')[1].slice(0, 8)}] [${entry.level}]: ${entry.message}`;
        
        terminal.appendChild(logLine);
        terminal.scrollTop = terminal.scrollHeight; // Auto-scroll downward
    },

    loadSavedLogs() {
        const terminal = document.getElementById('terminal');
        terminal.innerHTML = '<div class="log-system">[System]: Retrieving history files...</div>';
        
        const savedLogs = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
        savedLogs.forEach(entry => this.renderToUI(entry));
    },

    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
        document.getElementById('terminal').innerHTML = '<div class="log-system">[System]: Log history wiped clean.</div>';
    }
};

// ========================================================
// UI EVENT CONTROLLER LOGIC
// ========================================================

// DOM Targets
const infoBtn = document.getElementById('infoBtn');
const warnBtn = document.getElementById('warnBtn');
const errorBtn = document.getElementById('errorBtn');
const clearBtn = document.getElementById('clearBtn');

// Simulation Triggers
infoBtn.addEventListener('click', () => Logger.info("User requested system state refresh. Fetching database records."));
warnBtn.addEventListener('click', () => Logger.warn("API response latency is high (1.4s). Gateway bottleneck detected."));
errorBtn.addEventListener('click', () => Logger.error("Failed to authenticate session token. Connection rejected."));

clearBtn.addEventListener('click', () => Logger.clearAll());

// Boot up sequence: Load old persistent logs when the page loads
document.addEventListener('DOMContentLoaded', () => {
    Logger.loadSavedLogs();
});