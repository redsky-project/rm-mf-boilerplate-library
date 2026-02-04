
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "tailwindcss": async () => {
          let pkg = await import("__mf__virtual/RmMfLibrary__prebuild__tailwindcss__prebuild__.js");
            return pkg;
        }
      
    }
      const usedShared = {
      
          "tailwindcss": {
            name: "tailwindcss",
            version: "4.1.18",
            scope: ["default"],
            loaded: false,
            from: "RmMfLibrary",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"tailwindcss"}' must be provided by host`);
              }
              usedShared["tailwindcss"].loaded = true
              const {"tailwindcss": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^4.1.18",
              
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      