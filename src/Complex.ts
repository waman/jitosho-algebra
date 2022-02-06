export function complex(re: number, im: number = 0): Complex {
    if(isFinite(re) && isFinite(im)){
        if(im === 0) return newReal(re);
        if(re === 0) return newImaginary(im);
        return new ComplexImpl(re, im);

    }else{
        if(isNaN(re) || isNaN(im))
            return Complex.NaN;
        else
            return Complex.INFINITY;
    }
}

function newReal(re: number): Complex{
    switch (re) {
        case  0: return Complex.ZERO;
        case  1: return Complex.ONE;
        case -1: return Complex.MINUS_ONE;
        default: return re > 0 ? new PositiveReal(re) : new NegativeReal(re);
    }
}

function newImaginary(im: number): Complex{
    switch(im){
        case  1: return Complex.I;
        case -1: return Complex.MINUS_I;
        default: return new ComplexImaginary(im);
    }
}

function asComplex(z: Complex | number): Complex {
    return typeof z === 'number' ? complex(z) : z;
}

/**
 * *Complex* class represents a complex number.
 * *Complex* class can be instantiated by the *complex()* function.
 * 
 * For arithmetic operations are defined as *plus*, *minus*, *times*, and *div*.
 * 
 * 
 * Ref: 『Javaによるアルゴリズム事典』複素数 (complex number) Complex.java
 */
export abstract class Complex{

    abstract get re(): number
    abstract get im(): number

    abstract toString(): string
    abstract equals(that: Complex | number, epsilon?: number): boolean
    abstract isCongruentTo(that: Complex | number, m: ModArg, epsilon?: number): boolean

    abstract get isReal(): boolean
    abstract get isImaginary(): boolean
    abstract get isZero(): boolean
    abstract get isOne(): boolean
    abstract get isFinite(): boolean
    abstract get isInfinite(): boolean
    abstract get isNaN(): boolean

    abstract get isInteger(): boolean
    abstract get isGaussianInteger(): boolean

    /**
     * Return *√(x² + y²)*.
     */
    abstract get abs(): number

    /**
     * Return *x² + y²* = (this.abs)².
     */
    abstract get abs2(): number

    /**
     * Return the argument of this complex number.
     * The argument is calculated by *atan(y/x) = Math.atan2(y, x)* in almost all cases.
     * Return 0 if x = y = 0.
     * Return π (NOT -π) if x < 0 and y = -0.
     */
    abstract  get arg(): number

    /**
     * Return the negate value (additive inverse element)*- x - iy*.
     */
    abstract get negate(): Complex

    /**
     * Return the complex conjugate *x - iy*.
     */
    abstract get conjugate(): Complex

    /**
     * Return the reciprocal value (multiplicative inverse element) *(x - iy)/(x² + y²)*.
     */
    abstract get reciprocal(): Complex

    /**
     * Return *(x₁ + iy₁) + (x₂ + iy₂) = (x₁ + x₂) + i(y₁ + y₂)*.
     */
    abstract plus(that: Complex | number): Complex

    /**
     * Return *(x₁ + iy₁) - (x₂ + iy₂) = (x₁ - x₂) + i(y₁ - y₂)*.
     */
     abstract minus(that: Complex | number): Complex

    /**
     * Return *(x₁ + iy₁) * (x₂ + iy₂) = (x₁x₂ - y₁y₂) + i(x₁y₂ + y₁x₂)*.
     */
    abstract times(that: Complex | number): Complex

    /**
     * Return *(x₁ + iy₁) / (x₂ + iy₂) = ((x₁x₂ + y₁y₂) + (- x₁y₂ + iy₁x₂)) / (x₂² + y₂²)*.
     */
    abstract div(that: Complex | number): Complex

    /**
     * Return a power of this complex number.
     * *z.pow(w)* returns *z^w = exp(w log z)*.
     */
    abstract pow(p: Complex | number): Complex

    abstract mod(m: ModArg): Complex

    /**
     * Return *√(x + iy) = √(r + x)/2 + i√(r - x)/2*.
     * The branch satisfies *-π/2 <= arg(sqrt(z)) <= π/2*.
     */
    abstract get sqrt(): Complex

    /**
     * Return *n*-th roots.
     */
    nroots(n: number): Complex[] {
        if(n <= 0) return [];
        if(n === 1) return [this];
        if(n === 2){
            const thisSqrt = this.sqrt;
            return [thisSqrt, thisSqrt.negate];
        }

        const r = Math.pow(this.abs, 1/n),
              theta = this.arg/n,
              phi = 2*Math.PI/n;
        const roots = new Array<Complex>(n);
        for(let i = 0; i < n; i++){
            roots[i] = Complex.ofPolar(r, theta + i*phi);
        }
        return roots;
    }

    abstract get exp(): Complex

    /**
     * Return *log(z) = log|z| + i arg(z) *.
     * The branch satisfies *-π <= arg(log(z)) <= π*.
     */
    abstract get log(): Complex

    /**
     * Return *sin(x + iy) = sin x cosh y + i cos x sinh y*.
     */
    abstract get sin(): Complex

    /**
     * Return *cos(x + iy) = cos x cosh y - i sin x sinh y*.
     */
    abstract get cos(): Complex

    /**
     * Return *tan(x + iy) = (sin 2x + i sinh 2y) / (cos 2x + cosh 2y)*.
     */
    abstract get tan(): Complex
    
    /** Return *cot(x + iy) = -(sin 2x - i sinh 2y) / (cos 2x - cosh 2y)*. */
    abstract get cot(): Complex

