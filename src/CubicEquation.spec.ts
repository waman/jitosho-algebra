import { assert } from "chai";
import { CubicEquation } from './CubicEquation';

describe('cubic equation', () => {

    const epsilon = 1e-12;
    function rand(): number { return Math.round(Math.random() * 10 - 5); }
    function repeat(n: number, f: () => void): void {
        for(let i = 0; i < n; i++) f();
    }

    describe('#toString()', () => {

        it('should be the proper string', () => {
            const table: [CubicEquation, string][] = [
                [CubicEquation.new(1, 0, 0, 0)    , 'x³ = 0'],
                [CubicEquation.new(1, 1, 1, 1)    , 'x³ + x² + x + 1 = 0'],
                [CubicEquation.new(-1, -1, -1, -1), '- x³ - x² - x - 1 = 0'],
                [CubicEquation.new(2, 2, 2, 2)    , '2x³ + 2x² + 2x + 2 = 0'],
                [CubicEquation.new(-2, -2, -2, -2), '-2x³ - 2x² - 2x - 2 = 0']
            ]
            
            table.forEach(entry => {
                assert.equal(entry[0].toString(), entry[1]);
            });
        });
    });

    describe('#fromRoots()', () => {
        it('should return the proper cubic equation', () => {
            // SetUp
            const table: [[number, number, number, number], number[]][] = [
                [[0, 0, 0, 1], [1, 0, 0, 0]],
                [[0, 0, 0, 2], [2, 0, 0, 0]],
                [[1, 1, 1, 2], [2, -6, 6, -2]],
                [[2, 2, 3, 5], [5, -35, 80, -60]],
                [[1, -2, 3, 4], [4, -8, -20, 24]]
            ];

            table.forEach(entry => {
                const roots = entry[0];
                const cs = entry[1];
                // Exercise
                const eq = CubicEquation.fromRoots(...roots);
                // Verify
                assert.equal(eq.a, cs[0], eq.toString());
                assert.equal(eq.b, cs[1], eq.toString());
                assert.equal(eq.c, cs[2], eq.toString());
                assert.equal(eq.d, cs[3], eq.toString());
            })
        });
    });

    describe('depressed cubic equation', () => {

        describe('#realRoots()', () => {

            it('should solve the equation that have the triple root (x³ = 0)', () => {
                // SetUp
                const eq = CubicEquation.depressed(0, 0);
                assert.equal(eq.discriminant, 0, eq.toString());
                // Exercise
                const roots = eq.realRoots();
                // Verify
                assert.equal(roots.length, 1, eq.toString());
                assert.equal(roots[0], 0, eq.toString());
            });

            it('should solve the equation in the form of x³ + q = 0 (p = 0)', () => {
                // SetUp
                const table: [CubicEquation, number][] = [
                    [CubicEquation.depressed(0, 1), -1],
                    [CubicEquation.depressed(0, -1), 1],
                    [CubicEquation.depressed(0, 5), Math.cbrt(-5)],
                    [CubicEquation.depressed(0, -5), Math.cbrt(5)]
                ]
                
                table.forEach(entry => {
                    const eq = entry[0];
                    assert(eq.discriminant < 0, eq.toString());
                    // Exercise
                    const roots = eq.realRoots();
                    // Verify
                    assert.equal(roots.length, 1, eq.toString());

                    const root = roots[0];
                    assert.approximately(root, entry[1], epsilon, eq.toString());
                    assert.approximately(eq.f(root), 0, epsilon, eq.toString());
                });
            });

            it('should solve the equation in the form of x³ + px = 0 (q = 0)', () => {
                // SetUp
                const sqrt3 = Math.sqrt(3);
                const table: [CubicEquation, number[]][] = [
                    [CubicEquation.depressed(3, 0), [0]],
                    [CubicEquation.depressed(-3, 0), [-sqrt3, 0, sqrt3]]
                ]
                
                table.forEach(entry => {
                    const eq = entry[0];
                    assert(eq.discriminant * eq.p < 0, eq.toString());  // discriminant and p have the opposite sign
                    // Exercise
                    const roots = eq.realRoots();
                    if(eq.discriminant < 0)
                        assert.equal(roots.length, 1, eq.toString());
                    else
                        assert.equal(roots.length, 3, eq.toString());

                    // Verify
                    roots.forEach(root => {
                        assert(entry[1].some(exp => Math.abs(root - exp) < epsilon), eq.toString());
                        assert.approximately(eq.f(root), 0, epsilon, eq.toString());
                    });
                });
            });

            it('should solve the equation whose discriminant is zero (-(4p³+27q²) = 0)', () => {
                // SetUp
                const sqrt3 = Math.sqrt(3);
                const table: [CubicEquation, number[]][] = [
                    [CubicEquation.depressed(-3, 2), [-2, 1]],
                    [CubicEquation.depressed(-3, -2), [2, -1]],
                    [CubicEquation.depressed(-1, 2/(3*sqrt3)), [-2/sqrt3, 1/sqrt3]],
                    [CubicEquation.depressed(-1, -2/(3*sqrt3)), [2/sqrt3, -1/sqrt3]]
                ]
                
                table.forEach(entry => {
                    const eq = entry[0];
                    assert.equal(eq.discriminant, 0, eq.toString());
                    // Exercise
                    const roots = eq.realRoots();
                    assert.equal(roots.length, 2, eq.toString());

                    // Verify
                    roots.forEach(root => {
                        assert(entry[1].some(exp => Math.abs(root - exp) < epsilon), eq.toString());
                        assert.approximately(eq.f(root), 0, epsilon, eq.toString());
                    });
                });
            });

            it('should solve the equation whose discriminant is negative (-(4p³+27q²) < 0)', () => {
                // SetUp
                const table: CubicEquation[] = [
                    CubicEquation.depressed(2, 1),
                    CubicEquation.depressed(2, -1),
                    CubicEquation.depressed(-3, 5),
                    CubicEquation.depressed(-3, -5)
                ]
                
                table.forEach(eq => {
                    assert(eq.discriminant < 0, eq.toString());
                    // Exercise
                    const roots = eq.realRoots();
                    assert.equal(roots.length, 1, eq.toString());

                    // Verify
                    assert.approximately(eq.f(roots[0]), 0, epsilon, eq.toString());
                });
            });

            it('should solve the equation whose discriminant is positive (-(4p³+27q²) > 0)', () => {
                // SetUp
                const table: CubicEquation[] = [
                    CubicEquation.depressed(-2, 1),
                    CubicEquation.depressed(-2, -1),
                    CubicEquation.depressed(-5, 2),
                    CubicEquation.depressed(-5, -2)
                ]
                
                table.forEach(eq => {
                    assert(eq.discriminant > 0, eq.toString());
                    // Exercise
                    const roots = eq.realRoots();
                    assert.equal(roots.length, 3, eq.toString());

                    // Verify
                    roots.forEach(root => {
                        assert.approximately(eq.f(root), 0, epsilon, eq.toString());
                    })
                });
            });
        });

    });

    describe('general cubic equation', () => {

        describe('#realRoots()', () => {

            it('should return real roots', () => {
                repeat(10, () => {
                    // SetUp
                    const a = rand();
                    const eq = CubicEquation.new(a !== 0 ? a : 1, rand(), rand(), rand());
                    // Exercise
                    const roots = eq.realRoots()
                    // Verify
                    roots.forEach(x => {
                        assert.approximately(eq.f(x), 0, epsilon, eq.toString());
                    });
                });
            });

            it('should solve the equation that has the triple root', () => {
                // SetUp
                const table: [CubicEquation, number][] = [
                    [CubicEquation.new(1, 3, 3, 1), -1],
                    [CubicEquation.fromRoots(1, 1, 1, 2), 1],
                    [CubicEquation.new(2*2*2, 3*2*2*5, 3*2*5*5, 5*5*5), -5/2],
                ]
                table.forEach(entry => {
                    const eq = entry[0];
                    // Exercise
                    const roots = eq.realRoots();
                    // Verify
                    assert.equal(roots.length, 1, eq.toString());
                    assert.approximately(roots[0], entry[1], epsilon, eq.toString());
                    assert.approximately(eq.f(roots[0]), 0, epsilon, eq.toString());
                });
            });

            it('should solve the equation that has the double root', () => {
                // SetUp
                const table: [CubicEquation, number[]][] = [
                    [CubicEquation.fromRoots(1, 1, -2, 3), [1, -2]],
                    [CubicEquation.fromRoots(2, 2, 5, 1), [2, 5]]
                ]
                table.forEach(entry => {
                    const eq = entry[0];
                    // Exercise
                    const roots = eq.realRoots();
                    // Verify
                    assert.equal(roots.length, 2, eq.toString());
                    roots.forEach(root => {
                        assert(entry[1].some(x => Math.abs(x - root) < epsilon), eq.toString());
                        assert.approximately(eq.f(root), 0, epsilon, eq.toString());
                    })
                });
            });
        });
    });
});