const fs = require("fs");

class IdpSkipReporter {
  constructor(runner) {
    this.testSuite = null;
    
    // Listen only to 'pending' events (skipped tests)  
    runner.on("pending", (test) => {
      // Determine test suite from file path
      if (!this.testSuite) {
        if (test.file && test.file.includes("idp-edition")) {
          this.testSuite = "edition";
        } else if (test.file && test.file.includes("idp-translation")) {
          this.testSuite = "translation";
        }
      }
    });
    
    // Generate reports when all tests complete
    runner.on("end", () => {
      if (global.skipReasons && this.testSuite) {
        this.writeReports(this.testSuite);
      }
    });
  }
  
  writeReports(testSuite) {
    try {
      const stateFilePath = `test/leiden-js-idp-test-data/.idp-roundtrips-state-${testSuite}.json`;
      const reportBasePath = `test/reports/idp-skip-report-${testSuite}`;
      
      // Read existing state file for commit info
      let commitInfo = "unknown";
      if (fs.existsSync(stateFilePath)) {
        const stateData = JSON.parse(fs.readFileSync(stateFilePath, "utf8"));
        commitInfo = stateData.lastProcessedCommit || "unknown";
      }
      
      const timestamp = new Date().toISOString();
      
      // Generate JSON report
      const jsonReport = {
        idpDataCommit: commitInfo,
        timestamp: timestamp,
        skippedFiles: global.skipReasons
      };
      
      fs.writeFileSync(`${reportBasePath}.json`, JSON.stringify(jsonReport, null, 2));
      
      // Generate Markdown report
      fs.writeFileSync(`${reportBasePath}.md`, this.generateMarkdownReport(testSuite, commitInfo, timestamp, global.skipReasons));
      
      console.log(`\nSkip reports generated for ${testSuite}:`);
      console.log(`- ${reportBasePath}.json`);
      console.log(`- ${reportBasePath}.md`);
      console.log(`Total skipped files: ${Object.keys(global.skipReasons).length}`);
      
    } catch (error) {
      console.error("Error generating skip reports:", error);
    }
  }
  
  generateMarkdownReport(testSuite, commitInfo, timestamp, skipReasons) {
    let markdown = `# IDP Test Skip Report - ${testSuite.charAt(0).toUpperCase() + testSuite.slice(1)}\n\n`;
    
    // Create commit link if commit is known
    const commitLink = commitInfo !== "unknown" 
      ? `[\`${commitInfo}\`](https://github.com/papyri/idp.data/tree/${commitInfo})`
      : `\`${commitInfo}\``;
    markdown += `**IDP Data Commit**: ${commitLink}  \n`;
    
    markdown += `**Generated**: ${timestamp}\n\n`;
    
    if (Object.keys(skipReasons).length === 0) {
      markdown += "No files were skipped.\n";
    } else {
      markdown += "| File | Reason |\n";
      markdown += "|------|--------|\n";
      
      Object.entries(skipReasons).forEach(([file, reason]) => {
        // Extract relative path from testing root (e.g., DDB_EpiDoc_XML or HGV_trans_EpiDoc)
        const pathParts = file.split("/");
        const roundtripsIndex = pathParts.findIndex(part => part === "roundtrips");
        
        let fileLink = `\`${file}\``;
        
        if (roundtripsIndex !== -1 && roundtripsIndex + 1 < pathParts.length) {
          // Get path from testing root (e.g., DDB_EpiDoc_XML/...) onwards
          const githubPath = pathParts.slice(roundtripsIndex + 1).join("/");
          
          // Create GitHub file link if commit is known (path is already .xml)
          fileLink = commitInfo !== "unknown"
            ? `[\`${githubPath}\`](https://github.com/papyri/idp.data/blob/${commitInfo}/${githubPath})`
            : `\`${githubPath}\``;
        }
        
        // Escape pipes and basic HTML characters for markdown
        const escapedReason = reason
          .replace(/\|/g, "\\|");
        markdown += `| ${fileLink} | ${escapedReason} |\n`;
      });
    }
    
    return markdown;
  }
}

module.exports = IdpSkipReporter;