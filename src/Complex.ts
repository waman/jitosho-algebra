export class Complex {

    constructor(private readonly x: number, private readonly y: number){}

    re(): number { return this.x; }
    im(): number { return this.y; }
}