const fs = require("fs");
const path = require("path");
const xcode = require("xcode");

module.exports = function(hookArgs) {
    const platform = hookArgs.prepareData.platform;
    const projectData = hookArgs.projectData;

    if (platform === "ios") {
        const sanitizedAppName = path.basename(projectData.projectDir).split("").filter((c) => /[a-zA-Z0-9]/.test(c)).join("");
        const xcodeProjectPath = path.join(projectData.platformsDir, "ios", sanitizedAppName + ".xcodeproj", "project.pbxproj");
        if (fs.existsSync(xcodeProjectPath)) {
            const xcodeProject = xcode.project(xcodeProjectPath);
            xcodeProject.parseSync();
            xcodeProject.addFramework("StoreKit.framework");
            fs.writeFileSync(xcodeProjectPath, xcodeProject.writeSync());
        } else {
            throw new Error(`[NativeScript In App Purchase]: ${xcodeProjectPath} " is missing.`);
        }
    }
};
