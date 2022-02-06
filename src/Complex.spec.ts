import { assert } from 'chai';
import { complex, CMath, Complex, ModArg } from './Complex';

const epsilon = 1e-14;
const epsi = 1e-11;

function assertEqualComplex(
        actual: Complex, expected: Complex | number, epsilon: number, message: string = ''){
    const zExp: Complex = typeof expected === 'number' ? complex(expected) : expected;
    if(zExp.isNaN){
        assert(actual.isNaN, message + `: ${actual} != ${expected}`);
    }else{
        const abs = actual.abs;
        const ep = abs > 1 ? abs * epsilon : epsilon;
        assert(actual.equals(zExp, ep), message + `: ${actual} != ${expected} (ε=${ep})`);
    }
}

function assertEquivComplex(
        actual: Complex, expected: Complex, m: ModArg, 
        epsilon: number, message: string = ''){

    if(expected.isNaN){
        assert(actual.isNaN, message + `: ${actual} !≡ ${expected} (${Complex.NaN})`);
    }else{
        assert(actual.isCongruentTo(expected, m, epsilon),
                message + `: ${actual} !≡ ${expected} mod ${ sModule(m) } `
                    + `(${actual.mod(expected)} !≡ 0, ε=${epsilon})`);
    }

    function sModule(m: ModArg): string {
        return `re: ${m.re}, im: ${m.im}`;
    }
}

function repeat(n: number, f: (no: number) => void): void {
    for(let no = 0; no < n; no++) f(no);
}

function rand(): number {
    return Math.random() < 0.5 ? Math.random()*10 - 5 : Math.round(Math.random()*10 - 5);
}

function randComplex(): Complex {
    return complex(rand(), rand());
}

