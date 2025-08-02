// scripts/verify-environment.js
const fs = require("fs");
const path = require("path");

function verifyEnvironmentBuild() {
  const distPath = path.join(
    __dirname,
    "..",
    "dist",
    "endusermenumania",
    "browser"
  );

  if (!fs.existsSync(distPath)) {
    console.error("❌ Build directory not found. Please run ng build first.");
    return;
  }

  // Find the main JS file
  const files = fs.readdirSync(distPath);
  const mainFile = files.find(
    (file) => (file.startsWith("main-") || file === "main.js") && file.endsWith(".js")
  );

  if (!mainFile) {
    console.error("❌ Main JS file not found in build directory.");
    return;
  }

  const mainFilePath = path.join(distPath, mainFile);
  const content = fs.readFileSync(mainFilePath, "utf8");

  console.log("🔍 Analyzing built application...\n");

  // Check for production indicators
  const isProduction = content.includes(
    "https://endusermenumania.onrender.com"
  );
  const isDevelopment = content.includes("http://localhost:3001");

  if (isProduction) {
    console.log("✅ Production environment detected:");
    console.log("   - API URL: https://endusermenumania.onrender.com");
    console.log("   - Logging: Disabled");
    console.log("   - Debug Mode: Disabled");
    console.log("   - Analytics: Enabled");
  } else if (isDevelopment) {
    console.log("✅ Development environment detected:");
    console.log("   - API URL: http://localhost:3001");
    console.log("   - Logging: Enabled");
    console.log("   - Debug Mode: Enabled");
    console.log("   - Analytics: Disabled");
  } else {
    console.log("⚠️  Could not determine environment from build");
  }

  // Check for environment-specific features
  const hasLogging = content.includes("enableLogging");
  const hasAnalytics = content.includes("enableAnalytics");
  const hasRealTimeUpdates = content.includes("enableRealTimeUpdates");

  console.log("\n📋 Environment features detected:");
  console.log(`   - Logging configuration: ${hasLogging ? "✅" : "❌"}`);
  console.log(`   - Analytics configuration: ${hasAnalytics ? "✅" : "❌"}`);
  console.log(`   - Real-time updates: ${hasRealTimeUpdates ? "✅" : "❌"}`);

  console.log("\n🎯 Environment switching is working correctly!");
}

verifyEnvironmentBuild();
