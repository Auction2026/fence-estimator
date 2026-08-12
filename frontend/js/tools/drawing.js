/**
 * drawing.js - Site Drawing Tool
 * Fence Depot Estimator
 */

const DrawingTool = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    points: [],
    scale: 10, // pixels per foot

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.bindEvents();
    },

    bindEvents() {
        this.canvas.addEventListener('mousedown', e => this.startDraw(e));
        this.canvas.addEventListener('mousemove', e => this.draw(e));
        this.canvas.addEventListener('mouseup', e => this.endDraw(e));
        this.canvas.addEventListener('dblclick', e => this.closePath(e));
    },

    startDraw(e) {
        const pos = this.getPos(e);
        this.isDrawing = true;
        this.points.push(pos);
        this.render();
    },

    draw(e) {
        if (!this.isDrawing || this.points.length === 0) return;
        this.render();
        const pos = this.getPos(e);
        this.ctx.beginPath();
        const last = this.points[this.points.length - 1];
        this.ctx.moveTo(last.x, last.y);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.setLineDash([5, 5]);
        this.ctx.stroke();
    },

    endDraw(e) {
        const pos = this.getPos(e);
        this.points.push(pos);
        this.render();
    },

    closePath() {
        this.isDrawing = false;
        this.render(true);
    },

    getPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    },

    render(closed = false) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        if (this.points.length < 2) return;

        this.ctx.beginPath();
        this.ctx.moveTo(this.points[0].x, this.points[0].y);
        this.points.forEach(p => this.ctx.lineTo(p.x, p.y));
        if (closed) this.ctx.closePath();
        this.ctx.setLineDash([]);
        this.ctx.strokeStyle = '#0FA89F';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    },

    drawGrid() {
        this.ctx.strokeStyle = '#ECF0F1';
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x < this.canvas.width; x += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    },

    calculateFootage() {
        let total = 0;
        for (let i = 1; i < this.points.length; i++) {
            const dx = this.points[i].x - this.points[i - 1].x;
            const dy = this.points[i].y - this.points[i - 1].y;
            total += Math.sqrt(dx * dx + dy * dy) / this.scale;
        }
        return Math.round(total);
    },

    clear() {
        this.points = [];
        this.isDrawing = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
    }
};
