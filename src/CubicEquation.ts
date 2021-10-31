
/**
 * Ref: 『Javaによるアルゴリズム事典』3次方程式 (cubic equation) Cardano.java
 */
export class CubicEquation {

    constructor(public readonly a: number,
                public readonly b: number,
                public readonly c: number,
                public readonly d: number){
        if(a === 0) throw new Error('The coefficient of x^3 must not be zero');
    }

    /** *(3ac - b²)/3a²* */
    get p(): number {
        return this.c / this.a - this.b * this.b / (3 * this.a * this.a);
    }

    /** *(2b³ - 9abc + 27a²d)/27a³* */
    get q(): number {
        const b = this.b / this.a,
              c = this.c / this.a,
              d = this.d / this.a;
        return 2*b*b*b/27 - b*c/3 + d;
    }

    /**
     * Return a value of *ax³ + bx² + cx + d* with the specified *x*.
     */
    f(x: number): number {
        return ((this.a * x + this.b) * x + this.c) * x + this.d
    }

    /**
     * Return the discriminant *-(4p³ + 27q²)* = *a⁴(r₁ - r₂)²(r₂ - r₃)²(r₃ - r₁)²*,
     * where *r*s are the three roots of this cubic equation.
     */
    get discriminant(): number {
        const b = this.b / this.a,
              c = this.c / this.a,
              d = this.d / this.a,

              p = c - b*b/3,
              q = 2*b*b*b/27 - b*c/3 + d;
        return -(4*p*p*p + 27*q*q);
            
    }

    /**
     * Return the cubic equation *x³ + px + q = 0*.
     */
    depressed(): CubicEquation {
        const b = this.b/this.a,
              c = this.c/this.a,
              d = this.d/this.a;
        return new CubicEquation(1, 0, c - b*b/3, 2*b*b*b/27 - b*c/3 + d);
    }

    realRoots(): number[] {
        const b = this.b / this.a,
              c = this.c / this.a,
              d = this.d / this.a,
              p = c - b*b/3,
              q = 2*b*b*b/27 - b*c/3 + d;
        return this.solve(p, q, b/3);
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
    }

    /** 
     * Ref: 『Javaによるアルゴリズム事典』3次方程式 (cubic equation) Cardano.java
     */
    private solve(p: number, q: number, b: number): number[] {
        const disc = -(4*p*p*p + 27*q*q);
    
        if(disc === 0){
            if(q === 0) return [-b];
            
            const r = Math.cbrt(q/2)
            return [-2*r - b,  r - b];
    
        }else if(disc < 0){
            const a3 = q > 0 ? Math.cbrt(-q/2 - Math.sqrt(-disc/108)):
                               Math.cbrt(-q/2 + Math.sqrt(-disc/108));
            return [a3 - p/(3*a3) - b];
    
        }else{
            const r = 2 * Math.sqrt(-p/3),
                  t = Math.acos(3*q / (2*p * Math.sqrt(-p/3))),
                  x1 = r * Math.cos( t                / 3),
                  x2 = r * Math.cos((t + 2 * Math.PI) / 3),
                  x3 = r * Math.cos((t + 4 * Math.PI) / 3);
            return [x1 - b, x2 - b, x3 - b];
        }
    }

    complexRoots<C>(complexFactory: (x: number, y: number) => C){
        const b = this.b / this.a,
              c = this.c / this.a,
              d = this.d / this.a,
              p = c - b*b/3,
              q = 2*b*b*b/27 - b*c/3 + d;
        return this.solveInComplex(p, q, b/3, complexFactory);
    }

    /** 
     * Ref: 『Javaによるアルゴリズム事典』3次方程式 (cubic equation) Cardano.java
     */
    private solveInComplex<C>(
            p: number, q: number, b: number,
            complexFactory: (x: number, y: number) => C): C[] {
        const disc = -(4*p*p*p + 27*q*q);
    
        if(disc === 0){
            if(q === 0) return [complexFactory(-b, 0)];
            
            const r = Math.cbrt(q/2)
            return [complexFactory(-2*r - b, 0),  complexFactory(r - b, 0)];
    
        }else if(disc < 0){
            const a3 = q > 0 ? Math.cbrt(-q/2 - Math.sqrt(-disc/108)):
                              Math.cbrt(-q/2 + Math.sqrt(-disc/108)),
                  b3 = -p/(3*a3),
                  x1 = a3 + b3,
                  x2 = -x1 / 2 - b,
                  x3 = Math.abs(a3 - b3) * Math.sqrt(3) / 2;
            return [complexFactory(x1 - b, 0), complexFactory(x2, x3), complexFactory(x2, -x3)];
    
        }else{
            const r = 2 * Math.sqrt(-p/3),
                  t = Math.acos(3*q / (2*p * Math.sqrt(-p/3))),
                  x1 = r * Math.cos( t                / 3),
                  x2 = r * Math.cos((t + 2 * Math.PI) / 3),
                  x3 = r * Math.cos((t + 4 * Math.PI) / 3);
            return [complexFactory(x1 - b, 0), complexFactory(x2 - b, 0), complexFactory(x3 - b, 0)];
        }
    }

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
     * Return new CubicEquation instance *x³ + px + q = 0*.
     */
    static depressed(p: number, q: number): CubicEquation {
        return new CubicEquation(1, 0, p, q);
    }

    /**
     * Return new CubicEquation instance *a(x - x0)(x - x1)(x - x2) = 0*.
     */
    static fromRoots(x0: number, x1: number, x2: number, a = 1): CubicEquation {
        const b = -a * (x0 + x1 + x2),
              c = a * (x0*x1 + x1*x2 + x2*x0),
              d = -a * x0 * x1 * x2;
        return new CubicEquation(a, b, c, d);
    }
}

const tupleComplexFactory: (x: number, y: number) => [number, number] = (x, y) => {
    return [x, y];
}