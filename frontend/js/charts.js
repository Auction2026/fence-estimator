const DEFAULT_PALETTE = ['#2e7d32', '#43a047', '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9'];

function ensureChartGlobal() {
  return typeof window !== 'undefined' ? window.Chart : undefined;
}

export class ChartManager {
  constructor() {
    this.instances = new Map();
    this.libraryPromise = null;
  }

  async loadLibrary() {
    if (ensureChartGlobal()) return ensureChartGlobal();
    if (this.libraryPromise) return this.libraryPromise;
    this.libraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.async = true;
      script.onload = () => resolve(window.Chart);
      script.onerror = () => reject(new Error('Unable to load Chart.js.'));
      document.head.appendChild(script);
    });
    return this.libraryPromise;
  }

  destroy(id) {
    const instance = this.instances.get(id);
    if (instance) {
      instance.destroy();
      this.instances.delete(id);
    }
  }

  destroyAll() {
    [...this.instances.keys()].forEach((id) => this.destroy(id));
  }

  async render(id, canvas, config) {
    if (!(canvas instanceof HTMLCanvasElement)) return null;
    const Chart = await this.loadLibrary();
    this.destroy(id);
    const instance = new Chart(canvas.getContext('2d'), config);
    this.instances.set(id, instance);
    return instance;
  }

  async renderRevenueByMonth(canvas, estimates = []) {
    const grouped = groupCurrencyByMonth(estimates, (estimate) => estimate.total || estimate.pricing?.total || 0);
    return this.render('revenue-by-month', canvas, {
      type: 'bar',
      data: { labels: grouped.labels, datasets: [{ label: 'Revenue', data: grouped.values, borderRadius: 10, backgroundColor: DEFAULT_PALETTE[0] }] },
      options: buildBaseOptions({ currency: true }),
    });
  }

  async renderJobsByType(canvas, estimates = []) {
    const totals = aggregateBy(estimates, (estimate) => estimate.fenceType || estimate.specifications?.fenceType || 'Unknown');
    return this.render('jobs-by-type', canvas, {
      type: 'doughnut',
      data: { labels: Object.keys(totals), datasets: [{ data: Object.values(totals), backgroundColor: DEFAULT_PALETTE, borderWidth: 0 }] },
      options: buildBaseOptions(),
    });
  }

  async renderMaterialCosts(canvas, estimates = []) {
    const materials = estimates.map((estimate) => ({
      label: estimate.customerName || estimate.projectName || 'Project',
      value: estimate.materialsSubtotal || estimate.pricing?.materialsSubtotal || estimate.materials?.totals?.total || 0,
    })).slice(0, 8);
    return this.render('material-costs', canvas, {
      type: 'line',
      data: {
        labels: materials.map((item) => item.label),
        datasets: [{ label: 'Material Costs', data: materials.map((item) => item.value), borderColor: DEFAULT_PALETTE[1], backgroundColor: 'rgba(67, 160, 71, 0.18)', fill: true, tension: 0.3 }],
      },
      options: buildBaseOptions({ currency: true }),
    });
  }

  async renderCloseRate(canvas, projects = []) {
    const statuses = aggregateBy(projects, (project) => project.status || 'unknown');
    return this.render('close-rate', canvas, {
      type: 'polarArea',
      data: { labels: Object.keys(statuses), datasets: [{ data: Object.values(statuses), backgroundColor: DEFAULT_PALETTE, borderWidth: 0 }] },
      options: buildBaseOptions(),
    });
  }

  async renderSupplierSpend(canvas, estimates = []) {
    const totals = {};
    estimates.forEach((estimate) => {
      const lineItems = estimate.materials?.lineItems || estimate.lineItems || [];
      lineItems.forEach((item) => {
        const supplier = item.supplier || 'Mixed';
        totals[supplier] = (totals[supplier] || 0) + (item.extendedCost || 0);
      });
    });
    return this.render('supplier-spend', canvas, {
      type: 'radar',
      data: { labels: Object.keys(totals), datasets: [{ label: 'Spend by Supplier', data: Object.values(totals), borderColor: DEFAULT_PALETTE[2], backgroundColor: 'rgba(102, 187, 106, 0.16)' }] },
      options: buildBaseOptions({ currency: true }),
    });
  }

  async renderEstimateMargin(canvas, estimates = []) {
    const labels = estimates.slice(0, 10).map((estimate) => estimate.customerName || estimate.projectId || 'Estimate');
    const values = estimates.slice(0, 10).map((estimate) => estimate.pricing?.marginPercent || estimate.marginPercent || 0);
    return this.render('estimate-margins', canvas, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Margin %', data: values, backgroundColor: DEFAULT_PALETTE[3], borderRadius: 8 }] },
      options: buildBaseOptions(),
    });
  }

  async renderAll(targets = {}, data = {}) {
    const tasks = [];
    if (targets.revenue && data.estimates) tasks.push(this.renderRevenueByMonth(targets.revenue, data.estimates));
    if (targets.jobsByType && data.estimates) tasks.push(this.renderJobsByType(targets.jobsByType, data.estimates));
    if (targets.materialCosts && data.estimates) tasks.push(this.renderMaterialCosts(targets.materialCosts, data.estimates));
    if (targets.closeRate && data.projects) tasks.push(this.renderCloseRate(targets.closeRate, data.projects));
    if (targets.supplierSpend && data.estimates) tasks.push(this.renderSupplierSpend(targets.supplierSpend, data.estimates));
    if (targets.margin && data.estimates) tasks.push(this.renderEstimateMargin(targets.margin, data.estimates));
    return Promise.all(tasks);
  }
}

