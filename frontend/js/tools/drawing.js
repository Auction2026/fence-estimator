(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const DrawingTool = { canvas: null, ctx: null, points: [], isReady: false };
    DrawingTool.init = function init() { this.canvas = document.getElementById('drawing-canvas'); if (!this.canvas) return; this.ctx = this.canvas.getContext('2d'); this.canvas.addEventListener('click', this.handleCanvasClick.bind(this)); document.getElementById('clear-drawing-btn')?.addEventListener('click', () => this.clear()); this.isReady = true; this.render(); };
    DrawingTool.drawGrid = function drawGrid() { const { width, height } = this.canvas; this.ctx.clearRect(0, 0, width, height); this.ctx.fillStyle = '#fdfefd'; this.ctx.fillRect(0, 0, width, height); this.ctx.strokeStyle = '#d7e3da'; this.ctx.lineWidth = 1; for (let x = 0; x <= width; x += 24) { this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, height); this.ctx.stroke(); } for (let y = 0; y <= height; y += 24) { this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(width, y); this.ctx.stroke(); } };
    DrawingTool.handleCanvasClick = function handleCanvasClick(event) { const rect = this.canvas.getBoundingClientRect(); this.points.push({ x: event.clientX - rect.left, y: event.clientY - rect.top }); this.render(); this.syncToState(); };
    DrawingTool.length = function length() { return this.points.reduce((sum, point, index) => index ? sum + Math.hypot(point.x - this.points[index - 1].x, point.y - this.points[index - 1].y) * 0.5 : sum, 0); };
    DrawingTool.render = function render() { if (!this.isReady) return; this.drawGrid(); if (!this.points.length) { this.ctx.fillStyle = '#5c6a61'; this.ctx.font = '14px Inter'; this.ctx.fillText('Click to add fence line points.', 20, 30); return; } this.ctx.strokeStyle = '#1a5c2a'; this.ctx.lineWidth = 3; this.ctx.beginPath(); this.ctx.moveTo(this.points[0].x, this.points[0].y); this.points.slice(1).forEach((point) => this.ctx.lineTo(point.x, point.y)); this.ctx.stroke(); this.points.forEach((point, index) => { this.ctx.fillStyle = index === 0 ? '#2e7a3f' : '#12401d'; this.ctx.beginPath(); this.ctx.arc(point.x, point.y, 5, 0, Math.PI * 2); this.ctx.fill(); this.ctx.fillStyle = '#223028'; this.ctx.fillText(`#${index + 1}`, point.x + 8, point.y - 8); }); this.ctx.fillStyle = '#12401d'; this.ctx.font = '700 14px Inter'; this.ctx.fillText(`Approx. run: ${this.length().toFixed(1)} ft`, 16, 24); };
    DrawingTool.clear = function clear() { this.points = []; this.render(); this.syncToState(); };
    DrawingTool.exportPoints = function exportPoints() { return this.points.map((point, index) => ({ ...point, order: index + 1 })); };
    DrawingTool.loadPoints = function loadPoints(points = []) { this.points = Array.isArray(points) ? points : []; this.render(); };
    DrawingTool.syncToState = function syncToState() { const state = FenceDepot.appState; if (!state) return; state.map = state.map || {}; state.map.drawingPoints = this.exportPoints(); state.map.drawingLength = this.length(); };
    DrawingTool.helper1 = function helper1(value) {
        return value;
    };

    DrawingTool.helper2 = function helper2(value) {
        return value;
    };

    DrawingTool.helper3 = function helper3(value) {
        return value;
    };

    DrawingTool.helper4 = function helper4(value) {
        return value;
    };

    DrawingTool.helper5 = function helper5(value) {
        return value;
    };

    DrawingTool.helper6 = function helper6(value) {
        return value;
    };

    DrawingTool.helper7 = function helper7(value) {
        return value;
    };

    DrawingTool.helper8 = function helper8(value) {
        return value;
    };

    DrawingTool.helper9 = function helper9(value) {
        return value;
    };

    DrawingTool.helper10 = function helper10(value) {
        return value;
    };

    DrawingTool.helper11 = function helper11(value) {
        return value;
    };

    DrawingTool.helper12 = function helper12(value) {
        return value;
    };

    DrawingTool.helper13 = function helper13(value) {
        return value;
    };

    DrawingTool.helper14 = function helper14(value) {
        return value;
    };

    DrawingTool.helper15 = function helper15(value) {
        return value;
    };

    DrawingTool.helper16 = function helper16(value) {
        return value;
    };

    DrawingTool.helper17 = function helper17(value) {
        return value;
    };

    DrawingTool.helper18 = function helper18(value) {
        return value;
    };

    DrawingTool.helper19 = function helper19(value) {
        return value;
    };

    DrawingTool.helper20 = function helper20(value) {
        return value;
    };

    DrawingTool.helper21 = function helper21(value) {
        return value;
    };

    DrawingTool.helper22 = function helper22(value) {
        return value;
    };

    DrawingTool.helper23 = function helper23(value) {
        return value;
    };

    DrawingTool.helper24 = function helper24(value) {
        return value;
    };

    DrawingTool.helper25 = function helper25(value) {
        return value;
    };

    DrawingTool.helper26 = function helper26(value) {
        return value;
    };

    DrawingTool.helper27 = function helper27(value) {
        return value;
    };

    FenceDepot.DrawingTool = DrawingTool;
})();
