import { assert } from 'chai';
import { complex, CMath, Complex } from './Complex';

const epsilon = 1e-14;
const epsi = 1e-11;

function assertEqualComplex(
        actual: Complex, expected: Complex | number, epsilon: number, message: string = ''){
    assert(actual.equals(expected, epsilon), message + `: ${actual} != ${expected}`)
}

function repeat(n: number, f: () => void): void {
    for(let i = 0; i < n; i++) f();
}

function rand(): number {
    return Math.random() < 0.5 ? Math.random() : Math.round(Math.random());
}

function randComplex(): Complex {
    return complex(rand(), rand());
}

describe('Complex', () => {

    describe('#complex() factory method and the predefined constants', () => {

        it('Predefined constants should have the proper property values', () => { 
            assert(Complex.ZERO.re === 0);
            assert(Complex.ZERO.im === 0);

            assert(Complex.ONE.re === 1);
            assert(Complex.ONE.im === 0);

            assert(Complex.INFINITY.re === Infinity);
            assert(Complex.INFINITY.im === Infinity);

            assert.isNaN(Complex.NaN.re);
            assert.isNaN(Complex.NaN.im);
        });

        it('A Complex object is the Complex.INFINITY if at least one of the arguments of constructor is Infinity', () => {
            const table: Complex[] = [
                complex(2, Infinity),
                complex(Infinity, 3),
                complex(Infinity, Infinity),
                complex(4, -Infinity),
                complex(-Infinity, 5),
                complex(-Infinity, -Infinity),

                complex(Infinity, -Infinity),
                complex(-Infinity, Infinity),
            ]

            table.forEach(c => {
                assert(c.isInfinite);
                assert.isFalse(c.isFinite);
                assert.isFalse(isFinite(c.re));
                assert.isFalse(isFinite(c.im));
            });
        });


        it('A Complex object is Complex.NaN if at least one of the arguments of constructor is NaN', () => {
            const table: Complex[] = [
                complex(NaN, NaN),
                complex(NaN, 2),
                complex(3, NaN)
            ]

            table.forEach(c => {
                assert(c.isNaN);
                assert.isNaN(c.re);
                assert.isNaN(c.im);
            });
        });
    });

    describe('#toString()', () => {

        it('should return the proper string', () => {
            const table: [Complex, string][] = [
                [Complex.ZERO, '0'],

                [Complex.ONE, '1'],
                [Complex.MINUS_ONE, '-1'],
                [Complex.I, 'i'],
                [Complex.MINUS_I, '-i'],

                [complex(2, 0), '2'],
                [complex(0, 2), '2i'],
                [complex(-2, 0), '-2'],
                [complex(0, -2), '-2i'],

                [complex(3, 4), '3+4i'],
                [complex(-3, 4), '-3+4i'],
                [complex(3, -4), '3-4i'],
                [complex(-3, -4), '-3-4i'],

                [Complex.INFINITY, '∞(C)'],
                [Complex.NaN, 'NaN(C)']
            ]

            table.forEach(entry => {
                assert.equal(entry[0].toString(), entry[1]);
            });
        });
    });

    describe('#equals() should return the proper value', () => {
        const c1 = complex(2, 3), c2 = complex(2, 3);
        assert.isFalse(c1 === c2);
        assert(c1.equals(c2));

        // Infinity
        assert(Infinity === Infinity); // The language spec
        assert(complex(Infinity, 1).equals(Complex.INFINITY));

        // NaN
        assert.isFalse(NaN === NaN); // The language spec
        assert.isFalse(complex(NaN, 1).equals(Complex.NaN));
    });

    const INT = complex(3, 0);
    const _INT = complex(-4, 0);
    const GAUSS_INT1 = complex(5, 6);
    const GAUSS_INT2 = complex(7, -8);
    const GAUSS_INT3 = complex(-9, -10);
    const GAUSS_INT4 = complex(-11, 12);

    const REAL = complex(2.3);
    const _REAL = complex(-4.5)
    const IMAGINARY = complex(0, 6.7);
    const _IMAGINARY = complex(0, -8.9);
    const NOT_GAUSS_INT1 = complex(2, 3.4);
    const NOT_GAUSS_INT2 = complex(5.6, 7);

    const COMPLEX1 = complex(0.1, 2.3);
    const COMPLEX2 = complex(4.5, -6.7);
    const COMPLEX3 = complex(-8.9, -1.2);
    const COMPLEX4 = complex(-3.4, 5.6);

    const complexes: Complex[] = [
        Complex.ZERO, Complex.ONE, Complex.MINUS_ONE, Complex.I, Complex.MINUS_I,
        INT, _INT, GAUSS_INT1, GAUSS_INT2, GAUSS_INT3, GAUSS_INT4,
        REAL, _REAL, IMAGINARY, _IMAGINARY, NOT_GAUSS_INT1, NOT_GAUSS_INT2,
        COMPLEX1, COMPLEX2, COMPLEX3, COMPLEX4,
        Complex.INFINITY, Complex.NaN
    ];

    describe('properties', () => {

        describe('boolean properties', () => {
    
            it('#isReal should return the proper value', () => {
                const expected = [
                    Complex.ZERO, Complex.ONE, Complex.MINUS_ONE,
                    INT, _INT, REAL, _REAL
                ];
                const actual = complexes.filter(c => c.isReal);
                assert.sameMembers(actual, expected);
            });
    
            it('#isImaginary should return the proper value', () => {
                const expected = [
                    Complex.I, Complex.MINUS_I,
                    IMAGINARY, _IMAGINARY
                ];
                const actual = complexes.filter(c => c.isImaginary);
                assert.sameMembers(actual, expected);
            });
    
            it('#isZero should return the proper value', () => {
                const expected = [Complex.ZERO];
                const actual = complexes.filter(c => c.isZero);
                assert.sameMembers(actual, expected);
            });
    
            it('#isOne should return the proper value', () => {
                const expected = [Complex.ONE];
                const actual = complexes.filter(c => c.isOne);
                assert.sameMembers(actual, expected);
            });
    
            it('#isFinite should return the proper value', () => {
                const expected = complexes.filter(c => !(c.isInfinite || c.isNaN));
                const actual = complexes.filter(c => c.isFinite);
                assert.sameMembers(actual, expected);
            });
    
            it('#isInfinite should return the proper value', () => {
                const expected = [Complex.INFINITY];
                const actual = complexes.filter(c => c.isInfinite);
                assert.sameMembers(actual, expected);
            });
    
            it('#isNaN should return the proper value', () => {
                const expected = [Complex.NaN];
                const actual = complexes.filter(c => c.isNaN);
                assert.sameMembers(actual, expected);
            });
    
            it('#isInteger should return the proper value', () => {
                const expected = [
                    Complex.ZERO, Complex.ONE, Complex.MINUS_ONE,
                    INT, _INT
                ];
                const actual = complexes.filter(c => c.isInteger);
                assert.sameMembers(actual, expected);
            });
    
            it('#isGaussianInteger should return the proper value', () => {
                const expected = [
                    Complex.ZERO, Complex.ONE, Complex.MINUS_ONE, Complex.I, Complex.MINUS_I,
                    INT, _INT, GAUSS_INT1, GAUSS_INT2, GAUSS_INT3, GAUSS_INT4
                ];
                const actual = complexes.filter(c => c.isGaussianInteger);
                assert.sameMembers(actual, expected);
            });
        });

        describe('Numerical Properties', () => {

            describe('Unary Operations', () => {

                it('#abs should return the proper value', () => {
                    complexes.filter(c => c.isFinite).forEach(c => {
                        assert.approximately(c.abs, Math.hypot(c.re, c.im), epsilon, `abs of ${c}`);
                    });
        
                    assert.isFalse(isFinite(Complex.INFINITY.abs));
                    assert.isNaN(Complex.NaN.abs);
                });
        
                it('#arg should return the proper value', () => {
                    complexes.filter(c => c.isFinite && !c.isZero).forEach(c => {
                        assert.approximately(c.arg, Math.atan2(c.im, c.re), epsilon, `arg of ${c}`);
                    });
        
                    [Complex.ZERO, Complex.INFINITY, Complex.NaN].forEach(c => {
                        assert.isNaN(c.arg);
                    });
                });
            });
        });
    });

    describe('Unary operations', () => {
        
        it('#negate() should return the proper value', () => {
            complexes.filter(c => c.isFinite).forEach(c => {
                assertEqualComplex(c.negate(), complex(-c.re, -c.im), epsilon, `negate of ${c}`);
                assertEqualComplex(c.negate().plus(c), Complex.ZERO, epsilon, `negate of ${c}`);
            });

            assert(Complex.INFINITY.negate().isInfinite);
            assert(Complex.NaN.negate().isNaN);
        });

        it('#conjugate() should return the proper value', () => {
            complexes.filter(c => c.isFinite).forEach(c => {
                assertEqualComplex(c.conjugate(), complex(c.re, -c.im), epsilon, `negate of ${c}`);
                assertEqualComplex(c.conjugate().plus(c), 2*c.re, epsilon);
                assertEqualComplex(c.conjugate().times(c), c.re*c.re + c.im*c.im, epsilon);
            });

            assert(Complex.INFINITY.conjugate().isInfinite);
            assert(Complex.NaN.conjugate().isNaN);
        });

        it('#reciprocal() should return the proper value', () => {
            complexes.filter(c => c.isFinite && !c.isZero).forEach(c => {
                assertEqualComplex(c.reciprocal().times(c), Complex.ONE, epsilon, `reciprocal of ${c}`);
            });

            assert(Complex.ZERO.reciprocal().isInfinite);
            assert(Complex.INFINITY.reciprocal().isZero);
            assert(Complex.NaN.reciprocal().isNaN);
        });
    });

    describe('Binary operations', () => {

        describe('#plus()', () => {

            it('should return a sum of two complex numbers', () => {
                function test(z1: Complex, z2: Complex){
                    const zExp = complex(z1.re + z2.re, z1.im + z2.im);
                    assertEqualComplex(z1.plus(z2), zExp, epsilon, `${z1} + ${z2} != ${zExp}`);
                }

                repeat(500, () => test(randComplex(), randComplex()));
                repeat(10, () => test(Complex.ZERO, randComplex()));
                repeat(10, () => test(Complex.ONE, randComplex()));
            });

            it('should return the same result if the argument is number or Complex', () => {
                function test(z: Complex, a: number){
                    const zExp = z.plus(complex(a));
                    assertEqualComplex(z.plus(a), zExp, epsilon, `${z} + ${a} != ${zExp}`);
                }

                repeat(500, () => test(randComplex(), rand()));
                repeat(10, () => test(Complex.ZERO, rand()));
                repeat(10, () => test(Complex.ONE, rand()));
            });

            it('should return the proper value if the argument is the specific value', () => {
                function test(z: Complex){
                    assert(z.plus(0).equals(z));
                    assert(z.plus(Complex.ZERO).equals(z));

                    assert(z.plus(Infinity).isInfinite);
                    assert(z.plus(-Infinity).isInfinite);
                    assert(z.plus(Complex.INFINITY).isInfinite);

                    assert(z.plus(NaN).isNaN);
                    assert(z.plus(Complex.NaN).isNaN);
                }

                repeat(10, () => test(randComplex()));
                test(Complex.ZERO);
                test(Complex.ONE);
            });

            it('should return the proper value if the argument is the infinity or NaN', () => {
                repeat(10, () => {
                    const x = rand();
                    assert(Complex.INFINITY.plus(x).isInfinite);

                    const z = randComplex();
                    assert(Complex.INFINITY.plus(z).isInfinite);
                });

                assert(Complex.INFINITY.plus(0).isInfinite);
                assert(Complex.INFINITY.plus(Complex.ZERO).isInfinite);

                assert(Complex.INFINITY.plus(1).isInfinite);
                assert(Complex.INFINITY.plus(Complex.ONE).isInfinite);

                assert(Complex.INFINITY.plus(Infinity).isNaN);
                assert(Complex.INFINITY.plus(-Infinity).isNaN);
                assert(Complex.INFINITY.plus(Complex.INFINITY).isNaN);

                assert(Complex.INFINITY.plus(NaN).isNaN);
                assert(Complex.INFINITY.plus(Complex.NaN).isNaN);

                complexes.forEach(z => assert(Complex.NaN.plus(z).isNaN))
            });
        });

        describe('#minus()', () => {

            it('should return a difference of two complex numbers', () => {
                function test(z1: Complex, z2: Complex){
                    const zExp = complex(z1.re - z2.re, z1.im - z2.im);
                    assertEqualComplex(z1.minus(z2), zExp, epsilon, `${z1} + ${z2} != ${zExp}`);
                }

                repeat(500, () => test(randComplex(), randComplex()));
                repeat(10, () => test(Complex.ZERO, randComplex()));
                repeat(10, () => test(Complex.ONE, randComplex()));
            });

            it('should return the same result if the argument is number or Complex', () => {
                function test(z: Complex, a: number){
                    const zExp = z.minus(complex(a));
                    assertEqualComplex(z.minus(a), zExp, epsilon, `${z} - ${a} != ${zExp}`);
                }

                repeat(500, () => test(randComplex(), rand()));
                repeat(10, () => test(Complex.ZERO, rand()));
                repeat(10, () => test(Complex.ONE, rand()));
            });

            it('should return the proper value if the argument is the specific value', () => {
                function test(z: Complex){
                    assert(z.minus(0).equals(z));
                    assert(z.minus(Complex.ZERO).equals(z));

                    assert(z.minus(Infinity).isInfinite);
                    assert(z.minus(-Infinity).isInfinite);
                    assert(z.minus(Complex.INFINITY).isInfinite);

                    assert(z.minus(NaN).isNaN);
                    assert(z.minus(Complex.NaN).isNaN);
                }

                repeat(10, () => test(randComplex()));
                test(Complex.ZERO);
                test(Complex.ONE);
            });

            it('should return the proper value if the argument is the infinity or NaN', () => {
                repeat(10, () => {
                    const x = rand();
                    assert(Complex.INFINITY.minus(x).isInfinite);

                    const z = randComplex();
                    assert(Complex.INFINITY.minus(z).isInfinite);
                });

                assert(Complex.INFINITY.minus(0).isInfinite);
                assert(Complex.INFINITY.minus(Complex.ZERO).isInfinite);

                assert(Complex.INFINITY.minus(1).isInfinite);
                assert(Complex.INFINITY.minus(Complex.ONE).isInfinite);

                assert(Complex.INFINITY.minus(Infinity).isNaN);
                assert(Complex.INFINITY.minus(-Infinity).isNaN);
                assert(Complex.INFINITY.minus(Complex.INFINITY).isNaN);

                assert(Complex.INFINITY.minus(NaN).isNaN);
                assert(Complex.INFINITY.minus(Complex.NaN).isNaN);

                complexes.forEach(z => assert(Complex.NaN.minus(z).isNaN))
            });
        });

        describe('#times()', () => {

            it('should return a product of two complex numbers', () => {
                function test(z1: Complex, z2: Complex){
                    const zExp = complex(z1.re * z2.re - z1.im * z2.im, z1.re * z2.im + z1.im * z2.re);
                    assertEqualComplex(z1.times(z2), zExp, epsilon, `${z1} * ${z2} != ${zExp}`);
                }

                repeat(500, () => test(randComplex(), randComplex()));
                repeat(10, () => test(Complex.ZERO, randComplex()));
                repeat(10, () => test(Complex.ONE, randComplex()));
            });

            it('should return the same result if the argument is number or Complex', () => {
                function test(z: Complex, a: number){
                    const zExp = z.times(complex(a));
                    assertEqualComplex(z.times(a), zExp, epsilon, `${z} * ${a} != ${zExp}`);
                }

                repeat(500, () => test(randComplex(), rand()));
                repeat(10, () => test(Complex.ZERO, rand()));
                repeat(10, () => test(Complex.ONE, rand()));
            });

            it('should return the proper value if the argument is the specific value', () => {
                function test(z: Complex){
                    assert(z.times(0).isZero);
                    assert(z.times(Complex.ZERO).isZero);

                    if(z.isZero){
                        assert(z.times(Infinity).isNaN);
                        assert(z.times(-Infinity).isNaN);
                        assert(z.times(Complex.INFINITY).isNaN);
                    }else{
                        assert(z.times(Infinity).isInfinite);
                        assert(z.times(-Infinity).isInfinite);
                        assert(z.times(Complex.INFINITY).isInfinite);
                    }

                    assert(z.times(NaN).isNaN);
                    assert(z.times(Complex.NaN).isNaN);
                }

                repeat(10, () => test(randComplex()));
                test(Complex.ZERO);
                test(Complex.ONE);
            });

            it('should return the proper value if the argument is the infinity or NaN', () => {
                repeat(10, () => {
                    const x = rand();
                    if(x === 0){
                        assert(Complex.INFINITY.times(x).isNaN);
                    }else{
                        assert(Complex.INFINITY.times(x).isInfinite);
                    }

                    const z = randComplex();
                    if(z.isZero){
                        assert(Complex.INFINITY.times(z).isNaN);
                    }else{
                        assert(Complex.INFINITY.times(z).isInfinite);
                    }
                });

                assert(Complex.INFINITY.times(0).isNaN);
                assert(Complex.INFINITY.times(Complex.ZERO).isNaN);

                assert(Complex.INFINITY.times(1).isInfinite);
                assert(Complex.INFINITY.times(Complex.ONE).isInfinite);

                assert(Complex.INFINITY.times(Infinity).isInfinite);
                assert(Complex.INFINITY.times(-Infinity).isInfinite);
                assert(Complex.INFINITY.times(Complex.INFINITY).isInfinite);

                assert(Complex.INFINITY.times(NaN).isNaN);
                assert(Complex.INFINITY.times(Complex.NaN).isNaN);

                complexes.forEach(z => assert(Complex.NaN.times(z).isNaN))
            });
        });

        describe('#div()', () => {

            it('should return a product of two complex numbers', () => {
                function test(z1: Complex, z2: Complex){
                    if(z2.isZero){
                        if(z1.isZero){
                            assert(z1.div(z2).isNaN, `${z1} / 0 != ${Complex.NaN}: ${z1.div(z2)}`);
                        }else{
                            assert(z1.div(z2).isInfinite, `${z1} / 0 != ${Complex.INFINITY}: ${z1.div(z2)}`);
                        }
                    }else{
                        assertEqualComplex(z1.div(z2).times(z2), z1, epsilon, 
                                           `${z1} / ${z2} != ${z1.div(z2)}`);
                    }
                }

                repeat(500, () => test(randComplex(), randComplex()));
                repeat(10, () => test(Complex.ZERO, randComplex()));
                repeat(10, () => test(Complex.ONE, randComplex()));
            });

            it('should return the same result if the argument is number or Complex', () => {
                function test(z: Complex, a: number){
                    if(z.isZero && a === 0){
                        assert(z.div(a).isNaN, `${z} / ${a} != ${Complex.NaN}`);
                    }else{
                        const zExp = z.div(complex(a));
                        assertEqualComplex(z.div(a), zExp, epsilon, `${z} / ${a} != ${zExp}`);
                    }
                }

                repeat(500, () => test(randComplex(), rand()));
                repeat(10, () => test(Complex.ZERO, rand()));
                repeat(10, () => test(Complex.ONE, rand()));
            });

            it('should return the proper value if the argument is the specific value', () => {
                function test(z: Complex){
                    if(z.isZero){
                        assert(z.div(0).isNaN);
                        assert(z.div(Complex.ZERO).isNaN);
                    }else{
                        assert(z.div(0).isInfinite);
                        assert(z.div(Complex.ZERO).isInfinite);
                    }

                    assert(z.div(Infinity).isZero);
                    assert(z.div(-Infinity).isZero);
                    assert(z.div(Complex.INFINITY).isZero,
                           `${z} / ${Complex.INFINITY} != 0: ${z.div(Complex.INFINITY)}`);

                    assert(z.div(NaN).isNaN);
                    assert(z.div(Complex.NaN).isNaN);
                }

                repeat(10, () => test(randComplex()));
                test(Complex.ZERO);
                test(Complex.ONE);
            });

            it('should return the proper value if the argument is the infinity or NaN', () => {
                repeat(10, () => {
                    const x = rand();
                    assert(Complex.INFINITY.div(x).isInfinite);

                    const z = randComplex();
                    assert(Complex.INFINITY.div(z).isInfinite);
                });

                assert(Complex.INFINITY.div(0).isInfinite);
                assert(Complex.INFINITY.div(Complex.ZERO).isInfinite);

                assert(Complex.INFINITY.div(Infinity).isNaN);
                assert(Complex.INFINITY.div(-Infinity).isNaN);
                assert(Complex.INFINITY.div(Complex.INFINITY).isNaN);

                assert(Complex.INFINITY.div(NaN).isNaN);
                assert(Complex.INFINITY.div(Complex.NaN).isNaN);

                complexes.forEach(z => assert(Complex.NaN.div(z).isNaN))
            });
        });

        describe('#pow()', () => {

            it('should return the specific power of this complex number', () => {
                function test(z1: Complex, z2: Complex){
                    const z = z1.pow(z2);
                    if(z1.isZero){
                        if(z2.re > 0){
                            assert(z.isZero, `(${z1})^(${z2}) != 0`);
                        }else if(z2.re < 0){
                            assert(z.isInfinite, `(${z1})^(${z2}) != ${Complex.INFINITY}`);
                        }else{
                            assert(z.isNaN, `(${z1})^(${z2}) != ${Complex.NaN}`);
                        }

                    }else if(z1.isOne){
                        assert(z.isOne, `(${z1})^(${z2}) != 1}`)
                    }else{
                        const zExp = z1.log().times(z2).exp();
                        assertEqualComplex(z, zExp, epsilon, `(${z1})^(${z2}) != ${zExp}`);
                    }
                }

                repeat(500, () => test(randComplex(), randComplex()));
                repeat(10, () => test(Complex.ZERO, randComplex()));
                repeat(10, () => test(Complex.ONE, randComplex()));
            });

            it('should return the same result if the argument is number or Complex', () => {
                function test(z: Complex, a: number){
                    if(z.isZero && a === 0){
                        assert(z.pow(a).isNaN, `(${z})^${a} != ${Complex.NaN}`);
                    }else{
                        const zExp = z.pow(complex(a));
                        assertEqualComplex(z.pow(a), zExp, epsilon, `(${z})^(${a}) != ${zExp}`);
                    }
                }

                repeat(500, () => test(randComplex(), rand()));
                repeat(10, () => test(Complex.ZERO, rand()));
                repeat(10, () => test(Complex.ONE, rand()));
            });

            it('should return the proper value if the argument is the specific value', () => {
                function test(z: Complex){
                    if(z.isZero){
                        assert(z.pow(0).isNaN);
                        assert(z.pow(Complex.ZERO).isNaN);
                    }else{
                        assert(z.pow(0).isOne);
                        assert(z.pow(Complex.ZERO).isOne);
                    }

                    assertEqualComplex(z.pow(1), z, 0);
                    assertEqualComplex(z.pow(Complex.ONE), z, 0);

                    if(z.abs > 1){
                        assert(z.pow(Infinity).isInfinite);
                        assert(z.pow(-Infinity).isZero);
                        assert(z.pow(Complex.INFINITY).isNaN);

                    }else if(z.abs < 1){
                        assert(z.pow(Infinity).isZero);
                        assert(z.pow(-Infinity).isInfinite);
                        assert(z.pow(Complex.INFINITY).isNaN);

                    }else{
                        if(z.arg === 0){
                            assert(z.pow(Infinity).isOne);
                            assert(z.pow(-Infinity).isOne);
                            assert(z.pow(Complex.INFINITY).isOne);

                        }else{
                            assert(z.pow(Infinity).isNaN);
                            assert(z.pow(-Infinity).isNaN);
                            assert(z.pow(Complex.INFINITY).isNaN);
                        }
                    }

                    assert(z.pow(NaN).isNaN);
                    assert(z.pow(Complex.NaN).isNaN);
                }

                repeat(100, () => test(randComplex()));
                [Complex.ZERO, Complex.ONE, Complex.MINUS_ONE, 
                    Complex.I, Complex.MINUS_I].forEach(z => test(z));
            });

            it('should return the proper value if the argument is the infinity or NaN', () => {
                repeat(20, () => {
                    const x = rand();
                    if(x > 0){
                        assert(Complex.INFINITY.pow(x).isInfinite);
                    }else if(x < 0){
                        assert(Complex.INFINITY.pow(x).isZero);
                    }else{
                        assert(Complex.INFINITY.pow(x).isNaN);
                    }

                    const z = randComplex();
                    if(z.re > 0){
                        assert(Complex.INFINITY.pow(z).isInfinite);
                    }else if(z.re < 0){
                        assert(Complex.INFINITY.pow(z).isZero);
                    }else{
                        assert(Complex.INFINITY.pow(z).isNaN);
                    }
                });

                assert(Complex.INFINITY.pow(0).isNaN);
                assert(Complex.INFINITY.pow(Complex.ZERO).isNaN);

                assert(Complex.INFINITY.pow(1).isInfinite);
                assert(Complex.INFINITY.pow(Complex.ONE).isInfinite);

                assert(Complex.INFINITY.pow(-1).isZero);
                assert(Complex.INFINITY.pow(Complex.MINUS_ONE).isZero);

                assert(Complex.INFINITY.pow(Infinity).isInfinite);
                assert(Complex.INFINITY.pow(-Infinity).isZero);
                assert(Complex.INFINITY.pow(Complex.INFINITY).isNaN);

                assert(Complex.INFINITY.pow(NaN).isNaN);
                assert(Complex.INFINITY.pow(Complex.NaN).isNaN);

                complexes.forEach(z => assert(Complex.NaN.pow(z).isNaN))
            });
        });
    });

    describe('elementary functions', () => {

        describe('(general complex values)', () => {

            it('should return the proper complex value', () => {
                repeat(500, () => {
                    const x = rand(), y = rand();
                    const z = complex(x, y);

                    // exp and log
                    assertEqualComplex(z.exp(), Complex.ofPolar(Math.exp(x), y), epsilon, `exp(${z})`);
                    if(z.isZero){
                        assert(z.log().isNaN);
                    }else{
                        assertEqualComplex(z.log(), complex(Math.log(z.abs), z.arg), epsilon, `log(${z})`);
                    }

                    // trigonometric functions
                    assertEqualComplex(z.sin(), 
                        complex(Math.sin(x) * Math.cosh(y), Math.cos(x) * Math.sinh(y)),
                                epsilon, `sin(${z})`);

                    assertEqualComplex(z.cos(), 
                        complex(Math.cos(x) * Math.cosh(y), -Math.sin(x) * Math.sinh(y)),
                                epsilon, `cos(${z})`);

                    const d = Math.cos(2 * x) + Math.cosh(2 * y);
                    assertEqualComplex(z.tan(), 
                        complex(Math.sin(2 * x) / d, Math.sinh(2 * y) / d), epsilon, `tan(${z})`);
                    assertEqualComplex(z.cot(), z.tan().reciprocal(), epsilon, `cot(${z})`);

                    // hyperbolic functions
                    assertEqualComplex(z.sinh(), 
                        complex(Math.sinh(x) * Math.cos(y), Math.cosh(x) * Math.sin(y)),
                                epsilon, `sinh(${z})`);

                    assertEqualComplex(z.cosh(), 
                        complex(Math.cosh(x) * Math.cos(y), Math.sinh(x) * Math.sin(y)),
                                epsilon, `cosh(${z})`);

                    const dd = Math.cosh(2 * x) + Math.cos(2 * y);
                    assertEqualComplex(z.tanh(), 
                        complex(Math.sinh(2 * x) / dd, Math.sin(2 * y) / dd), epsilon, `tanh(${z})`);

                    assertEqualComplex(z.coth(), z.tanh().reciprocal(), epsilon, `coth(${z})`);

                    // sqrt and n-root
                    const sqrt_z = z.sqrt();
                    assertEqualComplex(sqrt_z.pow(2), z, epsilon, `sqrt(${z})`);

                    for(let i = 1; i < 10; i++){
                        const nroots = z.nroots(i);
                        nroots.forEach(root => {
                            assertEqualComplex(root.pow(i), z, epsilon, `(${root})^1/${i}`);
                        });
                    }
                });
            });
        });

        describe('(restricted complex values)', () => {

            it('should return the same value if this is real', () => {
                function test(x: number){
                    const z = complex(x, 0);
    
                    // exp and log
                    assertEqualComplex(z.exp(), Math.exp(x), epsilon, `exp(${x})`);
                    if(x > 0){
                        assertEqualComplex(z.log(), Math.log(x), epsilon, `log(${x})`);
                    }
    
                    // trigonometric functions
                    assertEqualComplex(z.sin(), Math.sin(x)  , epsilon, `sin(${x})`);
                    assertEqualComplex(z.cos(), Math.cos(x)  , epsilon, `cos(${x})`);
                    assertEqualComplex(z.tan(), Math.tan(x)  , epsilon, `tan(${x})`);
                    assertEqualComplex(z.cot(), 1/Math.tan(x), epsilon, `cot(${x})`);
                    
                    // hyperbolic functions
                    assertEqualComplex(z.sinh(), Math.sinh(x)  , epsilon, `sinh(${x})`);
                    assertEqualComplex(z.cosh(), Math.cosh(x)  , epsilon, `cosh(${x})`);
                    assertEqualComplex(z.tanh(), Math.tanh(x)  , epsilon, `tanh(${x})`);
                    assertEqualComplex(z.coth(), 1/Math.tanh(x), epsilon, `coth(${x})`);
    
                    // sqrt and n-root
                    if(x > 0){
                        assertEqualComplex(z.sqrt(), Math.sqrt(x), epsilon, `sqrt(${x})`);
                    }else if(x < 0){
                        assertEqualComplex(z.sqrt(), complex(0, Math.sqrt(-x)), epsilon, `sqrt(${x})`);
                    }else{
                        assertEqualComplex(z.sqrt(), Complex.ZERO, 0, 'sqrt(0)');
                    }

                    for(let i = 1; i < 10; i++){
                        const nroots = z.nroots(i);
                        nroots.forEach(root => {
                            assertEqualComplex(root.pow(i), z, epsilon, 
                                               `${root} is not a ${i}-th root of ${z}`);
                        });
                    }
                }
    
                repeat(500, () => test(rand()));
                [0, 1, -1].forEach(x => test(x));
            });
    
            it('should return the proper value if this is imaginary', () => {
                function test(y: number){
                    const z = complex(0, y);
    
                    // exp and log
                    assertEqualComplex(z.exp(), Complex.ofPolar(1, y), epsilon, `exp(${y}i)`);
                    if(y > 0){
                        const exp = complex(Math.log(y), Math.PI/2);
                        assertEqualComplex(z.log(), exp, epsilon, `log(${y}i)`);
                    }
    
                    // trigonometric functions
                    assertEqualComplex(z.sin(), complex(0, Math.sinh(y))   , epsilon, `sin(${y}i)`);
                    assertEqualComplex(z.cos(), complex(Math.cosh(y), 0)   , epsilon, `cos(${y}i)`);
                    assertEqualComplex(z.tan(), complex(0, Math.tanh(y))   , epsi   , `tan(${y}i)`);
                    assertEqualComplex(z.cot(), complex(0, -1/Math.tanh(y)), epsi   , `cot(${y}i)`);
                    
                    // hyperbolic functions
                    assertEqualComplex(z.sinh(), complex(0, Math.sin(y))   , epsilon, `sinh(${y}i)`);
                    assertEqualComplex(z.cosh(), complex(Math.cos(y), 0)   , epsilon, `cosh(${y}i)`);
                    assertEqualComplex(z.tanh(), complex(0, Math.tan(y))   , epsi   , `tanh(${y}i)`);
                    assertEqualComplex(z.coth(), complex(0, -1/Math.tan(y)), epsi   , `coth(${y}i)`);
    
                    // sqrt and n-root
                    if(y > 0){
                        const yy = Math.sqrt(y) * Math.SQRT1_2;
                        assertEqualComplex(z.sqrt(), complex(yy, yy), epsilon, `sqrt(${y}i)`);
                    }else if(y < 0){
                        const yy = Math.sqrt(-y) * Math.SQRT1_2;
                        assertEqualComplex(z.sqrt(), complex(yy, -yy), epsilon, `sqrt(${y}i)`);
                    }

                    for(let i = 1; i < 10; i++){
                        const nroots = z.nroots(i);
                        nroots.forEach(root => {
                            assertEqualComplex(root.pow(i), z, epsilon,
                                               `${root} is not a ${i}-th root of ${z}`);
                        });
                    }
                }
    
                repeat(500, () => test(rand()));
                [1, -1].forEach(y => test(y));
            });
    
            it('should return the proper value if this is Infinity(C)', () => {
                // assert(Math.exp(Infinity) === Infinity);
                // assert(Math.exp(-Infinity) === 0);
                assert(Complex.INFINITY.exp().isInfinite);
                
                // assert(Math.log(Infinity) === Infinity);
                // assert.isNaN(Math.log(-Infinity));
                assert(Complex.INFINITY.log().isInfinite);
                
                // assert.isNaN(Math.sin(Infinity));
                // assert.isNaN(Math.sin(-Infinity));
                assert(Complex.INFINITY.sin().isInfinite);
                
                // assert.isNaN(Math.cos(Infinity));
                // assert.isNaN(Math.cos(-Infinity));
                assert(Complex.INFINITY.cos().isInfinite);
                
                // assert.isNaN(Math.tan(Infinity));
                // assert.isNaN(Math.tan(-Infinity));
                assert(Complex.INFINITY.tan().isInfinite);
                
                assert(Complex.INFINITY.cot().isZero);
                
                assert.isFalse(isFinite(Math.sinh(Infinity)));
                assert.isFalse(isFinite(Math.sinh(-Infinity)));
                assert(Complex.INFINITY.sinh().isInfinite);
                
                assert.isFalse(isFinite(Math.cosh(Infinity)));
                assert.isFalse(isFinite(Math.cosh(-Infinity)));
                assert(Complex.INFINITY.cosh().isInfinite);
                
                assert.equal(Math.tanh(Infinity), 1);
                assert.equal(Math.tanh(-Infinity), -1);
                assert(Complex.INFINITY.tanh().isInfinite);
                
                assert(Complex.INFINITY.coth().isZero);
    
                assert(Complex.INFINITY.sqrt().isInfinite);
                for(let i = 1; i <= 10; i++){
                    const roots = Complex.INFINITY.nroots(i);
                    assert.equal(roots.length, 1);
                    assert(roots[0].isInfinite);
                }
            });
    
            it('should return NaN(C) if this is NaN(C)', () => {
                const table: Complex[] = [
                    Complex.NaN.exp(), Complex.NaN.log(),
    
                    Complex.NaN.sin(), Complex.NaN.cos(),
                    Complex.NaN.tan(), Complex.NaN.cot(),
                    
                    Complex.NaN.sinh(), Complex.NaN.cosh(),
                    Complex.NaN.tanh(), Complex.NaN.coth(),
    
                    Complex.NaN.sqrt()
                ]
    
                table.forEach(c => assert(c.isNaN));
    
                for(let i = 1; i <= 10; i++){
                    const roots = Complex.NaN.nroots(i);
                    assert(roots.length == 0);
                }
            });
        });

        describe('Identities', () => {

            function rand(){ return Math.random() * 10 - 5; }

            it('exp and log', () => {
                repeat(100, () => {
                    const z = complex(rand(), rand());

                    // log(exp(z)) === z + 2mπi
                    const z1 = z.exp().log();
                    assert.approximately(z1.re, z.re, epsilon, `log(exp(z)) at z = ${z}`);
                    const m1 = (z1.im - z.im)/(2*Math.PI)
                    assert.approximately(m1, Math.round(m1), epsilon, `log(exp(z)) at z = ${z}`);
                    
                    // exp(log(z)) === z + 2mπi
                    const z2 = z.exp().log();
                    assert.approximately(z2.re, z.re, epsilon, `exp(log(z)) at z = ${z}`);
                    const m2 = (z2.im - z.im)/(2*Math.PI)
                    assert.approximately(m2, Math.round(m2), epsilon, `exp(log(z)) at z = ${z}`);
                });
            });

            it('trigonometric functions', () => {
                repeat(100, () => {
                    const z = complex(rand(), rand());
                    const sin_z = z.sin(), cos_z = z.cos(), 
                    tan_z = z.tan(), cot_z = z.cot();

                    assertEqualComplex(cot_z, tan_z.reciprocal(), epsilon, `cot z = 1/tan z at z = ${z}`);

                    assertEqualComplex(sin_z.pow(2).plus(cos_z.pow(2)), Complex.ONE, epsi,
                                      `sin²z + cos²z = 1 at z = ${z}`);

                    assertEqualComplex(tan_z.pow(2).plus(Complex.ONE), cos_z.pow(2).reciprocal(), epsi,
                                      `tan²z + 1 = 1/cos²z at z = ${z}`);

                    assertEqualComplex(Complex.ONE.plus(cot_z.pow(2)), sin_z.pow(2).reciprocal(), epsi,
                                      `1 + cot²z = 1/sin²z at z = ${z}`);
                });
            });

            it('hyperbolic functions', () => {
                repeat(100, () => {
                    const z = complex(rand(), rand());
                    const sinh_z = z.sinh(), cosh_z = z.cosh(), 
                    tanh_z = z.tanh(), coth_z = z.coth();

                    assertEqualComplex(coth_z, tanh_z.reciprocal(), epsilon, `coth z = 1/tanh z at z = ${z}`);

                    assertEqualComplex(Complex.ONE.plus(sinh_z.pow(2)), cosh_z.pow(2), epsi,
                                      `1 + sinh²z = cosh²z at z = ${z}`);

                    assertEqualComplex(cosh_z.pow(2).reciprocal().plus(tanh_z.pow(2)), Complex.ONE, epsi,
                                      `1/cosh²z + tanh²z = 1 at z = ${z}`);

                    assertEqualComplex(sinh_z.pow(2).reciprocal().plus(Complex.ONE), coth_z.pow(2), epsi,
                                      `1/sinh²z + 1 = coth²z at z = ${z}`);
                });
            });
        });
    });
});

