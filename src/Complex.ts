/**
 * *Complex* class represents a complex number.
 * 
 * Ref: 『Javaによるアルゴリズム事典』複素数 (complex number) Complex.java
 */
export class Complex{
    
    private readonly x: number;
    private readonly y: number;

    constructor(x: number, y: number){
        if(isNaN(x) || isNaN(y)){
            this.x = NaN;
            this.y = NaN;
            this.makeThisNaN();

        }else if(!(isFinite(x) && isFinite(y))){
            this.x = Infinity;
            this.y = Infinity;
            this.makeThisInfinity();

        }else if(x === 0 && y === 0){
            this.x = 0;
            this.y = 0;
            this.makeThisZero();

        }else{
            this.x = x;
            this.y = y;
        }
    }

    private makeThisZero(){
        this.toString = () => '0';
        this.equals = (that) => {
            if(typeof that === 'number') 
                return that === 0;
            else
                return that.re === 0 && that.im === 0;
        }
    
        this.isReal = () => true;
        this.isImaginary = () => false;
        this.isZero = () => true;
        this.isInteger = () => true;
        this.isGaussianInteger = () => true;

        this.abs = () => 0;
        this.arg = () => NaN;
        this.neg = () => Complex.ZERO;
        this.conj = () => Complex.ZERO;
        this.recip = () => Complex.INFINITY;

        this.add = (that) => {
            if(typeof that === 'number')
                return new Complex(that, 0);
            else
                return that;
        }

        this.sub = (that) => {
            if(typeof that === 'number')
                return new Complex(-that, 0);
            else
                return that.neg();
        }

        this.mul = (that) => {
            if(typeof that === 'number')
                return isFinite(that) ? Complex.ZERO : Complex.NaN;
            else
                return that.isFinite() ? Complex.ZERO : Complex.NaN;
        }

        this.div = (that) => {
            if(typeof that === 'number')
                return isNaN(that) || that === 0 ? Complex.NaN : Complex.ZERO;
            else
                return that.isNaN() || that.isZero() ? Complex.NaN : Complex.ZERO;
        }

        this.pow = (that) => {
            if(typeof that === 'number'){
                if(isNaN(that) || that === 0) return Complex.NaN;
                return that > 0 ? Complex.ZERO : Complex.INFINITY;
            }else{
                if(that.isNaN() || that.isInfinite() || that.re === 0) return Complex.NaN;
                return that.re > 0 ? Complex.ZERO : Complex.INFINITY;
            }
        }

        this.sqrt = () => Complex.ZERO;
        this.nroots = (n) => [Complex.ZERO];
    }

    private makeThisInfinity(){
        this.toString = () => '∞';
        this.equals = (that) => {
            if(typeof that === 'number')
                return !isFinite(that);
            else
                return that.isInfinite();
        }
    
        this.isReal = () => false;
        this.isImaginary = () => false;
        this.isInteger = () => false;
        this.isGaussianInteger = () => false;
        this.isFinite = () => false;
        this.isInfinite = () => true;

        this.abs = () => Infinity;
        this.arg = () => NaN;
        this.neg = () => Complex.INFINITY;
        this.conj = () => Complex.INFINITY;
        this.recip = () => Complex.ZERO;

        this.add = (that) => {
            if(typeof that === 'number')
                return isFinite(that) ? Complex.INFINITY : Complex.NaN;
            else
                return that.isFinite() ? Complex.INFINITY : Complex.NaN;
        }

        this.sub = (that) => {
            if(typeof that === 'number')
                return isFinite(that) ? Complex.INFINITY : Complex.NaN;
            else
                return that.isFinite() ? Complex.INFINITY : Complex.NaN;
        }

        this.mul = (that) => {
            if(typeof that === 'number')
                return isNaN(that) || that === 0 ? Complex.NaN : Complex.INFINITY;
            else
                return that.isNaN() || that.isZero() ? Complex.NaN : Complex.INFINITY;
        }

        this.div = (that) => {
            if(typeof that === 'number')
                return isFinite(that) ? Complex.INFINITY : Complex.NaN;
            else
                return that.isFinite() ? Complex.INFINITY : Complex.NaN;
        }

        this.pow = (that) => {
            if(typeof that === 'number'){
                if(isNaN(that) || that === 0) return Complex.NaN;
                return that > 0 ? Complex.INFINITY : Complex.ZERO;
            }else{
                if(that.isNaN() || that.isInfinite() || that.re === 0) return Complex.NaN;
                return that.re > 0 ? Complex.INFINITY : Complex.ZERO;
            }
        }

        this.sqrt = () => Complex.NaN;
        this.nroots = (n) => [];
    }