    /**
     * Return *asin(z) = -i log(√(1 - z²) + iz)*.
     * The branch satisfies *-π/2 <= Re(asin(z)) <= π/2*.
     */
    abstract get asin(): Complex

    /**
     * Return *acos(z) = -i log(z + i√(1 - z²))*.
     * The branch satisfies *0 <= Re(acos(z)) <= π*.
     */
    abstract get acos(): Complex

    /**
     * Return *atan(z) = (i/2) log((i + z)/(i - z))*.
     * The branch satisfies *-π/2 <= Re(atan(z)) <= π/2*.
     */
    abstract get atan(): Complex

    /**
     * Return *sinh(x + iy) = sinh x cos y + i cosh x sin y*.
     */
    abstract get sinh(): Complex

    /**
     * Return *cosh(x + iy) = cosh x cos y + i sinh x sin y*.
     */
    abstract get cosh(): Complex

    /**
     * Return *tanh(x + iy) = (sinh 2x + i sin 2y) / (cosh 2x + cos 2y)*.
     */
    abstract get tanh(): Complex
    
    /** Return *coth(x + iy) = (sinh 2x - i sin 2y) / (cosh 2x - cos 2y)*. */
    abstract get coth(): Complex

    /**
     * Return *asinh(z) = log(z + √(z² + 1))*.
     * The branch satisfies *-π/2 <= Im(asinh(z)) <= π/2*.
     */
    abstract get asinh(): Complex

    /**
     * Return *acosh(z) = log(z + √(z + 1)√(z - 1))*.
     * The branch satisfies *-π <= Im(acosh(z)) <= π* and *0 <= Re(acosh(z)) < ∞*.
     */
    abstract get acosh(): Complex

    /**
     * Return *atanh(z) = (1/2)log((1 + z)/(1 - z))*.
     * The branch satisfies *-π/2 <= Im(atanh(z)) <= π/2*.
     */
    abstract get atanh(): Complex

    public static get ZERO(): Complex { return COMPLEX_ZERO; }
    public static get ONE(): Complex { return COMPLEX_ONE; }
    public static get I(): Complex { return IMAGINARY_UNIT; }
    public static get MINUS_ONE(): Complex { return COMPLEX_MINUS_ONE; }
    public static get MINUS_I(): Complex { return MINUS_IMAGINARY_UNIT; }

    public static get INFINITY(): Complex { return COMPLEX_INFINITY; }
    public static get NaN(): Complex { return COMPLEX_NAN; }

    /**
     * *r* can be negative.
     */
    static ofPolar(r: number, theta: number): Complex {
        if(r === 0) return Complex.ZERO;
        return complex(r * Math.cos(theta), r * Math.sin(theta));
    }
}

export type ModArg = {
    re?: number|[number, number]
    im?: number|[number, number]
}

abstract class FiniteComplex extends Complex{

    equals(that: Complex | number, epsilon = 0): boolean {
        if(typeof that === 'number'){
            if(isNaN(that)) return false;
            return Math.abs(this.re - that) <= epsilon
                    && Math.abs(this.im) <= epsilon;
        }else{
            if(that.isNaN) return false;
            return Math.abs(this.re - that.re) <= epsilon
                    && Math.abs(this.im - that.im) <= epsilon;
        }
    }

    isCongruentTo(that: Complex | number, m: ModArg, epsilon: number): boolean {
        const z = this.minus(that).mod(m);
        if(z.equals(Complex.ZERO, epsilon)) return true;

        const exps: Complex[] = [];
        zeros(m.re).forEach( rs =>
            zeros(m.im).forEach( is => exps.push(complex(rs, is)))
        );
        return exps.filter(exp => !exp.isZero).some(exp => z.equals(exp, epsilon));

        function zeros(mo: number | [number, number] | undefined): number[] {
            if(mo === undefined) return [0];
            if(typeof mo === 'number') return [0, mo];

            return mo.includes(0) ? mo : [0];
        }
    }

    get isFinite(): boolean { return true; }
    get isInfinite(): boolean { return false; }
    get isNaN(): boolean { return false; }

    pow(p: Complex | number): Complex {
        if(typeof p === 'number'){
            if(!isFinite(p)){
                if(isNaN(p)) return Complex.NaN;
                const r = this.abs;
                if(r > 1){
                    return p > 0 ? Complex.INFINITY : Complex.ZERO;
                }else if(r < 1){
                    return p > 0 ? Complex.ZERO : Complex.INFINITY;
                }else{  // r === 1
                    return this.isOne ? Complex.ONE : Complex.NaN;
                }
            }

            if(Number.isInteger(p)) return this.intPower(p);
            return this.complexPower(p);

        }else{
            if(!p.isFinite){
                if(p.isNaN) return Complex.NaN;
                return this.isOne ? Complex.ONE : Complex.NaN;
            }

            if(p.isInteger) return this.intPower(p.re);
            return this.complexPower(p);
        }
    }

    mod(m: ModArg): Complex {
        return complex(nMod(this.re, m.re), nMod(this.im, m.im));

        function nMod(x:number, m: number | [number, number] | undefined): number {
            if(m === undefined) return x;
            let min, width: number;
            if(typeof m === 'number'){
                min = 0;
                width = m;
            }else{
                min = m[0];
                width = m[1] - min;
            }
            return x - Math.floor((x - min) / width) * width;
        }
    }

    protected abstract intPower(n: number): Complex

    protected complexPower(p: Complex | number): Complex {
        return this.log.times(p).exp;
    }
}

/**
 * This complex number must not be real, (pure) imaginary, infinity, and NaN.
 */
class ComplexImpl extends FiniteComplex {

