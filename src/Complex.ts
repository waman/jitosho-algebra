export function complex(re: number, im: number = 0): Complex {
    if(isNaN(re) || isNaN(im)) return Complex.NaN;
    if(!(isFinite(re) && isFinite(im))) return Complex.INFINITY;

    if(im === 0){
        switch (re) {
            case 0: return Complex.ZERO;
            case 1: return Complex.ONE;
            case -1: return Complex.MINUS_ONE;
            default: return new ComplexReal(re);
        }
    }

    if(re === 0){
        switch(im){
            case 1: return Complex.I;
            case -1: return Complex.MINUS_I;
            default: return new ComplexImaginary(im);
        }
    }

    return new ComplexImpl(re, im);
}

/**
 * *Complex* class represents a complex number.
 * *Complex* class can be instantiated by the *complex()* function.
 * 
 * boolean and numerical properties (like *isReal*, *abs*, e.t.c.) are defined as getter,
 * so parenthesis is not needed. While unary operators (like *negate()*, *conjugate()*, and *reciprocal()*),
 * these generate a new *Complex* object, need parenthesis.
 * 
 * For arithmetic operations are defined as *plus*, *minus*, *times*, and *div*.
 * 
 * 
 * Ref: 『Javaによるアルゴリズム事典』複素数 (complex number) Complex.java
 */
export abstract class Complex{

    abstract get re(): number
    abstract get im(): number