    private makeThisNaN(){
        this.toString = () => 'NaN(C)';
        this.equals = (that) => false;
    
        this.isReal = () => false;
        this.isImaginary = () => false;
        this.isInteger = () => false;
        this.isGaussianInteger = () => false;
        this.isFinite = () => false;
        this.isNaN = () => true;

        this.abs = () => NaN;
        this.arg = () => NaN;
        this.neg = () => Complex.NaN;
        this.conj = () => Complex.NaN;
        this.recip = () => Complex.NaN;

        this.add = (that) => Complex.NaN;
        this.sub = (that) => Complex.NaN;
        this.mul = (that) => Complex.NaN;
        this.div = (that) => Complex.NaN;
        this.pow = (that) => Complex.NaN;

        this.sqrt = () => Complex.NaN;
        this.nroots = (n) => [];
    }

    get re(): number { return this.x; }
    get im(): number { return this.y; }

    toString(): string {
        if(this.re === 0 && this.im === 0) return '0';
        
        const reStr = this.re !== 0 ? this.re : '';
        let imStr;
        switch (this.im) {
            case  0: imStr = ''; break;
            case  1: imStr = 'i'; break;
            case -1: imStr = '-i'; break;
            default: 
                imStr = this.im > 0 && this.re !== 0 ?
                    `+${this.im}i` :
                     `${this.im}i`;  // for the imaginary part is negative or the real part is zero
                break;
        }
        return reStr + imStr;
    }

    equals(that: Complex | number, epsilon = 0): boolean {
        if(typeof that === 'number'){
            if(isNaN(that)) return false;
            return this.im === 0 && Math.abs(this.re - that) <= epsilon;
        }else{
            if(that.isNaN()) return false;
            return Math.abs(this.re - that.re) <= epsilon &&
                        Math.abs(this.im - that.im) <= epsilon;
        }
    }

    isReal() { return this.im === 0; }
    isImaginary() { return this.re === 0 && this.im !== 0; }
    isZero() { return false; }  // overridden in Zero, NaN, and Infinity
    isInteger() { return this.isReal() && Number.isInteger(this.re); }
    isGaussianInteger() { return Number.isInteger(this.re) && Number.isInteger(this.im); }
    isFinite() { return true; }  // overridden in Zero, NaN, and Infinity
    isInfinite() { return false; }  // overridden in Zero, NaN, and Infinity
    isNaN() { return false; }  // overridden in Zero, NaN, and Infinity

    /**
     * Return *√(x² + y²)*.
     */
    abs(): number {
        return Math.hypot(this.re, this.im);
    }

    /**
     * Return *atan(y/x)*.
     */
    arg(): number {  // overridden in NaN and Infinity
        if(this.re === 0 && this.im === 0)
            return NaN;
        else
            return Math.atan2(this.im, this.re);
    }

    /**
     * Return the negate value (additive inverse element)*- x - iy*.
     */
    neg(): Complex {
        return new Complex(-this.re, -this.im);
    }

    /**
     * Return the complex conjugate *x - iy*.
     */
    conj(): Complex {
        return new Complex(this.re, -this.im);
    }

    /**
     * Return the reciprocal value (multiplicative inverse element) *(x - iy)/(x² + y²)*.
     */
    recip(): Complex {
        if(Math.abs(this.re) >= Math.abs(this.im)){
            const w = this.im / this.re, d = this.re + this.im * w;
            return new Complex(1 / d, - w / d);
        }else{
            const w = this.re / this.im, d = this.re * w + this.im;
            return new Complex(w / d, -1 / d);
        }
    }

    /**
     * Return *(x₁ + iy₁) + (x₂ + iy₂) = (x₁ + x₂) + i(y₁ + y₂)*.
     */
    add(that: Complex | number): Complex {
        if(typeof that === 'number'){
            if(isFinite(that)){
                return new Complex(this.re + that, this.im);
            }else{
                return isNaN(that) ? Complex.NaN : Complex.INFINITY;
            }
        }else{
            if(this.isFinite()){
                return new Complex(this.re + that.re, this.im + that.im);
            }else{
                return that.isNaN() ? Complex.NaN : Complex.INFINITY;
            }
        }
    }

    /**
     * Return *(x₁ + iy₁) - (x₂ + iy₂) = (x₁ - x₂) + i(y₁ - y₂)*.
     */
    sub(that: Complex | number): Complex {
        if(typeof that === 'number'){
            if(isFinite(that)){
                return new Complex(this.re - that, this.im);
            }else{
                return isNaN(that) ? Complex.NaN : Complex.INFINITY;
            }
        }else{
            if(this.isFinite()){
                return new Complex(this.re - that.re, this.im - that.im);
            }else{
                return that.isNaN() ? Complex.NaN : Complex.INFINITY;
            }
        }
    }

