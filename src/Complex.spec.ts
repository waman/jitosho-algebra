import { assert } from 'chai';
import { CMath, Complex } from './Complex';

describe('Complex', () => {

    const c = new Complex(3, 7);
    const epsilon = 1e-14
    const epsi = 1e-10;

    function rand(): number { return Math.random() * 100 - 50; }

    function repeat(n: number, f: () => void): void {
        for(let i = 0; i < n; i++) f();
    }

    function assertEqualComplex(
            actual: Complex, expected: Complex | number, epsilon: number, message: string = ''){
        assert(actual.equals(expected, epsilon), message + `: ${actual} != ${expected}`)
    }

    describe('#toString()', () => {

        it('should return the proper string', () => {
            const table: [Complex, string][] = [
                [Complex.ZERO, '0'],

                [Complex.ONE, '1'],
                [Complex.MINUS_ONE, '-1'],
                [Complex.I, 'i'],
                [Complex.MINUS_I, '-i'],

                [new Complex(2, 0), '2'],
                [new Complex(0, 2), '2i'],
                [new Complex(-2, 0), '-2'],
                [new Complex(0, -2), '-2i'],

                [new Complex(3, 4), '3+4i'],
                [new Complex(-3, 4), '-3+4i'],
                [new Complex(3, -4), '3-4i'],
                [new Complex(-3, -4), '-3-4i'],

                [Complex.INFINITY, '∞'],
                [Complex.NaN, 'NaN(C)']
            ]

            table.forEach(entry => {
                assert.equal(entry[0].toString(), entry[1]);
            });
        });
    });

    describe('#equals() should return the proper value', () => {
        const c1 = new Complex(2, 3), c2 = new Complex(2, 3);
        assert.isFalse(c1 === c2);
        assert(c1.equals(c2));

        // Infinity
        assert(Infinity === Infinity); // The language spec
        assert(new Complex(Infinity, 1).equals(Complex.INFINITY));

        // NaN
        assert.isFalse(NaN === NaN); // The language spec
        assert.isFalse(new Complex(NaN, 1).equals(Complex.NaN));
    });

    describe('boolean properties', () => {

        it('#isReal() should return the proper value', () => {
            const table: [Complex, boolean][] = [
                [new Complex(2, 0), true],
                [new Complex(0, 3), false],
                [c, false],

                [Complex.ZERO, true],
                [Complex.ONE, true],
                [Complex.I, false],
                [Complex.MINUS_ONE, true],
                [Complex.MINUS_I, false],

                [Complex.INFINITY, false],
                [Complex.NaN, false]
            ]

            table.forEach(entry => {
                assert(entry[0].isReal() === entry[1], entry[0] + '#isReal()');
            });
        });

        it('#isImaginary() should return the proper value', () => {
            const table: [Complex, boolean][] = [
                [new Complex(2, 0), false],
                [new Complex(0, 3), true],
                [c, false],

                [Complex.ZERO, false],
                [Complex.ONE, false],
                [Complex.I, true],
                [Complex.MINUS_ONE, false],
                [Complex.MINUS_I, true],

                [Complex.INFINITY, false],
                [Complex.NaN, false]
            ]

            table.forEach(entry => {
                assert(entry[0].isImaginary() === entry[1], entry[0] + '#isImaginary()');
            });
        });

        it('#isInteger() should return the proper value', () => {
            const table: [Complex, boolean][] = [
                [new Complex(3, 0), true],
                [new Complex(3.5, 0), false],
                [new Complex(-4, 0), true],
                [new Complex(-4.5, 0), false],
                [new Complex(0, 5), false],
                [new Complex(6, 7), false],

                [Complex.ZERO, true],
                [Complex.MINUS_ONE, true],
                [Complex.I, false],
                [Complex.MINUS_I, false],

                [Complex.INFINITY, false],
                [Complex.NaN, false]
            ]

            table.forEach(entry => {
                assert(entry[0].isInteger() === entry[1], entry[0] + '#isInteger()');
            });
        });

        it('#isGaussianInteger() should return the proper value', () => {
            const table: [Complex, boolean][] = [
                [new Complex(3, 0), true],
                [new Complex(3.5, 0), false],
                [new Complex(-4, 0), true],
                [new Complex(-4.5, 0), false],
                [new Complex(0, 5), true],
                [new Complex(0, 5.5), false],
                [new Complex(6, 7), true],
                [new Complex(6.5, 7), false],
                [new Complex(6, 7.5), false],
                [new Complex(6.5, 7.5), false],

                [Complex.ZERO, true],
                [Complex.MINUS_ONE, true],
                [Complex.I, true],
                [Complex.MINUS_I, true],

                [Complex.INFINITY, false],
                [Complex.NaN, false]
            ]

            table.forEach(entry => {
                assert(entry[0].isGaussianInteger() === entry[1], entry[0] + '#isGaussianInteger()');
            });
        });

        it('The other boolean properties should return the proper value', () => {
            assert.isFalse(c.isZero(), '#isZero()');
            assert(c.isFinite(), '#isFinite()');
            assert.isFalse(c.isInfinite(), '#isInfinite()');
            assert.isFalse(c.isNaN(), '#isNaN()');
        });
    });

    describe('Unary Operations', () => {

        it('#abs() should return the proper value', () => {
            const r = Math.sqrt(5*5 + 7*7)
            const table: [Complex, number][] = [
                [new Complex(2, 0), 2],
                [new Complex(0, 3), 3],
                [new Complex(5, 7), r],
                [new Complex(5, -7), r],
                [new Complex(-5, 7), r],
                [new Complex(-5, -7), r],

                [Complex.ZERO, 0],
                [Complex.ONE, 1],
                [Complex.I, 1],
                [Complex.MINUS_ONE, 1],
                [Complex.MINUS_I, 1]
            ]

            table.forEach(entry => {
                assert.approximately(entry[0].abs(), entry[1], epsilon, entry[0] + '#abs()');
            });
        });

        it('#arg() should return the proper value', () => {
            assert.isNaN(Complex.ZERO.arg());

            const theta = Math.atan2(7, 5);
            const table: [Complex, number][] = [
                [new Complex(2, 0), 0],
                [new Complex(0, 3), Math.PI/2],
                [new Complex(5, 7), theta],
                [new Complex(5, -7), -theta],
                [new Complex(-5, 7), Math.PI - theta],
                [new Complex(-5, -7), -Math.PI + theta],

                [Complex.ONE, 0],
                [Complex.I, Math.PI/2],
                [Complex.MINUS_ONE, Math.PI],
                [Complex.MINUS_I, -Math.PI/2]
            ]

            table.forEach(entry => {
                assert.approximately(entry[0].arg(), entry[1], epsilon, entry[0] + '#arg()');
            });
        });

        it('#neg() should return the proper value', () => {
            const table: [Complex, Complex][] = [
                [new Complex(2, 0), new Complex(-2, 0)],
                [new Complex(0, 3), new Complex(0, -3)],

                [new Complex(5, 7), new Complex(-5, -7)],
                [new Complex(5, -7), new Complex(-5, 7)],
                [new Complex(-5, 7), new Complex(5, -7)],
                [new Complex(-5, -7), new Complex(5, 7)],

                [Complex.ZERO, Complex.ZERO],
                [Complex.ONE, Complex.MINUS_ONE],
                [Complex.I, Complex.MINUS_I],
                [Complex.MINUS_ONE, Complex.ONE],
                [Complex.MINUS_I, Complex.I]
            ]

            table.forEach(entry => {
                assert(entry[0].neg().equals(entry[1], epsilon), entry[0] + '#neg()');
            });
        });

        describe('#conj()', () => {

            it('should return the proper value', () => {
                const table: [Complex, Complex][] = [
                    [new Complex(2, 0), new Complex(2, 0)],
                    [new Complex(0, 3), new Complex(0, -3)],

                    [new Complex(5, 7), new Complex(5, -7)],
                    [new Complex(5, -7), new Complex(5, 7)],
                    [new Complex(-5, 7), new Complex(-5, -7)],
                    [new Complex(-5, -7), new Complex(-5, 7)],

                    [Complex.ZERO, Complex.ZERO],
                    [Complex.ONE, Complex.ONE],
                    [Complex.I, Complex.MINUS_I],
                    [Complex.MINUS_ONE, Complex.MINUS_ONE],
                    [Complex.MINUS_I, Complex.I]
                ]

                table.forEach(entry => {
                    assert(entry[0].conj().equals(entry[1], epsilon), entry[0] + '#conj()');
                });
            });

        });

        describe('#recip()', () => {

            it('should return NaN(C) if the operand is zero', () => {
                assert(Complex.ZERO.recip().isNaN)
            })

            it('should return the proper value', () => {
                const d = 5*5 + 7*7;
                const table: [Complex, Complex][] = [
                    [new Complex(2, 0), new Complex(1/2, 0)],
                    [new Complex(0, 3), new Complex(0, -1/3)],

                    [new Complex(5, 7), new Complex(5, -7).div(d)],
                    [new Complex(5, -7), new Complex(5, 7).div(d)],
                    [new Complex(-5, 7), new Complex(-5, -7).div(d)],
                    [new Complex(-5, -7), new Complex(-5, 7).div(d)],

                    [Complex.ONE, Complex.ONE],
                    [Complex.I, Complex.MINUS_I],
                    [Complex.MINUS_ONE, Complex.MINUS_ONE],
                    [Complex.MINUS_I, Complex.I]
                ]

                table.forEach(entry => {
                    assert(entry[0].recip().equals(entry[1], epsilon), entry[0] + '#recip()');
                });
            });
        });
    });

    describe('Binary Operations', () => {

        describe('#add()', () => {

            it('should return a sum of two complex numbers', () => {
                repeat(100, () => {
                    // SetUp
                    const x1 = rand(), y1 = rand(), x2 = rand(), y2 = rand();
                    const z1 = new Complex(x1, y1), z2 = new Complex(x2, y2),
                          zExp = new Complex(x1 + x2, y1 + y2);
                    // Exercise
                    const z = z1.add(z2);
                    // Verify
                    assert(z.equals(zExp, epsilon), `${z1} + ${z2} != ${zExp}`);
                });
            });

            it('should return a sum of a complex number and a real number', () => {
                repeat(100, () => {
                    // SetUp
                    const x1 = rand(), y1 = rand(), x2 = rand();
                    const z1 = new Complex(x1, y1),
                          zExp = new Complex(x1 + x2, y1);
                    // Exercise
                    const z = z1.add(x2);
                    // Verify
                    assert(z.equals(zExp, epsilon), `${z1} + ${x2} != ${zExp}`);
                });
            });

            it('should return the proper value', () => {
                assert(c.add(0).equals(c));
                assert(c.add(Complex.ZERO).equals(c));

                assert(c.add(Infinity).isInfinite());
                assert(c.add(-Infinity).isInfinite());
                assert(c.add(Complex.INFINITY).isInfinite());

                assert(c.add(NaN).isNaN());
                assert(c.add(Complex.NaN).isNaN());
            });
        });

        describe('#sub()', () => {

            it('should return a difference of two complex numbers', () => {
                repeat(100, () => {
                    // SetUp
                    const x1 = rand(), y1 = rand(), x2 = rand(), y2 = rand();
                    const z1 = new Complex(x1, y1), z2 = new Complex(x2, y2),
                          zExp = new Complex(x1 - x2, y1 - y2);
                    // Exercise
                    const z = z1.sub(z2);
                    // Verify
                    assert(z.equals(zExp, epsilon), `${z1} - ${z2} != ${zExp}`);
                });
            });

            it('should return a difference of a complex number and a real number', () => {
                repeat(100, () => {
                    // SetUp
                    const x1 = rand(), y1 = rand(), x2 = rand();
                    const z1 = new Complex(x1, y1),
                          zExp = new Complex(x1 - x2, y1);
                    // Exercise
                    const z = z1.sub(x2);
                    // Verify
                    assert(z.equals(zExp, epsilon), `${z1} - ${x2} != ${zExp}`);
                });
            });

            it('should return the proper value', () => {
                assert(c.sub(0).equals(c));
                assert(c.sub(Complex.ZERO).equals(c));

                assert(c.sub(Infinity).isInfinite());
                assert(c.sub(-Infinity).isInfinite());
                assert(c.sub(Complex.INFINITY).isInfinite());

                assert(c.sub(NaN).isNaN());
                assert(c.sub(Complex.NaN).isNaN());
            });
        });

        describe('#mul()', () => {

            it('should return a product of two complex numbers', () => {
                repeat(100, () => {
                    // SetUp
                    const x1 = rand(), y1 = rand(), x2 = rand(), y2 = rand();
                    const z1 = new Complex(x1, y1), z2 = new Complex(x2, y2),
                          zExp = new Complex(x1*x2 - y1*y2, x1*y2 + x2*y1);
                    // Exercise
                    const z = z1.mul(z2);
                    // Verify
                    assert(z.equals(zExp, epsilon), `${z1} + ${z2} != ${zExp}`);
                });
            });

            it('should return a product of a complex number and a real number', () => {
                repeat(100, () => {
                    // SetUp
                    const x1 = rand(), y1 = rand(), x2 = rand();
                    const z1 = new Complex(x1, y1),
                          zExp = new Complex(x1 * x2, y1 * x2);
                    // Exercise
                    const z = z1.mul(x2);
                    // Verify
                    assert(z.equals(zExp, epsilon), `${z1} * ${x2} != ${zExp}`);
                });
            });

            it('should return the proper value', () => {
                assert(c.mul(0).equals(Complex.ZERO));
                assert(c.mul(Complex.ZERO).equals(Complex.ZERO));

                assert(c.mul(Infinity).isInfinite());
                assert(c.mul(-Infinity).isInfinite());
                assert(c.mul(Complex.INFINITY).isInfinite());

                assert(c.mul(NaN).isNaN());
                assert(c.mul(Complex.NaN).isNaN());
            });
        });

        describe('#div()', () => {
            // -34.80332885276536+40.155923672682036i / 0.3346473416832936+0.29204965841274344i != 0.4089697611367902+119.63783722964983i
            it('should return a quotient of two complex numbers', () => {
                repeat(100, () => {
                    // SetUp
                    const x1 = rand(), y1 = rand(), x2 = rand(), y2 = rand();
                    const r = x2*x2 + y2*y2;
                    const z1 = new Complex(x1, y1), z2 = new Complex(x2, y2),
                          zExp = new Complex((x1*x2 + y1*y2)/r, (-x1*y2 + y1*x2)/r);
                    // Exercise
                    const z = z1.div(z2);
                    // Verify
                    assert(z.equals(zExp, epsi), `(${z1})/(${x2}) != ${zExp}`);
                });
            });

            it('should return a quotient of a complex number and a real number', () => {
                repeat(100, () => {
                    // SetUp
                    const x1 = rand(), y1 = rand(), x2 = rand();
                    const z1 = new Complex(x1, y1),
                          zExp = new Complex(x1 / x2, y1 / x2);
                    // Exercise
                    const z = z1.div(x2);
                    // Verify
                    assert(z.equals(zExp, epsilon), `(${z1})/(${x2}) != ${zExp}`);
                });
            });

            it('should return the proper value', () => {
                assert(c.div(0).isInfinite());
                assert(c.div(Complex.ZERO).isInfinite());

                assert(c.div(Infinity).isZero());
                assert(c.div(-Infinity).isZero());
                assert(c.div(Complex.INFINITY).isZero());

                assert(c.div(NaN).isNaN());
                assert(c.div(Complex.NaN).isNaN());
            });
        });

        describe('#pow()', () => {

            it('should return an integral power (Complex type) of the base complex number', () => {
                const TWO = new Complex(2, 0), THREE = new Complex(3, 0);
                repeat(10, () => {
                    const x1 = rand(), y1 = rand();
                    const z = new Complex(x1, y1);
                    const z2 = z.mul(z), z3 = z2.mul(z);

                    assertEqualComplex(z.pow(Complex.ZERO), Complex.ONE, epsi, `(${z})^0 != 1`);

                    assertEqualComplex(z.pow(Complex.ONE), z, epsilon, `(${z})^1 != ${z}`);
                    assertEqualComplex(z.pow(Complex.MINUS_ONE), z.recip(), epsilon, `(${z})^-1 != 1/z`);

                    assertEqualComplex(z.pow(TWO), z2, epsilon, `(${z})^2 != ${z2}`);
                    assertEqualComplex(z.pow(TWO.neg()), z2.recip(), epsilon, `(${z})^-2 != ${z2.recip()}`);

                    assertEqualComplex(z.pow(THREE), z3, epsilon, `(${z})^3 != ${z3}`);
                    assertEqualComplex(z.pow(THREE.neg()), z3.recip(), epsilon, `(${z})^-3 != ${z3.recip()}`);

                    const m = Math.ceil(Math.random() * 15);
                    let zm = z;
                    for(let i = 1; i < m; i++) zm = zm.mul(z);
                    const M = new Complex(m, 0), eps = zm.abs()*epsi;
                    assertEqualComplex(z.pow(M), zm, eps, `(${z})^${m} != ${zm}`);
                    assertEqualComplex(z.pow(M.neg()), zm.recip(), eps, `(${z})^-${m} != ${zm.recip()}`);
                });
            });

            it('should return a power of the base complex number', () => {
                repeat(100, () => {
                    // SetUp
                    const x1 = rand(), y1 = rand(), x2 = rand(), y2 = rand();
                    const z1 = new Complex(x1, y1), z2 = new Complex(x2, y2),
                          zExp = CMath.exp(z2.mul(CMath.log(z1)));
                    // Exercise
                    const z = z1.pow(z2);
                    // Verify
                    assert(z.equals(zExp, epsilon), `${z1} ^ ${z2} != ${zExp}`);
                });
            });

            it('should return an integral power (number type) of a complex number', () => {
                repeat(10, () => {
                    const x1 = rand(), y1 = rand();
                    const z = new Complex(x1, y1);
                    const z2 = z.mul(z), z3 = z2.mul(z);

                    assertEqualComplex(z.pow(0), Complex.ONE, epsi, `(${z})^0 != 1`);

                    assertEqualComplex(z.pow(1), z, epsilon, `(${z})^1 != (${z})`);
                    assertEqualComplex(z.pow(-1), z.recip(), epsilon, `(${z})^-1 != ${z.recip()}`);

                    assertEqualComplex(z.pow(2), z2, epsilon, `(${z})^2 != ${z2}`);
                    assertEqualComplex(z.pow(-2), z2.recip(), epsilon, `(${z})^-2 != ${z2.recip()}`);

                    assertEqualComplex(z.pow(3), z3, epsilon, `(${z})^3 != ${z3}`);
                    assertEqualComplex(z.pow(-3), z3.recip(), epsilon, `(${z})^-3 != ${z3.recip()}`);

                    const m = Math.ceil(Math.random() * 15);
                    let zm = z;
                    for(let i = 1; i < m; i++) zm = zm.mul(z);
                    const eps = zm.abs()*epsi;
                    assertEqualComplex(z.pow(m), zm, eps, `(${z})^${m} != ${zm}`);
                    assertEqualComplex(z.pow(-m), zm.recip(), eps, `(${z})^-${m} != ${zm.recip()}`);
                });
            });

            it('should return a power of a complex number', () => {
                repeat(100, () => {
                    // SetUp
                    const x1 = rand(), y1 = rand(), x2 = Math.random() * 10 - 5;
                    const z1 = new Complex(x1, y1),
                          zExp = Complex.ofPolar(Math.pow(z1.abs(), x2), z1.arg()*x2);
                    // Exercise
                    const z = z1.pow(x2);
                    // Verify
                    assert(z.equals(zExp, z.abs()*epsilon), `(${z1}) ^ ${x2} != ${zExp}`);
                });
            });

            it('should return the proper value', () => {
                assert(c.pow(0).equals(Complex.ONE));
                assert(c.pow(Complex.ZERO).equals(Complex.ONE));

                // an infinite power of a complex number whose abs is greater than 1
                assert(c.pow(Infinity).isInfinite());
                assert(c.pow(-Infinity).isZero());
                assert(c.pow(Complex.INFINITY).isNaN());

                // an infinite power of a complex number whose abs is less than 1
                const d = new Complex(0.1, 0.2);
                assert(d.pow(Infinity).isZero());
                assert(d.pow(-Infinity).isInfinite());
                assert(d.pow(Complex.INFINITY).isNaN());

                // an infinite power of 1
                assert(Complex.ONE.pow(Infinity).equals(Complex.ONE));
                assert(Complex.ONE.pow(-Infinity).equals(Complex.ONE));
                assert(Complex.ONE.pow(Complex.INFINITY).equals(Complex.ONE));

                // an infinite power of -1, i, and -i
                [Complex.MINUS_ONE, Complex.I, Complex.MINUS_I].forEach(z => {
                    assert(z.pow(Infinity).isNaN());
                    assert(z.pow(-Infinity).isNaN());
                    assert(z.pow(Complex.INFINITY).isNaN());
                });

                assert(c.pow(NaN).isNaN());
                assert(c.pow(Complex.NaN).isNaN());
            });
        });
    });

    describe('elementary functions', () => {

        it('should return the same value if this is real', () => {
            repeat(20, () => {
                const x = rand(), z = new Complex(x, 0);

                assertEqualComplex(z.exp(), Math.exp(x), epsilon, `exp(${x})`);
                if(x > 0){
                    assertEqualComplex(z.log(), Math.log(x), epsilon, `log(${x})`);
                }

                assertEqualComplex(z.sin(), Math.sin(x)  , epsilon, `sin(${x})`);
                assertEqualComplex(z.cos(), Math.cos(x)  , epsilon, `cos(${x})`);
                assertEqualComplex(z.tan(), Math.tan(x)  , epsi   , `tan(${x})`);
                assertEqualComplex(z.sec(), 1/Math.cos(x), epsilon, `sec(${x})`);
                assertEqualComplex(z.csc(), 1/Math.sin(x), epsilon, `csc(${x})`);
                assertEqualComplex(z.cot(), 1/Math.tan(x), epsi     , `cot(${x})`);
                
                assertEqualComplex(z.sinh(), Math.sinh(x)  , epsilon, `sinh(${x})`);
                assertEqualComplex(z.cosh(), Math.cosh(x)  , epsilon, `cosh(${x})`);
                assertEqualComplex(z.tanh(), Math.tanh(x)  , epsi     , `tanh(${x})`);
                assertEqualComplex(z.sech(), 1/Math.cosh(x), epsilon, `sech(${x})`);
                assertEqualComplex(z.csch(), 1/Math.sinh(x), epsilon, `csch(${x})`);
                assertEqualComplex(z.coth(), 1/Math.tanh(x), epsi   , `coth(${x})`);
            });
        });

        it('should return the proper value if this is imaginary', () => {
            repeat(20, () => {
                const y = rand(), z = new Complex(0, y);

                assertEqualComplex(z.exp(), Complex.ofPolar(1, y), epsilon, `exp(${y}i)`);
                if(y > 0){
                    const exp = new Complex(Math.log(y), Math.PI/2);
                    assertEqualComplex(z.log(), exp, epsilon, `log(${y}i)`);
                }

                assertEqualComplex(z.sin(), new Complex(0, Math.sinh(y))   , epsilon, `sin(${y}i)`);
                assertEqualComplex(z.cos(), new Complex(Math.cosh(y), 0)   , epsilon, `cos(${y}i)`);
                assertEqualComplex(z.tan(), new Complex(0, Math.tanh(y))   , epsi   , `tan(${y}i)`);
                assertEqualComplex(z.sec(), new Complex(1/Math.cosh(y), 0) , epsilon, `sec(${y}i)`);
                assertEqualComplex(z.csc(), new Complex(0, -1/Math.sinh(y)), epsilon, `csc(${y}i)`);
                assertEqualComplex(z.cot(), new Complex(0, -1/Math.tanh(y)), epsi   , `cot(${y}i)`);
                
                assertEqualComplex(z.sinh(), new Complex(0, Math.sin(y))   , epsilon, `sinh(${y}i)`);
                assertEqualComplex(z.cosh(), new Complex(Math.cos(y), 0)   , epsilon, `cosh(${y}i)`);
                assertEqualComplex(z.tanh(), new Complex(0, Math.tan(y))   , epsi   , `tanh(${y}i)`);
                assertEqualComplex(z.sech(), new Complex(1/Math.cos(y), 0) , epsilon, `sech(${y}i)`);
                assertEqualComplex(z.csch(), new Complex(0, -1/Math.sin(y)), epsilon, `csch(${y}i)`);
                assertEqualComplex(z.coth(), new Complex(0, -1/Math.tan(y)), epsi   , `coth(${y}i)`);
            });
        });

        describe('should satisfy the following relations', () => {

            it('exp and log', () => {
                repeat(20, () => {
                    const z = new Complex(rand(), rand());

                    // log(exp(z)) === z + 2mπi
                    const z1 = z.exp().log();
                    assert.approximately(z1.re, z.re, epsilon, 'log(exp(z))');
                    const m1 = (z1.im - z.im)/(2*Math.PI)
                    assert.approximately(m1, Math.round(m1), epsilon, 'log(exp())');
                    
                    // exp(log(z)) === z + 2mπi
                    const z2 = z.exp().log();
                    assert.approximately(z2.re, z.re, epsilon, 'exp(log(z))');
                    const m2 = (z2.im - z.im)/(2*Math.PI)
                    assert.approximately(m2, Math.round(m2), epsilon, 'exp(log())');
                });
            });

            function rand(){ return Math.random() * 10 - 5; }

            it('trigonometric functions', () => {
                const z = new Complex(rand(), rand());
                const sin_z = z.sin(), cos_z = z.cos(), tan_z = z.tan(),
                      sec_z = z.sec(), csc_z = z.csc(), cot_z = z.cot();

                assertEqualComplex(sec_z, cos_z.recip(), epsilon, 'sec z = 1/cos z');
                assertEqualComplex(csc_z, sin_z.recip(), epsilon, 'csc z = 1/sin z');
                assertEqualComplex(cot_z, tan_z.recip(), epsilon, 'cot z = 1/tan z');

                assertEqualComplex(sin_z.pow(2).add(cos_z.pow(2)), Complex.ONE, epsi,
                                   'sin²z + cos²z = 1');

                assertEqualComplex(sec_z.pow(2).sub(tan_z.pow(2)), Complex.ONE, epsi,
                                    '1/cos²z - tan²z = 1');

                assertEqualComplex(csc_z.pow(2).sub(cot_z.pow(2)), Complex.ONE, epsi,
                                    '1/sin²z - cot²z = 1');
            });

            it('hyperbolic functions', () => {
                const z = new Complex(rand(), rand());
                const sinh_z = z.sinh(), cosh_z = z.cosh(), tanh_z = z.tanh(),
                      sech_z = z.sech(), csch_z = z.csch(), coth_z = z.coth();

                assertEqualComplex(sech_z, cosh_z.recip(), epsilon, 'sech z = 1/cosh z');
                assertEqualComplex(csch_z, sinh_z.recip(), epsilon, 'csch z = 1/sinh z');
                assertEqualComplex(coth_z, tanh_z.recip(), epsilon, 'coth z = 1/tanh z');

                assertEqualComplex(cosh_z.pow(2).sub(sinh_z.pow(2)), Complex.ONE, epsi,
                                   'cosh²z - sinh²z = 1');

                assertEqualComplex(tanh_z.pow(2).add(sech_z.pow(2)), Complex.ONE, epsi,
                                   'tanh²z + 1/cosh²z = 1');

                assertEqualComplex(coth_z.pow(2).sub(csch_z.pow(2)), Complex.ONE, epsi,
                                   'coth²z - 1/sinh²z = 1');
            });
        });

        describe('nth root', () => {

            it('#sqrt() should return a square root of this complex number', () => {
                repeat(20, () => {
                    const z = new Complex(rand(), rand());
                    const sqrt_z = z.sqrt();
                    assertEqualComplex(sqrt_z.mul(sqrt_z), z, epsi);
                });
            });

            it('#nroots() should return n-roots of this. complex number', () => {
                repeat(20, () => {
                    const z = new Complex(rand(), rand());
                    for(let i = 2; i < 10; i++){
                        const nroots = z.nroots(i);
                        nroots.forEach(root => {
                            assertEqualComplex(root.pow(i), z, epsi, `(${root})^${i} != ${z}`);
                        });
                    }
                });
            });
        });
    });

    describe('Zero', () => {

        it('Numerical properties should return the ZERO', () => { 
            assert(Complex.ZERO.re === 0);
            assert(Complex.ZERO.im === 0);

            assert(Complex.ZERO.abs() === 0);
            assert.isNaN(Complex.ZERO.arg());
        });

        it('boolean properties should return the proper value', () => {
            assert(Complex.ZERO.isReal());
            assert.isFalse(Complex.ZERO.isImaginary());
            assert(Complex.ZERO.isZero());
            assert(Complex.ZERO.isInteger());
            assert(Complex.ZERO.isGaussianInteger());
            assert(Complex.ZERO.isFinite());
            assert.isFalse(Complex.ZERO.isInfinite());
            assert.isFalse(Complex.ZERO.isNaN());
        });

        it('Unary operators should return the proper value', () => { 
            assert(Complex.ZERO.neg().equals(Complex.ZERO));
            assert(Complex.ZERO.conj().equals(Complex.ZERO));

            assert(Complex.ZERO.recip().equals(Complex.INFINITY));
        });

        describe('Binary operators', () => {

            it('#add() should return the proper value', () => {
                assert(Complex.ZERO.add(3).equals(new Complex(3, 0)));
                assert(Complex.ZERO.add(c).equals(c));

                assert(Complex.ZERO.add(0).isZero());
                assert(Complex.ZERO.add(Complex.ZERO).isZero());

                assert(Complex.ZERO.add(Infinity).isInfinite());
                assert(Complex.ZERO.add(-Infinity).isInfinite());
                assert(Complex.ZERO.add(Complex.INFINITY).isInfinite());

                assert(Complex.ZERO.add(NaN).isNaN());
                assert(Complex.ZERO.add(Complex.NaN).isNaN());
            });

            it('#sub() should return the proper value', () => {
                assert(Complex.ZERO.sub(3).equals(new Complex(-3, 0)));
                assert(Complex.ZERO.sub(c).equals(c.neg()));

                assert(Complex.ZERO.sub(0).isZero());
                assert(Complex.ZERO.sub(Complex.ZERO).isZero());

                assert(Complex.ZERO.sub(Infinity).isInfinite());
                assert(Complex.ZERO.sub(-Infinity).isInfinite());
                assert(Complex.ZERO.sub(Complex.INFINITY).isInfinite());

                assert(Complex.ZERO.sub(NaN).isNaN());
                assert(Complex.ZERO.sub(Complex.NaN).isNaN());
            });

            it('#mul() should return the proper value', () => {
                assert(Complex.ZERO.mul(3).equals(Complex.ZERO));
                assert(Complex.ZERO.mul(c).equals(Complex.ZERO));

                assert(Complex.ZERO.mul(0).isZero());
                assert(Complex.ZERO.mul(Complex.ZERO).isZero());

                assert(Complex.ZERO.mul(Infinity).isNaN());
                assert(Complex.ZERO.mul(-Infinity).isNaN());
                assert(Complex.ZERO.mul(Complex.INFINITY).isNaN());

                assert(Complex.ZERO.mul(NaN).isNaN());
                assert(Complex.ZERO.mul(Complex.NaN).isNaN());
            });

            it('#div() should return the proper value', () => {
                assert(Complex.ZERO.div(3).equals(Complex.ZERO));
                assert(Complex.ZERO.div(c).equals(Complex.ZERO));

                assert(Complex.ZERO.div(0).isNaN());
                assert(Complex.ZERO.div(Complex.ZERO).isNaN());

                assert(Complex.ZERO.div(Infinity).isZero());
                assert(Complex.ZERO.div(-Infinity).isZero());
                assert(Complex.ZERO.div(Complex.INFINITY).isZero());

                assert(Complex.ZERO.div(NaN).isNaN());
                assert(Complex.ZERO.div(Complex.NaN).isNaN());
            });

            it('#pow() should return the proper value', () => {
                assert(Complex.ZERO.pow(2).isZero);
                assert(Complex.ZERO.pow(-3).isInfinite());
                assert(Complex.ZERO.pow(new Complex(4, 0)).isZero());
                assert(Complex.ZERO.pow(new Complex(-5, 0)).isInfinite());
                assert(Complex.ZERO.pow(new Complex(6, 7)).isZero());
                assert(Complex.ZERO.pow(new Complex(-8, 9)).isInfinite());

                assert(Complex.ZERO.pow(0).isNaN());
                assert(Complex.ZERO.pow(Complex.ZERO).isNaN());

                assert(Complex.ZERO.pow(Infinity).isZero());
                assert(Complex.ZERO.pow(-Infinity).isInfinite());
                assert(Complex.ZERO.pow(Complex.INFINITY).isNaN());

                assert(Complex.ZERO.pow(NaN).isNaN());
                assert(Complex.ZERO.pow(Complex.NaN).isNaN());
            });
        });
    });

    describe('Infinity', () => {

        it('Complex instance is the Infinity(C) if one of the arguments of constructor is so', () => {
            const table: Complex[] = [
                new Complex(2, Infinity),
                new Complex(Infinity, 3),
                new Complex(Infinity, Infinity),
                new Complex(4, -Infinity),
                new Complex(-Infinity, 5),
                new Complex(-Infinity, -Infinity),

                new Complex(Infinity, -Infinity),
                new Complex(-Infinity, Infinity),
            ]

            table.forEach(c => {
                assert.isFalse(c.isFinite());
                assert(c.isInfinite());
                assert.isFalse(isFinite(c.re));
                assert.isFalse(isFinite(c.im));
            });
        })

        it('Numerical properties should return the Infinity', () => { 
            assert.isFalse(isFinite(Complex.INFINITY.re));
            assert.isFalse(isFinite(Complex.INFINITY.im));

            assert.isFalse(isFinite(Complex.INFINITY.abs()));
            assert.isNaN(Complex.INFINITY.arg());
        });

        it('boolean properties should return the proper value', () => {
            assert.isFalse(Complex.INFINITY.isReal());
            assert.isFalse(Complex.INFINITY.isImaginary());
            assert.isFalse(Complex.INFINITY.isZero());
            assert.isFalse(Complex.INFINITY.isInteger());
            assert.isFalse(Complex.INFINITY.isGaussianInteger());
            assert.isFalse(Complex.INFINITY.isFinite());
            assert(Complex.INFINITY.isInfinite());
            assert.isFalse(Complex.INFINITY.isNaN());
        });

        it('Unary operators should return the proper value', () => { 
            assert.isFalse(Complex.INFINITY.neg().isFinite());
            assert.isFalse(Complex.INFINITY.conj().isFinite());

            assert(Complex.INFINITY.recip().equals(Complex.ZERO));
        });

        describe('Binary operators', () => {

            it('#add() should return the proper value', () => {
                assert(Complex.INFINITY.add(5).isInfinite());
                assert(Complex.INFINITY.add(c).isInfinite());

                assert(Complex.INFINITY.add(0).isInfinite());
                assert(Complex.INFINITY.add(Complex.ZERO).isInfinite());

                assert(Complex.INFINITY.add(Infinity).isNaN());
                assert(Complex.INFINITY.add(-Infinity).isNaN());
                assert(Complex.INFINITY.add(Complex.INFINITY).isNaN());

                assert(Complex.INFINITY.add(NaN).isNaN());
                assert(Complex.INFINITY.add(Complex.NaN).isNaN());
            });

            it('#sub() should return the proper value', () => {
                assert(Complex.INFINITY.sub(5).isInfinite());
                assert(Complex.INFINITY.sub(c).isInfinite());

                assert(Complex.INFINITY.sub(0).isInfinite());
                assert(Complex.INFINITY.sub(Complex.ZERO).isInfinite());

                assert(Complex.INFINITY.sub(Infinity).isNaN());
                assert(Complex.INFINITY.sub(-Infinity).isNaN());
                assert(Complex.INFINITY.sub(Complex.INFINITY).isNaN());

                assert(Complex.INFINITY.sub(NaN).isNaN());
                assert(Complex.INFINITY.sub(Complex.NaN).isNaN());
            });

            it('#mul() should return the proper value', () => {
                assert(Complex.INFINITY.mul(5).isInfinite());
                assert(Complex.INFINITY.mul(c).isInfinite());

                assert(Complex.INFINITY.mul(0).isNaN());
                assert(Complex.INFINITY.mul(Complex.ZERO).isNaN());

                assert(Complex.INFINITY.mul(Infinity).isInfinite());
                assert(Complex.INFINITY.mul(-Infinity).isInfinite());
                assert(Complex.INFINITY.mul(Complex.INFINITY).isInfinite());

                assert(Complex.INFINITY.mul(NaN).isNaN());
                assert(Complex.INFINITY.mul(Complex.NaN).isNaN());
            });

            it('#div() should return the proper value', () => {
                assert(Complex.INFINITY.div(5).isInfinite());
                assert(Complex.INFINITY.div(c).isInfinite());

                assert(Complex.INFINITY.div(0).isInfinite());
                assert(Complex.INFINITY.div(Complex.ZERO).isInfinite());

                assert(Complex.INFINITY.div(Infinity).isNaN());
                assert(Complex.INFINITY.div(-Infinity).isNaN());
                assert(Complex.INFINITY.div(Complex.INFINITY).isNaN());

                assert(Complex.INFINITY.div(NaN).isNaN());
                assert(Complex.INFINITY.div(Complex.NaN).isNaN());
            });

            it('#pow() should return the proper value', () => {
                assert(Complex.INFINITY.pow(2).isInfinite());
                assert(Complex.INFINITY.pow(-3).isZero());
                assert(Complex.INFINITY.pow(new Complex(4, 0)).isInfinite());
                assert(Complex.INFINITY.pow(new Complex(-5, 0)).isZero());
                assert(Complex.INFINITY.pow(new Complex(6, 7)).isInfinite());
                assert(Complex.INFINITY.pow(new Complex(-8, 9)).isZero());

                assert(Complex.INFINITY.pow(0).isNaN());
                assert(Complex.INFINITY.pow(Complex.ZERO).isNaN());

                assert(Complex.INFINITY.pow(Infinity).isInfinite());
                assert(Complex.INFINITY.pow(-Infinity).isZero());
                assert(Complex.INFINITY.pow(Complex.INFINITY).isNaN());

                assert(Complex.INFINITY.pow(NaN).isNaN());
                assert(Complex.INFINITY.pow(Complex.NaN).isNaN());
            });
        });

        it('elementary functions should return Infinity(C)', () => {
            const table: Complex[] = [
                
                Complex.INFINITY.sqrt(),

                Complex.INFINITY.exp(),
                Complex.INFINITY.log(),

                // Complex.INFINITY.sin(),
                // Complex.INFINITY.cos(),
                // Complex.INFINITY.tan(),
                // Complex.INFINITY.sec(),
                // Complex.INFINITY.csc(),
                // Complex.INFINITY.cot(),
                
                // Complex.INFINITY.sinh(),
                // Complex.INFINITY.cosh(),
                // Complex.INFINITY.tanh(),
                // Complex.INFINITY.sech(),
                // Complex.INFINITY.csch(),
                // Complex.INFINITY.coth()
            ]

            table.forEach(c => {
                assert(c.isInfinite);
            });
        });
    });

    describe('NaN', () => {

        it('Complex instance is NaN(C) if at least one of the arguments of constructor is NaN', () => {
            const table: Complex[] = [
                new Complex(NaN, NaN),
                new Complex(NaN, 2),
                new Complex(3, NaN)
            ]

            table.forEach(c => {
                assert(c.isNaN);
                assert.isNaN(c.re);
                assert.isNaN(c.im);
            });
        })

        it('NaN(C) should be neither real or imaginary', () => {
            assert.isFalse(Complex.NaN.isReal());
            assert.isFalse(Complex.NaN.isImaginary());
        });

        it('Numerical properties should return NaN', () => { 
            assert.isNaN(Complex.NaN.re);
            assert.isNaN(Complex.NaN.im);

            assert.isNaN(Complex.NaN.abs());
            assert.isNaN(Complex.NaN.arg());
        });

        it('boolean properties should return the proper value', () => {
            assert.isFalse(Complex.NaN.isReal());
            assert.isFalse(Complex.NaN.isImaginary());
            assert.isFalse(Complex.NaN.isZero());
            assert.isFalse(Complex.NaN.isInteger());
            assert.isFalse(Complex.NaN.isGaussianInteger());
            assert.isFalse(Complex.NaN.isFinite());
            assert.isFalse(Complex.NaN.isInfinite());
            assert(Complex.NaN.isNaN());
        });

        it('Unary operators should return NaN or NaN(C)', () => { 
            assert(Complex.NaN.neg().isNaN());
            assert(Complex.NaN.conj().isNaN());
            assert(Complex.NaN.recip().isNaN());
        });

        it('Binary operators should return NaN(C)', () => {
            const table: (Complex | number)[] = [
                5, c,
                0, Complex.ZERO, 
                Infinity, -Infinity, Complex.INFINITY, 
                NaN, Complex.NaN
            ]

            table.forEach(z => {
                assert(Complex.NaN.add(z).isNaN());
                assert(Complex.NaN.sub(z).isNaN());
                assert(Complex.NaN.mul(z).isNaN());
                assert(Complex.NaN.div(z).isNaN());
                assert(Complex.NaN.pow(z).isNaN());
            })
        });

        it('elementary functions should return NaN(C)', () => {
            const table: Complex[] = [
                Complex.NaN.sqrt(),

                Complex.NaN.exp(),
                Complex.NaN.log(),

                Complex.NaN.sin(),
                Complex.NaN.cos(),
                Complex.NaN.tan(),
                Complex.NaN.sec(),
                Complex.NaN.csc(),
                Complex.NaN.cot(),
                
                Complex.NaN.sinh(),
                Complex.NaN.cosh(),
                Complex.NaN.tanh(),
                Complex.NaN.sech(),
                Complex.NaN.csch(),
                Complex.NaN.coth()
            ]

            table.forEach(c => {
                assert(c.isNaN());
            });
        });
    });
});