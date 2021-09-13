import { Complex } from "./Complex";

/**
 * CubicEquation class can be instantiated by the static *new* method.
 */
export abstract class CubicEquation {

    abstract get a(): number;
    abstract get b(): number;
    abstract get c(): number;
    abstract get d(): number;

    /** *(3ac - b²)/3a²* */
    abstract get p(): number;
    /** *(2b³ - 9abc + 27a²d)/27a³* */
    abstract get q(): number;

    /**
     * Return a value of *ax³ + bx² + cx + d* with the specified *x*.
     */
    abstract f(x: number): number;

    /**
     * Return the discriminant *-(4p³ + 27q²)* = *a⁴(r₁ - r₂)²(r₂ - r₃)²(r₃ - r₁)²*,
     * where *r*s are the three roots of this cubic equation.
     */
    abstract get discriminant(): number;

    /**
     * Return the cubic equation *x³ + px + q = 0*.
     */
    abstract depressed(): CubicEquation;

    abstract realRoots(): number[];
    // abstract complexRoots(): Complex[]

    toString(): string {
        return cubicTerm(this.a) + lowerTerm(this.b, 2) + 
                lowerTerm(this.c, 1) + constTerm(this.d) + ' = 0';

        function cubicTerm(a: number): string {
            switch (a) {
                case  1: return 'x³';
                case -1: return '- x³';
                default: return `${a}x³`
            }
        }
        function lowerTerm(t: number, order: number): string{
            if(t === 0) return '';
            let coeff: string;
            switch (t) {
                case  1: coeff = ' + '; break;
                case -1: coeff = ' - '; break;
                default: coeff = t > 0 ? ` + ${t}` : ` - ${-t}`;
            }

            switch (order) {
                case 2: return coeff + 'x²';
                case 1: return coeff + 'x';
                default: return '';
            }
        }
        function constTerm(d: number): string {
            if(d === 0)    return '';
            else if(d > 0) return ` + ${d}`;
            else           return ` - ${-d}`;
        }
    } 

    /**
     * Return new CubicEquation instance *ax³ + bx² + cx + d = 0*.
     */
    static new(a = 1, b = 0, c = 0, d = 0): CubicEquation{
        if(a === 1 && b === 0)
            return new DepressedCubicEquation(c, d);
        else
            return new GeneralCubicEquation(a, b, c, d);
    }

    /**
     * Return new CubicEquation instance *x³ + px + q = 0*.
     */
    static depressed(p: number, q: number): CubicEquation {
        return new DepressedCubicEquation(p, q);
    }

    /**
     * Return new CubicEquation instance *a(x - x0)(x - x1)(x - x2) = 0*.
     */
    static fromRoots(x0: number, x1: number, x2: number, a = 1): CubicEquation {
        const b = -a * (x0 + x1 + x2),
              c = a * (x0*x1 + x1*x2 + x2*x0),
              d = -a * x0 * x1 * x2;
        return GeneralCubicEquation.new(a, b, c, d);
    }
}

/**
 * Cubic equation in the form of *x³ + px + q = 0*.
 */
class DepressedCubicEquation extends CubicEquation {

    constructor(public readonly p: number, public readonly q: number){
        super();
    }

    get a(): number { return 1;}
    get b(): number { return 0;}
    get c(): number { return this.p; }
    get d(): number { return this.q; }

    f(x: number): number {
        return (x * x + this.p) * x + this.q;
    }

    get discriminant(): number {
        return -(4*this.p*this.p*this.p + 27*this.q*this.q);
    }

    depressed(): CubicEquation { return this; }

    realRoots(): number[] {
        const p = this.p, q = this.q, disc = this.discriminant;

        if(p === 0){  // This case is actually included in disc < 0
            return [Math.cbrt(-q)];

        }else if(q === 0){
            if(p >= 0) return [0];
            const r = Math.sqrt(-p);
            return [-r, 0, r];

        }else if(disc === 0){
            const r = Math.cbrt(q/2)
            return [-2*r,  r];

        }else if(disc < 0){
            const w = Math.cbrt(-q/2 + Math.sqrt(-disc/108));
            // the following w is needed when the above p === 0 case is removed
            // const w = q > 0 ? Math.cbrt(-q/2 - Math.sqrt(-disc/108)):
            //                   Math.cbrt(-q/2 + Math.sqrt(-disc/108));
            return [w - p/(3*w)];

        }else{
            const r = 2 * Math.sqrt(-p/3),
                  t = Math.acos(3*q / (2*p * Math.sqrt(-p/3))),
                  x1 = r * Math.cos( t                / 3),
                  x2 = r * Math.cos((t + 2 * Math.PI) / 3),
                  x3 = r * Math.cos((t + 4 * Math.PI) / 3);
            return [x1, x2, x3];
        }
    }