    constructor(readonly re: number, readonly im: number){
        super();
        if(!(isFinite(re) && isFinite(im)))
            throw new Error(`An illegal argument appears: ${re}+${im}i`);
        if(re === 0 || im === 0)
            throw new Error(`An illegal argument appears: ${re}+${im}i`);
    }

    toString(): string {
        const reStr = this.re.toString();
        let imStr;
        switch (this.im) {
            // this.im !== 0
            case  1: imStr = 'i'; break;
            case -1: imStr = '-i'; break;
            default: 
                imStr = this.im > 0 ? `+${this.im}i` : `${this.im}i`;
                break;
        }
        return reStr + imStr;
    }

    get isReal() { return false }
    get isImaginary() { return false; }
    get isZero() { return false; }
    get isOne() { return false; }

    get isInteger() { return false; }
    get isGaussianInteger() { return Number.isInteger(this.re) && Number.isInteger(this.im); }

    get abs(): number { return Math.hypot(this.re, this.im); }
    get abs2(): number { return this.re * this.re + this.im * this.im; }
    get arg(): number { return Math.atan2(this.im, this.re); }

    get negate(): Complex { return complex(-this.re, -this.im); }
    get conjugate(): Complex { return complex(this.re, -this.im); }

    get reciprocal(): Complex {
        if(Math.abs(this.re) >= Math.abs(this.im)){
            const w = this.im / this.re, d = this.re + this.im * w;
            return complex(1 / d, - w / d);
        }else{
            const w = this.re / this.im, d = this.re * w + this.im;
            return complex(w / d, -1 / d);
        }
    }

    plus(that: Complex | number): Complex {
        return typeof that === 'number' ? 
            complex(this.re + that, this.im) :
            complex(this.re + that.re, this.im + that.im);
    }

    minus(that: Complex | number): Complex {
        return typeof that === 'number' ?
            complex(this.re - that, this.im) :
            complex(this.re - that.re, this.im - that.im);
    }

    times(that: Complex | number): Complex {
        if(typeof that === 'number'){
            return complex(this.re * that, this.im * that);
        }else{
            if(!that.isFinite)
                return that.isNaN ? Complex.NaN : Complex.INFINITY;

            return complex(this.re * that.re - this.im * that.im,
                           this.re * that.im + this.im * that.re);
        }
    }

    div(that: Complex | number): Complex {
        if(typeof that === 'number'){
            return complex(this.re / that, this.im / that);
        }else{
            if(that.isNaN) return Complex.NaN;
            if(that.isInfinite) return Complex.ZERO;
            if(that.isZero) return Complex.INFINITY;

            if(Math.abs(that.re) >= Math.abs(that.im)){
                const w = that.im / that.re, d = that.re + that.im * w;
                return complex((this.re + this.im * w) / d, (this.im - this.re * w) / d);

            }else{
                const w = that.re / that.im, d = that.re * w + that.im;
                return complex((this.re * w + this.im) / d, (this.im * w - this.re) / d);
            }
        }
    }

    /**
     * The second argument *n* must be an integer.
     * 
     * Ref: 『Javaによるアルゴリズム事典』累乗 (power) Power.java
     */
    protected intPower(n: number): Complex {
        if(n === 0) return Complex.ONE;
        return n > 0 ? nPower(this, n) :
                       nPower(this, -n).reciprocal;
    
        function nPower(x: Complex, p: number): Complex {
            let n = p, result = Complex.ONE, z = x;
            while(n != 0){
                if(n & 1) result = result.times(z);
                z = z.times(z);
                n >>= 1;
            }
            return result;
        }
    }

    get sqrt(): Complex {
        const r = this.abs, w = Math.sqrt(r + Math.abs(this.re));
        if(this.re >= 0){
            return complex(Math.SQRT1_2 * w, Math.SQRT1_2 * this.im / w);
        }else{
            return complex(Math.SQRT1_2 * Math.abs(this.im) / w,
                           this.im >= 0 ? Math.SQRT1_2 * w : -Math.SQRT1_2 * w);
        }
    }

    get exp(): Complex {
        return Complex.ofPolar(Math.exp(this.re), this.im);
    }

    get log(): Complex {
        return complex(Math.log(this.abs2) / 2, this.arg);
    }

    get sin(): Complex {
        return complex(Math.sin(this.re) * Math.cosh(this.im),
                       Math.cos(this.re) * Math.sinh(this.im));
    }

    get cos(): Complex {
        return complex(Math.cos(this.re) * Math.cosh(this.im),
                      -Math.sin(this.re) * Math.sinh(this.im));
    }

    get tan(): Complex {
        const d = Math.cos(2 * this.re) + Math.cosh(2 * this.im);
        return complex(Math.sin(2 * this.re) / d, Math.sinh(2 * this.im) / d);
    }

    get cot(): Complex {
        const d = Math.cos(2 * this.re) - Math.cosh(2 * this.im);
        return complex(-Math.sin(2 * this.re) / d, Math.sinh(2 * this.im) / d);
    }

    /**
     * asin(z) = -i*(log(sqrt(1 - z*z) + i*z))
     * ref: typelevel.spire
     */
     get asin(): Complex {
        const z2 = this.times(this);
        const s = complex(1 - z2.re, -z2.im).sqrt;
        const l = complex(s.re - this.im, s.im + this.re).log;
        return complex(l.im, -l.re);
    }

    /**
     * acos(z) = -i*(log(z + i*(sqrt(1 - z*z))))
     * ref: typelevel.spire
     */
     get acos(): Complex {
        const z2 = this.times(this);
        const s = complex(1 - z2.re, -z2.im).sqrt;
        const l = complex(this.re - s.im, this.im + s.re).log;
        return complex(l.im, -l.re);
    }