function head(no: number): string {
    return isNaN(no) ? '' : `${no}) `;
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
            ];

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
            ];

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
            ];

            table.forEach((entry, i) => {
                assert.equal(entry[0].toString(), entry[1], `${i}) toString()`);
            });
        });
    });

    describe('#equals()', () => {

        it('should return the proper value', () => {
            const c1 = complex(2, 3), c2 = complex(2, 3);
            assert.isFalse(c1 === c2);
            assert(c1.equals(c2));

            // Infinity
            assert(Infinity === Infinity); // The language spec
            assert(complex(Infinity, 1).equals(Complex.INFINITY));

            // NaN
            assert.isFalse(NaN === NaN); // The language spec
            assert.isFalse(complex(NaN, 1).equals(Complex.NaN));
        })
    });

    describe('#isCongruentTo()', () => {

        it('should return the proper value', () => {
            assert(complex(2, 3).isCongruentTo(complex(2, 3), {re: 5, im: 7}));
            assert(complex(7, 3).isCongruentTo(complex(2, 3), {re: 5}, epsilon));
            assert(complex(7-1e-14, 3).isCongruentTo(complex(2, 3), {re: 5}, 1e-10));
            assert(complex(2, 24-1e-14).isCongruentTo(complex(2, 3), {im: 7}, 1e-10));
            assert(complex(7-1e-14, 24-1e-14).isCongruentTo(complex(2, 3), {re: 5, im: 7}, 1e-10));

            // Infinity
            assert.isFalse(complex(Infinity, 1).isCongruentTo(Complex.INFINITY, {re: 3}, epsilon));

            // NaN
            assert.isFalse(complex(NaN, 1).isCongruentTo(Complex.NaN, {re: 3}, epsilon));
        })
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

                it('#abs2 should return the proper value', () => {
                    complexes.filter(c => c.isFinite).forEach(c => {
                        assert.approximately(c.abs2, c.abs * c.abs, epsi, `square abs of ${c}`);
                    });
        
                    assert.isFalse(isFinite(Complex.INFINITY.abs2));
                    assert.isNaN(Complex.NaN.abs2);
                });
        
                it('#arg should return the proper value', () => {
                    complexes.filter(c => c.isFinite).forEach(c => {
                        assert.approximately(c.arg, Math.atan2(c.im, c.re), epsilon, `arg of ${c}`);
                    });

                    // assert.equal(Math.atan2(-0, -2), -Math.PI); // the language spec
                    assert.equal(complex(-2, -0).arg, Math.PI, 'arg of -2-0i is π, not -π');
        
                    [Complex.INFINITY, Complex.NaN].forEach(c => {
                        assert.isNaN(c.arg);
                    });
                });
            });
        });
    });

    describe('Unary operations', () => {
        
        it('#negate should return the proper value', () => {
            complexes.filter(c => c.isFinite).forEach(c => {
                assertEqualComplex(c.negate, complex(-c.re, -c.im), epsilon, `negate of ${c}`);
                assertEqualComplex(c.negate.plus(c), Complex.ZERO, epsilon, `negate of ${c}`);
            });

            assert(Complex.INFINITY.negate.isInfinite);
            assert(Complex.NaN.negate.isNaN);
        });

        it('#conjugate should return the proper value', () => {
            complexes.filter(c => c.isFinite).forEach(c => {
                assertEqualComplex(c.conjugate, complex(c.re, -c.im), epsilon, `negate of ${c}`);
                assertEqualComplex(c.conjugate.plus(c), 2*c.re, epsilon);
                assertEqualComplex(c.conjugate.times(c), c.re*c.re + c.im*c.im, epsilon);
            });

            assert(Complex.INFINITY.conjugate.isInfinite);
            assert(Complex.NaN.conjugate.isNaN);
        });

        it('#reciprocal should return the proper value', () => {
            complexes.filter(c => c.isFinite && !c.isZero).forEach(c => {
                assertEqualComplex(c.reciprocal.times(c), Complex.ONE, epsilon, `reciprocal of ${c}`);
            });

            assert(Complex.ZERO.reciprocal.isInfinite);
            assert(Complex.INFINITY.reciprocal.isZero);
            assert(Complex.NaN.reciprocal.isNaN);
        });
    });

    describe('Binary operations', () => {

        describe('#plus()', () => {

            it('should return a sum of two complex numbers', () => {
                function test(z1: Complex, z2: Complex, no: number){
                    const zExp = ref(z1).plus(ref(z2));
                    assertEqualComplex(z1.plus(z2), zExp, epsilon, head(no) + `${z1} + ${z2} != ${zExp}`);
                }

                repeat(500, (no) => test(randComplex(), randComplex(), no));
                repeat(10, (no) => test(Complex.ZERO, randComplex(), no));
                repeat(10, (no) => test(Complex.ONE, randComplex(), no));
            });

            it('should return the same result if the argument is number or Complex', () => {
                function test(z: Complex, a: number, no: number){
                    const zExp = ref(z).plus(a);
                    assertEqualComplex(z.plus(a), zExp, epsilon, head(no) + `${z} + ${a} != ${zExp}`);
                }

                repeat(500, (no) => test(randComplex(), rand(), no));
                repeat(10, (no) => test(Complex.ZERO, rand(), no));
                repeat(10, (no) => test(Complex.ONE, rand(), no));
            });

            it('should return the proper value if the argument is the specific value', () => {
                function test(z: Complex, no = NaN){
                    assert(z.plus(0).equals(z), head(no) + `${z} + 0 != ${z}`);
                    assert(z.plus(Complex.ZERO).equals(z), head(no) + `${z} + 0 != ${z}`);

                    assert(z.plus(Infinity).isInfinite, head(no) + `${z} + ∞ is not infinite`);
                    assert(z.plus(-Infinity).isInfinite, head(no) + `${z} + (-∞) is not infinite`);
                    assert(z.plus(Complex.INFINITY).isInfinite,
                           head(no) + `${z} + ${Complex.INFINITY} is not infinite`);

                    assert(z.plus(NaN).isNaN, head(no) + `${z} + NaN is not NaN`);
                    assert(z.plus(Complex.NaN).isNaN, head(no) + `${z} + NaN(C) is not NaN`);
                }

                repeat(10, (no) => test(randComplex(), no));
                test(Complex.ZERO);
                test(Complex.ONE);
            });

            it('should return the proper value if the argument is the infinity or NaN', () => {
                repeat(10, (no) => {
                    const x = rand();
                    assert(Complex.INFINITY.plus(x).isInfinite,
                           head(no) + `${Complex.INFINITY} + ${x} is not infinite}`);

                    const z = randComplex();
                    assert(Complex.INFINITY.plus(z).isInfinite,
                           head(no) + `${Complex.INFINITY} + ${z} is not infinite}`);
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
                function test(z1: Complex, z2: Complex, no: number){
                    const zExp = ref(z1).minus(ref(z2));
                    assertEqualComplex(z1.minus(z2), zExp, epsilon, head(no) + `${z1} + ${z2} != ${zExp}`);
                }

                repeat(500, (no) => test(randComplex(), randComplex(), no));
                repeat(10, (no) => test(Complex.ZERO, randComplex(), no));
                repeat(10, (no) => test(Complex.ONE, randComplex(), no));
            });

            it('should return the same result if the argument is number or Complex', () => {
                function test(z: Complex, a: number, no: number){
                    const zExp = ref(z).minus(a);
                    assertEqualComplex(z.minus(a), zExp, epsilon, head(no) + `${z} - ${a} != ${zExp}`);
                }

                repeat(500, (no) => test(randComplex(), rand(), no));
                repeat(10, (no) => test(Complex.ZERO, rand(), no));
                repeat(10, (no) => test(Complex.ONE, rand(), no));
            });

            it('should return the proper value if the argument is the specific value', () => {
                function test(z: Complex, no = NaN){
                    assert(z.minus(0).equals(z), head(no) + `${z} - 0 != ${z}`);
                    assert(z.minus(Complex.ZERO).equals(z), head(no) + `${z} - 0 != ${z}`);

                    assert(z.minus(Infinity).isInfinite, head(no) + `${z} - ∞  is not infinite`);
                    assert(z.minus(-Infinity).isInfinite, head(no) + `${z} - (-∞)  is not infinite`);
                    assert(z.minus(Complex.INFINITY).isInfinite,
                           head(no) + `${z} - ${Complex.INFINITY}  is not infinite`);

                    assert(z.minus(NaN).isNaN), head(no) + `${z} - NaN is not NaN`;
                    assert(z.minus(Complex.NaN).isNaN, head(no) + `${z} - NaN is not NaN`);
                }

                repeat(10, (no) => test(randComplex(), no));
                test(Complex.ZERO);
                test(Complex.ONE);
            });

            it('should return the proper value if the argument is the infinity or NaN', () => {
                repeat(10, (no) => {
                    const x = rand();
                    assert(Complex.INFINITY.minus(x).isInfinite,
                           head(no) + `${Complex.INFINITY} - ${x} is not infinite}`);

                    const z = randComplex();
                    assert(Complex.INFINITY.minus(z).isInfinite,
                           head(no) + `${Complex.INFINITY} - ${z} is not infinite}`);
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
                function test(z1: Complex, z2: Complex, no: number){
                    const zExp = ref(z1).times(ref(z2));
                    assertEqualComplex(z1.times(z2), zExp, epsilon, head(no) + `${z1} * ${z2} != ${zExp}`);
                }

                repeat(500, (no) => test(randComplex(), randComplex(), no));
                repeat(10, (no) => test(Complex.ZERO, randComplex(), no));
                repeat(10, (no) => test(Complex.ONE, randComplex(), no));
            });

            it('should return the same result if the argument is number or Complex', () => {
                function test(z: Complex, a: number, no: number){
                    const zExp = ref(z).times(a);
                    assertEqualComplex(z.times(a), zExp, epsilon, head(no) + `${z} * ${a} != ${zExp}`);
                }

                repeat(500, (no) => test(randComplex(), rand(), no));
                repeat(10, (no) => test(Complex.ZERO, rand(), no));
                repeat(10, (no) => test(Complex.ONE, rand(), no));
            });

            it('should return the proper value if the argument is the specific value', () => {
                function test(z: Complex, no = NaN){
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
                repeat(10, (no) => {
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

            it('should return a quotient of two complex numbers', () => {
                function test(z1: Complex, z2: Complex, no: number){
                    if(z2.isZero){
                        if(z1.isZero){
                            assert(z1.div(z2).isNaN, head(no) + `${z1} / 0 != ${Complex.NaN}: ${z1.div(z2)}`);
                        }else{
                            assert(z1.div(z2).isInfinite, head(no) + `${z1} / 0 != ${Complex.INFINITY}: ${z1.div(z2)}`);
                        }
                    }else{
                        const zExp = ref(z1).div(ref(z2));
                        assertEqualComplex(z1.div(z2), zExp,
                                           epsi, head(no) + `${z1} / ${z2} != ${z1.div(z2)}`);
                        assertEqualComplex(z1.div(z2).times(z2), z1,
                                           epsilon, head(no) + `${z1} / ${z2} * ${z2} != ${z1}`);
                    }
                }

                repeat(500, (no) => test(randComplex(), randComplex(), no));
                repeat(10, (no) => test(Complex.ZERO, randComplex(), no));
                repeat(10, (no) => test(Complex.ONE, randComplex(), no));
            });

            it('should return the same result if the argument is number or Complex', () => {
                function test(z: Complex, a: number, no: number){
                    if(a === 0){
                        if(z.isZero)
                            assert(z.div(a).isNaN, head(no) + `${z} / ${a} != ${Complex.NaN}`);
                        else
                            assert(z.div(a).isInfinite, head(no) + `${z} / ${a} != ${Complex.INFINITY}`);
                    }else{
                        const zExp = ref(z).div(a);
                        assertEqualComplex(z.div(a), zExp, epsilon, head(no) + `${z} / ${a} != ${zExp}`);
                    }
                }

                repeat(500, (no) => test(randComplex(), rand(), no));
                repeat(10, (no) => test(Complex.ZERO, rand(), no));
                repeat(10, (no) => test(Complex.ONE, rand(), no));
            });

            it('should return the proper value if the argument is the specific value', () => {
                function test(z: Complex, no = NaN){
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
                           head(no) + `${z} / ${Complex.INFINITY} != 0: ${z.div(Complex.INFINITY)}`);

                    assert(z.div(NaN).isNaN);
                    assert(z.div(Complex.NaN).isNaN);
                }

                repeat(10, (no) => test(randComplex(), no));
                test(Complex.ZERO);
                test(Complex.ONE);
            });

            it('should return the proper value if the argument is the infinity or NaN', () => {
                repeat(10, (no) => {
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
                function test(z1: Complex, z2: Complex, no: number){
                    const z = z1.pow(z2);
                    if(z1.isZero){
                        if(z2.re > 0){
                            assert(z.isZero, head(no) + `(${z1})^(${z2}) != 0`);
                        }else if(z2.re < 0){
                            assert(z.isInfinite, head(no) + `(${z1})^(${z2}) != ${Complex.INFINITY}`);
                        }else{
                            assert(z.isNaN, head(no) + `(${z1})^(${z2}) != ${Complex.NaN}`);
                        }

                    }else if(z1.isOne){
                        assert(z.isOne, head(no) + `(${z1})^(${z2}) != 1}`)
                    }else{
                        const zExp = ref(z1).pow(z2);
                        assertEqualComplex(z, zExp, epsilon, head(no) + `(${z1})^(${z2}) != ${zExp}`);
                    }
                }

                repeat(500, (no) => test(randComplex(), randComplex().div(2), no));
                repeat(10, (no) => test(Complex.ZERO, randComplex().div(2), no));
                repeat(10, (no) => test(Complex.ONE, randComplex().div(2), no));
            });

            it('should return the same result if the argument is number or Complex', () => {
                function test(z: Complex, a: number, no: number){
                    const actual = z.pow(a);
                    if(z.isZero){
                        if(a === 0){
                            assert(actual.isNaN, head(no) + `(${z})^${a} != ${Complex.NaN}`);
                        }else if(a > 0){
                            assert(actual.isZero, head(no) + `(${z})^${a} != ${Complex.ZERO}`);
                        }else{
                            assert(actual.isInfinite, head(no) + `(${z})^${a} != ${Complex.INFINITY}`);
                        }
                    }else{
                        const zExp = ref(z).pow(a);
                        assertEqualComplex(z.pow(a), zExp, epsilon, head(no) + `(${z})^(${a}) != ${zExp}`);
                    }
                }

                repeat(500, (no) => test(randComplex(), rand()/2, no));
                repeat(10, (no) => test(Complex.ZERO, rand()/2, no));
                repeat(10, (no) => test(Complex.ONE, rand()/2, no));
            });

            it('should return the proper value if the argument is the specific value', () => {
                function test(z: Complex, no = NaN){
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

                repeat(100, (no) => test(randComplex(), no));
                [Complex.ZERO, Complex.ONE, Complex.MINUS_ONE, 
                    Complex.I, Complex.MINUS_I].forEach(z => test(z));
            });

            it('should return the proper value if the argument is the infinity or NaN', () => {
                repeat(20, (no) => {
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

    describe('#mod()', () => {

        it('should return the proper Complex value', () => {
            const z1 = complex( 2.6,  3.2);
            const z2 = complex(-2.6,  3.2);
            const z3 = complex(-2.6, -3.2);
            const z4 = complex( 2.6, -3.2);

            const table: [Complex, Complex][] = [
                [z1.mod({re: 1.4}), complex(1.2,  3.2)],
                [z2.mod({re: 1.4}), complex(0.2,  3.2)],
                [z3.mod({re: 1.4}), complex(0.2, -3.2)],
                [z4.mod({re: 1.4}), complex(1.2, -3.2)],

                [z1.mod({re: -1.4}), complex(-0.2,  3.2)],
                [z2.mod({re: -1.4}), complex(-1.2,  3.2)],
                [z3.mod({re: -1.4}), complex(-1.2, -3.2)],
                [z4.mod({re: -1.4}), complex(-0.2, -3.2)],

                [z1.mod({im: 1.7}), complex( 2.6, 1.5)],
                [z2.mod({im: 1.7}), complex(-2.6, 1.5)],
                [z3.mod({im: 1.7}), complex(-2.6, 0.2)],
                [z4.mod({im: 1.7}), complex( 2.6, 0.2)],

                [z1.mod({im: -1.7}), complex( 2.6, -0.2)],
                [z2.mod({im: -1.7}), complex(-2.6, -0.2)],
                [z3.mod({im: -1.7}), complex(-2.6, -1.5)],
                [z4.mod({im: -1.7}), complex( 2.6, -1.5)],
                
                [z1.mod({re: 1.4, im: 1.7}), complex(1.2, 1.5)],
                [z2.mod({re: 1.4, im: 1.7}), complex(0.2, 1.5)],
                [z3.mod({re: 1.4, im: 1.7}), complex(0.2, 0.2)],
                [z4.mod({re: 1.4, im: 1.7}), complex(1.2, 0.2)],

                [z1.mod({re: [-1, 1]}),              complex(0.6,  3.2)],
                [z1.mod({im: [-1, 1]}),              complex(2.6, -0.8)],
                [z1.mod({re: [-1, 1], im: [-1, 1]}), complex(0.6, -0.8)],

                [z1.mod({re: 0}), Complex.NaN],
                [z1.mod({re: Infinity}), Complex.NaN],
                [z1.mod({im: Infinity}), Complex.NaN],
                [z1.mod({re: NaN}), Complex.NaN],
                [z1.mod({im: NaN}), Complex.NaN]
            ];

            table.forEach((entry, i) => {
                assertEqualComplex(entry[0], entry[1], epsilon, `${i}) mod`);
            });
        });
    });

    describe('elementary functions', () => {

        const PI = Math.PI;
        const SQRT2 = Math.SQRT2

        function randNon0(): number {
            const result = rand();
            return result !== 0 ? result : randNon0();
        }

        describe('the function values at the specified argument', () => {

            function test(fName: string, table: [Complex, Complex][], f: (z: Complex) => Complex){
                table.forEach((entry, i) => {
                    const result = f(entry[0]);
                    assertEqualComplex(result, entry[1], epsilon, `${i}) ${fName}(${entry[0]})`);
                });
            }

            describe('roots', () => {

                it('sqrt', () => {
                    const table: [Complex, Complex][] = [
                        [Complex.ZERO, Complex.ZERO],

                        [Complex.ONE      , Complex.ONE],
                        [complex(2)       , complex(SQRT2)],
                        [Complex.MINUS_ONE, Complex.I],
                        [complex(-2)      , complex(0, SQRT2)],
                        
                        [Complex.I        , complex(1, 1).div(SQRT2)],
                        [complex(0, 2)    , complex(1, 1)],
                        [Complex.MINUS_I  , complex(1, -1).div(SQRT2)],
                        [complex(0, -2)   , complex(1, -1)],

                        [complex( SQRT2,  SQRT2), Complex.ofPolar(SQRT2, Math.PI/8)],
                        [complex(-SQRT2,  SQRT2), Complex.ofPolar(SQRT2, 3*Math.PI/8)],
                        [complex(-SQRT2, -SQRT2), Complex.ofPolar(SQRT2, -3*Math.PI/8)],
                        [complex( SQRT2, -SQRT2), Complex.ofPolar(SQRT2, -Math.PI/8)]
                    ];

                    test('sqrt', table, z => z.sqrt);
                });
            });

            describe('inverse trigonometric functions', () => {

                const norm = Math.sqrt(SQRT2);

                function p(r: number, arg: number): Complex {
                    return Complex.ofPolar(r, arg);
                }

                it('asin', () => {
                    const table: [Complex, Complex][] = [
                        [Complex.ZERO, Complex.ZERO],

                        [Complex.ONE      , complex(PI/2)],
                        [complex(2)       , complex(0, Math.sqrt(3)+2).log.times(Complex.MINUS_I)],
                        [Complex.MINUS_ONE, complex(-PI/2)],
                        [complex(-2)      , complex(0, Math.sqrt(3)-2).log.times(Complex.MINUS_I)],

                        [Complex.I        , complex(0, -Math.log(SQRT2-1))],
                        [complex(0, 2)    , complex(Math.sqrt(5)-2).log.times(Complex.MINUS_I)],
                        [Complex.MINUS_I  , complex(0, -Math.log(Math.sqrt(2)+1))],
                        [complex(0, -2)   , complex(Math.sqrt(5)+2).log.times(Complex.MINUS_I)],

                        [p(1, PI/4), 
                            p(norm, -PI/8).plus(p(1,  PI*3/4)).log.times(Complex.MINUS_I)],
                        [p(1, PI*3/4), 
                            p(norm,  PI/8).plus(p(1,  PI*5/4)).log.times(Complex.MINUS_I)],
                        [p(1, -PI*3/4), 
                            p(norm, -PI/8).plus(p(1, -PI/4)).log.times(Complex.MINUS_I)],
                        [p(1, -PI/4), 
                            p(norm,  PI/8).plus(p(1,  PI/4)).log.times(Complex.MINUS_I)],
                    ];

                    test('asin', table, z => z.asin);
                });
            });

        });

        describe('(general complex values)', () => {

            it('should return the proper complex value', () => {
                function test(x: number, y: number, no: number){
                    const z = complex(x, y);
                    const zz = ref(z);

                    // sqrt and n-root
                    assertEqualComplex(z.sqrt, zz.sqrt, epsilon, head(no) + `sqrt(${z})`);

                    for(let i = 1; i < 10; i++){
                        const nroots = z.nroots(i);
                        const zz_nroots = zz.nroots(i);
                        assert.equal(nroots.length, zz_nroots.length);
                        nroots.forEach(root => {
                            const result = zz_nroots.some(zz_root => root.equals(zz_root, epsilon));
                            assert(result, head(no) + `(${root})^1/${i}`);
                        });
                    }

                    // exp and log
                    assertEqualComplex(z.exp, zz.exp, epsilon, head(no) + `exp(${z})`);
                    if(z.isZero){
                        assert(z.log.isNaN);
                    }else{
                        const z_log = z.log;
                        assertEqualComplex(z_log, ref(z).log, epsilon, head(no) + `log(${z})`);
                        assertRange(z_log.arg, [-PI, PI], '-π <= arg(log(z)) <= π');
                    }

                    // trigonometric functions
                    assertEqualComplex(z.sin, zz.sin, epsilon, head(no) + `sin(${z})`);
                    assertEqualComplex(z.cos, zz.cos, epsilon, head(no) + `cos(${z})`);
                    assertEqualComplex(z.tan, zz.tan, epsi, head(no) + `tan(${z})`);
                    assertEqualComplex(z.cot, zz.cot, epsi, head(no) + `cot(${z})`);

                    // inverse trigonometric functions
                    const z_asin = z.asin;
                    assertEqualComplex(z_asin, zz.asin, epsilon, head(no) + `asin(${z})`);
                    assertRange(z_asin.re, [-PI/2, PI/2], '-π/2 <= Re(asin(z)) <= π/2');
                    const z_acos = z.acos;
                    assertEqualComplex(z_acos, zz.acos, epsilon, head(no) + `acos(${z})`);
                    assertRange(z_acos.re, [0, PI], '0 <= Re(acos(z)) <= π');
                    const z_atan = z.atan;
                    assertEqualComplex(z_atan, zz.atan, epsilon, head(no) + `atan(${z})`);
                    if(z_atan.isFinite){
                        assertRange(z_atan.re, [-PI/2, PI/2], '-π/2 <= Re(atan(z)) <= π/2');
                    }

                    // hyperbolic functions
                    assertEqualComplex(z.sinh, zz.sinh, epsilon, head(no) + `sinh(${z})`);
                    assertEqualComplex(z.cosh, zz.cosh, epsilon, head(no) + `cosh(${z})`);
                    assertEqualComplex(z.tanh, zz.tanh, epsi, head(no) + `tanh(${z})`);
                    assertEqualComplex(z.coth, zz.coth, epsi, head(no) + `coth(${z})`);

                    // inverse hyperbolic functions
                    const z_asinh = z.asinh;
                    assertEqualComplex(z_asinh, zz.asinh, epsilon, head(no) + `asinh(${z})`);
                    assertRange(z_asinh.im, [-PI/2, PI/2], '-π/2 <= Im(asinh(z)) <= π/2');
                    const z_acosh = z.acosh;
                    assertEqualComplex(z_acosh, zz.acosh, epsilon, head(no) + `acosh(${z})`);
                    assertRange(z_acosh.im, [-PI, PI], '-π <= Im(acosh(z)) <= π');
                    assertRange(z_acosh.re, [0, Infinity], '0 <= Re(acosh(z)) <= ∞');
                    const z_atanh = z.atanh;
                    assertEqualComplex(z_atanh, zz.atanh, epsilon, head(no) + `atanh(${z})`);
                    if(z_atanh.isFinite){
                        assertRange(z_atanh.im, [-PI/2, PI/2], '-π/2 <= Im(atanh(z)) <= π/2');
                    }

                    function assertRange(x: number, range: [number, number], message: string){
                        assert(range[0] <= x && x <= range[1], 
                               head(no) + `${message}, z = ${z}, f(z) = ${x}`);
                    }
                }

                repeat(100, i => test(randNon0(), randNon0(), i));
                repeat(300, i => test(randNon0(), 0, i));
                repeat(300, i => test(0, randNon0(), i));
            });
        });

        describe('(restricted complex values)', () => {

            it('should return the same value if this is real', () => {
                function test(x: number, no = NaN){
                    const z = complex(x, 0);
                    const zz = ref(x, 0);
    
                    // sqrt and n-root
                    if(x > 0){
                        assertEqualComplex(z.sqrt, Math.sqrt(x),
                            epsilon, head(no) + `sqrt(${x})`);
                    }else if(x < 0){
                        assertEqualComplex(z.sqrt, complex(0, Math.sqrt(-x)),
                            epsilon, head(no) + `sqrt(${x})`);
                    }else{
                        assertEqualComplex(z.sqrt, Complex.ZERO,
                            0, head(no) + 'sqrt(0)');
                    }

                    for(let i = 1; i < 10; i++){
                        const nroots = z.nroots(i);
                        nroots.forEach(root => {
                            assertEqualComplex(root.pow(i), z, epsilon, 
                                               head(no) + `${root} is not a ${i}-th root of ${z}`);
                        });
                    }
    
                    // exp and log
                    assertEqualComplex(z.exp, Math.exp(x), epsilon, head(no) + `exp(${x})`);
                    if(x > 0){
                        assertEqualComplex(z.log, Math.log(x), epsilon, head(no) + `log(${x})`);
                    }
    
                    // trigonometric functions
                    assertEqualComplex(z.sin, Math.sin(x)  , epsilon, head(no) + `sin(${x})`);
                    assertEqualComplex(z.cos, Math.cos(x)  , epsilon, head(no) + `cos(${x})`);
                    assertEqualComplex(z.tan, Math.tan(x)  , epsilon, head(no) + `tan(${x})`);
                    assertEqualComplex(z.cot, 1/Math.tan(x), epsilon, head(no) + `cot(${x})`);
    
                    // inverse trigonometric functions
                    const asin_z = z.asin;
                    assertEqualComplex(asin_z, zz.asin, epsilon, head(no) + `asin(${x})`);
                    assertEqualComplex(asin_z.sin, x, epsilon, head(no) + `sin(asin(${x}))`);

                    const acos_z = z.acos;
                    assertEqualComplex(acos_z, zz.acos, epsilon, head(no) + `acos(${x})`);
                    assertEqualComplex(acos_z.cos, x, epsilon, head(no) + `cos(acos(${x}))`);

                    const atan_z = z.atan;
                    assertEqualComplex(atan_z, Math.atan(x), epsilon, head(no) + `atan(${x})`);
                    assertEqualComplex(atan_z.tan, x, epsilon, head(no) + `tan(atan(${x}))`);
                    
                    // hyperbolic functions
                    assertEqualComplex(z.sinh, Math.sinh(x)  , epsilon, head(no) + `sinh(${x})`);
                    assertEqualComplex(z.cosh, Math.cosh(x)  , epsilon, head(no) + `cosh(${x})`);
                    assertEqualComplex(z.tanh, Math.tanh(x)  , epsilon, head(no) + `tanh(${x})`);
                    assertEqualComplex(z.coth, 1/Math.tanh(x), epsilon, head(no) + `coth(${x})`);
    
                    // inverse hyperbolic functions
                    const asinh_z = z.asinh;
                    assertEqualComplex(asinh_z, Math.asinh(x), epsilon, head(no) + `asinh(${x})`);
                    assertEqualComplex(asinh_z, zz.asinh, epsilon, head(no) + `asinh(${x})`);
                    assertEqualComplex(asinh_z.sinh, x, epsilon, head(no) + `sinh(asinh(${x}))`);

                    const acosh_z = z.acosh;
                    assertEqualComplex(acosh_z, zz.acosh, epsilon, head(no) + `acosh(${x})`);
                    assertEqualComplex(acosh_z.cosh, x, epsilon, head(no) + `cosh(acosh(${x}))`);

                    const atanh_z = z.atanh;
                    assertEqualComplex(atanh_z, zz.atanh, epsilon, head(no) + `atanh(${x})`);
                    if(Math.abs(x) === 1){
                        assert(atanh_z.tanh.isNaN, head(no) + `tanh(atanh(${x}))`);
                    }else{
                        assertEqualComplex(atanh_z.tanh, x, epsilon, head(no) + `tanh(atanh(${x}))`);
                    }
                }
    
                repeat(200, (no) => test(randNon0(), no));
                [0, 1, -1].forEach(x => test(x));
            });
    
            it('should return the proper value if this is imaginary', () => {
                function test(y: number, no = NaN){
                    const z = complex(0, y);
                    const zz = ref(0, y);

                    // sqrt and n-root
                    if(y > 0){
                        const yy = Math.sqrt(y) * Math.SQRT1_2;
                        assertEqualComplex(z.sqrt, complex(yy, yy), epsilon, head(no) + `sqrt(${z})`);
                    }else if(y < 0){
                        const yy = Math.sqrt(-y) * Math.SQRT1_2;
                        assertEqualComplex(z.sqrt, complex(yy, -yy), epsilon, head(no) + `sqrt(${z})`);
                    }

                    for(let i = 1; i < 10; i++){
                        const nroots = z.nroots(i);
                        nroots.forEach(root => {
                            assertEqualComplex(root.pow(i), z, epsilon,
                                               head(no) + `${root} is not a ${i}-th root of ${z}`);
                        });
                    }
    
                    // exp and log
                    assertEqualComplex(z.exp, Complex.ofPolar(1, y), epsilon, head(no) + `exp(${complex(0, y)})`);
                    if(y > 0){
                        const exp = complex(Math.log(y), PI/2);
                        assertEqualComplex(z.log, exp, epsilon, head(no) + `log(${complex(0, y)})`);
                    }
    
                    // trigonometric functions
                    assertEqualComplex(z.sin, complex(0, Math.sinh(y)),
                                       epsilon, head(no) + `sin(${complex(0, y)})`);
                    assertEqualComplex(z.cos, complex(Math.cosh(y), 0),
                                       epsilon, head(no) + `cos(${complex(0, y)})`);
                    assertEqualComplex(z.tan, complex(0, Math.tanh(y)),
                                       epsilon, head(no) + `tan(${complex(0, y)})`);
                    assertEqualComplex(z.cot, complex(0, -1/Math.tanh(y)),
                                       epsilon, head(no) + `cot(${complex(0, y)})`);
    
                    // inverse trigonometric functions
                    const asin_z = z.asin;
                    assertEqualComplex(asin_z, zz.asin, epsilon, head(no) + `asin(${z})`);
                    assertEqualComplex(asin_z.sin, z, epsilon, head(no) + `sin(asin(${z}))`);

                    const acos_z = z.acos;
                    assertEqualComplex(acos_z, zz.acos, epsilon, head(no) + `acos(${z})`);
                    assertEqualComplex(acos_z.cos, z, epsilon, head(no) + `cos(acos(${z}))`);

                    const atan_z = z.atan;
                    assertEqualComplex(atan_z, zz.atan, epsi, head(no) + `atan(${z})`);
                    if(Math.abs(y) === 1){
                        assert(atan_z.tan.isNaN, head(no) + `tan(atan(${z}))`);
                    }else{
                        assertEqualComplex(atan_z.tan, z, epsilon, head(no) + `tan(atan(${z}))`);
                    }
                    
                    // hyperbolic functions
                    assertEqualComplex(z.sinh, complex(0, Math.sin(y))   , epsilon, head(no) + `sinh(${z})`);
                    assertEqualComplex(z.cosh, complex(Math.cos(y), 0)   , epsilon, head(no) + `cosh(${z})`);
                    assertEqualComplex(z.tanh, complex(0, Math.tan(y))   , epsi   , head(no) + `tanh(${z})`);
                    assertEqualComplex(z.coth, complex(0, -1/Math.tan(y)), epsi   , head(no) + `coth(${z})`);
    
                    // inverse hyperbolic functions
                    const asinh_z = z.asinh;
                    assertEqualComplex(asinh_z, zz.asinh, epsilon, head(no) + `asinh(${z})`);
                    assertEqualComplex(asinh_z.sinh, complex(0, y), epsilon, head(no) + `sinh(asinh(${z}))`);

                    const acosh_z = z.acosh;
                    assertEqualComplex(acosh_z, zz.acosh, epsilon, head(no) + `acosh(${z})`);
                    assertEqualComplex(acosh_z.cosh, complex(0, y), epsilon, head(no) + `cosh(acosh(${z}))`);

                    const atanh_z = z.atanh;
                    assertEqualComplex(atanh_z, zz.atanh, epsilon, head(no) + `atanh(${z})`);
                    assertEqualComplex(atanh_z.tanh, complex(0, y), epsilon, head(no) + `tanh(atanh(${z}))`);

                }
    
                repeat(200, (no) => test(randNon0(), no));
                [1, -1].forEach(y => test(y));
            });
    
            it('should return the proper value if this is Infinity(C)', () => {
                //***** roots *****
                assert(Complex.INFINITY.sqrt.isInfinite);
                for(let i = 1; i <= 10; i++){
                    const roots = Complex.INFINITY.nroots(i);
                    assert.equal(roots.length, 1);
                    assert(roots[0].isInfinite);
                }
                
                //***** exp and log *****
                // assert(Math.exp(Infinity) === Infinity);
                // assert(Math.exp(-Infinity) === 0);
                assert(Complex.INFINITY.exp.isNaN);
                
                // assert(Math.log(Infinity) === Infinity);
                // assert.isNaN(Math.log(-Infinity));
                assert(Complex.INFINITY.log.isInfinite);
                
                //***** trigonometric functions *****
                // assert.isNaN(Math.sin(Infinity));
                // assert.isNaN(Math.sin(-Infinity));
                assert(Complex.INFINITY.sin.isNaN);
                
                // assert.isNaN(Math.cos(Infinity));
                // assert.isNaN(Math.cos(-Infinity));
                assert(Complex.INFINITY.cos.isNaN);
                
                // assert.isNaN(Math.tan(Infinity));
                // assert.isNaN(Math.tan(-Infinity));
                assert(Complex.INFINITY.tan.isNaN);
                
                assert(Complex.INFINITY.cot.isNaN);
                
                //***** inverse trigonometric functions *****
                // assert.isNaN(Math.asin(Infinity));
                // assert.isNaN(Math.asin(-Infinity));
                assert(Complex.INFINITY.sin.isNaN);
                
                // assert.isNaN(Math.acos(Infinity));
                // assert.isNaN(Math.acos(-Infinity));
                assert(Complex.INFINITY.acos.isNaN);
                
                // assert.approximately(Math.atan(Infinity), PI/2, epsilon);
                // assert.approximately(Math.atan(-Infinity), -PI/2, epsilon);
                assert(Complex.INFINITY.atan.isNaN);
                
                //***** hyperbolic functions *****
                // assert.isFalse(isFinite(Math.sinh(Infinity)));
                // assert.isFalse(isFinite(Math.sinh(-Infinity)));
                assert(Complex.INFINITY.sinh.isNaN);
                
                // assert.isFalse(isFinite(Math.cosh(Infinity)));
                // assert.isFalse(isFinite(Math.cosh(-Infinity)));
                assert(Complex.INFINITY.cosh.isNaN);
                
                // assert.equal(Math.tanh(Infinity), 1);
                // assert.equal(Math.tanh(-Infinity), -1);
                assert(Complex.INFINITY.tanh.isNaN);
                
                assert(Complex.INFINITY.coth.isNaN);
            });
    
            it('should return NaN(C) if this is NaN(C)', () => {
                const table: Complex[] = [
                    Complex.NaN.exp, Complex.NaN.log,
    
                    Complex.NaN.sin, Complex.NaN.cos,
                    Complex.NaN.tan, Complex.NaN.cot,
    
                    Complex.NaN.asin, Complex.NaN.acos,
                    Complex.NaN.atan,
                    
                    Complex.NaN.sinh, Complex.NaN.cosh,
                    Complex.NaN.tanh, Complex.NaN.coth,
    
                    Complex.NaN.asinh, Complex.NaN.acosh,
                    Complex.NaN.atanh,
    
                    Complex.NaN.sqrt
                ];
    
                table.forEach(c => assert(c.isNaN));
    
                for(let i = 1; i <= 10; i++){
                    const roots = Complex.NaN.nroots(i);
                    assert(roots.length == 0);
                }
            });
        });

        describe('Identities', () => {

            it('sqrt and nroots', () => {
                repeat(100, (no) => {
                    const z = complex(rand(), rand());

                    const sqrt_z = z.sqrt;
                    assertEqualComplex(sqrt_z.pow(2), z, epsilon, head(no) + `sqrt(${z})`);

                    for(let i = 1; i < 10; i++){
                        const nroots = z.nroots(i);
                        nroots.forEach(root => {
                            assertEqualComplex(root.pow(i), z, epsilon, head(no) + `(${root})^1/${i}`);
                        });
                    }
                });
            });

            it('exp and log', () => {
                repeat(100, (no) => {
                    const z = randComplex();

                    // log(exp(z)) === z + 2mπi
                    assertEquivComplex(z.exp.log, z, {im: 2*PI},
                                       epsi, head(no) + `log(exp(z)) = z + 2mπi at z = ${z}`);

                    // exp(log(z)) === z
                    if(!z.isZero){
                        assertEqualComplex(z.log.exp, z,
                                           epsi, head(no) + `exp(log(z)) = z at z = ${z}`);
                    }

                    const w = randComplex();

                    assertEqualComplex(z.exp.times(w.exp), (z.plus(w)).exp, 
                                       epsilon, head(no) + `e^z * e^w = e^(z + w); z = ${z}, w = ${w}`);
                    // assertEqualComplex(z.exp.pow(w), (z.times(w)).exp, 
                    //                    epsilon, head(no) + `(e^z)^w = e^(z * w); z = ${z}, w = ${w}`);

                    assertEquivComplex(z.log.plus(w.log), (z.times(w)).log, {im: 2*PI}, 
                                       epsilon, head(no) + `log(z) + log(w) = log(z*w); z = ${z}, w = ${w}`);
                    assertEquivComplex(z.times(w.log), (w.pow(z)).log, {im: 2*PI},
                                        epsilon, head(no) + `z*log(w) = log(w^z); z = ${z}, w = ${w}`);
                });
            });

            it('trigonometric functions', () => {
                repeat(200, (no) => {
                    const z = complex(rand(), rand());
                    const sin_z = z.sin, cos_z = z.cos, 
                          tan_z = z.tan, cot_z = z.cot;

                    assertEqualComplex(cot_z, tan_z.reciprocal,
                                       epsilon, head(no) + `cot z = 1/tan z at z = ${z}`);

                    const cos_z2 = cos_z.times(cos_z);
                    assertEqualComplex(sin_z.pow(2).plus(cos_z2), Complex.ONE,
                                       epsi, head(no) + `sin²z + cos²z = 1 at z = ${z}`);

                    const tan_z2 = tan_z.times(tan_z);
                    assertEqualComplex(tan_z2.plus(Complex.ONE), cos_z.pow(2).reciprocal,
                                       epsi, head(no) + `tan²z + 1 = 1/cos²z at z = ${z}`);

                    assertEqualComplex(Complex.ONE.plus(cot_z.pow(2)), sin_z.pow(2).reciprocal,
                                       epsi, head(no) + `1 + cot²z = 1/sin²z at z = ${z}`);
                });
            });

            it('inverse trigonometric functions', () => {
                repeat(500, (no) => {
                    const z = complex(rand(), rand());

                    assertEqualComplex(z.asin.sin, z,
                                       epsi, head(no) + `sin(asin(z))) = z at z = ${z}`);
                    assertEqualComplex(z.sin.asin, exp_asin_sin(z),
                                       epsi, head(no) + `asin(sin(z))) = z at z = ${z}`);

                    assertEqualComplex(z.acos.cos, z, 
                                       epsi, head(no) + `cos(acos(z))) = z at z = ${z}`);
                    assertEqualComplex(z.cos.acos, exp_acos_cos(z),
                                       epsi, head(no) + `acos(cos(z))) = z at z = ${z}`);

                    if(z.equals(Complex.I) || z.equals(Complex.MINUS_I)){
                        assertEqualComplex(z.atan.tan, Complex.NaN, 
                                        epsi, head(no) + `tan(atan(z))) = z at z = ${z}`);
                    }else{
                        assertEqualComplex(z.atan.tan, z, 
                                        epsi, head(no) + `tan(atan(z))) = z at z = ${z}`);
                    }
                    assertEqualComplex(z.tan.atan, exp_atan_tan(z),
                                       epsi, head(no) + `atan(tan(z))) = z at z = ${z}`);

                    function exp_asin_sin(z: Complex): Complex {
                        const mod_z = z.mod({re: [-PI/2, PI*3/2]});
                        return mod_z.re <= PI/2 ? mod_z : complex(PI - mod_z.re, -mod_z.im);
                    }

                    function exp_acos_cos(z: Complex): Complex {
                        const mod_z = z.mod({re: [-PI, PI]});
                        if(mod_z.re > 0) return mod_z;
                        else if(mod_z.re < 0) return mod_z.negate;

                        return mod_z.im >= 0 ? mod_z : mod_z.negate;
                    }

                    function exp_atan_tan(z: Complex): Complex {
                        const mod_z = z.mod({re: [-PI/2, PI*3/2]});
                        return mod_z.re <= PI/2 ? mod_z : complex(mod_z.re - PI, mod_z.im);
                    }
                });
            });

            it('hyperbolic functions', () => {
                repeat(200, (no) => {
                    const z = complex(rand(), rand());
                    const sinh_z = z.sinh, cosh_z = z.cosh, 
                    tanh_z = z.tanh, coth_z = z.coth;

                    assertEqualComplex(coth_z, tanh_z.reciprocal,
                                       epsi, head(no) + `coth z = 1/tanh z at z = ${z}`);

                    const cosh_z2 = cosh_z.times(cosh_z);
                    assertEqualComplex(Complex.ONE.plus(sinh_z.pow(2)), cosh_z2,
                                       epsi, head(no) + `1 + sinh²z = cosh²z at z = ${z}`);

                    const tanh_z2 = tanh_z.times(tanh_z);
                    assertEqualComplex(cosh_z2.reciprocal.plus(tanh_z2), Complex.ONE,
                                       epsi, head(no) + `1/cosh²z + tanh²z = 1 at z = ${z}`);

                    assertEqualComplex(sinh_z.pow(2).reciprocal.plus(Complex.ONE), coth_z.pow(2),
                                       epsi, head(no) + `1/sinh²z + 1 = coth²z at z = ${z}`);
                });
            });

            it('inverse hyperbolic functions', () => {
                repeat(500, (no) => {
                    const z = complex(rand(), rand());

                    assertEqualComplex(z.asinh.sinh, z, 
                                       epsi, head(no) + `sinh(asinh(z))) = z at z = ${z}`);
                    assertEqualComplex(z.sinh.asinh, exp_asinh_sinh(z), 
                                       epsi, head(no) + `asinh(sinh(z))) = z at z = ${z}`);

                    assertEqualComplex(z.acosh.cosh, z, 
                                       epsilon, head(no) + `cosh(acosh(z))) = z at z = ${z}`);
                    assertEqualComplex(z.cosh.acosh, exp_acosh_cosh(z), 
                                       epsilon, head(no) + `acosh(cosh(z))) = z at z = ${z}`);

                    if(z.isOne || z.equals(Complex.MINUS_ONE)){
                        assertEqualComplex(z.atanh.tanh, Complex.NaN, 
                                        epsi, head(no) + `tanh(atanh(z))) = z at z = ${z}`);
                    }else{
                        assertEqualComplex(z.atanh.tanh, z, 
                                        epsi, head(no) + `tanh(atanh(z))) = z at z = ${z}`);

                    }
                    assertEqualComplex(z.tanh.atanh, exp_atanh_tanh(z), 
                                       epsi, head(no) + `atanh(tanh(z))) = z at z = ${z}`);
                    
                    function exp_asinh_sinh(z: Complex): Complex {
                        const mod_z = z.mod({im: [-PI/2, PI*3/2]});
                        return mod_z.im <= PI/2 ? mod_z : complex(-mod_z.re, PI - mod_z.im);
                    }
                    
                    function exp_acosh_cosh(z: Complex): Complex {
                        const mod_z = z.mod({im: [-PI, PI]});
                        if(mod_z.isImaginary){
                            return mod_z.im > 0 ? mod_z : mod_z.negate;
                        }
                        return mod_z.re >= 0 ? mod_z : mod_z.negate;
                    }

                    function exp_atanh_tanh(z: Complex): Complex {
                        const mod_z = z.mod({im: [-PI/2, PI*3/2]});
                        return mod_z.im <= PI/2 ? mod_z : complex(mod_z.re, mod_z.im - PI);
                    }
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

    it('static functions that have the same name as one of methods of Complex should return the same result', () => {
        function test(z: Complex, no: number){
            assertEqualComplex(CMath.sqrt(z), z.sqrt, epsilon, head(no) + `sqrt(${z})`);

            assertEqualComplex(CMath.exp(z), z.exp, epsilon, head(no) + `exp(${z})`);
            if(!z.isZero){
                assertEqualComplex(CMath.log(z), z.log, epsilon, head(no) + `log(${z})`);
            }else{
                assert(CMath.log(z).isNaN, head(no) + `log(${z})`);
            }

            assertEqualComplex(CMath.sin(z), z.sin, epsilon, head(no) + `sin(${z})`);
            assertEqualComplex(CMath.cos(z), z.cos, epsilon, head(no) + `cos(${z})`);
            assertEqualComplex(CMath.tan(z), z.tan, epsilon, head(no) + `tan(${z})`);
            assertEqualComplex(CMath.cot(z), z.cot, epsilon, head(no) + `cot(${z})`);

            assertEqualComplex(CMath.asin(z), z.asin, epsilon, head(no) + `asin(${z})`);
            assertEqualComplex(CMath.acos(z), z.acos, epsilon, head(no) + `acos(${z})`);
            assertEqualComplex(CMath.atan(z), z.atan, epsilon, head(no) + `atan(${z})`);

            assertEqualComplex(CMath.sinh(z), z.sinh, epsilon, head(no) + `sinh(${z})`);
            assertEqualComplex(CMath.cosh(z), z.cosh, epsilon, head(no) + `cosh(${z})`);
            assertEqualComplex(CMath.tanh(z), z.tanh, epsilon, head(no) + `tanh(${z})`);
            assertEqualComplex(CMath.coth(z), z.coth, epsilon, head(no) + `coth(${z})`);
        }

        repeat(100, (no) => test(randComplex(), no));
    });

    it('additional methods should return the proper value', () => {
        function test(z: Complex, no: number){
            // additional trigonometric functions
            assertEqualComplex(CMath.sec(z), z.cos.reciprocal, epsilon, head(no) + `sec(${z})`);
            assertEqualComplex(CMath.csc(z), z.sin.reciprocal, epsilon, head(no) + `csc(${z})`);

            // additional inverse trigonometric functions
            assertEqualComplex(CMath.asec(z), z.reciprocal.acos, epsilon, head(no) + `asec(${z})`);
            assertEqualComplex(CMath.acsc(z), z.reciprocal.asin, epsilon, head(no) + `acsc(${z})`);
            assertEqualComplex(CMath.acot(z), z.reciprocal.atan, epsilon, head(no) + `acot(${z})`);

            // additional hyperbolic functions
            assertEqualComplex(CMath.sech(z), z.cosh.reciprocal, epsilon, head(no) + `sech(${z})`);
            assertEqualComplex(CMath.csch(z), z.sinh.reciprocal, epsilon, head(no) + `csch(${z})`);

            // additional inverse hyperbolic functions
            assertEqualComplex(CMath.asech(z), z.reciprocal.acosh, epsilon, head(no) + `asech(${z})`);
            assertEqualComplex(CMath.acsch(z), z.reciprocal.asinh, epsilon, head(no) + `acsch(${z})`);
            assertEqualComplex(CMath.acoth(z), z.reciprocal.atanh, epsilon, head(no) + `acoth(${z})`);

            // round-like functions
            assertEqualComplex(CMath.round(z), complex(Math.round(z.re), Math.round(z.im)),
                               0, head(no) + `round(${z})`);
            assertEqualComplex(CMath.round(z, 're'), complex(Math.round(z.re), z.im),
                               0, head(no) + `round(${z}, 're')`);
            assertEqualComplex(CMath.round(z, 'im'), complex(z.re, Math.round(z.im)),
                               0, head(no) + `round(${z}, 'im')`);

            assertEqualComplex(CMath.ceil(z), complex(Math.ceil(z.re), Math.ceil(z.im)),
                               0, head(no) + `ceil(${z})`);
            assertEqualComplex(CMath.ceil(z, 're'), complex(Math.ceil(z.re), z.im),
                               0, head(no) + `ceil(${z}, 're')`);
            assertEqualComplex(CMath.ceil(z, 'im'), complex(z.re, Math.ceil(z.im)),
                               0, head(no) + `ceil(${z}, 'im')`);

            assertEqualComplex(CMath.floor(z), complex(Math.floor(z.re), Math.floor(z.im)),
                               0, head(no) + `floor(${z})`);
            assertEqualComplex(CMath.floor(z, 're'), complex(Math.floor(z.re), z.im),
                               0, head(no) + `floor(${z}, 're')`);
            assertEqualComplex(CMath.floor(z, 'im'), complex(z.re, Math.floor(z.im)),
                               0, head(no) + `floor(${z}, 'im')`);

            assertEqualComplex(CMath.trunc(z), complex(Math.trunc(z.re), Math.trunc(z.im)),
                               0, head(no) + `trunc(${z})`);
            assertEqualComplex(CMath.trunc(z, 're'), complex(Math.trunc(z.re), z.im),
                               0, head(no) + `trunc(${z}, 're')`);
            assertEqualComplex(CMath.trunc(z, 'im'), complex(z.re, Math.trunc(z.im)),
                               0, head(no) + `trunc(${z}, 'im')`);

            
            if(z.isGaussianInteger){
                assertEqualComplex(CMath.round(z), z, 0);
                assertEqualComplex(CMath.ceil(z), z, 0);
                assertEqualComplex(CMath.floor(z), z, 0);
                assertEqualComplex(CMath.trunc(z), z, 0);
            }

            assertEqualComplex(CMath.fround(z), complex(Math.fround(z.re), Math.fround(z.im)),
                               0, head(no) + `fround(${z})`);
            assertEqualComplex(CMath.fround(z, 're'), complex(Math.fround(z.re), z.im),
                               0, head(no) + `fround(${z}, 're')`);
            assertEqualComplex(CMath.fround(z, 'im'), complex(z.re, Math.fround(z.im)),
                               0, head(no) + `fround(${z}, 'im')`);

            assert.sameOrderedMembers(CMath.sign(z), [Math.sign(z.re), Math.sign(z.im)],
                                      head(no) + `sign(${z})`);
        }

        repeat(100, (no) => test(randComplex(), no));
    });
});

function ref(re: number | Complex, im: number = 0): ReferenceComplex{
    if(typeof re === 'number'){
        return new ReferenceComplex(f(re), f(im));
    }else{
        return new ReferenceComplex(re.re, re.im);
    }   

    function f(x: number): number {
        return x === -0 ? 0 : x;
    }
}

function refPolar(r: number, theta: number): ReferenceComplex{
    return ref(r * Math.cos(theta), r * Math.sin(theta));
}

 class ReferenceComplex extends Complex {

    constructor(readonly re: number, readonly im: number){ 
        super();
    }

    equals(that: number | Complex, epsilon?: number): boolean {
        throw new Error('Method not implemented.');
    }
    isCongruentTo(that: number | Complex, m: ModArg, epsilon?: number): boolean {
        throw new Error('Method not implemented.');
    }

    mod(m: ModArg): Complex {
        throw new Error('Method not implemented.');
    }

    toString(): string { 
        if(this.isNaN) return 'NaN(C)';
        if(this.isInfinite) return '∞(C)';

        if(this.isReal) return this.re.toString();
        if(this.isImaginary){
            switch(this.im) {
                case  1: return  'i';
                case -1: return '-i';
                default: return `${this.im}i`;
            }
        }

        const reStr = this.re.toString();
        let imStr;
        switch(this.im) {
            // this.im !== 0
            case  1: imStr = 'i'; break;
            case -1: imStr = '-i'; break;
            default: 
                imStr = this.im > 0 ? `+${this.im}i` : `${this.im}i`;
                break;
        }
        return reStr + imStr;
    }


    get isFinite(): boolean { return isFinite(this.re) && isFinite(this.im); }
    get isInfinite(): boolean { return !this.isFinite && !this.isNaN; }
    get isNaN(): boolean { return isNaN(this.re) || isNaN(this.im); }

    get isReal() { return this.im === 0; }
    get isImaginary() { return this.re === 0 && this.im !== 0; }
    get isZero() { return this.re === 0 && this.im === 0; }
    get isOne() { return this.re === 1 && this.im === 0; }

    get isInteger() { return this.im === 0 && Number.isInteger(this.re); }
    get isGaussianInteger() { return Number.isInteger(this.re) && Number.isInteger(this.im); }

    get abs(): number { return Math.hypot(this.re, this.im); }
    get abs2(): number { return this.re * this.re + this.im * this.im; }
    get arg(): number { return Math.atan2(this.im, this.re); }

    get negate(): Complex { return ref(-this.re, -this.im); }
    get conjugate(): Complex { return ref(this.re, -this.im); }

    get reciprocal(): Complex {
        return this.conjugate.div(this.abs2);
    }

    private toComplex(that: Complex | number): Complex {
        return typeof that === 'number' ? ref(that, 0) : that;
    }

    plus(that: Complex | number): Complex {
        const zat = this.toComplex(that);
        return ref(this.re + zat.re, this.im + zat.im);
    }

    minus(that: Complex | number): Complex {
        const zat = this.toComplex(that);
        return ref(this.re - zat.re, this.im - zat.im);
    }

    times(that: Complex | number): Complex {
        const zat = this.toComplex(that);
        return ref(this.re * zat.re - this.im * zat.im,
                      this.re * zat.im + this.im * zat.re);
    }

    div(that: Complex | number): Complex {
        const zat = this.toComplex(that);
        if(zat.isZero){
            return this.isZero ? ref(NaN, NaN) : ref(Infinity, Infinity);
        }else if(zat.isInfinite){
            return this.isInfinite ? ref(NaN, NaN) : ref(0, 0);
        }else if(this.isInfinite){
            return this;
        }else{
            const d = zat.abs2;
            return ref((this.re * zat.re + this.im * zat.im) / d,
                       (-this.re * zat.im + this.im * zat.re) / d);
        }
    }

    pow(p: number | Complex): Complex {
        return this.log.times(p).exp;
    }

    get sqrt(): Complex {
        if(this.isZero) return this;
        return refPolar(Math.sqrt(this.abs), this.arg / 2);
    }

    nroots(n: number): Complex[]{
        if(n <= 0) return [];

        const r = Math.pow(this.abs, 1/n),
              theta = this.arg/n,
              phi = 2*Math.PI/n;
        const roots = new Array<Complex>(n);
        for(let i = 0; i < n; i++){
            roots[i] = Complex.ofPolar(r, theta + i*phi);
        }
        return roots;
    }

    get exp(): Complex {
        return refPolar(Math.exp(this.re), this.im);
    }

    get log(): Complex {
        if(this.isZero) return ref(-Infinity, -Infinity);
        if(this.isInfinite) return this;
        return ref(Math.log(this.abs2) / 2, this.arg);
    }

    get sin(): Complex {
        return ref(Math.sin(this.re) * Math.cosh(this.im),
                      Math.cos(this.re) * Math.sinh(this.im));
    }

    get cos(): Complex {
        return ref(Math.cos(this.re) * Math.cosh(this.im),
                      -Math.sin(this.re) * Math.sinh(this.im));
    }

    get tan(): Complex {
        const d = Math.cos(2 * this.re) + Math.cosh(2 * this.im);
        return ref(Math.sin(2 * this.re) / d, Math.sinh(2 * this.im) / d);
    }

    get cot(): Complex {
        const d = Math.cos(2 * this.re) - Math.cosh(2 * this.im);
        return ref(-Math.sin(2 * this.re) / d, Math.sinh(2 * this.im) / d);
    }

    /**
     * asin(z) = -i*(log(sqrt(1 - z*z) + i*z))
     * ref: typelevel.spire
     */
    get asin(): Complex {
        const z2 = this.times(this);
        const s = ref(1 - z2.re, -z2.im).sqrt;
        const l = ref(s.re - this.im, s.im + this.re).log;
        return ref(l.im, -l.re);
    }

    /**
     * acos(z) = -i*(log(z + i*(sqrt(1 - z*z))))
     * ref: typelevel.spire
     */
    get acos(): Complex {
        const z2 = this.times(this);
        const s = ref(1 - z2.re, -z2.im).sqrt;
        const l = ref(this.re - s.im, this.im + s.re).log;
        return ref(l.im, -l.re);
    }

    /**
     * atan(z) = (i/2) log((i + z)/(i - z))
     * ref: typelevel.spire
     */
    get atan(): Complex {
        const n = ref(this.re, this.im + 1);
        const d = ref(-this.re, 1 - this.im);
        const l = n.div(d).log;
        return ref(-l.im / 2, l.re / 2);
    }

    get sinh(): Complex {
        return ref(Math.sinh(this.re) * Math.cos(this.im),
                      Math.cosh(this.re) * Math.sin(this.im));
    }

    get cosh(): Complex {
        return ref(Math.cosh(this.re) * Math.cos(this.im),
                      Math.sinh(this.re) * Math.sin(this.im));
    }

    get tanh(): Complex {
        const d = Math.cosh(2 * this.re) + Math.cos(2 * this.im);
        return ref(Math.sinh(2 * this.re) / d, Math.sin(2 * this.im) / d);
    }

    get coth(): Complex {
        const d = Math.cosh(2 * this.re) - Math.cos(2 * this.im);
        return ref(Math.sinh(2 * this.re) / d, -Math.sin(2 * this.im) / d);
    }

    /**
     * asinh(z) = log(z + sqrt(z*z + 1))
     * ref: https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions
     */
    get asinh(): Complex {
        const s = this.times(this).plus(1).sqrt;
        return this.plus(s).log;
    }

    /**
     * acosh(z) = log(z + sqrt(z + 1)*sqrt(z - 1))
     * ref: https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions
     */
    get acosh(): Complex {
        const s = this.plus(1).sqrt.times(this.minus(1).sqrt);
        return this.plus(s).log;
    }

    /**
     * atanh(z) = (1/2)log((1 + z)/(1 - z))
     * ref: https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions
     */
    get atanh(): Complex {
        const n = this.plus(1);
        const d = ref(1 - this.re, -this.im);
        return n.div(d).log.div(2);
    }
}