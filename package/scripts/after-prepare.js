const fs = require("fs");
const path = require("path");
const xcode = require("xcode");

module.exports = function($logger, $projectData, hookArgs) {
    const platformFromHookArgs = hookArgs && (hookArgs.platform || (hookArgs.prepareData && hookArgs.prepareData.platform));
    const platform = (platformFromHookArgs  || "").toLowerCase();

    return new Promise(function(resolve, reject) {
        if (platform === "ios") {
            const sanitizedAppName = path.basename($projectData.projectDir).split("").filter((c) => /[a-zA-Z0-9]/.test(c)).join("");
            const xcodeProjectPath = path.join($projectData.platformsDir, "ios", sanitizedAppName + ".xcodeproj", "project.pbxproj");
            if (fs.existsSync(xcodeProjectPath)) {
                var xcodeProject = xcode.project(xcodeProjectPath);
                xcodeProject.parseSync();
                xcodeProject.addFramework("StoreKit.framework");
                fs.writeFileSync(xcodeProjectPath, xcodeProject.writeSync());
            } else {
                $logger.error("[NativeScript In App Purchase]: " + xcodeProjectPath + " is missing.");
                reject();
                return;
            }
        }

        resolve();
    });
};