    /**
     * atan(z) = (i/2) log((i + z)/(i - z))
     * ref: typelevel.spire
     */
     get atan(): Complex {
        const n = complex(this.re, this.im + 1);
        const d = complex(-this.re, 1 - this.im);
        const l = n.div(d).log;
        return complex(-l.im / 2, l.re / 2);
    }

    get sinh(): Complex {
        return complex(Math.sinh(this.re) * Math.cos(this.im),
                       Math.cosh(this.re) * Math.sin(this.im));
    }

    get cosh(): Complex {
        return complex(Math.cosh(this.re) * Math.cos(this.im),
                       Math.sinh(this.re) * Math.sin(this.im));
    }

    get tanh(): Complex {
        const d = Math.cosh(2 * this.re) + Math.cos(2 * this.im);
        return complex(Math.sinh(2 * this.re) / d, Math.sin(2 * this.im) / d);
    }

    get coth(): Complex {
        const d = Math.cosh(2 * this.re) - Math.cos(2 * this.im);
        return complex(Math.sinh(2 * this.re) / d, -Math.sin(2 * this.im) / d);
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
        const d = complex(1 - this.re, -this.im);
        return n.div(d).log.div(2);
    }
}

abstract class AbstractReal extends FiniteComplex {

    get im(): number { return 0; }

    toString(): string { return this.re.toString(); }

    get isReal(): boolean { return true; }
    get isImaginary(): boolean { return false; }
    get isInteger(): boolean { return Number.isInteger(this.re); }

    get isGaussianInteger(): boolean { return this.isInteger; }

    get abs2(): number { return this.re * this.re; }

    get conjugate(): Complex { return this; }

    plus(that: Complex | number): Complex {
        return typeof that === 'number' ?
            complex(this.re + that) :
            complex(this.re + that.re, that.im);
    }

    minus(that: Complex | number): Complex {
        return typeof that === 'number' ?
            complex(this.re - that) : 
            complex(this.re - that.re, -that.im);
    }

    times(that: Complex | number): Complex {
        return typeof that === 'number' ?
            complex(this.re * that) :
            complex(this.re * that.re, this.re * that.im);
    }

    div(that: Complex | number): Complex {
        if(typeof that === 'number'){
            return complex(this.re / that);
        }else{
            if(that.isInfinite) return Complex.ZERO;
            if(that.isZero) return Complex.INFINITY;

            if(Math.abs(that.re) >= Math.abs(that.im)){
                const w = that.im / that.re, d = that.re + that.im * w;
                return complex(this.re / d, -this.re * w / d);

            }else{
                const w = that.re / that.im, d = that.re * w + that.im;
                return complex(this.re * w / d, -this.re / d);
            }
        }
    }

    protected intPower(n: number): Complex {
        return complex(calculateIntegralPower(this.re, n));
    }

    get exp(): Complex { return complex(Math.exp(this.re)); }

    get sin(): Complex { return complex(Math.sin(this.re)); }
    get cos(): Complex { return complex(Math.cos(this.re)); }
    get tan(): Complex { return complex(Math.tan(this.re)); }
    get cot(): Complex { return complex(1/Math.tan(this.re)); }

    get atan(): Complex { return complex(Math.atan(this.re)); }

    get sinh(): Complex { return complex(Math.sinh(this.re)); }
    get cosh(): Complex { return complex(Math.cosh(this.re)); }
    get tanh(): Complex { return complex(Math.tanh(this.re)); }
    get coth(): Complex { return complex(1/Math.tanh(this.re)); }

    get asinh(): Complex { return complex(Math.asinh(this.re)); }

    get atanh(): Complex {
        if(Math.abs(this.re) <= 1){
            return complex(Math.atanh(this.re));
        }else{
            return complex(Math.atanh(1/this.re), Math.PI/2);
        }
    }
}

class ComplexZero extends AbstractReal {

    get re(): number { return 0; }

    toString(): string { return '0'; }

    get isZero(): boolean { return true; }
    get isOne(): boolean { return false; }

    get isInteger(): boolean { return true; }
    get isGaussianInteger(): boolean { return true; }

    get abs(): number { return 0; }
    get abs2(): number { return 0; }
    get arg(): number { return 0; }

    get negate(): Complex { return Complex.ZERO; }
    get reciprocal(): Complex { return Complex.INFINITY; }

    plus(that: Complex | number): Complex {
        return asComplex(that);
    }

    minus(that: Complex | number): Complex {
        return typeof that === 'number' ? complex(-that, 0) : that.negate;
    }

    times(that: Complex | number): Complex {
        if(typeof that === 'number')
            return isFinite(that) ? Complex.ZERO : Complex.NaN;
        else
            return that.isFinite ? Complex.ZERO : Complex.NaN;
    }

    div(that: Complex | number): Complex {
        if(typeof that === 'number')
            return isNaN(that) || that === 0 ? Complex.NaN : Complex.ZERO;
        else
            return that.isNaN || that.isZero ? Complex.NaN : Complex.ZERO;
    }

    pow(p: Complex | number): Complex {
        if(typeof p === 'number'){
            if(isNaN(p) || p === 0) return Complex.NaN;
            return p > 0 ? Complex.ZERO : Complex.INFINITY;
        }else{
            if(p.isNaN || p.isInfinite || p.re === 0) return Complex.NaN;
            return p.re > 0 ? Complex.ZERO : Complex.INFINITY;
        }
    }

    protected intPower(n: number): Complex {
        throw new Error("Illegal Method Call");
    }

    get sqrt(): Complex { return Complex.ZERO; }
    nroots(n: number): Complex[] { return n >= 1 ? [Complex.ZERO] : []; }