    /**
     * Return *(x₁ + iy₁) * (x₂ + iy₂) = (x₁x₂ - y₁y₂) + i(x₁y₂ + y₁x₂)*.
     */
    mul(that: Complex | number): Complex {
        if(typeof that === 'number'){
            if(isFinite(that)){
                return new Complex(this.re * that, this.im * that);
            }else{
                return isNaN(that) || this.equals(Complex.ZERO) ? Complex.NaN : Complex.INFINITY;
            }
        }else{
            if(that.isFinite()){
                return new Complex(this.re * that.re - this.im * that.im,
                                   this.re * that.im + this.im * that.re);
            }else{
                return that.isNaN() || this.equals(Complex.ZERO) ? Complex.NaN : Complex.INFINITY;
            }
        }
    }

    /**
     * Return *(x₁ + iy₁) / (x₂ + iy₂) = ((x₁x₂ + y₁y₂) + (- x₁y₂ + iy₁x₂)) / (x₂² + y₂²)*.
     */
    div(that: Complex | number): Complex {
        if(typeof that === 'number'){
            return new Complex(this.re / that, this.im / that);
        }else{
            if(that.isZero()){
                return Complex.INFINITY;

            }else if(that.isInfinite()){
                return Complex.ZERO;

            }else if(Math.abs(that.re) >= Math.abs(that.im)){
                const w = that.im / that.re, d = that.re + that.im * w;
                return new Complex((this.re + this.im * w) / d, (this.im - this.re * w) / d);

            }else{
                const w = that.re / that.im, d = that.re * w + that.im;
                return new Complex((this.re * w + this.im) / d, (this.im * w - this.re) / d);
            }
        }
    }

    /**
     * Return a power of this complex number.
     * *z.pow(w)* returns *z^w = exp(w log z)*.
     * 
     * Note:
     *   *z.pow(±Infinity)* can return 0, 1, ±Infinity, or NaN as Complex object.
     *   *z.pow(Complex.INFINITY)* returns *Complex.ONE* if this is *Complex.ONE*
     *    or otherwise *Complex.NaN*.
     */
    pow(that: Complex | number): Complex {
        if(typeof that === 'number'){
            if(isNaN(that)) return Complex.NaN;
            if(!isFinite(that)){
                const r = this.abs();
                if(r === 1){
                    return this.arg() === 0 ? Complex.ONE : Complex.NaN;
                }else if(r > 1){
                    return that > 0 ? Complex.INFINITY : Complex.ZERO;
                }else{
                    return that > 0 ? Complex.ZERO : Complex.INFINITY;
                }
            }

            if(Number.isInteger(that)) return intPower(this, that);
            return this.log().mul(that).exp();

        }else{
            if(that.isNaN()) return Complex.NaN;
            if(that.isInfinite())
                return this.equals(Complex.ONE) ? Complex.ONE : Complex.NaN;
        
            if(that.isInteger()) return intPower(this, that.re);
            return this.log().mul(that).exp();
        }
        
        /**
         * Ref: 『Javaによるアルゴリズム事典』累乗 (power) Power.java
         */
        function intPower(x: Complex, n: number): Complex {
            if(n === 0) return Complex.ONE;
            return n >= 0 ? nPower(x, n) :
                            nPower(x, -n).recip();

            function nPower(x: Complex, power: number): Complex {
                let n = power, result = Complex.ONE, z = x;
                while(n != 0){
                    if(n & 1) result = result.mul(z);
                    z = z.mul(z);
                    n >>= 1;
                }
                return result;
            }
        }
    }

    exp(): Complex {
        const r = Math.exp(this.re);
        return new Complex(r * Math.cos(this.im), r * Math.sin(this.im));
    }

    log(): Complex {
        return new Complex(Math.log(this.re * this.re + this.im * this.im) / 2,
                           Math.atan2(this.im, this.re));
    }

    /**
     * Return *sin(x + iy) = sin x cosh y + i cos x sinh y*.
     */
    sin(): Complex {
        return new Complex(Math.sin(this.re) * Math.cosh(this.im),
                           Math.cos(this.re) * Math.sinh(this.im));
    }

    /**
     * Return *cos(x + iy) = cos x cosh y - i sin x sinh y*.
     */
    cos(): Complex {
        return new Complex(Math.cos(this.re) * Math.cosh(this.im),
                          -Math.sin(this.re) * Math.sinh(this.im));
    }

    /**
     * Return *tan(x + iy) = (sin 2x + i sinh 2y) / (cos 2x + cosh 2y)*.
     */
    tan(): Complex {
        const d = Math.cos(2 * this.re) + Math.cosh(2 * this.im);
        return new Complex(Math.sin(2 * this.re) / d,
                           Math.sinh(2 * this.im) / d);
    }