export function aggregateBy(items = [], selector) {
  return items.reduce((result, item) => {
    const key = selector(item);
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});
}

export function groupCurrencyByMonth(items = [], selector) {
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
  const seed = new Map();
  items.forEach((item) => {
    const dateValue = item.createdAt || item.updatedAt || item.generatedAt || new Date().toISOString();
    const date = new Date(dateValue);
    const label = Number.isNaN(date.getTime()) ? 'Unknown' : formatter.format(date);
    const amount = Number(selector(item) || 0);
    seed.set(label, (seed.get(label) || 0) + amount);
  });
  return { labels: [...seed.keys()], values: [...seed.values()].map((value) => Math.round(value * 100) / 100) };
}

export function buildBaseOptions({ currency = false } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } },
      tooltip: {
        callbacks: currency ? {
          label(context) {
            const value = context.raw || 0;
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
          },
        } : {},
      },
    },
    scales: currency ? {
      y: {
        ticks: { callback(value) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value); } },
        grid: { color: 'rgba(46, 125, 50, 0.08)' },
      },
      x: { grid: { display: false } },
    } : undefined,
  };
}

export function buildAnalyticsSummary(estimates = [], projects = []) {
  const totalRevenue = estimates.reduce((sum, estimate) => sum + Number(estimate.total || estimate.pricing?.total || 0), 0);
  const totalMaterialCost = estimates.reduce((sum, estimate) => sum + Number(estimate.materialsSubtotal || estimate.pricing?.materialsSubtotal || estimate.materials?.totals?.total || 0), 0);
  const wonProjects = projects.filter((project) => ['won', 'active', 'approved', 'contract'].includes(String(project.status || '').toLowerCase())).length;
  const closeRate = projects.length ? wonProjects / projects.length : 0;
  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalMaterialCost: Math.round(totalMaterialCost * 100) / 100,
    closeRate,
    projectCount: projects.length,
    estimateCount: estimates.length,
    averageTicket: estimates.length ? Math.round((totalRevenue / estimates.length) * 100) / 100 : 0,
  };
}

export function normalizeChartTargetMap(targets = {}) {
  return {
    revenue: targets.revenue || targets.monthlyRevenue,
    jobsByType: targets.jobsByType || targets.jobTypes,
    materialCosts: targets.materialCosts || targets.materialSpend,
    closeRate: targets.closeRate || targets.pipelineStatus,
    supplierSpend: targets.supplierSpend || targets.vendorSpend,
    margin: targets.margin || targets.margins,
  };
}

export const chartManager = new ChartManager();

if (typeof window !== 'undefined') {
  window.FenceEstimatorCharts = chartManager;
}
