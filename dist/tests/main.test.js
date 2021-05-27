"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
describe("Generate Regular expression from scheme description", () => {
    describe("General semantic cases: major.minor.build", () => {
        let scheme = 'major.minor.build', genRegExp = index_1.generateSchemeRegexp(scheme);
        console.log(genRegExp);
        test("it should identify the correct item in the string for a simple input", () => {
            let match = "1.2.3".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBe(1);
            expect(match[0]).toBe("1.2.3");
        });
        test("it should identify the correct item in the string for a complex input", () => {
            let match = "test1.2.3test".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBe(1);
            expect(match[0]).toBe("1.2.3");
        });
        describe("It should reject: Incorrect inputs", () => {
            test("missing item -> 1.2", () => {
                let match = "1.2".match(genRegExp);
                expect(match).toBe(null);
                // expect(match.length).toBe(0);
            });
            test("misnamed item -> 1.two.3", () => {
                let match = "1.two.3".match(genRegExp);
                expect(match).toBe(null);
                // expect(match.length).toBe(0);
            });
            test("incorrect seperator -> 1.2-3", () => {
                let match = "1.2-3".match(genRegExp);
                expect(match).toBe(null);
                // expect(match.length).toBe(0);
            });
        });
    });
    describe("General semantic cases w/ optional tag: major.minor[.build]", () => {
        let scheme = 'major.minor[.build]', genRegExp = index_1.generateSchemeRegexp(scheme);
        test("it should identify the correct item in the string for simple input (w/ optional)", () => {
            let match = "1.2.3".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2.3");
        });
        test("it should identify the correct item in the string for simple input (w0/ optional)", () => {
            let match = "1.2".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2");
        });
        test("it should identify the correct item in the string for complex input (w/ optional)", () => {
            let match = "test.1.2.3.4".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2.3");
        });
        test("it should identify the correct item in the string for complex input (wo/ optional)", () => {
            let match = "test.1.2.test".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2");
        });
        describe("It should reject: Incorrect inputs", () => {
            test("missing item -> 1.", () => {
                let match = "1.".match(genRegExp);
                expect(match).toBe(null);
            });
            test("misnamed item -> 1.two.3", () => {
                let match = "1.two.3".match(genRegExp);
                expect(match).toBe(null);
                // expect(match.length).toBe(0);
            });
            test("incorrect seperator -> 1-2-3", () => {
                let match = "1-2-3".match(genRegExp);
                expect(match).toBe(null);
                // expect(match.length).toBe(0);
            });
        });
    });
    describe("General semantic cases w/ optional tags: major.minor[.build][.commit]", () => {
        let scheme = 'major.minor[.build][.commit]', genRegExp = index_1.generateSchemeRegexp(scheme);
        test("it should identify the correct item in the string for simple input (w/ optionals)", () => {
            let match = "1.2.3.4".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2.3.4");
        });
        test("it should identify the correct item in the string for simple input (wo/ optional)", () => {
            let match = "1.2.3".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2.3");
        });
        test("it should identify the correct item in the string for simple input (wo/ optionals)", () => {
            let match = "1.2".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2");
        });
        test("it should identify the correct item in the string for complex input (w/ optionals)", () => {
            let match = "test.1.2.3.4".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2.3.4");
        });
        test("it should identify the correct item in the string for complex input (wo/ optionals)", () => {
            let match = "test.1.2.test".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2");
        });
        describe("It should reject: Incorrect inputs", () => {
            test("missing item -> 1.", () => {
                let match = "1.".match(genRegExp);
                expect(match).toBe(null);
            });
            test("misnamed item -> 1.two.3", () => {
                let match = "1.two.3".match(genRegExp);
                expect(match).toBe(null);
                // expect(match.length).toBe(0);
            });
            test("incorrect seperator -> 1-2-3-4", () => {
                let match = "1-2-3-4".match(genRegExp);
                expect(match).toBe(null);
                // expect(match.length).toBe(0);
            });
            test("incorrect seperator -> 1-2-3", () => {
                let match = "1-2-3".match(genRegExp);
                expect(match).toBe(null);
                // expect(match.length).toBe(0);
            });
        });
    });
    describe("General semantic cases w/ compound optional tags: major.minor[.build[-commit]]", () => {
        let scheme = 'major.minor[.build[-commit]]', genRegExp = index_1.generateSchemeRegexp(scheme);
        test("it should identify the correct item in the string for simple input (w/ optionals)", () => {
            let match = "1.2.3-4".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2.3-4");
        });
        test("it should identify the correct item in the string for simple input (wo/ optional)", () => {
            let match = "1.2.3".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2.3");
        });
        test("it should identify the correct item in the string for simple input (wo/ optionals)", () => {
            let match = "1.2".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2");
        });
        test("it should identify the correct item in the string for complex input (w/ optionals)", () => {
            let match = "test.1.2.3-4".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2.3-4");
        });
        test("it should identify the correct item in the string for complex input (wo/ optionals)", () => {
            let match = "test.1.2.test".match(genRegExp);
            expect(match).not.toBe(null);
            expect(match.length).toBeGreaterThan(0);
            expect(match[0]).toBe("1.2");
        });
        describe("It should reject: Incorrect inputs", () => {
            test("missing item -> 1.", () => {
                let match = "1.".match(genRegExp);
                expect(match).toBe(null);
            });
            test("misnamed item -> 1.two.3", () => {
                let match = "1.two.3".match(genRegExp);
                expect(match).toBe(null);
                // expect(match.length).toBe(0);
            });
            test("incorrect seperator -> 1-2-3-4", () => {
                let match = "1-2-3-4".match(genRegExp);
                expect(match).toBe(null);
                // expect(match.length).toBe(0);
            });
            test("incorrect seperator -> 1-2-3", () => {
                let match = "1-2-3".match(genRegExp);
                expect(match).toBe(null);
                // expect(match.length).toBe(0);
            });
        });
    });
    describe("Case with multiple seperators", () => {
        test("multiple seperators -> 1.2->3", () => {
            let match = "1.2->3".match(index_1.generateSchemeRegexp("major.minor->build"));
            expect(match).not.toBe(null);
            expect(match[0]).toBe("1.2->3");
        });
        test("multiple seperators with optional -> 1.2->3", () => {
            let match = "1.2->3".match(index_1.generateSchemeRegexp("major.minor[->build]"));
            expect(match).not.toBe(null);
            expect(match[0]).toBe("1.2->3");
        });
        test("multiple seperators with optionals -> 1.2->3<-4", () => {
            let match = "1.2->3<-4".match(index_1.generateSchemeRegexp("major.minor[->build][<-tag]"));
            expect(match).not.toBe(null);
            expect(match[0]).toBe("1.2->3<-4");
        });
        test("multiple seperators with compound optionals -> 1.2->3<-4", () => {
            let match = "1.2->3<-4".match(index_1.generateSchemeRegexp("major.minor[->build[<-tag]]"));
            expect(match).not.toBe(null);
            expect(match[0]).toBe("1.2->3<-4");
        });
    });
});