    /**
     * Return *1/cos(x + iy)*.
     */
    sec(): Complex { return this.cos().recip(); }

    /**
     * Return *1/sin(x + iy)*.
     */
    csc(): Complex { return this.sin().recip(); }

    /**
     * Return *cot(x + iy) = -(sin 2x - i sinh 2y) / (cos 2x - cosh 2y)*.
     */
    cot(): Complex {
        const d = Math.cos(2 * this.re) - Math.cosh(2 * this.im);
        return new Complex(-Math.sin(2 * this.re) / d,
                           Math.sinh(2 * this.im) / d);
    }

    /**
     * Return *sinh(x + iy) = sinh x cos y + i cosh x sin y*.
     */
    sinh(): Complex {
        return new Complex(Math.sinh(this.re) * Math.cos(this.im),
                           Math.cosh(this.re) * Math.sin(this.im));
    }

    /**
     * Return *cosh(x + iy) = cosh x cos y + i sinh x sin y*.
     */
    cosh(): Complex {
        return new Complex(Math.cosh(this.re) * Math.cos(this.im),
                          Math.sinh(this.re) * Math.sin(this.im));
    }

    /**
     * Return *tanh(x + iy) = (sinh 2x + i sin 2y) / (cosh 2x + cos 2y)*.
     */
    tanh(): Complex {
        const d = Math.cosh(2 * this.re) + Math.cos(2 * this.im);
        return new Complex(Math.sinh(2 * this.re) / d,
                           Math.sin(2 * this.im) / d);
    }

    /**
     * Return *1/cosh(x + iy)*.
     */
    sech(): Complex { return this.cosh().recip(); }

    /**
     * Return *1/sinh(x + iy)*.
     */
    csch(): Complex { return this.sinh().recip(); }

    /**
     * Return *coth(x + iy) = (sinh 2x - i sin 2y) / (cosh 2x - cos 2y)*.
     */
    coth(): Complex {
        const d = Math.cosh(2 * this.re) - Math.cos(2 * this.im);
        return new Complex(Math.sinh(2 * this.re) / d,
                           -Math.sin(2 * this.im) / d);
    }

    /**
     * Return *√(x + iy) = √(r + x)/2 + i√(r - x)/2*.
     */
    sqrt(): Complex {
        const r = this.abs(), w = Math.sqrt(r + Math.abs(this.re));
        if(this.re >= 0){
            return new Complex(Math.SQRT1_2 * w, Math.SQRT1_2 * this.im / w);
        }else{
            return new Complex(Math.SQRT1_2 * Math.abs(this.im) / w,
                               this.im >= 0 ? Math.SQRT1_2 * w : -Math.SQRT1_2 * w);
        }
    }

    /**
     * Return *n*-th roots.
     */
    nroots(n: number): Complex[] {
        const r = Math.pow(this.abs(), 1/n), arg = this.arg() / n;
        const roots = new Array<Complex>(n);
        for(let i = 0; i < n; i++){
            roots[i] = Complex.ofPolar(r, arg + 2*i*Math.PI/n);
        }
        return roots;
    }

    public static readonly ZERO = new Complex(0, 0);
    public static readonly ONE = new Complex(1, 0);
    public static readonly I = new Complex(0, 1);
    public static readonly MINUS_ONE = new Complex(-1, 0);
    public static readonly MINUS_I = new Complex(0, -1);

    public static readonly PI = new Complex(Math.PI, 0);
    public static readonly E = new Complex(Math.E, 0);

    public static readonly INFINITY = new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    public static readonly NaN = new Complex(NaN, NaN);

    static ofPolar(r: number, theta: number): Complex {
        return new Complex(r * Math.cos(theta), r * Math.sin(theta));
    }
}

/**
 * Define functions for mathematical-style notation.
 */
export class CMath {

    private constructor(){}

    static exp(x: Complex): Complex { return x.exp(); }
    static log(x: Complex): Complex { return x.log(); }

    static sin(x: Complex): Complex { return x.sin(); }
    static cos(x: Complex): Complex { return x.cos(); }
    static tan(x: Complex): Complex { return x.tan(); }
    static sec(x: Complex): Complex { return x.sec(); }
    static csc(x: Complex): Complex { return x.csc(); }
    static cot(x: Complex): Complex { return x.cot(); }

    static sinh(x: Complex): Complex { return x.sinh(); }
    static cosh(x: Complex): Complex { return x.cosh(); }
    static tanh(x: Complex): Complex { return x.tanh(); }
    static sech(x: Complex): Complex { return x.sech(); }
    static csch(x: Complex): Complex { return x.csch(); }
    static coth(x: Complex): Complex { return x.coth(); }

    static sqrt(x: Complex): Complex { return x.sqrt(); }
    // static cbrt(x: Complex): Complex { return x.cbrt(); }
}