    get exp(): Complex { return Complex.ONE; }
    get log(): Complex { return Complex.NaN; }

    get sin(): Complex { return Complex.ZERO; }
    get cos(): Complex { return Complex.ONE; }
    get tan(): Complex { return Complex.ZERO; }
    get cot(): Complex { return Complex.INFINITY; }

    get asin(): Complex { return Complex.ZERO; }
    get acos(): Complex { return CMath.PI_BY_2; }
    get atan(): Complex { return Complex.ZERO; }

    get sinh(): Complex { return Complex.ZERO; }
    get cosh(): Complex { return Complex.ONE; }
    get tanh(): Complex { return Complex.ZERO; }
    get coth(): Complex { return Complex.INFINITY; }

    get asinh(): Complex { return Complex.ZERO; }
    get acosh(): Complex { return new ComplexImaginary(Math.PI / 2); }
    get atanh(): Complex { return Complex.ZERO; }
}

class PositiveReal extends AbstractReal {

    constructor(readonly re: number){
        super();
        if(isNaN(re) || !isFinite(re) || re <= 0 || re === 1) 
            throw new Error(`An illegal argument appears: ${re}`);
    }

    get isZero(): boolean { return false; }
    get isOne(): boolean { return false; }

    get abs(): number { return this.re; }
    get arg(): number { return 0; }

    get negate(): Complex { return new NegativeReal(-this.re); }
    get reciprocal(): Complex { return new PositiveReal(1/this.re); }

    protected complexPower(p: Complex | number): Complex {
        if(typeof p === 'number') return realPower(this.re, p);
        if(p.isReal) return realPower(this.re, p.re);
        return super.complexPower(p);
        
        function realPower(x: number, n: number): Complex { 
            return complex(Math.pow(x, n)); 
        }
    }

    get sqrt(): Complex { return new PositiveReal(Math.sqrt(this.re)); }
    get log(): Complex { return complex(Math.log(this.re)); }

    get asin(): Complex { 
        return this.re <= 1 ?
            complex(Math.asin(this.re)):
            complex(Math.PI/2, -Math.acosh(this.re));
    }

    get acos(): Complex { 
        return this.re <= 1 ?
            complex(Math.acos(this.re)):
            complex(0, Math.acosh(this.re));
    }

    get acosh(): Complex { 
        return this.re >= 1 ?
            complex(Math.acosh(this.re)):
            complex(0, Math.acos(this.re));
    }
}

class ComplexOne extends AbstractReal {

    get re(): number { return 1; }

    toString(): string { return '1'; }

    get isZero(): boolean { return false; }
    get isOne(): boolean { return true; }

    get isInteger(): boolean { return true; }
    get isGaussianInteger(): boolean { return true; }

    get abs(): number { return 1; }
    get abs2(): number { return 1; }
    get arg(): number { return 0; }

    get negate(): Complex { return Complex.MINUS_ONE; }
    get reciprocal(): Complex { return this; }

    times(that: Complex | number): Complex {
        return asComplex(that);
    }

    div(that: Complex | number): Complex {
        return typeof that === 'number' ? complex(1/that, 0) : that.reciprocal;
    }

    pow(p: Complex | number): Complex {
        if(typeof p === 'number')
            return isNaN(p) ? Complex.NaN : Complex.ONE;
        else
            return p.isNaN ? Complex.NaN : Complex.ONE;
    }

    protected intPower(n: number): Complex {
        throw new Error("Method not implemented.");
    }

    get sqrt(): Complex { return Complex.ONE; }

    nroots(n: number): Complex[] {
        if(n <= 0) return [];
        if(n === 1) return [Complex.ONE];
        if(n === 2) return [Complex.ONE, Complex.MINUS_ONE];

        const phi = 2 * Math.PI / n;
        const roots = new Array<Complex>(n);
        for(let i = 0; i < n; i++){
            roots[i] = Complex.ofPolar(1, i*phi);
        }
        return roots;
    }

    get exp(): Complex { return CMath.E; }
    get log(): Complex { return Complex.ZERO; }

    get asin(): Complex { return CMath.PI_BY_2; }
    get acos(): Complex { return Complex.ZERO; }
    get atan(): Complex { return CMath.PI_BY_2.div(2); }

    get acosh(): Complex { return Complex.ZERO; }
    get atanh(): Complex { return Complex.INFINITY; }
}

/**
 * The second argument *n* must be an integer.
 * 
 * Ref: 『Javaによるアルゴリズム事典』累乗 (power) Power.java
 */
function calculateIntegralPower(x: number, n: number): number {
    if(n === 0) return 1;
    return n > 0 ? nPower(x, n) : 1 / nPower(x, -n);

    function nPower(x: number, p: number): number {
        let n = p, result = 1, z = x;
        while(n != 0){
            if(n & 1) result = result * z;
            z = z * z;
            n >>= 1;
        }
        return result;
    }
}

class NegativeReal extends AbstractReal {

    constructor(readonly re: number){
        super();
        if(isNaN(re) || !isFinite(re) || re >= 0) 
            throw new Error(`An illegal argument appears: ${re}`);
    }

    get isZero(): boolean { return false; }
    get isOne(): boolean { return false; }

    get abs(): number { return -this.re; }
    get arg(): number { return Math.PI; }

    get negate(): Complex { 
        return this.re === -1 ? Complex.ONE : new PositiveReal(-this.re);
    }

    get reciprocal(): Complex {
        return this.re === -1 ? this : new NegativeReal(1/this.re);
    }

    protected intPower(n: number): Complex {
        return complex(calculateIntegralPower(this.re, n));
    }

    get sqrt(): Complex { return newImaginary(Math.sqrt(-this.re)); }