describe('CMath', () => {

    it('Constants defined at Math are also done at CMath as Complex', () => {
        for(let prop in Object.getOwnPropertyDescriptors(Math)){
            const pd = Object.getOwnPropertyDescriptor(Math, prop);
            if(pd){
                const val = pd.value;
                if(typeof val === 'number'){
                    const cpd = Object.getOwnPropertyDescriptor(CMath, prop);
                    if(cpd !== undefined && cpd.get !== undefined){
                        assertEqualComplex(cpd.get(), val, 0, `${prop} at CMath`);
                    }else{
                        assert.fail(`${prop} is not defined at CMath`);
                    }
                }
            }
        }
    });

    it('static functions that have the same name as a method of Complex should return the same result', () => {
        function test(z: Complex){
            assertEqualComplex(CMath.exp(z), z.exp(), epsilon, `exp(${z})`);
            if(!z.isZero){
                assertEqualComplex(CMath.log(z), z.log(), epsilon, `log(${z})`);
            }else{
                assert(CMath.log(z).isNaN, `log(${z})`);
            }

            assertEqualComplex(CMath.sin(z), z.sin(), epsilon, `sin(${z})`);
            assertEqualComplex(CMath.cos(z), z.cos(), epsilon, `cos(${z})`);
            assertEqualComplex(CMath.tan(z), z.tan(), epsilon, `tan(${z})`);
            assertEqualComplex(CMath.cot(z), z.cot(), epsilon, `cot(${z})`);

            assertEqualComplex(CMath.sinh(z), z.sinh(), epsilon, `sinh(${z})`);
            assertEqualComplex(CMath.cosh(z), z.cosh(), epsilon, `cosh(${z})`);
            assertEqualComplex(CMath.tanh(z), z.tanh(), epsilon, `tanh(${z})`);
            assertEqualComplex(CMath.coth(z), z.coth(), epsilon, `coth(${z})`);

            assertEqualComplex(CMath.sqrt(z), z.sqrt(), epsilon, `sqrt(${z})`);
        }

        repeat(100, () => test(randComplex()));
    });

    it('additional methods should return the proper value', () => {
        function test(z: Complex){
            // additional trigonometric functions
            assertEqualComplex(CMath.sec(z), z.cos().reciprocal(), epsilon, `sec(${z})`);
            assertEqualComplex(CMath.csc(z), z.sin().reciprocal(), epsilon, `csc(${z})`);

            // additional hyperbolic functions
            assertEqualComplex(CMath.sech(z), z.cosh().reciprocal(), epsilon, `sech(${z})`);
            assertEqualComplex(CMath.csch(z), z.sinh().reciprocal(), epsilon, `csch(${z})`);
        }

        repeat(100, () => test(randComplex()));
    });

});