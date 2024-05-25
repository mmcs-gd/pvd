export class DisjointSet {
    constructor(size) {
        this.root = new Array(size).fill().map((_, index) => index);
        this.rank = new Array(size).fill(0);
    }

    find(x) {
        if (x === this.root[x]) {
            return x;
        }
        return this.root[x] = this.find(this.root[x]);
    }

    union(x, y) {
        let rootX = this.find(x);
        let rootY = this.find(y);

        if (rootX !== rootY) {
            if (this.rank[rootX] > this.rank[rootY]) {
                this.root[rootY] = rootX;
            } else if (this.rank[rootX] < this.rank[rootY]) {
                this.root[rootX] = rootY;
            } else {
                this.root[rootY] = rootX;
                this.rank[rootX] += 1;
            }
        }
    }

    connected(x, y) {
        return this.find(x) === this.find(y);
    }
}