    get log(): Complex {  return complex(Math.log(-this.re), Math.PI); }

    get asin(): Complex { 
        return this.re >= -1 ?
            complex(Math.asin(this.re)):
            complex(-Math.PI/2, Math.acosh(-this.re));
    }

    get acos(): Complex { 
        return this.re >= -1 ?
            complex(Math.acos(this.re)):
            complex(Math.PI, -Math.acosh(-this.re));
    }

    get acosh(): Complex { 
        return this.re <= -1 ?
            complex(Math.acosh(-this.re), Math.PI)://todo
            complex(0, Math.acos(this.re));
    }
}

class ComplexImaginary extends FiniteComplex {

    constructor(readonly im: number){
        super();
        if(isNaN(im) || !isFinite(im) || im === 0) 
            throw new Error(`An illegal argument appears: ${im}`);
    }

    toString(): string {
        if(this.im === 1) return 'i';
        if(this.im === -1) return '-i';
        return `${this.im}i`;
    }

    get re(): number { return 0; }

    get isReal(): boolean { return false;}
    get isImaginary(): boolean { return true; }

    get isZero(): boolean { return false; }
    get isOne(): boolean { return false; }

    get isInteger(): boolean { return false; }
    get isGaussianInteger(): boolean { return Number.isInteger(this.im); }

    get abs(): number { return Math.abs(this.im); }
    get abs2(): number { return this.im * this.im; }
    get arg(): number { return this.im > 0 ? Math.PI / 2 : -Math.PI / 2; }

    get negate(): Complex { return newImaginary(-this.im); }
    get conjugate(): Complex { return newImaginary(-this.im); }
    get reciprocal(): Complex { return newImaginary(-1 / this.im); }

    plus(that: Complex | number): Complex {
        return typeof that === 'number' ?
            complex(that, this.im) :
            complex(that.re, this.im + that.im);
    }

    minus(that: Complex | number): Complex {
        return typeof that === 'number' ?
            complex(-that, this.im) :
            complex(-that.re, this.im - that.im);
    }

    times(that: Complex | number): Complex {
        return typeof that === 'number' ?
            complex(0, this.im * that) :
            complex(-this.im * that.im, this.im * that.re);
    }

    div(that: Complex | number): Complex {
        if(typeof that === 'number'){
            return complex(0, this.im / that);
        }else{
            if(that.isInfinite) return Complex.ZERO;
            if(that.isZero) return Complex.INFINITY;

            if(Math.abs(that.re) >= Math.abs(that.im)){
                const w = that.im / that.re, d = that.re + that.im * w;
                return complex(this.im * w / d, this.im / d);

            }else{
                const w = that.re / that.im, d = that.re * w + that.im;
                return complex(this.im / d, this.im * w / d);
            }
        }
    }

    protected intPower(n: number): Complex {
        const r = calculateIntegralPower(this.im, n);
        switch (n % 4) {
            case -3: return complex(0, r);
            case -2: return complex(-r);
            case -1: return complex(0, -r);
            case  0: return complex(r);
            case  1: return complex(0, r);
            case  2: return complex(-r);
            case  3: return complex(0, -r);
            default: throw new Error(`An illegal value appears: ${n%4}`);
        }
    }

    get sqrt(): Complex { 
        if(this.im >= 0){
            const w = Math.sqrt(this.im) * Math.SQRT1_2;
            return complex(w, w);
        }else{
            const w = Math.sqrt(-this.im) * Math.SQRT1_2;
            return complex(w, -w);
        }
    }

    get exp(): Complex { return complex(Math.cos(this.im), Math.sin(this.im)); }
    get log(): Complex { return complex(Math.log(this.abs), this.arg); }

    get sin(): Complex { return complex(0, Math.sinh(this.im)); }
    get cos(): Complex { return complex(Math.cosh(this.im)); }
    get tan(): Complex { return complex(0, Math.tanh(this.im)); }
    get cot(): Complex { return complex(0, -1/Math.tanh(this.im)); }

    get asin(): Complex { return complex(0, Math.asinh(this.im)); }
    get acos(): Complex { return complex(Math.PI/2, -Math.asinh(this.im)); }
    get atan(): Complex {
        return Math.abs(this.im) <= 1 ?
            complex(0, Math.atanh(this.im)):
            complex(-Math.PI/2, Math.atanh(1/this.im));
    }

    get sinh(): Complex { return complex(0, Math.sin(this.im)); }
    get cosh(): Complex { return complex(Math.cos(this.im)); }
    get tanh(): Complex { return complex(0, Math.tan(this.im)); }
    get coth(): Complex { return complex(0, -1/Math.tan(this.im)); }

    get asinh(): Complex {
        if(Math.abs(this.im) <= 1){
            return complex(0, Math.asin(this.im));
        }else if(this.im > 1){
            return complex(Math.acosh(this.im), Math.PI/2);
        }else{
            return complex(-Math.acosh(-this.im), -Math.PI/2);
        }
    }

    get acosh(): Complex { 
        return this.im >= 0 ?
            complex(Math.asinh(this.im), Math.PI/2):
            complex(-Math.asinh(this.im), -Math.PI/2);
    }

    get atanh(): Complex { return complex(0, Math.atan(this.im)); }
}

class ComplexInfinity extends Complex {

    get re(): number { return Infinity; }
    get im(): number { return Infinity; }

    toString(): string { return '∞(C)'; }

    equals(that: Complex | number, epsilon: number = 0): boolean {
        return typeof that === 'number' ?
            !isNaN(that) && !isFinite(that) :
            that.isInfinite;
    }

