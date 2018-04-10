#!/usr/bin/env node
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("tsickle/src/main", ["require", "exports", "fs", "minimist", "mkdirp", "path", "tsickle/src/typescript", "tsickle/src/cli_support", "tsickle/src/tsickle", "tsickle/src/tsickle"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fs = require("fs");
    var minimist = require("minimist");
    var mkdirp = require("mkdirp");
    var path = require("path");
    var ts = require("tsickle/src/typescript");
    var cliSupport = require("tsickle/src/cli_support");
    var tsickle = require("tsickle/src/tsickle");
    var tsickle_1 = require("tsickle/src/tsickle");
    function usage() {
        console.error("usage: tsickle [tsickle options] -- [tsc options]\n\nexample:\n  tsickle --externs=foo/externs.js -- -p src --noImplicitAny\n\ntsickle flags are:\n  --externs=PATH        save generated Closure externs.js to PATH\n  --typed               [experimental] attempt to provide Closure types instead of {?}\n  --disableAutoQuoting  do not automatically apply quotes to property accesses\n");
    }
    /**
     * Parses the command-line arguments, extracting the tsickle settings and
     * the arguments to pass on to tsc.
     */
    function loadSettingsFromArgs(args) {
        var settings = {};
        var parsedArgs = minimist(args);
        try {
            for (var _a = __values(Object.keys(parsedArgs)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var flag = _b.value;
                switch (flag) {
                    case 'h':
                    case 'help':
                        usage();
                        process.exit(0);
                        break;
                    case 'externs':
                        settings.externsPath = parsedArgs[flag];
                        break;
                    case 'typed':
                        settings.isTyped = true;
                        break;
                    case 'verbose':
                        settings.verbose = true;
                        break;
                    case 'disableAutoQuoting':
                        settings.disableAutoQuoting = true;
                        break;
                    case '_':
                        // This is part of the minimist API, and holds args after the '--'.
                        break;
                    default:
                        console.error("unknown flag '--" + flag + "'");
                        usage();
                        process.exit(1);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Arguments after the '--' arg are arguments to tsc.
        var tscArgs = parsedArgs['_'];
        return { settings: settings, tscArgs: tscArgs };
        var e_1, _c;
    }
    /**
     * Loads the tsconfig.json from a directory.
     *
     * TODO(martinprobst): use ts.findConfigFile to match tsc behaviour.
     *
     * @param args tsc command-line arguments.
     */
    function loadTscConfig(args) {
        // Gather tsc options/input files from command line.
        var _a = ts.parseCommandLine(args), options = _a.options, fileNames = _a.fileNames, errors = _a.errors;
        if (errors.length > 0) {
            return { options: {}, fileNames: [], errors: errors };
        }
        // Store file arguments
        var tsFileArguments = fileNames;
        // Read further settings from tsconfig.json.
        var projectDir = options.project || '.';
        var configFileName = path.join(projectDir, 'tsconfig.json');
        var _b = ts.readConfigFile(configFileName, function (path) { return fs.readFileSync(path, 'utf-8'); }), json = _b.config, error = _b.error;
        if (error) {
            return { options: {}, fileNames: [], errors: [error] };
        }
        (_c = ts.parseJsonConfigFileContent(json, ts.sys, projectDir, options, configFileName), options = _c.options, fileNames = _c.fileNames, errors = _c.errors);
        if (errors.length > 0) {
            return { options: {}, fileNames: [], errors: errors };
        }
        // if file arguments were given to the typescript transpiler then transpile only those files
        fileNames = tsFileArguments.length > 0 ? tsFileArguments : fileNames;
        return { options: options, fileNames: fileNames, errors: [] };
        var _c;
    }
    /**
     * Compiles TypeScript code into Closure-compiler-ready JS.
     */
    function toClosureJS(options, fileNames, settings, writeFile) {
        var compilerHost = ts.createCompilerHost(options);
        var program = ts.createProgram(fileNames, options, compilerHost);
        // Use absolute paths to determine what files to process since files may be imported using
        // relative or absolute paths
        var filesToProcess = new Set(fileNames.map(function (i) { return path.resolve(i); }));
        var transformerHost = {
            shouldSkipTsickleProcessing: function (fileName) {
                return !filesToProcess.has(path.resolve(fileName));
            },
            shouldIgnoreWarningsForPath: function (fileName) { return false; },
            pathToModuleName: cliSupport.pathToModuleName,
            fileNameToModuleId: function (fileName) { return fileName; },
            es5Mode: true,
            googmodule: true,
            prelude: '',
            transformDecorators: true,
            transformTypesToClosure: true,
            typeBlackListPaths: new Set(),
            disableAutoQuoting: settings.disableAutoQuoting,
            untyped: false,
            logWarning: function (warning) { return console.error(tsickle.formatDiagnostics([warning])); },
            options: options,
            host: compilerHost,
        };
        var diagnostics = ts.getPreEmitDiagnostics(program);
        if (diagnostics.length > 0) {
            return {
                diagnostics: diagnostics,
                modulesManifest: new tsickle_1.ModulesManifest(),
                externs: {},
                emitSkipped: true,
                emittedFiles: [],
            };
        }
        return tsickle.emitWithTsickle(program, transformerHost, compilerHost, options, undefined, writeFile);
    }
    exports.toClosureJS = toClosureJS;
    function main(args) {
        var _a = loadSettingsFromArgs(args), settings = _a.settings, tscArgs = _a.tscArgs;
        var config = loadTscConfig(tscArgs);
        if (config.errors.length) {
            console.error(tsickle.formatDiagnostics(config.errors));
            return 1;
        }
        if (config.options.module !== ts.ModuleKind.CommonJS) {
            // This is not an upstream TypeScript diagnostic, therefore it does not go
            // through the diagnostics array mechanism.
            console.error('tsickle converts TypeScript modules to Closure modules via CommonJS internally. ' +
                'Set tsconfig.js "module": "commonjs"');
            return 1;
        }
        // Run tsickle+TSC to convert inputs to Closure JS files.
        var result = toClosureJS(config.options, config.fileNames, settings, function (filePath, contents) {
            mkdirp.sync(path.dirname(filePath));
            fs.writeFileSync(filePath, contents, { encoding: 'utf-8' });
        });
        if (result.diagnostics.length) {
            console.error(tsickle.formatDiagnostics(result.diagnostics));
            return 1;
        }
        if (settings.externsPath) {
            mkdirp.sync(path.dirname(settings.externsPath));
            fs.writeFileSync(settings.externsPath, tsickle.getGeneratedExterns(result.externs));
        }
        return 0;
    }
    // CLI entry point
    if (require.main === module) {
        process.exit(main(process.argv.splice(2)));
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFVQSx1QkFBeUI7SUFDekIsbUNBQXFDO0lBQ3JDLCtCQUFpQztJQUNqQywyQkFBNkI7SUFDN0IsMkNBQW1DO0lBRW5DLG9EQUE0QztJQUM1Qyw2Q0FBcUM7SUFDckMsK0NBQTBDO0lBa0IxQztRQUNFLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ1lBU2YsQ0FBQyxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILDhCQUE4QixJQUFjO1FBQzFDLElBQU0sUUFBUSxHQUFhLEVBQUUsQ0FBQztRQUM5QixJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O1lBQ2xDLEdBQUcsQ0FBQyxDQUFlLElBQUEsS0FBQSxTQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUEsZ0JBQUE7Z0JBQXJDLElBQU0sSUFBSSxXQUFBO2dCQUNiLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2IsS0FBSyxHQUFHLENBQUM7b0JBQ1QsS0FBSyxNQUFNO3dCQUNULEtBQUssRUFBRSxDQUFDO3dCQUNSLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2hCLEtBQUssQ0FBQztvQkFDUixLQUFLLFNBQVM7d0JBQ1osUUFBUSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3hDLEtBQUssQ0FBQztvQkFDUixLQUFLLE9BQU87d0JBQ1YsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7d0JBQ3hCLEtBQUssQ0FBQztvQkFDUixLQUFLLFNBQVM7d0JBQ1osUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7d0JBQ3hCLEtBQUssQ0FBQztvQkFDUixLQUFLLG9CQUFvQjt3QkFDdkIs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LENBQUMsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzdELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDdEYsQ0FBQztRQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsa0JBQWtCO0lBQ2xCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcblxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBtaW5pbWlzdCBmcm9tICdtaW5pbWlzdCc7XG5pbXBvcnQgKiBhcyBta2RpcnAgZnJvbSAnbWtkaXJwJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICcuL3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQgKiBhcyBjbGlTdXBwb3J0IGZyb20gJy4vY2xpX3N1cHBvcnQnO1xuaW1wb3J0ICogYXMgdHNpY2tsZSBmcm9tICcuL3RzaWNrbGUnO1xuaW1wb3J0IHtNb2R1bGVzTWFuaWZlc3R9IGZyb20gJy4vdHNpY2tsZSc7XG5pbXBvcnQge2NyZWF0ZVNvdXJjZVJlcGxhY2luZ0NvbXBpbGVySG9zdH0gZnJvbSAnLi91dGlsJztcblxuLyoqIFRzaWNrbGUgc2V0dGluZ3MgcGFzc2VkIG9uIHRoZSBjb21tYW5kIGxpbmUuICovXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzIHtcbiAgLyoqIElmIHByb3ZpZGVkLCBkbyBub3QgbW9kaWZ5IHF1b3Rpbmcgb2YgcHJvcGVydHkgYWNjZXNzZXMuICovXG4gIGRpc2FibGVBdXRvUXVvdGluZz86IGJvb2xlYW47XG5cbiAgLyoqIElmIHByb3ZpZGVkLCBwYXRoIHRvIHNhdmUgZXh0ZXJucyB0by4gKi9cbiAgZXh0ZXJuc1BhdGg/OiBzdHJpbmc7XG5cbiAgLyoqIElmIHByb3ZpZGVkLCBhdHRlbXB0IHRvIHByb3ZpZGUgdHlwZXMgcmF0aGVyIHRoYW4gez99LiAqL1xuICBpc1R5cGVkPzogYm9vbGVhbjtcblxuICAvKiogSWYgdHJ1ZSwgbG9nIGludGVybmFsIGRlYnVnIHdhcm5pbmdzIHRvIHRoZSBjb25zb2xlLiAqL1xuICB2ZXJib3NlPzogYm9vbGVhbjtcbn1cblxuZnVuY3Rpb24gdXNhZ2UoKSB7XG4gIGNvbnNvbGUuZXJyb3IoYHVzYWdlOiB0c2lja2xlIFt0c2lja2xlIG9wdGlvbnNdIC0tIFt0c2Mgb3B0aW9uc11cblxuZXhhbXBsZTpcbiAgdHNpY2tsZSAtLWV4dGVybnM9Zm9vL2V4dGVybnMuanMgLS0gLXAgc3JjIC0tbm9JbXBsaWNpdEFueVxuXG50c2lja2xlIGZsYWdzIGFyZTpcbiAgLS1leHRlcm5zPVBBVEggICAgICAgIHNhdmUgZ2VuZXJhdGVkIENsb3N1cmUgZXh0ZXJucy5qcyB0byBQQVRIXG4gIC0tdHlwZWQgICAgICAgICAgICAgICBbZXhwZXJpbWVudGFsXSBhdHRlbXB0IHRvIHByb3ZpZGUgQ2xvc3VyZSB0eXBlcyBpbnN0ZWFkIG9mIHs/fVxuICAtLWRpc2FibGVBdXRvUXVvdGluZyAgZG8gbm90IGF1dG9tYXRpY2FsbHkgYXBwbHkgcXVvdGVzIHRvIHByb3BlcnR5IGFjY2Vzc2VzXG5gKTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIGNvbW1hbmQtbGluZSBhcmd1bWVudHMsIGV4dHJhY3RpbmcgdGhlIHRzaWNrbGUgc2V0dGluZ3MgYW5kXG4gKiB0aGUgYXJndW1lbnRzIHRvIHBhc3Mgb24gdG8gdHNjLlxuICovXG5mdW5jdGlvbiBsb2FkU2V0dGluZ3NGcm9tQXJncyhhcmdzOiBzdHJpbmdbXSk6IHtzZXR0aW5nczogU2V0dGluZ3MsIHRzY0FyZ3M6IHN0cmluZ1tdfSB7XG4gIGNvbnN0IHNldHRpbmdzOiBTZXR0aW5ncyA9IHt9O1xuICBjb25zdCBwYXJzZWRBcmdzID0gbWluaW1pc3QoYXJncyk7XG4gIGZvciAoY29uc3QgZmxhZyBvZiBPYmplY3Qua2V5cyhwYXJzZWRBcmdzKSkge1xuICAgIHN3aXRjaCAoZmxhZykge1xuICAgICAgY2FzZSAnaCc6XG4gICAgICBjYXNlICdoZWxwJzpcbiAgICAgICAgdXNhZ2UoKTtcbiAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2V4dGVybnMnOlxuICAgICAgICBzZXR0aW5ncy5leHRlcm5zUGF0aCA9IHBhcnNlZEFyZ3NbZmxhZ107XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndHlwZWQnOlxuICAgICAgICBzZXR0aW5ncy5pc1R5cGVkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd2ZXJib3NlJzpcbiAgICAgICAgc2V0dGluZ3MudmVyYm9zZSA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGlzYWJsZUF1dG9RdW90aW5nJzpcbiAgICAgICAgc2V0dGluZ3MuZGlzYWJsZUF1dG9RdW90aW5nID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdfJzpcbiAgICAgICAgLy8gVGhpcyBpcyBwYXJ0IG9mIHRoZSBtaW5pbWlzdCBBUEksIGFuZCBob2xkcyBhcmdzIGFmdGVyIHRoZSAnLS0nLlxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYHVua25vd24gZmxhZyAnLS0ke2ZsYWd9J2ApO1xuICAgICAgICB1c2FnZSgpO1xuICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgfVxuICB9XG4gIC8vIEFyZ3VtZW50cyBhZnRlciB0aGUgJy0tJyBhcmcgYXJlIGFyZ3VtZW50cyB0byB0c2MuXG4gIGNvbnN0IHRzY0FyZ3MgPSBwYXJzZWRBcmdzWydfJ107XG4gIHJldHVybiB7c2V0dGluZ3MsIHRzY0FyZ3N9O1xufVxuXG4vKipcbiAqIExvYWRzIHRoZSB0c2NvbmZpZy5qc29uIGZyb20gYSBkaXJlY3RvcnkuXG4gKlxuICogVE9ETyhtYXJ0aW5wcm9ic3QpOiB1c2UgdHMuZmluZENvbmZpZ0ZpbGUgdG8gbWF0Y2ggdHNjIGJlaGF2aW91ci5cbiAqXG4gKiBAcGFyYW0gYXJncyB0c2MgY29tbWFuZC1saW5lIGFyZ3VtZW50cy5cbiAqL1xuZnVuY3Rpb24gbG9hZFRzY0NvbmZpZyhhcmdzOiBzdHJpbmdbXSk6XG4gICAge29wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucywgZmlsZU5hbWVzOiBzdHJpbmdbXSwgZXJyb3JzOiB0cy5EaWFnbm9zdGljW119IHtcbiAgLy8gR2F0aGVyIHRzYyBvcHRpb25zL2lucHV0IGZpbGVzIGZyb20gY29tbWFuZCBsaW5lLlxuICBsZXQge29wdGlvbnMsIGZpbGVOYW1lcywgZXJyb3JzfSA9IHRzLnBhcnNlQ29tbWFuZExpbmUoYXJncyk7XG4gIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB7b3B0aW9uczoge30sIGZpbGVOYW1lczogW10sIGVycm9yc307XG4gIH1cblxuICAvLyBTdG9yZSBmaWxlIGFyZ3VtZW50c1xuICBjb25zdCB0c0ZpbGVBcmd1bWVudHMgPSBmaWxlTmFtZXM7XG5cbiAgLy8gUmVhZCBmdXJ0aGVyIHNldHRpbmdzIGZyb20gdHNjb25maWcuanNvbi5cbiAgY29uc3QgcHJvamVjdERpciA9IG9wdGlvbnMucHJvamVjdCB8fCAnLic7XG4gIGNvbnN0IGNvbmZpZ0ZpbGVOYW1lID0gcGF0aC5qb2luKHByb2plY3REaXIsICd0c2NvbmZpZy5qc29uJyk7XG4gIGNvbnN0IHtjb25maWc6IGpzb24sIGVycm9yfSA9XG4gICAgICB0cy5yZWFkQ29uZmlnRmlsZShjb25maWdGaWxlTmFtZSwgcGF0aCA9PiBmcy5yZWFkRmlsZVN5bmMocGF0aCwgJ3V0Zi04JykpO1xuICBpZiAoZXJyb3IpIHtcbiAgICByZXR1cm4ge29wdGlvbnM6IHt9LCBmaWxlTmFtZXM6IFtdLCBlcnJvcnM6IFtlcnJvcl19O1xuICB9XG4gICh7b3B0aW9ucywgZmlsZU5hbWVzLCBlcnJvcnN9ID1cbiAgICAgICB0cy5wYXJzZUpzb25Db25maWdGaWxlQ29udGVudChqc29uLCB0cy5zeXMsIHByb2plY3REaXIsIG9wdGlvbnMsIGNvbmZpZ0ZpbGVOYW1lKSk7XG4gIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB7b3B0aW9uczoge30sIGZpbGVOYW1lczogW10sIGVycm9yc307XG4gIH1cblxuICAvLyBpZiBmaWxlIGFyZ3VtZW50cyB3ZXJlIGdpdmVuIHRvIHRoZSB0eXBlc2NyaXB0IHRyYW5zcGlsZXIgdGhlbiB0cmFuc3BpbGUgb25seSB0aG9zZSBmaWxlc1xuICBmaWxlTmFtZXMgPSB0c0ZpbGVBcmd1bWVudHMubGVuZ3RoID4gMCA/IHRzRmlsZUFyZ3VtZW50cyA6IGZpbGVOYW1lcztcblxuICByZXR1cm4ge29wdGlvbnMsIGZpbGVOYW1lcywgZXJyb3JzOiBbXX07XG59XG5cbi8qKlxuICogQ29tcGlsZXMgVHlwZVNjcmlwdCBjb2RlIGludG8gQ2xvc3VyZS1jb21waWxlci1yZWFkeSBKUy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvQ2xvc3VyZUpTKFxuICAgIG9wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucywgZmlsZU5hbWVzOiBzdHJpbmdbXSwgc2V0dGluZ3M6IFNldHRpbmdzLFxuICAgIHdyaXRlRmlsZT86IHRzLldyaXRlRmlsZUNhbGxiYWNrKTogdHNpY2tsZS5FbWl0UmVzdWx0IHtcbiAgY29uc3QgY29tcGlsZXJIb3N0ID0gdHMuY3JlYXRlQ29tcGlsZXJIb3N0KG9wdGlvbnMpO1xuICBjb25zdCBwcm9ncmFtID0gdHMuY3JlYXRlUHJvZ3JhbShmaWxlTmFtZXMsIG9wdGlvbnMsIGNvbXBpbGVySG9zdCk7XG4gIC8vIFVzZSBhYnNvbHV0ZSBwYXRocyB0byBkZXRlcm1pbmUgd2hhdCBmaWxlcyB0byBwcm9jZXNzIHNpbmNlIGZpbGVzIG1heSBiZSBpbXBvcnRlZCB1c2luZ1xuICAvLyByZWxhdGl2ZSBvciBhYnNvbHV0ZSBwYXRoc1xuICBjb25zdCBmaWxlc1RvUHJvY2VzcyA9IG5ldyBTZXQoZmlsZU5hbWVzLm1hcChpID0+IHBhdGgucmVzb2x2ZShpKSkpO1xuICBjb25zdCB0cmFuc2Zvcm1lckhvc3Q6IHRzaWNrbGUuVHNpY2tsZUhvc3QgPSB7XG4gICAgc2hvdWxkU2tpcFRzaWNrbGVQcm9jZXNzaW5nOiAoZmlsZU5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgcmV0dXJuICFmaWxlc1RvUHJvY2Vzcy5oYXMocGF0aC5yZXNvbHZlKGZpbGVOYW1lKSk7XG4gICAgfSxcbiAgICBzaG91bGRJZ25vcmVXYXJuaW5nc0ZvclBhdGg6IChmaWxlTmFtZTogc3RyaW5nKSA9PiBmYWxzZSxcbiAgICBwYXRoVG9Nb2R1bGVOYW1lOiBjbGlTdXBwb3J0LnBhdGhUb01vZHVsZU5hbWUsXG4gICAgZmlsZU5hbWVUb01vZHVsZUlkOiAoZmlsZU5hbWUpID0+IGZpbGVOYW1lLFxuICAgIGVzNU1vZGU6IHRydWUsXG4gICAgZ29vZ21vZHVsZTogdHJ1ZSxcbiAgICBwcmVsdWRlOiAnJyxcbiAgICB0cmFuc2Zvcm1EZWNvcmF0b3JzOiB0cnVlLFxuICAgIHRyYW5zZm9ybVR5cGVzVG9DbG9zdXJlOiB0cnVlLFxuICAgIHR5cGVCbGFja0xpc3RQYXRoczogbmV3IFNldCgpLFxuICAgIGRpc2FibGVBdXRvUXVvdGluZzogc2V0dGluZ3MuZGlzYWJsZUF1dG9RdW90aW5nLFxuICAgIHVudHlwZWQ6IGZhbHNlLFxuICAgIGxvZ1dhcm5pbmc6ICh3YXJuaW5nKSA9PiBjb25zb2xlLmVycm9yKHRzaWNrbGUuZm9ybWF0RGlhZ25vc3RpY3MoW3dhcm5pbmddKSksXG4gICAgb3B0aW9ucyxcbiAgICBob3N0OiBjb21waWxlckhvc3QsXG4gIH07XG4gIGNvbnN0IGRpYWdub3N0aWNzID0gdHMuZ2V0UHJlRW1pdERpYWdub3N0aWNzKHByb2dyYW0pO1xuICBpZiAoZGlhZ25vc3RpY3MubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBkaWFnbm9zdGljcyxcbiAgICAgIG1vZHVsZXNNYW5pZmVzdDogbmV3IE1vZHVsZXNNYW5pZmVzdCgpLFxuICAgICAgZXh0ZXJuczoge30sXG4gICAgICBlbWl0U2tpcHBlZDogdHJ1ZSxcbiAgICAgIGVtaXR0ZWRGaWxlczogW10sXG4gICAgfTtcbiAgfVxuICByZXR1cm4gdHNpY2tsZS5lbWl0V2l0aFRzaWNrbGUoXG4gICAgICBwcm9ncmFtLCB0cmFuc2Zvcm1lckhvc3QsIGNvbXBpbGVySG9zdCwgb3B0aW9ucywgdW5kZWZpbmVkLCB3cml0ZUZpbGUpO1xufVxuXG5mdW5jdGlvbiBtYWluKGFyZ3M6IHN0cmluZ1tdKTogbnVtYmVyIHtcbiAgY29uc3Qge3NldHRpbmdzLCB0c2NBcmdzfSA9IGxvYWRTZXR0aW5nc0Zyb21BcmdzKGFyZ3MpO1xuICBjb25zdCBjb25maWcgPSBsb2FkVHNjQ29uZmlnKHRzY0FyZ3MpO1xuICBpZiAoY29uZmlnLmVycm9ycy5sZW5ndGgpIHtcbiAgICBjb25zb2xlLmVycm9yKHRzaWNrbGUuZm9ybWF0RGlhZ25vc3RpY3MoY29uZmlnLmVycm9ycykpO1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKGNvbmZpZy5vcHRpb25zLm1vZHVsZSAhPT0gdHMuTW9kdWxlS2luZC5Db21tb25KUykge1xuICAgIC8vIFRoaXMgaXMgbm90IGFuIHVwc3RyZWFtIFR5cGVTY3JpcHQgZGlhZ25vc3RpYywgdGhlcmVmb3JlIGl0IGRvZXMgbm90IGdvXG4gICAgLy8gdGhyb3VnaCB0aGUgZGlhZ25vc3RpY3MgYXJyYXkgbWVjaGFuaXNtLlxuICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICd0c2lja2xlIGNvbnZlcnRzIFR5cGVTY3JpcHQgbW9kdWxlcyB0byBDbG9zdXJlIG1vZHVsZXMgdmlhIENvbW1vbkpTIGludGVybmFsbHkuICcgK1xuICAgICAgICAnU2V0IHRzY29uZmlnLmpzIFwibW9kdWxlXCI6IFwiY29tbW9uanNcIicpO1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgLy8gUnVuIHRzaWNrbGUrVFNDIHRvIGNvbnZlcnQgaW5wdXRzIHRvIENsb3N1cmUgSlMgZmlsZXMuXG4gIGNvbnN0IHJlc3VsdCA9IHRvQ2xvc3VyZUpTKFxuICAgICAgY29uZmlnLm9wdGlvbnMsIGNvbmZpZy5maWxlTmFtZXMsIHNldHRpbmdzLCAoZmlsZVBhdGg6IHN0cmluZywgY29udGVudHM6IHN0cmluZykgPT4ge1xuICAgICAgICBta2RpcnAuc3luYyhwYXRoLmRpcm5hbWUoZmlsZVBhdGgpKTtcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgY29udGVudHMsIHtlbmNvZGluZzogJ3V0Zi04J30pO1xuICAgICAgfSk7XG4gIGlmIChyZXN1bHQuZGlhZ25vc3RpY3MubGVuZ3RoKSB7XG4gICAgY29uc29sZS5lcnJvcih0c2lja2xlLmZvcm1hdERpYWdub3N0aWNzKHJlc3VsdC5kaWFnbm9zdGljcykpO1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgaWYgKHNldHRpbmdzLmV4dGVybnNQYXRoKSB7XG4gICAgbWtkaXJwLnN5bmMocGF0aC5kaXJuYW1lKHNldHRpbmdzLmV4dGVybnNQYXRoKSk7XG4gICAgZnMud3JpdGVGaWxlU3luYyhzZXR0aW5ncy5leHRlcm5zUGF0aCwgdHNpY2tsZS5nZXRHZW5lcmF0ZWRFeHRlcm5zKHJlc3VsdC5leHRlcm5zKSk7XG4gIH1cbiAgcmV0dXJuIDA7XG59XG5cbi8vIENMSSBlbnRyeSBwb2ludFxuaWYgKHJlcXVpcmUubWFpbiA9PT0gbW9kdWxlKSB7XG4gIHByb2Nlc3MuZXhpdChtYWluKHByb2Nlc3MuYXJndi5zcGxpY2UoMikpKTtcbn1cbiJdfQ==