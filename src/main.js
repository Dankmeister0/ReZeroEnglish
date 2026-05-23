var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// RatchetReact is a simplified React clone.
// It is meant to have a familiar syntax but much simplified.
// v1.1
window.onload = function () {
    RatchetReact.Reload();
};
var RatchetReact = /** @class */ (function () {
    /**
     * Creates a RatchetReact element out of the given HTML element.
     * @param htmlElem Existing element to create wrapper for.
     */
    function RatchetReact(htmlElem) {
        this.htmlElem = htmlElem;
        this.isOpen = false;
    }
    /**
     * Initializes the document with the root node
     */
    RatchetReact.Reload = function () {
        if (document.body && RatchetReact.Root !== undefined) {
            document.body.replaceChildren(RatchetReact.Root.elem());
        }
    };
    RatchetReact.Get = function (id) {
        var elem = document.getElementById(id);
        if (elem === null)
            return null;
        return new RatchetReact(elem);
    };
    /**
     * Creates a new RatchetReact element.
     * @param tagName HTML tag.
     * @returns New RatchetReact element.
     */
    RatchetReact.New = function (tagName) {
        return new RatchetReact(document.createElement(tagName));
    };
    /**
     * Appends a new RatchetReact element.
     * @param elem HTML tag of element to create.
     * @returns Newly-appended RatchetReact element.
     */
    RatchetReact.prototype.add = function (elem) {
        return this.addRef(RatchetReact.New(elem));
    };
    /**
     * Appends an existing RatchetReact element.
     * @param elem Existing RatchetReact element.
     * @returns Newly-appended RatchetReact element.
     */
    RatchetReact.prototype.addRef = function (elem) {
        if (this.isOpen) {
            this.htmlElem.appendChild(elem.htmlElem);
        }
        else {
            if (this.htmlElem.parentElement === null)
                throw this;
            this.htmlElem.parentElement.appendChild(elem.htmlElem);
        }
        return elem;
    };
    /**
     * Appends an async RatchetReact element.
     * @param elem Promise of RatchetReact element.
     * @returns Placeholder element.
     */
    RatchetReact.prototype.addAsync = function (elem) {
        var _this = this;
        var placeholder = new RatchetReact(document.createElement("div"));
        var isOpenCopy = this.isOpen;
        this.addRef(placeholder);
        elem.then(function (elem) {
            var e_1, _a;
            try {
                for (var _b = __values(placeholder.htmlElem.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    elem.htmlElem.appendChild(child);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (isOpenCopy) {
                _this.htmlElem.replaceChild(elem.htmlElem, placeholder.htmlElem);
            }
            else {
                if (_this.htmlElem.parentElement === null)
                    throw _this;
                _this.htmlElem.parentElement.replaceChild(elem.htmlElem, placeholder.htmlElem);
            }
            placeholder.htmlElem = elem.htmlElem;
        });
        return placeholder;
    };
    /**
     * Appends raw HTML to the underlying HTML.
     * @param rawHtml HTML to append.
     * @returns This RatchetReact element.
     */
    RatchetReact.prototype.addRaw = function (rawHtml) {
        if (this.isOpen) {
            this.htmlElem.insertAdjacentHTML("beforeend", rawHtml);
        }
        else {
            if (this.htmlElem.parentElement === null)
                throw this;
            this.htmlElem.insertAdjacentHTML("afterend", rawHtml);
        }
        return this;
    };
    /**
     * "Opens" the RatchetReact element.
     * Signifies that add() should append the next element as a child.
     * @returns This RatchetReact element.
     */
    RatchetReact.prototype.open = function () {
        this.isOpen = true;
        return this;
    };
    /**
     * "Closes" the RatchetReact element.
     * @returns Parent RatchetReact element.
     */
    RatchetReact.prototype.close = function () {
        if (this.isOpen) {
            this.isOpen = false;
            return this;
        }
        else {
            if (this.htmlElem.parentElement === null)
                throw this;
            return new RatchetReact(this.htmlElem.parentElement);
        }
    };
    /**
     * Sets a property on the underlying HTML element.
     * @param property Property to set.
     * @param value Value to set property to.
     * @returns This RatchetReact element.
     */
    RatchetReact.prototype.set = function (property, value) {
        this.htmlElem[property] = value;
        return this;
    };
    /**
     * Sets an attribute on the underlying HTML element.
     * @param property Attribute to set.
     * @param value Value to set attribute to.
     * @returns This RatchetReact element.
     */
    RatchetReact.prototype.setRaw = function (property, value) {
        this.htmlElem.setAttribute(property, value);
        return this;
    };
    /**
     * Gets a property on the underlying HTML element.
     * @param property Property to get value of.
     * @returns Value of property.
     */
    RatchetReact.prototype.get = function (property) {
        return this.elem()[property];
    };
    /**
     * Get the underlying HTML element.
     * @returns HTML element.
     */
    RatchetReact.prototype.elem = function () {
        return this.htmlElem;
    };
    return RatchetReact;
}());
/// <reference path="RatchetReact.ts" />
var gHandlers = {
    openTOC: function () { },
    openChapter: function (chapter) { },
    markAllRead: function () { },
    markAllUnread: function () { },
    filterTOC: function (filter) { },
};
function addChapterToCookie(chapter) {
    if (isChapterInCookie(chapter))
        return;
    if (!document.cookie.includes("|"))
        document.cookie = "chapters=|";
    document.cookie += chapter + "|";
}
function removeChapterFromCookie(chapter) {
    if (!isChapterInCookie(chapter))
        return;
    document.cookie = document.cookie.replace("|".concat(chapter, "|"), "|");
}
function isChapterInCookie(chapter) {
    return document.cookie.includes("|".concat(chapter, "|"));
}
RatchetReact.Root = main();
function main() {
    var articleRef = RatchetReact.New("article");
    gHandlers.openTOC = function () {
        articleRef.elem().replaceChildren();
        articleRef.open();
        articleRef.addRef(tocNavBar());
        articleRef.addAsync(tableOfContents());
        articleRef.close();
    };
    gHandlers.openChapter = function (chapter) {
        addChapterToCookie(chapter);
        articleRef.elem().replaceChildren();
        articleRef.open();
        articleRef.addAsync(readerNavBar(chapter));
        articleRef.addAsync(readerContent(chapter));
        articleRef.close();
    };
    gHandlers.openTOC();
    return (RatchetReact.New("main").set("className", "container").open()
        .addRef(articleRef)
        .close());
}
function tocNavBar() {
    var dropdownRef = RatchetReact.New("select");
    var onFilter = function () {
        gHandlers.filterTOC(dropdownRef.get("value"));
    };
    return (RatchetReact.New("nav").open()
        .add("ul").open()
        .add("li").open()
        .add("a").set("href", "#").set("textContent", "Mark All Read").set("onclick", function () { return gHandlers.markAllRead(); })
        .close()
        .add("li").open()
        .add("a").set("href", "#").set("textContent", "Mark All Unread").set("onclick", function () { return gHandlers.markAllUnread(); })
        .close()
        .close()
        .add("ul").open()
        .add("li").open()
        .addRef(dropdownRef).set("onchange", onFilter).open()
        .add("option").set("textContent", "All")
        .add("option").set("textContent", "Arc 10")
        .add("option").set("textContent", "Arc 9")
        .add("option").set("textContent", "EX")
        .close()
        .close()
        .close()
        .close());
}
function tableOfContents() {
    return __awaiter(this, void 0, void 0, function () {
        var tocRef, aRef, resp, text, chapters, _loop_1, chapters_1, chapters_1_1, chapterStr;
        var e_2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tocRef = RatchetReact.New("ul");
                    return [4 /*yield*/, fetch("./src/chapters/index.txt")];
                case 1:
                    resp = _b.sent();
                    return [4 /*yield*/, resp.text()];
                case 2:
                    text = _b.sent();
                    chapters = text.split("\n").reverse();
                    _loop_1 = function (chapterStr) {
                        var chapter = chapterStr.split("|", 2)[0];
                        var chapterTitle = chapterStr.split("|", 2)[1];
                        if (chapter.trim().length === 0)
                            return "continue";
                        var onClick = function () {
                            gHandlers.openChapter(chapter);
                        };
                        aRef = RatchetReact.New("a");
                        tocRef.open()
                            .add("li").open()
                            .addRef(aRef).set("id", chapter).set("textContent", chapterTitle).set("href", "#").set("onclick", onClick)
                            .close()
                            .close();
                        if (isChapterInCookie(chapter)) {
                            aRef.get("classList").add("secondary");
                        }
                    };
                    try {
                        for (chapters_1 = __values(chapters), chapters_1_1 = chapters_1.next(); !chapters_1_1.done; chapters_1_1 = chapters_1.next()) {
                            chapterStr = chapters_1_1.value;
                            _loop_1(chapterStr);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (chapters_1_1 && !chapters_1_1.done && (_a = chapters_1.return)) _a.call(chapters_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    gHandlers.markAllRead = function () {
                        var e_3, _a;
                        try {
                            for (var _b = __values(tocRef.elem().childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var liElem = _c.value;
                                if (!liElem.firstChild)
                                    continue;
                                var aElem = liElem.firstChild;
                                if (liElem.classList.contains("hidden"))
                                    continue;
                                aElem.classList.add("secondary");
                                addChapterToCookie(aElem.id);
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    };
                    gHandlers.markAllUnread = function () {
                        var e_4, _a;
                        try {
                            for (var _b = __values(tocRef.elem().childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var liElem = _c.value;
                                if (!liElem.firstChild)
                                    continue;
                                var aElem = liElem.firstChild;
                                if (liElem.classList.contains("hidden"))
                                    continue;
                                aElem.classList.remove("secondary");
                                removeChapterFromCookie(aElem.id);
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                    };
                    gHandlers.filterTOC = function (filter) {
                        var e_5, _a;
                        try {
                            for (var _b = __values(tocRef.elem().childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var liElem = _c.value;
                                if (!liElem.firstChild)
                                    continue;
                                var aElem = liElem.firstChild;
                                if (filter === "All" || aElem.textContent.includes(filter))
                                    liElem.classList.remove("hidden");
                                else
                                    liElem.classList.add("hidden");
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                    };
                    return [2 /*return*/, (RatchetReact.New("div").open()
                            .add("h1").set("textContent", "Table of Contents")
                            .addRef(tocRef)
                            .close())];
            }
        });
    });
}
function readerNavBar(chapter) {
    return __awaiter(this, void 0, void 0, function () {
        var chapterNum, prevButtonRef, nextButtonRef, homeButtonRef, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chapterNum = Number(chapter);
                    prevButtonRef = RatchetReact.New("span");
                    nextButtonRef = RatchetReact.New("span");
                    homeButtonRef = RatchetReact.New("a").set("href", "#").set("onclick", function () { return gHandlers.openTOC(); });
                    return [4 /*yield*/, fetch("./src/chapters/".concat(chapterNum - 1, ".txt"))];
                case 1:
                    resp = _a.sent();
                    if (resp.ok) {
                        prevButtonRef = RatchetReact.New("a").set("href", "#").set("onclick", function () { return gHandlers.openChapter("".concat(chapterNum - 1)); });
                    }
                    return [4 /*yield*/, fetch("./src/chapters/".concat(chapterNum + 1, ".txt"))];
                case 2:
                    resp = _a.sent();
                    if (resp.ok) {
                        nextButtonRef = RatchetReact.New("a").set("href", "#").set("onclick", function () { return gHandlers.openChapter("".concat(chapterNum + 1)); });
                    }
                    return [2 /*return*/, (RatchetReact.New("nav").open()
                            .add("ul").open()
                            .add("li").open()
                            .addRef(prevButtonRef).set("textContent", "Previous")
                            .close()
                            .add("li").open()
                            .addRef(homeButtonRef).set("textContent", "Home")
                            .close()
                            .add("li").open()
                            .addRef(nextButtonRef).set("textContent", "Next")
                            .close()
                            .close()
                            .close())];
            }
        });
    });
}
function readerContent(chapter) {
    return __awaiter(this, void 0, void 0, function () {
        var divRef, resp, text, lines, firstLine, lines_1, lines_1_1, line;
        var e_6, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    divRef = RatchetReact.New("div");
                    return [4 /*yield*/, fetch("./src/chapters/".concat(chapter, ".txt"))];
                case 1:
                    resp = _b.sent();
                    if (!resp.ok)
                        return [2 /*return*/, divRef];
                    return [4 /*yield*/, resp.text()];
                case 2:
                    text = _b.sent();
                    lines = text.split("\n");
                    firstLine = true;
                    divRef.open();
                    try {
                        for (lines_1 = __values(lines), lines_1_1 = lines_1.next(); !lines_1_1.done; lines_1_1 = lines_1.next()) {
                            line = lines_1_1.value;
                            if (firstLine) {
                                divRef.add("h1").set("textContent", line);
                                firstLine = false;
                                continue;
                            }
                            divRef.add("p").set("textContent", line);
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (lines_1_1 && !lines_1_1.done && (_a = lines_1.return)) _a.call(lines_1);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                    divRef.close();
                    return [2 /*return*/, divRef];
            }
        });
    });
}