    isCongruentTo(that: number | Complex, m: ModArg, epsilon?: number): boolean { return false; }

    get isReal(): boolean { return false; }
    get isImaginary(): boolean { return false; }

    get isZero(): boolean { return false; }
    get isOne(): boolean { return false; }
    get isFinite(): boolean { return false;}
    get isInfinite(): boolean { return true; }
    get isNaN(): boolean { return false; }

    get isInteger(): boolean { return false; }
    get isGaussianInteger(): boolean { return false; }

    get abs(): number { return Infinity;}
    get abs2(): number { return Infinity; }
    get arg(): number { return NaN; }

    get negate(): Complex { return Complex.INFINITY; }
    get conjugate(): Complex { return Complex.INFINITY; }
    get reciprocal(): Complex { return Complex.ZERO; }

    plus(that: Complex | number): Complex {
        if(typeof that === 'number')
            return isFinite(that) ? Complex.INFINITY : Complex.NaN;
        else
            return that.isFinite ? Complex.INFINITY : Complex.NaN;
    }

    minus(that: Complex | number): Complex {
        if(typeof that === 'number')
            return isFinite(that) ? Complex.INFINITY : Complex.NaN;
        else
            return that.isFinite ? Complex.INFINITY : Complex.NaN;
    }

    times(that: Complex | number): Complex {
        if(typeof that === 'number')
            return isNaN(that) || that === 0 ? Complex.NaN : Complex.INFINITY;
        else
            return that.isNaN || that.isZero ? Complex.NaN : Complex.INFINITY;
    }

    div(that: Complex | number): Complex {
        if(typeof that === 'number')
            return isFinite(that) ? Complex.INFINITY : Complex.NaN;
        else
            return that.isFinite ? Complex.INFINITY : Complex.NaN;
    }

    pow(p: Complex | number): Complex {
        if(typeof p === 'number'){
            if(isNaN(p) || p === 0) return Complex.NaN;
            return p > 0 ? Complex.INFINITY : Complex.ZERO;
        }else{
            if(p.isNaN || p.isInfinite || p.re === 0) return Complex.NaN;
            return p.re > 0 ? Complex.INFINITY : Complex.ZERO;
        }
    }

    protected intPower(n: number): Complex {
        throw new Error("Method not implemented.");
    }

    mod(m: ModArg): Complex { return Complex.NaN; }

    get sqrt(): Complex { return Complex.INFINITY; }

    nroots(n: number): Complex[] {
        return n >= 1 ? [Complex.INFINITY] : [];
    }

    get exp(): Complex { return Complex.NaN; }
    get log(): Complex { return Complex.INFINITY; }

    get sin(): Complex { return Complex.NaN; }
    get cos(): Complex { return Complex.NaN; }
    get tan(): Complex { return Complex.NaN; }
    get cot(): Complex { return Complex.NaN; }

    get asin(): Complex { return Complex.NaN; }
    get acos(): Complex { return Complex.NaN; }
    get atan(): Complex { return Complex.NaN; }

    get sinh(): Complex { return Complex.NaN; }
    get cosh(): Complex { return Complex.NaN; }
    get tanh(): Complex { return Complex.NaN; }
    get coth(): Complex { return Complex.NaN; }

    get asinh(): Complex { return Complex.NaN; }
    get acosh(): Complex { return Complex.NaN; }
    get atanh(): Complex { return Complex.NaN; }
}

class ComplexNaN extends Complex {

    get re(): number { return NaN; }
    get im(): number { return NaN; }

    toString(): string { return 'NaN(C)'; }
    equals(that: Complex | number, epsilon: number = 0): boolean { return false; }
    isCongruentTo(that: number | Complex, m: ModArg, epsilon?: number): boolean { return false; }

    get isReal(): boolean { return false; }
    get isImaginary(): boolean { return false; }

    get isZero(): boolean { return false; }
    get isOne(): boolean { return false; }
    get isFinite(): boolean { return false;}
    get isInfinite(): boolean { return false; }
    get isNaN(): boolean { return true; }

    get isInteger(): boolean { return false; }
    get isGaussianInteger(): boolean { return false; }

    get abs(): number { return NaN;}
    get abs2(): number { return NaN; }
    get arg(): number { return NaN; }

    get negate(): Complex { return Complex.NaN; }
    get conjugate(): Complex { return Complex.NaN; }
    get reciprocal(): Complex { return Complex.NaN; }

    plus(that: Complex | number): Complex { return Complex.NaN; }
    minus(that: Complex | number): Complex { return Complex.NaN; }
    times(that: Complex | number): Complex { return Complex.NaN; }
    div(that: Complex | number): Complex { return Complex.NaN; }

    pow(p: Complex | number): Complex { return Complex.NaN; }
    protected intPower(n: number): Complex {
        throw new Error("Method not implemented.");
    }

    mod(m: ModArg): Complex { return Complex.NaN; }

    get sqrt(): Complex { return Complex.NaN; }
    nroots(n: number): Complex[] { return []; }

    get exp(): Complex { return Complex.NaN; }
    get log(): Complex { return Complex.NaN; }

    get sin(): Complex { return Complex.NaN; }
    get cos(): Complex { return Complex.NaN; }
    get tan(): Complex { return Complex.NaN; }
    get cot(): Complex { return Complex.NaN; }
    
    get asin(): Complex { return Complex.NaN; }
    get acos(): Complex { return Complex.NaN; }
    get atan(): Complex { return Complex.NaN; }

    get sinh(): Complex { return Complex.NaN; }
    get cosh(): Complex { return Complex.NaN; }
    get tanh(): Complex { return Complex.NaN; }
    get coth(): Complex { return Complex.NaN; }
    
