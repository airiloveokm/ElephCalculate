//デイリー用のランダムシート変数
class Random {
    constructor(seed = 46511201) {
      this.x = 123123123;
      this.y = 557557557;
      this.z = 168385443;
      this.w = seed;
    }
    
    // XorShift
    next() {
      let t;
   
      t = this.x ^ (this.x << 11);
      this.x = this.y; this.y = this.z; this.z = this.w;
      return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8)); 
    }

    nextFromRange(min, max)
    {
        const r = Math.abs(this.next());
        return min + (r % (max + 1 - min));
    }
  }