    // complexRoots(): Complex[] {
    //     throw new Error("Method not implemented.");
    // }
}

/**
 * Cubic equation in the form of *ax³ + bx² + cx + d = 0*.
 */
class GeneralCubicEquation extends CubicEquation{

    constructor(public readonly a: number,
                public readonly b: number,
                public readonly c: number,
                public readonly d: number){
        super();
        if(a === 0) throw new Error('The coefficient of x^3 must not be zero');
    }

    get p(): number {
        return this.c / this.a - this.b * this.b / (3 * this.a * this.a);
    }

    get q(): number {
        const b = this.b / this.a,
              c = this.c / this.a,
              d = this.d / this.a;
        return 2*b*b*b/27 - b*c/3 + d;
    }

    f(x: number): number {
        return ((this.a * x + this.b) * x + this.c) * x + this.d
    }

    get discriminant(): number {
        const b = this.b / this.a,
              c = this.c / this.a,
              d = this.d / this.a,

              p = c - b*b/3,
              q = 2*b*b*b/27 - b*c/3 + d;
        return -(4*p*p*p + 27*q*q);
            
    }

    depressed(): CubicEquation {
        const b = this.b/this.a,
              c = this.c/this.a,
              d = this.d/this.a;
        return new DepressedCubicEquation(c - b*b/3, 2*b*b*b/27 - b*c/3 + d);
    }

    /** 
     * Ref: 『Javaによるアルゴリズム事典』3次方程式 (cubic equation) Cardano.java
     */
    realRoots(): number[] {
        // const b = this.b / (3 * this.a),
        //       c = this.c / this.a,
        //       d = this.d / this.a,
              
        //       p = b * b - c / 3,
        //       q = (b * (c - 2 * b * b) - d) / 2,
              
        //       delta = q * q - p * p * p;

        // if(delta === 0){
        //     const r = Math.cbrt(q);
        //     return [2 * r - b, -r - b];

        // }else if(delta > 0){
        //     const a3 = q > 0 ? Math.cbrt(q + Math.sqrt(delta)):
        //                        Math.cbrt(q - Math.sqrt(delta)),
        //           b3 = p / a3,
        //           x1 = a3 + b3 - b;
        //     return [x1];

        // }else{
        //     const r = 2 * Math.sqrt(p),
        //           t = Math.acos(q / (p * delta)),
        //           x1 = r * Math.cos( t                / 3) - b,
        //           x2 = r * Math.cos((t + 2 * Math.PI) / 3) - b,
        //           x3 = r * Math.cos((t + 4 * Math.PI) / 3) - b;
        //     return [x1, x2, x3];
        // }
        const t = this.b / (3 * this.a);
        return this.depressed().realRoots().map(rt => rt - t);
    }

    // complexRoots(): Complex[] {
    //     const b = this.b / (3 * this.a),
    //           c = this.c / this.a,
    //           d = this.d / this.a,

    //           p = b * b - c / 3,
    //           q = (b * (c - 2 * b * b) - d) / 2,

    //           delta = q * q - p * p * p;

    //     if(delta === 0){
    //         const qCbrt = Math.cbrt(q);
    //         return [new Complex(2 * qCbrt - b, 0), new Complex(-qCbrt - b, 0)];

    //     }else if(delta > 0){
    //         const a3 = q > 0 ? Math.cbrt(q + Math.sqrt(delta)):
    //                            Math.cbrt(q - Math.sqrt(delta)),
    //               b3 = p / a3,
    //               x1 = a3 + b3 - b,
    //               x2 = -0.5 * (a3 + b3) - b,
    //               x3 = Math.abs(a3 - b3) * Math.sqrt(3) / 2;
    //         return [new Complex(x1, 0), new Complex(x2, x3), new Complex(x2, -x3)];

    //     }else{
    //         const aSqrt = Math.sqrt(p);
    //         const t = Math.acos(q / (p * delta)),
    //               aa = aSqrt * 2,
    //               x1 = aa * Math.cos( t                / 3) - b,
    //               x2 = aa * Math.cos((t + 2 * Math.PI) / 3) - b,
    //               x3 = aa * Math.cos((t + 4 * Math.PI) / 3) - b;
    //         return [new Complex(x1, 0), new Complex(x2, 0), new Complex(x3, 0)];
    //     }
    // }
}