    get asinh(): Complex { return Complex.NaN; }
    get acosh(): Complex { return Complex.NaN; }
    get atanh(): Complex { return Complex.NaN; }
}

const COMPLEX_ZERO = new ComplexZero();

const COMPLEX_ONE = new ComplexOne();
const IMAGINARY_UNIT = new ComplexImaginary(1);
const COMPLEX_MINUS_ONE = new NegativeReal(-1);
const MINUS_IMAGINARY_UNIT = new ComplexImaginary(-1);

const COMPLEX_INFINITY = new ComplexInfinity();
const COMPLEX_NAN = new ComplexNaN();

/**
 * Define functions for mathematical-style notation.
 */
export class CMath {

    private constructor(){}

    //***** CONSTANTS *****
    public static get PI(): Complex { return COMPLEX_PI; }
    public static get PI_BY_2(): Complex { return COMPLEX_PI_BY_2; }
    public static get E(): Complex { return COMPLEX_E; }

    public static get LN2(): Complex { return COMPLEX_LN2; }
    public static get LOG2E(): Complex { return COMPLEX_LOG2E; }
    public static get LN10(): Complex { return COMPLEX_LN10; }
    public static get LOG10E(): Complex { return COMPLEX_LOG10E; }
    public static get SQRT2(): Complex { return COMPLEX_SQRT2; }
    public static get SQRT1_2(): Complex { return COMPLEX_SQRT1_2; }

    //***** power and root functions *****
    static pow(z: Complex, p: Complex | number): Complex { return z.pow(p); }

    static sqrt(z: Complex): Complex { return z.sqrt; }

    //***** exp and log *****
    static exp(z: Complex): Complex { return z.exp; }
    static log(z: Complex): Complex { return z.log; }

    //***** trigonometric functions *****
    static sin(z: Complex): Complex { return z.sin; }
    static cos(z: Complex): Complex { return z.cos; }
    static tan(z: Complex): Complex { return z.tan; }

    /** Return *1/cos(x + iy)*. */
    static sec(z: Complex): Complex { return z.cos.reciprocal; }
    /** Return *1/sin(x + iy)*. */
    static csc(z: Complex): Complex { return z.sin.reciprocal; }
    /** Return *1/tan(x + iy)*. */
    static cot(z: Complex): Complex { return z.cot; }

    //***** inverse trigonometric functions *****
    static asin(z: Complex): Complex { return z.asin; }
    static acos(z: Complex): Complex { return z.acos; }
    static atan(z: Complex): Complex { return z.atan; }
    static asec(z: Complex): Complex { return z.reciprocal.acos; }
    static acsc(z: Complex): Complex { return z.reciprocal.asin; }
    static acot(z: Complex): Complex { return z.reciprocal.atan; }

    //***** hyperbolic functions *****
    static sinh(z: Complex): Complex { return z.sinh; }
    static cosh(z: Complex): Complex { return z.cosh; }
    static tanh(z: Complex): Complex { return z.tanh; }

    /** Return *1/cosh(x + iy)*. */
    static sech(z: Complex): Complex { return z.cosh.reciprocal; }
    /** Return *1/sinh(x + iy)*. */
    static csch(z: Complex): Complex { return z.sinh.reciprocal; }
    /** Return *1/tanh(x + iy)*. */
    static coth(z: Complex): Complex { return z.coth; }

    //***** inverse hyperbolic functions *****
    static asinh(z: Complex): Complex { return z.asinh; }
    static acosh(z: Complex): Complex { return z.acosh; }
    static atanh(z: Complex): Complex { return z.atanh; }
    static asech(z: Complex): Complex { return z.reciprocal.acosh; }
    static acsch(z: Complex): Complex { return z.reciprocal.asinh; }
    static acoth(z: Complex): Complex { return z.reciprocal.atanh; }
    
    private static xround(z: Complex, part: 're' | 'im' | undefined, f: (x: number) => number): Complex {
        switch(part){
            case 're': return complex(f(z.re), z.im);
            case 'im': return complex(z.re, f(z.im));
            default: return complex(f(z.re), f(z.im));
        }
    }

    static round(z: Complex, part?: 're' | 'im'): Complex {
        return this.xround(z, part, x => Math.round(x));
    }

    static ceil(z: Complex, part?: 're' | 'im'): Complex {
        return this.xround(z, part, x => Math.ceil(x));
    }

    static floor(z: Complex, part?: 're' | 'im'): Complex {
        return this.xround(z, part, x => Math.floor(x));
    }

    static fround(z: Complex, part?: 're' | 'im'): Complex {
        return this.xround(z, part, x => Math.fround(x));
    }

    static trunc(z: Complex, part?: 're' | 'im'): Complex {
        return this.xround(z, part, x => Math.trunc(x));
    }

    static sign(z: Complex): [number, number] {
        return [Math.sign(z.re), Math.sign(z.im)];
    }

    static random(): Complex {
        return complex(Math.random(), Math.random());
    }
}

const COMPLEX_PI = new PositiveReal(Math.PI);
const COMPLEX_PI_BY_2 = new PositiveReal(Math.PI / 2);
const COMPLEX_E = new PositiveReal(Math.E);

const COMPLEX_LN2 = new PositiveReal(Math.LN2);
const COMPLEX_LOG2E = new PositiveReal(Math.LOG2E);
const COMPLEX_LN10 = new PositiveReal(Math.LN10);
const COMPLEX_LOG10E = new PositiveReal(Math.LOG10E);
const COMPLEX_SQRT2 = new PositiveReal(Math.SQRT2);
const COMPLEX_SQRT1_2 = new PositiveReal(Math.SQRT1_2);