    toString(): string {
        if(this.isNaN) return 'NaN(C)';
        if(this.isInfinite) return '∞';
        if(this.isReal) return this.re.toString();
        if(this.isImaginary){
            if(this.im === 1) return 'i';
            if(this.im === -1) return '-i';
            return this.im.toString() + 'i';
        }
        
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

    equals(that: Complex | number, epsilon = 0): boolean {
        if(typeof that === 'number'){
            if(isNaN(that)) return false;
            return this.im === 0 && Math.abs(this.re - that) <= epsilon;
        }else{
            if(that.isNaN) return false;
            return Math.abs(this.re - that.re) <= epsilon &&
                        Math.abs(this.im - that.im) <= epsilon;
        }
    }

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
     * Return *atan(y/x)*.
     */
    abstract  get arg(): number

    /**
     * Return the negate value (additive inverse element)*- x - iy*.
     */
    abstract negate(): Complex

    /**
     * Return the complex conjugate *x - iy*.
     */
    abstract conjugate(): Complex

    /**
     * Return the reciprocal value (multiplicative inverse element) *(x - iy)/(x² + y²)*.
     */
    abstract reciprocal(): Complex

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
    pow(that: Complex | number): Complex {
        if(typeof that === 'number'){
            if(!isFinite(that)){
                if(isNaN(that)) return Complex.NaN;
                const r = this.abs;
                if(r > 1){
                    return that > 0 ? Complex.INFINITY : Complex.ZERO;
                }else if(r < 1){
                    return that > 0 ? Complex.ZERO : Complex.INFINITY;
                }else{  // r === 1
                    return this.isOne ? Complex.ONE : Complex.NaN;
                }
            }

            if(Number.isInteger(that)) return this.intPower(that);
            return this.complexPower(that);

        }else{
            if(!that.isFinite){
                if(that.isNaN) return Complex.NaN;
                return this.isOne ? Complex.ONE : Complex.NaN;
            }

            if(that.isInteger) return this.intPower(that.re);
            return this.complexPower(that);
        }
    }

    protected abstract intPower(n: number): Complex
    protected complexPower(power: Complex | number): Complex {
        return this.log().times(power).exp();
    }

    abstract exp(): Complex

    abstract log(): Complex

    /**
     * Return *sin(x + iy) = sin x cosh y + i cos x sinh y*.
     */
    abstract sin(): Complex

    /**
     * Return *cos(x + iy) = cos x cosh y - i sin x sinh y*.
     */
    abstract cos(): Complex

    /**
     * Return *tan(x + iy) = (sin 2x + i sinh 2y) / (cos 2x + cosh 2y)*.
     */
    abstract tan(): Complex
    
    /** Return *cot(x + iy) = -(sin 2x - i sinh 2y) / (cos 2x - cosh 2y)*. */
    cot(): Complex { return this.tan().reciprocal(); }

    /**
     * Return *sinh(x + iy) = sinh x cos y + i cosh x sin y*.
     */
    abstract sinh(): Complex

    /**
     * Return *cosh(x + iy) = cosh x cos y + i sinh x sin y*.
     */
    abstract cosh(): Complex

    /**
     * Return *tanh(x + iy) = (sinh 2x + i sin 2y) / (cosh 2x + cos 2y)*.
     */
    abstract tanh(): Complex
    
    /** Return *coth(x + iy) = (sinh 2x - i sin 2y) / (cosh 2x - cos 2y)*. */
    coth(): Complex { return this.tanh().reciprocal(); }

    /**
     * Return *√(x + iy) = √(r + x)/2 + i√(r - x)/2*.
     */
    abstract sqrt(): Complex

    /**
     * Return *n*-th roots.
     */
    nroots(n: number): Complex[] {
        if(n <= 0) return [];
        if(n === 1) return [this];
        if(n === 2){
            const thisSqrt = this.sqrt();
            return [thisSqrt, thisSqrt.negate()];
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

    public static get ZERO(): Complex { return COMPLEX_ZERO; }
    public static get ONE(): Complex { return COMPLEX_ONE; }
    public static get I(): Complex { return IMAGINARY_UNIT; }
    public static get MINUS_ONE(): Complex { return COMPLEX_MINUS_ONE; }
    public static get MINUS_I(): Complex { return MINUS_IMAGINARY_UNIT; }

    public static get INFINITY(): Complex { return COMPLEX_INFINITY; }
    public static get NaN(): Complex { return COMPLEX_NAN; }

    static ofPolar(r: number, theta: number): Complex {
        return complex(r * Math.cos(theta), r * Math.sin(theta));
    }
}

/**
 * This complex number must not be real, (pure) imaginary, infinity, and NaN.
 */
class ComplexImpl extends Complex {

    constructor(readonly re: number, readonly im: number){
        super();
        if(!(isFinite(re) && isFinite(im)))
            throw new Error(`An illegal argument appears: ${re}+${im}i`);
        if(re === 0 || im === 0)
            throw new Error(`An illegal argument appears: ${re}+${im}i`);
    }

    get isReal() { return this.im === 0; }
    get isImaginary() { return this.re === 0; }
    get isZero() { return false; }
    get isOne() { return false; }
    get isFinite() { return true; }
    get isInfinite() { return false; }
    get isNaN() { return false; }

    get isInteger() { return this.isReal && Number.isInteger(this.re); }
    get isGaussianInteger() { return Number.isInteger(this.re) && Number.isInteger(this.im); }

    get abs(): number { return Math.hypot(this.re, this.im); }
    get arg(): number { return Math.atan2(this.im, this.re); }

    negate(): Complex { return complex(-this.re, -this.im); }
    conjugate(): Complex { return complex(this.re, -this.im); }

    reciprocal(): Complex {
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
                        nPower(this, -n).reciprocal();
    
        function nPower(x: Complex, power: number): Complex {
            let n = power, result = Complex.ONE, z = x;
            while(n != 0){
                if(n & 1) result = result.times(z);
                z = z.times(z);
                n >>= 1;
            }
            return result;
        }
    }

    exp(): Complex {
        const r = Math.exp(this.re);
        return complex(r * Math.cos(this.im), r * Math.sin(this.im));
    }

    log(): Complex {
        return complex(Math.log(this.re * this.re + this.im * this.im) / 2,
                       Math.atan2(this.im, this.re));
    }

    sin(): Complex {
        return complex(Math.sin(this.re) * Math.cosh(this.im),
                       Math.cos(this.re) * Math.sinh(this.im));
    }

    cos(): Complex {
        return complex(Math.cos(this.re) * Math.cosh(this.im),
                      -Math.sin(this.re) * Math.sinh(this.im));
    }

    tan(): Complex {
        const d = Math.cos(2 * this.re) + Math.cosh(2 * this.im);
        return complex(Math.sin(2 * this.re) / d,
                       Math.sinh(2 * this.im) / d);
    }

    sinh(): Complex {
        return complex(Math.sinh(this.re) * Math.cos(this.im),
                       Math.cosh(this.re) * Math.sin(this.im));
    }

    cosh(): Complex {
        return complex(Math.cosh(this.re) * Math.cos(this.im),
                       Math.sinh(this.re) * Math.sin(this.im));
    }

    tanh(): Complex {
        const d = Math.cosh(2 * this.re) + Math.cos(2 * this.im);
        return complex(Math.sinh(2 * this.re) / d,
                       Math.sin(2 * this.im) / d);
    }

    sqrt(): Complex {
        const r = this.abs, w = Math.sqrt(r + Math.abs(this.re));
        if(this.re >= 0){
            return complex(Math.SQRT1_2 * w, Math.SQRT1_2 * this.im / w);
        }else{
            return complex(Math.SQRT1_2 * Math.abs(this.im) / w,
                               this.im >= 0 ? Math.SQRT1_2 * w : -Math.SQRT1_2 * w);
        }
    }
}

abstract class AbstractReal extends Complex {

    get im(): number { return 0; }

    toString(): string { return this.re.toString(); }

    get isReal(): boolean { return true; }
    get isImaginary(): boolean { return false; }
    get isZero(): boolean { return this.re === 0; }
    get isOne(): boolean { return this.re === 1; }
    get isFinite(): boolean { return true; }
    get isInfinite(): boolean { return false; }
    get isNaN(): boolean { return false; }

    get isGaussianInteger(): boolean { return this.isInteger; }

    conjugate(): Complex { return this; }

    plus(that: Complex | number): Complex {
        return typeof that === 'number' ?
            complex(this.re + that) :
            complex(this.re + that.re, that.im);
    }

    minus(that: Complex | number): Complex {
        return typeof that === 'number' ?
            complex(this.re - that, 0) : 
            complex(this.re - that.re, -that.im);
    }

    exp(): Complex { return complex(Math.exp(this.re)); }

    sin(): Complex { return complex(Math.sin(this.re)); }
    cos(): Complex { return complex(Math.cos(this.re)); }
    tan(): Complex { return complex(Math.tan(this.re)); }
    sinh(): Complex { return complex(Math.sinh(this.re)); }
    cosh(): Complex { return complex(Math.cosh(this.re)); }
    tanh(): Complex { return complex(Math.tanh(this.re)); }
}

class ComplexZero extends AbstractReal {

    get re(): number { return 0; }

    toString(): string { return '0'; }

    get isZero(): boolean { return true; }
    get isOne(): boolean { return false; }

    get isInteger(): boolean { return true; }
    get isGaussianInteger(): boolean { return true; }

    get abs(): number { return 0; }
    get arg(): number { return NaN; }

    negate(): Complex { return Complex.ZERO; }
    reciprocal(): Complex { return Complex.INFINITY; }

    plus(that: Complex | number): Complex {
        return typeof that === 'number' ? complex(that, 0) : that;
    }

    minus(that: Complex | number): Complex {
        return typeof that === 'number' ? complex(-that, 0) : that.negate();
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

    pow(that: Complex | number): Complex {
        if(typeof that === 'number'){
            if(isNaN(that) || that === 0) return Complex.NaN;
            return that > 0 ? Complex.ZERO : Complex.INFINITY;
        }else{
            if(that.isNaN || that.isInfinite || that.re === 0) return Complex.NaN;
            return that.re > 0 ? Complex.ZERO : Complex.INFINITY;
        }
    }

    protected intPower(n: number): Complex {
        throw new Error("Method not implemented.");
    }

    exp(): Complex { return Complex.ONE; }
    log(): Complex { return Complex.NaN; }

    sin(): Complex { return Complex.ZERO; }
    cos(): Complex { return Complex.ONE; }
    tan(): Complex { return Complex.ZERO; }

    sinh(): Complex { return Complex.ZERO; }
    cosh(): Complex { return Complex.ONE; }
    tanh(): Complex { return Complex.ZERO; }

    sqrt(): Complex { return Complex.ZERO; }
    nroots(n: number): Complex[] { return n >= 1 ? [Complex.ZERO] : []; }
};

class ComplexOne extends AbstractReal {

    get re(): number { return 1; }

    toString(): string { return '1'; }

    get isZero(): boolean { return false; }
    get isOne(): boolean { return true; }

    get isInteger(): boolean { return true; }
    get isGaussianInteger(): boolean { return true; }

    get abs(): number { return 1; }
    get arg(): number { return 0; }

    negate(): Complex { return Complex.MINUS_ONE; }
    reciprocal(): Complex { return this; }

    times(that: Complex | number): Complex {
        return typeof that === 'number' ? complex(that, 0) : that;
    }

    div(that: Complex | number): Complex {
        return typeof that === 'number' ? complex(1/that, 0) : that.reciprocal();
    }

    pow(that: Complex | number): Complex {
        if(typeof that === 'number')
            return isNaN(that) ? Complex.NaN : Complex.ONE;
        else
            return that.isNaN ? Complex.NaN : Complex.ONE;
    }

    protected intPower(n: number): Complex {
        throw new Error("Method not implemented.");
    }

    exp(): Complex { return CMath.E; }
    log(): Complex { return Complex.ZERO; }

    sqrt(): Complex { return Complex.ONE; }

    nroots(n: number): Complex[] {
        if(n <= 0) return [];
        if(n === 1) return [Complex.ONE];
        if(n === 2) return [Complex.ONE, Complex.MINUS_ONE];

        const phi = 2*Math.PI/n;
        const roots = new Array<Complex>(n);
        for(let i = 0; i < n; i++){
            roots[i] = Complex.ofPolar(1, i*phi);
        }
        return roots;
    }
}

/**
 * The second argument *n* must be an integer.
 * 
 * Ref: 『Javaによるアルゴリズム事典』累乗 (power) Power.java
 */
function calculateIntegralPower(x: number, n: number): number {
    if(n === 0) return 1;
    return n > 0 ? nPower(x, n) :
                   1 / nPower(x, -n);

    function nPower(x: number, power: number): number {
        let n = power, result = 1, z = x;
        while(n != 0){
            if(n & 1) result = result * z;
            z = z * z;
            n >>= 1;
        }
        return result;
    }
}

/**
 * This complex must not be zero, one(, pure imaginary), infinity, and NaN.
 */
class ComplexReal extends AbstractReal {

    constructor(readonly re: number){
        super();
        if(isNaN(re) || !isFinite(re) || re === 0 || re === 1) 
            throw new Error(`An illegal argument appears: ${re}`);
    }

    get isZero(): boolean { return false; }
    get isOne(): boolean { return false; }
    get isInteger(): boolean { return Number.isInteger(this.re); }

    get abs(): number { return Math.abs(this.re); }
    get arg(): number { 
        return this.re > 0 ? 0 : Math.PI; 
    }

    negate(): Complex { return complex(-this.re); }
    reciprocal(): Complex { return new ComplexReal(1/this.re); }

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

    protected complexPower(power: Complex | number): Complex {
        if(typeof power === 'number') return realPower(this.re, power);
        if(power.isReal) return realPower(this.re, power.re);
        return super.complexPower(power);
        
        function realPower(x: number, n: number): Complex { return complex(Math.pow(x, n)); }
    }

    log(): Complex { 
        // always this.re !== 0
        return this.re > 0 ? complex(Math.log(this.re)) :
                             complex(Math.log(-this.re), Math.PI);
    }

    sqrt(): Complex { 
        return this.re > 0 ? 
            new ComplexReal(Math.sqrt(this.re)) :
            new ComplexImaginary(Math.sqrt(-this.re)) 
    }
}

class ComplexImaginary extends Complex {

    constructor(readonly im: number){
        super();
        if(isNaN(im) || !isFinite(im) || im === 0) 
            throw new Error(`An illegal argument appears: ${im}`);
    }

    get re(): number { return 0; }

    get isReal(): boolean { return false;}
    get isImaginary(): boolean { return true; }

    get isZero(): boolean { return false; }
    get isOne(): boolean { return false; }
    get isFinite(): boolean { return true;}
    get isInfinite(): boolean { return false;}
    get isNaN(): boolean { return false;}

    get isInteger(): boolean { return false; }
    get isGaussianInteger(): boolean { return Number.isInteger(this.im); }

    get abs(): number { return Math.abs(this.im); }
    get arg(): number { return this.im > 0 ? Math.PI / 2 : -Math.PI / 2; }

    negate(): Complex { return new ComplexImaginary(-this.im); }
    conjugate(): Complex { return new ComplexImaginary(-this.im); }
    reciprocal(): Complex { return new ComplexImaginary(-1 / this.im); }

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
            case 0: return complex(r);
            case 1: return complex(0, r);
            case 2: return complex(-r);
            case 3: return complex(0, -r);
            default: return Complex.NaN;
        }
    }

    exp(): Complex { return complex(Math.cos(this.im), Math.sin(this.im)); }
    log(): Complex { return complex(Math.log(this.abs), this.arg); }

    sin(): Complex { return complex(0, Math.sinh(this.im)); }
    cos(): Complex { return complex(Math.cosh(this.im)); }
    tan(): Complex { return complex(0, Math.tanh(this.im)); }
    sinh(): Complex { return complex(0, Math.sin(this.im)); }
    cosh(): Complex { return complex(Math.cos(this.im)); }
    tanh(): Complex { return complex(0, Math.tan(this.im)); }

    sqrt(): Complex { 
        const w = Math.sqrt(this.abs);
        return complex(Math.SQRT1_2 * w, Math.SQRT1_2 * this.im / w);
    }
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
    get arg(): number { return NaN; }

    negate(): Complex { return Complex.INFINITY; }
    conjugate(): Complex { return Complex.INFINITY; }
    reciprocal(): Complex { return Complex.ZERO; }

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

    pow(that: Complex | number): Complex {
        if(typeof that === 'number'){
            if(isNaN(that) || that === 0) return Complex.NaN;
            return that > 0 ? Complex.INFINITY : Complex.ZERO;
        }else{
            if(that.isNaN || that.isInfinite || that.re === 0) return Complex.NaN;
            return that.re > 0 ? Complex.INFINITY : Complex.ZERO;
        }
    }

    protected intPower(n: number): Complex {
        throw new Error("Method not implemented.");
    }

    exp(): Complex { return Complex.INFINITY; }
    log(): Complex { return Complex.INFINITY; }

    sin(): Complex { return Complex.INFINITY; }
    cos(): Complex { return Complex.INFINITY; }
    tan(): Complex { return Complex.INFINITY; }

    sinh(): Complex { return Complex.INFINITY; }
    cosh(): Complex { return Complex.INFINITY; }
    tanh(): Complex { return Complex.INFINITY; }

    sqrt(): Complex { return Complex.INFINITY; }

    nroots(n: number): Complex[] {
        return n >= 1 ? [Complex.INFINITY] : [];
    }

}

class ComplexNaN extends Complex {

    get re(): number { return NaN; }
    get im(): number { return NaN; }

    toString(): string { return 'NaN(C)'; }
    equals(that: Complex | number, epsilon: number = 0): boolean { return false; }

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
    get arg(): number { return NaN; }

    negate(): Complex { return Complex.NaN; }
    conjugate(): Complex { return Complex.NaN; }
    reciprocal(): Complex { return Complex.NaN; }

    plus(that: Complex | number): Complex { return Complex.NaN; }
    minus(that: Complex | number): Complex { return Complex.NaN; }
    times(that: Complex | number): Complex { return Complex.NaN; }
    div(that: Complex | number): Complex { return Complex.NaN; }

    pow(that: Complex | number): Complex { return Complex.NaN; }
    protected intPower(n: number): Complex {
        throw new Error("Method not implemented.");
    }

    exp(): Complex { return Complex.NaN; }
    log(): Complex { return Complex.NaN; }

    sin(): Complex { return Complex.NaN; }
    cos(): Complex { return Complex.NaN; }
    tan(): Complex { return Complex.NaN; }

    sinh(): Complex { return Complex.NaN; }
    cosh(): Complex { return Complex.NaN; }
    tanh(): Complex { return Complex.NaN; }

    sqrt(): Complex { return Complex.NaN; }
    nroots(n: number): Complex[] { return []; }
}

const COMPLEX_ZERO = new ComplexZero();

const COMPLEX_ONE = new ComplexOne();
const IMAGINARY_UNIT = new ComplexImaginary(1);
const COMPLEX_MINUS_ONE = new ComplexReal(-1);
const MINUS_IMAGINARY_UNIT = new ComplexImaginary(-1);

const COMPLEX_INFINITY = new ComplexInfinity();
const COMPLEX_NAN = new ComplexNaN();

/**
 * Define functions for mathematical-style notation.
 */
export class CMath {

    private constructor(){}

    public static get PI(): Complex { return COMPLEX_PI; }
    public static get E(): Complex { return COMPLEX_E; }

    public static get LN2(): Complex { return COMPLEX_LN2; }
    public static get LOG2E(): Complex { return COMPLEX_LOG2E; }
    public static get LN10(): Complex { return COMPLEX_LN10; }
    public static get LOG10E(): Complex { return COMPLEX_LOG10E; }
    public static get SQRT2(): Complex { return COMPLEX_SQRT2; }
    public static get SQRT1_2(): Complex { return COMPLEX_SQRT1_2; }

    static exp(z: Complex): Complex { return z.exp(); }
    static log(z: Complex): Complex { return z.log(); }

    static pow(z: Complex, w: Complex | number): Complex { return z.pow(w); }

    static sin(z: Complex): Complex { return z.sin(); }
    static cos(z: Complex): Complex { return z.cos(); }
    static tan(z: Complex): Complex { return z.tan(); }

    /** Return *1/cos(x + iy)*. */
    static sec(z: Complex): Complex { return z.cos().reciprocal(); }
    /** Return *1/sin(x + iy)*. */
    static csc(z: Complex): Complex { return z.sin().reciprocal(); }
    /** Return *1/tan(x + iy)*. */
    static cot(z: Complex): Complex { return z.cot(); }

    static sinh(z: Complex): Complex { return z.sinh(); }
    static cosh(z: Complex): Complex { return z.cosh(); }
    static tanh(z: Complex): Complex { return z.tanh(); }

    /** Return *1/cosh(x + iy)*. */
    static sech(z: Complex): Complex { return z.cosh().reciprocal(); }
    /** Return *1/sinh(x + iy)*. */
    static csch(z: Complex): Complex { return z.sinh().reciprocal(); }
    /** Return *1/tanh(x + iy)*. */
    static coth(z: Complex): Complex { return z.coth(); }

    static sqrt(z: Complex): Complex { return z.sqrt(); }
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

const COMPLEX_PI = new ComplexReal(Math.PI);
const COMPLEX_E = new ComplexReal(Math.E);

const COMPLEX_LN2 = new ComplexReal(Math.LN2);
const COMPLEX_LOG2E = new ComplexReal(Math.LOG2E);
const COMPLEX_LN10 = new ComplexReal(Math.LN10);
const COMPLEX_LOG10E = new ComplexReal(Math.LOG10E);
const COMPLEX_SQRT2 = new ComplexReal(Math.SQRT2);
const COMPLEX_SQRT1_2 = new ComplexReal(Math.SQRT1_2);