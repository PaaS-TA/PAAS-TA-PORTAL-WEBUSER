/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        define("tsickle/src/es5processor", ["require", "exports", "path", "tsickle/src/fileoverview_comment_transformer", "tsickle/src/rewriter", "tsickle/src/typescript", "tsickle/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var path = require("path");
    var fileoverview_comment_transformer_1 = require("tsickle/src/fileoverview_comment_transformer");
    var rewriter_1 = require("tsickle/src/rewriter");
    var ts = require("tsickle/src/typescript");
    var util_1 = require("tsickle/src/util");
    // Matches common extensions of TypeScript input filenames
    var TS_EXTENSIONS = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
    /**
     * Extracts the namespace part of a goog: import, or returns null if the given
     * import is not a goog: import.
     */
    function extractGoogNamespaceImport(tsImport) {
        if (tsImport.match(/^goog:/))
            return tsImport.substring('goog:'.length);
        return null;
    }
    exports.extractGoogNamespaceImport = extractGoogNamespaceImport;
    /**
     * Convert from implicit `import {} from 'pkg'` to `import {} from 'pkg/index'.
     * TypeScript supports the shorthand, but not all ES6 module loaders do.
     * Workaround for https://github.com/Microsoft/TypeScript/issues/12597
     */
    function resolveIndexShorthand(host, fileName, imported) {
        var resolved = ts.resolveModuleName(imported, fileName, host.options, host.host);
        if (!resolved || !resolved.resolvedModule)
            return imported;
        var requestedModule = imported.replace(TS_EXTENSIONS, '');
        var resolvedModule = resolved.resolvedModule.resolvedFileName.replace(TS_EXTENSIONS, '');
        if (resolvedModule.indexOf('node_modules') === -1 &&
            requestedModule.substr(requestedModule.lastIndexOf('/')) !==
                resolvedModule.substr(resolvedModule.lastIndexOf('/'))) {
            imported = './' + path.relative(path.dirname(fileName), resolvedModule).replace(path.sep, '/');
        }
        return imported;
    }
    exports.resolveIndexShorthand = resolveIndexShorthand;
    /**
     * ES5Processor postprocesses TypeScript compilation output JS, to rewrite commonjs require()s into
     * goog.require(). Contrary to its name it handles converting the modules in both ES5 and ES6
     * outputs.
     */
    var ES5Processor = /** @class */ (function (_super) {
        __extends(ES5Processor, _super);
        function ES5Processor(host, file) {
            var _this = _super.call(this, file) || this;
            _this.host = host;
            /**
             * namespaceImports collects the variables for imported goog.modules.
             * If the original TS input is:
             *   import foo from 'goog:bar';
             * then TS produces:
             *   var foo = require('goog:bar');
             * and this class rewrites it to:
             *   var foo = require('goog.bar');
             * After this step, namespaceImports['foo'] is true.
             * (This is used to rewrite 'foo.default' into just 'foo'.)
             */
            _this.namespaceImports = new Set();
            /**
             * moduleVariables maps from module names to the variables they're assigned to.
             * Continuing the above example, moduleVariables['goog.bar'] = 'foo'.
             */
            _this.moduleVariables = new Map();
            /** strippedStrict is true once we've stripped a "use strict"; from the input. */
            _this.strippedStrict = false;
            /** unusedIndex is used to generate fresh symbols for unnamed imports. */
            _this.unusedIndex = 0;
            return _this;
        }
        ES5Processor.prototype.process = function () {
            var _this = this;
            this.emitFileComment();
            var moduleId = this.host.fileNameToModuleId(this.file.fileName);
            var moduleName = this.host.pathToModuleName('', this.file.fileName);
            // NB: No linebreak after module call so sourcemaps are not offset.
            this.emit("goog.module('" + moduleName + "');");
            if (this.host.prelude)
                this.emit(this.host.prelude);
            // Allow code to use `module.id` to discover its module URL, e.g. to resolve
            // a template URL against.
            // Uses 'var', as this code is inserted in ES6 and ES5 modes.
            // The following pattern ensures closure doesn't throw an error in advanced
            // optimizations mode.
            if (this.host.es5Mode) {
                this.emit("var module = module || {id: '" + moduleId + "'};");
            }
            else {
                // The `exports = {}` serves as a default export to disable Closure Compiler's error checking
                // for mutable exports. That's OK because TS compiler makes sure that consuming code always
                // accesses exports through the module object, so mutable exports work.
                // It is only inserted in ES6 because we strip `.default` accesses in ES5 mode, which breaks
                // when assigning an `exports = {}` object and then later accessing it.
                // However Closure bails if code later on assigns into exports directly, as we do if we have
                // an "exports = " block, so skip emit if that's the case.
                if (!this.file.statements.find(function (s) { return ts.isExpressionStatement(s) && _this.isModuleExportsAssignment(s); })) {
                    this.emit(" exports = {};");
                }
                // The module=module bit suppresses an unused variable warning which
                // may trigger depending on the compilation flags.
                this.emit(" var module = {id: '" + moduleId + "'}; module = module;");
            }
            var pos = 0;
            try {
                for (var _a = __values(this.file.statements), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var stmt = _b.value;
                    this.writeRange(this.file, pos, stmt.getFullStart());
                    this.visitTopLevel(stmt);
                    pos = stmt.getEnd();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.writeRange(this.file, pos, this.file.getEnd());
            var referencedModules = Array.from(this.moduleVariables.keys());
            // Note: don't sort referencedModules, as the keys are in the same order
            // they occur in the source file.
            var output = this.getOutput().output;
            return { output: output, referencedModules: referencedModules };
            var e_1, _c;
        };
        /** Emits file comments for the current source file, if any. */
        ES5Processor.prototype.emitFileComment = function () {
            var _this = this;
            var leadingComments = ts.getLeadingCommentRanges(this.file.getFullText(), 0) || [];
            var fileComment = leadingComments.find(function (c) {
                if (c.kind !== ts.SyntaxKind.MultiLineCommentTrivia)
                    return false;
                var commentText = _this.file.getFullText().substring(c.pos, c.end);
                return fileoverview_comment_transformer_1.isClosureFileoverviewComment(commentText);
            });
            if (!fileComment)
                return;
            var end = fileComment.end;
            if (fileComment.hasTrailingNewLine)
                end++;
            this.writeLeadingTrivia(this.file, end);
        };
        /**
         * visitTopLevel processes a top-level ts.Node and emits its contents.
         *
         * It's separate from the normal Rewriter recursive traversal
         * because some top-level statements are handled specially.
         */
        ES5Processor.prototype.visitTopLevel = function (node) {
            switch (node.kind) {
                case ts.SyntaxKind.ExpressionStatement:
                    var exprStatement = node;
                    // Check for "use strict" and skip it if necessary.
                    if (!this.strippedStrict && this.isUseStrict(node)) {
                        this.emitCommentWithoutStatementBody(node);
                        this.strippedStrict = true;
                        return;
                    }
                    // Check for:
                    // - "require('foo');" (a require for its side effects)
                    // - "__export(require(...));" (an "export * from ...")
                    if (this.emitRewrittenRequires(node)) {
                        return;
                    }
                    // Check for
                    //   Object.defineProperty(exports, "__esModule", ...);
                    if (this.isEsModuleProperty(exprStatement)) {
                        this.emitCommentWithoutStatementBody(node);
                        return;
                    }
                    // Check for
                    //   module.exports = ...;
                    // Rewrite to goog.module's
                    //   exports = ...;
                    if (this.isModuleExportsAssignment(exprStatement)) {
                        this.emitExportsAssignment(exprStatement);
                        return;
                    }
                    // Otherwise fall through to default processing.
                    break;
                case ts.SyntaxKind.VariableStatement:
                    // Check for a "var x = require('foo');".
                    if (this.emitRewrittenRequires(node))
                        return;
                    break;
                default:
                    break;
            }
            this.visit(node);
        };
        /**
         * The TypeScript AST attaches comments to statement nodes, so even if a node
         * contains code we want to skip emitting, we need to emit the attached
         * comment(s).
         */
        ES5Processor.prototype.emitCommentWithoutStatementBody = function (node) {
            this.writeLeadingTrivia(node);
        };
        /** isUseStrict returns true if node is a "use strict"; statement. */
        ES5Processor.prototype.isUseStrict = function (node) {
            if (node.kind !== ts.SyntaxKind.ExpressionStatement)
                return false;
            var exprStmt = node;
            var expr = exprStmt.expression;
            if (expr.kind !== ts.SyntaxKind.StringLiteral)
                return false;
            var literal = expr;
            return literal.text === 'use strict';
        };
        /**
         * emitRewrittenRequires rewrites require()s into goog.require() equivalents.
         *
         * @return True if the node was rewritten, false if needs ordinary processing.
         */
        ES5Processor.prototype.emitRewrittenRequires = function (node) {
            // We're looking for requires, of one of the forms:
            // - "var importName = require(...);".
            // - "require(...);".
            if (node.kind === ts.SyntaxKind.VariableStatement) {
                // It's possibly of the form "var x = require(...);".
                var varStmt = node;
                // Verify it's a single decl (and not "var x = ..., y = ...;").
                if (varStmt.declarationList.declarations.length !== 1)
                    return false;
                var decl = varStmt.declarationList.declarations[0];
                // Grab the variable name (avoiding things like destructuring binds).
                if (decl.name.kind !== ts.SyntaxKind.Identifier)
                    return false;
                var varName = rewriter_1.getIdentifierText(decl.name);
                if (!decl.initializer || decl.initializer.kind !== ts.SyntaxKind.CallExpression)
                    return false;
                var call = decl.initializer;
                var require_1 = this.extractRequire(call);
                if (!require_1)
                    return false;
                this.writeLeadingTrivia(node);
                this.emitGoogRequire(varName, require_1);
                return true;
            }
            else if (node.kind === ts.SyntaxKind.ExpressionStatement) {
                // It's possibly of the form:
                // - require(...);
                // - __export(require(...));
                // - tslib_1.__exportStar(require(...));
                // All are CallExpressions.
                var exprStmt = node;
                var expr = exprStmt.expression;
                if (expr.kind !== ts.SyntaxKind.CallExpression)
                    return false;
                var call = expr;
                var require_2 = this.extractRequire(call);
                var isExport = false;
                if (!require_2) {
                    // If it's an __export(require(...)), we emit:
                    //   var x = require(...);
                    //   __export(x);
                    // This extra variable is necessary in case there's a later import of the
                    // same module name.
                    var innerCall = this.isExportRequire(call);
                    if (!innerCall)
                        return false;
                    isExport = true;
                    call = innerCall; // Update call to point at the require() expression.
                    require_2 = this.extractRequire(call);
                }
                if (!require_2)
                    return false;
                this.writeLeadingTrivia(node);
                var varName = this.emitGoogRequire(null, require_2);
                if (isExport) {
                    // node is a statement containing a require() in it, while
                    // requireCall is that call.  We replace the require() call
                    // with the variable we emitted.
                    var fullStatement = node.getText();
                    var requireCall = call.getText();
                    this.emit(fullStatement.replace(requireCall, varName));
                }
                return true;
            }
            else {
                // It's some other type of statement.
                return false;
            }
        };
        /**
         * Emits a goog.require() statement for a given variable name and TypeScript import.
         *
         * E.g. from:
         *   var varName = require('tsImport');
         * produces:
         *   var varName = goog.require('goog.module.name');
         *
         * If the input varName is null, generates a new variable name if necessary.
         *
         * @return The variable name for the imported module, reusing a previous import if one
         *    is available.
         */
        ES5Processor.prototype.emitGoogRequire = function (varName, tsImport) {
            var modName;
            var isNamespaceImport = false;
            var nsImport = extractGoogNamespaceImport(tsImport);
            if (nsImport !== null) {
                // This is a namespace import, of the form "goog:foo.bar".
                // Fix it to just "foo.bar".
                modName = nsImport;
                isNamespaceImport = true;
            }
            else {
                if (this.host.convertIndexImportShorthand) {
                    tsImport = resolveIndexShorthand(this.host, this.file.fileName, tsImport);
                }
                modName = this.host.pathToModuleName(this.file.fileName, tsImport);
            }
            if (!varName) {
                var mv = this.moduleVariables.get(modName);
                if (mv) {
                    // Caller didn't request a specific variable name and we've already
                    // imported the module, so just return the name we already have for this module.
                    return mv;
                }
                // Note: we always introduce a variable for any import, regardless of whether
                // the caller requested one.  This avoids a Closure error.
                varName = this.generateFreshVariableName();
            }
            if (isNamespaceImport)
                this.namespaceImports.add(varName);
            if (this.moduleVariables.has(modName)) {
                this.emit("var " + varName + " = " + this.moduleVariables.get(modName) + ";");
            }
            else {
                this.emit("var " + varName + " = goog.require('" + modName + "');");
                this.moduleVariables.set(modName, varName);
            }
            return varName;
        };
        // workaround for syntax highlighting bug in Sublime: `
        /**
         * Returns the string argument if call is of the form
         *   require('foo')
         */
        ES5Processor.prototype.extractRequire = function (call) {
            // Verify that the call is a call to require(...).
            if (call.expression.kind !== ts.SyntaxKind.Identifier)
                return null;
            var ident = call.expression;
            if (rewriter_1.getIdentifierText(ident) !== 'require')
                return null;
            // Verify the call takes a single string argument and grab it.
            if (call.arguments.length !== 1)
                return null;
            var arg = call.arguments[0];
            if (arg.kind !== ts.SyntaxKind.StringLiteral)
                return null;
            return arg.text;
        };
        /**
         * Returns the require() call node if the outer call is of the forms:
         * - __export(require('foo'))
         * - tslib_1.__exportStar(require('foo'), bar)
         */
        ES5Processor.prototype.isExportRequire = function (call) {
            switch (call.expression.kind) {
                case ts.SyntaxKind.Identifier:
                    var ident = call.expression;
                    // TS_24_COMPAT: accept three leading underscores
                    if (ident.text !== '__export' && ident.text !== '___export') {
                        return null;
                    }
                    break;
                case ts.SyntaxKind.PropertyAccessExpression:
                    var propAccess = call.expression;
                    // TS_24_COMPAT: accept three leading underscores
                    if (propAccess.name.text !== '__exportStar' && propAccess.name.text !== '___exportStar') {
                        return null;
                    }
                    break;
                default:
                    return null;
            }
            // Verify the call takes at least one argument and check it.
            if (call.arguments.length < 1)
                return null;
            var arg = call.arguments[0];
            if (arg.kind !== ts.SyntaxKind.CallExpression)
                return null;
            var innerCall = arg;
            if (!this.extractRequire(innerCall))
                return null;
            return innerCall;
        };
        ES5Processor.prototype.isEsModuleProperty = function (expr) {
            // We're matching the explicit source text generated by the TS compiler.
            return expr.getText() === 'Object.defineProperty(exports, "__esModule", { value: true });';
        };
        ES5Processor.prototype.isModuleExportsAssignment = function (expr) {
            // Looking for "module.exports = ...;"
            if (!ts.isBinaryExpression(expr.expression))
                return false;
            if (expr.expression.operatorToken.kind !== ts.SyntaxKind.EqualsToken)
                return false;
            return expr.expression.left.getText() === 'module.exports';
        };
        ES5Processor.prototype.emitExportsAssignment = function (expr) {
            this.emitCommentWithoutStatementBody(expr);
            this.emit('exports =');
            this.visit(expr.expression.right);
            this.emit(';');
        };
        /**
         * maybeProcess is called during the recursive traversal of the program's AST.
         *
         * @return True if the node was processed/emitted, false if it should be emitted as is.
         */
        ES5Processor.prototype.maybeProcess = function (node) {
            switch (node.kind) {
                case ts.SyntaxKind.PropertyAccessExpression:
                    var propAccess = node;
                    // We're looking for an expression of the form:
                    //   module_name_var.default
                    if (rewriter_1.getIdentifierText(propAccess.name) !== 'default')
                        break;
                    if (propAccess.expression.kind !== ts.SyntaxKind.Identifier)
                        break;
                    var lhs = rewriter_1.getIdentifierText(propAccess.expression);
                    if (!this.namespaceImports.has(lhs))
                        break;
                    // Emit the same expression, with spaces to replace the ".default" part
                    // so that source maps still line up.
                    this.writeLeadingTrivia(node);
                    this.emit(lhs + "        ");
                    return true;
                default:
                    break;
            }
            return false;
        };
        /** Generates a new variable name inside the tsickle_ namespace. */
        ES5Processor.prototype.generateFreshVariableName = function () {
            return "tsickle_module_" + this.unusedIndex++ + "_";
        };
        return ES5Processor;
    }(rewriter_1.Rewriter));
    /**
     * Converts TypeScript's JS+CommonJS output to Closure goog.module etc.
     * For use as a postprocessing step *after* TypeScript emits JavaScript.
     *
     * @param fileName The source file name.
     * @param moduleId The "module id", a module-identifying string that is
     *     the value module.id in the scope of the module.
     * @param pathToModuleName A function that maps a filesystem .ts path to a
     *     Closure module name, as found in a goog.require('...') statement.
     *     The context parameter is the referencing file, used for resolving
     *     imports with relative paths like "import * as foo from '../foo';".
     * @param prelude An additional prelude to insert after the `goog.module` call,
     *     e.g. with additional imports or requires.
     */
    function processES5(host, fileName, content) {
        var file = ts.createSourceFile(fileName, content, ts.ScriptTarget.ES5, true);
        return new ES5Processor(host, file).process();
    }
    exports.processES5 = processES5;
    function convertCommonJsToGoogModuleIfNeeded(host, modulesManifest, fileName, content) {
        if (!host.googmodule || util_1.isDtsFileName(fileName)) {
            return content;
        }
        var _a = processES5(host, fileName, content), output = _a.output, referencedModules = _a.referencedModules;
        var moduleName = host.pathToModuleName('', fileName);
        modulesManifest.addModule(fileName, moduleName);
        try {
            for (var referencedModules_1 = __values(referencedModules), referencedModules_1_1 = referencedModules_1.next(); !referencedModules_1_1.done; referencedModules_1_1 = referencedModules_1.next()) {
                var referenced = referencedModules_1_1.value;
                modulesManifest.addReferencedModule(fileName, referenced);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (referencedModules_1_1 && !referencedModules_1_1.done && (_b = referencedModules_1.return)) _b.call(referencedModules_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return output;
        var e_2, _b;
    }
    exports.convertCommonJsToGoogModuleIfNeeded = convertCommonJsToGoogModuleIfNeeded;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXM1cHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2VzNXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUgsMkJBQTZCO0lBRTdCLGlHQUFnRjtJQUVoRixpREFBdUQ7SUFDdkQsMkNBQW1DO0lBQ25DLHlDQUFxQztJQUVyQywwREFBMEQ7SUFDMUQsSUFBTSxhQUFhLEdBQUcsa0NBQWtDLENBQUM7SUE2QnpEOzs7T0FHRztJQUNILG9DQUEyQyxRQUFnQjtRQUN6RCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBSEQsZ0VBR0M7SUFFRDs7OztPQUlHO0lBQ0gsK0JBQ0ksSUFBa0UsRUFBRSxRQUFnQixFQUNwRixRQUFnQjtRQUNsQixJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7WUFBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzNELElBQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzVELElBQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMzRixFQUFFLENBQUMsQ0FBQyxjQUFj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QUFFLE9BQWU7UUFFbEYsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDL0UsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBSkQsZ0NBSUM7SUFFRCw2Q0FDSSxJQUFzQixFQUFFLGVBQWdDLEVBQUUsUUFBZ0IsRUFDMUUsT0FBZTtRQUNqQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksb0JBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBQ0ssSUFBQSx3Q0FBaUUsRUFBaEUsa0JBQU0sRUFBRSx3Q0FBaUIsQ0FBd0M7UUFFeEUsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2RCxlQUFlLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQzs7WUFDaEQsR0FBRyxDQUFDLENBQXFCLElBQUEsc0JBQUEsU0FBQSxpQkFBaUIsQ0FBQSxvREFBQTtnQkFBckMsSUFBTSxVQUFVLDhCQUFBO2dCQUNuQixlQUFlLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2FBQzNEOzs7Ozs7Ozs7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDOztJQUNoQixDQUFDO0lBZkQsa0ZBZUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7aXNDbG9zdXJlRmlsZW92ZXJ2aWV3Q29tbWVudH0gZnJvbSAnLi9maWxlb3ZlcnZpZXdfY29tbWVudF90cmFuc2Zvcm1lcic7XG5pbXBvcnQge01vZHVsZXNNYW5pZmVzdH0gZnJvbSAnLi9tb2R1bGVzX21hbmlmZXN0JztcbmltcG9ydCB7Z2V0SWRlbnRpZmllclRleHQsIFJld3JpdGVyfSBmcm9tICcuL3Jld3JpdGVyJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJy4vdHlwZXNjcmlwdCc7XG5pbXBvcnQge2lzRHRzRmlsZU5hbWV9IGZyb20gJy4vdXRpbCc7XG5cbi8vIE1hdGNoZXMgY29tbW9uIGV4dGVuc2lvbnMgb2YgVHlwZVNjcmlwdCBpbnB1dCBmaWxlbmFtZXNcbmNvbnN0IFRTX0VYVEVOU0lPTlMgPSAvKFxcLnRzfFxcLmRcXC50c3xcXC5qc3xcXC5qc3h8XFwudHN4KSQvO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVzNVByb2Nlc3Nvckhvc3Qge1xuICAvKipcbiAgICogVGFrZXMgYSBjb250ZXh0ICh0aGUgY3VycmVudCBmaWxlKSBhbmQgdGhlIHBhdGggb2YgdGhlIGZpbGUgdG8gaW1wb3J0XG4gICAqICBhbmQgZ2VuZXJhdGVzIGEgZ29vZ21vZHVsZSBtb2R1bGUgbmFtZVxuICAgKi9cbiAgcGF0aFRvTW9kdWxlTmFtZShjb250ZXh0OiBzdHJpbmcsIGltcG9ydFBhdGg6IHN0cmluZyk6IHN0cmluZztcbiAgLyoqXG4gICAqIElmIHdlIGRvIGdvb2dtb2R1bGUgcHJvY2Vzc2luZywgd2UgcG9seWZpbGwgbW9kdWxlLmlkLCBzaW5jZSB0aGF0J3NcbiAgICogcGFydCBvZiBFUzYgbW9kdWxlcy4gIFRoaXMgZnVuY3Rpb24gZGV0ZXJtaW5lcyB3aGF0IHRoZSBtb2R1bGUuaWQgd2lsbCBiZVxuICAgKiBmb3IgZWFjaCBmaWxlLlxuICAgKi9cbiAgZmlsZU5hbWVUb01vZHVsZUlkKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmc7XG4gIC8qKiBXaGV0aGVyIHRvIGNvbnZlcnQgQ29tbW9uSlMgbW9kdWxlIHN5bnRheCB0byBgZ29vZy5tb2R1bGVgIENsb3N1cmUgaW1wb3J0cy4gKi9cbiAgZ29vZ21vZHVsZT86IGJvb2xlYW47XG4gIC8qKiBXaGV0aGVyIHRoZSBlbWl0IHRhcmdldHMgRVM1IG9yIEVTNisuICovXG4gIGVzNU1vZGU/OiBib29sZWFuO1xuICAvKiogZXhwYW5kIFwiaW1wb3J0ICdmb28nO1wiIHRvIFwiaW1wb3J0ICdmb28vaW5kZXgnO1wiIGlmIGl0IHBvaW50cyB0byBhbiBpbmRleCBmaWxlLiAqL1xuICBjb252ZXJ0SW5kZXhJbXBvcnRTaG9ydGhhbmQ/OiBib29sZWFuO1xuICAvKipcbiAgICogQW4gYWRkaXRpb25hbCBwcmVsdWRlIHRvIGluc2VydCBpbiBmcm9udCBvZiB0aGUgZW1pdHRlZCBjb2RlLCBlLmcuIHRvIGltcG9ydCBhIHNoYXJlZCBsaWJyYXJ5LlxuICAgKi9cbiAgcHJlbHVkZT86IHN0cmluZztcblxuICBvcHRpb25zOiB0cy5Db21waWxlck9wdGlvbnM7XG4gIGhvc3Q6IHRzLk1vZHVsZVJlc29sdXRpb25Ib3N0O1xufVxuXG4vKipcbiAqIEV4dHJhY3RzIHRoZSBuYW1lc3BhY2UgcGFydCBvZiBhIGdvb2c6IGltcG9ydCwgb3IgcmV0dXJucyBudWxsIGlmIHRoZSBnaXZlblxuICogaW1wb3J0IGlzIG5vdCBhIGdvb2c6IGltcG9ydC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RHb29nTmFtZXNwYWNlSW1wb3J0KHRzSW1wb3J0OiBzdHJpbmcpOiBzdHJpbmd8bnVsbCB7XG4gIGlmICh0c0ltcG9ydC5tYXRjaCgvXmdvb2c6LykpIHJldHVybiB0c0ltcG9ydC5zdWJzdHJpbmcoJ2dvb2c6Jy5sZW5ndGgpO1xuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGZyb20gaW1wbGljaXQgYGltcG9ydCB7fSBmcm9tICdwa2cnYCB0byBgaW1wb3J0IHt9IGZyb20gJ3BrZy9pbmRleCcuXG4gKiBUeXBlU2NyaXB0IHN1cHBvcnRzIHRoZSBzaG9ydGhhbmQsIGJ1dCBub3QgYWxsIEVTNiBtb2R1bGUgbG9hZGVycyBkby5cbiAqIFdvcmthcm91bmQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTI1OTdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVJbmRleFNob3J0aGFuZChcbiAgICBob3N0OiB7b3B0aW9uczogdHMuQ29tcGlsZXJPcHRpb25zLCBob3N0OiB0cy5Nb2R1bGVSZXNvbHV0aW9uSG9zdH0sIGZpbGVOYW1lOiBzdHJpbmcsXG4gICAgaW1wb3J0ZWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHJlc29sdmVkID0gdHMucmVzb2x2ZU1vZHVsZU5hbWUoaW1wb3J0ZWQsIGZpbGVOYW1lLCBob3N0Lm9wdGlvbnMsIGhvc3QuaG9zdCk7XG4gIGlmICghcmVzb2x2ZWQgfHwgIXJlc29sdmVkLnJlc29sdmVkTW9kdWxlKSByZXR1cm4gaW1wb3J0ZWQ7XG4gIGNvbnN0IHJlcXVlc3RlZE1vZHVsZSA9IGltcG9ydGVkLnJlcGxhY2UoVFNfRVhURU5TSU9OUywgJycpO1xuICBjb25zdCByZXNvbHZlZE1vZHVsZSA9IHJlc29sdmVkLnJlc29sdmVkTW9kdWxlLnJlc29sdmVkRmlsZU5hbWUucmVwbGFjZShUU19FWFRFTlNJT05TLCAnJyk7XG4gIGlmIChyZXNvbHZlZE1vZHVsZS5pbmRleE9mKCdub2RlX21vZHVsZXMnKSA9PT0gLTEgJiZcbiAgICAgIHJlcXVlc3RlZE1vZHVsZS5zdWJzdHIocmVxdWVzdGVkTW9kdWxlLmxhc3RJbmRleE9mKCcvJykpICE9PVxuICAgICAgICAgIHJlc29sdmVkTW9kdWxlLnN1YnN0cihyZXNvbHZlZE1vZHVsZS5sYXN0SW5kZXhPZignLycpKSkge1xuICAgIGltcG9ydGVkID0gJy4vJyArIHBhdGgucmVsYXRpdmUocGF0aC5kaXJuYW1lKGZpbGVOYW1lKSwgcmVzb2x2ZWRNb2R1bGUpLnJlcGxhY2UocGF0aC5zZXAsICcvJyk7XG4gIH1cbiAgcmV0dXJuIGltcG9ydGVkO1xufVxuXG4vKipcbiAqIEVTNVByb2Nlc3NvciBwb3N0cHJvY2Vzc2VzIFR5cGVTY3JpcHQgY29tcGlsYXRpb24gb3V0cHV0IEpTLCB0byByZXdyaXRlIGNvbW1vbmpzIHJlcXVpcmUoKXMgaW50b1xuICogZ29vZy5yZXF1aXJlKCkuIENvbnRyYXJ5IHRvIGl0cyBuYW1lIGl0IGhhbmRsZXMgY29udmVydGluZyB0aGUgbW9kdWxlcyBpbiBib3RoIEVTNSBhbmQgRVM2XG4gKiBvdXRwdXRzLlxuICovXG5jbGFzcyBFUzVQcm9jZXNzb3IgZXh0ZW5kcyBSZXdyaXRlciB7XG4gIC8qKlxuICAgKiBuYW1lc3BhY2VJbXBvcnRzIGNvbGxlY3RzIHRoZSB2YXJpYWJsZXMgZm9yIGltcG9ydGVkIGdvb2cubW9kdWxlcy5cbiAgICogSWYgdGhlIG9yaWdpbmFsIFRTIGlucHV0IGlzOlxuICAgKiAgIGltcG9ydCBmb28gZnJvbSAnZ29vZzpiYXInO1xuICAgKiB0aGVuIFRTIHByb2R1Y2VzOlxuICAgKiAgIHZhciBmb28gPSByZXF1aXJlKCdnb29nOmJhcicpO1xuICAgKiBhbmQgdGhpcyBjbGFzcyByZXdyaXRlcyBpdCB0bzpcbiAgICogICB2YXIgZm9vID0gcmVxdWlyZSgnZ29vZy5iYXInKTtcbiAgICogQWZ0ZXIgdGhpcyBzdGVwLCBuYW1lc3BhY2VJbXBvcnRzWydmb28nXSBpcyB0cnVlLlxuICAgKiAoVGhpcyBpcyB1c2VkIHRvIHJld3JpdGUgJ2Zvby5kZWZhdWx0JyBpbnRvIGp1c3QgJ2ZvbycuKVxuICAgKi9cbiAgbmFtZXNwYWNlSW1wb3J0cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gIC8qKlxuICAgKiBtb2R1bGVWYXJpYWJsZXMgbWFwcyBmcm9tIG1vZHVsZSBuYW1lcyB0byB0aGUgdmFyaWFibGVzIHRoZXkncmUgYXNzaWduZWQgdG8uXG4gICAqIENvbnRpbnVpbmcgdGhlIGFib3ZlIGV4YW1wbGUsIG1vZHVsZVZhcmlhYmxlc1snZ29vZy5iYXInXSA9ICdmb28nLlxuICAgKi9cbiAgbW9kdWxlVmFyaWFibGVzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblxuICAvKiogc3RyaXBwZWRTdHJpY3QgaXMgdHJ1ZSBvbmNlIHdlJ3ZlIHN0cmlwcGVkIGEgXCJ1c2Ugc3RyaWN0XCI7IGZyb20gdGhlIGlucHV0LiAqL1xuICBzdHJpcHBlZFN0cmljdCA9IGZhbHNlO1xuXG4gIC8qKiB1bnVzZWRJbmRleCBpcyB1c2VkIHRvIGdlbmVyYXRlIGZyZXNoIHN5bWJvbHMgZm9yIHVubmFtZWQgaW1wb3J0cy4gKi9cbiAgdW51c2VkSW5kZXggPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaG9zdDogRXM1UHJvY2Vzc29ySG9zdCwgZmlsZTogdHMuU291cmNlRmlsZSkge1xuICAgIHN1cGVyKGZpbGUpO1xuICB9XG5cbiAgcHJvY2VzcygpOiB7b3V0cHV0OiBzdHJpbmcsIHJlZmVyZW5jZWRNb2R1bGVzOiBzdHJpbmdbXX0ge1xuICAgIHRoaXMuZW1pdEZpbGVDb21tZW50KCk7XG5cbiAgICBjb25zdCBtb2R1bGVJZCA9IHRoaXMuaG9zdC5maWxlTmFtZVRvTW9kdWxlSWQodGhpcy5maWxlLmZpbGVOYW1lKTtcbiAgICBjb25zdCBtb2R1bGVOYW1lID0gdGhpcy5ob3N0LnBhdGhUb01vZHVsZU5hbWUoJycsIHRoaXMuZmlsZS5maWxlTmFtZSk7XG4gICAgLy8gTkI6IE5vIGxpbmVicmVhayBhZnRlciBtb2R1bGUgY2FsbCBzbyBzb3VyY2VtYXBzIGFyZSBub3Qgb2Zmc2V0LlxuICAgIHRoaXMuZW1pdChgZ29vZy5tb2R1bGUoJyR7bW9kdWxlTmFtZX0nKTtgKTtcbiAgICBpZiAodGhpcy5ob3N0LnByZWx1ZGUpIHRoaXMuZW1pdCh0aGlzLmhvc3QucHJlbHVkZSk7XG4gICAgLy8gQWxsb3cgY29kZSB0byB1c2UgYG1vZHVsZS5pZGAgdG8gZGlzY292ZXIgaXRzIG1vZHVsZSBVUkwsIGUuZy4gdG8gcmVzb2x2ZVxuICAgIC8vIGEgdGVtcGxhdGUgVVJMIGFnYWluc3QuXG4gICAgLy8gVXNlcyAndmFyJywgYXMgdGhpcyBjb2RlIGlzIGluc2VydGVkIGluIEVTNiBhbmQgRVM1IG1vZGVzLlxuICAgIC8vIFRoZSBmb2xsb3dpbmcgcGF0dGVybiBlbnN1cmVzIGNsb3N1cmUgZG9lc24ndCB0aHJvdyBhbiBlcnJvciBpbiBhZHZhbmNlZFxuICAgIC8vIG9wdGltaXphdGlvbnMgbW9kZS5cbiAgICBpZiAodGhpcy5ob3N0LmVzNU1vZGUpIHtcbiAgICAgIHRoaXMuZW1pdChgdmFyIG1vZHVsZSA9IG1vZHVsZSB8fCB7aWQ6ICcke21vZHVsZUlkfSd9O2ApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGUgYGV4cG9ydHMgPSB7fWAgc2VydmVzIGFzIGEgZGVmYXVsdCBleHBvcnQgdG8gZGlzYWJsZSBDbG9zdXJlIENvbXBpbGVyJ3MgZXJyb3IgY2hlY2tpbmdcbiAgICAgIC8vIGZvciBtdXRhYmxlIGV4cG9ydHMuIFRoYXQncyBPSyBiZWNhdXNlIFRTIGNvbXBpbGVyIG1ha2VzIHN1cmUgdGhhdCBjb25zdW1pbmcgY29kZSBhbHdheXNcbiAgICAgIC8vIGFjY2Vzc2VzIGV4cG9ydHMgdGhyb3VnaCB0aGUgbW9kdWxlIG9iamVjdCwgc28gbXV0YWJsZSBleHBvcnRzIHdvcmsuXG4gICAgICAvLyBJdCBpcyBvbmx5IGluc2VydGVkIGluIEVTNiBiZWNhdXNlIHdlIHN0cmlwIGAuZGVmYXVsdGAgYWNjZXNzZXMgaW4gRVM1IG1vZGUsIHdoaWNoIGJyZWFrc1xuICAgICAgLy8gd2hlbiBhc3NpZ25pbmcgYW4gYGV4cG9ydHMgPSB7fWAgb2JqZWN0IGFuZCB0aGVuIGxhdGVyIGFjY2Vzc2luZyBpdC5cbiAgICAgIC8vIEhvd2V2ZXIgQ2xvc3VyZSBiYWlscyBpZiBjb2RlIGxhdGVyIG9uIGFzc2lnbnMgaW50byBleHBvcnRzIGRpcmVjdGx5LCBhcyB3ZSBkbyBpZiB3ZSBoYXZlXG4gICAgICAvLyBhbiBcImV4cG9ydHMgPSBcIiBibG9jaywgc28gc2tpcCBlbWl0IGlmIHRoYXQncyB0aGUgY2FzZS5cbiAgICAgIGlmICghdGhpcy5maWxlLnN0YXRlbWVudHMuZmluZChcbiAgICAgICAgICAgICAgcyA9PiB0cy5pc0V4cHJlc3Npb25TdGF0ZW1lbnQocykgJiYgdGhpcy5pc01vZHVsZUV4cG9ydHNBc3NpZ25tZW50KHMpKSkge1xuICAgICAgICB0aGlzLmVtaXQoYCBleHBvcnRzID0ge307YCk7XG4gICAgICB9XG4gICAgICAvLyBUaGUgbW9kdWxlPW1vZHVsZSBiaXQgc3VwcHJlc3NlcyBhbiB1bnVzZWQgdmFyaWFibGUgd2FybmluZyB3aGljaFxuICAgICAgLy8gbWF5IHRyaWdnZXIgZGVwZW5kaW5nIG9uIHRoZSBjb21waWxhdGlvbiBmbGFncy5cbiAgICAgIHRoaXMuZW1pdChgIHZhciBtb2R1bGUgPSB7aWQ6ICcke21vZHVsZUlkfSd9OyBtb2R1bGUgPSBtb2R1bGU7YCk7XG4gICAgfVxuXG4gICAgbGV0IHBvcyA9IDA7XG4gICAgZm9yIChjb25zdCBzdG10IG9mIHRoaXMuZmlsZS5zdGF0ZW1lbnRzKSB7XG4gICAgICB0aGlzLndyaXRlUmFuZ2UodGhpcy5maWxlLCBwb3MsIHN0bXQuZ2V0RnVsbFN0YXJ0KCkpO1xuICAgICAgdGhpcy52aXNpdFRvcExldmVsKHN0bXQpO1xuICAgICAgcG9zID0gc3RtdC5nZXRFbmQoKTtcbiAgICB9XG4gICAgdGhpcy53cml0ZVJhbmdlKHRoaXMuZmlsZSwgcG9zLCB0aGlzLmZpbGUuZ2V0RW5kKCkpO1xuXG4gICAgY29uc3QgcmVmZXJlbmNlZE1vZHVsZXMgPSBBcnJheS5mcm9tKHRoaXMubW9kdWxlVmFyaWFibGVzLmtleXMoKSk7XG4gICAgLy8gTm90ZTogZG9uJ3Qgc29ydCByZWZlcmVuY2VkTW9kdWxlcywgYXMgdGhlIGtleXMgYXJlIGluIHRoZSBzYW1lIG9yZGVyXG4gICAgLy8gdGhleSBvY2N1ciBpbiB0aGUgc291cmNlIGZpbGUuXG4gICAgY29uc3Qge291dHB1dH0gPSB0aGlzLmdldE91dHB1dCgpO1xuICAgIHJldHVybiB7b3V0cHV0LCByZWZlcmVuY2VkTW9kdWxlc307XG4gIH1cblxuICAvKiogRW1pdHMgZmlsZSBjb21tZW50cyBmb3IgdGhlIGN1cnJlbnQgc291cmNlIGZpbGUsIGlmIGFueS4gKi9cbiAgcHJpdmF0ZSBlbWl0RmlsZUNvbW1lbnQoKSB7XG4gICAgY29uc3QgbGVhZGluZ0NvbW1lbnRzID0gdHMuZ2V0TGVhZGluZ0NvbW1lbnRSYW5nZXModGhpcy5maWxlLmdldEZ1bGxUZXh0KCksIDApIHx8IFtdO1xuICAgIGNvbnN0IGZpbGVDb21tZW50ID0gbGVhZGluZ0NvbW1lbnRzLmZpbmQoYyA9PiB7XG4gICAgICBpZiAoYy5raW5kICE9PSB0cy5TeW50YXhLaW5kLk11bHRpTGluZUNvbW1lbnRUcml2aWEpIHJldHVybiBmYWxzZTtcbiAgICAgIGNvbnN0IGNvbW1lbnRUZXh0ID0gdGhpcy5maWxlLmdldEZ1bGxUZXh0KCkuc3Vic3RyaW5nKGMucG9zLCBjLmVuZCk7XG4gICAgICByZXR1cm4gaXNDbG9zdXJlRmlsZW92ZXJ2aWV3Q29tbWVudChjb21tZW50VGV4dCk7XG4gICAgfSk7XG4gICAgaWYgKCFmaWxlQ29tbWVudCkgcmV0dXJuO1xuICAgIGxldCBlbmQgPSBmaWxlQ29tbWVudC5lbmQ7XG4gICAgaWYgKGZpbGVDb21tZW50Lmhhc1RyYWlsaW5nTmV3TGluZSkgZW5kKys7XG4gICAgdGhpcy53cml0ZUxlYWRpbmdUcml2aWEodGhpcy5maWxlLCBlbmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIHZpc2l0VG9wTGV2ZWwgcHJvY2Vzc2VzIGEgdG9wLWxldmVsIHRzLk5vZGUgYW5kIGVtaXRzIGl0cyBjb250ZW50cy5cbiAgICpcbiAgICogSXQncyBzZXBhcmF0ZSBmcm9tIHRoZSBub3JtYWwgUmV3cml0ZXIgcmVjdXJzaXZlIHRyYXZlcnNhbFxuICAgKiBiZWNhdXNlIHNvbWUgdG9wLWxldmVsIHN0YXRlbWVudHMgYXJlIGhhbmRsZWQgc3BlY2lhbGx5LlxuICAgKi9cbiAgdmlzaXRUb3BMZXZlbChub2RlOiB0cy5Ob2RlKSB7XG4gICAgc3dpdGNoIChub2RlLmtpbmQpIHtcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5FeHByZXNzaW9uU3RhdGVtZW50OlxuICAgICAgICBjb25zdCBleHByU3RhdGVtZW50ID0gbm9kZSBhcyB0cy5FeHByZXNzaW9uU3RhdGVtZW50O1xuICAgICAgICAvLyBDaGVjayBmb3IgXCJ1c2Ugc3RyaWN0XCIgYW5kIHNraXAgaXQgaWYgbmVjZXNzYXJ5LlxuICAgICAgICBpZiAoIXRoaXMuc3RyaXBwZWRTdHJpY3QgJiYgdGhpcy5pc1VzZVN0cmljdChub2RlKSkge1xuICAgICAgICAgIHRoaXMuZW1pdENvbW1lbnRXaXRob3V0U3RhdGVtZW50Qm9keShub2RlKTtcbiAgICAgICAgICB0aGlzLnN0cmlwcGVkU3RyaWN0ID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgZm9yOlxuICAgICAgICAvLyAtIFwicmVxdWlyZSgnZm9vJyk7XCIgKGEgcmVxdWlyZSBmb3IgaXRzIHNpZGUgZWZmZWN0cylcbiAgICAgICAgLy8gLSBcIl9fZXhwb3J0KHJlcXVpcmUoLi4uKSk7XCIgKGFuIFwiZXhwb3J0ICogZnJvbSAuLi5cIilcbiAgICAgICAgaWYgKHRoaXMuZW1pdFJld3JpdHRlblJlcXVpcmVzKG5vZGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGZvclxuICAgICAgICAvLyAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgLi4uKTtcbiAgICAgICAgaWYgKHRoaXMuaXNFc01vZHVsZVByb3BlcnR5KGV4cHJTdGF0ZW1lbnQpKSB7XG4gICAgICAgICAgdGhpcy5lbWl0Q29tbWVudFdpdGhvdXRTdGF0ZW1lbnRCb2R5KG5vZGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBmb3JcbiAgICAgICAgLy8gICBtb2R1bGUuZXhwb3J0cyA9IC4uLjtcbiAgICAgICAgLy8gUmV3cml0ZSB0byBnb29nLm1vZHVsZSdzXG4gICAgICAgIC8vICAgZXhwb3J0cyA9IC4uLjtcbiAgICAgICAgaWYgKHRoaXMuaXNNb2R1bGVFeHBvcnRzQXNzaWdubWVudChleHByU3RhdGVtZW50KSkge1xuICAgICAgICAgIHRoaXMuZW1pdEV4cG9ydHNBc3NpZ25tZW50KGV4cHJTdGF0ZW1lbnQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBPdGhlcndpc2UgZmFsbCB0aHJvdWdoIHRvIGRlZmF1bHQgcHJvY2Vzc2luZy5cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuVmFyaWFibGVTdGF0ZW1lbnQ6XG4gICAgICAgIC8vIENoZWNrIGZvciBhIFwidmFyIHggPSByZXF1aXJlKCdmb28nKTtcIi5cbiAgICAgICAgaWYgKHRoaXMuZW1pdFJld3JpdHRlblJlcXVpcmVzKG5vZGUpKSByZXR1cm47XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMudmlzaXQobm9kZSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIFR5cGVTY3JpcHQgQVNUIGF0dGFjaGVzIGNvbW1lbnRzIHRvIHN0YXRlbWVudCBub2Rlcywgc28gZXZlbiBpZiBhIG5vZGVcbiAgICogY29udGFpbnMgY29kZSB3ZSB3YW50IHRvIHNraXAgZW1pdHRpbmcsIHdlIG5lZWQgdG8gZW1pdCB0aGUgYXR0YWNoZWRcbiAgICogY29tbWVudChzKS5cbiAgICovXG4gIGVtaXRDb21tZW50V2l0aG91dFN0YXRlbWVudEJvZHkobm9kZTogdHMuTm9kZSkge1xuICAgIHRoaXMud3JpdGVMZWFkaW5nVHJpdmlhKG5vZGUpO1xuICB9XG5cbiAgLyoqIGlzVXNlU3RyaWN0IHJldHVybnMgdHJ1ZSBpZiBub2RlIGlzIGEgXCJ1c2Ugc3RyaWN0XCI7IHN0YXRlbWVudC4gKi9cbiAgaXNVc2VTdHJpY3Qobm9kZTogdHMuTm9kZSk6IGJvb2xlYW4ge1xuICAgIGlmIChub2RlLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuRXhwcmVzc2lvblN0YXRlbWVudCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGV4cHJTdG10ID0gbm9kZSBhcyB0cy5FeHByZXNzaW9uU3RhdGVtZW50O1xuICAgIGNvbnN0IGV4cHIgPSBleHByU3RtdC5leHByZXNzaW9uO1xuICAgIGlmIChleHByLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGxpdGVyYWwgPSBleHByIGFzIHRzLlN0cmluZ0xpdGVyYWw7XG4gICAgcmV0dXJuIGxpdGVyYWwudGV4dCA9PT0gJ3VzZSBzdHJpY3QnO1xuICB9XG5cbiAgLyoqXG4gICAqIGVtaXRSZXdyaXR0ZW5SZXF1aXJlcyByZXdyaXRlcyByZXF1aXJlKClzIGludG8gZ29vZy5yZXF1aXJlKCkgZXF1aXZhbGVudHMuXG4gICAqXG4gICAqIEByZXR1cm4gVHJ1ZSBpZiB0aGUgbm9kZSB3YXMgcmV3cml0dGVuLCBmYWxzZSBpZiBuZWVkcyBvcmRpbmFyeSBwcm9jZXNzaW5nLlxuICAgKi9cbiAgZW1pdFJld3JpdHRlblJlcXVpcmVzKG5vZGU6IHRzLk5vZGUpOiBib29sZWFuIHtcbiAgICAvLyBXZSdyZSBsb29raW5nIGZvciByZXF1aXJlcywgb2Ygb25lIG9mIHRoZSBmb3JtczpcbiAgICAvLyAtIFwidmFyIGltcG9ydE5hbWUgPSByZXF1aXJlKC4uLik7XCIuXG4gICAgLy8gLSBcInJlcXVpcmUoLi4uKTtcIi5cbiAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlU3RhdGVtZW50KSB7XG4gICAgICAvLyBJdCdzIHBvc3NpYmx5IG9mIHRoZSBmb3JtIFwidmFyIHggPSByZXF1aXJlKC4uLik7XCIuXG4gICAgICBjb25zdCB2YXJTdG10ID0gbm9kZSBhcyB0cy5WYXJpYWJsZVN0YXRlbWVudDtcblxuICAgICAgLy8gVmVyaWZ5IGl0J3MgYSBzaW5nbGUgZGVjbCAoYW5kIG5vdCBcInZhciB4ID0gLi4uLCB5ID0gLi4uO1wiKS5cbiAgICAgIGlmICh2YXJTdG10LmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnMubGVuZ3RoICE9PSAxKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCBkZWNsID0gdmFyU3RtdC5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zWzBdO1xuXG4gICAgICAvLyBHcmFiIHRoZSB2YXJpYWJsZSBuYW1lIChhdm9pZGluZyB0aGluZ3MgbGlrZSBkZXN0cnVjdHVyaW5nIGJpbmRzKS5cbiAgICAgIGlmIChkZWNsLm5hbWUua2luZCAhPT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCB2YXJOYW1lID0gZ2V0SWRlbnRpZmllclRleHQoZGVjbC5uYW1lIGFzIHRzLklkZW50aWZpZXIpO1xuICAgICAgaWYgKCFkZWNsLmluaXRpYWxpemVyIHx8IGRlY2wuaW5pdGlhbGl6ZXIua2luZCAhPT0gdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvbikgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgY2FsbCA9IGRlY2wuaW5pdGlhbGl6ZXIgYXMgdHMuQ2FsbEV4cHJlc3Npb247XG4gICAgICBjb25zdCByZXF1aXJlID0gdGhpcy5leHRyYWN0UmVxdWlyZShjYWxsKTtcbiAgICAgIGlmICghcmVxdWlyZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgdGhpcy53cml0ZUxlYWRpbmdUcml2aWEobm9kZSk7XG4gICAgICB0aGlzLmVtaXRHb29nUmVxdWlyZSh2YXJOYW1lLCByZXF1aXJlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkV4cHJlc3Npb25TdGF0ZW1lbnQpIHtcbiAgICAgIC8vIEl0J3MgcG9zc2libHkgb2YgdGhlIGZvcm06XG4gICAgICAvLyAtIHJlcXVpcmUoLi4uKTtcbiAgICAgIC8vIC0gX19leHBvcnQocmVxdWlyZSguLi4pKTtcbiAgICAgIC8vIC0gdHNsaWJfMS5fX2V4cG9ydFN0YXIocmVxdWlyZSguLi4pKTtcbiAgICAgIC8vIEFsbCBhcmUgQ2FsbEV4cHJlc3Npb25zLlxuICAgICAgY29uc3QgZXhwclN0bXQgPSBub2RlIGFzIHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQ7XG4gICAgICBjb25zdCBleHByID0gZXhwclN0bXQuZXhwcmVzc2lvbjtcbiAgICAgIGlmIChleHByLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuQ2FsbEV4cHJlc3Npb24pIHJldHVybiBmYWxzZTtcbiAgICAgIGxldCBjYWxsID0gZXhwciBhcyB0cy5DYWxsRXhwcmVzc2lvbjtcblxuICAgICAgbGV0IHJlcXVpcmUgPSB0aGlzLmV4dHJhY3RSZXF1aXJlKGNhbGwpO1xuICAgICAgbGV0IGlzRXhwb3J0ID0gZmFsc2U7XG4gICAgICBpZiAoIXJlcXVpcmUpIHtcbiAgICAgICAgLy8gSWYgaXQncyBhbiBfX2V4cG9ydChyZXF1aXJlKC4uLikpLCB3ZSBlbWl0OlxuICAgICAgICAvLyAgIHZhciB4ID0gcmVxdWlyZSguLi4pO1xuICAgICAgICAvLyAgIF9fZXhwb3J0KHgpO1xuICAgICAgICAvLyBUaGlzIGV4dHJhIHZhcmlhYmxlIGlzIG5lY2Vzc2FyeSBpbiBjYXNlIHRoZXJlJ3MgYSBsYXRlciBpbXBvcnQgb2YgdGhlXG4gICAgICAgIC8vIHNhbWUgbW9kdWxlIG5hbWUuXG4gICAgICAgIGNvbnN0IGlubmVyQ2FsbCA9IHRoaXMuaXNFeHBvcnRSZXF1aXJlKGNhbGwpO1xuICAgICAgICBpZiAoIWlubmVyQ2FsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpc0V4cG9ydCA9IHRydWU7XG4gICAgICAgIGNhbGwgPSBpbm5lckNhbGw7ICAvLyBVcGRhdGUgY2FsbCB0byBwb2ludCBhdCB0aGUgcmVxdWlyZSgpIGV4cHJlc3Npb24uXG4gICAgICAgIHJlcXVpcmUgPSB0aGlzLmV4dHJhY3RSZXF1aXJlKGNhbGwpO1xuICAgICAgfVxuICAgICAgaWYgKCFyZXF1aXJlKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHRoaXMud3JpdGVMZWFkaW5nVHJpdmlhKG5vZGUpO1xuICAgICAgY29uc3QgdmFyTmFtZSA9IHRoaXMuZW1pdEdvb2dSZXF1aXJlKG51bGwsIHJlcXVpcmUpO1xuXG4gICAgICBpZiAoaXNFeHBvcnQpIHtcbiAgICAgICAgLy8gbm9kZSBpcyBhIHN0YXRlbWVudCBjb250YWluaW5nIGEgcmVxdWlyZSgpIGluIGl0LCB3aGlsZVxuICAgICAgICAvLyByZXF1aXJlQ2FsbCBpcyB0aGF0IGNhbGwuICBXZSByZXBsYWNlIHRoZSByZXF1aXJlKCkgY2FsbFxuICAgICAgICAvLyB3aXRoIHRoZSB2YXJpYWJsZSB3ZSBlbWl0dGVkLlxuICAgICAgICBjb25zdCBmdWxsU3RhdGVtZW50ID0gbm9kZS5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IHJlcXVpcmVDYWxsID0gY2FsbC5nZXRUZXh0KCk7XG4gICAgICAgIHRoaXMuZW1pdChmdWxsU3RhdGVtZW50LnJlcGxhY2UocmVxdWlyZUNhbGwsIHZhck5hbWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJdCdzIHNvbWUgb3RoZXIgdHlwZSBvZiBzdGF0ZW1lbnQuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIGEgZ29vZy5yZXF1aXJlKCkgc3RhdGVtZW50IGZvciBhIGdpdmVuIHZhcmlhYmxlIG5hbWUgYW5kIFR5cGVTY3JpcHQgaW1wb3J0LlxuICAgKlxuICAgKiBFLmcuIGZyb206XG4gICAqICAgdmFyIHZhck5hbWUgPSByZXF1aXJlKCd0c0ltcG9ydCcpO1xuICAgKiBwcm9kdWNlczpcbiAgICogICB2YXIgdmFyTmFtZSA9IGdvb2cucmVxdWlyZSgnZ29vZy5tb2R1bGUubmFtZScpO1xuICAgKlxuICAgKiBJZiB0aGUgaW5wdXQgdmFyTmFtZSBpcyBudWxsLCBnZW5lcmF0ZXMgYSBuZXcgdmFyaWFibGUgbmFtZSBpZiBuZWNlc3NhcnkuXG4gICAqXG4gICAqIEByZXR1cm4gVGhlIHZhcmlhYmxlIG5hbWUgZm9yIHRoZSBpbXBvcnRlZCBtb2R1bGUsIHJldXNpbmcgYSBwcmV2aW91cyBpbXBvcnQgaWYgb25lXG4gICAqICAgIGlzIGF2YWlsYWJsZS5cbiAgICovXG4gIGVtaXRHb29nUmVxdWlyZSh2YXJOYW1lOiBzdHJpbmd8bnVsbCwgdHNJbXBvcnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IG1vZE5hbWU6IHN0cmluZztcbiAgICBsZXQgaXNOYW1lc3BhY2VJbXBvcnQgPSBmYWxzZTtcbiAgICBjb25zdCBuc0ltcG9ydCA9IGV4dHJhY3RHb29nTmFtZXNwYWNlSW1wb3J0KHRzSW1wb3J0KTtcbiAgICBpZiAobnNJbXBvcnQgIT09IG51bGwpIHtcbiAgICAgIC8vIFRoaXMgaXMgYSBuYW1lc3BhY2UgaW1wb3J0LCBvZiB0aGUgZm9ybSBcImdvb2c6Zm9vLmJhclwiLlxuICAgICAgLy8gRml4IGl0IHRvIGp1c3QgXCJmb28uYmFyXCIuXG4gICAgICBtb2ROYW1lID0gbnNJbXBvcnQ7XG4gICAgICBpc05hbWVzcGFjZUltcG9ydCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmhvc3QuY29udmVydEluZGV4SW1wb3J0U2hvcnRoYW5kKSB7XG4gICAgICAgIHRzSW1wb3J0ID0gcmVzb2x2ZUluZGV4U2hvcnRoYW5kKHRoaXMuaG9zdCwgdGhpcy5maWxlLmZpbGVOYW1lLCB0c0ltcG9ydCk7XG4gICAgICB9XG4gICAgICBtb2ROYW1lID0gdGhpcy5ob3N0LnBhdGhUb01vZHVsZU5hbWUodGhpcy5maWxlLmZpbGVOYW1lLCB0c0ltcG9ydCk7XG4gICAgfVxuXG4gICAgaWYgKCF2YXJOYW1lKSB7XG4gICAgICBjb25zdCBtdiA9IHRoaXMubW9kdWxlVmFyaWFibGVzLmdldChtb2ROYW1lKTtcbiAgICAgIGlmIChtdikge1xuICAgICAgICAvLyBDYWxsZXIgZGlkbid0IHJlcXVlc3QgYSBzcGVjaWZpYyB2YXJpYWJsZSBuYW1lIGFuZCB3ZSd2ZSBhbHJlYWR5XG4gICAgICAgIC8vIGltcG9ydGVkIHRoZSBtb2R1bGUsIHNvIGp1c3QgcmV0dXJuIHRoZSBuYW1lIHdlIGFscmVhZHkgaGF2ZSBmb3IgdGhpcyBtb2R1bGUuXG4gICAgICAgIHJldHVybiBtdjtcbiAgICAgIH1cblxuICAgICAgLy8gTm90ZTogd2UgYWx3YXlzIGludHJvZHVjZSBhIHZhcmlhYmxlIGZvciBhbnkgaW1wb3J0LCByZWdhcmRsZXNzIG9mIHdoZXRoZXJcbiAgICAgIC8vIHRoZSBjYWxsZXIgcmVxdWVzdGVkIG9uZS4gIFRoaXMgYXZvaWRzIGEgQ2xvc3VyZSBlcnJvci5cbiAgICAgIHZhck5hbWUgPSB0aGlzLmdlbmVyYXRlRnJlc2hWYXJpYWJsZU5hbWUoKTtcbiAgICB9XG5cbiAgICBpZiAoaXNOYW1lc3BhY2VJbXBvcnQpIHRoaXMubmFtZXNwYWNlSW1wb3J0cy5hZGQodmFyTmFtZSk7XG4gICAgaWYgKHRoaXMubW9kdWxlVmFyaWFibGVzLmhhcyhtb2ROYW1lKSkge1xuICAgICAgdGhpcy5lbWl0KGB2YXIgJHt2YXJOYW1lfSA9ICR7dGhpcy5tb2R1bGVWYXJpYWJsZXMuZ2V0KG1vZE5hbWUpfTtgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbWl0KGB2YXIgJHt2YXJOYW1lfSA9IGdvb2cucmVxdWlyZSgnJHttb2ROYW1lfScpO2ApO1xuICAgICAgdGhpcy5tb2R1bGVWYXJpYWJsZXMuc2V0KG1vZE5hbWUsIHZhck5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gdmFyTmFtZTtcbiAgfVxuICAvLyB3b3JrYXJvdW5kIGZvciBzeW50YXggaGlnaGxpZ2h0aW5nIGJ1ZyBpbiBTdWJsaW1lOiBgXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHN0cmluZyBhcmd1bWVudCBpZiBjYWxsIGlzIG9mIHRoZSBmb3JtXG4gICAqICAgcmVxdWlyZSgnZm9vJylcbiAgICovXG4gIGV4dHJhY3RSZXF1aXJlKGNhbGw6IHRzLkNhbGxFeHByZXNzaW9uKTogc3RyaW5nfG51bGwge1xuICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBjYWxsIGlzIGEgY2FsbCB0byByZXF1aXJlKC4uLikuXG4gICAgaWYgKGNhbGwuZXhwcmVzc2lvbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IGlkZW50ID0gY2FsbC5leHByZXNzaW9uIGFzIHRzLklkZW50aWZpZXI7XG4gICAgaWYgKGdldElkZW50aWZpZXJUZXh0KGlkZW50KSAhPT0gJ3JlcXVpcmUnKSByZXR1cm4gbnVsbDtcblxuICAgIC8vIFZlcmlmeSB0aGUgY2FsbCB0YWtlcyBhIHNpbmdsZSBzdHJpbmcgYXJndW1lbnQgYW5kIGdyYWIgaXQuXG4gICAgaWYgKGNhbGwuYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgYXJnID0gY2FsbC5hcmd1bWVudHNbMF07XG4gICAgaWYgKGFyZy5raW5kICE9PSB0cy5TeW50YXhLaW5kLlN0cmluZ0xpdGVyYWwpIHJldHVybiBudWxsO1xuICAgIHJldHVybiAoYXJnIGFzIHRzLlN0cmluZ0xpdGVyYWwpLnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcmVxdWlyZSgpIGNhbGwgbm9kZSBpZiB0aGUgb3V0ZXIgY2FsbCBpcyBvZiB0aGUgZm9ybXM6XG4gICAqIC0gX19leHBvcnQocmVxdWlyZSgnZm9vJykpXG4gICAqIC0gdHNsaWJfMS5fX2V4cG9ydFN0YXIocmVxdWlyZSgnZm9vJyksIGJhcilcbiAgICovXG4gIGlzRXhwb3J0UmVxdWlyZShjYWxsOiB0cy5DYWxsRXhwcmVzc2lvbik6IHRzLkNhbGxFeHByZXNzaW9ufG51bGwge1xuICAgIHN3aXRjaCAoY2FsbC5leHByZXNzaW9uLmtpbmQpIHtcbiAgICAgIGNhc2UgdHMuU3ludGF4S2luZC5JZGVudGlmaWVyOlxuICAgICAgICBjb25zdCBpZGVudCA9IGNhbGwuZXhwcmVzc2lvbiBhcyB0cy5JZGVudGlmaWVyO1xuICAgICAgICAvLyBUU18yNF9DT01QQVQ6IGFjY2VwdCB0aHJlZSBsZWFkaW5nIHVuZGVyc2NvcmVzXG4gICAgICAgIGlmIChpZGVudC50ZXh0ICE9PSAnX19leHBvcnQnICYmIGlkZW50LnRleHQgIT09ICdfX19leHBvcnQnKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRzLlN5bnRheEtpbmQuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uOlxuICAgICAgICBjb25zdCBwcm9wQWNjZXNzID0gY2FsbC5leHByZXNzaW9uIGFzIHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbjtcbiAgICAgICAgLy8gVFNfMjRfQ09NUEFUOiBhY2NlcHQgdGhyZWUgbGVhZGluZyB1bmRlcnNjb3Jlc1xuICAgICAgICBpZiAocHJvcEFjY2Vzcy5uYW1lLnRleHQgIT09ICdfX2V4cG9ydFN0YXInICYmIHByb3BBY2Nlc3MubmFtZS50ZXh0ICE9PSAnX19fZXhwb3J0U3RhcicpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIFZlcmlmeSB0aGUgY2FsbCB0YWtlcyBhdCBsZWFzdCBvbmUgYXJndW1lbnQgYW5kIGNoZWNrIGl0LlxuICAgIGlmIChjYWxsLmFyZ3VtZW50cy5sZW5ndGggPCAxKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBhcmcgPSBjYWxsLmFyZ3VtZW50c1swXTtcbiAgICBpZiAoYXJnLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuQ2FsbEV4cHJlc3Npb24pIHJldHVybiBudWxsO1xuICAgIGNvbnN0IGlubmVyQ2FsbCA9IGFyZyBhcyB0cy5DYWxsRXhwcmVzc2lvbjtcbiAgICBpZiAoIXRoaXMuZXh0cmFjdFJlcXVpcmUoaW5uZXJDYWxsKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGlubmVyQ2FsbDtcbiAgfVxuXG4gIGlzRXNNb2R1bGVQcm9wZXJ0eShleHByOiB0cy5FeHByZXNzaW9uU3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgLy8gV2UncmUgbWF0Y2hpbmcgdGhlIGV4cGxpY2l0IHNvdXJjZSB0ZXh0IGdlbmVyYXRlZCBieSB0aGUgVFMgY29tcGlsZXIuXG4gICAgcmV0dXJuIGV4cHIuZ2V0VGV4dCgpID09PSAnT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pOyc7XG4gIH1cblxuICBpc01vZHVsZUV4cG9ydHNBc3NpZ25tZW50KGV4cHI6IHRzLkV4cHJlc3Npb25TdGF0ZW1lbnQpOiBib29sZWFuIHtcbiAgICAvLyBMb29raW5nIGZvciBcIm1vZHVsZS5leHBvcnRzID0gLi4uO1wiXG4gICAgaWYgKCF0cy5pc0JpbmFyeUV4cHJlc3Npb24oZXhwci5leHByZXNzaW9uKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChleHByLmV4cHJlc3Npb24ub3BlcmF0b3JUb2tlbi5raW5kICE9PSB0cy5TeW50YXhLaW5kLkVxdWFsc1Rva2VuKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIGV4cHIuZXhwcmVzc2lvbi5sZWZ0LmdldFRleHQoKSA9PT0gJ21vZHVsZS5leHBvcnRzJztcbiAgfVxuXG4gIGVtaXRFeHBvcnRzQXNzaWdubWVudChleHByOiB0cy5FeHByZXNzaW9uU3RhdGVtZW50KSB7XG4gICAgdGhpcy5lbWl0Q29tbWVudFdpdGhvdXRTdGF0ZW1lbnRCb2R5KGV4cHIpO1xuICAgIHRoaXMuZW1pdCgnZXhwb3J0cyA9Jyk7XG4gICAgdGhpcy52aXNpdCgoZXhwci5leHByZXNzaW9uIGFzIHRzLkJpbmFyeUV4cHJlc3Npb24pLnJpZ2h0KTtcbiAgICB0aGlzLmVtaXQoJzsnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBtYXliZVByb2Nlc3MgaXMgY2FsbGVkIGR1cmluZyB0aGUgcmVjdXJzaXZlIHRyYXZlcnNhbCBvZiB0aGUgcHJvZ3JhbSdzIEFTVC5cbiAgICpcbiAgICogQHJldHVybiBUcnVlIGlmIHRoZSBub2RlIHdhcyBwcm9jZXNzZWQvZW1pdHRlZCwgZmFsc2UgaWYgaXQgc2hvdWxkIGJlIGVtaXR0ZWQgYXMgaXMuXG4gICAqL1xuICBwcm90ZWN0ZWQgbWF5YmVQcm9jZXNzKG5vZGU6IHRzLk5vZGUpOiBib29sZWFuIHtcbiAgICBzd2l0Y2ggKG5vZGUua2luZCkge1xuICAgICAgY2FzZSB0cy5TeW50YXhLaW5kLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbjpcbiAgICAgICAgY29uc3QgcHJvcEFjY2VzcyA9IG5vZGUgYXMgdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uO1xuICAgICAgICAvLyBXZSdyZSBsb29raW5nIGZvciBhbiBleHByZXNzaW9uIG9mIHRoZSBmb3JtOlxuICAgICAgICAvLyAgIG1vZHVsZV9uYW1lX3Zhci5kZWZhdWx0XG4gICAgICAgIGlmIChnZXRJZGVudGlmaWVyVGV4dChwcm9wQWNjZXNzLm5hbWUpICE9PSAnZGVmYXVsdCcpIGJyZWFrO1xuICAgICAgICBpZiAocHJvcEFjY2Vzcy5leHByZXNzaW9uLmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikgYnJlYWs7XG4gICAgICAgIGNvbnN0IGxocyA9IGdldElkZW50aWZpZXJUZXh0KHByb3BBY2Nlc3MuZXhwcmVzc2lvbiBhcyB0cy5JZGVudGlmaWVyKTtcbiAgICAgICAgaWYgKCF0aGlzLm5hbWVzcGFjZUltcG9ydHMuaGFzKGxocykpIGJyZWFrO1xuICAgICAgICAvLyBFbWl0IHRoZSBzYW1lIGV4cHJlc3Npb24sIHdpdGggc3BhY2VzIHRvIHJlcGxhY2UgdGhlIFwiLmRlZmF1bHRcIiBwYXJ0XG4gICAgICAgIC8vIHNvIHRoYXQgc291cmNlIG1hcHMgc3RpbGwgbGluZSB1cC5cbiAgICAgICAgdGhpcy53cml0ZUxlYWRpbmdUcml2aWEobm9kZSk7XG4gICAgICAgIHRoaXMuZW1pdChgJHtsaHN9ICAgICAgICBgKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIEdlbmVyYXRlcyBhIG5ldyB2YXJpYWJsZSBuYW1lIGluc2lkZSB0aGUgdHNpY2tsZV8gbmFtZXNwYWNlLiAqL1xuICBnZW5lcmF0ZUZyZXNoVmFyaWFibGVOYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGB0c2lja2xlX21vZHVsZV8ke3RoaXMudW51c2VkSW5kZXgrK31fYDtcbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnRzIFR5cGVTY3JpcHQncyBKUytDb21tb25KUyBvdXRwdXQgdG8gQ2xvc3VyZSBnb29nLm1vZHVsZSBldGMuXG4gKiBGb3IgdXNlIGFzIGEgcG9zdHByb2Nlc3Npbmcgc3RlcCAqYWZ0ZXIqIFR5cGVTY3JpcHQgZW1pdHMgSmF2YVNjcmlwdC5cbiAqXG4gKiBAcGFyYW0gZmlsZU5hbWUgVGhlIHNvdXJjZSBmaWxlIG5hbWUuXG4gKiBAcGFyYW0gbW9kdWxlSWQgVGhlIFwibW9kdWxlIGlkXCIsIGEgbW9kdWxlLWlkZW50aWZ5aW5nIHN0cmluZyB0aGF0IGlzXG4gKiAgICAgdGhlIHZhbHVlIG1vZHVsZS5pZCBpbiB0aGUgc2NvcGUgb2YgdGhlIG1vZHVsZS5cbiAqIEBwYXJhbSBwYXRoVG9Nb2R1bGVOYW1lIEEgZnVuY3Rpb24gdGhhdCBtYXBzIGEgZmlsZXN5c3RlbSAudHMgcGF0aCB0byBhXG4gKiAgICAgQ2xvc3VyZSBtb2R1bGUgbmFtZSwgYXMgZm91bmQgaW4gYSBnb29nLnJlcXVpcmUoJy4uLicpIHN0YXRlbWVudC5cbiAqICAgICBUaGUgY29udGV4dCBwYXJhbWV0ZXIgaXMgdGhlIHJlZmVyZW5jaW5nIGZpbGUsIHVzZWQgZm9yIHJlc29sdmluZ1xuICogICAgIGltcG9ydHMgd2l0aCByZWxhdGl2ZSBwYXRocyBsaWtlIFwiaW1wb3J0ICogYXMgZm9vIGZyb20gJy4uL2Zvbyc7XCIuXG4gKiBAcGFyYW0gcHJlbHVkZSBBbiBhZGRpdGlvbmFsIHByZWx1ZGUgdG8gaW5zZXJ0IGFmdGVyIHRoZSBgZ29vZy5tb2R1bGVgIGNhbGwsXG4gKiAgICAgZS5nLiB3aXRoIGFkZGl0aW9uYWwgaW1wb3J0cyBvciByZXF1aXJlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NFUzUoaG9zdDogRXM1UHJvY2Vzc29ySG9zdCwgZmlsZU5hbWU6IHN0cmluZywgY29udGVudDogc3RyaW5nKTpcbiAgICB7b3V0cHV0OiBzdHJpbmcsIHJlZmVyZW5jZWRNb2R1bGVzOiBzdHJpbmdbXX0ge1xuICBjb25zdCBmaWxlID0gdHMuY3JlYXRlU291cmNlRmlsZShmaWxlTmFtZSwgY29udGVudCwgdHMuU2NyaXB0VGFyZ2V0LkVTNSwgdHJ1ZSk7XG4gIHJldHVybiBuZXcgRVM1UHJvY2Vzc29yKGhvc3QsIGZpbGUpLnByb2Nlc3MoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRDb21tb25Kc1RvR29vZ01vZHVsZUlmTmVlZGVkKFxuICAgIGhvc3Q6IEVzNVByb2Nlc3Nvckhvc3QsIG1vZHVsZXNNYW5pZmVzdDogTW9kdWxlc01hbmlmZXN0LCBmaWxlTmFtZTogc3RyaW5nLFxuICAgIGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmICghaG9zdC5nb29nbW9kdWxlIHx8IGlzRHRzRmlsZU5hbWUoZmlsZU5hbWUpKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgY29uc3Qge291dHB1dCwgcmVmZXJlbmNlZE1vZHVsZXN9ID0gcHJvY2Vzc0VTNShob3N0LCBmaWxlTmFtZSwgY29udGVudCk7XG5cbiAgY29uc3QgbW9kdWxlTmFtZSA9IGhvc3QucGF0aFRvTW9kdWxlTmFtZSgnJywgZmlsZU5hbWUpO1xuICBtb2R1bGVzTWFuaWZlc3QuYWRkTW9kdWxlKGZpbGVOYW1lLCBtb2R1bGVOYW1lKTtcbiAgZm9yIChjb25zdCByZWZlcmVuY2VkIG9mIHJlZmVyZW5jZWRNb2R1bGVzKSB7XG4gICAgbW9kdWxlc01hbmlmZXN0LmFkZFJlZmVyZW5jZWRNb2R1bGUoZmlsZU5hbWUsIHJlZmVyZW5jZWQpO1xuICB9XG5cbiAgcmV0dXJuIG91dHB1dDtcbn1cbiJdfQ==